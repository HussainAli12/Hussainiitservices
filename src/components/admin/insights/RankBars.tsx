const count = new Intl.NumberFormat("en-GB", { maximumFractionDigits: 0 });

export function RankBars({
  rows,
  color = "var(--chart-2)",
}: {
  rows: { label: string; value: number; detail?: string }[];
  color?: string;
}) {
  const max = Math.max(...rows.map((row) => row.value), 1);

  if (rows.length === 0) {
    return <p className="py-8 text-center text-sm text-muted-foreground">Nothing to chart for this period.</p>;
  }

  return (
    <ol className="space-y-4">
      {rows.map((row, index) => (
        <li key={`${index}-${row.label}`}>
          <div className="mb-1.5 flex items-baseline justify-between gap-3">
            <p className="flex min-w-0 items-baseline gap-2">
              <span className="w-4 shrink-0 text-xs font-semibold text-muted-foreground">{index + 1}</span>
              <span className="truncate text-sm font-medium text-foreground">{row.label}</span>
            </p>
            <p className="shrink-0 text-sm text-foreground">
              <span className="font-semibold">{count.format(row.value)}</span>
              {row.detail ? <span className="ml-2 text-xs text-muted-foreground">{row.detail}</span> : null}
            </p>
          </div>
          <div className="ml-6 h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full"
              style={{ width: `${Math.max(4, (row.value / max) * 100)}%`, backgroundColor: color }}
            />
          </div>
        </li>
      ))}
    </ol>
  );
}
