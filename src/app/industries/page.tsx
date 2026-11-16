import { SiteLayout } from "@/components/layout/SiteLayout";
import { PageSeo } from "@/components/seo/PageSeo";
import { TrustedBy } from "@/components/sections/TrustedBy";
import { LinkCardGrid } from "@/components/ui/LinkCardGrid";
import { PageHeader } from "@/components/ui/PageHeader";
import { fetchPortfolio } from "@/lib/data/fetch";
import { getTrustedClients } from "@/lib/portfolio/clients";
import { createPageMetadata } from "@/lib/seo";
import { industryHref, industryPages } from "@/lib/seo/industries";
import { breadcrumbJsonLd, linkItemListJsonLd, webPageJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 3600;

const title = "Industries We Serve";
const description =
  "Websites, ecommerce, SEO and LinkedIn for real estate, jewellery, fashion ecommerce, travel and tourism, and industrial companies in India and the GCC.";

export const metadata = createPageMetadata({ title, description, path: "/industries" });

const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "Industries", path: "/industries" },
];

export default async function IndustriesIndexPage() {
  const clients = getTrustedClients(await fetchPortfolio());

  return (
    <>
      <PageSeo
        schemas={[
          webPageJsonLd({ title, description, path: "/industries", type: "CollectionPage" }),
          linkItemListJsonLd(
            title,
            "/industries",
            industryPages.map((industry) => ({ name: industry.name, path: industryHref(industry.slug) })),
          ),
          breadcrumbJsonLd(breadcrumbs),
        ]}
      />
      <SiteLayout>
        <PageHeader
          breadcrumbs={breadcrumbs}
          badge="Industries"
          title="Industries we serve"
          subtitle="Sector-specific websites, stores and marketing, backed by real projects in our portfolio."
        />
        <TrustedBy clients={clients} />
        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="sr-only">All industries</h2>
            <LinkCardGrid
              columns={3}
              items={industryPages.map((industry) => ({
                href: industryHref(industry.slug),
                title: industry.name,
                description: industry.intro,
              }))}
            />
          </div>
        </section>
      </SiteLayout>
    </>
  );
}
