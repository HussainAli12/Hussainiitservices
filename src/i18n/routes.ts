import { altLocales, isPublished } from "@/i18n/config";
import { ar } from "@/i18n/dictionaries/ar";
import { hi } from "@/i18n/dictionaries/hi";
import type { AltLocale, Dictionary, Locale, TranslationStatus } from "@/i18n/types";
import { siteUrl } from "@/lib/seo";
import { getLocationPage } from "@/lib/seo/locations";
import { marketHref } from "@/lib/seo/markets";

const dictionaries: Record<AltLocale, Dictionary> = { ar, hi };

export function getDictionary(locale: AltLocale) {
  return dictionaries[locale];
}

/**
 * Every localizable page: English path ↔ localized path, with the translation status
 * that decides whether it is published.
 */
export interface LocalizedRoute {
  locale: AltLocale;
  /** English counterpart path */
  enPath: string;
  path: string;
  status: TranslationStatus;
}

export function getLocalizedRoutes(): LocalizedRoute[] {
  const routes: LocalizedRoute[] = [];
  for (const locale of altLocales) {
    const dict = dictionaries[locale];
    routes.push({ locale, enPath: "/", path: `/${locale}`, status: dict.home.status });
    routes.push({ locale, enPath: "/services", path: `/${locale}/services`, status: dict.services.status });
    for (const [market, hub] of Object.entries(dict.hubs)) {
      if (!hub) continue;
      const enPath = marketHref(market as Parameters<typeof marketHref>[0]);
      routes.push({ locale, enPath, path: `/${locale}${enPath}`, status: hub.status });
    }
    for (const [slug, city] of Object.entries(dict.cities)) {
      const location = getLocationPage(slug);
      if (!city || !location) continue;
      routes.push({ locale, enPath: location.href, path: `/${locale}${location.href}`, status: city.status });
    }
  }
  return routes;
}

/** Published localized versions of an English page */
export function publishedAlternates(enPath: string) {
  return getLocalizedRoutes().filter((route) => route.enPath === enPath && isPublished(route.status));
}

/**
 * hreflang map (en, ar, hi, x-default) for a page group, as absolute URLs.
 * Returns undefined when no translation is published, so single-language pages emit nothing.
 */
export function hreflangLanguages(enPath: string): Record<string, string> | undefined {
  const alternates = publishedAlternates(enPath);
  if (alternates.length === 0) return undefined;
  const abs = (path: string) => `${siteUrl}${path === "/" ? "" : path}`;
  const languages: Record<string, string> = { en: abs(enPath) };
  for (const route of alternates) languages[route.locale] = abs(route.path);
  languages["x-default"] = abs(enPath);
  return languages;
}

/** Localized path for a link target if that translation exists (published or not), else null */
export function localizedPathFor(locale: Locale, enPath: string) {
  if (locale === "en") return enPath;
  return getLocalizedRoutes().find((route) => route.locale === locale && route.enPath === enPath)?.path ?? null;
}
