"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CRM, crmWrite, fromLocalInput, toLocalInput } from "@/components/admin/crm/api";
import { ServicesPicker } from "@/components/admin/crm/parts";
import { EditorSheet, Field, FieldSection } from "@/components/admin/kit";
import { Input } from "@/components/admin/ui/input";
import { Label } from "@/components/admin/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/admin/ui/select";
import { Switch } from "@/components/admin/ui/switch";
import { Textarea } from "@/components/admin/ui/textarea";
import { DEAL_STAGES, LEAD_SOURCES, LIFECYCLES, LOST_REASONS, TASK_TYPES } from "@/lib/crm/config";
import type {
  CrmContact,
  CrmCustomer,
  CrmDeal,
  CrmTask,
  DealStage,
  Lifecycle,
  TaskType,
} from "@/lib/crm/types";

function fail(error: unknown, fallback: string) {
  toast.error(error instanceof Error ? error.message : fallback);
}

function text(form: FormData, key: string) {
  return String(form.get(key) ?? "");
}

function SimpleSelect<T extends string>({
  id,
  value,
  onChange,
  options,
}: {
  id: string;
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <Select value={value} onValueChange={(next) => onChange(next as T)}>
      <SelectTrigger id={id} className="w-full">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

/* ----------------------------------------------------------------------------------------------
 * Customer: create (with primary contact + first deal) or edit details.
 * -------------------------------------------------------------------------------------------- */

export function CustomerSheet({
  open,
  onOpenChange,
  customer,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer?: CrmCustomer | null;
}) {
  return (
    <CustomerForm
      key={open ? (customer?.id ?? "new") : "closed"}
      open={open}
      onOpenChange={onOpenChange}
      customer={customer ?? null}
    />
  );
}

function CustomerForm({
  open,
  onOpenChange,
  customer,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer: CrmCustomer | null;
}) {
  const router = useRouter();
  const [lifecycle, setLifecycle] = useState<Lifecycle>(customer?.lifecycle ?? "lead");
  const [source, setSource] = useState(customer?.source ?? "other");
  const [addDeal, setAddDeal] = useState(true);
  const [services, setServices] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const fields = {
      name: text(form, "name"),
      industry: text(form, "industry"),
      city: text(form, "city"),
      country: text(form, "country"),
      address: text(form, "address"),
      website: text(form, "website"),
      instagram: text(form, "instagram"),
      notes: text(form, "notes"),
      lifecycle,
      source,
    };
    setSaving(true);
    try {
      if (customer) {
        await crmWrite("PUT", CRM.customers, { id: customer.id, ...fields });
        toast.success("Customer updated");
        onOpenChange(false);
      } else {
        const created = await crmWrite<CrmCustomer>("POST", CRM.customers, {
          ...fields,
          contact: {
            name: text(form, "contact_name") || fields.name,
            role: text(form, "contact_role"),
            phone: text(form, "contact_phone"),
            whatsapp: text(form, "contact_whatsapp") || text(form, "contact_phone"),
            email: text(form, "contact_email"),
          },
          deal: addDeal
            ? {
                title: text(form, "deal_title") || services.join(" + ") || "New enquiry",
                services,
                value_inr: Number(text(form, "deal_value")) || 0,
                        }
            : undefined,
        });
        toast.success("Customer added");
        onOpenChange(false);
        router.push(`/admin/sales/customers/${created.id}`);
      }
    } catch (error) {
      fail(error, "Could not save the customer.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <EditorSheet
      open={open}
      onOpenChange={onOpenChange}
      title={customer ? "Edit customer" : "New customer"}
      description={customer ? customer.name : "Business details, the main contact person, and what they need."}
      formKey={customer?.id ?? "new-customer"}
      onSubmit={submit}
      saving={saving}
      submitLabel={customer ? "Save changes" : "Add customer"}
    >
      <FieldSection title="Business">
        <Field label="Business or customer name">
          {(id) => <Input id={id} name="name" required autoFocus defaultValue={customer?.name ?? ""} placeholder="e.g. Safinat Group" />}
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Industry">
            {(id) => <Input id={id} name="industry" defaultValue={customer?.industry ?? ""} placeholder="Retail, real estate…" />}
          </Field>
          <Field label="Source">
            {(id) => <SimpleSelect id={id} value={source} onChange={setSource} options={LEAD_SOURCES} />}
          </Field>
          <Field label="City">{(id) => <Input id={id} name="city" defaultValue={customer?.city ?? ""} placeholder="Ujjain" />}</Field>
          <Field label="Country">{(id) => <Input id={id} name="country" defaultValue={customer?.country ?? "India"} />}</Field>
          <Field label="Website">
            {(id) => <Input id={id} name="website" defaultValue={customer?.website ?? ""} placeholder="example.com" />}
          </Field>
          <Field label="Instagram">
            {(id) => <Input id={id} name="instagram" defaultValue={customer?.instagram ?? ""} placeholder="@handle" />}
          </Field>
          {customer && (
            <Field label="Status">
              {(id) => <SimpleSelect id={id} value={lifecycle} onChange={setLifecycle} options={LIFECYCLES} />}
            </Field>
          )}
        </div>
        <Field label="Address">{(id) => <Input id={id} name="address" defaultValue={customer?.address ?? ""} />}</Field>
        <Field label="Notes">
          {(id) => <Textarea id={id} name="notes" rows={3} defaultValue={customer?.notes ?? ""} placeholder="Anything the team should know" />}
        </Field>
      </FieldSection>

      {!customer && (
        <FieldSection title="Main contact" description="The person you speak to. Leave the name blank to use the business name.">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name">{(id) => <Input id={id} name="contact_name" placeholder="Contact person" />}</Field>
            <Field label="Role">{(id) => <Input id={id} name="contact_role" placeholder="Owner, manager…" />}</Field>
            <Field label="Phone">{(id) => <Input id={id} name="contact_phone" type="tel" placeholder="98765 43210" />}</Field>
            <Field label="WhatsApp" hint="Leave blank if same as phone.">
              {(id) => <Input id={id} name="contact_whatsapp" type="tel" />}
            </Field>
            <Field label="Email" className="sm:col-span-2">
              {(id) => <Input id={id} name="contact_email" type="email" placeholder="name@company.com" />}
            </Field>
          </div>
        </FieldSection>
      )}

      {!customer && (
        <FieldSection title="Opportunity">
          <div className="flex items-center justify-between rounded-lg border px-4 py-3">
            <div>
              <Label htmlFor="customer-add-deal">Create a deal</Label>
              <p className="text-xs text-muted-foreground">Track it on the pipeline from today.</p>
            </div>
            <Switch id="customer-add-deal" checked={addDeal} onCheckedChange={setAddDeal} />
          </div>
          {addDeal && (
            <>
              <div className="grid gap-2">
                <Label>Interested in</Label>
                <ServicesPicker value={services} onChange={setServices} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Deal title" hint="Defaults to the services picked.">
                  {(id) => <Input id={id} name="deal_title" placeholder="Website + SEO" />}
                </Field>
                <Field label="Estimated value (₹)">
                  {(id) => <Input id={id} name="deal_value" type="number" min={0} step={500} placeholder="50000" />}
                </Field>
              </div>
            </>
          )}
        </FieldSection>
      )}
    </EditorSheet>
  );
}

/* ----------------------------------------------------------------------------------------------
 * Contact person
 * -------------------------------------------------------------------------------------------- */

export function ContactSheet({
  open,
  onOpenChange,
  customerId,
  contact,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customerId: string;
  contact?: CrmContact | null;
}) {
  return (
    <ContactForm
      key={open ? (contact?.id ?? "new") : "closed"}
      open={open}
      onOpenChange={onOpenChange}
      customerId={customerId}
      contact={contact ?? null}
    />
  );
}

function ContactForm({
  open,
  onOpenChange,
  customerId,
  contact,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customerId: string;
  contact: CrmContact | null;
}) {
  const [primary, setPrimary] = useState(contact?.is_primary ?? false);
  const [saving, setSaving] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const fields = {
      name: text(form, "name"),
      role: text(form, "role"),
      phone: text(form, "phone"),
      whatsapp: text(form, "whatsapp"),
      email: text(form, "email"),
      instagram: text(form, "instagram"),
      notes: text(form, "notes"),
      is_primary: primary,
    };
    setSaving(true);
    try {
      if (contact) await crmWrite("PUT", CRM.contacts, { id: contact.id, ...fields });
      else await crmWrite("POST", CRM.contacts, { customer_id: customerId, ...fields });
      toast.success(contact ? "Contact updated" : "Contact added");
      onOpenChange(false);
    } catch (error) {
      fail(error, "Could not save the contact.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <EditorSheet
      open={open}
      onOpenChange={onOpenChange}
      title={contact ? "Edit contact" : "Add contact"}
      formKey={contact?.id ?? "new-contact"}
      onSubmit={submit}
      saving={saving}
      submitLabel={contact ? "Save changes" : "Add contact"}
      size="md"
    >
      <FieldSection title="Person">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Name">{(id) => <Input id={id} name="name" required autoFocus defaultValue={contact?.name ?? ""} />}</Field>
          <Field label="Role">{(id) => <Input id={id} name="role" defaultValue={contact?.role ?? ""} placeholder="Owner, manager…" />}</Field>
          <Field label="Phone">{(id) => <Input id={id} name="phone" type="tel" defaultValue={contact?.phone ?? ""} />}</Field>
          <Field label="WhatsApp">{(id) => <Input id={id} name="whatsapp" type="tel" defaultValue={contact?.whatsapp ?? ""} />}</Field>
          <Field label="Email">{(id) => <Input id={id} name="email" type="email" defaultValue={contact?.email ?? ""} />}</Field>
          <Field label="Instagram">{(id) => <Input id={id} name="instagram" defaultValue={contact?.instagram ?? ""} placeholder="@handle" />}</Field>
        </div>
        <Field label="Notes">{(id) => <Textarea id={id} name="notes" rows={2} defaultValue={contact?.notes ?? ""} />}</Field>
        <div className="flex items-center justify-between rounded-lg border px-4 py-3">
          <div>
            <Label htmlFor="contact-primary">Main contact</Label>
            <p className="text-xs text-muted-foreground">Used for the quick call and WhatsApp buttons.</p>
          </div>
          <Switch id="contact-primary" checked={primary} onCheckedChange={setPrimary} />
        </div>
      </FieldSection>
    </EditorSheet>
  );
}

/* ----------------------------------------------------------------------------------------------
 * Deal
 * -------------------------------------------------------------------------------------------- */

export function DealSheet({
  open,
  onOpenChange,
  customerId,
  deal,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customerId: string;
  deal?: CrmDeal | null;
}) {
  return (
    <DealForm key={open ? (deal?.id ?? "new") : "closed"} open={open} onOpenChange={onOpenChange} customerId={customerId} deal={deal ?? null} />
  );
}

function DealForm({
  open,
  onOpenChange,
  customerId,
  deal,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customerId: string;
  deal: CrmDeal | null;
}) {
  const [services, setServices] = useState<string[]>(deal?.services ?? []);
  const [stage, setStage] = useState<DealStage>(deal?.stage ?? "new");
  const [lostReason, setLostReason] = useState(deal?.lost_reason ?? LOST_REASONS[0]);
  const [saving, setSaving] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const fields = {
      title: text(form, "title") || services.join(" + "),
      services,
      value_inr: Number(text(form, "value_inr")) || 0,
      expected_close: text(form, "expected_close"),
      notes: text(form, "notes"),
      stage,
      lost_reason: stage === "lost" ? lostReason : null,
    };
    setSaving(true);
    try {
      if (deal) await crmWrite("PUT", CRM.deals, { id: deal.id, ...fields });
      else await crmWrite("POST", CRM.deals, { customer_id: customerId, ...fields });
      toast.success(deal ? "Deal updated" : "Deal created");
      onOpenChange(false);
    } catch (error) {
      fail(error, "Could not save the deal.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <EditorSheet
      open={open}
      onOpenChange={onOpenChange}
      title={deal ? "Edit deal" : "New deal"}
      formKey={deal?.id ?? "new-deal"}
      onSubmit={submit}
      saving={saving}
      submitLabel={deal ? "Save changes" : "Create deal"}
      size="md"
    >
      <FieldSection title="Opportunity">
        <div className="grid gap-2">
          <Label>Services</Label>
          <ServicesPicker value={services} onChange={setServices} />
        </div>
        <Field label="Title" hint="Defaults to the services picked.">
          {(id) => <Input id={id} name="title" defaultValue={deal?.title ?? ""} placeholder="Website + SEO" />}
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Value (₹)">
            {(id) => <Input id={id} name="value_inr" type="number" min={0} step={500} defaultValue={deal ? String(deal.value_inr) : ""} />}
          </Field>
          <Field label="Expected close">
            {(id) => <Input id={id} name="expected_close" type="date" defaultValue={deal?.expected_close ?? ""} />}
          </Field>
          <Field label="Stage">
            {(id) => <SimpleSelect id={id} value={stage} onChange={setStage} options={DEAL_STAGES} />}
          </Field>
          {stage === "lost" && (
            <Field label="Lost reason">
              {(id) => (
                <SimpleSelect
                  id={id}
                  value={lostReason}
                  onChange={setLostReason}
                  options={LOST_REASONS.map((reason) => ({ value: reason, label: reason }))}
                />
              )}
            </Field>
          )}
        </div>
        <Field label="Notes">
          {(id) => <Textarea id={id} name="notes" rows={3} defaultValue={deal?.notes ?? ""} placeholder="Scope, budget, decision makers…" />}
        </Field>
      </FieldSection>
    </EditorSheet>
  );
}

/* ----------------------------------------------------------------------------------------------
 * Follow-up task
 * -------------------------------------------------------------------------------------------- */

export function TaskSheet({
  open,
  onOpenChange,
  customerId,
  deals,
  task,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customerId: string;
  deals: CrmDeal[];
  task?: CrmTask | null;
}) {
  return (
    <TaskForm
      key={open ? (task?.id ?? "new") : "closed"}
      open={open}
      onOpenChange={onOpenChange}
      customerId={customerId}
      deals={deals}
      task={task ?? null}
    />
  );
}

const NO_DEAL = "__none";

function TaskForm({
  open,
  onOpenChange,
  customerId,
  deals,
  task,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customerId: string;
  deals: CrmDeal[];
  task: CrmTask | null;
}) {
  const [type, setType] = useState<TaskType>(task?.type ?? "call");
  const [dealId, setDealId] = useState<string>(task?.deal_id ?? NO_DEAL);
  const [saving, setSaving] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const fields = {
      title: text(form, "title"),
      due_at: fromLocalInput(text(form, "due_at")),
      type,
      deal_id: dealId === NO_DEAL ? null : dealId,
    };
    setSaving(true);
    try {
      if (task) await crmWrite("PUT", CRM.tasks, { id: task.id, ...fields });
      else await crmWrite("POST", CRM.tasks, { customer_id: customerId, ...fields });
      toast.success(task ? "Follow-up updated" : "Follow-up scheduled");
      onOpenChange(false);
    } catch (error) {
      fail(error, "Could not save the follow-up.");
    } finally {
      setSaving(false);
    }
  }

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(11, 0, 0, 0);

  return (
    <EditorSheet
      open={open}
      onOpenChange={onOpenChange}
      title={task ? "Edit follow-up" : "Schedule follow-up"}
      formKey={task?.id ?? "new-task"}
      onSubmit={submit}
      saving={saving}
      submitLabel={task ? "Save changes" : "Schedule"}
      size="md"
    >
      <FieldSection title="Follow-up">
        <Field label="What needs to happen">
          {(id) => <Input id={id} name="title" required autoFocus defaultValue={task?.title ?? ""} placeholder="Call back about the quotation" />}
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Type">{(id) => <SimpleSelect id={id} value={type} onChange={setType} options={TASK_TYPES} />}</Field>
          <Field label="Due">
            {(id) => <Input id={id} name="due_at" type="datetime-local" required defaultValue={toLocalInput(task?.due_at ?? tomorrow)} />}
          </Field>
          {deals.length > 0 && (
            <Field label="Deal">
              {(id) => (
                <SimpleSelect
                  id={id}
                  value={dealId}
                  onChange={setDealId}
                  options={[{ value: NO_DEAL, label: "No specific deal" }, ...deals.map((deal) => ({ value: deal.id, label: deal.title }))]}
                />
              )}
            </Field>
          )}
        </div>
      </FieldSection>
    </EditorSheet>
  );
}
