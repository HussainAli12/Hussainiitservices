"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, CalendarCheck, Check, Globe, IndianRupee, Loader2, PhoneCall, Snowflake, Trophy } from "lucide-react";
import { toast } from "sonner";
import { CRM, crmWrite, todayPath } from "@/components/admin/crm/api";
import { LogActivitySheet, type LogActivityTarget } from "@/components/admin/crm/LogActivitySheet";
import { DueLabel, StageBadge } from "@/components/admin/crm/parts";
import { AdminError, AdminPageHeader, EmptyState } from "@/components/admin/shell/AdminPageHeader";
import { Button } from "@/components/admin/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/admin/ui/card";
import { Skeleton } from "@/components/admin/ui/skeleton";
import { useAdminResource } from "@/components/admin/use-admin-resource";
import { formatRelative } from "@/lib/admin/format";
import { formatInr } from "@/lib/crm/config";
import type { CrmTaskRow, CrmToday } from "@/lib/crm/types";
import { cn } from "@/lib/utils";

function Kpi({ label, value, detail, icon: Icon }: { label: string; value: string | number; detail?: string; icon: React.ComponentType<{ className?: string }> }) {
  return (
    <Card className="gap-2 py-5">
      <CardHeader className="flex items-center justify-between px-5">
        <CardDescription>{label}</CardDescription>
        <Icon className="size-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="px-5">
        <p className="text-2xl font-semibold tracking-tight tabular-nums">{value}</p>
        {detail && <p className="mt-0.5 text-xs text-muted-foreground">{detail}</p>}
      </CardContent>
    </Card>
  );
}

function TaskGroup({
  title,
  tasks,
  tone,
  onLog,
}: {
  title: string;
  tasks: CrmTaskRow[];
  tone?: "danger";
  onLog: (task: CrmTaskRow) => void;
}) {
  const [completing, setCompleting] = useState<string | null>(null);

  async function complete(task: CrmTaskRow) {
    setCompleting(task.id);
    try {
      await crmWrite("PUT", CRM.tasks, { id: task.id, done: true });
      toast.success("Marked as done");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update the follow-up.");
    } finally {
      setCompleting(null);
    }
  }

  if (tasks.length === 0) return null;
  return (
    <div>
      <p className={cn("mb-1 px-2 text-xs font-medium uppercase tracking-wide", tone === "danger" ? "text-destructive" : "text-muted-foreground")}>
        {title} · {tasks.length}
      </p>
      <ul>
        {tasks.map((task) => {
          return (
            <li key={task.id} className="group flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-muted/50">
              <button
                type="button"
                onClick={() => void complete(task)}
                disabled={completing === task.id}
                aria-label={`Mark "${task.title}" as done`}
                className="flex size-4 shrink-0 items-center justify-center rounded-full border transition-colors hover:border-success hover:bg-success/10"
              >
                {completing === task.id ? <Loader2 className="size-3 animate-spin" /> : <Check className="size-3 opacity-0 group-hover:opacity-60" />}
              </button>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm">
                  {task.title}{" "}
                  <Link href={`/admin/sales/customers/${task.customer_id}`} className="text-muted-foreground hover:text-foreground hover:underline">
                    · {task.customer?.name}
                  </Link>
                </p>
                <p className="text-xs text-muted-foreground">
                  <DueLabel dueAt={task.due_at} />
                </p>
              </div>
              <Button size="xs" variant="outline" onClick={() => onLog(task)}>
                Log
              </Button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function MyDayPage() {
  const router = useRouter();
  const [path] = useState(todayPath);
  const today = useAdminResource<CrmToday>(path);
  const [logTarget, setLogTarget] = useState<LogActivityTarget | null>(null);
  const [converting, setConverting] = useState<string | null>(null);

  const data = today.data;
  const groups = useMemo(() => {
    const tasks = data?.tasks ?? [];
    const now = new Date();
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    return {
      overdue: tasks.filter((task) => new Date(task.due_at).getTime() < startOfToday),
      today: tasks.filter((task) => {
        const due = new Date(task.due_at).getTime();
        return due >= startOfToday && due < endOfToday;
      }),
      upcoming: tasks.filter((task) => new Date(task.due_at).getTime() >= endOfToday),
    };
  }, [data]);

  async function convert(submissionId: string) {
    setConverting(submissionId);
    try {
      const result = await crmWrite<{ customer_id: string }>("POST", CRM.enquiries, { submission_id: submissionId });
      toast.success("Added as a lead");
      router.push(`/admin/sales/customers/${result.customer_id}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not convert the enquiry.");
    } finally {
      setConverting(null);
    }
  }

  const dueCount = groups.overdue.length + groups.today.length;

  return (
    <>
      <AdminPageHeader
        title="My day"
        description="Follow-ups due, fresh enquiries, and deals that need attention."
        onRefresh={today.reload}
        refreshing={today.refreshing}
      />
      <AdminError message={today.error} />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {!data ? (
          Array.from({ length: 4 }, (_, index) => <Skeleton key={index} className="h-28 rounded-xl" />)
        ) : (
          <>
            <Kpi
              label="Follow-ups due"
              value={dueCount}
              detail={groups.overdue.length ? `${groups.overdue.length} overdue` : "Nothing overdue"}
              icon={CalendarCheck}
            />
            <Kpi
              label="Activities today"
              value={data.activityToday}
              detail="Calls, messages and meetings"
              icon={PhoneCall}
            />
            <Kpi label="Open pipeline" value={formatInr(data.pipeline.openValue)} detail={`${data.pipeline.openDeals} open deal${data.pipeline.openDeals === 1 ? "" : "s"}`} icon={IndianRupee} />
            <Kpi
              label="Won this month"
              value={formatInr(data.pipeline.wonValueThisMonth)}
              detail={`${data.pipeline.wonThisMonth} deal${data.pipeline.wonThisMonth === 1 ? "" : "s"}`}
              icon={Trophy}
            />
          </>
        )}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3 [&>*]:min-w-0">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Follow-ups</CardTitle>
            <CardDescription>Overdue, today, and the next 7 days</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-5 px-4">
            {!data ? (
              <div className="grid gap-2 px-2">
                {Array.from({ length: 5 }, (_, index) => (
                  <Skeleton key={index} className="h-10" />
                ))}
              </div>
            ) : groups.overdue.length + groups.today.length + groups.upcoming.length === 0 ? (
              <EmptyState
                icon={CalendarCheck}
                title="All caught up"
                description="Follow-ups scheduled when you log a call or message show up here."
              />
            ) : (
              <>
                <TaskGroup
                  title="Overdue"
                  tone="danger"
                  tasks={groups.overdue}
                  onLog={(task) => setLogTarget({ customerId: task.customer_id, taskId: task.id, dealId: task.deal_id, channel: task.type === "proposal" || task.type === "other" ? "email" : task.type })}
                />
                <TaskGroup
                  title="Today"
                  tasks={groups.today}
                  onLog={(task) => setLogTarget({ customerId: task.customer_id, taskId: task.id, dealId: task.deal_id, channel: task.type === "proposal" || task.type === "other" ? "email" : task.type })}
                />
                <TaskGroup
                  title="Next 7 days"
                  tasks={groups.upcoming}
                  onLog={(task) => setLogTarget({ customerId: task.customer_id, taskId: task.id, dealId: task.deal_id, channel: task.type === "proposal" || task.type === "other" ? "email" : task.type })}
                />
              </>
            )}
          </CardContent>
        </Card>

        <div className="grid content-start gap-6">
          <Card className="gap-3">
            <CardHeader>
              <CardTitle>New website enquiries</CardTitle>
              <CardDescription>Not yet in the CRM · last 60 days</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-1 px-4">
              {!data ? (
                <Skeleton className="mx-2 h-16" />
              ) : data.enquiries.length === 0 ? (
                <p className="px-2 text-sm text-muted-foreground">Every enquiry has been picked up.</p>
              ) : (
                data.enquiries.map((enquiry) => (
                  <div key={enquiry.id} className="flex items-start gap-3 rounded-lg px-2 py-2 hover:bg-muted/50">
                    <Globe className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{enquiry.name}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {enquiry.subject || enquiry.message} · {formatRelative(enquiry.created_at)}
                      </p>
                    </div>
                    <Button size="xs" variant="outline" disabled={converting === enquiry.id} onClick={() => void convert(enquiry.id)}>
                      {converting === enquiry.id ? <Loader2 className="animate-spin" /> : null}
                      Add lead
                    </Button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card className="gap-3">
            <CardHeader>
              <CardTitle>Going cold</CardTitle>
              <CardDescription>Open deals with no contact for 7+ days</CardDescription>
              <CardAction>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/admin/sales/pipeline">
                    Pipeline
                    <ArrowRight />
                  </Link>
                </Button>
              </CardAction>
            </CardHeader>
            <CardContent className="flex flex-col gap-1 px-4">
              {!data ? (
                <Skeleton className="mx-2 h-16" />
              ) : data.goingCold.length === 0 ? (
                <p className="px-2 text-sm text-muted-foreground">No deals going cold. 👏</p>
              ) : (
                data.goingCold.map((deal) => (
                  <Link
                    key={deal.id}
                    href={`/admin/sales/customers/${deal.customer_id}`}
                    className="flex items-start gap-3 rounded-lg px-2 py-2 hover:bg-muted/50"
                  >
                    <Snowflake className="mt-0.5 size-4 shrink-0 text-sky-500" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{deal.customer?.name}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {formatInr(deal.value_inr)} ·{" "}
                        {deal.last_activity_at ? `last contact ${formatRelative(deal.last_activity_at)}` : "never contacted"}
                      </p>
                    </div>
                    <StageBadge stage={deal.stage} />
                  </Link>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <LogActivitySheet target={logTarget} onOpenChange={(open) => !open && setLogTarget(null)} />
    </>
  );
}
