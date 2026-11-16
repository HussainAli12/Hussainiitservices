import type { SiteChromeStrings } from "@/i18n/chrome";

export type Locale = "en" | "ar" | "hi";
export type AltLocale = Exclude<Locale, "en">;

/**
 * "published": live — indexed, in hreflang and in the sitemap.
 * "draft": rendered with noindex and left out of hreflang/sitemap (use while a page is in progress).
 */
export type TranslationStatus = "draft" | "published";

export interface Faq {
  question: string;
  answer: string;
}

export interface LocalizedHome {
  status: TranslationStatus;
  metaTitle: string;
  metaDescription: string;
  badge: string;
  h1: string;
  intro: string;
  servicesHeading: string;
  officesHeading: string;
  officesIntro: string;
  faqs: Faq[];
}

export interface LocalizedServices {
  status: TranslationStatus;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  /** service slug → translated name + one-liner */
  items: Record<string, { name: string; summary: string }>;
}

export interface LocalizedHub {
  status: TranslationStatus;
  name: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  howWeServe: { title: string; description: string }[];
  citiesHeading: string;
  faqs: Faq[];
}

export interface LocalizedCity {
  status: TranslationStatus;
  city: string;
  country: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  body: string[];
  industries: string[];
  highlights: string[];
  faqs: Faq[];
}

export interface Dictionary {
  locale: AltLocale;
  /**
   * false while the copy is a machine translation nobody fluent has checked yet. Pages stay live;
   * this flag only drives the dev-only review banner and the review checklist.
   */
  humanReviewed: boolean;
  /** Header, mega-menu, offer banner and footer labels */
  chrome: SiteChromeStrings;
  dir: "ltr" | "rtl";
  /** Native language name for switchers */
  languageName: string;
  ui: {
    home: string;
    services: string;
    regions: string;
    cities: string;
    contactUs: string;
    whatsappUs: string;
    callUs: string;
    readInEnglish: string;
    faqHeading: string;
    faqBadge: string;
    industriesHeading: string;
    highlightsHeading: string;
    viewInEnglish: string;
    officeLine: string;
    draftBanner: string;
    trustedBy: string;
    officeNames: { dubai: string; ujjain: string };
    allCities: string;
  };
  home: LocalizedHome;
  services: LocalizedServices;
  /** market slug → hub */
  hubs: Partial<Record<string, LocalizedHub>>;
  /** city slug → city page */
  cities: Partial<Record<string, LocalizedCity>>;
}
