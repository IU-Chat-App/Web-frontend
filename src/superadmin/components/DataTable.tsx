import { ReactNode } from 'react';

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => ReactNode;
  className?: string;
  width?: string;
}

interface Props<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  rowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
}

export default function DataTable<T>({
  columns,
  data,
  loading,
  emptyMessage = 'No records found.',
  rowKey,
  onRowClick,
}: Props<T>) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-soft">
      <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
        <thead className="bg-slate-50 dark:bg-slate-900/60">
          <tr>
            {columns.map((c) => (
              <th
                key={c.key}
                style={c.width ? { width: c.width } : undefined}
                className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-light dark:text-slate-400 ${
                  c.className ?? ''
                }`}
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {loading && (
            <>
              {Array.from({ length: 6 }).map((_, i) => (
                <tr key={`skeleton-${i}`}>
                  {columns.map((_c, j) => (
                    <td key={`${i}-${j}`} className="px-4 py-3">
                      <div
                        className="h-4 rounded bg-slate-200 dark:bg-slate-800 animate-pulse"
                        style={{ width: `${50 + ((i * 7 + j * 11) % 40)}%` }}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </>
          )}
          {!loading && data.length === 0 && (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-12 text-center text-text-light dark:text-slate-400 text-sm"
              >
                {emptyMessage}
              </td>
            </tr>
          )}
          {!loading &&
            data.map((row) => (
              <tr
                key={rowKey(row)}
                onClick={() => onRowClick?.(row)}
                className={`${
                  onRowClick ? 'cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/60' : ''
                } transition-colors`}
              >
                {columns.map((c) => (
                  <td
                    key={c.key}
                    className={`px-4 py-3 text-sm text-text-dark dark:text-slate-200 ${
                      c.className ?? ''
                    }`}
                  >
                    {c.render
                      ? c.render(row)
                      : ((row as Record<string, unknown>)[c.key] as ReactNode)}
                  </td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
