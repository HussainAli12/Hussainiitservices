import type { Metadata } from "next";
import { allServices, companyInfo, founders } from "@/lib/constants";
import { fitTitle, truncateMeta } from "@/lib/seo/text";
import { offices } from "@/lib/seo/offices";

/** Canonical production host — must match Google Search Console www property */
const CANONICAL_SITE_URL = "https://www.hussainiitservices.com";

function resolveSiteUrl() {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "").trim();
  const candidate = fromEnv || companyInfo.website.replace(/\/$/, "");

  try {
    const url = new URL(candidate);
    if (
      url.hostname === "hussainiitservices.com" ||
      url.hostname === "www.hussainiitservices.com"
    ) {
      return CANONICAL_SITE_URL;
    }
    return `${url.protocol}//${url.host}`;
  } catch {
    return CANONICAL_SITE_URL;
  }
}

export const siteUrl = resolveSiteUrl();

export const siteName = companyInfo.name;

export const defaultOgImage = {
  url: "/og-graph.jpg",
  width: 1200,
  height: 630,
  alt: `${siteName} — web, SEO, ads & AI voice agents in Dubai and Ujjain`,
};

export const defaultDescription =
  "Hussaini IT Services builds websites, SEO, custom CRM/SaaS, Google Ads, social media, and AI voice agents from Dubai and Ujjain — for businesses in the UAE, India, and worldwide.";

export const defaultKeywords = [
  "Hussaini IT Services",
  "digital online presence",
  "custom software development Dubai",
  "CRM development UAE",
  "Google Ads management",
  "web development Dubai",
  "SEO agency UAE",
  "digital marketing Ujjain",
  "Google Business Profile optimization",
  "social media management UAE",
  "SaaS development India",
  "AI voice calling agent",
];

export const geoLocations = [
  {
    name: "Dubai, United Arab Emirates",
    region: "AE-DU",
    placename: "Dubai",
    latitude: 25.2048,
    longitude: 55.2708,
    position: "25.2048;55.2708",
    icbm: "25.2048, 55.2708",
  },
  {
    name: "Ujjain, India",
    region: "IN-MP",
    placename: "Ujjain",
    latitude: 23.1765,
    longitude: 75.7885,
    position: "23.1765;75.7885",
    icbm: "23.1765, 75.7885",
  },
];

export const publicRoutes = [
  { path: "/", priority: 1, changeFrequency: "weekly" as const },
  { path: "/about", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/services", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/portfolio", priority: 0.9, changeFrequency: "weekly" as const },
  { path: "/blog", priority: 0.85, changeFrequency: "weekly" as const },
  { path: "/testimonials", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/contact", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/careers", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/best-it-services", priority: 0.85, changeFrequency: "weekly" as const },
  { path: "/case-studies", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/pricing", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/free-website-audit", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/faq", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/privacy-policy", priority: 0.3, changeFrequency: "yearly" as const },
  { path: "/terms-and-conditions", priority: 0.3, changeFrequency: "yearly" as const },
];

export const rssFeedPath = "/feed.xml";

type PageMetaInput = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  noindex?: boolean;
  image?: string;
  /** OG image alt — defaults to page title when omitted */
  imageAlt?: string;
  /** Route has opengraph-image/twitter-image files — don't emit explicit images */
  generatedImage?: boolean;
  /** hreflang → absolute URL (en, ar, hi, x-default) from i18n/routes hreflangLanguages() */
  languages?: Record<string, string>;
  /** Open Graph locale, e.g. "ar_AE" — defaults to en_GB */
  ogLocale?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  geo?: {
    region: string;
    placename: string;
    position: string;
    icbm: string;
  };
};

export function absoluteUrl(path: string) {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export function createPageMetadata({
  title,
  description,
  path,
  keywords = [],
  noindex = false,
  image,
  imageAlt,
  generatedImage = false,
  languages,
  ogLocale = "en_GB",
  type = "website",
  publishedTime,
  modifiedTime,
  authors = [],
  geo,
}: PageMetaInput): Metadata {
  const url = `${siteUrl}${path === "/" ? "" : path}`;
  // Google ignores meta keywords — do not emit them.
  void keywords;
  // Enforce snippet limits centrally: titles ≤ 60 incl. " | brand", descriptions ≤ 155.
  const fitted = fitTitle(title, siteName);
  const metaTitle = fitted.withBrand && path !== "/" ? fitted.text : { absolute: fitted.withBrand ? `${fitted.text} | ${siteName}` : fitted.text };
  const metaDescription = truncateMeta(description);
  const primaryGeo = geo ?? geoLocations[0];
  const ogImages = image
    ? [{ url: absoluteUrl(image), width: 1200, height: 630, alt: imageAlt || title }]
    : [{ ...defaultOgImage, url: absoluteUrl(defaultOgImage.url) }];

  return {
    title: metaTitle,
    description: metaDescription,
    applicationName: siteName,
    alternates: {
      canonical: url,
      ...(languages ? { languages } : {}),
      types: {
        "application/rss+xml": `${siteUrl}${rssFeedPath}`,
      },
    },
    robots: noindex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
    authors: [{ name: authors[0] || siteName, url: siteUrl }],
    creator: siteName,
    publisher: siteName,
    category: "technology",
    other: {
      "geo.region": primaryGeo.region,
      "geo.placename": primaryGeo.placename,
      "geo.position": primaryGeo.position,
      ICBM: primaryGeo.icbm,
    },
    openGraph: {
      title,
      description: metaDescription,
      url,
      siteName,
      type,
      locale: ogLocale,
      ...(generatedImage ? {} : { images: ogImages }),
      ...(type === "article"
        ? {
            publishedTime,
            modifiedTime,
            authors: authors.length ? authors : [siteName],
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: metaDescription,
      ...(generatedImage ? {} : { images: [absoluteUrl(image || defaultOgImage.url)] }),
    },
  };
}

function logoImageObject() {
  return {
    "@type": "ImageObject",
    url: `${siteUrl}/icon-512.png`,
    width: 512,
    height: 512,
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: siteName,
    legalName: siteName,
    url: siteUrl,
    logo: logoImageObject(),
    image: `${siteUrl}${defaultOgImage.url}`,
    email: companyInfo.email,
    telephone: companyInfo.phone,
    description: defaultDescription,
    foundingDate: "2024",
    slogan: "Digital presence, custom software, ads & AI voice agents",
    areaServed: [
      { "@type": "Country", name: "India" },
      { "@type": "Country", name: "United Arab Emirates" },
      { "@type": "Country", name: "Saudi Arabia" },
      { "@type": "Country", name: "Oman" },
      { "@type": "Country", name: "Qatar" },
      { "@type": "Country", name: "Kuwait" },
      { "@type": "Country", name: "Bahrain" },
      { "@type": "Country", name: "United Kingdom" },
    ],
    subOrganization: Object.values(offices).map((office) => ({ "@id": `${siteUrl}/#office-${office.id}` })),
    address: [
      {
        "@type": "PostalAddress",
        addressLocality: "Dubai",
        addressCountry: "AE",
      },
      {
        "@type": "PostalAddress",
        addressLocality: "Ujjain",
        addressRegion: "Madhya Pradesh",
        addressCountry: "IN",
      },
    ],
    founder: founders.map((founder) => ({
      "@type": "Person",
      name: founder.name,
      jobTitle: founder.role,
      image: absoluteUrl(founder.image),
      url: founder.linkedin,
      sameAs: founder.linkedin ? [founder.linkedin] : undefined,
    })),
    contactPoint: [
      ...companyInfo.phones.map((phone) => ({
        "@type": "ContactPoint",
        telephone: phone.display,
        email: companyInfo.email,
        contactType: "customer service",
        areaServed: phone.label === "India" ? "IN" : "AE",
        availableLanguage: ["English", "Hindi", "Arabic"],
      })),
      {
        "@type": "ContactPoint",
        telephone: companyInfo.whatsapp.display,
        contactType: "customer support",
        contactOption: "WhatsApp",
        url: companyInfo.whatsapp.href,
        availableLanguage: ["English", "Hindi"],
      },
    ],
    sameAs: [
      companyInfo.socials.linkedin,
      companyInfo.socials.instagram,
      companyInfo.socials.facebook,
      companyInfo.socials.whatsapp,
    ],
    knowsAbout: allServices.map((service) => service.title),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `${siteName} Services`,
      itemListElement: allServices.map((service) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: service.title,
          url: `${siteUrl}${service.href}`,
        },
      })),
    },
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: siteName,
    url: siteUrl,
    description: defaultDescription,
    inLanguage: "en",
    publisher: { "@id": `${siteUrl}/#organization` },
  };
}

/**
 * One ProfessionalService (LocalBusiness subtype) per office, with the phone numbers already
 * published on the site. Street addresses are not on the site yet — see TODO in offices.ts.
 */
export function officesJsonLd() {
  return Object.values(offices).map((office) => ({
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${siteUrl}/#office-${office.id}`,
    name: office.name,
    url: siteUrl,
    image: `${siteUrl}${defaultOgImage.url}`,
    logo: logoImageObject(),
    description: defaultDescription,
    email: companyInfo.email,
    telephone: office.phones[0]?.display,
    priceRange: "$$",
    parentOrganization: { "@id": `${siteUrl}/#organization` },
    address: {
      "@type": "PostalAddress",
      addressLocality: office.city,
      ...(office.region && office.region !== office.city ? { addressRegion: office.region } : {}),
      addressCountry: office.countryCode,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: office.latitude,
      longitude: office.longitude,
    },
    areaServed:
      office.countryCode === "IN"
        ? [
            { "@type": "AdministrativeArea", name: "Madhya Pradesh" },
            { "@type": "Country", name: "India" },
          ]
        : [
            { "@type": "Country", name: "United Arab Emirates" },
            { "@type": "Country", name: "Saudi Arabia" },
            { "@type": "Country", name: "Oman" },
            { "@type": "Country", name: "Qatar" },
            { "@type": "Country", name: "Kuwait" },
            { "@type": "Country", name: "Bahrain" },
          ],
    sameAs: [
      companyInfo.socials.linkedin,
      companyInfo.socials.instagram,
      companyInfo.socials.facebook,
    ],
    serviceType: allServices.map((service) => service.title),
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "09:00",
      closes: "18:00",
    },
  }));
}
