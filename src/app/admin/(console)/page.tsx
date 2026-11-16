"use client";

import Link from "next/link";
import { ArrowUpRight, BookOpen, Briefcase, Inbox, LineChart, Star, type LucideIcon } from "lucide-react";
import { OverviewInsights } from "@/components/admin/insights/OverviewInsights";
import { AdminError, AdminPageHeader, EmptyState } from "@/components/admin/shell/AdminPageHeader";
import { Avatar, AvatarFallback } from "@/components/admin/ui/avatar";
import { Button } from "@/components/admin/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/admin/ui/card";
import { Skeleton } from "@/components/admin/ui/skeleton";
import { useAdminResource } from "@/components/admin/use-admin-resource";
import { formatRelative, initials } from "@/lib/admin/format";
import type { AdminOverview } from "@/lib/admin/overview";
import type { InsightsReport } from "@/lib/google/types";

function Kpi({
  label,
  value,
  detail,
  href,
  icon: Icon,
}: {
  label: string;
  value: number | string;
  detail: string;
  href: string;
  icon: LucideIcon;
}) {
  return (
    <Link href={href} className="group">
      <Card className="gap-3 py-5 transition-colors group-hover:border-ring/40">
        <CardHeader className="flex items-center justify-between px-5">
          <CardDescription className="text-sm">{label}</CardDescription>
          <Icon className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="px-5">
          <p className="text-3xl font-semibold tracking-tight tabular-nums">{value}</p>
          <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
        </CardContent>
      </Card>
    </Link>
  );
}

function KpiSkeleton() {
  return (
    <Card className="gap-3 py-5">
      <CardHeader className="px-5">
        <Skeleton className="h-4 w-24" />
      </CardHeader>
      <CardContent className="space-y-2 px-5">
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-3 w-28" />
      </CardContent>
    </Card>
  );
}

function PerformanceCard() {
  const insights = useAdminResource<InsightsReport>("/api/admin/insights", { maxAgeMs: 10 * 60 * 1000 });
  const report = insights.data;

  if (insights.loading) {
    return (
      <Card className="p-5">
        <Skeleton className="h-5 w-32" />
        <div className="grid gap-3 sm:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} className="h-20" />
          ))}
        </div>
        <Skeleton className="h-32" />
      </Card>
    );
  }

  if (!report || (!report.analytics.connected && !report.search.connected)) {
    return (
      <Card>
        <EmptyState
          icon={LineChart}
          title="Google insights not connected"
          description={insights.error ?? "Connect Analytics and Search Console to see traffic here."}
        />
      </Card>
    );
  }

  return <OverviewInsights report={report} />;
}

export default function AdminOverviewPage() {
  const overview = useAdminResource<AdminOverview>("/api/admin/overview");
  const data = overview.data;
  const counts = data?.counts;

  return (
    <>
      <AdminPageHeader
        title="Overview"
        description="Enquiries, published content, and site performance at a glance."
        onRefresh={overview.reload}
        refreshing={overview.refreshing}
      />
      <AdminError message={overview.error} />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {!counts ? (
          Array.from({ length: 4 }, (_, index) => <KpiSkeleton key={index} />)
        ) : (
          <>
            <Kpi
              label="New enquiries"
              value={counts.messagesThisWeek}
              detail={`Last 7 days · ${counts.messages} total`}
              href="/admin/messages"
              icon={Inbox}
            />
            <Kpi
              label="Portfolio"
              value={counts.portfolio}
              detail={`${counts.portfolioPublished} published`}
              href="/admin/portfolio"
              icon={Briefcase}
            />
            <Kpi
              label="Blog posts"
              value={counts.blogs}
              detail={`${counts.blogsPublished} published · ${counts.blogs - counts.blogsPublished} drafts`}
              href="/admin/blog"
              icon={BookOpen}
            />
            <Kpi
              label="Testimonials"
              value={counts.testimonials}
              detail="Client quotes on the site"
              href="/admin/testimonials"
              icon={Star}
            />
          </>
        )}
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3 [&>*]:min-w-0">
        <div className="xl:col-span-2">
          <PerformanceCard />
        </div>

        <Card className="gap-0 pb-2">
          <CardHeader className="pb-4">
            <CardTitle>Recent enquiries</CardTitle>
            <CardDescription>Latest messages from the contact form</CardDescription>
            <CardAction>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/admin/messages">
                  View all
                  <ArrowUpRight />
                </Link>
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent className="px-2">
            {!data ? (
              <div className="space-y-3 px-4 py-2">
                {Array.from({ length: 4 }, (_, index) => (
                  <Skeleton key={index} className="h-10" />
                ))}
              </div>
            ) : data.recentMessages.length === 0 ? (
              <EmptyState icon={Inbox} title="No enquiries yet" className="py-10" />
            ) : (
              <ul>
                {data.recentMessages.map((item) => (
                  <li key={item.id}>
                    <Link
                      href="/admin/messages"
                      className="flex items-center gap-3 rounded-lg px-4 py-2.5 transition-colors hover:bg-muted/60"
                    >
                      <Avatar className="size-8">
                        <AvatarFallback className="text-xs">{initials(item.name)}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline justify-between gap-2">
                          <p className="truncate text-sm font-medium">{item.name}</p>
                          <span className="shrink-0 text-xs text-muted-foreground">{formatRelative(item.created_at)}</span>
                        </div>
                        <p className="truncate text-xs text-muted-foreground">{item.subject || item.message}</p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
