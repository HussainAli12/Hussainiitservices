import { notFound } from "next/navigation";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { PageSeo } from "@/components/seo/PageSeo";
import { ServiceLocationDetail } from "@/components/sections/service-locations/ServiceLocationDetail";
import { fetchBlogs, fetchPortfolio } from "@/lib/data/fetch";
import { getRelevantTrustedClients } from "@/lib/portfolio/clients";
import { createPageMetadata } from "@/lib/seo";
import { pickRelatedPosts } from "@/lib/blog/related";
import {
  breadcrumbJsonLd,
  faqJsonLd,
  serviceAreaJsonLd,
  webPageJsonLd,
} from "@/lib/seo/jsonld";
import { locationOfficeGeo } from "@/lib/seo/locations";
import { officeForCountry } from "@/lib/seo/offices";
import { rankPortfolioForServiceCity } from "@/lib/seo/portfolio-tags";
import { serviceOgImagePath } from "@/lib/seo/service-visuals";
import {
  getServiceLocationPage,
  resolveServiceLocation,
  serviceLocationPages,
} from "@/lib/seo/service-locations";

/** Portfolio + blog cards come from Supabase; refresh hourly (admin saves revalidate sooner). */
export const revalidate = 3600;
/** Only combinations listed in service-locations.ts exist */
export const dynamicParams = false;

interface ServiceCityPageProps {
  params: Promise<{ slug: string; city: string }>;
}

export function generateStaticParams() {
  return serviceLocationPages.map((page) => ({ slug: page.service, city: page.city }));
}

function load(slug: string, city: string) {
  const page = getServiceLocationPage(slug, city);
  return page ? resolveServiceLocation(page) : null;
}

export async function generateMetadata({ params }: ServiceCityPageProps) {
  const { slug, city } = await params;
  const resolved = load(slug, city);
  if (!resolved) {
    return createPageMetadata({
      title: "Page Not Found",
      description: "This page could not be found.",
      path: `/services/${slug}/${city}`,
      noindex: true,
    });
  }

  const geo = locationOfficeGeo[resolved.location.slug];
  return createPageMetadata({
    title: resolved.metaTitle,
    description: resolved.page.metaDescription,
    path: resolved.href,
    generatedImage: true,
    ...(geo ? { geo } : {}),
  });
}

export default async function ServiceCityPage({ params }: ServiceCityPageProps) {
  const { slug, city } = await params;
  const resolved = load(slug, city);
  if (!resolved) notFound();

  const { page, service, location, href, h1, countryCode } = resolved;
  const office = officeForCountry(location.country);
  const [portfolio, blogs] = await Promise.all([fetchPortfolio(), fetchBlogs()]);
  const work = rankPortfolioForServiceCity(portfolio, {
    service: service.slug,
    city: location.slug,
    country: countryCode,
  });
  const posts = pickRelatedPosts(blogs, page.blogSlugs, 3);
  const clients = getRelevantTrustedClients(portfolio, { service: service.slug, country: countryCode });

  return (
    <>
      <PageSeo
        schemas={[
          webPageJsonLd({ title: h1, description: page.metaDescription, path: href }),
          serviceAreaJsonLd({
            name: h1,
            description: page.metaDescription,
            path: href,
            serviceType: service.title,
            city: location.city,
            region: location.region,
            country: location.country,
            imagePath: serviceOgImagePath(service.slug),
          }),
          faqJsonLd(page.faqs),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
            { name: service.title, path: `/services/${service.slug}` },
            { name: location.city, path: href },
          ]),
        ]}
      />
      <SiteLayout>
        <ServiceLocationDetail
          resolved={resolved}
          office={office}
          portfolio={work}
          posts={posts}
          clients={clients}
        />
      </SiteLayout>
    </>
  );
}
