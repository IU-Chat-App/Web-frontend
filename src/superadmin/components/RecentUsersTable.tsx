import { Link } from 'react-router-dom';
import { initials, timeAgo } from '../utils/format';
import { SkeletonRows } from './LoadingSkeleton';
import type { AppUser } from '../types';

interface Props {
  users: AppUser[];
  loading?: boolean;
}

export default function RecentUsersTable({ users, loading }: Props) {
  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-soft">
      <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div>
          <h3 className="font-display font-semibold text-text-dark dark:text-white">
            Recent Users
          </h3>
          <p className="text-xs text-text-light dark:text-slate-400 mt-0.5">
            Latest registrations.
          </p>
        </div>
        <Link
          to="/admin/users"
          className="text-xs font-medium text-primary-blue hover:text-dark-blue"
        >
          View all →
        </Link>
      </div>

      <div className="p-3">
        {loading ? (
          <SkeletonRows count={5} />
        ) : users.length === 0 ? (
          <p className="px-2 py-8 text-center text-sm text-text-light dark:text-slate-400">
            No users yet.
          </p>
        ) : (
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {users.map((u) => (
              <li key={u.id} className="px-2 py-2.5 flex items-center gap-3">
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-blue to-purple text-white flex items-center justify-center text-xs font-bold">
                    {initials(u.name)}
                  </div>
                  <span
                    className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ring-2 ring-white dark:ring-slate-900 ${
                      u.isOnline ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'
                    }`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-text-dark dark:text-white truncate">
                    {u.name}
                  </p>
                  <p className="text-xs text-text-light dark:text-slate-400 truncate">{u.phone}</p>
                </div>
                <span className="text-xs text-text-light dark:text-slate-500 whitespace-nowrap">
                  {timeAgo(u.createdAt)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
