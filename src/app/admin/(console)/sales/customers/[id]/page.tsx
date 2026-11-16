"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarClock,
  Check,
  Globe,
  MapPin,
  MessageSquarePlus,
  MoreHorizontal,
  Pencil,
  Plus,
  Star,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { CRM, crmWrite } from "@/components/admin/crm/api";
import { ContactSheet, CustomerSheet, DealSheet, TaskSheet } from "@/components/admin/crm/editors";
import { LogActivitySheet, type LogActivityTarget } from "@/components/admin/crm/LogActivitySheet";
import {
  ChannelIcon,
  ContactActions,
  DueLabel,
  LifecycleBadge,
  OutcomeBadge,
  StageDot,
} from "@/components/admin/crm/parts";
import { AdminError, EmptyState, PageSkeleton } from "@/components/admin/shell/AdminPageHeader";
import { InstagramIcon } from "@/components/ui/SocialIcons";
import { Badge } from "@/components/admin/ui/badge";
import { Button } from "@/components/admin/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/admin/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/admin/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/admin/ui/select";
import { useAdminDelete } from "@/components/admin/use-admin-delete";
import { useAdminResource } from "@/components/admin/use-admin-resource";
import { formatRelative } from "@/lib/admin/format";
import {
  DEAL_STAGES,
  OPEN_STAGES,
  channelLabel,
  formatInr,
  instagramUrl,
  sourceLabel,
} from "@/lib/crm/config";
import type { CrmActivity, CrmContact, CrmCustomerDetail, CrmDeal, CrmTask, DealStage } from "@/lib/crm/types";
import { cn, normalizeExternalUrl } from "@/lib/utils";

function fail(error: unknown) {
  toast.error(error instanceof Error ? error.message : "Something went wrong.");
}

function Timeline({
  activities,
  deals,
  contacts,
  onDelete,
}: {
  activities: CrmActivity[];
  deals: CrmDeal[];
  contacts: CrmContact[];
  onDelete: (activity: CrmActivity) => void;
}) {
  const dealsById = new Map(deals.map((deal) => [deal.id, deal]));
  const contactsById = new Map(contacts.map((contact) => [contact.id, contact]));

  return (
    <ol className="relative">
      {activities.map((activity, index) => {
        const deal = activity.deal_id ? dealsById.get(activity.deal_id) : undefined;
        const contact = activity.contact_id ? contactsById.get(activity.contact_id) : undefined;
        const when = new Date(activity.occurred_at);
        return (
          <li key={activity.id} className="group relative flex gap-3 pb-6 last:pb-0">
            {index < activities.length - 1 && <span className="absolute top-9 bottom-1 left-4 w-px bg-border" aria-hidden />}
            <ChannelIcon channel={activity.channel} />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="text-sm font-medium">{channelLabel(activity.channel)}</span>
                {activity.channel !== "note" && (
                  <span className="text-xs text-muted-foreground">
                    {activity.direction === "inbound" ? "← They reached out" : "→ We reached out"}
                  </span>
                )}
                <OutcomeBadge channel={activity.channel} outcome={activity.outcome} />
                {activity.duration_minutes ? (
                  <span className="text-xs text-muted-foreground">{activity.duration_minutes} min</span>
                ) : null}
                <span
                  className="ml-auto text-xs text-muted-foreground tabular-nums"
                  title={when.toLocaleString("en-IN")}
                >
                  {formatRelative(when)}
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      className="opacity-0 group-hover:opacity-100 focus-visible:opacity-100 data-[state=open]:opacity-100"
                      aria-label="Activity actions"
                    >
                      <MoreHorizontal />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem variant="destructive" onSelect={() => onDelete(activity)}>
                      <Trash2 />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              {activity.summary && (
                <p className="mt-1.5 rounded-lg bg-muted/50 px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap">
                  {activity.summary}
                </p>
              )}
              <p className="mt-1.5 flex flex-wrap gap-x-2 text-xs text-muted-foreground">
                <span>
                  {when.toLocaleString("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" })}
                </span>
                {contact && <span>· with {contact.name}</span>}
                {deal && <span>· {deal.title}</span>}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function DealRow({ deal, onEdit }: { deal: CrmDeal; onEdit: () => void }) {

  async function move(stage: DealStage) {
    try {
      await crmWrite("PUT", CRM.deals, { id: deal.id, stage });
      toast.success(stage === "won" ? "Deal won 🎉" : "Stage updated");
    } catch (error) {
      fail(error);
    }
  }

  return (
    <div className="rounded-lg border p-3">
      <div className="flex items-start justify-between gap-2">
        <button type="button" onClick={onEdit} className="min-w-0 text-left">
          <p className="truncate text-sm font-medium hover:underline">{deal.title}</p>
          <p className="text-xs text-muted-foreground">
            {formatInr(deal.value_inr)}
            {deal.expected_close && ` · close ${new Date(deal.expected_close).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`}
          </p>
        </button>
        <Button variant="ghost" size="icon-xs" onClick={onEdit} aria-label={`Edit ${deal.title}`}>
          <Pencil />
        </Button>
      </div>
      {deal.services.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {deal.services.map((service) => (
            <Badge key={service} variant="secondary" className="font-normal">
              {service}
            </Badge>
          ))}
        </div>
      )}
      <Select value={deal.stage} onValueChange={(value) => void move(value as DealStage)}>
        <SelectTrigger size="sm" className="mt-3 w-full shadow-none">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {DEAL_STAGES.map((stage) => (
            <SelectItem key={stage.value} value={stage.value}>
              <StageDot stage={stage.value} />
              {stage.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {deal.stage === "lost" && deal.lost_reason && (
        <p className="mt-2 text-xs text-muted-foreground">Lost: {deal.lost_reason}</p>
      )}
    </div>
  );
}

function TaskRow({ task, onLog, onEdit }: { task: CrmTask; onLog: () => void; onEdit: () => void }) {
  const done = Boolean(task.done_at);

  async function toggle() {
    try {
      await crmWrite("PUT", CRM.tasks, { id: task.id, done: !done });
    } catch (error) {
      fail(error);
    }
  }

  return (
    <div className="group flex items-start gap-3 rounded-lg px-2 py-2 hover:bg-muted/50">
      <button
        type="button"
        onClick={() => void toggle()}
        aria-label={done ? "Mark as not done" : "Mark as done"}
        className={cn(
          "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border transition-colors",
          done ? "border-success bg-success text-white" : "hover:border-foreground",
        )}
      >
        {done && <Check className="size-3" />}
      </button>
      <button type="button" onClick={onEdit} className="min-w-0 flex-1 text-left">
        <p className={cn("truncate text-sm", done && "text-muted-foreground line-through")}>{task.title}</p>
        <p className="text-xs text-muted-foreground">
          {done ? `Done ${formatRelative(task.done_at!)}` : <DueLabel dueAt={task.due_at} />}
        </p>
      </button>
      {!done && (
        <Button variant="outline" size="xs" onClick={onLog} className="opacity-0 group-hover:opacity-100 focus-visible:opacity-100">
          Log
        </Button>
      )}
    </div>
  );
}

export default function CustomerPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const detail = useAdminResource<CrmCustomerDetail>(CRM.customer(id));

  const [logTarget, setLogTarget] = useState<LogActivityTarget | null>(null);
  const [editingCustomer, setEditingCustomer] = useState(false);
  const [contactSheet, setContactSheet] = useState<{ contact: CrmContact | null } | null>(null);
  const [dealSheet, setDealSheet] = useState<{ deal: CrmDeal | null } | null>(null);
  const [taskSheet, setTaskSheet] = useState<{ task: CrmTask | null } | null>(null);
  const [showDone, setShowDone] = useState(false);

  const deletion = useAdminDelete(() => {
    router.push("/admin/sales/customers");
  });

  if (detail.loading) return <PageSkeleton />;
  if (!detail.data) {
    return (
      <>
        <AdminError message={detail.error} />
        <Button variant="outline" asChild>
          <Link href="/admin/sales/customers">
            <ArrowLeft />
            Back to customers
          </Link>
        </Button>
      </>
    );
  }

  const { customer, contacts, deals, activities, tasks } = detail.data;
  const primary = contacts.find((contact) => contact.is_primary) ?? contacts[0] ?? null;
  const openTasks = tasks.filter((task) => !task.done_at);
  const doneTasks = tasks.filter((task) => task.done_at);
  const openDeals = deals.filter((deal) => OPEN_STAGES.includes(deal.stage));
  const lastActivity = activities[0];
  const nextTask = openTasks[0];
  const website = normalizeExternalUrl(customer.website);
  const instagram = instagramUrl(customer.instagram);

  async function deleteActivity(activity: CrmActivity) {
    try {
      await crmWrite("DELETE", CRM.activities, { id: activity.id });
      toast.success("Activity deleted");
    } catch (error) {
      fail(error);
    }
  }

  async function deleteContact(contact: CrmContact) {
    try {
      await crmWrite("DELETE", CRM.contacts, { id: contact.id });
      toast.success("Contact removed");
    } catch (error) {
      fail(error);
    }
  }

  return (
    <>
      <Link
        href="/admin/sales/customers"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Customers
      </Link>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">{customer.name}</h1>
            <LifecycleBadge lifecycle={customer.lifecycle} />
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {[customer.industry, customer.city, `Source: ${sourceLabel(customer.source)}`]
              .filter(Boolean)
              .join(" · ")}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <ContactActions
            contact={primary}
            customerInstagram={customer.instagram}
            size="icon-sm"
            onLog={(channel) => setLogTarget({ customerId: customer.id, channel, contactId: primary?.id })}
          />
          <Button onClick={() => setLogTarget({ customerId: customer.id })}>
            <MessageSquarePlus />
            Log activity
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Customer actions">
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem onSelect={() => setEditingCustomer(true)}>
                <Pencil />
                Edit details
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onSelect={() =>
                  deletion.request({
                    endpoint: CRM.customers,
                    id: customer.id,
                    label: customer.name,
                    title: "Delete customer and all their history?",
                  })
                }
              >
                <Trash2 />
                Delete customer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <AdminError message={detail.error} />

      {/* Where the conversation stands, at a glance. */}
      <div className="mb-6 grid gap-3 md:grid-cols-2 [&>*]:min-w-0">
        <Card className="flex-row items-center gap-3 px-4 py-3">
          {lastActivity ? (
            <>
              <ChannelIcon channel={lastActivity.channel} />
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">
                  Last contact · {channelLabel(lastActivity.channel)} {formatRelative(lastActivity.occurred_at)}
                </p>
                <p className="truncate text-sm font-medium">
                  {lastActivity.outcome}
                  {lastActivity.outcome && lastActivity.summary && " — "}
                  <span className="font-normal text-muted-foreground">{lastActivity.summary}</span>
                </p>
              </div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">No contact logged yet.</p>
          )}
        </Card>
        <Card className="flex-row items-center gap-3 px-4 py-3">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <CalendarClock className="size-4" />
          </span>
          {nextTask ? (
            <div className="min-w-0 flex-1">
              <p className="text-xs text-muted-foreground">
                Next step · <DueLabel dueAt={nextTask.due_at} />
              </p>
              <p className="truncate text-sm font-medium">{nextTask.title}</p>
            </div>
          ) : (
            <p className="flex-1 text-sm text-muted-foreground">No follow-up scheduled.</p>
          )}
          <Button variant="outline" size="sm" onClick={() => setTaskSheet({ task: null })}>
            <Plus />
            Follow-up
          </Button>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3 [&>*]:min-w-0">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Conversation</CardTitle>
            <CardAction>
              <Button variant="ghost" size="sm" onClick={() => setLogTarget({ customerId: customer.id, channel: "note" })}>
                <Plus />
                Note
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            {activities.length === 0 ? (
              <EmptyState
                icon={MessageSquarePlus}
                title="No activity yet"
                description="Log the first call, WhatsApp, email or Instagram message."
                action={<Button onClick={() => setLogTarget({ customerId: customer.id })}>Log activity</Button>}
              />
            ) : (
              <Timeline activities={activities} deals={deals} contacts={contacts} onDelete={(activity) => void deleteActivity(activity)} />
            )}
          </CardContent>
        </Card>

        <div className="grid content-start gap-6">
          <Card className="gap-4">
            <CardHeader>
              <CardTitle>Deals</CardTitle>
              <CardAction>
                <Button variant="ghost" size="sm" onClick={() => setDealSheet({ deal: null })}>
                  <Plus />
                  Deal
                </Button>
              </CardAction>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {deals.length === 0 ? (
                <p className="text-sm text-muted-foreground">No deals yet.</p>
              ) : (
                deals.map((deal) => <DealRow key={deal.id} deal={deal} onEdit={() => setDealSheet({ deal })} />)
              )}
            </CardContent>
          </Card>

          <Card className="gap-3">
            <CardHeader>
              <CardTitle>Follow-ups</CardTitle>
              <CardAction>
                <Button variant="ghost" size="sm" onClick={() => setTaskSheet({ task: null })}>
                  <Plus />
                  Add
                </Button>
              </CardAction>
            </CardHeader>
            <CardContent className="flex flex-col gap-0.5 px-4">
              {openTasks.length === 0 && <p className="px-2 text-sm text-muted-foreground">Nothing scheduled.</p>}
              {openTasks.map((task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  onEdit={() => setTaskSheet({ task })}
                  onLog={() =>
                    setLogTarget({
                      customerId: customer.id,
                      taskId: task.id,
                      dealId: task.deal_id,
                      channel: task.type === "proposal" || task.type === "other" ? "email" : task.type,
                    })
                  }
                />
              ))}
              {doneTasks.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowDone((value) => !value)}
                  className="mt-1 px-2 text-left text-xs text-muted-foreground hover:text-foreground"
                >
                  {showDone ? "Hide" : "Show"} {doneTasks.length} completed
                </button>
              )}
              {showDone &&
                doneTasks.map((task) => (
                  <TaskRow key={task.id} task={task} onEdit={() => setTaskSheet({ task })} onLog={() => {}} />
                ))}
            </CardContent>
          </Card>

          <Card className="gap-3">
            <CardHeader>
              <CardTitle>Contacts</CardTitle>
              <CardAction>
                <Button variant="ghost" size="sm" onClick={() => setContactSheet({ contact: null })}>
                  <Plus />
                  Add
                </Button>
              </CardAction>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {contacts.length === 0 && <p className="text-sm text-muted-foreground">No contact person saved.</p>}
              {contacts.map((contact) => (
                <div key={contact.id} className="rounded-lg border p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="flex items-center gap-1.5 text-sm font-medium">
                        {contact.name}
                        {contact.is_primary && <Star className="size-3 fill-amber-400 text-amber-400" aria-label="Main contact" />}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {[contact.role, contact.phone, contact.email].filter(Boolean).join(" · ") || "No details"}
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-xs" aria-label={`Actions for ${contact.name}`}>
                          <MoreHorizontal />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onSelect={() => setContactSheet({ contact })}>
                          <Pencil />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem variant="destructive" onSelect={() => void deleteContact(contact)}>
                          <Trash2 />
                          Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="mt-2">
                    <ContactActions
                      contact={contact}
                      size="icon-sm"
                      onLog={(channel) => setLogTarget({ customerId: customer.id, channel, contactId: contact.id })}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="gap-3">
            <CardHeader>
              <CardTitle>Details</CardTitle>
              <CardAction>
                <Button variant="ghost" size="sm" onClick={() => setEditingCustomer(true)}>
                  <Pencil />
                  Edit
                </Button>
              </CardAction>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 text-sm">
              {website && (
                <a href={website} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:underline">
                  <Globe className="size-4 text-muted-foreground" />
                  <span className="truncate">{customer.website}</span>
                </a>
              )}
              {instagram && (
                <a href={instagram} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:underline">
                  <InstagramIcon className="size-4 text-muted-foreground" />
                  <span className="truncate">{customer.instagram}</span>
                </a>
              )}
              {(customer.address || customer.city) && (
                <p className="flex items-start gap-2">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                  {[customer.address, customer.city, customer.country].filter(Boolean).join(", ")}
                </p>
              )}
              {customer.notes && <p className="rounded-lg bg-muted/50 px-3 py-2 whitespace-pre-wrap">{customer.notes}</p>}
              <p className="text-xs text-muted-foreground">
                Added {formatRelative(customer.created_at)} · {openDeals.length} open deal{openDeals.length === 1 ? "" : "s"}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <LogActivitySheet target={logTarget} onOpenChange={(open) => !open && setLogTarget(null)} />
      <CustomerSheet open={editingCustomer} onOpenChange={setEditingCustomer} customer={customer} />
      <ContactSheet
        open={contactSheet !== null}
        onOpenChange={(open) => !open && setContactSheet(null)}
        customerId={customer.id}
        contact={contactSheet?.contact}
      />
      <DealSheet
        open={dealSheet !== null}
        onOpenChange={(open) => !open && setDealSheet(null)}
        customerId={customer.id}
        deal={dealSheet?.deal}
      />
      <TaskSheet
        open={taskSheet !== null}
        onOpenChange={(open) => !open && setTaskSheet(null)}
        customerId={customer.id}
        deals={openDeals}
        task={taskSheet?.task}
      />
      {deletion.dialog}
    </>
  );
}
