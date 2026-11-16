import { notFound } from "next/navigation";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { PageSeo } from "@/components/seo/PageSeo";
import { LocationDetail } from "@/components/sections/locations/LocationDetail";
import { fetchPortfolio } from "@/lib/data/fetch";
import { getRelevantTrustedClients } from "@/lib/portfolio/clients";
import { getDictionary, hreflangLanguages, publishedAlternates } from "@/i18n/routes";
import { createPageMetadata } from "@/lib/seo";
import { marketForLocation, marketHref } from "@/lib/seo/markets";
import {
  getServiceLocationsForCity,
  serviceLocationHref,
  serviceLocationLinkLabel,
} from "@/lib/seo/service-locations";
import { breadcrumbJsonLd, faqJsonLd, locationServiceJsonLd, webPageJsonLd } from "@/lib/seo/jsonld";
import {
  getLocationPage,
  getLocationSlugs,
  locationMetaDescription,
  locationMetaTitle,
  locationCountryCode,
  locationOfficeGeo,
} from "@/lib/seo/locations";

interface LocationRouteProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 3600;

export function generateStaticParams() {
  return getLocationSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: LocationRouteProps) {
  const { slug } = await params;
  const location = getLocationPage(slug);
  if (!location) {
    return createPageMetadata({
      title: "Location Not Found",
      description: "This location page could not be found.",
      path: `/best-it-services/${slug}`,
      noindex: true,
    });
  }

  const officeGeo = locationOfficeGeo[location.slug];

  return createPageMetadata({
    title: locationMetaTitle(location),
    description: locationMetaDescription(location),
    path: location.href,
    languages: hreflangLanguages(location.href),
    generatedImage: true,
    ...(officeGeo
      ? {
          geo: {
            region: officeGeo.region,
            placename: officeGeo.placename,
            position: officeGeo.position,
            icbm: officeGeo.icbm,
          },
        }
      : {}),
  });
}

export default async function LocationRoute({ params }: LocationRouteProps) {
  const { slug } = await params;
  const location = getLocationPage(slug);
  if (!location) notFound();

  const hub = marketForLocation(location);
  const clients = getRelevantTrustedClients(await fetchPortfolio(), {
    country: locationCountryCode(location),
  });

  const pageTitle = locationMetaTitle(location);
  const pageDescription = locationMetaDescription(location);

  return (
    <>
      <PageSeo
        schemas={[
          webPageJsonLd({
            title: pageTitle,
            description: pageDescription,
            path: location.href,
          }),
          locationServiceJsonLd(location),
          faqJsonLd(location.faqs),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Best IT Services", path: "/best-it-services" },
            { name: location.city, path: location.href },
          ]),
        ]}
      />
      <SiteLayout>
        <LocationDetail
          location={location}
          clients={clients}
          localServiceLinks={getServiceLocationsForCity(location.slug).map((page) => ({
            href: serviceLocationHref(page),
            label: serviceLocationLinkLabel(page),
          }))}
          hubLink={hub ? { href: marketHref(hub.slug), name: hub.inSentence } : undefined}
          languageLinks={publishedAlternates(location.href).map((route) => ({
            href: route.path,
            label: getDictionary(route.locale).languageName,
            hrefLang: route.locale,
          }))}
        />
      </SiteLayout>
    </>
  );
}
