import { ReactNode } from 'react';

interface Props {
  label: string;
  value: ReactNode;
  delta?: string;
  trend?: 'up' | 'down' | 'flat';
  icon?: ReactNode;
  tint?: 'blue' | 'purple' | 'emerald' | 'amber' | 'rose' | 'sky' | 'indigo' | 'slate';
  loading?: boolean;
}

const tintMap: Record<NonNullable<Props['tint']>, string> = {
  blue: 'from-blue-500/10 to-blue-500/0 text-blue-600 dark:text-blue-400',
  purple: 'from-purple-500/10 to-purple-500/0 text-purple-600 dark:text-purple-400',
  emerald: 'from-emerald-500/10 to-emerald-500/0 text-emerald-600 dark:text-emerald-400',
  amber: 'from-amber-500/10 to-amber-500/0 text-amber-600 dark:text-amber-400',
  rose: 'from-rose-500/10 to-rose-500/0 text-rose-600 dark:text-rose-400',
  sky: 'from-sky-500/10 to-sky-500/0 text-sky-600 dark:text-sky-400',
  indigo: 'from-indigo-500/10 to-indigo-500/0 text-indigo-600 dark:text-indigo-400',
  slate: 'from-slate-500/10 to-slate-500/0 text-slate-600 dark:text-slate-400',
};

export default function StatCard({
  label,
  value,
  delta,
  trend = 'flat',
  icon,
  tint = 'blue',
  loading,
}: Props) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-soft hover:shadow-soft-lg transition-all hover:-translate-y-0.5">
      <div className={`absolute inset-0 bg-gradient-to-br ${tintMap[tint]} pointer-events-none`} />
      <div className="relative flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-text-light dark:text-slate-400">
            {label}
          </p>
          {loading ? (
            <div className="mt-2 h-8 w-24 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
          ) : (
            <p className="mt-2 text-3xl font-display font-bold text-text-dark dark:text-white truncate">
              {value}
            </p>
          )}
          {delta && !loading && (
            <p
              className={`mt-2 text-xs font-medium ${
                trend === 'up'
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : trend === 'down'
                  ? 'text-rose-600 dark:text-rose-400'
                  : 'text-text-light dark:text-slate-400'
              }`}
            >
              {trend === 'up' ? '▲ ' : trend === 'down' ? '▼ ' : ''}
              {delta}
            </p>
          )}
        </div>
        {icon && (
          <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
