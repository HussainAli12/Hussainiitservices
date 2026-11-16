import { ogContentType, ogSize, renderOgCard } from "@/lib/og/card";
import { getServiceLocationPage, resolveServiceLocation } from "@/lib/seo/service-locations";
import { serviceLocationPages } from "@/lib/seo/service-locations";

export const alt = "Local service page by Hussaini IT Services";
export const size = ogSize;
export const contentType = ogContentType;

/** Prerender one card per page at build time */
export function generateStaticParams() {
  return serviceLocationPages.map((page) => ({ slug: page.service, city: page.city }));
}

export default async function Image({ params }: { params: Promise<{ slug: string; city: string }> }) {
  const { slug, city } = await params;
  const page = getServiceLocationPage(slug, city);
  const resolved = page ? resolveServiceLocation(page) : null;
  return renderOgCard({
    eyebrow: resolved ? `${resolved.location.city}, ${resolved.location.country}` : "Services",
    title: resolved?.h1 ?? "Hussaini IT Services",
    subtitle: resolved?.page.intro,
  });
}
