import { notFound } from "next/navigation";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { PageSeo } from "@/components/seo/PageSeo";
import { ServiceDetail } from "@/components/sections/services/ServiceDetail";
import { fetchPortfolio } from "@/lib/data/fetch";
import { getRelevantTrustedClients } from "@/lib/portfolio/clients";
import { createPageMetadata } from "@/lib/seo";
import { breadcrumbJsonLd, faqJsonLd, serviceJsonLd, webPageJsonLd } from "@/lib/seo/jsonld";
import { getServicePage, getServiceSlugs } from "@/lib/seo/services";
import {
  getServiceLocationsForService,
  serviceLocationHref,
  serviceLocationLinkLabel,
} from "@/lib/seo/service-locations";

interface ServicePageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 3600;

export function generateStaticParams() {
  return getServiceSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = getServicePage(slug);
  if (!service) {
    return createPageMetadata({
      title: "Service Not Found",
      description: "This service page could not be found.",
      path: `/services/${slug}`,
      noindex: true,
    });
  }

  return createPageMetadata({
    title: service.metaTitle,
    description: service.metaDescription,
    path: `/services/${service.slug}`,
    keywords: service.keywords,
    generatedImage: true,
  });
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = getServicePage(slug);
  if (!service) notFound();

  const clients = getRelevantTrustedClients(await fetchPortfolio(), { service: service.slug });

  return (
    <>
      <PageSeo
        schemas={[
          webPageJsonLd({
            title: service.metaTitle,
            description: service.metaDescription,
            path: `/services/${service.slug}`,
          }),
          serviceJsonLd(service),
          faqJsonLd(service.faqs),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
            { name: service.title, path: `/services/${service.slug}` },
          ]),
        ]}
      />
      <SiteLayout>
        <ServiceDetail
          service={service}
          clients={clients}
          cityLinks={getServiceLocationsForService(service.slug).map((page) => ({
            href: serviceLocationHref(page),
            label: serviceLocationLinkLabel(page),
          }))}
        />
      </SiteLayout>
    </>
  );
}
