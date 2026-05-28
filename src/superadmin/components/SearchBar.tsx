import { ChangeEvent } from 'react';

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = 'Search…',
  className = '',
}: Props) {
  function handle(e: ChangeEvent<HTMLInputElement>) {
    onChange(e.target.value);
  }
  return (
    <div className={`relative flex-1 min-w-[240px] ${className}`}>
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light dark:text-slate-500 pointer-events-none">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <circle cx="11" cy="11" r="7" />
          <path strokeLinecap="round" d="M21 21l-4.3-4.3" />
        </svg>
      </span>
      <input
        type="search"
        value={value}
        onChange={handle}
        placeholder={placeholder}
        className="w-full pl-9 pr-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-text-dark dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-blue/30 focus:border-primary-blue transition"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md text-text-light dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Clear search"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
