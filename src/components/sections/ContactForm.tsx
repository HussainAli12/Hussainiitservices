"use client";

import { useRef, useState } from "react";
import { ArrowUpRight, Loader2 } from "lucide-react";
import { trackFormStart, trackFormSubmit, trackGenerateLead } from "@/lib/analytics";

export function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(
    null,
  );
  const formStartedRef = useRef(false);

  function handleFormStart() {
    if (formStartedRef.current) return;
    formStartedRef.current = true;
    trackFormStart();
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    trackFormSubmit();

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          phone: formData.get("phone"),
          subject: formData.get("subject"),
          message: formData.get("message"),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus({ type: "error", message: data.error || "Something went wrong." });
      } else {
        setStatus({ type: "success", message: data.message });
        form.reset();
        formStartedRef.current = false;
        trackGenerateLead();
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
    <form onSubmit={handleSubmit} onFocusCapture={handleFormStart} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelClass}>
            Full name *
          </label>
          <input id="name" name="name" required className={inputClass} placeholder="Your name" />
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>
            Email *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className={inputClass}
            placeholder="you@company.com"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="phone" className={labelClass}>
            Phone
          </label>
          <input id="phone" name="phone" className={inputClass} placeholder="+971 ..." />
        </div>
        <div>
          <label htmlFor="subject" className={labelClass}>
            Subject
          </label>
          <input id="subject" name="subject" className={inputClass} placeholder="Project inquiry" />
        </div>
      </div>

      <div>
        <label htmlFor="message" className={labelClass}>
          Message *
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className={`${inputClass} resize-y`}
          placeholder="Tell us about your project..."
        />
      </div>

      {status && (
        <p
          role="alert"
          aria-live="polite"
          className={`text-sm ${status.type === "success" ? "text-accent" : "text-red-600"}`}
        >
          {status.message}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 size={16} className="animate-spin" aria-hidden />
            Sending...
          </>
        ) : (
          <>
            Send message
            <ArrowUpRight size={15} aria-hidden />
          </>
        )}
      </button>
    </form>
  );
}
