import Link from "next/link";
import { createElement } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  ChevronRight,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";
import { BlogCard } from "@/components/blog/BlogCard";
import { FaqSection } from "@/components/sections/FaqSection";
import { GetStartedSection } from "@/components/sections/CTA";
import { PortfolioGridCard } from "@/components/sections/portfolio/PortfolioGridCard";
import { TrustedBy } from "@/components/sections/TrustedBy";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { getLocationPage } from "@/lib/seo/locations";
import { whatsappLink, type OfficeContact } from "@/lib/seo/offices";
import { getServiceIcon, processIcons } from "@/lib/seo/service-visuals";
import {
  getServiceLocationsForCity,
  getServiceLocationsForService,
  serviceLocationHref,
  serviceLocationLinkLabel,
  type ResolvedServiceLocation,
} from "@/lib/seo/service-locations";
import type { TrustedClient } from "@/lib/portfolio/clients";
import type { DbBlog, DbPortfolio } from "@/lib/types/database";

interface ServiceLocationDetailProps {
  resolved: ResolvedServiceLocation;
  office: OfficeContact;
  portfolio: { project: DbPortfolio; local: boolean }[];
  posts: DbBlog[];
  clients: TrustedClient[];
}

function ServiceIcon({ slug, size }: { slug: string; size: number }) {
  return createElement(getServiceIcon(slug), { size });
}

function StepIcon({ index, size }: { index: number; size: number }) {
  return createElement(processIcons[index] ?? processIcons[0], { size });
}

export function ServiceLocationDetail({
  resolved,
  office,
  portfolio,
  posts,
  clients,
}: ServiceLocationDetailProps) {
  const { page, service, location, h1, included, process } = resolved;
  const whatsappHref = whatsappLink(office, `Hi, I'm interested in ${service.title.toLowerCase()} in ${location.city}.`);
  const otherCities = getServiceLocationsForService(page.service).filter((item) => item.city !== page.city);
  const otherServices = getServiceLocationsForCity(page.city).filter((item) => item.service !== page.service);
  const hasLocalWork = portfolio.some((item) => item.local);

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
            <Link href={`/services/${service.slug}`} className="transition-colors hover:text-accent">
              {service.title}
            </Link>
            <ChevronRight size={14} aria-hidden />
            <span className="font-medium text-foreground" aria-current="page">
              {location.city}
            </span>
          </nav>

          <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-7">
              <div className="icon-box mb-6 h-14 w-14">
                <ServiceIcon slug={service.slug} size={26} />
              </div>
              <span className="section-badge mb-5 inline-flex">
                {location.city}, {location.country}
              </span>
              <h1 className="max-w-3xl font-display text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:leading-[1.1]">
                {h1}
              </h1>
              <p className="mt-5 max-w-2xl border-l-2 border-accent/30 pl-5 text-base leading-relaxed text-muted sm:text-lg">
                {page.intro}
              </p>
              <div className="mt-8 flex flex-row flex-wrap items-center gap-3">
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy"
                >
                  <MessageCircle size={16} aria-hidden />
                  WhatsApp us
                </a>
                {office.phones[0] && (
                  <a
                    href={office.phones[0].href}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-border bg-white px-6 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-accent/30 hover:bg-surface"
                  >
                    <Phone size={16} aria-hidden />
                    {office.phones[0].display}
                  </a>
                )}
              </div>
            </div>

            {/* Direct answer block — written for search snippets and AI answers */}
            <aside className="premium-card rounded-2xl p-6 sm:p-8 lg:col-span-5" aria-labelledby="quick-answer">
              <p id="quick-answer" className="text-xs font-semibold uppercase tracking-wider text-accent">
                Quick answer
              </p>
              <p className="mt-2 font-display text-lg font-bold leading-snug">
                Who is the best {service.title.toLowerCase()} company in {location.city}?
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">{page.answer}</p>
              <p className="mt-4 flex items-center gap-2 text-xs text-muted">
                <MapPin size={14} aria-hidden className="text-accent" />
                Served from our {office.city} office
              </p>
            </aside>
          </div>
        </div>
      </header>

      <TrustedBy clients={clients} />

      <section className="py-14 sm:py-20 md:py-24" aria-labelledby="local-overview">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
            <RevealOnScroll className="lg:col-span-6">
              <span className="section-badge mb-5 inline-block">{location.city}</span>
              <h2 id="local-overview" className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                {service.title} for {location.city} businesses
              </h2>
              <div className="mt-6 space-y-4 text-base leading-relaxed text-muted sm:text-lg">
                {page.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </RevealOnScroll>
            <div className="lg:col-span-6">
              <h2 className="mb-4 font-display text-2xl font-bold tracking-tight">
                Who it is for in {location.city}
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {page.audience.map((item) => (
                  <article key={item.title} className="premium-card rounded-xl px-5 py-4">
                    <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted">{item.description}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-surface/50 py-14 sm:py-20 md:py-24" aria-labelledby="included">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <h2 id="included" className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                What’s included
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted">
                Every {service.title.toLowerCase()} project for {location.city} starts with a written scope.
                Typical inclusions:
              </p>
              <ul className="mt-6 space-y-3">
                {included.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-relaxed text-foreground sm:text-base">
                    <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-accent" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="lg:col-span-7">
              <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">How we work</h2>
              <ol className="mt-6 grid gap-4 sm:grid-cols-2">
                {process.map((step, index) => (
                  <li key={step.title} className="premium-card relative rounded-2xl p-5 sm:p-6">
                    <div className="icon-box mb-4 h-10 w-10">
                      <StepIcon index={index % processIcons.length} size={18} />
                    </div>
                    <h3 className="font-display text-lg font-bold">
                      {String(index + 1).padStart(2, "0")} · {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{step.description}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {portfolio.length > 0 && (
        <section className="py-14 sm:py-20 md:py-24" aria-labelledby="related-work">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 id="related-work" className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              {hasLocalWork ? `Our ${service.title.toLowerCase()} work in ${location.country}` : `Related ${service.title.toLowerCase()} work`}
            </h2>
            <p className="mt-3 max-w-2xl text-muted">
              Real projects from our portfolio{hasLocalWork ? "" : " — from other markets we serve"}.
            </p>
            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {portfolio.map(({ project }) => (
                <PortfolioGridCard key={project.id} project={project} headingLevel="h3" />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="border-t border-border py-14 sm:py-20" aria-labelledby="areas-served">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h2 id="areas-served" className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
                Areas we serve near {location.city}
              </h2>
              <ul className="mt-6 flex flex-wrap gap-2">
                {page.nearbyAreas.map((area) => {
                  const areaPage = getLocationPage(area.toLowerCase().replace(/\s+/g, "-"));
                  return (
                    <li key={area}>
                      {areaPage ? (
                        <Link
                          href={areaPage.href}
                          className="inline-flex rounded-full border border-accent/30 bg-white px-3.5 py-1.5 text-sm font-medium text-accent transition-colors hover:bg-accent hover:text-white"
                        >
                          {area}
                        </Link>
                      ) : (
                        <span className="inline-flex rounded-full border border-border bg-white px-3.5 py-1.5 text-sm text-muted">
                          {area}
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
            <nav aria-labelledby="explore-more">
              <h2 id="explore-more" className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
                Explore more
              </h2>
              <ul className="mt-6 space-y-2.5 text-sm">
                <li>
                  <Link href={`/services/${service.slug}`} className="inline-flex items-center gap-1.5 font-semibold text-accent hover:underline">
                    {service.title} services <ArrowUpRight size={14} aria-hidden />
                  </Link>
                </li>
                <li>
                  <Link href={location.href} className="inline-flex items-center gap-1.5 font-semibold text-accent hover:underline">
                    Best IT services in {location.city} <ArrowUpRight size={14} aria-hidden />
                  </Link>
                </li>
                {otherServices.map((item) => (
                  <li key={serviceLocationHref(item)}>
                    <Link href={serviceLocationHref(item)} className="inline-flex items-center gap-1.5 text-foreground hover:text-accent">
                      {serviceLocationLinkLabel(item)} <ArrowRight size={14} aria-hidden />
                    </Link>
                  </li>
                ))}
                {otherCities.map((item) => (
                  <li key={serviceLocationHref(item)}>
                    <Link href={serviceLocationHref(item)} className="inline-flex items-center gap-1.5 text-foreground hover:text-accent">
                      {serviceLocationLinkLabel(item)} <ArrowRight size={14} aria-hidden />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </section>

      {posts.length > 0 && (
        <section className="border-t border-border bg-surface/50 py-14 sm:py-20" aria-labelledby="related-reading">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 id="related-reading" className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
              Related reading
            </h2>
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <BlogCard key={post.id} post={post} headingLevel="h3" />
              ))}
            </div>
          </div>
        </section>
      )}

      <FaqSection
        title={`${service.title} in ${location.city} — FAQs`}
        subtitle="Straight answers before you enquire."
        items={page.faqs}
      />
      <GetStartedSection
        title={`Talk to our ${office.city} team about ${service.title.toLowerCase()} in ${location.city}`}
        description="Tell us what you want to launch or improve. We reply within one business day."
        phones={office.phones}
        whatsapp={{ display: office.whatsapp.display, href: whatsappHref }}
      />
    </>
  );
}
