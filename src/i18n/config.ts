import type { AltLocale, Locale, TranslationStatus } from "@/i18n/types";

export const altLocales: AltLocale[] = ["ar", "hi"];
export const defaultLocale: Locale = "en";

/** BCP-47 tags used in hreflang and inLanguage */
export const hreflangTags: Record<Locale, string> = {
  en: "en",
  ar: "ar",
  hi: "hi",
};

export const openGraphLocales: Record<Locale, string> = {
  en: "en_GB",
  ar: "ar_AE",
  hi: "hi_IN",
};

export function isAltLocale(value: string): value is AltLocale {
  return (altLocales as string[]).includes(value);
}

/** Drafts stay noindex and out of hreflang/sitemap. I18N_INCLUDE_DRAFTS=true previews them as live. */
export function isPublished(status: TranslationStatus) {
  return status === "published" || process.env.I18N_INCLUDE_DRAFTS === "true";
}
