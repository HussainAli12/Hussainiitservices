import { allServices } from "@/lib/constants";
import { locationHref, locationIndex } from "@/lib/seo/location-index";
import { marketHref, marketIndex } from "@/lib/seo/market-index";

/**
 * Labels for the shared header, mega-menus, offer banner and footer.
 * English is the default (identical to the original hard-coded strings); /ar and /hi pages pass a
 * translated copy built by i18n/build-chrome.ts. Kept free of page content so it is cheap to ship.
 */
export interface SiteChromeStrings {
  nav: {
    home: string;
    services: string;
    portfolio: string;
    blog: string;
    testimonials: string;
    getInTouch: string;
    menu: string;
    contact: string;
    viewAllServices: string;
    viewAllProjects: string;
    viewAllArticles: string;
    openMenu: string;
    closeMenu: string;
  };
  menus: {
    ourServices: string;
    servicesSubtitle: string;
    moreServices: string;
    viewAll: string;
    blogTitle: string;
    blogSubtitle: string;
  };
  banner: {
    newClients: string;
    desktopLead: string;
    desktopPlaces: string;
    mobile: string;
    cta: string;
  };
  footer: {
    ctaTitle: string;
    ctaText: string;
    schedule: string;
    explore: string;
    tagline: string;
    contact: string;
    pages: string;
    services: string;
    legal: string;
    allServices: string;
    bestIt: string;
    bestItIntro: string;
    allCities: string;
    rights: string;
    /** "Best IT services in {city}" */
    cityLink: string;
  };
  /** Trusted-by hover card */
  clientCard: { about: string; viewProject: string; servicesProvided: string };
  /** href → label for footer page/legal links */
  pageLabels: Record<string, string>;
}

export interface SiteChrome extends SiteChromeStrings {
  locale: "en" | "ar" | "hi";
  homeHref: string;
  servicesHref: string;
  /** service slug → display name */
  serviceNames: Record<string, string>;
  /** service slug → mega-menu label + tagline (featured services only) */
  featuredMenu: Record<string, { label: string; tagline: string }>;
  cityLinks: { href: string; label: string }[];
  hubLinks: { href: string; label: string }[];
}

export const enChromeStrings: SiteChromeStrings = {
  nav: {
    home: "Home",
    services: "Services",
    portfolio: "Portfolio",
    blog: "Blog",
    testimonials: "Testimonials",
    getInTouch: "Get in touch",
    menu: "Menu",
    contact: "Contact",
    viewAllServices: "View all services",
    viewAllProjects: "View all projects",
    viewAllArticles: "View all articles",
    openMenu: "Open menu",
    closeMenu: "Close menu",
  },
  menus: {
    ourServices: "Our services",
    servicesSubtitle: "Digital presence, custom software, ads & AI",
    moreServices: "More services",
    viewAll: "View all",
    blogTitle: "Blog",
    blogSubtitle: "Insights on digital growth, software, and AI",
  },
  banner: {
    newClients: "New clients",
    desktopLead: "Free website & SEO audit, then a scoped quote for custom CRM, Google Ads, or AI voice agents —",
    desktopPlaces: "Dubai · UAE · India",
    mobile: "Free website & SEO audit for new clients in Dubai, UAE & India.",
    cta: "Book free audit",
  },
  footer: {
    ctaTitle: "Do You Have a Project and Want to Discuss With Us?",
    ctaText:
      "Partner with us to build exceptional digital products. From concept to deployment, we bring your vision to life with precision and elegance.",
    schedule: "Schedule a Consultation",
    explore: "Explore Our Work",
    tagline:
      "Web development, SEO, and digital marketing from Dubai and Ujjain for businesses in the UAE, India, and worldwide.",
    contact: "Contact",
    pages: "Pages",
    services: "Services",
    legal: "Legal",
    allServices: "All services",
    bestIt: "Best IT services",
    bestItIntro: "City pages for the markets we serve — expand to browse every location.",
    allCities: "All cities",
    rights: "All rights reserved.",
    cityLink: "Best IT services in {city}",
  },
  clientCard: { about: "About the company", viewProject: "View project", servicesProvided: "Services provided" },
  pageLabels: {},
};

export const featuredMenuEn: Record<string, { label: string; tagline: string }> = {
  "digital-online-presence": { label: "Digital Presence", tagline: "Websites, SEO & Google Profile" },
  "custom-software-development": { label: "Custom Software", tagline: "CRM, SaaS & ERP builds" },
  "ads-and-social-media": { label: "Ads & Social", tagline: "Google Ads & social media" },
  "ai-voice-calling-agent": { label: "AI Voice Agents", tagline: "24/7 intelligent call handling" },
};

export function cityLinkLabel(template: string, city: string) {
  return template.replace("{city}", city);
}

export const enChrome: SiteChrome = {
  ...enChromeStrings,
  locale: "en",
  homeHref: "/",
  servicesHref: "/services",
  serviceNames: Object.fromEntries(allServices.map((service) => [service.slug, service.title])),
  featuredMenu: featuredMenuEn,
  cityLinks: locationIndex.map((location) => ({
    href: locationHref(location.slug),
    label: cityLinkLabel(enChromeStrings.footer.cityLink, location.city),
  })),
  hubLinks: marketIndex.map((hub) => ({ href: marketHref(hub.slug), label: hub.metaTitle })),
};
