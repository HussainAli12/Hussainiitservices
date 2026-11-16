import { SiteLayout } from "@/components/layout/SiteLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { PortfolioGridCard } from "@/components/sections/portfolio/PortfolioGridCard";
import { PageSeo } from "@/components/seo/PageSeo";
import { fetchPortfolio } from "@/lib/data/fetch";
import { createPageMetadata } from "@/lib/seo";
import { breadcrumbJsonLd, portfolioItemListJsonLd, webPageJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 120;

export const metadata = createPageMetadata({
  title: "Portfolio — Web & Ecommerce Work",
  description:
    "See websites, ecommerce, Shopify, and digital marketing projects from Hussaini IT Services for clients in the UAE, India, and worldwide.",
  path: "/portfolio",
});

export default async function PortfolioPage() {
  const items = await fetchPortfolio();

  const pageTitle = "Portfolio — Web & Ecommerce Work";
  const pageDescription =
    "See websites, ecommerce, Shopify, and digital marketing projects from Hussaini IT Services for clients in the UAE, India, and worldwide.";

  return (
    <>
      <PageSeo
        schemas={[
          webPageJsonLd({ title: pageTitle, description: pageDescription, path: "/portfolio" }),
          portfolioItemListJsonLd(items),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Portfolio", path: "/portfolio" },
          ]),
        ]}
      />
      <SiteLayout>
        <PageHeader
          breadcrumbs={[{ name: "Home", path: "/" }, { name: "Portfolio", path: "/portfolio" }]}
          badge="Portfolio"
          title="Client projects in web, ecommerce & marketing"
          subtitle="Selected websites, stores, and campaigns delivered for businesses in the UAE, India, and beyond."
        />
        <section className="py-12 sm:py-16 md:py-24" aria-labelledby="portfolio-projects-heading">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 id="portfolio-projects-heading" className="sr-only">
              Featured client projects
            </h2>
            {items.length === 0 ? (
              <p className="max-w-md text-muted">
                No projects yet. Check back soon, or add one from the admin panel.
              </p>
            ) : (
              <div className="grid items-stretch gap-6 sm:gap-8 md:grid-cols-2">
                {items.map((project) => (
                  <PortfolioGridCard key={project.id} project={project} />
                ))}
              </div>
            )}
          </div>
        </section>
      </SiteLayout>
    </>
  );
}
