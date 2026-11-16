import { NextResponse } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getAdminSession } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/server";
import type { DealStage } from "@/lib/crm/types";

export const MIGRATION_HINT =
  "Sales CRM tables are missing. Run supabase/queries/17-create-sales-crm.sql in the Supabase SQL editor.";

export class CrmError extends Error {
  constructor(
    message: string,
    public status = 400,
  ) {
    super(message);
  }
}

interface DbError {
  code?: string;
  message: string;
}

/** Throw a readable error for a failed Supabase call. */
export function check<T>(result: { data: T; error: DbError | null }, context: string): T {
  if (result.error) {
    const { code, message } = result.error;
    if (code === "PGRST205" || code === "42P01") throw new CrmError(MIGRATION_HINT, 503);
    if (code === "23503") throw new CrmError(`${context}: a linked record no longer exists.`, 409);
    if (code === "23514" || code === "22P02") throw new CrmError(`${context}: invalid value.`, 400);
    console.error(`CRM ${context} failed:`, message);
    throw new CrmError(`${context} failed.`, 500);
  }
  return result.data;
}

/** Like check(), for `.single()` reads that must return a row. */
export function checkRow<T>(result: { data: T; error: DbError | null }, context: string): NonNullable<T> {
  const row = check(result, context);
  if (row == null) throw new CrmError(`${context}: not found.`, 404);
  return row;
}

/** Auth + client + error handling shared by every CRM route. */
export async function crmRoute(handler: (db: SupabaseClient) => Promise<unknown>) {
  try {
    if (!(await getAdminSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const db = createAdminClient();
    if (!db) return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
    const data = await handler(db);
    return NextResponse.json({ data: data ?? null });
  } catch (error) {
    if (error instanceof CrmError) return NextResponse.json({ error: error.message }, { status: error.status });
    console.error("CRM route failed:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

export async function readJson(request: Request): Promise<Record<string, unknown>> {
  try {
    const body = await request.json();
    if (body && typeof body === "object" && !Array.isArray(body)) return body as Record<string, unknown>;
  } catch {
    // fall through
  }
  throw new CrmError("Invalid request body.");
}

/** Copy only allowed keys; trims strings and turns blank strings into null. */
export function pick(body: Record<string, unknown>, keys: readonly string[]) {
  const out: Record<string, unknown> = {};
  for (const key of keys) {
    if (!(key in body)) continue;
    const value = body[key];
    if (typeof value === "string") {
      const trimmed = value.trim();
      out[key] = trimmed === "" ? null : trimmed;
    } else {
      out[key] = value ?? null;
    }
  }
  return out;
}

export function requireString(value: unknown, label: string) {
  if (typeof value !== "string" || !value.trim()) throw new CrmError(`${label} is required.`);
  return value.trim();
}

export function requireId(body: Record<string, unknown>, key = "id") {
  return requireString(body[key], key);
}

export const CUSTOMER_FIELDS = [
  "name",
  "lifecycle",
  "industry",
  "city",
  "country",
  "address",
  "website",
  "instagram",
  "source",
  "notes",
] as const;

export const CONTACT_FIELDS = [
  "name",
  "role",
  "phone",
  "whatsapp",
  "email",
  "instagram",
  "preferred_channel",
  "is_primary",
  "notes",
] as const;

export const DEAL_FIELDS = [
  "title",
  "services",
  "value_inr",
  "stage",
  "expected_close",
  "lost_reason",
  "notes",
] as const;

export function cleanDeal(fields: Record<string, unknown>) {
  if ("value_inr" in fields) {
    const value = Number(fields.value_inr);
    fields.value_inr = Number.isFinite(value) && value >= 0 ? value : 0;
  }
  if ("services" in fields) {
    fields.services = Array.isArray(fields.services)
      ? fields.services.filter((item): item is string => typeof item === "string" && item.trim() !== "")
      : [];
  }
  return fields;
}

/** Fields that follow a stage change: close date, and promoting the customer once a deal is won. */
export async function applyStage(db: SupabaseClient, dealId: string, stage: DealStage, lostReason?: string | null) {
  const closed = stage === "won" || stage === "lost";
  const deal = checkRow(
    await db
      .from("crm_deals")
      .update({
        stage,
        closed_at: closed ? new Date().toISOString() : null,
        lost_reason: stage === "lost" ? (lostReason ?? null) : null,
      })
      .eq("id", dealId)
      .select("customer_id")
      .single(),
    "Updating the deal stage",
  );
  if (stage === "won") {
    check(
      await db.from("crm_customers").update({ lifecycle: "client" }).eq("id", deal.customer_id),
      "Updating the customer",
    );
  }
  return deal;
}

/** Bump the customer's updated_at so recently worked customers sort to the top. */
export async function touchCustomer(db: SupabaseClient, customerId: string) {
  await db.from("crm_customers").update({ updated_at: new Date().toISOString() }).eq("id", customerId);
}
