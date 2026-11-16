import { check, crmRoute, pick, readJson, requireId, requireString } from "@/lib/crm/server";
import type { CrmTaskRow } from "@/lib/crm/types";

const FIELDS = ["deal_id", "title", "type", "due_at"] as const;

/** Open follow-ups across all customers, soonest first. */
export async function GET() {
  return crmRoute(async (db) =>
    check(
      await db
        .from("crm_tasks")
        .select("*, customer:crm_customers(id, name)")
        .is("done_at", null)
        .order("due_at")
        .limit(500),
      "Loading follow-ups",
    ) as CrmTaskRow[],
  );
}

export async function POST(request: Request) {
  return crmRoute(async (db) => {
    const body = await readJson(request);
    const fields = pick(body, FIELDS);
    fields.title = requireString(fields.title, "Title");
    fields.due_at = requireString(fields.due_at, "Due date");
    return check(
      await db
        .from("crm_tasks")
        .insert({ ...fields, customer_id: requireId(body, "customer_id") })
        .select()
        .single(),
      "Creating the follow-up",
    );
  });
}

/** Edit, or pass { done: true | false } to complete / reopen. */
export async function PUT(request: Request) {
  return crmRoute(async (db) => {
    const body = await readJson(request);
    const fields = pick(body, FIELDS);
    if ("title" in fields) fields.title = requireString(fields.title, "Title");
    if (typeof body.done === "boolean") fields.done_at = body.done ? new Date().toISOString() : null;
    return check(
      await db.from("crm_tasks").update(fields).eq("id", requireId(body)).select().single(),
      "Updating the follow-up",
    );
  });
}

export async function DELETE(request: Request) {
  return crmRoute(async (db) => {
    const id = requireId(await readJson(request));
    check(await db.from("crm_tasks").delete().eq("id", id), "Deleting the follow-up");
    return { id };
  });
}
