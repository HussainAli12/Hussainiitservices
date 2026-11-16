import Link from "next/link";
import { Check } from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { PageSeo } from "@/components/seo/PageSeo";
import { FaqSection } from "@/components/sections/FaqSection";
import { TrustedBy } from "@/components/sections/TrustedBy";
import { PageHeader } from "@/components/ui/PageHeader";
import { fetchPortfolio } from "@/lib/data/fetch";
import { getTrustedClients } from "@/lib/portfolio/clients";
import { createPageMetadata } from "@/lib/seo";
import { breadcrumbJsonLd, faqJsonLd, webPageJsonLd } from "@/lib/seo/jsonld";
import { pricingFaqs, pricingPackages, quoteCurrencies } from "@/lib/seo/pricing";
import { cn } from "@/lib/utils";

export const revalidate = 3600;

const title = "Website & SEO Pricing";
const description =
  "Website, ecommerce and monthly SEO packages from Hussaini IT Services. Every project gets a written quote in INR, AED or SAR before work starts.";

export const metadata = createPageMetadata({ title, description, path: "/pricing" });

const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "Pricing", path: "/pricing" },
];

export default async function PricingPage() {
  const clients = getTrustedClients(await fetchPortfolio());

  return (
    <>
      <PageSeo
        schemas={[
          webPageJsonLd({ title, description, path: "/pricing" }),
          faqJsonLd(pricingFaqs),
          breadcrumbJsonLd(breadcrumbs),
        ]}
      />
      <SiteLayout>
        <PageHeader
          breadcrumbs={breadcrumbs}
          badge="Pricing"
          title="Website, ecommerce & SEO pricing"
          subtitle="Our most common packages for India, the UAE and Saudi Arabia. Every project is quoted individually, in writing, before work starts."
        />
        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="sr-only">Packages</h2>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {pricingPackages.map((pkg) => (
                <article
                  key={pkg.id}
                  className={cn(
                    "premium-card flex h-full flex-col rounded-2xl p-6",
                    pkg.highlighted && "ring-2 ring-accent/40",
                  )}
                >
                  <p className="text-xs font-semibold uppercase tracking-wider text-accent">
                    {pkg.billing === "monthly" ? "Monthly" : "One-time project"}
                  </p>
                  <h3 className="mt-2 font-display text-xl font-bold">{pkg.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{pkg.audience}</p>

                  <div className="mt-5 rounded-xl border border-border bg-white px-4 py-3.5">
                    <p className="font-display text-lg font-bold text-foreground">Custom quote</p>
                    <p className="mt-1 text-xs text-muted">
                      Written quote in {quoteCurrencies.join(" · ")} after a short call
                      {pkg.billing === "monthly" ? " · billed monthly" : ""}
                    </p>
                  </div>

                  <ul className="mt-5 flex-1 space-y-2.5">
                    {pkg.includes.map((item) => (
                      <li key={item} className="flex gap-2 text-sm leading-relaxed text-foreground">
                        <Check size={16} className="mt-0.5 shrink-0 text-accent" aria-hidden />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 flex flex-col gap-2">
                    <Link
                      href="/contact"
                      className="inline-flex min-h-11 items-center justify-center rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy"
                    >
                      Get a quote
                    </Link>
                    <Link href={pkg.serviceHref} className="text-center text-sm font-semibold text-accent hover:underline">
                      What’s involved →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
            <p className="mt-8 text-center text-sm text-muted">
              Not sure which fits?{" "}
              <Link href="/free-website-audit" className="font-semibold text-accent hover:underline">
                Request a free website audit
              </Link>{" "}
              and we’ll recommend a starting point.
            </p>
          </div>
        </section>
        <TrustedBy clients={clients} className="border-t border-border" />
        <FaqSection title="Pricing FAQs" items={pricingFaqs} />
      </SiteLayout>
    </>
  );
}
