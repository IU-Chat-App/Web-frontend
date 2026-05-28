import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import dashboardService from '../services/dashboardService';
import { useTheme } from '../hooks/useTheme';
import {
  DateRange,
  PeriodKey,
  getRange,
  toDateInputValue,
  todayDateInputValue,
} from '../utils/dateRanges';
import { formatNumber } from '../utils/format';
import type { TimeSeriesPoint } from '../types';

const PRESETS: { key: PeriodKey; label: string }[] = [
  { key: 'today', label: 'Today' },
  { key: 'yesterday', label: 'Yesterday' },
  { key: 'this_week', label: 'This week' },
  { key: 'last_week', label: 'Last week' },
  { key: 'this_month', label: 'This month' },
  { key: 'last_month', label: 'Last month' },
];

/**
 * Interactive registrations widget for the Super Admin dashboard.
 *
 * Lets an admin pick a period (Today / Yesterday / This week / Last week /
 * This month / Last month / Custom date range) and see:
 *   - a big total count for that window
 *   - a daily bar chart for the same window
 *   - a "View these users" link that deep-links into the Users page with the
 *     `registeredFrom` / `registeredTo` filters pre-applied.
 *
 * All data is read from the backend via `GET /admin/analytics/registrations?from=&to=`
 * (see dashboardService.registrationsRange).
 */
export default function RegistrationsPanel() {
  const { theme } = useTheme();
  const [activeKey, setActiveKey] = useState<PeriodKey | 'custom'>('today');
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');
  const [data, setData] = useState<{ total: number; daily: TimeSeriesPoint[] }>(
    { total: 0, daily: [] },
  );
  const [loading, setLoading] = useState(true);

  const range = useMemo<DateRange | null>(() => {
    if (activeKey === 'custom') {
      if (!customFrom || !customTo) return null;
      const from = new Date(`${customFrom}T00:00:00`).toISOString();
      const to = new Date(`${customTo}T23:59:59.999`).toISOString();
      return { from, to, label: `${customFrom} → ${customTo}` };
    }
    return getRange(activeKey);
  }, [activeKey, customFrom, customTo]);

  const load = useCallback(async () => {
    if (!range) return;
    setLoading(true);
    try {
      const res = await dashboardService.registrationsRange({
        from: range.from,
        to: range.to,
      });
      setData({ total: res.total ?? 0, daily: res.daily ?? [] });
    } catch {
      setData({ total: 0, daily: [] });
    } finally {
      setLoading(false);
    }
  }, [range]);

  useEffect(() => {
    load();
  }, [load]);

  const axisColor = theme === 'dark' ? '#94A3B8' : '#64748B';
  const gridColor = theme === 'dark' ? '#1E293B' : '#E2E8F0';
  const tooltipBg = theme === 'dark' ? '#0F172A' : '#FFFFFF';
  const tooltipBorder = theme === 'dark' ? '#1E293B' : '#E2E8F0';

  const viewUsersHref = range
    ? `/admin/users?registeredFrom=${toDateInputValue(range.from)}&registeredTo=${toDateInputValue(range.to)}`
    : '/admin/users';

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-soft p-5">
      <div className="flex items-start justify-between gap-3 mb-4 flex-wrap">
        <div>
          <h3 className="font-display font-semibold text-text-dark dark:text-white">
            Registrations
          </h3>
          <p className="text-xs text-text-light dark:text-slate-400">
            {range ? range.label : 'Pick a custom date range'}
          </p>
        </div>
        <Link
          to={viewUsersHref}
          className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-text-dark dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          View these users →
        </Link>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {PRESETS.map((p) => (
          <button
            key={p.key}
            type="button"
            onClick={() => setActiveKey(p.key)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              activeKey === p.key
                ? 'bg-primary-blue text-white border-primary-blue'
                : 'bg-white dark:bg-slate-900 text-text-light dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            {p.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setActiveKey('custom')}
          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
            activeKey === 'custom'
              ? 'bg-primary-blue text-white border-primary-blue'
              : 'bg-white dark:bg-slate-900 text-text-light dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          Custom…
        </button>
      </div>

      {activeKey === 'custom' && (
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <input
            type="date"
            value={customFrom}
            onChange={(e) => setCustomFrom(e.target.value)}
            max={customTo || todayDateInputValue()}
            className="px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-text-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-blue/30 focus:border-primary-blue text-sm"
          />
          <span className="text-text-light dark:text-slate-400 text-sm">to</span>
          <input
            type="date"
            value={customTo}
            onChange={(e) => setCustomTo(e.target.value)}
            min={customFrom || undefined}
            max={todayDateInputValue()}
            className="px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-text-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-blue/30 focus:border-primary-blue text-sm"
          />
        </div>
      )}

      <div className="mb-4">
        <p className="text-xs font-medium uppercase tracking-wide text-text-light dark:text-slate-400">
          New registrations
        </p>
        {loading ? (
          <div className="mt-2 h-10 w-32 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
        ) : (
          <p className="mt-1 text-4xl font-display font-bold text-text-dark dark:text-white">
            {formatNumber(data.total)}
          </p>
        )}
      </div>

      <div style={{ width: '100%', height: 220 }}>
        <ResponsiveContainer>
          <BarChart data={data.daily} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: axisColor }} />
            <YAxis tick={{ fontSize: 11, fill: axisColor }} allowDecimals={false} />
            <Tooltip
              contentStyle={{
                background: tooltipBg,
                border: `1px solid ${tooltipBorder}`,
                borderRadius: 10,
                fontSize: 12,
              }}
            />
            <Bar
              dataKey="value"
              fill="#0084FF"
              radius={[6, 6, 0, 0]}
              name="New users"
              isAnimationActive={!loading}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
