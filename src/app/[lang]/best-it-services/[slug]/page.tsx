import { notFound } from "next/navigation";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { LocalizedCityPage } from "@/components/i18n/LocalizedPages";
import { PageSeo } from "@/components/seo/PageSeo";
import { altLocales } from "@/i18n/config";
import { buildChrome } from "@/i18n/build-chrome";
import { localizedMetadata } from "@/i18n/metadata";
import { localizedClients, requireLocale } from "@/i18n/page-data";
import { getDictionary, localizedPathFor } from "@/i18n/routes";
import { breadcrumbJsonLd, faqJsonLd, locationServiceJsonLd, webPageJsonLd } from "@/lib/seo/jsonld";
import { getLocationPage } from "@/lib/seo/locations";
import { marketForLocation, marketHref } from "@/lib/seo/markets";
import { officeForCountry } from "@/lib/seo/offices";

export const revalidate = 3600;
export const dynamicParams = false;

interface Props {
  params: Promise<{ lang: string; slug: string }>;
}

export function generateStaticParams() {
  return altLocales.flatMap((lang) =>
    Object.keys(getDictionary(lang).cities)
      .filter((slug) => getLocationPage(slug))
      .map((slug) => ({ lang, slug })),
  );
}

function load(lang: string, slug: string) {
  const locale = requireLocale(lang);
  const location = getLocationPage(slug);
  const page = locale ? getDictionary(locale).cities[slug] : undefined;
  return locale && location && page ? { locale, location, page, dict: getDictionary(locale) } : null;
}

export async function generateMetadata({ params }: Props) {
  const { lang, slug } = await params;
  const data = load(lang, slug);
  if (!data) return {};
  return localizedMetadata({
    locale: data.locale,
    title: data.page.metaTitle,
    description: data.page.metaDescription,
    path: `/${data.locale}${data.location.href}`,
    enPath: data.location.href,
    status: data.page.status,
  });
}

export default async function LocalizedCity({ params }: Props) {
  const { lang, slug } = await params;
  const data = load(lang, slug);
  if (!data) notFound();
  const { locale, location, page, dict } = data;
  const path = `/${locale}${location.href}`;
  const hub = marketForLocation(location);
  const hubPath = hub ? localizedPathFor(locale, marketHref(hub.slug)) : null;
  const breadcrumbs = [
    { name: dict.ui.home, path: `/${locale}` },
    ...(hub && hubPath ? [{ name: dict.hubs[hub.slug]?.name ?? hub.name, path: hubPath }] : []),
    { name: page.city, path },
  ];

  return (
    <>
      <PageSeo
        schemas={[
          { ...webPageJsonLd({ title: page.h1, description: page.metaDescription, path }), inLanguage: locale },
          { ...locationServiceJsonLd(location), "@id": `${path}#service`, name: page.metaTitle, description: page.intro },
          faqJsonLd(page.faqs),
          breadcrumbJsonLd(breadcrumbs),
        ]}
      />
      <SiteLayout chrome={buildChrome(locale)}>
        <LocalizedCityPage
          dict={dict}
          status={page.status}
          breadcrumbs={breadcrumbs}
          enPath={location.href}
          office={officeForCountry(location.country)}
          clients={await localizedClients(locale)}
          page={page}
        />
      </SiteLayout>
    </>
  );
}
