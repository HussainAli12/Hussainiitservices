import type { ReactNode } from "react";
import { arabicFont, devanagariFont } from "@/i18n/fonts";
import type { AltLocale } from "@/i18n/types";
import { cn } from "@/lib/utils";

/**
 * Wraps localized page content with the right lang/dir and script font.
 * The shared site header/footer stay English/LTR until they are localized (phase 2).
 */
export function LocaleContent({
  locale,
  dir,
  humanReviewed,
  draftBanner,
  children,
}: {
  locale: AltLocale;
  dir: "ltr" | "rtl";
  humanReviewed: boolean;
  draftBanner: string;
  children: ReactNode;
}) {
  const font = locale === "ar" ? arabicFont : devanagariFont;
  return (
    <div lang={locale} dir={dir} className={cn(font.variable, `locale-${locale}`)}>
      {!humanReviewed && process.env.NODE_ENV !== "production" && (
        <p className="fixed bottom-4 left-4 z-50 max-w-xs rounded-xl bg-amber-100 px-4 py-2 text-xs font-semibold text-amber-900 shadow-lg">
          {draftBanner} · TODO(translation-review)
        </p>
      )}
      {children}
    </div>
  );
}
