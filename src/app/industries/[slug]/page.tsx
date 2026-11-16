import { notFound } from "next/navigation";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { PageSeo } from "@/components/seo/PageSeo";
import { IndustryDetail } from "@/components/sections/industries/IndustryDetail";
import { fetchPortfolio } from "@/lib/data/fetch";
import { getRelevantTrustedClients } from "@/lib/portfolio/clients";
import { createPageMetadata } from "@/lib/seo";
import { getIndustryPage, industryHref, industryPages } from "@/lib/seo/industries";
import { breadcrumbJsonLd, faqJsonLd, linkItemListJsonLd, webPageJsonLd } from "@/lib/seo/jsonld";
import { filterPortfolioByIndustry } from "@/lib/seo/portfolio-tags";

export const revalidate = 3600;
export const dynamicParams = false;

interface IndustryPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return industryPages.map((industry) => ({ slug: industry.slug }));
}

export async function generateMetadata({ params }: IndustryPageProps) {
  const { slug } = await params;
  const industry = getIndustryPage(slug);
  if (!industry) {
    return createPageMetadata({
      title: "Page Not Found",
      description: "This page could not be found.",
      path: `/industries/${slug}`,
      noindex: true,
    });
  }
  return createPageMetadata({
    title: industry.metaTitle,
    description: industry.metaDescription,
    path: industryHref(industry.slug),
    generatedImage: true,
  });
}

export default async function IndustryRoute({ params }: IndustryPageProps) {
  const { slug } = await params;
  const industry = getIndustryPage(slug);
  if (!industry) notFound();

  const path = industryHref(industry.slug);
  const allPortfolio = await fetchPortfolio();
  const portfolio = filterPortfolioByIndustry(allPortfolio, industry.slug);
  const clients = getRelevantTrustedClients(allPortfolio, { industry: industry.slug });
  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Industries", path: "/industries" },
    { name: industry.name, path },
  ];

  return (
    <>
      <PageSeo
        schemas={[
          webPageJsonLd({ title: industry.headline, description: industry.metaDescription, path }),
          ...(portfolio.length > 0
            ? [
                linkItemListJsonLd(
                  `${industry.name} projects`,
                  path,
                  portfolio.map((project) => ({ name: project.title, path: `/portfolio/${project.slug}` })),
                ),
              ]
            : []),
          faqJsonLd(industry.faqs),
          breadcrumbJsonLd(breadcrumbs),
        ]}
      />
      <SiteLayout>
        <IndustryDetail industry={industry} breadcrumbs={breadcrumbs} portfolio={portfolio} clients={clients} />
      </SiteLayout>
    </>
  );
}
