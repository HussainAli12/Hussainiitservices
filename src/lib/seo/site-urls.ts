import type { MetadataRoute } from "next";
import { publicRoutes, siteUrl } from "@/lib/seo";
import { servicePages } from "@/lib/seo/services";
import { locationPages } from "@/lib/seo/locations";
import { isPublished } from "@/i18n/config";
import { getLocalizedRoutes, hreflangLanguages } from "@/i18n/routes";
import { industryHref, industryPages } from "@/lib/seo/industries";
import { marketHref, marketHubs } from "@/lib/seo/markets";
import { serviceLocationHref, serviceLocationPages } from "@/lib/seo/service-locations";
import { fetchBlogs, fetchPortfolio } from "@/lib/data/fetch";
import type { DbBlog } from "@/lib/types/database";

/**
 * Date the config-driven pages (services, cities, hubs…) were last edited.
 * Bump this when you change copy in src/lib/seo/* so sitemap lastmod stays honest.
 */
export const CONFIG_CONTENT_UPDATED = "2026-10-25";

type ChangeFrequency = NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;

export interface SiteUrlEntry {
  path: string;
  lastModified: Date;
  changeFrequency: ChangeFrequency;
  priority: number;
  images?: string[];
  /** hreflang → absolute URL, including x-default */
  languages?: Record<string, string>;
}

/** Full absolute URL for a site path (home → trailing slash) */
export function siteUrlFor(path: string) {
  return `${siteUrl}${path === "/" ? "/" : path}`;
}

/** Published and not scheduled for the future */
export function isLivePost(post: Pick<DbBlog, "is_published" | "published_at">, now = Date.now()) {
  if (!post.is_published) return false;
  const published = Date.parse(post.published_at);
  return Number.isNaN(published) || published <= now;
}

function toDate(value: string | null | undefined, fallback: Date) {
  if (!value) return fallback;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? fallback : parsed;
}

/**
 * Every indexable URL on the site. Excludes /admin, /api and drafts.
 * Config pages first, then CMS content read from Supabase at request time.
 */
export async function getSiteUrlEntries(): Promise<SiteUrlEntry[]> {
  const configUpdated = new Date(`${CONFIG_CONTENT_UPDATED}T00:00:00Z`);
  const [allBlogs, portfolio] = await Promise.all([fetchBlogs(), fetchPortfolio()]);
  const blogs = allBlogs.filter((post) => isLivePost(post));

  const latestBlogUpdate = blogs.reduce<Date>(
    (latest, post) => {
      const updated = toDate(post.updated_at || post.published_at, configUpdated);
      return updated > latest ? updated : latest;
    },
    configUpdated,
  );

  const latestPortfolioUpdate = portfolio.reduce<Date>((latest, project) => {
    const updated = toDate(project.updated_at || project.created_at, configUpdated);
    return updated > latest ? updated : latest;
  }, configUpdated);

  const staticEntries: SiteUrlEntry[] = publicRoutes.map(({ path, priority, changeFrequency }) => ({
    path,
    priority,
    changeFrequency,
    lastModified:
      path === "/blog" || path === "/"
        ? latestBlogUpdate
        : path === "/portfolio" || path === "/case-studies"
          ? latestPortfolioUpdate
          : configUpdated,
  }));

  const serviceEntries: SiteUrlEntry[] = servicePages.map((service) => ({
    path: `/services/${service.slug}`,
    lastModified: configUpdated,
    changeFrequency: "monthly",
    priority: 0.85,
  }));

  const locationEntries: SiteUrlEntry[] = locationPages.map((location) => ({
    path: location.href,
    lastModified: configUpdated,
    changeFrequency: "monthly",
    priority:
      location.slug === "ujjain" || location.slug === "dubai"
        ? 0.9
        : location.region === "Madhya Pradesh"
          ? 0.85
          : 0.8,
  }));

  const serviceLocationEntries: SiteUrlEntry[] = serviceLocationPages.map((page) => ({
    path: serviceLocationHref(page),
    lastModified: configUpdated,
    changeFrequency: "monthly",
    priority: 0.85,
  }));

  const hubEntries: SiteUrlEntry[] = [
    { path: "/it-services", lastModified: configUpdated, changeFrequency: "monthly", priority: 0.8 },
    ...marketHubs.map((hub) => ({
      path: marketHref(hub.slug),
      lastModified: configUpdated,
      changeFrequency: "monthly" as const,
      priority: 0.85,
    })),
  ];

  const industryEntries: SiteUrlEntry[] = [
    { path: "/industries", lastModified: configUpdated, changeFrequency: "monthly", priority: 0.75 },
    ...industryPages.map((industry) => ({
      path: industryHref(industry.slug),
      lastModified: latestPortfolioUpdate,
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),
  ];

  const blogEntries: SiteUrlEntry[] = blogs.map((post) => ({
    path: `/blog/${post.slug}`,
    lastModified: toDate(post.updated_at || post.published_at, configUpdated),
    changeFrequency: "monthly",
    priority: 0.7,
    images: post.cover_image_url ? [post.cover_image_url] : undefined,
  }));

  const portfolioEntries: SiteUrlEntry[] = portfolio.map((project) => {
    const images = [
      project.image_url,
      project.logo_url,
      ...project.gallery.map((item) => item.url),
    ].filter(Boolean) as string[];

    return {
      path: `/portfolio/${project.slug}`,
      lastModified: toDate(project.updated_at || project.created_at, configUpdated),
      changeFrequency: "monthly",
      priority: 0.75,
      images: images.length > 0 ? images : undefined,
    };
  });

  // Published translations (/ar, /hi); entries with status "draft" stay out
  const localizedEntries: SiteUrlEntry[] = getLocalizedRoutes()
    .filter((route) => isPublished(route.status))
    .map((route) => ({
      path: route.path,
      lastModified: configUpdated,
      changeFrequency: "monthly",
      priority: 0.7,
    }));

  const entries = [
    ...staticEntries,
    ...serviceEntries,
    ...locationEntries,
    ...serviceLocationEntries,
    ...hubEntries,
    ...industryEntries,
    ...localizedEntries,
    ...blogEntries,
    ...portfolioEntries,
  ];

  // hreflang alternates on every page of a translated group (English and localized versions)
  const localizedToEn = new Map(getLocalizedRoutes().map((route) => [route.path, route.enPath]));
  for (const entry of entries) {
    const languages = hreflangLanguages(localizedToEn.get(entry.path) ?? entry.path);
    if (languages) entry.languages = languages;
  }

  // De-duplicate by path, keeping the first occurrence
  const seen = new Set<string>();
  return entries.filter((entry) => {
    if (seen.has(entry.path)) return false;
    seen.add(entry.path);
    return !entry.path.startsWith("/admin") && !entry.path.startsWith("/api");
  });
}
