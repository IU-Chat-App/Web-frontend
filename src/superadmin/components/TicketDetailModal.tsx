import { FormEvent, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Modal from './Modal';
import { CategoryBadge, PriorityBadge, StatusBadge } from './TicketBadges';
import reportService from '../services/reportService';
import { formatDateTime, initials, timeAgo } from '../utils/format';
import type {
  SupportTicket,
  SupportTicketDetail,
  TicketPriority,
  TicketReply,
  TicketStatus,
} from '../types';

const STATUS_OPTIONS: TicketStatus[] = ['open', 'in_progress', 'resolved', 'closed'];
const PRIORITY_OPTIONS: TicketPriority[] = ['low', 'medium', 'high', 'urgent'];

interface Props {
  ticket: SupportTicket | null;
  onClose: () => void;
  onUpdated?: (t: SupportTicket) => void;
}

export default function TicketDetailModal({ ticket, onClose, onUpdated }: Props) {
  const [detail, setDetail] = useState<SupportTicketDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!ticket) {
      setDetail(null);
      setReply('');
      return;
    }
    let cancelled = false;
    setLoading(true);
    reportService
      .getTicket(ticket.id)
      .then((d) => {
        if (!cancelled) setDetail(d);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [ticket]);

  async function changeStatus(next: TicketStatus) {
    if (!detail) return;
    setBusy(true);
    try {
      const updated = await reportService.setTicketStatus(detail.id, next);
      const merged = { ...detail, ...updated, status: next };
      setDetail(merged);
      onUpdated?.(merged);
      toast.success(`Status set to ${next.replace('_', ' ')}`);
    } catch (e) {
      toast.error((e as { message?: string }).message ?? 'Failed to update status');
    } finally {
      setBusy(false);
    }
  }

  async function changePriority(next: TicketPriority) {
    if (!detail) return;
    setBusy(true);
    try {
      const updated = await reportService.setTicketPriority(detail.id, next);
      const merged = { ...detail, ...updated, priority: next };
      setDetail(merged);
      onUpdated?.(merged);
      toast.success(`Priority set to ${next}`);
    } catch (e) {
      toast.error((e as { message?: string }).message ?? 'Failed to update priority');
    } finally {
      setBusy(false);
    }
  }

  async function markResolved() {
    await changeStatus('resolved');
  }

  async function submitReply(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!detail) return;
    const trimmed = reply.trim();
    if (!trimmed) {
      toast.error('Reply cannot be empty');
      return;
    }
    setSending(true);
    try {
      const newReply: TicketReply = await reportService.replyTicket(detail.id, trimmed);
      setDetail({
        ...detail,
        replies: [...detail.replies, newReply],
        repliesCount: detail.repliesCount + 1,
        updatedAt: newReply.createdAt,
        status: detail.status === 'open' ? 'in_progress' : detail.status,
      });
      onUpdated?.({
        ...detail,
        repliesCount: detail.repliesCount + 1,
        updatedAt: newReply.createdAt,
        status: detail.status === 'open' ? 'in_progress' : detail.status,
      });
      setReply('');
      toast.success('Reply sent');
    } catch (e) {
      toast.error((e as { message?: string }).message ?? 'Failed to send reply');
    } finally {
      setSending(false);
    }
  }

  if (!ticket) return null;

  return (
    <Modal
      open={!!ticket}
      onClose={onClose}
      size="xl"
      title={detail?.subject ?? ticket.subject}
      description={`Ticket #${ticket.id} · opened ${formatDateTime(ticket.createdAt)}`}
    >
      {loading || !detail ? (
        <div className="py-10 text-center text-sm text-text-light dark:text-slate-400">
          <span className="inline-flex items-center gap-2">
            <span className="w-4 h-4 rounded-full border-2 border-primary-blue border-t-transparent animate-spin" />
            Loading ticket…
          </span>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Meta + actions */}
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={detail.status} />
            <PriorityBadge priority={detail.priority} />
            <CategoryBadge category={detail.category} />
            <span className="text-xs text-text-light dark:text-slate-400 ml-auto">
              Updated {timeAgo(detail.updatedAt)}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2">
              <label className="text-xs font-medium text-text-light dark:text-slate-400">
                Status
              </label>
              <select
                value={detail.status}
                disabled={busy}
                onChange={(e) => changeStatus(e.target.value as TicketStatus)}
                className="px-2.5 py-1.5 text-xs border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-900 text-text-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-blue/30 focus:border-primary-blue disabled:opacity-60"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s.replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>
            <div className="inline-flex items-center gap-2">
              <label className="text-xs font-medium text-text-light dark:text-slate-400">
                Priority
              </label>
              <select
                value={detail.priority}
                disabled={busy}
                onChange={(e) => changePriority(e.target.value as TicketPriority)}
                className="px-2.5 py-1.5 text-xs border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-900 text-text-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-blue/30 focus:border-primary-blue disabled:opacity-60"
              >
                {PRIORITY_OPTIONS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="button"
              onClick={markResolved}
              disabled={busy || detail.status === 'resolved'}
              className="ml-auto px-3 py-1.5 rounded-md text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              Mark resolved
            </button>
          </div>

          {/* User info */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-blue to-purple text-white flex items-center justify-center text-xs font-bold">
              {initials(detail.user.name)}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-text-dark dark:text-white text-sm truncate">
                {detail.user.name}
              </p>
              <p className="text-xs text-text-light dark:text-slate-400 truncate">
                User · #{detail.user.id}
              </p>
            </div>
            {detail.assignedTo && (
              <div className="ml-auto text-right">
                <p className="text-xs text-text-light dark:text-slate-400">Assigned</p>
                <p className="text-sm font-medium text-text-dark dark:text-white">
                  {detail.assignedTo.name}
                </p>
              </div>
            )}
          </div>

          {/* Conversation */}
          <div className="space-y-3 max-h-[40vh] overflow-y-auto pr-1">
            {detail.replies.map((r) => {
              const isAdmin = r.author.role === 'admin';
              return (
                <div
                  key={r.id}
                  className={`flex items-start gap-3 ${isAdmin ? 'flex-row-reverse text-right' : ''}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                      isAdmin
                        ? 'bg-gradient-to-br from-emerald-500 to-emerald-700'
                        : 'bg-gradient-to-br from-primary-blue to-purple'
                    }`}
                  >
                    {initials(r.author.name)}
                  </div>
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                      isAdmin
                        ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-900 dark:text-emerald-100 border border-emerald-200 dark:border-emerald-500/30'
                        : 'bg-slate-100 dark:bg-slate-800 text-text-dark dark:text-slate-100 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <p className="font-semibold text-xs mb-0.5">
                      {r.author.name}
                      {isAdmin && <span className="ml-2 font-normal opacity-70">Admin</span>}
                    </p>
                    <p className="whitespace-pre-wrap">{r.body}</p>
                    <p className="text-[10px] mt-1 opacity-70">{timeAgo(r.createdAt)}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Reply composer */}
          {detail.status !== 'closed' && (
            <form
              onSubmit={submitReply}
              className="border-t border-slate-200 dark:border-slate-800 pt-4 space-y-2"
            >
              <label
                htmlFor="ticket-reply"
                className="block text-sm font-medium text-text-dark dark:text-white"
              >
                Reply
              </label>
              <textarea
                id="ticket-reply"
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                rows={3}
                placeholder="Type your reply…"
                maxLength={2000}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-text-dark dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-blue/30 focus:border-primary-blue resize-none"
              />
              <div className="flex items-center justify-between">
                <p className="text-xs text-text-light dark:text-slate-500">{reply.length}/2000</p>
                <button
                  type="submit"
                  disabled={sending || !reply.trim()}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-primary-blue to-purple text-white text-sm font-semibold shadow-glow hover:shadow-glow-lg disabled:opacity-50"
                >
                  {sending ? 'Sending…' : 'Send reply'}
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </Modal>
  );
}
