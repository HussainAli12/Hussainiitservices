import { notFound } from "next/navigation";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { LocalizedHomePage } from "@/components/i18n/LocalizedPages";
import { PageSeo } from "@/components/seo/PageSeo";
import { buildChrome } from "@/i18n/build-chrome";
import { localizedMetadata } from "@/i18n/metadata";
import { localizedClients, localizedServiceList, officeIdFor, requireLocale } from "@/i18n/page-data";
import { getDictionary, localizedPathFor } from "@/i18n/routes";
import { breadcrumbJsonLd, faqJsonLd, webPageJsonLd } from "@/lib/seo/jsonld";
import { marketHref } from "@/lib/seo/markets";
import { offices } from "@/lib/seo/offices";

export const revalidate = 3600;

interface Props {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: Props) {
  const locale = requireLocale((await params).lang);
  if (!locale) return {};
  const page = getDictionary(locale).home;
  return localizedMetadata({
    locale,
    title: page.metaTitle,
    description: page.metaDescription,
    path: `/${locale}`,
    enPath: "/",
    status: page.status,
  });
}

export default async function LocalizedHome({ params }: Props) {
  const locale = requireLocale((await params).lang);
  if (!locale) notFound();
  const dict = getDictionary(locale);
  const page = dict.home;
  const path = `/${locale}`;
  const breadcrumbs = [{ name: dict.ui.home, path }];
  const regionLinks = Object.entries(dict.hubs).flatMap(([market, hub]) => {
    if (!hub) return [];
    const enPath = marketHref(market as Parameters<typeof marketHref>[0]);
    return [{ href: localizedPathFor(locale, enPath) ?? enPath, title: hub.metaTitle }];
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
        <LocalizedHomePage
          dict={dict}
          status={page.status}
          breadcrumbs={breadcrumbs}
          enPath="/"
          office={offices[officeIdFor(locale)]}
          clients={await localizedClients(locale)}
          page={page}
          services={localizedServiceList(locale).slice(0, 6)}
          servicesHref={`/${locale}/services`}
          regionLinks={regionLinks}
        />
      </SiteLayout>
    </>
  );
}
