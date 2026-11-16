/**
 * Industry pages (/industries/[slug]).
 *
 * Portfolio items are matched by slug in portfolio-tags.ts (only real, published projects show).
 * TODO(content-review): first drafts — please review. No results or statistics are claimed.
 */
export interface IndustryPage {
  slug: string;
  name: string;
  /** H1 */
  headline: string;
  /** Rendered as "<metaTitle> | Hussaini IT Services" — keep ≤ 36 chars */
  metaTitle: string;
  metaDescription: string;
  intro: string;
  /** What businesses in this industry need online */
  needs: { title: string; description: string }[];
  /** What we typically build */
  deliverables: string[];
  /** Related service slugs */
  services: string[];
  faqs: { question: string; answer: string }[];
  reviewStatus: "draft" | "approved";
}

export const industryPages: IndustryPage[] = [
  {
    slug: "real-estate",
    name: "Real Estate",
    headline: "Websites and lead generation for real estate businesses",
    metaTitle: "Real Estate Website Development",
    metaDescription:
      "Property websites, listing pages, local SEO and lead capture for developers, brokers and property dealers in India and the UAE.",
    intro:
      "Buyers and tenants start on Google and property portals, then check your own website before they call. We build real estate sites that present listings clearly, rank for local property searches and turn visits into enquiries.",
    needs: [
      { title: "Listings people can browse", description: "Filters for location, type and budget, with photos and key details up front." },
      { title: "Local search visibility", description: "Area and project pages that rank for “property in <area>” searches." },
      { title: "Fast enquiry", description: "WhatsApp, call and form options on every listing, routed to the right agent." },
      { title: "Easy updates", description: "An admin your team can use to add and mark listings sold without a developer." },
    ],
    deliverables: [
      "Property listing website with search and filters",
      "Project and locality landing pages",
      "Lead forms connected to email, WhatsApp or your CRM",
      "Google Business Profile and local SEO",
    ],
    services: ["web-development", "seo", "google-business-profile", "custom-software-development"],
    faqs: [
      {
        question: "Can we add and update listings ourselves?",
        answer: "Yes. We build an admin or use a CMS so your team can add listings, upload photos and mark properties sold.",
      },
      {
        question: "Can you connect enquiries to our CRM?",
        answer: "Yes. Forms can send leads to email, WhatsApp, or the CRM you use. We can also build a simple custom CRM.",
      },
      {
        question: "Do you work with brokers in Dubai and developers in India?",
        answer: "Yes. We have offices in Dubai and Ujjain and build real estate sites for both markets.",
      },
    ],
    reviewStatus: "draft",
  },
  {
    slug: "jewellery",
    name: "Jewellery",
    headline: "Jewellery ecommerce and showroom websites",
    metaTitle: "Jewellery Website Development",
    metaDescription:
      "Jewellery ecommerce stores and showroom websites with product variants, price breakups, secure payments and local SEO for jewellers in India and the UAE.",
    intro:
      "Jewellery buyers want detail before they visit or pay: clear photos, metal and stone options, and a transparent price. We build jewellery stores and showroom sites that show all of that and make it easy to order or book a visit.",
    needs: [
      { title: "Trust at first glance", description: "High-quality product photography layouts and clear policies." },
      { title: "Variants and customisation", description: "Metal, size, stone and engraving options on each product." },
      { title: "Transparent pricing", description: "Price breakups for metal, making charges and stones, where you choose to show them." },
      { title: "Showroom visits", description: "Store locator, Maps listing and appointment or WhatsApp enquiry." },
    ],
    deliverables: [
      "Ecommerce store (WooCommerce, Shopify or custom)",
      "Product variants, custom options and price breakup",
      "Payment gateway and order notifications",
      "Google Business Profile for each showroom",
    ],
    services: ["ecommerce", "customized-ecommerce-store", "seo", "google-business-profile"],
    faqs: [
      {
        question: "Can product prices update with gold rates?",
        answer: "It can be built. How prices are calculated and how often they change is agreed with you during scoping.",
      },
      {
        question: "Can customers choose ring size, metal and stones?",
        answer: "Yes. We set up product options so customers can pick the combinations you offer.",
      },
      {
        question: "Can we sell online and still get showroom visits?",
        answer: "Yes. Many jewellers use the site for browsing and enquiries, with WhatsApp or appointment booking for in-store visits.",
      },
    ],
    reviewStatus: "draft",
  },
  {
    slug: "fashion-ecommerce",
    name: "Fashion & Ecommerce",
    headline: "Fashion and lifestyle ecommerce stores",
    metaTitle: "Fashion Ecommerce Websites",
    metaDescription:
      "Fast fashion and lifestyle online stores with sizes, variants, order tracking and WhatsApp ordering for D2C brands in India and the GCC.",
    intro:
      "Fashion brands win online with fast product pages, clear sizing and a checkout that works on any phone. We build stores for apparel, accessories and lifestyle brands that look on-brand and are easy to run day to day.",
    needs: [
      { title: "Speed on mobile", description: "Most fashion traffic is mobile and social — pages must load fast." },
      { title: "Sizes and variants", description: "Size guides, colour swatches and stock per variant." },
      { title: "Order tracking", description: "Customers can check order status without messaging you." },
      { title: "Social-ready", description: "Product pages that work well when shared from Instagram and ads." },
    ],
    deliverables: [
      "Ecommerce store with variants and size guides",
      "Cart, checkout, payments and Cash on Delivery",
      "Order tracking and notifications",
      "Product schema and SEO-ready category pages",
    ],
    services: ["ecommerce", "customized-ecommerce-store", "ads-and-social-media", "seo"],
    faqs: [
      {
        question: "Shopify or a custom store for a fashion brand?",
        answer: "Shopify is quickest to launch; a custom Next.js store suits brands that want full control over speed and design. We recommend after scoping.",
      },
      {
        question: "Can customers order on WhatsApp?",
        answer: "Yes. We can add WhatsApp ordering alongside or instead of online payment.",
      },
      {
        question: "Can you run ads for the store after launch?",
        answer: "Yes. Google Ads and social media management are available once tracking is in place.",
      },
    ],
    reviewStatus: "draft",
  },
  {
    slug: "travel-tourism",
    name: "Travel & Tourism",
    headline: "Websites for tour operators, travel agencies and hospitality",
    metaTitle: "Travel & Tourism Website Development",
    metaDescription:
      "Tour and travels websites with packages, fleet pages, WhatsApp booking and local SEO for travel operators, taxi services and hotels in India and the GCC.",
    intro:
      "Travellers compare options quickly on their phones. We build travel and hospitality websites with clear packages, routes and prices you choose to show, plus WhatsApp and call booking so enquiries reach you fast.",
    needs: [
      { title: "Packages and routes", description: "Pages for each tour, route or package with inclusions and photos." },
      { title: "Instant contact", description: "WhatsApp, call and enquiry form on every page." },
      { title: "Local search", description: "Rank for “taxi in <city>” and “tour packages from <city>” searches." },
      { title: "Seasonal updates", description: "Easy edits for festival, pilgrimage and holiday seasons." },
    ],
    deliverables: [
      "Tour, package and fleet pages",
      "WhatsApp booking and enquiry forms",
      "Google Business Profile and local SEO",
      "Multilingual-ready structure for visitors",
    ],
    services: ["web-development", "seo", "google-business-profile", "ads-and-social-media"],
    faqs: [
      {
        question: "Can customers book directly on the website?",
        answer: "Yes — either a booking enquiry sent to you on WhatsApp, or a full booking flow with payment, depending on your operations.",
      },
      {
        question: "Can you help with pilgrimage-season traffic?",
        answer: "Yes. We plan pages and Google listings ahead of peak seasons, since rankings take time to build.",
      },
      {
        question: "Do you work with hotels and homestays as well?",
        answer: "Yes. Room pages, enquiry flows and Maps listings follow the same approach.",
      },
    ],
    reviewStatus: "draft",
  },
  {
    slug: "industrial-manufacturing",
    name: "Industrial & Manufacturing",
    headline: "Websites and LinkedIn for industrial and manufacturing companies",
    metaTitle: "Industrial Websites & LinkedIn",
    metaDescription:
      "Corporate websites, product catalogues, RFQ forms and LinkedIn management for manufacturers, contractors and industrial service companies in the GCC and India.",
    intro:
      "Industrial buyers are engineers and procurement teams. They want capabilities, certifications, project references and a quick way to request a quote. We build B2B websites and run LinkedIn for industrial brands so that information is easy to find and current.",
    needs: [
      { title: "Capability pages", description: "Services, processes, equipment and certifications explained clearly." },
      { title: "RFQ and catalogue", description: "Product or service catalogues with request-for-quote forms." },
      { title: "Credibility", description: "Project lists, client sectors and downloadable company profiles." },
      { title: "LinkedIn presence", description: "Consistent posting that keeps the brand visible to B2B buyers." },
    ],
    deliverables: [
      "Corporate website with capability and project pages",
      "Product catalogue and RFQ forms",
      "LinkedIn page management and content",
      "Bilingual-ready layouts for GCC markets",
    ],
    services: ["web-development", "social-media-management", "seo", "custom-software-development"],
    faqs: [
      {
        question: "Do you manage LinkedIn for industrial companies?",
        answer: "Yes. We plan and publish LinkedIn content around projects, capabilities and hiring for industrial brands in the GCC.",
      },
      {
        question: "Can you build a product catalogue with RFQ?",
        answer: "Yes. Buyers can browse products and send a quote request; your team manages products in an admin.",
      },
      {
        question: "Can the website be in Arabic and English?",
        answer: "Yes. We build RTL layouts and separate language URLs. Arabic copy is supplied by you or scoped separately.",
      },
    ],
    reviewStatus: "draft",
  },
];

export function getIndustryPage(slug: string) {
  return industryPages.find((industry) => industry.slug === slug);
}

export function industryHref(slug: string) {
  return `/industries/${slug}`;
}
