/**
 * Small client-side helpers that turn presets like "today", "yesterday",
 * "this week" into concrete `{ from, to }` ISO timestamp ranges, plus a
 * couple of conversions to/from the `YYYY-MM-DD` shape used by
 * `<input type="date">` and our backend query parameters.
 *
 * Week semantics: ISO weeks (Monday-start, Sunday-end). Adjust if your
 * product treats Sunday as the first day of the week.
 */

export type PeriodKey =
  | 'today'
  | 'yesterday'
  | 'this_week'
  | 'last_week'
  | 'this_month'
  | 'last_month';

export interface DateRange {
  from: string; // ISO datetime
  to: string; // ISO datetime
  label: string;
}

function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function endOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
}

function startOfWeek(d: Date): Date {
  const x = startOfDay(d);
  const day = x.getDay(); // 0 = Sunday … 6 = Saturday
  const diff = day === 0 ? -6 : 1 - day; // back-to-Monday
  x.setDate(x.getDate() + diff);
  return x;
}

function endOfWeek(d: Date): Date {
  const start = startOfWeek(d);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return end;
}

function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0);
}

function endOfMonth(d: Date): Date {
  const x = new Date(d.getFullYear(), d.getMonth() + 1, 0);
  x.setHours(23, 59, 59, 999);
  return x;
}

export function getRange(key: PeriodKey, now: Date = new Date()): DateRange {
  switch (key) {
    case 'today':
      return {
        from: startOfDay(now).toISOString(),
        to: endOfDay(now).toISOString(),
        label: 'Today',
      };
    case 'yesterday': {
      const y = new Date(now);
      y.setDate(now.getDate() - 1);
      return {
        from: startOfDay(y).toISOString(),
        to: endOfDay(y).toISOString(),
        label: 'Yesterday',
      };
    }
    case 'this_week':
      return {
        from: startOfWeek(now).toISOString(),
        to: endOfDay(now).toISOString(),
        label: 'This week',
      };
    case 'last_week': {
      const lw = new Date(now);
      lw.setDate(now.getDate() - 7);
      return {
        from: startOfWeek(lw).toISOString(),
        to: endOfWeek(lw).toISOString(),
        label: 'Last week',
      };
    }
    case 'this_month':
      return {
        from: startOfMonth(now).toISOString(),
        to: endOfDay(now).toISOString(),
        label: 'This month',
      };
    case 'last_month': {
      const lm = new Date(now.getFullYear(), now.getMonth() - 1, 15);
      return {
        from: startOfMonth(lm).toISOString(),
        to: endOfMonth(lm).toISOString(),
        label: 'Last month',
      };
    }
  }
}

/** Format an ISO datetime as `YYYY-MM-DD` for `<input type="date">`. */
export function toDateInputValue(iso: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

/** Today's date as `YYYY-MM-DD`. Handy as a `max` for date inputs. */
export function todayDateInputValue(): string {
  return toDateInputValue(new Date().toISOString());
}
