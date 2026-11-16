import { isAltLocale } from "@/i18n/config";
import { getDictionary, localizedPathFor } from "@/i18n/routes";
import type { AltLocale } from "@/i18n/types";
import { fetchPortfolio } from "@/lib/data/fetch";
import { getRelevantTrustedClients } from "@/lib/portfolio/clients";
import { servicePages } from "@/lib/seo/services";

export function requireLocale(lang: string): AltLocale | null {
  return isAltLocale(lang) ? lang : null;
}

/** Office per locale: Arabic pages → Dubai, Hindi pages → Ujjain */
export function officeIdFor(locale: AltLocale) {
  return locale === "ar" ? "dubai" : "ujjain";
}

export async function localizedClients(locale: AltLocale) {
  return getRelevantTrustedClients(await fetchPortfolio(), { country: locale === "ar" ? "AE" : "IN" });
}

/** Translated service list; links go to the localized page when one exists, else English */
export function localizedServiceList(locale: AltLocale) {
  const dict = getDictionary(locale);
  return servicePages.map((service) => {
    const item = dict.services.items[service.slug];
    const enPath = `/services/${service.slug}`;
    return {
      name: item?.name ?? service.title,
      summary: item?.summary ?? "",
      href: localizedPathFor(locale, enPath) ?? enPath,
    };
  });
}
