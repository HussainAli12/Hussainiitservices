import { OPEN_STAGES } from "@/lib/crm/config";
import { check, crmRoute } from "@/lib/crm/server";
import type { CrmDeal, CrmEnquiry, CrmPipelineDeal, CrmTaskRow, CrmToday } from "@/lib/crm/types";

const DAY = 24 * 60 * 60 * 1000;
const COLD_AFTER_DAYS = 7;

function isoParam(url: URL, key: string, fallback: Date) {
  const raw = url.searchParams.get(key);
  const parsed = raw ? new Date(raw) : null;
  return parsed && !Number.isNaN(parsed.getTime()) ? parsed.toISOString() : fallback.toISOString();
}

/**
 * Everything for the "My day" screen in one round trip.
 * `day` / `month` are the browser's local midnight and month start, so "today" matches the user's clock.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const now = new Date();
  const dayStart = isoParam(url, "day", new Date(now.getTime() - DAY));
  const monthStart = isoParam(url, "month", new Date(now.getFullYear(), now.getMonth(), 1));
  const weekAhead = new Date(now.getTime() + 7 * DAY).toISOString();
  const enquiriesSince = new Date(now.getTime() - 60 * DAY).toISOString();

  return crmRoute(async (db): Promise<CrmToday> => {
    const [tasks, openDeals, wonDeals, activity, enquiries, converted] = await Promise.all([
      db
        .from("crm_tasks")
        .select("*, customer:crm_customers(id, name)")
        .is("done_at", null)
        .lte("due_at", weekAhead)
        .order("due_at")
        .limit(200),
      db
        .from("crm_deals")
        .select("*, customer:crm_customers(id, name, city), crm_activities(occurred_at)")
        .in("stage", OPEN_STAGES)
        .order("occurred_at", { referencedTable: "crm_activities", ascending: false })
        .limit(1, { referencedTable: "crm_activities" })
        .limit(1000),
      db.from("crm_deals").select("value_inr").eq("stage", "won").gte("closed_at", monthStart),
      db.from("crm_activities").select("id", { count: "exact", head: true }).gte("occurred_at", dayStart),
      db
        .from("contact_submissions")
        .select("id, name, email, phone, subject, message, created_at")
        .gte("created_at", enquiriesSince)
        .order("created_at", { ascending: false })
        .limit(50),
      db.from("crm_customers").select("contact_submission_id").not("contact_submission_id", "is", null),
    ]);

    const deals = (check(openDeals, "Loading deals") as (CrmDeal & {
      customer: CrmPipelineDeal["customer"];
      crm_activities: { occurred_at: string }[];
    })[]).map(({ crm_activities, ...deal }): CrmPipelineDeal => ({
      ...deal,
      value_inr: Number(deal.value_inr || 0),
      last_activity_at: crm_activities[0]?.occurred_at ?? null,
    }));

    const coldBefore = now.getTime() - COLD_AFTER_DAYS * DAY;
    const goingCold = deals
      .filter((deal) => new Date(deal.last_activity_at ?? deal.created_at).getTime() < coldBefore)
      .sort((a, b) => b.value_inr - a.value_inr)
      .slice(0, 10);

    check(activity, "Loading activity");

    const convertedIds = new Set(
      (check(converted, "Loading customers") as { contact_submission_id: string }[]).map((row) => row.contact_submission_id),
    );
    const won = check(wonDeals, "Loading won deals") as { value_inr: number }[];

    return {
      tasks: check(tasks, "Loading follow-ups") as CrmTaskRow[],
      goingCold,
      enquiries: (check(enquiries, "Loading enquiries") as CrmEnquiry[]).filter((row) => !convertedIds.has(row.id)),
      activityToday: activity.count ?? 0,
      pipeline: {
        openDeals: deals.length,
        openValue: deals.reduce((sum, deal) => sum + deal.value_inr, 0),
        wonThisMonth: won.length,
        wonValueThisMonth: won.reduce((sum, deal) => sum + Number(deal.value_inr || 0), 0),
      },
    };
  });
}
