import { notFound } from "next/navigation";
import { HtmlLangSync } from "@/components/i18n/HtmlLangSync";
import { altLocales, isAltLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/routes";

/** Only /ar and /hi exist; every other top-level slug 404s */
export const dynamicParams = false;

export function generateStaticParams() {
  return altLocales.map((lang) => ({ lang }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isAltLocale(lang)) notFound();
  return (
    <>
      <HtmlLangSync lang={lang} dir={getDictionary(lang).dir} />
      {children}
    </>
  );
}
