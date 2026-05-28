import { formatDate, formatDateTime, initials, timeAgo } from '../utils/format';
import Modal from './Modal';
import type { AppUser } from '../types';

interface Props {
  user: AppUser | null;
  onClose: () => void;
  onBlock?: (u: AppUser) => void;
  onUnblock?: (u: AppUser) => void;
  onDelete?: (u: AppUser) => void;
}

export default function UserProfileModal({
  user,
  onClose,
  onBlock,
  onUnblock,
  onDelete,
}: Props) {
  if (!user) return null;

  const statusCls =
    user.status === 'active'
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/30'
      : user.status === 'blocked'
      ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:border-rose-500/30'
      : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/30';

  return (
    <Modal
      open
      onClose={onClose}
      size="lg"
      hideCloseButton
    >
      <div className="-mx-6 -mt-5 relative h-28 bg-gradient-to-br from-primary-blue to-purple rounded-t-2xl">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 p-1.5 rounded-lg text-white/90 hover:bg-white/10"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="-mt-12">
        <div className="flex items-end gap-4">
          <div className="w-20 h-20 rounded-2xl ring-4 ring-white dark:ring-slate-900 bg-gradient-to-br from-primary-blue to-purple text-white flex items-center justify-center font-bold text-2xl shadow-soft">
            {initials(user.name)}
          </div>
          <div className="flex-1 min-w-0 pb-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-display font-bold text-xl text-text-dark dark:text-white truncate">
                {user.name}
              </h3>
              {user.isOnline && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Online
                </span>
              )}
            </div>
            {user.username && (
              <p className="text-sm text-text-light dark:text-slate-400">@{user.username}</p>
            )}
          </div>
        </div>

        {user.bio && (
          <p className="mt-4 text-sm text-text-dark dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 rounded-lg p-3">
            {user.bio}
          </p>
        )}

        <dl className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <Field label="Phone" value={user.phone} />
          <Field label="Email" value={user.email ?? '—'} />
          <Field label="Country" value={user.country ?? '—'} />
          <Field
            label="Status"
            value={
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${statusCls}`}>
                {user.status}
              </span>
            }
          />
          <Field label="Joined" value={formatDate(user.createdAt)} />
          <Field
            label="Last seen"
            value={
              user.isOnline
                ? 'Online now'
                : `${timeAgo(user.lastSeen)}${user.lastSeen ? ` (${formatDateTime(user.lastSeen)})` : ''}`
            }
          />
          <Field label="Total messages" value={(user.totalMessages ?? 0).toLocaleString()} />
          <Field label="Total calls" value={(user.totalCalls ?? 0).toLocaleString()} />
        </dl>

        <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2 flex-wrap">
          {user.status === 'blocked'
            ? onUnblock && (
                <button
                  type="button"
                  onClick={() => onUnblock(user)}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium border border-emerald-300 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-500/10"
                >
                  Unblock
                </button>
              )
            : onBlock && (
                <button
                  type="button"
                  onClick={() => onBlock(user)}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium border border-amber-300 text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-500/10"
                >
                  Block
                </button>
              )}
          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(user)}
              className="px-3 py-1.5 rounded-lg text-sm font-medium border border-rose-300 text-rose-700 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-500/10"
            >
              Delete
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg text-sm font-medium bg-slate-100 dark:bg-slate-800 text-text-dark dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-text-light dark:text-slate-400">{label}</dt>
      <dd className="mt-0.5 text-text-dark dark:text-slate-200">{value}</dd>
    </div>
  );
}
