import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/session";
import { loadInsights } from "@/lib/google/insights";
import type { InsightsReport } from "@/lib/google/types";

/**
 * Google data only changes a few times a day, but a report is ~11 API calls. Keep the last
 * report in memory for 10 minutes; `?fresh=1` (the Refresh button) bypasses it.
 */
const TTL_MS = 10 * 60 * 1000;
let cached: { report: InsightsReport; at: number } | null = null;
let pending: Promise<InsightsReport> | null = null;

function load() {
  pending ??= loadInsights()
    .then((report) => {
      cached = { report, at: Date.now() };
      return report;
    })
    .finally(() => {
      pending = null;
    });
  return pending;
}

export async function GET(request: Request) {
  const authed = await getAdminSession();
  if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const fresh = new URL(request.url).searchParams.has("fresh");

  try {
    if (!fresh && cached && Date.now() - cached.at < TTL_MS) {
      return NextResponse.json({ data: cached.report });
    }
    const data = await load();
    return NextResponse.json({ data });
  } catch (error) {
    console.error("Admin insights failed:", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "Could not load Google insights." }, { status: 500 });
  }
}
