"use client";

import { createElement } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, ChevronRight } from "lucide-react";
import { allServices } from "@/lib/constants";
import { FaqSection } from "@/components/sections/FaqSection";
import { TrustedBy } from "@/components/sections/TrustedBy";
import type { TrustedClient } from "@/lib/portfolio/clients";
import { GetStartedSection } from "@/components/sections/CTA";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { MagneticButton } from "@/components/ui/MagneticButton";
import {
  getServiceIcon,
  getServiceTags,
  outcomeIcon as OutcomeIcon,
  processIcons,
} from "@/lib/seo/service-visuals";
import type { ServicePageContent } from "@/lib/seo/services";
import { DecorativeText } from "@/components/ui/DecorativeText";

/** Static wrapper so the icon component is not created during render */
function ServiceIcon({ slug, size }: { slug: string; size: number }) {
  return createElement(getServiceIcon(slug), { size });
}

interface ServiceDetailProps {
  service: ServicePageContent;
  clients?: TrustedClient[];
  /** This service's city pages (computed on the server) */
  cityLinks?: { href: string; label: string }[];
}

export function ServiceDetail({ service, clients = [], cityLinks = [] }: ServiceDetailProps) {
  const tags = getServiceTags(service.slug);
  const related = allServices.filter((item) => item.slug !== service.slug).slice(0, 6);

  return (
    <>
      <header className="page-top relative overflow-hidden border-b border-border bg-surface pb-12 sm:pb-16 md:pb-20">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            background:
              "radial-gradient(ellipse 70% 55% at 18% 0%, rgba(29,78,216,0.12), transparent 58%), radial-gradient(ellipse 50% 40% at 90% 20%, rgba(15,39,68,0.06), transparent 55%)",
          }}
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="mb-8 flex flex-wrap items-center gap-1.5 text-sm text-muted">
            <Link href="/" className="transition-colors hover:text-accent">
              Home
            </Link>
            <ChevronRight size={14} aria-hidden />
            <Link href="/services" className="transition-colors hover:text-accent">
              Services
            </Link>
            <ChevronRight size={14} aria-hidden />
            <span className="font-medium text-foreground">{service.title}</span>
          </nav>

          <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
            <RevealOnScroll direction="right" className="lg:col-span-7">
              <div className="icon-box mb-6 h-14 w-14">
                <ServiceIcon slug={service.slug} size={26} />
              </div>
              <span className="section-badge mb-5 inline-flex">{service.title}</span>
              <h1 className="max-w-3xl font-display text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-[3.15rem] lg:leading-[1.1]">
                {service.headline}
              </h1>
              <p className="mt-5 max-w-2xl border-l-2 border-accent/30 pl-5 text-base leading-relaxed text-muted sm:text-lg">
                {service.intro}
              </p>

              {tags.length > 0 && (
                <ul className="mt-6 flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-full border border-border bg-white px-3 py-1.5 text-xs font-medium text-muted"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-8 flex flex-row flex-wrap items-center gap-3">
                <MagneticButton href="/contact" variant="primary">
                  Start this project
                  <ArrowRight size={16} />
                </MagneticButton>
                <MagneticButton href="/portfolio" variant="secondary">
                  See related work
                </MagneticButton>
              </div>
            </RevealOnScroll>

            <RevealOnScroll direction="left" delay={0.12} className="lg:col-span-5">
              <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-accent/[0.07] blur-2xl"
                />
                <div className="relative flex items-center gap-4 border-b border-border pb-5">
                  <div className="icon-box h-16 w-16">
                    <ServiceIcon slug={service.slug} size={30} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-accent">
                      Service snapshot
                    </p>
                    <p className="mt-1 font-display text-lg font-bold">{service.title}</p>
                  </div>
                </div>

                <ol className="relative mt-6 space-y-0">
                  {service.process.map((step, index) => {
                    const StepIcon = processIcons[index] ?? processIcons[0];
                    return (
                      <li key={step.title} className="relative flex gap-4 pb-5 last:pb-0">
                        {index < service.process.length - 1 && (
                          <span
                            aria-hidden
                            className="absolute left-5 top-11 bottom-0 w-px bg-border"
                          />
                        )}
                        <div className="icon-box relative z-10 h-10 w-10 shrink-0">
                          <StepIcon size={18} />
                        </div>
                        <div className="min-w-0 pt-1">
                          <p className="text-sm font-semibold text-foreground">
                            {String(index + 1).padStart(2, "0")} · {step.title}
                          </p>
                          <p className="mt-1 text-sm leading-relaxed text-muted">{step.description}</p>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </header>

      <TrustedBy clients={clients} />

      <section className="py-14 sm:py-20 md:py-24" aria-label="Service overview">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
            <RevealOnScroll className="lg:col-span-5">
              <span className="section-badge mb-5 inline-block">Overview</span>
              <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                What this engagement covers
              </h2>
              <div className="mt-6 space-y-4 text-base leading-relaxed text-muted sm:text-lg">
                {service.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </RevealOnScroll>

            <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
              {service.outcomes.map((item, index) => (
                <RevealOnScroll key={item} delay={index * 0.08} className="h-full">
                  <article className="premium-card flex h-full gap-4 rounded-2xl p-5 sm:p-6">
                    <div className="icon-box h-11 w-11 shrink-0">
                      <OutcomeIcon size={20} />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-accent">
                        Included
                      </p>
                      <p className="mt-1.5 text-sm font-semibold leading-relaxed text-foreground sm:text-base">
                        {item}
                      </p>
                    </div>
                  </article>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-surface/50 py-14 sm:py-20 md:py-24" aria-label="How we deliver this service">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Process"
            title="How we deliver this service"
            subtitle="A clear path from first call to something you can measure — with the same team from start to finish."
          />

          <div className="grid gap-5 md:grid-cols-3">
            {service.process.map((step, index) => {
              const StepIcon = processIcons[index] ?? processIcons[0];
              return (
                <RevealOnScroll key={step.title} delay={index * 0.1} className="h-full">
                  <article className="premium-card relative flex h-full flex-col overflow-hidden rounded-2xl p-6 sm:p-8">
                    <DecorativeText
                      text={String(index + 1).padStart(2, "0")}
                      className="pointer-events-none absolute right-5 top-4 font-display text-5xl font-bold leading-none text-accent/[0.07]"
                    />
                    <div className="icon-box mb-5 h-12 w-12">
                      <StepIcon size={22} />
                    </div>
                    <h3 className="font-display text-xl font-bold">
                      {step.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
                      {step.description}
                    </p>
                  </article>
                </RevealOnScroll>
              );
            })}
          </div>
        </div>
      </section>

      {cityLinks.length > 0 && (
        <section className="border-t border-border py-14 sm:py-20" aria-labelledby="service-cities">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 id="service-cities" className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
              {service.title} by city
            </h2>
            <p className="mt-3 max-w-2xl text-muted">
              Local pages with market-specific scope, FAQs and the right office to contact.
            </p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {cityLinks.map((item) => (
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

      <section className="py-14 sm:py-20 md:py-24" aria-label="Related services">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Explore more"
            title="Related services"
            subtitle="Pair this with the other capabilities we run from Dubai and Ujjain."
          />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item, index) => (
              <RevealOnScroll key={item.slug} delay={index * 0.06} className="h-full">
                <Link
                  href={item.href}
                  className="premium-card group flex h-full items-start gap-4 rounded-2xl p-5 sm:p-6"
                >
                  <div className="icon-box h-12 w-12 shrink-0">
                    <item.icon size={22} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display text-base font-bold transition-colors group-hover:text-accent">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted">
                      See how we deliver {item.title.toLowerCase()}.
                    </p>
                    <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-accent">
                      View service
                      <ArrowUpRight
                        size={14}
                        className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </span>
                  </div>
                </Link>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <FaqSection
        title={`${service.title} FAQs`}
        subtitle="Practical answers before you enquire."
        items={service.faqs}
      />
      <GetStartedSection
        title={`Ready to talk about ${service.title.toLowerCase()}?`}
        description="Tell us what you need to launch or improve. We reply within one business day with next steps."
      />
    </>
  );
}
