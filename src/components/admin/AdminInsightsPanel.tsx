"use client";

import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Clock, Eye, MousePointerClick, Search, Timer, UserPlus, Users } from "lucide-react";
import { Badge } from "@/components/admin/ui/badge";
import {
  formatCount,
  formatDay,
  formatDelta,
  formatDuration,
  formatPercent,
  formatPosition,
  pageLabel,
} from "@/components/admin/insights/format";
import { RankBars } from "@/components/admin/insights/RankBars";
import { ShareBar } from "@/components/admin/insights/ShareBar";
import { TrendChart } from "@/components/admin/insights/TrendChart";
import { cn } from "@/lib/utils";
import type { InsightsReport } from "@/lib/google/types";

const NAVY = "var(--chart-1)";
const ACCENT = "var(--chart-2)";
const GOLD = "var(--chart-3)";

function Metric({
  label,
  value,
  hint,
  icon: Icon,
  delta,
}: {
  label: string;
  value: string;
  hint: string;
  icon: LucideIcon;
  delta?: { text: string; tone: "up" | "down" | "flat" };
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm text-muted-foreground">{label}</p>
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-muted-foreground">
          <Icon size={16} />
        </span>
      </div>
      <p className="mt-3 text-2xl font-semibold tracking-tight tabular-nums">{value}</p>
      <p
        className={cn(
          "mt-1 text-xs",
          delta?.tone === "up" && "text-success",
          delta?.tone === "down" && "text-destructive",
          (!delta || delta.tone === "flat") && "text-muted-foreground",
        )}
      >
        {delta?.text ?? hint}
      </p>
    </div>
  );
}

function Notice({ message }: { message: string }) {
  return <p className="rounded-lg border border-warning/30 bg-warning/10 px-4 py-3 text-sm text-foreground">{message}</p>;
}

function ChartCard({
  title,
  description,
  legend,
  children,
}: {
  title: string;
  description: string;
  legend?: { label: string; color: string }[];
  children: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-xs">
      <div className="mb-2 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-foreground">{title}</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
        </div>
        {legend && legend.length > 0 && (
          <ul className="flex flex-wrap gap-3">
            {legend.map((item) => (
              <li key={item.label} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                {item.label}
              </li>
            ))}
          </ul>
        )}
      </div>
      {children}
    </div>
  );
}

function EmptyChart({ label }: { label: string }) {
  return (
    <div className="flex h-56 items-center justify-center rounded-xl border border-dashed border-border bg-muted text-sm text-muted-foreground">
      {label}
    </div>
  );
}

export function AdminInsightsPanel({ report }: { report: InsightsReport }) {
  const analytics = report.analytics;
  const search = report.search;
  const analyticsDates = analytics.series.map((point) => formatDay(point.date));
  const searchDates = search.series.map((point) => formatDay(point.date));

  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-base font-semibold text-foreground">Google Analytics</h2>
          <Badge variant="outline" className="gap-1.5 font-normal"><span className={cn("size-1.5 rounded-full", analytics.connected ? "bg-success" : "bg-warning")} />
            {analytics.connected ? "Connected" : "Not connected"}
          </Badge>
          <span className="text-xs text-muted-foreground">Last 28 days, compared with the 28 before</span>
        </div>
        {analytics.error ? <Notice message={analytics.error} /> : null}
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Metric label="Users" value={formatCount(analytics.users)} hint="Active users" icon={Users} delta={formatDelta(analytics.users, analytics.previous.users)} />
          <Metric label="New users" value={formatCount(analytics.newUsers)} hint="First visit in this period" icon={UserPlus} delta={formatDelta(analytics.newUsers, analytics.previous.newUsers)} />
          <Metric label="Sessions" value={formatCount(analytics.sessions)} hint="Visits started" icon={MousePointerClick} delta={formatDelta(analytics.sessions, analytics.previous.sessions)} />
          <Metric label="Page views" value={formatCount(analytics.views)} hint="Screens viewed" icon={Eye} delta={formatDelta(analytics.views, analytics.previous.views)} />
          <Metric label="Engagement" value={formatPercent(analytics.engagementRate)} hint="Engaged sessions" icon={Search} delta={formatDelta(analytics.engagementRate, analytics.previous.engagementRate)} />
          <Metric label="Avg. duration" value={formatDuration(analytics.averageSessionDuration)} hint="Time on site" icon={Clock} delta={formatDelta(analytics.averageSessionDuration, analytics.previous.averageSessionDuration)} />
          <Metric label="Bounce rate" value={formatPercent(analytics.bounceRate)} hint="Lower is better" icon={Timer} delta={formatDelta(analytics.bounceRate, analytics.previous.bounceRate, true)} />
        </div>
        <ChartCard
          title="Traffic"
          description="Users, sessions, and page views each day"
          legend={[
            { label: "Users", color: NAVY },
            { label: "Sessions", color: ACCENT },
            { label: "Views", color: GOLD },
          ]}
        >
          {analytics.series.length === 0 ? (
            <EmptyChart label="The traffic chart appears once Analytics is connected." />
          ) : (
            <TrendChart
              dates={analyticsDates}
              series={[
                { label: "Users", color: NAVY, values: analytics.series.map((point) => point.users) },
                { label: "Sessions", color: ACCENT, values: analytics.series.map((point) => point.sessions) },
                { label: "Views", color: GOLD, values: analytics.series.map((point) => point.views) },
              ]}
            />
          )}
        </ChartCard>
        <div className="grid gap-4 xl:grid-cols-3">
          <ChartCard title="Channels" description="Where sessions came from">
            <RankBars
              color={ACCENT}
              rows={analytics.channels.map((row) => ({
                label: row.label,
                value: row.primary,
                detail: `${formatCount(row.secondary)} users`,
              }))}
            />
          </ChartCard>
          <ChartCard title="Countries" description="Visitors by country">
            <RankBars
              color={NAVY}
              rows={analytics.countries.map((row) => ({
                label: row.label,
                value: row.primary,
                detail: `${formatCount(row.secondary)} sessions`,
              }))}
            />
          </ChartCard>
          <ChartCard title="Devices" description="Share of active users">
            <ShareBar rows={analytics.devices.map((row) => ({ label: row.label, value: row.primary }))} />
          </ChartCard>
        </div>
        <ChartCard title="Top pages" description="Pages with the most views">
          <RankBars
            color={ACCENT}
            rows={analytics.pages.map((page) => ({
              label: page.path,
              value: page.views,
              detail: `${formatPercent(page.engagementRate)} engaged`,
            }))}
          />
        </ChartCard>
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-base font-semibold text-foreground">Google Search Console</h2>
          <Badge variant="outline" className="gap-1.5 font-normal"><span className={cn("size-1.5 rounded-full", search.connected ? "bg-success" : "bg-warning")} />
            {search.connected ? "Connected" : "Not connected"}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {formatDay(report.startDate)} – {formatDay(report.endDate)}
          </span>
        </div>
        {search.error ? <Notice message={search.error} /> : null}
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Metric label="Clicks" value={formatCount(search.clicks)} hint="Visits from Google" icon={MousePointerClick} delta={formatDelta(search.clicks, search.previous.clicks)} />
          <Metric label="Impressions" value={formatCount(search.impressions)} hint="Times shown in search" icon={Eye} delta={formatDelta(search.impressions, search.previous.impressions)} />
          <Metric label="CTR" value={formatPercent(search.ctr)} hint="Clicks per impression" icon={Search} delta={formatDelta(search.ctr, search.previous.ctr)} />
          <Metric label="Average position" value={formatPosition(search.position)} hint="Lower is closer to the top" icon={Users} delta={formatDelta(search.position, search.previous.position, true)} />
        </div>
        <div className="grid gap-4 xl:grid-cols-2">
          <ChartCard title="Clicks" description="Search clicks each day" legend={[{ label: "Clicks", color: ACCENT }]}>
            {search.series.length === 0 ? (
              <EmptyChart label="The clicks chart appears once Search Console is connected." />
            ) : (
              <TrendChart
                dates={searchDates}
                series={[{ label: "Clicks", color: ACCENT, values: search.series.map((point) => point.clicks) }]}
              />
            )}
          </ChartCard>
          <ChartCard title="Impressions" description="Search appearances each day" legend={[{ label: "Impressions", color: NAVY }]}>
            {search.series.length === 0 ? (
              <EmptyChart label="The impressions chart appears once Search Console is connected." />
            ) : (
              <TrendChart
                dates={searchDates}
                series={[{ label: "Impressions", color: NAVY, values: search.series.map((point) => point.impressions) }]}
              />
            )}
          </ChartCard>
        </div>
        <div className="grid gap-4 xl:grid-cols-2">
          <ChartCard title="Search countries" description="Clicks by country">
            <RankBars
              color={NAVY}
              rows={search.countries.map((row) => ({
                label: row.label,
                value: row.clicks,
                detail: `pos ${formatPosition(row.position)}`,
              }))}
            />
          </ChartCard>
          <ChartCard title="Search devices" description="Share of search clicks">
            <ShareBar rows={search.devices.map((row) => ({ label: row.label, value: row.clicks }))} />
          </ChartCard>
        </div>
        <div className="grid gap-4 xl:grid-cols-2">
          <ChartCard title="Top queries" description="Searches that brought people here">
            <RankBars
              color={ACCENT}
              rows={search.queries.map((row) => ({
                label: row.label,
                value: row.clicks,
                detail: `${formatCount(row.impressions)} impressions`,
              }))}
            />
          </ChartCard>
          <ChartCard title="Top search pages" description="Pages Google sent people to">
            <RankBars
              color={NAVY}
              rows={search.pages.map((row) => ({
                label: pageLabel(row.label),
                value: row.clicks,
                detail: `pos ${formatPosition(row.position)}`,
              }))}
            />
          </ChartCard>
        </div>
      </section>
    </div>
  );
}
