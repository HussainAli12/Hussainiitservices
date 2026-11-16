import { notFound } from "next/navigation";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { LocalizedHubPage } from "@/components/i18n/LocalizedPages";
import { PageSeo } from "@/components/seo/PageSeo";
import { altLocales } from "@/i18n/config";
import { buildChrome } from "@/i18n/build-chrome";
import { localizedMetadata } from "@/i18n/metadata";
import { localizedClients, requireLocale } from "@/i18n/page-data";
import { getDictionary, localizedPathFor } from "@/i18n/routes";
import { breadcrumbJsonLd, faqJsonLd, webPageJsonLd } from "@/lib/seo/jsonld";
import { getMarketCities, getMarketHub, marketHref } from "@/lib/seo/markets";
import { offices } from "@/lib/seo/offices";

export const revalidate = 3600;
export const dynamicParams = false;

interface Props {
  params: Promise<{ lang: string; market: string }>;
}

export function generateStaticParams() {
  return altLocales.flatMap((lang) =>
    Object.keys(getDictionary(lang).hubs).map((market) => ({ lang, market })),
  );
}

function load(lang: string, market: string) {
  const locale = requireLocale(lang);
  const hub = getMarketHub(market);
  const page = locale ? getDictionary(locale).hubs[market] : undefined;
  return locale && hub && page ? { locale, hub, page, dict: getDictionary(locale) } : null;
}

export async function generateMetadata({ params }: Props) {
  const { lang, market } = await params;
  const data = load(lang, market);
  if (!data) return {};
  const enPath = marketHref(data.hub.slug);
  return localizedMetadata({
    locale: data.locale,
    title: data.page.metaTitle,
    description: data.page.metaDescription,
    path: `/${data.locale}${enPath}`,
    enPath,
    status: data.page.status,
  });
}

export default async function LocalizedHub({ params }: Props) {
  const { lang, market } = await params;
  const data = load(lang, market);
  if (!data) notFound();
  const { locale, hub, page, dict } = data;
  const enPath = marketHref(hub.slug);
  const path = `/${locale}${enPath}`;
  const breadcrumbs = [
    { name: dict.ui.home, path: `/${locale}` },
    { name: page.name, path },
  ];
  const cityLinks = getMarketCities(hub).map((location) => {
    const localized = localizedPathFor(locale, location.href);
    const city = dict.cities[location.slug];
    return {
      href: localized ?? location.href,
      title: city?.city ?? location.city,
      description: localized ? undefined : "English",
    };
  });

  return (
    <>
      <PageSeo
        schemas={[
          { ...webPageJsonLd({ title: page.h1, description: page.metaDescription, path }), inLanguage: locale },
          faqJsonLd(page.faqs),
          breadcrumbJsonLd(breadcrumbs),
        ]}
      />
      <SiteLayout chrome={buildChrome(locale)}>
        <LocalizedHubPage
          dict={dict}
          status={page.status}
          breadcrumbs={breadcrumbs}
          enPath={enPath}
          office={offices[hub.office]}
          clients={await localizedClients(locale)}
          page={page}
          cityLinks={cityLinks}
        />
      </SiteLayout>
    </>
  );
}
