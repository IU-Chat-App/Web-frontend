import { useEffect, useRef, useState } from 'react';
import { useNotifications } from '../hooks/useNotifications';
import { timeAgo } from '../utils/format';
import type { NotificationSeverity } from '../types';

const dotMap: Record<NotificationSeverity, string> = {
  info: 'bg-sky-500',
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  error: 'bg-rose-500',
};

export default function NotificationsPopover() {
  const { notifications, unreadCount, markAllRead, markRead, clear } = useNotifications();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  function toggle() {
    setOpen((s) => {
      const next = !s;
      if (next && unreadCount > 0) setTimeout(markAllRead, 200);
      return next;
    });
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={toggle}
        aria-label="Notifications"
        className="relative p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white dark:ring-slate-900">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-soft-lg z-50 overflow-hidden">
          <div className="px-4 py-3 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
            <h4 className="font-display font-semibold text-text-dark dark:text-white">
              Notifications
            </h4>
            {notifications.length > 0 && (
              <button
                type="button"
                onClick={clear}
                className="text-xs font-medium text-text-light dark:text-slate-400 hover:text-rose-600"
              >
                Clear all
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 && (
              <div className="px-4 py-10 text-center text-sm text-text-light dark:text-slate-400">
                You're all caught up.
              </div>
            )}
            {notifications.map((n) => (
              <button
                key={n.id}
                type="button"
                onClick={() => markRead(n.id)}
                className={`w-full text-left px-4 py-3 flex items-start gap-3 border-b border-slate-100 dark:border-slate-800 last:border-b-0 hover:bg-slate-50 dark:hover:bg-slate-800 ${
                  n.read ? 'opacity-70' : ''
                }`}
              >
                <span className={`mt-1.5 w-2 h-2 rounded-full ${dotMap[n.severity]} flex-shrink-0`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-text-dark dark:text-white truncate">
                    {n.title}
                  </p>
                  <p className="text-xs text-text-light dark:text-slate-400 mt-0.5 line-clamp-2">
                    {n.message}
                  </p>
                  <p className="text-[11px] text-text-light dark:text-slate-500 mt-1">
                    {timeAgo(n.createdAt)}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
