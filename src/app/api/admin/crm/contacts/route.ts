import type { SupabaseClient } from "@supabase/supabase-js";
import { CONTACT_FIELDS, check, crmRoute, pick, readJson, requireId, requireString, touchCustomer } from "@/lib/crm/server";
import type { CrmContact } from "@/lib/crm/types";

/** Only one primary contact per customer. */
async function clearOtherPrimaries(db: SupabaseClient, customerId: string, keepId: string) {
  check(
    await db.from("crm_contacts").update({ is_primary: false }).eq("customer_id", customerId).neq("id", keepId),
    "Updating contacts",
  );
}

export async function POST(request: Request) {
  return crmRoute(async (db) => {
    const body = await readJson(request);
    const fields = pick(body, CONTACT_FIELDS);
    fields.name = requireString(fields.name, "Contact name");
    const customerId = requireId(body, "customer_id");

    const existing = await db.from("crm_contacts").select("id", { count: "exact", head: true }).eq("customer_id", customerId);
    if ((existing.count ?? 0) === 0) fields.is_primary = true;

    const contact = check(
      await db.from("crm_contacts").insert({ ...fields, customer_id: customerId }).select().single(),
      "Adding the contact",
    ) as CrmContact;
    if (contact.is_primary) await clearOtherPrimaries(db, customerId, contact.id);
    await touchCustomer(db, customerId);
    return contact;
  });
}

export async function PUT(request: Request) {
  return crmRoute(async (db) => {
    const body = await readJson(request);
    const fields = pick(body, CONTACT_FIELDS);
    if ("name" in fields) fields.name = requireString(fields.name, "Contact name");
    const contact = check(
      await db.from("crm_contacts").update(fields).eq("id", requireId(body)).select().single(),
      "Updating the contact",
    ) as CrmContact;
    if (contact.is_primary) await clearOtherPrimaries(db, contact.customer_id, contact.id);
    return contact;
  });
}

export async function DELETE(request: Request) {
  return crmRoute(async (db) => {
    const id = requireId(await readJson(request));
    check(await db.from("crm_contacts").delete().eq("id", id), "Deleting the contact");
    return { id };
  });
}
