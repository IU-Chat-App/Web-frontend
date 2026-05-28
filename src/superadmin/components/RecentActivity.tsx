import { ReactNode } from 'react';
import { timeAgo } from '../utils/format';
import type { ActivityItem, ActivityType } from '../types';

const iconClass = 'w-4 h-4';

const ACTIVITY_ICONS: Record<ActivityType, ReactNode> = {
  user_registered: (
    <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zm10-3v6m3-3h-6" />
    </svg>
  ),
  user_online: (
    <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="3" fill="currentColor" />
    </svg>
  ),
  user_blocked: (
    <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="12" r="9" />
      <path strokeLinecap="round" d="M5.6 5.6l12.8 12.8" />
    </svg>
  ),
  message_sent: (
    <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12c0 4.418-4.03 8-9 8a9.96 9.96 0 01-4-.83L3 21l1.83-5A8.97 8.97 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  ),
  call_started: (
    <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.13.96.37 1.9.72 2.8a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.9.35 1.84.59 2.8.72A2 2 0 0122 16.92z" />
    </svg>
  ),
  report_filed: (
    <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 3h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
    </svg>
  ),
  admin_action: (
    <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  group_created: (
    <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.36-1.84M7 20H2v-2a3 3 0 015.36-1.84M12 12a4 4 0 100-8 4 4 0 000 8zm6 0a3 3 0 100-6 3 3 0 000 6zm-12 0a3 3 0 100-6 3 3 0 000 6z" />
    </svg>
  ),
};

const TINT: Record<ActivityType, string> = {
  user_registered: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300',
  user_online: 'bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300',
  user_blocked: 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300',
  message_sent: 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300',
  call_started: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300',
  report_filed: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300',
  admin_action: 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200',
  group_created: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300',
};

interface Props {
  items: ActivityItem[];
  loading?: boolean;
  emptyMessage?: string;
}

export default function RecentActivity({ items, loading, emptyMessage = 'No recent activity.' }: Props) {
  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-soft">
      <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <h3 className="font-display font-semibold text-text-dark dark:text-white">
          Recent Activity
        </h3>
        <span className="flex items-center gap-1.5 text-xs text-text-light dark:text-slate-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Real-time
        </span>
      </div>

      <div className="max-h-[420px] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
        {loading && (
          <div className="px-5 py-10 text-center text-sm text-text-light dark:text-slate-400">
            <span className="inline-flex items-center gap-2">
              <span className="w-4 h-4 rounded-full border-2 border-primary-blue border-t-transparent animate-spin" />
              Loading…
            </span>
          </div>
        )}
        {!loading && items.length === 0 && (
          <div className="px-5 py-10 text-center text-sm text-text-light dark:text-slate-400">
            {emptyMessage}
          </div>
        )}
        {!loading &&
          items.map((item) => (
            <div key={item.id} className="px-5 py-3 flex items-start gap-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  TINT[item.type] ?? TINT.admin_action
                }`}
              >
                {ACTIVITY_ICONS[item.type] ?? ACTIVITY_ICONS.admin_action}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-text-dark dark:text-slate-200">
                  {item.userName && <span className="font-semibold">{item.userName} </span>}
                  {item.message}
                </p>
                <p className="text-xs text-text-light dark:text-slate-500 mt-0.5">
                  {timeAgo(item.createdAt)}
                </p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
