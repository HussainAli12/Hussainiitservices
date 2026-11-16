import { notFound } from "next/navigation";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { PageSeo } from "@/components/seo/PageSeo";
import { MarketHubDetail } from "@/components/sections/markets/MarketHubDetail";
import { fetchPortfolio } from "@/lib/data/fetch";
import { getRelevantTrustedClients } from "@/lib/portfolio/clients";
import { hreflangLanguages, publishedAlternates } from "@/i18n/routes";
import { getDictionary } from "@/i18n/routes";
import { createPageMetadata } from "@/lib/seo";
import {
  breadcrumbJsonLd,
  faqJsonLd,
  linkItemListJsonLd,
  webPageJsonLd,
} from "@/lib/seo/jsonld";
import { getMarketCities, getMarketHub, marketHref, marketHubs } from "@/lib/seo/markets";
import { offices } from "@/lib/seo/offices";
import { filterPortfolioByMarket } from "@/lib/seo/portfolio-tags";

export const revalidate = 3600;
export const dynamicParams = false;

interface MarketPageProps {
  params: Promise<{ market: string }>;
}

export function generateStaticParams() {
  return marketHubs.map((hub) => ({ market: hub.slug }));
}

export async function generateMetadata({ params }: MarketPageProps) {
  const { market } = await params;
  const hub = getMarketHub(market);
  if (!hub) {
    return createPageMetadata({
      title: "Page Not Found",
      description: "This page could not be found.",
      path: `/it-services/${market}`,
      noindex: true,
    });
  }
  return createPageMetadata({
    title: hub.metaTitle,
    description: hub.metaDescription,
    path: marketHref(hub.slug),
    languages: hreflangLanguages(marketHref(hub.slug)),
    generatedImage: true,
  });
}

const HUB_COUNTRY: Record<string, string | undefined> = {
  india: "IN",
  uae: "AE",
  "saudi-arabia": "SA",
};

export default async function MarketPage({ params }: MarketPageProps) {
  const { market } = await params;
  const hub = getMarketHub(market);
  if (!hub) notFound();

  const path = marketHref(hub.slug);
  const allPortfolio = await fetchPortfolio();
  let portfolio = filterPortfolioByMarket(allPortfolio, hub.slug);
  let portfolioIsFallback = false;
  if (portfolio.length === 0 && hub.slug !== "india") {
    portfolio = filterPortfolioByMarket(allPortfolio, "gcc");
    portfolioIsFallback = true;
  }
  const clients = getRelevantTrustedClients(allPortfolio, { country: HUB_COUNTRY[hub.slug] ?? "AE" });
  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "IT Services by Region", path: "/it-services" },
    { name: hub.name, path },
  ];
  const cities = getMarketCities(hub);

  return (
    <>
      <PageSeo
        schemas={[
          webPageJsonLd({ title: hub.headline, description: hub.metaDescription, path, type: "CollectionPage" }),
          linkItemListJsonLd(
            `IT services in ${hub.name} by city`,
            path,
            cities.map((city) => ({ name: `Best IT services in ${city.city}`, path: city.href })),
          ),
          faqJsonLd(hub.faqs),
          breadcrumbJsonLd(breadcrumbs),
        ]}
      />
      <SiteLayout>
        <MarketHubDetail
          hub={hub}
          office={offices[hub.office]}
          breadcrumbs={breadcrumbs}
          portfolio={portfolio.slice(0, 6)}
          portfolioIsFallback={portfolioIsFallback}
          clients={clients}
          languageLinks={publishedAlternates(path).map((route) => ({
            href: route.path,
            label: getDictionary(route.locale).languageName,
            hrefLang: route.locale,
          }))}
        />
      </SiteLayout>
    </>
  );
}
