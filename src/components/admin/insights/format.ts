const count = new Intl.NumberFormat("en-GB", { maximumFractionDigits: 0 });

export function formatCount(value: number) {
  return count.format(value);
}

export function formatPercent(value: number) {
  return `${(value * 100).toFixed(1)}%`;
}

export function formatPosition(value: number) {
  return value.toFixed(1);
}

export function formatDay(value: string) {
  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });
}

export function formatDuration(seconds: number) {
  const total = Math.max(0, Math.round(seconds));
  const minutes = Math.floor(total / 60);
  const rest = total % 60;
  return `${minutes}m ${rest.toString().padStart(2, "0")}s`;
}

export function formatDelta(
  current: number,
  previous: number,
  lowerIsBetter = false,
): { text: string; tone: "up" | "down" | "flat" } {
  if (previous === 0 && current === 0) return { text: "No change", tone: "flat" };
  if (previous === 0) return { text: "New this period", tone: "up" };
  const change = ((current - previous) / previous) * 100;
  const improved = lowerIsBetter ? change < 0 : change > 0;
  const tone: "up" | "down" | "flat" = Math.abs(change) < 0.5 ? "flat" : improved ? "up" : "down";
  const sign = change > 0 ? "+" : "";
  return { text: `${sign}${change.toFixed(0)}% vs prior 28 days`, tone };
}

export function pageLabel(value: string) {
  try {
    const url = new URL(value);
    return `${url.pathname}${url.search}` || "/";
  } catch {
    return value;
  }
}
