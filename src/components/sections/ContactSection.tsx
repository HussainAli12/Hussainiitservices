"use client";

import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { companyInfo } from "@/lib/constants";
import { ContactForm } from "@/components/sections/ContactForm";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

const contactRows = [
  {
    icon: Mail,
    label: "Email",
    href: `mailto:${companyInfo.email}`,
    value: companyInfo.email,
  },
  ...companyInfo.phones.map((phone) => ({
    icon: Phone,
    label: phone.label,
    href: phone.href,
    value: phone.display,
  })),
];

export function ContactSection() {
  return (
    <section className="border-t border-border py-12 sm:py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-20">
          <RevealOnScroll direction="right">
            <span className="section-badge mb-4 inline-block sm:mb-5">Direct contact</span>
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Reach our team
            </h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-muted sm:text-base">
              We reply within 24 hours. Pick whichever channel works best for you.
            </p>

            <ul className="mt-8 divide-y divide-border sm:mt-10">
              {contactRows.map((row) => (
                <li key={row.href} className="flex gap-4 py-5 first:pt-0 last:pb-0">
                  <div className="icon-box h-10 w-10 shrink-0">
                    <row.icon size={17} aria-hidden />
                  </div>
                  <div className="min-w-0 pt-0.5">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted">
                      {row.label}
                    </p>
                    <a
                      href={row.href}
                      className="mt-1 block text-base font-medium text-foreground transition-colors hover:text-accent"
                    >
                      {row.value}
                    </a>
                  </div>
                </li>
              ))}

              <li className="flex gap-4 py-5">
                <div className="icon-box h-10 w-10 shrink-0">
                  <MapPin size={17} aria-hidden />
                </div>
                <div className="min-w-0 pt-0.5">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted">
                    Locations
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {companyInfo.locations.map((location) => (
                      <span
                        key={location}
                        className="inline-flex items-center rounded-full border border-border px-3 py-1 text-xs font-medium text-muted"
                      >
                        {location}
                      </span>
                    ))}
                  </div>
                </div>
              </li>
            </ul>

            <a
              href={companyInfo.whatsapp.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-accent transition-colors hover:text-navy"
            >
              <MessageCircle size={16} aria-hidden />
              Message us on WhatsApp
            </a>
          </RevealOnScroll>

          <RevealOnScroll direction="left" delay={0.1}>
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8 lg:ml-4 xl:ml-8">
              <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                Send a message
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Share a few details about your project and we&apos;ll get back to you with next
                steps.
              </p>
              <div className="mt-6 sm:mt-7">
                <ContactForm />
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
