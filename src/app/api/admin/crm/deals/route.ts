import {
  DEAL_FIELDS,
  applyStage,
  check,
  checkRow,
  cleanDeal,
  crmRoute,
  pick,
  readJson,
  requireId,
  requireString,
  touchCustomer,
} from "@/lib/crm/server";
import type { CrmDeal, CrmPipelineDeal, DealStage } from "@/lib/crm/types";

type PipelineRow = CrmDeal & {
  customer: CrmPipelineDeal["customer"];
  crm_activities: { occurred_at: string }[];
};

/** Every deal with its customer and latest activity, for the pipeline board. */
export async function GET() {
  return crmRoute(async (db) => {
    const rows = check(
      await db
        .from("crm_deals")
        .select("*, customer:crm_customers(id, name, city), crm_activities(occurred_at)")
        .order("updated_at", { ascending: false })
        .order("occurred_at", { referencedTable: "crm_activities", ascending: false })
        .limit(1, { referencedTable: "crm_activities" })
        .limit(2000),
      "Loading deals",
    ) as PipelineRow[];

    return rows.map(({ crm_activities, ...deal }): CrmPipelineDeal => ({
      ...deal,
      value_inr: Number(deal.value_inr || 0),
      last_activity_at: crm_activities[0]?.occurred_at ?? null,
    }));
  });
}

export async function POST(request: Request) {
  return crmRoute(async (db) => {
    const body = await readJson(request);
    const fields = cleanDeal(pick(body, DEAL_FIELDS));
    fields.title = requireString(fields.title, "Deal title");
    const customerId = requireId(body, "customer_id");
    const stage = (fields.stage as DealStage | null) ?? "new";
    delete fields.stage;

    const deal = check(
      await db.from("crm_deals").insert({ ...fields, customer_id: customerId }).select().single(),
      "Creating the deal",
    ) as CrmDeal;
    if (stage !== "new") await applyStage(db, deal.id, stage, fields.lost_reason as string | null);
    await touchCustomer(db, customerId);
    return deal;
  });
}

/** Edits a deal. A changed `stage` goes through applyStage (close date, client promotion). */
export async function PUT(request: Request) {
  return crmRoute(async (db) => {
    const body = await readJson(request);
    const id = requireId(body);
    const fields = cleanDeal(pick(body, DEAL_FIELDS));
    if ("title" in fields) fields.title = requireString(fields.title, "Deal title");
    const stage = fields.stage as DealStage | undefined;
    const lostReason = fields.lost_reason as string | null | undefined;
    delete fields.stage;
    delete fields.lost_reason;

    if (Object.keys(fields).length > 0) {
      check(await db.from("crm_deals").update(fields).eq("id", id), "Updating the deal");
    }
    if (stage) {
      const current = checkRow(await db.from("crm_deals").select("stage, lost_reason").eq("id", id).single(), "Loading the deal");
      if (current.stage !== stage || (stage === "lost" && lostReason !== undefined && lostReason !== current.lost_reason)) {
        await applyStage(db, id, stage, lostReason);
      }
    }
    const deal = check(await db.from("crm_deals").select().eq("id", id).single(), "Loading the deal") as CrmDeal;
    await touchCustomer(db, deal.customer_id);
    return deal;
  });
}

export async function DELETE(request: Request) {
  return crmRoute(async (db) => {
    const id = requireId(await readJson(request));
    check(await db.from("crm_deals").delete().eq("id", id), "Deleting the deal");
    return { id };
  });
}
