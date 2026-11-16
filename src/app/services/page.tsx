import { SiteLayout } from "@/components/layout/SiteLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { Services } from "@/components/sections/Services";
import { AllServicesList } from "@/components/sections/AllServicesList";
import { FaqSection } from "@/components/sections/FaqSection";
import { PageSeo } from "@/components/seo/PageSeo";
import { TrustedBy } from "@/components/sections/TrustedBy";
import { fetchPortfolio } from "@/lib/data/fetch";
import { getTrustedClients } from "@/lib/portfolio/clients";
import { hreflangLanguages } from "@/i18n/routes";
import { createPageMetadata } from "@/lib/seo";
import { serviceFaqs } from "@/lib/seo/content";
import {
  breadcrumbJsonLd,
  faqJsonLd,
  servicesCatalogJsonLd,
  webPageJsonLd,
} from "@/lib/seo/jsonld";

export const metadata = createPageMetadata({
  title: "Web, Software, Ads & AI Services",
  description:
    "Digital presence, custom CRM/SaaS, Google Ads & social, and AI voice agents from Hussaini IT Services in Dubai and Ujjain — plus SEO, ecommerce, apps, and design.",
  path: "/services",
  languages: hreflangLanguages("/services"),
});

export const revalidate = 3600;

export default async function ServicesPage() {
  const clients = getTrustedClients(await fetchPortfolio());
  const pageTitle = "Web, Software, Ads & AI Services";
  const pageDescription =
    "Digital presence, custom CRM/SaaS, Google Ads & social, and AI voice agents from Hussaini IT Services in Dubai and Ujjain — plus SEO, ecommerce, apps, and design.";

  return (
    <>
      <PageSeo
        schemas={[
          webPageJsonLd({ title: pageTitle, description: pageDescription, path: "/services" }),
          servicesCatalogJsonLd(),
          faqJsonLd(serviceFaqs),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
          ]),
        ]}
      />
      <SiteLayout>
        <PageHeader
          breadcrumbs={[{ name: "Home", path: "/" }, { name: "Services", path: "/services" }]}
          badge="Services"
          title="Web, software, ads & AI voice agents"
          subtitle="Four focused pillars — digital presence, custom software, paid ads and social, and AI voice agents — plus specialist SEO, ecommerce, apps, and design."
        />
        <TrustedBy clients={clients} />
        <Services />
        <section className="border-t border-border bg-surface py-12 sm:py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-3 text-center font-display text-2xl font-bold sm:mb-4 sm:text-3xl">All Services</h2>
            <p className="mx-auto mb-8 max-w-xl text-center text-sm text-muted sm:mb-12 sm:text-base">
              Everything you need to build, market, and grow your business online.
            </p>
            <AllServicesList />
          </div>
        </section>
        <FaqSection items={serviceFaqs} />
      </SiteLayout>
    </>
  );
}
