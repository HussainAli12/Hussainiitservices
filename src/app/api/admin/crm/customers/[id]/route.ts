import { CrmError, check, crmRoute } from "@/lib/crm/server";
import type { CrmCustomerDetail } from "@/lib/crm/types";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return crmRoute(async (db): Promise<CrmCustomerDetail> => {
    const [customer, contacts, deals, activities, tasks] = await Promise.all([
      db.from("crm_customers").select("*").eq("id", id).maybeSingle(),
      db.from("crm_contacts").select("*").eq("customer_id", id).order("is_primary", { ascending: false }).order("created_at"),
      db.from("crm_deals").select("*").eq("customer_id", id).order("created_at", { ascending: false }),
      db.from("crm_activities").select("*").eq("customer_id", id).order("occurred_at", { ascending: false }).limit(500),
      db.from("crm_tasks").select("*").eq("customer_id", id).order("done_at", { ascending: false, nullsFirst: true }).order("due_at"),
    ]);

    const row = check(customer, "Loading the customer");
    if (!row) throw new CrmError("Customer not found.", 404);

    return {
      customer: row,
      contacts: check(contacts, "Loading contacts") ?? [],
      deals: check(deals, "Loading deals") ?? [],
      activities: check(activities, "Loading activities") ?? [],
      tasks: check(tasks, "Loading follow-ups") ?? [],
    };
  });
}
