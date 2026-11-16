import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { FaqSection } from "@/components/sections/FaqSection";
import { GetStartedSection } from "@/components/sections/CTA";
import { PortfolioGridCard } from "@/components/sections/portfolio/PortfolioGridCard";
import { TrustedBy } from "@/components/sections/TrustedBy";
import { Breadcrumbs, type BreadcrumbItem } from "@/components/ui/Breadcrumbs";
import { LinkCardGrid } from "@/components/ui/LinkCardGrid";
import type { TrustedClient } from "@/lib/portfolio/clients";
import { industryHref, industryPages, type IndustryPage } from "@/lib/seo/industries";
import { getServicePage } from "@/lib/seo/services";
import type { DbPortfolio } from "@/lib/types/database";

interface IndustryDetailProps {
  industry: IndustryPage;
  breadcrumbs: BreadcrumbItem[];
  portfolio: DbPortfolio[];
  clients: TrustedClient[];
}

export function IndustryDetail({ industry, breadcrumbs, portfolio, clients }: IndustryDetailProps) {
  const services = industry.services
    .map((slug) => getServicePage(slug))
    .filter((service): service is NonNullable<typeof service> => Boolean(service));
  const otherIndustries = industryPages.filter((item) => item.slug !== industry.slug);

  return (
    <>
      <header className="page-top relative overflow-hidden border-b border-border bg-surface pb-12 sm:pb-16 md:pb-20">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{ background: "radial-gradient(ellipse 70% 55% at 18% 0%, rgba(29,78,216,0.12), transparent 58%)" }}
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={breadcrumbs} />
          <span className="section-badge mb-5 inline-flex">{industry.name}</span>
          <h1 className="max-w-4xl font-display text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:leading-[1.1]">
            {industry.headline}
          </h1>
          <p className="mt-5 max-w-3xl border-l-2 border-accent/30 pl-5 text-base leading-relaxed text-muted sm:text-lg">
            {industry.intro}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy"
            >
              Start a project <ArrowRight size={16} aria-hidden />
            </Link>
            <Link
              href="/free-website-audit"
              className="inline-flex min-h-11 items-center rounded-full border border-border bg-white px-6 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-accent/30"
            >
              Free website audit
            </Link>
          </div>
        </div>
      </header>

      <TrustedBy clients={clients} />

      <section className="py-14 sm:py-20" aria-labelledby="industry-needs">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 id="industry-needs" className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            What {industry.name.toLowerCase()} businesses need online
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {industry.needs.map((need) => (
              <article key={need.title} className="premium-card rounded-2xl p-5">
                <h3 className="font-display text-base font-bold">{need.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{need.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-surface/50 py-14 sm:py-20" aria-labelledby="industry-deliverables">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <h2 id="industry-deliverables" className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              What we build
            </h2>
            <ul className="mt-6 space-y-3">
              {industry.deliverables.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-relaxed text-foreground sm:text-base">
                  <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-accent" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">Related services</h2>
            <div className="mt-6">
              <LinkCardGrid
                columns={2}
                items={services.map((service) => ({
                  href: `/services/${service.slug}`,
                  title: service.title,
                }))}
              />
            </div>
          </div>
        </div>
      </section>

      {portfolio.length > 0 && (
        <section className="py-14 sm:py-20" aria-labelledby="industry-work">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 id="industry-work" className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              {industry.name} projects we have delivered
            </h2>
            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {portfolio.map((project) => (
                <PortfolioGridCard key={project.id} project={project} headingLevel="h3" />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="border-t border-border py-14 sm:py-20" aria-labelledby="other-industries">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 id="other-industries" className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
            Other industries
          </h2>
          <div className="mt-6">
            <LinkCardGrid
              columns={4}
              items={otherIndustries.map((item) => ({ href: industryHref(item.slug), title: item.name }))}
            />
          </div>
        </div>
      </section>

      <FaqSection title={`${industry.name} websites — FAQs`} items={industry.faqs} />
      <GetStartedSection
        title={`Planning a ${industry.name.toLowerCase()} website?`}
        description="Tell us about your business. We reply within one business day."
      />
    </>
  );
}
