/**
 * Packages for /pricing. Every package is quote-only by design — no prices are published.
 * Projects are quoted in INR (India), AED (UAE) or SAR (Saudi Arabia) after a discovery call.
 */
export interface PricingPackage {
  id: "starter" | "business" | "ecommerce" | "seo-monthly";
  name: string;
  /** Who it is for */
  audience: string;
  billing: "one-time" | "monthly";
  includes: string[];
  serviceHref: string;
  highlighted?: boolean;
}

export const pricingPackages: PricingPackage[] = [
  {
    id: "starter",
    name: "Starter Website",
    audience: "Small businesses and professionals who need a credible first website.",
    billing: "one-time",
    includes: [
      "Mobile-first business website",
      "Contact form, WhatsApp and call buttons",
      "On-page SEO basics and sitemap",
      "Google Business Profile setup",
      "Launch and handover walkthrough",
    ],
    serviceHref: "/services/web-development",
  },
  {
    id: "business",
    name: "Business Website",
    audience: "Growing companies that need more pages, a CMS and stronger SEO foundations.",
    billing: "one-time",
    includes: [
      "Custom design for key pages",
      "CMS so your team can edit content",
      "Service and location pages",
      "Technical SEO, schema and analytics",
      "English and Arabic-ready layout on request",
    ],
    serviceHref: "/services/web-development",
    highlighted: true,
  },
  {
    id: "ecommerce",
    name: "E-commerce Store",
    audience: "Brands and retailers selling online with payments, delivery and order tracking.",
    billing: "one-time",
    includes: [
      "Shopify, WooCommerce or custom store",
      "Catalogue, variants and product import",
      "Payment gateway, COD or WhatsApp ordering",
      "Order tracking and notifications",
      "Team training at launch",
    ],
    serviceHref: "/services/ecommerce",
  },
  {
    id: "seo-monthly",
    name: "SEO (monthly)",
    audience: "Businesses that want steady growth in Google Search and Maps.",
    billing: "monthly",
    includes: [
      "Technical audit and fix list",
      "Keyword-to-page plan",
      "Monthly on-page and content work",
      "Google Business Profile management",
      "Monthly report in plain language",
    ],
    serviceHref: "/services/seo",
  },
];

/** Currencies we quote in, shown on every package card */
export const quoteCurrencies = ["INR", "AED", "SAR"] as const;

export const pricingFaqs = [
  {
    question: "Why don’t you publish fixed prices?",
    answer:
      "Scope varies a lot between projects. We send a written quote with price and timeline after a short discovery call, before any work starts.",
  },
  {
    question: "Which currency will I be quoted in?",
    answer:
      "India projects are quoted in INR. UAE projects can be quoted in AED, and Saudi projects in SAR. The currency is confirmed in your proposal.",
  },
  {
    question: "Are hosting and domain included?",
    answer:
      "We set up hosting and connect your domain. Third-party costs such as hosting plans, domains, paid plugins or apps are listed separately in the proposal.",
  },
  {
    question: "Do you offer maintenance after launch?",
    answer: "Yes. Maintenance and support retainers are available and quoted separately.",
  },
];
