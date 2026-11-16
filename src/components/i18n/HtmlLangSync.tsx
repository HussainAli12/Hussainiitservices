"use client";

import { useEffect } from "react";

/**
 * Sets <html lang/dir> for /ar and /hi. The inline script applies it before first paint (so the
 * whole page, header included, renders RTL for Arabic); the effect restores English/LTR when the
 * visitor navigates back to an English page client-side.
 */
export function HtmlLangSync({ lang, dir }: { lang: string; dir: "ltr" | "rtl" }) {
  useEffect(() => {
    const html = document.documentElement;
    html.lang = lang;
    html.dir = dir;
    return () => {
      html.lang = "en";
      html.dir = "ltr";
    };
  }, [lang, dir]);

  return (
    <script
      // Static values from our own locale config — no user input
      dangerouslySetInnerHTML={{
        __html: `document.documentElement.lang=${JSON.stringify(lang)};document.documentElement.dir=${JSON.stringify(dir)};`,
      }}
    />
  );
}
