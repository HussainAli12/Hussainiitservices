"use client";

import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";
import { companyInfo } from "@/lib/constants";
import { cn } from "@/lib/utils";

export interface GetStartedSectionProps {
  title?: string;
  description?: string;
  className?: string;
  /** Office-specific numbers; defaults to every number on the site */
  phones?: { label: string; display: string; href: string }[];
  /** Adds a WhatsApp row (prefilled link) */
  whatsapp?: { display: string; href: string };
}

const DEFAULT_TITLE = "Do You Have a Project and Want to Discuss With Us?";

const DEFAULT_DESCRIPTION =
  "Partner with us to build exceptional digital products. From concept to deployment, we bring your vision to life with precision and elegance.";

export function GetStartedSection({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  className,
  phones = companyInfo.phones,
  whatsapp,
}: GetStartedSectionProps) {
  return (
    <section
      aria-labelledby="get-started-heading"
      className={cn("border-t border-border bg-surface/60", className)}
    >
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:items-end lg:gap-14 xl:gap-16">
          <div>
            <h2
              id="get-started-heading"
              className="max-w-2xl text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-[2rem] lg:leading-tight"
            >
              {title}
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted sm:mt-5 sm:text-lg">
              {description}
            </p>

            <div className="mt-8 flex flex-row flex-wrap items-center gap-3 sm:mt-10">
              <Link
                href="/contact"
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy"
              >
                Schedule a Consultation
              </Link>
              <Link
                href="/portfolio"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-border bg-white px-6 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-accent/30 hover:bg-surface"
              >
                Explore Our Work
                <ArrowRight size={16} aria-hidden />
              </Link>
            </div>
          </div>

          <aside className="rounded-2xl border border-border bg-card p-6 sm:p-7">
            <p className="text-sm font-semibold text-foreground">Prefer to reach out directly?</p>
            <p className="mt-1 text-sm text-muted">We respond within one business day.</p>

            <ul className="mt-5 space-y-3">
              {phones.map((phone) => (
                <li key={phone.href}>
                  <a
                    href={phone.href}
                    className="group flex items-baseline justify-between gap-3 text-sm transition-colors hover:text-accent"
                  >
                    <span className="font-medium text-foreground group-hover:text-accent">
                      {phone.display}
                    </span>
                    <span className="text-xs text-muted">{phone.label}</span>
                  </a>
                </li>
              ))}
              {whatsapp && (
                <li>
                  <a
                    href={whatsapp.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-baseline justify-between gap-3 text-sm transition-colors hover:text-accent"
                  >
                    <span className="font-medium text-foreground group-hover:text-accent">
                      {whatsapp.display}
                    </span>
                    <span className="text-xs text-muted">WhatsApp</span>
                  </a>
                </li>
              )}
              <li className="border-t border-border pt-3">
                <a
                  href={`mailto:${companyInfo.email}`}
                  className="inline-flex items-center gap-2 text-sm font-medium text-foreground transition-colors hover:text-accent"
                >
                  <Mail size={15} className="shrink-0 text-accent" aria-hidden />
                  {companyInfo.email}
                </a>
              </li>
            </ul>
          </aside>
        </div>
      </div>
    </section>
  );
}

/** @deprecated Use GetStartedSection — kept for existing imports */
export const CTA = GetStartedSection;
