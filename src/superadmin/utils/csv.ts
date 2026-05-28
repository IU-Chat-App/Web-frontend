// Lightweight CSV export utility — no dependencies.
// Escapes quotes, commas, and newlines per RFC 4180.

export type CsvColumn<T> = {
  key: keyof T | string;
  header: string;
  value?: (row: T) => string | number | boolean | null | undefined;
};

function escapeCell(raw: unknown): string {
  if (raw === null || raw === undefined) return '';
  const s = String(raw);
  if (/[",\n\r]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export function toCsv<T>(rows: T[], columns: CsvColumn<T>[]): string {
  const header = columns.map((c) => escapeCell(c.header)).join(',');
  const body = rows
    .map((row) =>
      columns
        .map((c) => {
          const value = c.value
            ? c.value(row)
            : (row as Record<string, unknown>)[c.key as string];
          return escapeCell(value);
        })
        .join(','),
    )
    .join('\n');
  return `${header}\n${body}`;
}

export function downloadCsv(filename: string, csv: string) {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function exportCsv<T>(filename: string, rows: T[], columns: CsvColumn<T>[]) {
  downloadCsv(filename, toCsv(rows, columns));
}
