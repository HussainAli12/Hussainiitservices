"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { CRM, crmWrite, fromLocalInput, toLocalInput } from "@/components/admin/crm/api";
import { ChannelIcon } from "@/components/admin/crm/parts";
import { EditorSheet, Field, FieldSection } from "@/components/admin/kit";
import { Input } from "@/components/admin/ui/input";
import { Label } from "@/components/admin/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/admin/ui/select";
import { Switch } from "@/components/admin/ui/switch";
import { Textarea } from "@/components/admin/ui/textarea";
import { useAdminResource } from "@/components/admin/use-admin-resource";
import { CHANNELS, DEAL_STAGES, LOST_REASONS, OPEN_STAGES, OUTCOMES, TASK_TYPES } from "@/lib/crm/config";
import type { Channel, CrmCustomerDetail, DealStage, Direction, TaskType } from "@/lib/crm/types";
import { cn } from "@/lib/utils";

export interface LogActivityTarget {
  customerId: string;
  channel?: Channel;
  contactId?: string | null;
  dealId?: string | null;
  /** The follow-up this activity fulfils; it is marked done on save. */
  taskId?: string | null;
}

const NONE = "__none";
const KEEP = "__keep";

const FOLLOW_UP_TITLE: Record<TaskType, string> = {
  call: "Call back",
  whatsapp: "Follow up on WhatsApp",
  email: "Follow up by email",
  instagram: "Follow up on Instagram",
  meeting: "Meeting",
  proposal: "Send proposal",
  other: "Follow up",
};

function at(daysFromNow: number, hour: number) {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  date.setHours(hour, 0, 0, 0);
  return date;
}

const QUICK_DUE = [
  { label: "Later today", date: () => new Date(Date.now() + 3 * 60 * 60 * 1000) },
  { label: "Tomorrow 11 AM", date: () => at(1, 11) },
  { label: "In 3 days", date: () => at(3, 11) },
  { label: "Next week", date: () => at(7, 11) },
];

const toTaskType = (channel: Channel): TaskType =>
  channel === "website" || channel === "note" ? "call" : (channel as TaskType);

export function LogActivitySheet({
  target,
  onOpenChange,
}: {
  target: LogActivityTarget | null;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <LogActivityForm
      // Remount per target so every open starts from fresh defaults.
      key={target ? `${target.customerId}-${target.channel}-${target.taskId}-${target.dealId}` : "closed"}
      target={target}
      onOpenChange={onOpenChange}
    />
  );
}

function LogActivityForm({
  target,
  onOpenChange,
}: {
  target: LogActivityTarget | null;
  onOpenChange: (open: boolean) => void;
}) {
  const detail = useAdminResource<CrmCustomerDetail>(target ? CRM.customer(target.customerId) : null);

  const contacts = target ? (detail.data?.contacts ?? []) : [];
  const openDeals = target ? (detail.data?.deals ?? []).filter((deal) => OPEN_STAGES.includes(deal.stage)) : [];

  const [channel, setChannel] = useState<Channel>(target?.channel ?? "call");
  const [direction, setDirection] = useState<Direction>("outbound");
  const [outcome, setOutcome] = useState<string | null>(null);
  const [summary, setSummary] = useState("");
  const [occurredAt, setOccurredAt] = useState(() => toLocalInput(new Date()));
  const [duration, setDuration] = useState("");
  const [contactId, setContactId] = useState<string | null>(target?.contactId ?? null);
  const [dealId, setDealId] = useState<string | null>(target?.dealId ?? null);
  const [stage, setStage] = useState<DealStage | null>(null);
  const [lostReason, setLostReason] = useState<string>(LOST_REASONS[0]);
  const [followUp, setFollowUp] = useState(true);
  const [taskType, setTaskType] = useState<TaskType>(toTaskType(target?.channel ?? "call"));
  const [taskTitle, setTaskTitle] = useState<string | null>(null);
  const [dueAt, setDueAt] = useState(() => toLocalInput(at(1, 11)));
  const [saving, setSaving] = useState(false);

  // Fall back to the primary contact / the only open deal once the customer has loaded.
  const effectiveContact = contactId ?? contacts.find((contact) => contact.is_primary)?.id ?? contacts[0]?.id ?? null;
  const effectiveDeal = dealId ?? (openDeals.length === 1 ? openDeals[0].id : null);
  const outcomes = OUTCOMES[channel] ?? [];

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!target) return;
    if (!outcome && !summary.trim()) {
      toast.error("Pick an outcome or write what happened.");
      return;
    }
    setSaving(true);
    try {
      await crmWrite("POST", CRM.activities, {
        customer_id: target.customerId,
        contact_id: effectiveContact,
        deal_id: effectiveDeal,
        channel,
        direction,
        outcome,
        summary,
        duration_minutes: duration ? Number(duration) : null,
        occurred_at: fromLocalInput(occurredAt),
        deal_stage: effectiveDeal && stage ? stage : undefined,
        lost_reason: stage === "lost" ? lostReason : undefined,
        complete_task_id: target.taskId ?? undefined,
        follow_up: followUp
          ? {
              title: taskTitle ?? FOLLOW_UP_TITLE[taskType],
              type: taskType,
              due_at: fromLocalInput(dueAt),
            }
          : undefined,
      });
      toast.success("Activity logged", { description: followUp ? "Follow-up scheduled." : undefined });
      onOpenChange(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not log the activity.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <EditorSheet
      open={target !== null}
      onOpenChange={onOpenChange}
      title="Log activity"
      description={detail.data ? detail.data.customer.name : "Record what happened and what comes next."}
      formKey="log-activity"
      onSubmit={submit}
      saving={saving}
      submitLabel="Save activity"
      size="md"
    >
      <FieldSection title="What happened">
        <div className="grid gap-2">
          <Label>Channel</Label>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
            {CHANNELS.filter((entry) => entry.loggable).map((entry) => (
              <button
                key={entry.value}
                type="button"
                onClick={() => {
                  setChannel(entry.value);
                  setOutcome(null);
                  setTaskType(toTaskType(entry.value));
                }}
                aria-pressed={channel === entry.value}
                className={cn(
                  "flex flex-col items-center gap-1.5 rounded-lg border px-2 py-2.5 text-xs transition-colors",
                  channel === entry.value ? "border-primary bg-primary/5 font-medium" : "hover:bg-muted",
                )}
              >
                <ChannelIcon channel={entry.value} size="sm" />
                {entry.label}
              </button>
            ))}
          </div>
        </div>

        {channel !== "note" && (
          <div className="inline-flex w-fit rounded-lg border bg-muted/40 p-0.5 text-xs">
            {(["outbound", "inbound"] as const).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setDirection(value)}
                className={cn(
                  "rounded-md px-3 py-1.5 transition-colors",
                  direction === value ? "bg-background font-medium shadow-xs" : "text-muted-foreground",
                )}
              >
                {value === "outbound" ? "We reached out" : "They contacted us"}
              </button>
            ))}
          </div>
        )}

        {outcomes.length > 0 && (
          <div className="grid gap-2">
            <Label>Outcome</Label>
            <div className="flex flex-wrap gap-1.5">
              {outcomes.map((entry) => (
                <button
                  key={entry.value}
                  type="button"
                  onClick={() => setOutcome(outcome === entry.value ? null : entry.value)}
                  aria-pressed={outcome === entry.value}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs transition-colors",
                    outcome === entry.value
                      ? entry.tone === "negative"
                        ? "border-amber-300 bg-amber-50 font-medium text-amber-900"
                        : entry.tone === "positive"
                          ? "border-emerald-300 bg-emerald-50 font-medium text-emerald-800"
                          : "border-primary bg-primary text-primary-foreground"
                      : "hover:bg-muted",
                  )}
                >
                  {entry.value}
                </button>
              ))}
            </div>
          </div>
        )}

        <Field label={channel === "note" ? "Note" : "What did they say?"}>
          {(id) => (
            <Textarea
              id={id}
              rows={4}
              value={summary}
              onChange={(event) => setSummary(event.target.value)}
              placeholder={
                channel === "note"
                  ? "Anything worth remembering about this customer"
                  : "e.g. Interested in an e-commerce site, wants a quote under ₹80k, decision after Diwali"
              }
            />
          )}
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="When">
            {(id) => (
              <Input id={id} type="datetime-local" value={occurredAt} onChange={(event) => setOccurredAt(event.target.value)} />
            )}
          </Field>
          {(channel === "call" || channel === "meeting") && (
            <Field label="Duration (minutes)">
              {(id) => (
                <Input id={id} type="number" min={0} value={duration} onChange={(event) => setDuration(event.target.value)} />
              )}
            </Field>
          )}
          {contacts.length > 1 && (
            <Field label="Spoke with">
              {(id) => (
                <Select value={effectiveContact ?? NONE} onValueChange={(value) => setContactId(value === NONE ? null : value)}>
                  <SelectTrigger id={id} className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {contacts.map((contact) => (
                      <SelectItem key={contact.id} value={contact.id}>
                        {contact.name}
                        {contact.role ? ` · ${contact.role}` : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </Field>
          )}
        </div>
      </FieldSection>

      {openDeals.length > 0 && (
        <FieldSection title="Deal">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="About deal">
              {(id) => (
                <Select value={effectiveDeal ?? NONE} onValueChange={(value) => setDealId(value === NONE ? null : value)}>
                  <SelectTrigger id={id} className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={NONE}>No specific deal</SelectItem>
                    {openDeals.map((deal) => (
                      <SelectItem key={deal.id} value={deal.id}>
                        {deal.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </Field>
            {effectiveDeal && (
              <Field label="Move deal to">
                {(id) => (
                  <Select value={stage ?? KEEP} onValueChange={(value) => setStage(value === KEEP ? null : (value as DealStage))}>
                    <SelectTrigger id={id} className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={KEEP}>Keep current stage</SelectItem>
                      {DEAL_STAGES.map((entry) => (
                        <SelectItem key={entry.value} value={entry.value}>
                          {entry.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </Field>
            )}
            {stage === "lost" && (
              <Field label="Lost reason">
                {(id) => (
                  <Select value={lostReason} onValueChange={setLostReason}>
                    <SelectTrigger id={id} className="w-full">
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
                )}
              </Field>
            )}
          </div>
        </FieldSection>
      )}

      <FieldSection title="Next step">
        <div className="flex items-center justify-between rounded-lg border px-4 py-3">
          <div>
            <Label htmlFor="log-follow-up">Schedule a follow-up</Label>
            <p className="text-xs text-muted-foreground">So this lead doesn&apos;t go cold.</p>
          </div>
          <Switch id="log-follow-up" checked={followUp} onCheckedChange={setFollowUp} />
        </div>
        {followUp && (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Type">
                {(id) => (
                  <Select value={taskType} onValueChange={(value) => setTaskType(value as TaskType)}>
                    <SelectTrigger id={id} className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TASK_TYPES.map((entry) => (
                        <SelectItem key={entry.value} value={entry.value}>
                          {entry.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </Field>
              <Field label="Title">
                {(id) => (
                  <Input
                    id={id}
                    value={taskTitle ?? FOLLOW_UP_TITLE[taskType]}
                    onChange={(event) => setTaskTitle(event.target.value)}
                  />
                )}
              </Field>
            </div>
            <Field label="Due">
              {(id) => (
                <div className="grid gap-2">
                  <div className="flex flex-wrap gap-1.5">
                    {QUICK_DUE.map((entry) => (
                      <button
                        key={entry.label}
                        type="button"
                        onClick={() => setDueAt(toLocalInput(entry.date()))}
                        className="rounded-full border px-3 py-1 text-xs hover:bg-muted"
                      >
                        {entry.label}
                      </button>
                    ))}
                  </div>
                  <Input id={id} type="datetime-local" required value={dueAt} onChange={(event) => setDueAt(event.target.value)} />
                </div>
              )}
            </Field>
          </>
        )}
      </FieldSection>
    </EditorSheet>
  );
}
