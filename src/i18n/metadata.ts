import { isPublished, openGraphLocales } from "@/i18n/config";
import { hreflangLanguages } from "@/i18n/routes";
import type { AltLocale, TranslationStatus } from "@/i18n/types";
import { createPageMetadata } from "@/lib/seo";

/** Metadata for a localized page: self canonical, hreflang group, noindex while status is "draft" */
export function localizedMetadata({
  locale,
  title,
  description,
  path,
  enPath,
  status,
  generatedImage,
}: {
  locale: AltLocale;
  title: string;
  description: string;
  path: string;
  enPath: string;
  status: TranslationStatus;
  generatedImage?: boolean;
}) {
  const published = isPublished(status);
  return createPageMetadata({
    title,
    description,
    path,
    noindex: !published,
    languages: published ? hreflangLanguages(enPath) : undefined,
    ogLocale: openGraphLocales[locale],
    generatedImage,
  });
}
