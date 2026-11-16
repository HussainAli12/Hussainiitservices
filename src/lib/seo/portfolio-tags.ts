import type { DbPortfolio } from "@/lib/types/database";

/**
 * Market, industry and service tags for real portfolio items, keyed by portfolio slug.
 * Derived from each project's own description in the CMS — nothing here is invented.
 * Projects that are not published in Supabase are simply never matched.
 *
 * TODO(content-review): when you add a portfolio item in /admin, add its slug here so it
 * shows on the matching city, hub, industry and service+city pages.
 */
export interface PortfolioTag {
  /** ISO country code of the client/market */
  country: "IN" | "AE" | "SA" | "OM" | "BH" | "QA" | "KW";
  /** City slug from locations.ts when the project is city-specific */
  city?: string;
  /** Industry slugs from industries.ts */
  industries: string[];
  /** Service slugs from services.ts */
  services: string[];
}

export const portfolioTags: Record<string, PortfolioTag> = {
  "safinat-group-hardware-tools-website": {
    country: "AE",
    city: "dubai",
    industries: [],
    services: ["ecommerce", "web-development"],
  },
  "al-hadaf-metal-coating": {
    country: "AE",
    industries: ["industrial-manufacturing"],
    services: ["web-development"],
  },
  "burhani-guards-performance-tracker": {
    country: "IN",
    city: "ujjain",
    industries: [],
    services: ["custom-software-development", "web-development"],
  },
  "truvedaa-ayurvedic-products-ecommerce-website": {
    country: "IN",
    industries: [],
    services: ["ecommerce"],
  },
  "aadtra-social-media": {
    country: "AE",
    industries: ["industrial-manufacturing"],
    services: ["social-media-management"],
  },
  "badshah-property-real-estate-website": {
    country: "IN",
    city: "ujjain",
    industries: ["real-estate"],
    services: ["web-development", "seo"],
  },
  "84-mahadev-travels-tour-travels-website": {
    country: "IN",
    city: "ujjain",
    industries: ["travel-tourism"],
    services: ["web-development"],
  },
  "ab-collection-fashion-ecommerce-website": {
    country: "IN",
    industries: ["fashion-ecommerce"],
    services: ["ecommerce"],
  },
  "timeless-watch-bazar-watch-ecommerce-website": {
    country: "IN",
    industries: ["fashion-ecommerce"],
    services: ["ecommerce"],
  },
  "hm-shop-online-ecommerce-website": {
    country: "AE",
    industries: [],
    services: ["ecommerce"],
  },
  "saifuddin-and-sons-jewellery-ecommerce-website": {
    country: "IN",
    city: "ujjain",
    industries: ["jewellery"],
    services: ["ecommerce"],
  },
  // Static fallback item (only shown when Supabase is not configured)
  "mahakal-bike-rental": {
    country: "IN",
    city: "ujjain",
    industries: ["travel-tourism"],
    services: ["web-development"],
  },
};

export function getPortfolioTag(project: Pick<DbPortfolio, "slug">) {
  return portfolioTags[project.slug];
}

const GCC_CODES = new Set(["AE", "SA", "OM", "BH", "QA", "KW"]);

/** Portfolio items for a market hub. India → IN; uae → AE; saudi-arabia → SA; gcc → all GCC. */
export function filterPortfolioByMarket(
  items: DbPortfolio[],
  market: "india" | "uae" | "saudi-arabia" | "gcc",
) {
  return items.filter((item) => {
    const tag = getPortfolioTag(item);
    if (!tag) return false;
    if (market === "india") return tag.country === "IN";
    if (market === "uae") return tag.country === "AE";
    if (market === "saudi-arabia") return tag.country === "SA";
    return GCC_CODES.has(tag.country);
  });
}

export function filterPortfolioByIndustry(items: DbPortfolio[], industry: string) {
  return items.filter((item) => getPortfolioTag(item)?.industries.includes(industry));
}

/**
 * Best matches for a service in a city: same service + city, then same service + country,
 * then same service anywhere. Returns at most `limit` items, never padding with unrelated work.
 */
export function rankPortfolioForServiceCity(
  items: DbPortfolio[],
  { service, city, country }: { service: string; city: string; country: string },
  limit = 3,
) {
  const scored = items
    .map((item) => {
      const tag = getPortfolioTag(item);
      if (!tag || !tag.services.includes(service)) return null;
      const score = (tag.city === city ? 4 : 0) + (tag.country === country ? 2 : 0) + 1;
      return { item, score };
    })
    .filter((entry): entry is { item: DbPortfolio; score: number } => entry !== null)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map((entry) => ({
    project: entry.item,
    /** true when the project is from the same country as the page */
    local: getPortfolioTag(entry.item)?.country === country,
  }));
}
