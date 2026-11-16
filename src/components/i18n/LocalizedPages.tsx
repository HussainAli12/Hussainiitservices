import Link from "next/link";
import { CheckCircle2, MapPin, MessageCircle, Phone } from "lucide-react";
import { LanguageLinks } from "@/components/i18n/LanguageLinks";
import { LocaleContent } from "@/components/i18n/LocaleContent";
import { FaqSection } from "@/components/sections/FaqSection";
import { TrustedBy } from "@/components/sections/TrustedBy";
import { Breadcrumbs, type BreadcrumbItem } from "@/components/ui/Breadcrumbs";
import { LinkCardGrid } from "@/components/ui/LinkCardGrid";
import type {
  Dictionary,
  LocalizedCity,
  LocalizedHome,
  LocalizedHub,
  LocalizedServices,
  TranslationStatus,
} from "@/i18n/types";
import type { TrustedClient } from "@/lib/portfolio/clients";
import { whatsappLink, type OfficeContact } from "@/lib/seo/offices";

interface Shell {
  dict: Dictionary;
  status: TranslationStatus;
  breadcrumbs: BreadcrumbItem[];
  /** English version of this page */
  enPath: string;
  office: OfficeContact;
  clients: TrustedClient[];
}

function Header({
  dict,
  breadcrumbs,
  enPath,
  office,
  badge,
  h1,
  intro,
}: Shell & { badge: string; h1: string; intro: string }) {
  const whatsappHref = whatsappLink(office, h1);
  return (
    <header className="page-top relative overflow-hidden border-b border-border bg-surface pb-12 sm:pb-16">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={breadcrumbs} />
        <LanguageLinks links={[{ href: enPath, label: dict.ui.viewInEnglish, hrefLang: "en" }]} />
        <span className="section-badge mb-5 inline-flex">{badge}</span>
        <h1 className="max-w-4xl font-display text-3xl font-bold sm:text-4xl md:text-5xl md:leading-[1.2]">{h1}</h1>
        <p className="mt-5 max-w-3xl text-base leading-relaxed text-muted sm:text-lg">{intro}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy"
          >
            <MessageCircle size={16} aria-hidden />
            {dict.ui.whatsappUs}
          </a>
          {office.phones[0] && (
            <a
              href={office.phones[0].href}
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-white px-6 py-2.5 text-sm font-semibold text-foreground"
            >
              <Phone size={16} aria-hidden />
              <span dir="ltr">{office.phones[0].display}</span>
            </a>
          )}
        </div>
        <p className="mt-4 flex items-center gap-2 text-xs text-muted">
          <MapPin size={14} aria-hidden className="text-accent" />
          {dict.ui.officeLine} {dict.ui.officeNames[office.id]}
        </p>
      </div>
    </header>
  );
}

function Wrap({ dict, children }: { dict: Dictionary; children: React.ReactNode }) {
  return (
    <LocaleContent locale={dict.locale} dir={dict.dir} humanReviewed={dict.humanReviewed} draftBanner={dict.ui.draftBanner}>
      {children}
    </LocaleContent>
  );
}

export function LocalizedHomePage({
  page,
  services,
  servicesHref,
  regionLinks,
  ...shell
}: Shell & {
  page: LocalizedHome;
  services: { name: string; summary: string; href: string }[];
  servicesHref: string;
  regionLinks: { href: string; title: string }[];
}) {
  return (
    <Wrap dict={shell.dict}>
      <Header {...shell} badge={page.badge} h1={page.h1} intro={page.intro} />
      <TrustedBy clients={shell.clients} title={shell.dict.ui.trustedBy} />
      <section className="py-14 sm:py-20" aria-labelledby="l-services">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 id="l-services" className="font-display text-3xl font-bold sm:text-4xl">
            <Link href={servicesHref} className="hover:text-accent">{page.servicesHeading}</Link>
          </h2>
          <div className="mt-8">
            <LinkCardGrid items={services.map((item) => ({ href: item.href, title: item.name, description: item.summary }))} />
          </div>
        </div>
      </section>
      {regionLinks.length > 0 && (
        <section className="border-t border-border bg-surface/50 py-14 sm:py-20" aria-labelledby="l-offices">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 id="l-offices" className="font-display text-3xl font-bold sm:text-4xl">{page.officesHeading}</h2>
            <p className="mt-3 max-w-2xl text-muted">{page.officesIntro}</p>
            <div className="mt-8">
              <LinkCardGrid columns={2} items={regionLinks} />
            </div>
          </div>
        </section>
      )}
      <FaqSection badge={shell.dict.ui.faqBadge} title={shell.dict.ui.faqHeading} subtitle="" items={page.faqs} />
    </Wrap>
  );
}

export function LocalizedServicesPage({
  page,
  services,
  ...shell
}: Shell & { page: LocalizedServices; services: { name: string; summary: string; href: string }[] }) {
  return (
    <Wrap dict={shell.dict}>
      <Header {...shell} badge={shell.dict.ui.services} h1={page.h1} intro={page.intro} />
      <TrustedBy clients={shell.clients} title={shell.dict.ui.trustedBy} />
      <section className="py-14 sm:py-20" aria-labelledby="l-all-services">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 id="l-all-services" className="sr-only">{shell.dict.ui.services}</h2>
          <LinkCardGrid items={services.map((item) => ({ href: item.href, title: item.name, description: item.summary }))} />
        </div>
      </section>
    </Wrap>
  );
}

export function LocalizedHubPage({
  page,
  cityLinks,
  ...shell
}: Shell & { page: LocalizedHub; cityLinks: { href: string; title: string; description?: string }[] }) {
  return (
    <Wrap dict={shell.dict}>
      <Header {...shell} badge={page.name} h1={page.h1} intro={page.intro} />
      <TrustedBy clients={shell.clients} title={shell.dict.ui.trustedBy} />
      <section className="py-14 sm:py-20" aria-labelledby="l-how">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
          <h2 id="l-how" className="sr-only">{page.name}</h2>
          {page.howWeServe.map((item) => (
            <article key={item.title} className="premium-card rounded-2xl p-5">
              <CheckCircle2 size={20} className="text-accent" aria-hidden />
              <h3 className="mt-3 font-display text-base font-bold">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{item.description}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="border-t border-border bg-surface/50 py-14 sm:py-20" aria-labelledby="l-cities">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 id="l-cities" className="font-display text-3xl font-bold sm:text-4xl">{page.citiesHeading}</h2>
          <div className="mt-8">
            <LinkCardGrid columns={4} items={cityLinks} />
          </div>
        </div>
      </section>
      <FaqSection badge={shell.dict.ui.faqBadge} title={shell.dict.ui.faqHeading} subtitle="" items={page.faqs} />
    </Wrap>
  );
}

export function LocalizedCityPage({ page, ...shell }: Shell & { page: LocalizedCity }) {
  return (
    <Wrap dict={shell.dict}>
      <Header {...shell} badge={`${page.city}${shell.dict.dir === "rtl" ? "،" : ","} ${page.country}`} h1={page.h1} intro={page.intro} />
      <TrustedBy clients={shell.clients} title={shell.dict.ui.trustedBy} />
      <section className="py-14 sm:py-20" aria-labelledby="l-overview">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <h2 id="l-overview" className="font-display text-3xl font-bold sm:text-4xl">{page.metaTitle}</h2>
            <div className="mt-6 space-y-4 text-base leading-relaxed text-muted sm:text-lg">
              {page.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
          <div className="space-y-8">
            <div>
              <h2 className="mb-4 font-display text-xl font-bold">{shell.dict.ui.industriesHeading}</h2>
              <ul className="grid gap-3 sm:grid-cols-2">
                {page.industries.map((industry) => (
                  <li key={industry} className="premium-card rounded-xl px-5 py-4 text-sm font-semibold">{industry}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="mb-4 font-display text-xl font-bold">{shell.dict.ui.highlightsHeading}</h2>
              <ul className="space-y-3">
                {page.highlights.map((item) => (
                  <li key={item} className="flex gap-3 text-sm">
                    <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-accent" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
      <FaqSection badge={shell.dict.ui.faqBadge} title={shell.dict.ui.faqHeading} subtitle="" items={page.faqs} />
    </Wrap>
  );
}
