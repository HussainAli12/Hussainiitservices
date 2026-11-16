import {
  CrmError,
  applyStage,
  check,
  crmRoute,
  pick,
  readJson,
  requireId,
  requireString,
  touchCustomer,
} from "@/lib/crm/server";
import type { CrmActivity, DealStage } from "@/lib/crm/types";

const FIELDS = [
  "deal_id",
  "contact_id",
  "channel",
  "direction",
  "outcome",
  "summary",
  "duration_minutes",
  "occurred_at",
] as const;

/**
 * Log a touchpoint. Optional extras in the same request:
 * - follow_up: { title, type, due_at } creates the next task
 * - deal_stage: moves the linked deal
 * - complete_task_id: marks the follow-up this activity fulfils as done
 */
export async function POST(request: Request) {
  return crmRoute(async (db) => {
    const body = await readJson(request);
    const customerId = requireId(body, "customer_id");
    const fields = pick(body, FIELDS);
    if (!fields.channel) throw new CrmError("Pick a channel.");
    if (!fields.summary && !fields.outcome) throw new CrmError("Add an outcome or a summary.");
    if (fields.duration_minutes != null) {
      const minutes = Number(fields.duration_minutes);
      fields.duration_minutes = Number.isFinite(minutes) && minutes >= 0 ? Math.round(minutes) : null;
    }
    if (!fields.occurred_at) delete fields.occurred_at;

    const activity = check(
      await db.from("crm_activities").insert({ ...fields, customer_id: customerId }).select().single(),
      "Logging the activity",
    ) as CrmActivity;

    const followUp = body.follow_up as Record<string, unknown> | undefined;
    if (followUp) {
      const task = pick(followUp, ["title", "type", "due_at"]);
      task.title = requireString(task.title, "Follow-up title");
      task.due_at = requireString(task.due_at, "Follow-up date");
      check(
        await db.from("crm_tasks").insert({ ...task, customer_id: customerId, deal_id: activity.deal_id }),
        "Creating the follow-up",
      );
    }

    if (typeof body.deal_stage === "string" && activity.deal_id) {
      await applyStage(db, activity.deal_id, body.deal_stage as DealStage, (body.lost_reason as string) ?? null);
    }

    if (typeof body.complete_task_id === "string" && body.complete_task_id) {
      check(
        await db.from("crm_tasks").update({ done_at: new Date().toISOString() }).eq("id", body.complete_task_id),
        "Completing the follow-up",
      );
    }

    await touchCustomer(db, customerId);
    return activity;
  });
}

export async function PUT(request: Request) {
  return crmRoute(async (db) => {
    const body = await readJson(request);
    const fields = pick(body, FIELDS);
    return check(
      await db.from("crm_activities").update(fields).eq("id", requireId(body)).select().single(),
      "Updating the activity",
    );
  });
}

export async function DELETE(request: Request) {
  return crmRoute(async (db) => {
    const id = requireId(await readJson(request));
    check(await db.from("crm_activities").delete().eq("id", id), "Deleting the activity");
    return { id };
  });
}
