import { CrmError, check, checkRow, crmRoute, readJson, requireId } from "@/lib/crm/server";
import type { CrmCustomer, CrmEnquiry } from "@/lib/crm/types";

/**
 * Turn a website contact-form enquiry into a lead: customer + primary contact + new deal +
 * the enquiry itself as the first (inbound) activity. Converting twice returns the same customer.
 */
export async function POST(request: Request) {
  return crmRoute(async (db) => {
    const body = await readJson(request);
    const submissionId = requireId(body, "submission_id");

    const existing = check(
      await db.from("crm_customers").select("id").eq("contact_submission_id", submissionId).maybeSingle(),
      "Checking the enquiry",
    );
    if (existing) return { customer_id: existing.id, created: false };

    const enquiry = check(
      await db.from("contact_submissions").select("*").eq("id", submissionId).maybeSingle(),
      "Loading the enquiry",
    ) as CrmEnquiry | null;
    if (!enquiry) throw new CrmError("Enquiry not found.", 404);

    const customer = check(
      await db
        .from("crm_customers")
        .insert({ name: enquiry.name, source: "website", contact_submission_id: enquiry.id })
        .select()
        .single(),
      "Creating the lead",
    ) as CrmCustomer;

    const [contact, deal] = await Promise.all([
      db
        .from("crm_contacts")
        .insert({
          customer_id: customer.id,
          name: enquiry.name,
          email: enquiry.email,
          phone: enquiry.phone,
          whatsapp: enquiry.phone,
          is_primary: true,
        })
        .select("id")
        .single(),
      db
        .from("crm_deals")
        .insert({ customer_id: customer.id, title: enquiry.subject || "Website enquiry" })
        .select("id")
        .single(),
    ]);

    check(
      await db.from("crm_activities").insert({
        customer_id: customer.id,
        contact_id: checkRow(contact, "Adding the contact").id,
        deal_id: checkRow(deal, "Adding the deal").id,
        channel: "website",
        direction: "inbound",
        outcome: "Enquiry received",
        summary: [enquiry.subject, enquiry.message].filter(Boolean).join("\n\n"),
        occurred_at: enquiry.created_at,
      }),
      "Logging the enquiry",
    );

    return { customer_id: customer.id, created: true };
  });
}
