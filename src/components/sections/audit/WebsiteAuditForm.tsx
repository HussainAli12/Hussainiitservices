"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Loader2 } from "lucide-react";
import { trackFormStart, trackFormSubmit, trackGenerateLead } from "@/lib/analytics";

const FORM_ID = "website_audit";
const FORM_NAME = "Free website audit";

const countries = ["India", "United Arab Emirates", "Saudi Arabia", "Oman", "Qatar", "Kuwait", "Bahrain", "Other"];

/**
 * Short lead form for the free audit. Posts to the existing /api/contact endpoint
 * (saved in contact_submissions + email notification), so no new backend is needed.
 */
export function WebsiteAuditForm() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const formStartedRef = useRef(false);

  function handleFormStart() {
    if (formStartedRef.current) return;
    formStartedRef.current = true;
    trackFormStart(FORM_ID, FORM_NAME);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setStatus(null);
    trackFormSubmit(FORM_ID, FORM_NAME);

    const form = event.currentTarget;
    const data = new FormData(form);
    const business = String(data.get("business") ?? "").trim();
    const website = String(data.get("website") ?? "").trim();
    const country = String(data.get("country") ?? "").trim();

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          phone: data.get("phone"),
          subject: `Free website audit — ${business || "New request"}`,
          message: [
            "Free website audit request",
            `Business: ${business || "—"}`,
            `Website: ${website || "—"}`,
            `Country: ${country || "—"}`,
            `Phone / WhatsApp: ${String(data.get("phone") ?? "").trim() || "—"}`,
          ].join("\n"),
        }),
      });
      const json = await res.json();

      if (!res.ok) {
        setStatus({ type: "error", message: json.error || "Something went wrong." });
      } else {
        setStatus({
          type: "success",
          message: "Thanks! We’ve received your audit request and will reply within one business day.",
        });
        form.reset();
        formStartedRef.current = false;
        trackGenerateLead({ form_id: FORM_ID, form_name: FORM_NAME, lead_source: "website_audit" });
      }
    } catch {
      setStatus({ type: "error", message: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-lg border border-border bg-white px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted/50 transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/10";
  const labelClass = "mb-1.5 block text-xs font-medium text-muted";

  return (
    <form onSubmit={handleSubmit} onFocusCapture={handleFormStart} className="space-y-4" aria-describedby="audit-form-note">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="audit-name" className={labelClass}>Your name *</label>
          <input id="audit-name" name="name" required autoComplete="name" className={inputClass} placeholder="Your name" />
        </div>
        <div>
          <label htmlFor="audit-business" className={labelClass}>Business name *</label>
          <input id="audit-business" name="business" required autoComplete="organization" className={inputClass} placeholder="Company or shop name" />
        </div>
      </div>
      <div>
        <label htmlFor="audit-website" className={labelClass}>Website (if you have one)</label>
        <input id="audit-website" name="website" type="text" inputMode="url" autoComplete="url" className={inputClass} placeholder="www.example.com" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="audit-phone" className={labelClass}>Phone / WhatsApp *</label>
          <input id="audit-phone" name="phone" type="tel" required autoComplete="tel" className={inputClass} placeholder="+91 … or +971 …" />
        </div>
        <div>
          <label htmlFor="audit-email" className={labelClass}>Email *</label>
          <input id="audit-email" name="email" type="email" required autoComplete="email" className={inputClass} placeholder="you@company.com" />
        </div>
      </div>
      <div>
        <label htmlFor="audit-country" className={labelClass}>Country *</label>
        <select id="audit-country" name="country" required defaultValue="" className={inputClass}>
          <option value="" disabled>Select your country</option>
          {countries.map((country) => (
            <option key={country} value={country}>{country}</option>
          ))}
        </select>
      </div>

      {status && (
        <p role="alert" aria-live="polite" className={`text-sm ${status.type === "success" ? "text-accent" : "text-red-600"}`}>
          {status.message}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-navy disabled:opacity-50 sm:w-auto"
      >
        {loading ? (
          <>
            <Loader2 size={16} className="animate-spin" aria-hidden />
            Sending…
          </>
        ) : (
          <>
            Request my free audit
            <ArrowUpRight size={15} aria-hidden />
          </>
        )}
      </button>
      <p id="audit-form-note" className="text-xs text-muted">
        We use these details only to send your audit and follow up. See our{" "}
        <Link href="/privacy-policy" className="underline">privacy policy</Link>.
      </p>
    </form>
  );
}
