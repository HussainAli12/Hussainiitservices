import { notFound } from "next/navigation";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { LocalizedServicesPage } from "@/components/i18n/LocalizedPages";
import { PageSeo } from "@/components/seo/PageSeo";
import { buildChrome } from "@/i18n/build-chrome";
import { localizedMetadata } from "@/i18n/metadata";
import { localizedClients, localizedServiceList, officeIdFor, requireLocale } from "@/i18n/page-data";
import { getDictionary } from "@/i18n/routes";
import { breadcrumbJsonLd, webPageJsonLd } from "@/lib/seo/jsonld";
import { offices } from "@/lib/seo/offices";

export const revalidate = 3600;

interface Props {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: Props) {
  const locale = requireLocale((await params).lang);
  if (!locale) return {};
  const page = getDictionary(locale).services;
  return localizedMetadata({
    locale,
    title: page.metaTitle,
    description: page.metaDescription,
    path: `/${locale}/services`,
    enPath: "/services",
    status: page.status,
  });
}

export default async function LocalizedServices({ params }: Props) {
  const locale = requireLocale((await params).lang);
  if (!locale) notFound();
  const dict = getDictionary(locale);
  const page = dict.services;
  const path = `/${locale}/services`;
  const breadcrumbs = [
    { name: dict.ui.home, path: `/${locale}` },
    { name: dict.ui.services, path },
  ];

  return (
    <>
      <PageSeo
        schemas={[
          { ...webPageJsonLd({ title: page.h1, description: page.metaDescription, path }), inLanguage: locale },
          breadcrumbJsonLd(breadcrumbs),
        ]}
      />
      <SiteLayout chrome={buildChrome(locale)}>
        <LocalizedServicesPage
          dict={dict}
          status={page.status}
          breadcrumbs={breadcrumbs}
          enPath="/services"
          office={offices[officeIdFor(locale)]}
          clients={await localizedClients(locale)}
          page={page}
          services={localizedServiceList(locale)}
        />
      </SiteLayout>
    </>
  );
}
