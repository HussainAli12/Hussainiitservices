import { ogContentType, ogSize, renderOgCard } from "@/lib/og/card";
import { getMarketHub } from "@/lib/seo/markets";
import { marketHubs } from "@/lib/seo/markets";

export const alt = "IT services by region — Hussaini IT Services";
export const size = ogSize;
export const contentType = ogContentType;

/** Prerender one card per page at build time */
export function generateStaticParams() {
  return marketHubs.map((hub) => ({ market: hub.slug }));
}

export default async function Image({ params }: { params: Promise<{ market: string }> }) {
  const { market } = await params;
  const hub = getMarketHub(market);
  return renderOgCard({
    eyebrow: hub?.name ?? "Regions",
    title: hub?.metaTitle ?? "IT services by region",
    subtitle: hub?.intro,
  });
}
