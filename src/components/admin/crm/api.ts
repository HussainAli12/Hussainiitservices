"use client";

import { refreshPrefix } from "@/lib/admin/admin-cache";

export const CRM = {
  customers: "/api/admin/crm/customers",
  customer: (id: string) => `/api/admin/crm/customers/${id}`,
  contacts: "/api/admin/crm/contacts",
  deals: "/api/admin/crm/deals",
  activities: "/api/admin/crm/activities",
  tasks: "/api/admin/crm/tasks",
  enquiries: "/api/admin/crm/enquiries",
} as const;

/** Local midnight and month start, so "today" on the server matches the user's clock. */
export function todayPath() {
  const now = new Date();
  const day = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const month = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  return `/api/admin/crm/today?day=${encodeURIComponent(day)}&month=${encodeURIComponent(month)}`;
}

/** Write to a CRM endpoint; throws with the server's message. Refreshes every CRM view on success. */
export async function crmWrite<T = unknown>(method: "POST" | "PUT" | "DELETE", url: string, body: unknown): Promise<T> {
  let response: Response;
  try {
    response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error("Could not reach the server.");
  }
  let payload: { data?: T; error?: string } = {};
  try {
    payload = await response.json();
  } catch {
    payload = {};
  }
  if (!response.ok) throw new Error(payload.error || "Request failed.");
  refreshPrefix("/api/admin/crm/");
  return payload.data as T;
}

/** `<input type="datetime-local">` value for a date, in local time. */
export function toLocalInput(date: Date | string) {
  const value = new Date(date);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())}T${pad(value.getHours())}:${pad(value.getMinutes())}`;
}

export function fromLocalInput(value: string) {
  return value ? new Date(value).toISOString() : null;
}
