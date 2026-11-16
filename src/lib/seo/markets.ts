import { marketHref, marketIndexEntry, type MarketIndexEntry } from "@/lib/seo/market-index";
import { locationMarket, locationPages, type LocationPageContent } from "@/lib/seo/locations";
import { getLocationPage } from "@/lib/seo/locations";
import { serviceLocationPages, type ServiceLocationPage } from "@/lib/seo/service-locations";

/**
 * Country / region hub pages (/it-services/[market]).
 *
 * TODO(content-review): first drafts — please review. Only office locations, services and
 * real portfolio items are referenced; no client counts, results or prices.
 */
export interface MarketHub extends MarketIndexEntry {
  /** H1 */
  headline: string;
  metaDescription: string;
  intro: string;
  /** How we serve this market: office + remote */
  howWeServe: { title: string; description: string }[];
  /** Additional context paragraphs */
  body: string[];
  faqs: { question: string; answer: string }[];
  /** Office used for the contact block */
  office: "ujjain" | "dubai";
  /** Country names (as in locations.ts) whose city pages belong to this hub */
  countries: string[];
  reviewStatus: "draft" | "approved";
}

export const marketHubs: MarketHub[] = [
  {
    ...marketIndexEntry("india"),
    headline: "IT services in India — Ujjain, Indore & Madhya Pradesh",
    metaDescription:
      "Websites, SEO, ecommerce and custom software for businesses in Ujjain, Indore, Bhopal and across Madhya Pradesh, from our India office in Ujjain.",
    intro:
      "Our India office is in Ujjain, Madhya Pradesh. From here we build websites, ecommerce stores, custom software and local SEO for businesses across the state — and remotely for clients elsewhere in India.",
    howWeServe: [
      {
        title: "Office in Ujjain",
        description: "Meet the team in person, review work on a big screen, and talk to the people actually building your project.",
      },
      {
        title: "Visits across Madhya Pradesh",
        description: "Indore, Dewas and nearby towns are a short drive away; kickoffs elsewhere in MP can be planned into the proposal.",
      },
      {
        title: "Remote for the rest of India",
        description: "Video calls, WhatsApp updates and staging links keep projects in Mumbai, Delhi and beyond on track.",
      },
      {
        title: "Hindi and English",
        description: "Conversations, content and support in the language your team is most comfortable with.",
      },
    ],
    body: [
      "Most of our Madhya Pradesh clients start with a fast website and a correct Google Business Profile, then add SEO, ecommerce or custom software as the business grows. Our Ujjain portfolio includes real estate, jewellery ecommerce, tour and travels, and a custom management platform.",
    ],
    faqs: [
      {
        question: "Where is your office in India?",
        answer: "Our India office is in Ujjain, Madhya Pradesh. We also have an office in Dubai, UAE.",
      },
      {
        question: "Do you work with businesses outside Madhya Pradesh?",
        answer: "Yes. We work remotely with businesses across India, with video calls and WhatsApp updates.",
      },
      {
        question: "Can we meet in person?",
        answer: "Yes, at our Ujjain office, or at your office in Indore and nearby cities for kickoffs and reviews.",
      },
      {
        question: "Do you invoice in INR?",
        answer: "Yes, India projects are quoted and invoiced in INR. Details are confirmed in each proposal.",
      },
    ],
    office: "ujjain",
    countries: ["India"],
    reviewStatus: "draft",
  },
  {
    ...marketIndexEntry("uae"),
    headline: "IT services in the UAE — Dubai, Abu Dhabi, Sharjah & beyond",
    metaDescription:
      "Web development, SEO, ecommerce, Google Business Profile and custom software for UAE businesses, from our Dubai office with India delivery support.",
    intro:
      "We have an office in Dubai and work with businesses across the Emirates — trading companies, contractors, clinics, retailers and free-zone firms — on websites, ecommerce, SEO and custom software.",
    howWeServe: [
      {
        title: "Office in Dubai",
        description: "Meetings in Dubai after the first call, and a team that knows how UAE buyers search and compare.",
      },
      {
        title: "All seven Emirates",
        description: "Abu Dhabi, Sharjah, Ajman and Ras Al Khaimah are served from Dubai, with visits when a project needs them.",
      },
      {
        title: "Delivery team in India",
        description: "Our Ujjain team supports development, so UAE clients get a dedicated build team behind the Dubai contact.",
      },
      {
        title: "English and Arabic-ready",
        description: "RTL layouts and separate language URLs, with Arabic copy supplied by you or scoped separately.",
      },
    ],
    body: [
      "Our UAE portfolio includes a Dubai hardware and tools supplier website, a UAE ecommerce store with Cash on Delivery and WhatsApp orders, a corporate site for a metal coating company, and LinkedIn management for industrial brands.",
    ],
    faqs: [
      {
        question: "Do you have an office in the UAE?",
        answer: "Yes. We have an office in Dubai, plus our India office in Ujjain that supports delivery.",
      },
      {
        question: "Which Emirates do you serve?",
        answer: "All of them. Dubai is our base; Abu Dhabi, Sharjah, Ajman, Ras Al Khaimah and the other Emirates are served from there.",
      },
      {
        question: "Can you build bilingual Arabic and English websites?",
        answer: "Yes. We build RTL layouts and separate language versions. Arabic copywriting is scoped separately if you need us to source it.",
      },
      {
        question: "Do you invoice in AED?",
        answer: "UAE projects can be quoted in AED. Contracting and invoicing details are confirmed in each proposal.",
      },
    ],
    office: "dubai",
    countries: ["United Arab Emirates"],
    reviewStatus: "draft",
  },
  {
    ...marketIndexEntry("saudi-arabia"),
    headline: "IT services in Saudi Arabia — Riyadh, Jeddah, Dammam & more",
    metaDescription:
      "Bilingual websites, SEO, ecommerce and Google Business Profile for businesses in Riyadh, Jeddah, Dammam and across Saudi Arabia, delivered from Dubai.",
    intro:
      "We serve Saudi businesses remotely from our Dubai office, with development support from our team in India. Typical work: bilingual corporate websites, ecommerce stores, SEO in Arabic and English, and Google Business Profiles for each branch.",
    howWeServe: [
      {
        title: "Remote-first from Dubai",
        description: "Discovery, design reviews and launch on video calls, scheduled in Saudi working hours.",
      },
      {
        title: "No local office — said plainly",
        description: "We are a UAE/India studio. Contracting and invoicing terms are confirmed in each proposal.",
      },
      {
        title: "Arabic and English",
        description: "RTL layouts, hreflang between language versions, and keyword research in both languages.",
      },
      {
        title: "WhatsApp updates",
        description: "Day-to-day communication on WhatsApp, with written weekly progress notes.",
      },
    ],
    body: [
      "Most Saudi projects combine a bilingual website with SEO and Google Business Profiles for each branch, then add ecommerce or LinkedIn where it fits the business.",
    ],
    faqs: [
      {
        question: "Do you have an office in Saudi Arabia?",
        answer: "No. We serve Saudi Arabia remotely from our Dubai office, with calls in Saudi working hours.",
      },
      {
        question: "Which Saudi cities do you serve?",
        answer: "Riyadh, Jeddah, Dammam, Al Khobar, Makkah, Madinah and anywhere else in the Kingdom — all remotely.",
      },
      {
        question: "Can you build an Arabic website for a Saudi company?",
        answer: "Yes. We build RTL layouts and place your Arabic content. Arabic copywriting is scoped separately if needed.",
      },
      {
        question: "How are Saudi projects contracted?",
        answer: "Contracting, currency and invoicing are agreed in the proposal for each client.",
      },
    ],
    office: "dubai",
    countries: ["Saudi Arabia"],
    reviewStatus: "draft",
  },
  {
    ...marketIndexEntry("gcc"),
    headline: "IT services across the GCC — UAE, Saudi Arabia, Qatar, Kuwait, Oman & Bahrain",
    metaDescription:
      "Web development, SEO, ecommerce and digital marketing for businesses across the UAE, Saudi Arabia, Qatar, Kuwait, Oman and Bahrain, from our Dubai office.",
    intro:
      "Our Dubai office is the base for all our GCC work. We serve businesses in the UAE in person and across Saudi Arabia, Qatar, Kuwait, Oman and Bahrain remotely, on Gulf working hours.",
    howWeServe: [
      {
        title: "Dubai base",
        description: "One GCC contact point, a short flight from every Gulf capital.",
      },
      {
        title: "Gulf working hours",
        description: "Calls and updates scheduled around your week, including Sunday-start weeks where relevant.",
      },
      {
        title: "Bilingual-ready builds",
        description: "RTL layouts and separate Arabic and English URLs as standard on GCC projects.",
      },
      {
        title: "India delivery team",
        description: "Development supported by our Ujjain team, managed from Dubai.",
      },
    ],
    body: [
      "Across the region, our work includes ecommerce, corporate websites and LinkedIn management for industrial and trading brands. See the portfolio below for GCC projects.",
    ],
    faqs: [
      {
        question: "Which GCC countries do you work in?",
        answer: "The UAE, Saudi Arabia, Qatar, Kuwait, Oman and Bahrain. The UAE is served from our Dubai office; the others remotely.",
      },
      {
        question: "Do you need to visit to start a project?",
        answer: "No. Discovery always starts on a video call. Visits can be arranged for larger projects.",
      },
      {
        question: "Can one team manage our sites in several GCC countries?",
        answer: "Yes. We can manage country or language versions under one plan, with hreflang so each version reaches the right audience.",
      },
    ],
    office: "dubai",
    countries: ["United Arab Emirates", "Saudi Arabia", "Qatar", "Kuwait", "Oman", "Bahrain"],
    reviewStatus: "draft",
  },
];

export function getMarketHub(slug: string) {
  return marketHubs.find((hub) => hub.slug === slug);
}

export { marketHref };

export function getMarketCities(hub: MarketHub): LocationPageContent[] {
  return locationPages.filter((location) => hub.countries.includes(location.country));
}

export function getMarketServicePages(hub: MarketHub): ServiceLocationPage[] {
  return serviceLocationPages.filter((page) => {
    const location = getLocationPage(page.city);
    return location ? hub.countries.includes(location.country) : false;
  });
}

/** Primary hub for a city (UAE/Saudi cities → their country hub, other Gulf → GCC) */
export function marketForLocation(location: Pick<LocationPageContent, "country">) {
  return getMarketHub(locationMarket(location));
}
