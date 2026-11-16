import { formatCount, formatPercent } from "@/components/admin/insights/format";

const COLORS = ["var(--chart-2)", "var(--chart-1)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];

export function ShareBar({ rows }: { rows: { label: string; value: number }[] }) {
  const total = rows.reduce((sum, row) => sum + row.value, 0);
  if (total <= 0) {
    return <p className="py-8 text-center text-sm text-muted-foreground">Nothing to chart for this period.</p>;
  }

  return (
    <div>
      <div className="flex h-3 overflow-hidden rounded-full bg-muted">
        {rows.map((row, index) => (
          <div
            key={`${index}-${row.label}`}
            title={`${row.label}: ${formatCount(row.value)}`}
            style={{ width: `${(row.value / total) * 100}%`, backgroundColor: COLORS[index % COLORS.length] }}
          />
        ))}
      </div>
      <ul className="mt-4 space-y-2">
        {rows.map((row, index) => (
          <li key={`${index}-${row.label}`} className="flex items-center justify-between gap-3 text-sm">
            <span className="inline-flex min-w-0 items-center gap-2">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
              <span className="truncate text-foreground">{row.label}</span>
            </span>
            <span className="shrink-0 text-muted-foreground">
              {formatCount(row.value)}
              <span className="ml-2">{formatPercent(row.value / total)}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
