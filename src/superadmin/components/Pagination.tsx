interface Props {
  page: number;
  pageSize: number;
  total: number;
  onChange: (page: number) => void;
}

export default function Pagination({ page, pageSize, total, onChange }: Props) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  if (totalPages <= 1) return null;

  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(total, page * pageSize);

  return (
    <div className="flex items-center justify-between mt-4 text-sm text-text-light dark:text-slate-400">
      <span>
        Showing <span className="font-semibold text-text-dark dark:text-white">{from}</span>–
        <span className="font-semibold text-text-dark dark:text-white">{to}</span> of{' '}
        <span className="font-semibold text-text-dark dark:text-white">{total.toLocaleString()}</span>
      </span>
      <div className="flex items-center gap-1">
        <button
          type="button"
          className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-text-dark dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed"
          onClick={() => onChange(page - 1)}
          disabled={page <= 1}
        >
          Previous
        </button>
        <span className="px-3 py-1.5 text-text-dark dark:text-white font-semibold">
          {page} / {totalPages}
        </span>
        <button
          type="button"
          className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-text-dark dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed"
          onClick={() => onChange(page + 1)}
          disabled={page >= totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}
