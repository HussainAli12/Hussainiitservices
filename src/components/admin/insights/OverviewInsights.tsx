"use client";

import Link from "next/link";
import { formatCount, formatDay, formatDelta } from "@/components/admin/insights/format";
import { TrendChart } from "@/components/admin/insights/TrendChart";
import { cn } from "@/lib/utils";
import type { InsightsReport } from "@/lib/google/types";

function Highlight({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="min-w-0">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 truncate text-sm font-semibold text-foreground">{value}</p>
      <p className="truncate text-xs text-muted-foreground">{detail}</p>
    </div>
  );
}

function NumberCard({
  label,
  value,
  delta,
}: {
  label: string;
  value: string;
  delta: { text: string; tone: "up" | "down" | "flat" };
}) {
  return (
    <div className="rounded-lg bg-muted/50 px-4 py-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-xl font-semibold tabular-nums">{value}</p>
      <p
        className={cn(
          "mt-1 text-xs",
          delta.tone === "up" && "text-success",
          delta.tone === "down" && "text-destructive",
          delta.tone === "flat" && "text-muted-foreground",
        )}
      >
        {delta.text}
      </p>
    </div>
  );
}

export function OverviewInsights({ report }: { report: InsightsReport }) {
  const analytics = report.analytics;
  const search = report.search;
  const topPage = analytics.pages[0];
  const topQuery = search.queries[0];
  const topChannel = analytics.channels[0];

  return (
    <section className="h-full rounded-xl border bg-card p-6 shadow-xs">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-semibold">Performance</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {formatDay(report.startDate)} – {formatDay(report.endDate)}
          </p>
        </div>
        <Link href="/admin/insights" className="text-sm font-medium text-muted-foreground hover:text-foreground">
          Full report →
        </Link>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <NumberCard label="Users" value={formatCount(analytics.users)} delta={formatDelta(analytics.users, analytics.previous.users)} />
        <NumberCard label="Sessions" value={formatCount(analytics.sessions)} delta={formatDelta(analytics.sessions, analytics.previous.sessions)} />
        <NumberCard label="Search clicks" value={formatCount(search.clicks)} delta={formatDelta(search.clicks, search.previous.clicks)} />
        <NumberCard label="Impressions" value={formatCount(search.impressions)} delta={formatDelta(search.impressions, search.previous.impressions)} />
      </div>

      {analytics.series.length > 0 && (
        <div className="mt-4">
          <TrendChart
            className="h-28 sm:h-32"
            dates={analytics.series.map((point) => formatDay(point.date))}
            series={[
              { label: "Users", color: "var(--chart-1)", values: analytics.series.map((point) => point.users) },
              { label: "Sessions", color: "var(--chart-2)", values: analytics.series.map((point) => point.sessions) },
            ]}
          />
        </div>
      )}

      <div className="mt-4 grid gap-4 border-t border-border pt-4 sm:grid-cols-3">
        <Highlight
          label="Top page"
          value={topPage?.path || "—"}
          detail={topPage ? `${formatCount(topPage.views)} views` : "No page data"}
        />
        <Highlight
          label="Top search"
          value={topQuery?.label || "—"}
          detail={topQuery ? `${formatCount(topQuery.clicks)} clicks` : "No search data"}
        />
        <Highlight
          label="Top channel"
          value={topChannel?.label || "—"}
          detail={topChannel ? `${formatCount(topChannel.primary)} sessions` : "No channel data"}
        />
      </div>
    </section>
  );
}
