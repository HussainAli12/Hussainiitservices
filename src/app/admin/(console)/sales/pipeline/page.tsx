"use client";

import { useMemo, useState, type DragEvent } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { CRM, crmWrite } from "@/components/admin/crm/api";
import { StageDot } from "@/components/admin/crm/parts";
import { AdminError, AdminPageHeader, PageSkeleton } from "@/components/admin/shell/AdminPageHeader";
import { Button } from "@/components/admin/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/admin/ui/dialog";
import { Label } from "@/components/admin/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/admin/ui/select";
import { useAdminResource } from "@/components/admin/use-admin-resource";
import { formatRelative } from "@/lib/admin/format";
import { DEAL_STAGES, LOST_REASONS, formatInr, formatInrCompact } from "@/lib/crm/config";
import type { CrmPipelineDeal, DealStage } from "@/lib/crm/types";
import { cn } from "@/lib/utils";

const COLD_MS = 7 * 24 * 60 * 60 * 1000;
const CLOSED_LIMIT = 15;

function DealCard({
  deal,
  onDragStart,
}: {
  deal: CrmPipelineDeal;
  onDragStart: (event: DragEvent) => void;
}) {
  const lastTouch = deal.last_activity_at ?? deal.created_at;
  // eslint-disable-next-line react-hooks/purity -- staleness is relative to "now" by design
  const cold = deal.stage !== "won" && deal.stage !== "lost" && Date.now() - new Date(lastTouch).getTime() > COLD_MS;

  return (
    <Link
      href={`/admin/sales/customers/${deal.customer_id}`}
      draggable
      onDragStart={onDragStart}
      className="block cursor-grab rounded-lg border bg-card p-3 shadow-xs transition-shadow hover:shadow-sm active:cursor-grabbing"
    >
      <p className="truncate text-sm font-medium">{deal.customer?.name ?? "Customer"}</p>
      <p className="truncate text-xs text-muted-foreground">{deal.title}</p>
      <p className="mt-3 text-sm font-medium tabular-nums">{formatInr(deal.value_inr)}</p>
      <p className={cn("mt-2 text-[11px]", cold ? "font-medium text-warning" : "text-muted-foreground")}>
        {deal.last_activity_at ? `Last contact ${formatRelative(deal.last_activity_at)}` : "No contact logged"}
        {cold && " · going cold"}
      </p>
    </Link>
  );
}

export default function PipelinePage() {
  const resource = useAdminResource<CrmPipelineDeal[]>(CRM.deals);
  const [dragOver, setDragOver] = useState<DealStage | null>(null);
  const [pendingLost, setPendingLost] = useState<CrmPipelineDeal | null>(null);
  const [lostReason, setLostReason] = useState(LOST_REASONS[0]);

  const deals = useMemo(
    () => resource.data ?? [],
    [resource.data],
  );

  const columns = useMemo(
    () =>
      DEAL_STAGES.map((stage) => {
        const items = deals.filter((deal) => deal.stage === stage.value);
        return {
          ...stage,
          items: stage.open ? items : items.slice(0, CLOSED_LIMIT),
          hidden: stage.open ? 0 : Math.max(0, items.length - CLOSED_LIMIT),
          count: items.length,
          total: items.reduce((sum, deal) => sum + deal.value_inr, 0),
        };
      }),
    [deals],
  );

  const openValue = columns.filter((column) => column.open).reduce((sum, column) => sum + column.total, 0);
  const openCount = columns.filter((column) => column.open).reduce((sum, column) => sum + column.count, 0);

  async function move(deal: CrmPipelineDeal, stage: DealStage, reason?: string) {
    if (deal.stage === stage && stage !== "lost") return;
    const previous = deal.stage;
    resource.mutate((current) => current?.map((item) => (item.id === deal.id ? { ...item, stage } : item)) ?? null);
    try {
      await crmWrite("PUT", CRM.deals, { id: deal.id, stage, lost_reason: reason });
      if (stage === "won") toast.success(`Won ${deal.customer?.name ?? "deal"} 🎉`);
    } catch (error) {
      resource.mutate((current) => current?.map((item) => (item.id === deal.id ? { ...item, stage: previous } : item)) ?? null);
      toast.error(error instanceof Error ? error.message : "Could not move the deal.");
    }
  }

  function onDrop(event: DragEvent, stage: DealStage) {
    event.preventDefault();
    setDragOver(null);
    const deal = (resource.data ?? []).find((item) => item.id === event.dataTransfer.getData("text/deal-id"));
    if (!deal || deal.stage === stage) return;
    if (stage === "lost") {
      setLostReason(LOST_REASONS[0]);
      setPendingLost(deal);
      return;
    }
    void move(deal, stage);
  }

  return (
    <>
      <AdminPageHeader
        title="Pipeline"
        description={`${openCount} open deal${openCount === 1 ? "" : "s"} worth ${formatInr(openValue)}. Drag a card to change its stage.`}
        onRefresh={resource.reload}
        refreshing={resource.refreshing}
      />
      <AdminError message={resource.error} />

      {resource.loading ? (
        <PageSkeleton />
      ) : (
        <div className="-mx-4 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <div className="flex min-w-max gap-3">
            {columns.map((column) => (
              <section
                key={column.value}
                onDragOver={(event) => {
                  event.preventDefault();
                  setDragOver(column.value);
                }}
                onDragLeave={() => setDragOver((current) => (current === column.value ? null : current))}
                onDrop={(event) => onDrop(event, column.value)}
                className={cn(
                  "flex w-64 shrink-0 flex-col rounded-xl border bg-muted/40 transition-colors",
                  dragOver === column.value && "border-ring bg-accent",
                )}
              >
                <header className="flex items-center gap-2 px-3 pt-3 pb-2">
                  <StageDot stage={column.value} />
                  <h2 className="text-sm font-medium">{column.label}</h2>
                  <span className="text-xs text-muted-foreground tabular-nums">{column.count}</span>
                  <span className="ml-auto text-xs text-muted-foreground tabular-nums">{formatInrCompact(column.total)}</span>
                </header>
                <div className="grid min-h-24 content-start gap-2 px-2 pb-2">
                  {column.items.map((deal) => (
                    <DealCard
                      key={deal.id}
                      deal={deal}
                      onDragStart={(event) => {
                        event.dataTransfer.setData("text/deal-id", deal.id);
                        event.dataTransfer.effectAllowed = "move";
                      }}
                    />
                  ))}
                  {column.count === 0 && (
                    <p className="rounded-lg border border-dashed px-3 py-6 text-center text-xs text-muted-foreground">Drop here</p>
                  )}
                  {column.hidden > 0 && (
                    <p className="px-1 text-xs text-muted-foreground">+{column.hidden} older</p>
                  )}
                </div>
              </section>
            ))}
          </div>
        </div>
      )}

      <Dialog open={pendingLost !== null} onOpenChange={(open) => !open && setPendingLost(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Mark as lost</DialogTitle>
            <DialogDescription>{pendingLost?.customer?.name} · {pendingLost?.title}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-2">
            <Label htmlFor="lost-reason">Why was it lost?</Label>
            <Select value={lostReason} onValueChange={setLostReason}>
              <SelectTrigger id="lost-reason" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LOST_REASONS.map((reason) => (
                  <SelectItem key={reason} value={reason}>
                    {reason}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPendingLost(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (pendingLost) void move(pendingLost, "lost", lostReason);
                setPendingLost(null);
              }}
            >
              Mark as lost
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
