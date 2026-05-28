import { useCallback, useEffect, useMemo, useState } from 'react';
import reportService from '../services/reportService';
import DataTable, { Column } from '../components/DataTable';
import Pagination from '../components/Pagination';
import SearchBar from '../components/SearchBar';
import TicketDetailModal from '../components/TicketDetailModal';
import { PriorityBadge, StatusBadge, CategoryBadge } from '../components/TicketBadges';
import { useDebounce } from '../hooks/useDebounce';
import { formatDateTime, initials, timeAgo } from '../utils/format';
import type {
  SupportTicket,
  TicketPriority,
  TicketStatus,
} from '../types';

const STATUS_FILTERS: { value: '' | TicketStatus; label: string }[] = [
  { value: '', label: 'All' },
  { value: 'open', label: 'Open' },
  { value: 'in_progress', label: 'In progress' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'closed', label: 'Closed' },
];

const PRIORITY_FILTERS: { value: '' | TicketPriority; label: string }[] = [
  { value: '', label: 'Any priority' },
  { value: 'urgent', label: 'Urgent' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];

/**
 * Support Center page (mounted at /admin/reports). Replaces the
 * earlier abuse-only reports table with a richer ticket-management UI:
 *  - searchable + filterable list
 *  - priority + status badges
 *  - click row to open a detail modal with full conversation, replies,
 *    inline status / priority changes, and "Mark resolved".
 */
export default function Reports() {
  const [data, setData] = useState<SupportTicket[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const [status, setStatus] = useState<'' | TicketStatus>('');
  const [priority, setPriority] = useState<'' | TicketPriority>('');
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<SupportTicket | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await reportService.listTickets({
        page,
        pageSize,
        status,
        priority,
        search: debouncedSearch || undefined,
      });
      setData(res.data);
      setTotal(res.total);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, status, priority, debouncedSearch]);

  useEffect(() => {
    load();
  }, [load]);

  const stats = useMemo(() => {
    const open = data.filter((t) => t.status === 'open').length;
    const inProgress = data.filter((t) => t.status === 'in_progress').length;
    const urgent = data.filter((t) => t.priority === 'urgent').length;
    return { open, inProgress, urgent };
  }, [data]);

  function handleTicketUpdated(updated: SupportTicket) {
    setData((prev) => prev.map((t) => (t.id === updated.id ? { ...t, ...updated } : t)));
  }

  const columns = useMemo<Column<SupportTicket>[]>(
    () => [
      {
        key: 'user',
        header: 'User',
        render: (t) => (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-blue to-purple text-white flex items-center justify-center text-xs font-bold">
              {initials(t.user.name)}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-text-dark dark:text-white truncate">
                {t.user.name}
              </p>
              <p className="text-xs text-text-light dark:text-slate-400">#{t.id}</p>
            </div>
          </div>
        ),
      },
      {
        key: 'subject',
        header: 'Subject',
        render: (t) => (
          <div className="max-w-md">
            <p className="font-semibold text-text-dark dark:text-white flex items-center gap-2">
              {t.unread && <span className="w-1.5 h-1.5 rounded-full bg-primary-blue" />}
              <span className="truncate">{t.subject}</span>
            </p>
            <p className="text-xs text-text-light dark:text-slate-400 truncate">
              {t.description}
            </p>
          </div>
        ),
      },
      {
        key: 'category',
        header: 'Category',
        render: (t) => <CategoryBadge category={t.category} />,
      },
      {
        key: 'priority',
        header: 'Priority',
        render: (t) => <PriorityBadge priority={t.priority} />,
      },
      {
        key: 'status',
        header: 'Status',
        render: (t) => <StatusBadge status={t.status} />,
      },
      {
        key: 'replies',
        header: 'Replies',
        render: (t) => (
          <span className="font-semibold text-text-dark dark:text-white">
            {t.repliesCount}
          </span>
        ),
      },
      {
        key: 'updatedAt',
        header: 'Updated',
        render: (t) => (
          <span title={formatDateTime(t.updatedAt)}>{timeAgo(t.updatedAt)}</span>
        ),
      },
      {
        key: 'actions',
        header: '',
        className: 'text-right',
        render: (t) => (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setSelected(t);
            }}
            className="px-2.5 py-1 rounded-md text-xs font-medium border border-slate-300 dark:border-slate-700 text-text-dark dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            View
          </button>
        ),
      },
    ],
    [],
  );

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold text-text-dark dark:text-white">
            Support Center
          </h2>
          <p className="text-sm text-text-light dark:text-slate-400 mt-1">
            Triage user-raised tickets, reply, change priority, and mark them resolved.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-3 py-1.5 rounded-full text-xs font-medium border border-blue-200 dark:border-blue-500/30 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300">
            {stats.open} open
          </span>
          <span className="px-3 py-1.5 rounded-full text-xs font-medium border border-amber-200 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300">
            {stats.inProgress} in progress
          </span>
          {stats.urgent > 0 && (
            <span className="px-3 py-1.5 rounded-full text-xs font-medium border border-rose-200 dark:border-rose-500/30 bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-300">
              {stats.urgent} urgent
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <SearchBar
          value={search}
          onChange={(v) => {
            setSearch(v);
            setPage(1);
          }}
          placeholder="Search by subject, user, ticket id…"
        />
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value as '' | TicketStatus);
            setPage(1);
          }}
          className="px-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-text-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-blue/30 focus:border-primary-blue"
        >
          {STATUS_FILTERS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        <select
          value={priority}
          onChange={(e) => {
            setPriority(e.target.value as '' | TicketPriority);
            setPage(1);
          }}
          className="px-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-text-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-blue/30 focus:border-primary-blue"
        >
          {PRIORITY_FILTERS.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        rowKey={(t) => t.id}
        onRowClick={(t) => setSelected(t)}
        emptyMessage="No tickets to review."
      />
      <Pagination page={page} pageSize={pageSize} total={total} onChange={setPage} />

      <TicketDetailModal
        ticket={selected}
        onClose={() => setSelected(null)}
        onUpdated={handleTicketUpdated}
      />
    </div>
  );
}
