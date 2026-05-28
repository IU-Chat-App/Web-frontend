import type { TicketCategory, TicketPriority, TicketStatus } from '../types';

const PRIORITY_STYLES: Record<TicketPriority, string> = {
  low: 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-700/40 dark:text-slate-200 dark:border-slate-700',
  medium: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-500/10 dark:text-sky-300 dark:border-sky-500/30',
  high: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/30',
  urgent: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:border-rose-500/30',
};

const STATUS_STYLES: Record<TicketStatus, string> = {
  open: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-500/30',
  in_progress: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/30',
  resolved: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/30',
  closed: 'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-700/40 dark:text-slate-300 dark:border-slate-700',
};

const STATUS_LABELS: Record<TicketStatus, string> = {
  open: 'Open',
  in_progress: 'In progress',
  resolved: 'Resolved',
  closed: 'Closed',
};

const CATEGORY_LABELS: Record<TicketCategory, string> = {
  bug: 'Bug',
  account: 'Account',
  abuse: 'Abuse',
  payment: 'Payment',
  feature_request: 'Feature request',
  other: 'Other',
};

function Pill({ className, children }: { className: string; children: React.ReactNode }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${className}`}
    >
      {children}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: TicketPriority }) {
  return (
    <Pill className={PRIORITY_STYLES[priority]}>
      {priority === 'urgent' && (
        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-1.5 animate-pulse" />
      )}
      <span className="capitalize">{priority}</span>
    </Pill>
  );
}

export function StatusBadge({ status }: { status: TicketStatus }) {
  return <Pill className={STATUS_STYLES[status]}>{STATUS_LABELS[status]}</Pill>;
}

export function CategoryBadge({ category }: { category: TicketCategory }) {
  return (
    <Pill className="bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700">
      {CATEGORY_LABELS[category]}
    </Pill>
  );
}

export { PRIORITY_STYLES, STATUS_LABELS, CATEGORY_LABELS };
