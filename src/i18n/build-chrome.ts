import { cityLinkLabel, enChrome, featuredMenuEn, type SiteChrome } from "@/i18n/chrome";
import { getDictionary, localizedPathFor } from "@/i18n/routes";
import type { AltLocale } from "@/i18n/types";
import { allServices } from "@/lib/constants";
import { locationHref, locationIndex } from "@/lib/seo/location-index";
import { marketHref, marketIndex } from "@/lib/seo/market-index";

/**
 * Translated header/footer for /ar and /hi. Links point at the localized page when one exists,
 * otherwise at the English page (portfolio, blog and service detail pages are English-only).
 * Runs on the server so only the resulting labels are sent to the browser.
 */
export function buildChrome(locale: AltLocale): SiteChrome {
  const dict = getDictionary(locale);
  const serviceNames = Object.fromEntries(
    allServices.map((service) => [service.slug, dict.services.items[service.slug]?.name ?? service.title]),
  );
  const featuredMenu = Object.fromEntries(
    Object.entries(featuredMenuEn).map(([slug, fallback]) => {
      const item = dict.services.items[slug];
      return [slug, item ? { label: item.name, tagline: item.summary } : fallback];
    }),
  );

  return {
    ...enChrome,
    ...dict.chrome,
    locale,
    homeHref: `/${locale}`,
    servicesHref: `/${locale}/services`,
    serviceNames,
    featuredMenu,
    cityLinks: locationIndex.map((location) => {
      const enPath = locationHref(location.slug);
      const localized = localizedPathFor(locale, enPath);
      const name = dict.cities[location.slug]?.city ?? location.city;
      return { href: localized ?? enPath, label: cityLinkLabel(dict.chrome.footer.cityLink, name) };
    }),
    hubLinks: marketIndex.map((hub) => {
      const enPath = marketHref(hub.slug);
      return {
        href: localizedPathFor(locale, enPath) ?? enPath,
        label: dict.hubs[hub.slug]?.metaTitle ?? hub.metaTitle,
      };
    }),
  };
}
