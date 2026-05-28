import type { DateRange } from '../types';

interface Props {
  value: DateRange;
  onChange: (range: DateRange) => void;
  options?: { value: DateRange; label: string }[];
}

const DEFAULT_OPTIONS: { value: DateRange; label: string }[] = [
  { value: '7d', label: '7d' },
  { value: '30d', label: '30d' },
  { value: '90d', label: '90d' },
  { value: '12m', label: '12m' },
];

export default function DateRangePicker({ value, onChange, options = DEFAULT_OPTIONS }: Props) {
  return (
    <div className="inline-flex rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-1">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
            value === o.value
              ? 'bg-primary-blue text-white shadow-sm'
              : 'text-text-light dark:text-slate-400 hover:text-text-dark dark:hover:text-white'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
