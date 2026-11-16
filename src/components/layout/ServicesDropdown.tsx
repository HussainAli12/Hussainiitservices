"use client";

import { useChrome } from "@/components/providers/ChromeProvider";

import Link from "next/link";
import { m, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { allServices, featuredServices } from "@/lib/constants";

interface ServicesDropdownProps {
  open: boolean;
  onClose: () => void;
}

const compactServiceLabels: Record<string, string> = {
  "Digital Online Presence": "Digital Presence",
  "Custom Software Development": "Custom Software",
  "Google Ads & Social Media": "Ads & Social",
  "Social Media Management": "Social Media",
  "Google Business Profile": "Google Business",
  "Customized Ecommerce Store": "Custom Ecommerce",
  "Logo & Brochure Designing": "Logo & Brochure",
  "Business Card Designing": "Business Cards",
  "AI Voice Calling Agent": "AI Voice Agent",
};

function getCompactLabel(title: string) {
  return compactServiceLabels[title] ?? title;
}

const featuredSlugs = new Set(featuredServices.map((service) => service.slug));

export function ServicesDropdown({ open, onClose }: ServicesDropdownProps) {
  const chrome = useChrome();
  const otherServices = allServices.filter((service) => !featuredSlugs.has(service.slug));

  return (
    <AnimatePresence>
      {open && (
        <m.div
          initial={{ opacity: 0, y: -6, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -4, scale: 0.98 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="absolute left-1/2 top-full z-50 mt-1 w-[min(94vw,880px)] -translate-x-1/2 origin-top overflow-hidden rounded-2xl border border-border/80 bg-white shadow-[0_24px_64px_rgba(15,39,68,0.14)]"
        >
          <div className="flex items-start justify-between gap-6 border-b border-border/70 px-6 py-5 sm:px-7">
            <div>
              <p className="text-base font-semibold text-foreground">{chrome.menus.ourServices}</p>
              <p className="mt-1 text-sm text-muted">{chrome.menus.servicesSubtitle}</p>
            </div>
            <Link
              href={chrome.servicesHref}
              onClick={onClose}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-accent/30 hover:text-accent"
            >
              {chrome.menus.viewAll}
              <ArrowUpRight size={14} aria-hidden />
            </Link>
          </div>

          <div className="grid gap-3 p-4 sm:grid-cols-2 sm:p-5 lg:grid-cols-4 lg:gap-4">
            {featuredServices.map((service) => {
              const meta = chrome.featuredMenu[service.slug];
              const label = meta?.label ?? service.title;
              const tagline = meta?.tagline ?? "";

              return (
                <Link
                  key={service.slug}
                  href={service.href}
                  onClick={onClose}
                  className="group relative overflow-hidden rounded-xl border border-border/80 bg-surface/30 p-4 transition-all duration-300 hover:border-accent/25 hover:bg-white hover:shadow-[0_8px_24px_rgba(29,78,216,0.08)]"
                >
                  <span
                    aria-hidden
                    className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-accent transition-transform duration-300 group-hover:scale-x-100"
                  />
                  <div className="icon-box h-10 w-10">
                    <service.icon size={18} />
                  </div>
                  <p className="mt-4 text-sm font-semibold text-foreground group-hover:text-accent">
                    {label}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-muted">{tagline}</p>
                </Link>
              );
            })}
          </div>

          {otherServices.length > 0 && (
            <div className="border-t border-border/70 bg-surface/25 px-5 py-4 sm:px-6 sm:py-5">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted/80">
                {chrome.menus.moreServices}
              </p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 sm:grid-cols-3 lg:grid-cols-4">
                {otherServices.map((service) => (
                  <Link
                    key={service.title}
                    href={service.href}
                    onClick={onClose}
                    className="rounded-lg px-2 py-2 text-sm text-muted transition-colors hover:bg-white hover:text-foreground"
                  >
                    {chrome.locale === "en" ? getCompactLabel(service.title) : (chrome.serviceNames[service.slug] ?? service.title)}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </m.div>
      )}
    </AnimatePresence>
  );
}
