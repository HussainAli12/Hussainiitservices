import { CheckCircle2, MessageCircle, Phone } from "lucide-react";
import { FaqSection } from "@/components/sections/FaqSection";
import { GetStartedSection } from "@/components/sections/CTA";
import { PortfolioGridCard } from "@/components/sections/portfolio/PortfolioGridCard";
import { TrustedBy } from "@/components/sections/TrustedBy";
import { LanguageLinks } from "@/components/i18n/LanguageLinks";
import { Breadcrumbs, type BreadcrumbItem } from "@/components/ui/Breadcrumbs";
import { LinkCardGrid } from "@/components/ui/LinkCardGrid";
import type { TrustedClient } from "@/lib/portfolio/clients";
import { getMarketCities, getMarketServicePages, type MarketHub } from "@/lib/seo/markets";
import { whatsappLink, type OfficeContact } from "@/lib/seo/offices";
import { serviceLocationHref, serviceLocationLinkLabel } from "@/lib/seo/service-locations";
import type { DbPortfolio } from "@/lib/types/database";

interface MarketHubDetailProps {
  hub: MarketHub;
  office: OfficeContact;
  breadcrumbs: BreadcrumbItem[];
  portfolio: DbPortfolio[];
  /** true when portfolio is a fallback from neighbouring markets */
  portfolioIsFallback: boolean;
  clients: TrustedClient[];
  /** Published translations of this page */
  languageLinks?: { href: string; label: string; hrefLang: string }[];
}

export function MarketHubDetail({
  hub,
  office,
  breadcrumbs,
  portfolio,
  portfolioIsFallback,
  clients,
  languageLinks = [],
}: MarketHubDetailProps) {
  const cities = getMarketCities(hub);
  const servicePages = getMarketServicePages(hub);
  const countries = hub.countries.filter((country) => cities.some((city) => city.country === country));
  const whatsappHref = whatsappLink(office, `Hi, I'd like to discuss a project in ${hub.inSentence}.`);

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
          <LanguageLinks links={languageLinks} />
          <span className="section-badge mb-5 inline-flex">{hub.name}</span>
          <h1 className="max-w-4xl font-display text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:leading-[1.1]">
            {hub.headline}
          </h1>
          <p className="mt-5 max-w-3xl border-l-2 border-accent/30 pl-5 text-base leading-relaxed text-muted sm:text-lg">
            {hub.intro}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy"
            >
              <MessageCircle size={16} aria-hidden />
              WhatsApp us
            </a>
            {office.phones[0] && (
              <a
                href={office.phones[0].href}
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-white px-6 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-accent/30"
              >
                <Phone size={16} aria-hidden />
                {office.phones[0].display}
              </a>
            )}
          </div>
        </div>
      </header>

      <TrustedBy clients={clients} />

      <section className="py-14 sm:py-20" aria-labelledby="how-we-serve">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 id="how-we-serve" className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            How we serve {hub.inSentence}
          </h2>
          {hub.body.map((paragraph) => (
            <p key={paragraph} className="mt-4 max-w-3xl text-base leading-relaxed text-muted sm:text-lg">
              {paragraph}
            </p>
          ))}
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {hub.howWeServe.map((item) => (
              <article key={item.title} className="premium-card rounded-2xl p-5">
                <CheckCircle2 size={20} className="text-accent" aria-hidden />
                <h3 className="mt-3 font-display text-base font-bold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-surface/50 py-14 sm:py-20" aria-labelledby="cities">
        <div className="mx-auto max-w-7xl space-y-10 px-4 sm:px-6 lg:px-8">
          <h2 id="cities" className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Cities we serve in {hub.inSentence}
          </h2>
          {countries.map((country) => (
            <div key={country}>
              {countries.length > 1 && (
                <h3 className="mb-4 font-display text-xl font-bold">{country}</h3>
              )}
              <LinkCardGrid
                columns={4}
                items={cities
                  .filter((city) => city.country === country)
                  .map((city) => ({
                    href: city.href,
                    title: `Best IT services in ${city.city}`,
                    description: city.region,
                  }))}
              />
            </div>
          ))}
        </div>
      </section>

      {servicePages.length > 0 && (
        <section className="py-14 sm:py-20" aria-labelledby="local-services">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 id="local-services" className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Services by city
            </h2>
            <div className="mt-8">
              <LinkCardGrid
                items={servicePages.map((page) => ({
                  href: serviceLocationHref(page),
                  title: serviceLocationLinkLabel(page),
                }))}
              />
            </div>
          </div>
        </section>
      )}

      {portfolio.length > 0 && (
        <section className="border-t border-border py-14 sm:py-20" aria-labelledby="hub-portfolio">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 id="hub-portfolio" className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              {portfolioIsFallback ? "Related work from the region" : `Our work in ${hub.inSentence}`}
            </h2>
            {portfolioIsFallback && (
              <p className="mt-3 max-w-2xl text-muted">
                We have no published case studies in {hub.inSentence} yet. These projects are from neighbouring
                markets — the same team and process apply.
              </p>
            )}
            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {portfolio.map((project) => (
                <PortfolioGridCard key={project.id} project={project} headingLevel="h3" />
              ))}
            </div>
          </div>
        </section>
      )}

      <FaqSection title={`Working with us in ${hub.inSentence} — FAQs`} items={hub.faqs} />
      <GetStartedSection
        title={`Start a project in ${hub.inSentence}`}
        description={`Talk to our ${office.city} office. We reply within one business day.`}
        phones={office.phones}
        whatsapp={{ display: office.whatsapp.display, href: whatsappHref }}
      />
    </>
  );
}
