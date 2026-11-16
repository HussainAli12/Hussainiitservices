"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight, CheckCircle2, ChevronRight, MapPin } from "lucide-react";
import { allServices } from "@/lib/constants";
import type { LocationPageContent } from "@/lib/seo/locations";
import { locationHref, locationIndex, type LocationIndexEntry } from "@/lib/seo/location-index";
import { FaqSection } from "@/components/sections/FaqSection";
import { TrustedBy } from "@/components/sections/TrustedBy";
import { LanguageLinks } from "@/components/i18n/LanguageLinks";
import type { TrustedClient } from "@/lib/portfolio/clients";
import { GetStartedSection } from "@/components/sections/CTA";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { MagneticButton } from "@/components/ui/MagneticButton";

interface LocationDetailProps {
  location: LocationPageContent;
  clients?: TrustedClient[];
  /** Published translations of this page */
  languageLinks?: { href: string; label: string; hrefLang: string }[];
  /** Service+city pages for this city (computed on the server) */
  localServiceLinks?: { href: string; label: string }[];
  /** Country/region hub this city belongs to */
  hubLink?: { href: string; name: string };
}

export function LocationDetail({
  location,
  clients = [],
  languageLinks = [],
  localServiceLinks = [],
  hubLink,
}: LocationDetailProps) {
  const related = locationIndex
    .filter((item) => item.slug !== location.slug)
    .sort((a, b) => {
      const score = (item: LocationIndexEntry) =>
        Number(item.region === location.region) * 2 + Number(item.country === location.country);
      return score(b) - score(a);
    })
    .slice(0, 6);

  return (
    <>
      <header className="page-top relative overflow-hidden border-b border-border bg-surface pb-12 sm:pb-16 md:pb-20">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            background:
              "radial-gradient(ellipse 70% 55% at 18% 0%, rgba(29,78,216,0.12), transparent 58%)",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="mb-8 flex flex-wrap items-center gap-1.5 text-sm text-muted">
            <Link href="/" className="transition-colors hover:text-accent">
              Home
            </Link>
            <ChevronRight size={14} aria-hidden />
            <Link href="/best-it-services" className="transition-colors hover:text-accent">
              Best IT Services
            </Link>
            <ChevronRight size={14} aria-hidden />
            <span className="font-medium text-foreground">{location.city}</span>
          </nav>
          <LanguageLinks links={languageLinks} />
          <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
            <RevealOnScroll direction="right" className="lg:col-span-7">
              <div className="icon-box mb-6 h-14 w-14">
                <MapPin size={26} />
              </div>
              <span className="section-badge mb-5 inline-flex">
                {location.city}, {location.country}
              </span>
              <h1 className="max-w-3xl font-display text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                {location.headline}
              </h1>
              <p className="mt-5 max-w-2xl border-l-2 border-accent/30 pl-5 text-base leading-relaxed text-muted sm:text-lg">
                {location.intro}
              </p>
              <div className="mt-8 flex flex-row flex-wrap items-center gap-3">
                <MagneticButton href="/contact" variant="primary">
                  Start a project
                  <ArrowRight size={16} />
                </MagneticButton>
                <MagneticButton href="/services" variant="secondary">
                  View services
                </MagneticButton>
              </div>
            </RevealOnScroll>

            <RevealOnScroll direction="left" delay={0.1} className="lg:col-span-5">
              <div className="premium-card rounded-2xl p-6 sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-wider text-accent">Why this market</p>
                <ul className="mt-5 space-y-4">
                  {location.highlights.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="icon-box mt-0.5 h-9 w-9 shrink-0">
                        <CheckCircle2 size={16} />
                      </span>
                      <span className="text-sm font-medium leading-relaxed text-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </header>

      <TrustedBy clients={clients} />

      <section className="py-14 sm:py-20 md:py-24" aria-label="Local overview">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
            <RevealOnScroll className="lg:col-span-6">
              <span className="section-badge mb-5 inline-block">Overview</span>
              <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                Best IT company in {location.city} for websites, SEO, and growth
              </h2>
              <div className="mt-6 space-y-4 text-base leading-relaxed text-muted sm:text-lg">
                {location.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </RevealOnScroll>
            <div className="lg:col-span-6">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted">
                Industries we support
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {location.industries.map((industry, index) => (
                  <RevealOnScroll key={industry} delay={index * 0.06}>
                    <div className="premium-card rounded-xl px-5 py-4 text-sm font-semibold text-foreground">
                      {industry}
                    </div>
                  </RevealOnScroll>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {localServiceLinks.length > 0 && (
        <section className="py-14 sm:py-20" aria-labelledby="city-services">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 id="city-services" className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
              Dedicated services in {location.city}
            </h2>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {localServiceLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="premium-card group flex items-center justify-between gap-3 rounded-xl px-5 py-4 text-sm font-semibold text-foreground"
                  >
                    <span className="group-hover:text-accent">{item.label}</span>
                    <ArrowUpRight size={14} className="shrink-0 text-accent" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="border-t border-border bg-surface/50 py-14 sm:py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Capabilities"
            title={`IT services in ${location.city}`}
            subtitle={`Web development, SEO, social, and AI from Hussaini IT Services — scoped for ${location.city}.`}
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {allServices.map((service, index) => (
              <RevealOnScroll key={service.slug} delay={index * 0.05} className="h-full">
                <Link href={service.href} className="premium-card group flex h-full items-start gap-4 rounded-2xl p-5">
                  <div className="icon-box h-11 w-11 shrink-0">
                    <service.icon size={20} />
                  </div>
                  <div>
                    <h3 className="font-display font-bold group-hover:text-accent">{service.title}</h3>
                    <p className="mt-1 text-sm text-muted">Available for {location.city} clients</p>
                  </div>
                </Link>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-20 md:py-24" aria-label="Other cities">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Locations"
            title="More cities we serve"
            subtitle="Explore IT services pages for other markets we work in."
          />
          {hubLink && (
            <p className="-mt-10 mb-10 text-center text-sm">
              <Link href={hubLink.href} className="font-semibold text-accent hover:underline">
                All IT services in {hubLink.name} →
              </Link>
            </p>
          )}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item, index) => (
              <RevealOnScroll key={item.slug} delay={index * 0.05} className="h-full">
                <Link href={locationHref(item.slug)} className="premium-card group flex h-full items-start gap-4 rounded-2xl p-5">
                  <div className="icon-box h-11 w-11 shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h3 className="font-display font-bold group-hover:text-accent">{item.city}</h3>
                    <p className="mt-1 text-sm text-muted">{item.country}</p>
                    <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-accent">
                      Best IT services in {item.city}
                      <ArrowUpRight size={14} />
                    </span>
                  </div>
                </Link>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <FaqSection
        title={`IT services in ${location.city} — FAQs`}
        subtitle="Straight answers about how we work in this market."
        items={location.faqs}
      />
      <GetStartedSection
        title={`Need the best IT services in ${location.city}?`}
        description="Tell us what you want to launch. We reply within one business day."
      />
    </>
  );
}
