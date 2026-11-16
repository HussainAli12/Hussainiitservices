import { ogContentType, ogSize, renderOgCard } from "@/lib/og/card";
import { getLocationPage } from "@/lib/seo/locations";
import { getLocationSlugs } from "@/lib/seo/locations";

export const alt = "IT services by city — Hussaini IT Services";
export const size = ogSize;
export const contentType = ogContentType;

/** Prerender one card per page at build time */
export function generateStaticParams() {
  return getLocationSlugs().map((slug) => ({ slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const location = getLocationPage(slug);
  return renderOgCard({
    eyebrow: location ? `${location.city}, ${location.country}` : "Locations",
    title: location ? `Best IT services in ${location.city}` : "Best IT services by city",
    subtitle: location?.industries.join(" · "),
  });
}
