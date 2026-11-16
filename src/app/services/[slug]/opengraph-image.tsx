import { ogContentType, ogSize, renderOgCard } from "@/lib/og/card";
import { getServicePage } from "@/lib/seo/services";
import { getServiceSlugs } from "@/lib/seo/services";

export const alt = "Service by Hussaini IT Services";
export const size = ogSize;
export const contentType = ogContentType;

/** Prerender one card per page at build time */
export function generateStaticParams() {
  return getServiceSlugs().map((slug) => ({ slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = getServicePage(slug);
  return renderOgCard({
    eyebrow: "Service",
    title: service?.title ?? "Our services",
    subtitle: service?.headline,
  });
}
