import { OPEN_STAGES } from "@/lib/crm/config";
import {
  CONTACT_FIELDS,
  CUSTOMER_FIELDS,
  DEAL_FIELDS,
  check,
  cleanDeal,
  crmRoute,
  pick,
  readJson,
  requireId,
  requireString,
} from "@/lib/crm/server";
import type { CrmCustomer, CrmCustomerRow, DealStage } from "@/lib/crm/types";

type ListRow = CrmCustomer & {
  crm_contacts: { id: string; name: string; phone: string | null; whatsapp: string | null; email: string | null; is_primary: boolean }[];
  crm_deals: { stage: DealStage; value_inr: number }[];
  crm_activities: CrmCustomerRow["last_activity"][];
  crm_tasks: NonNullable<CrmCustomerRow["next_task"]>[];
};

export async function GET() {
  return crmRoute(async (db) => {
    const rows = check(
      await db
        .from("crm_customers")
        .select(
          "*, crm_contacts(id, name, phone, whatsapp, email, is_primary), crm_deals(stage, value_inr), crm_activities(channel, outcome, summary, occurred_at), crm_tasks(id, title, type, due_at)",
        )
        .order("updated_at", { ascending: false })
        .order("occurred_at", { referencedTable: "crm_activities", ascending: false })
        .limit(1, { referencedTable: "crm_activities" })
        .is("crm_tasks.done_at", null)
        .order("due_at", { referencedTable: "crm_tasks", ascending: true })
        .limit(1, { referencedTable: "crm_tasks" })
        .limit(1000),
      "Loading customers",
    ) as ListRow[];

    return rows.map(({ crm_contacts, crm_deals, crm_activities, crm_tasks, ...customer }): CrmCustomerRow => {
      const primary = crm_contacts.find((contact) => contact.is_primary) ?? crm_contacts[0] ?? null;
      const open = crm_deals.filter((deal) => OPEN_STAGES.includes(deal.stage));
      return {
        ...customer,
        primary_contact: primary
          ? { id: primary.id, name: primary.name, phone: primary.phone, whatsapp: primary.whatsapp, email: primary.email }
          : null,
        open_deals: open.length,
        open_value: open.reduce((sum, deal) => sum + Number(deal.value_inr || 0), 0),
        last_activity: crm_activities[0] ?? null,
        next_task: crm_tasks[0] ?? null,
      };
    });
  });
}

/**
 * Create a customer, optionally with its primary contact and a first deal, in one call.
 * Body: { ...customer, contact?: {...}, deal?: {...} }
 */
export async function POST(request: Request) {
  return crmRoute(async (db) => {
    const body = await readJson(request);
    const fields = pick(body, CUSTOMER_FIELDS);
    fields.name = requireString(fields.name, "Customer name");

    const customer = check(await db.from("crm_customers").insert(fields).select().single(), "Creating the customer") as CrmCustomer;

    const contactBody = body.contact as Record<string, unknown> | undefined;
    if (contactBody && typeof contactBody.name === "string" && contactBody.name.trim()) {
      const contact = pick(contactBody, CONTACT_FIELDS);
      check(
        await db.from("crm_contacts").insert({ ...contact, customer_id: customer.id, is_primary: true }),
        "Adding the contact",
      );
    }

    const dealBody = body.deal as Record<string, unknown> | undefined;
    if (dealBody && typeof dealBody.title === "string" && dealBody.title.trim()) {
      const deal = cleanDeal(pick(dealBody, DEAL_FIELDS));
      check(
        await db.from("crm_deals").insert({ ...deal, customer_id: customer.id }),
        "Adding the deal",
      );
    }

    return customer;
  });
}

export async function PUT(request: Request) {
  return crmRoute(async (db) => {
    const body = await readJson(request);
    const fields = pick(body, CUSTOMER_FIELDS);
    if ("name" in fields) fields.name = requireString(fields.name, "Customer name");
    return check(
      await db.from("crm_customers").update(fields).eq("id", requireId(body)).select().single(),
      "Updating the customer",
    );
  });
}

export async function DELETE(request: Request) {
  return crmRoute(async (db) => {
    const id = requireId(await readJson(request));
    check(await db.from("crm_customers").delete().eq("id", id), "Deleting the customer");
    return { id };
  });
}
