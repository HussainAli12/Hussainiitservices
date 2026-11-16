import type { MarketSlug } from "@/lib/seo/locations";

/** Slim hub list (no page copy) — safe for client components such as the footer */
export interface MarketIndexEntry {
  slug: MarketSlug;
  name: string;
  /** Name as used mid-sentence, e.g. "the UAE" */
  inSentence: string;
  /** Rendered as "<metaTitle> | Hussaini IT Services" */
  metaTitle: string;
}

export const marketIndex: MarketIndexEntry[] = [
  { slug: "india", name: "India", inSentence: "India", metaTitle: "IT Services in Madhya Pradesh, India" },
  { slug: "uae", name: "UAE", inSentence: "the UAE", metaTitle: "IT Services in the UAE" },
  { slug: "saudi-arabia", name: "Saudi Arabia", inSentence: "Saudi Arabia", metaTitle: "IT Services in Saudi Arabia" },
  { slug: "gcc", name: "GCC", inSentence: "the GCC", metaTitle: "IT Services Across the GCC" },
];

export function marketIndexEntry(slug: MarketSlug): MarketIndexEntry {
  const entry = marketIndex.find((item) => item.slug === slug);
  if (!entry) throw new Error(`Unknown market ${slug}`);
  return entry;
}

export function marketHref(slug: MarketSlug) {
  return `/it-services/${slug}`;
}
