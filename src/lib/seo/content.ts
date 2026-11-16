import { companyInfo } from "@/lib/constants";
import { publicRoutes, rssFeedPath, siteName, siteUrl } from "@/lib/seo";
import { fetchBlogs } from "@/lib/data/fetch";
import { resolveBlogMetaDescription } from "@/lib/seo/blog";
import { industryHref, industryPages } from "@/lib/seo/industries";
import { locationPages } from "@/lib/seo/locations";
import { marketHref, marketHubs } from "@/lib/seo/markets";
import { resolveServiceLocation, serviceLocationPages } from "@/lib/seo/service-locations";
import { servicePages } from "@/lib/seo/services";
import { getSiteUrlEntries, isLivePost, siteUrlFor } from "@/lib/seo/site-urls";

export const serviceFaqs = [
  {
    question: "What services does Hussaini IT Services offer?",
    answer:
      "Our four core offerings are digital online presence (websites, SEO, and Google Business Profile), custom software development (CRM, SaaS, and ERP), Google Ads and social media management, and AI voice calling agents. We also provide ecommerce, mobile apps, and brand design.",
  },
  {
    question: "Do you work with clients outside the UAE and India?",
    answer:
      "Yes. We are based in Dubai and Ujjain and work with clients worldwide, including the United Kingdom. Remote collaboration and transparent project communication are standard.",
  },
  {
    question: "How long does a typical website project take?",
    answer:
      "Most business websites take 2–6 weeks depending on scope, content readiness, and integrations. Ecommerce and custom web applications may require longer timelines defined in the project proposal.",
  },
  {
    question: "Do you provide SEO and local search optimization?",
    answer:
      "Yes. Our SEO services include keyword research, on-page optimization, technical SEO, local SEO, and Google Business Profile management to improve visibility in Google Search and Maps.",
  },
];

export const homeFaqs = [
  {
    question: "Where is Hussaini IT Services based?",
    answer:
      "We operate from Dubai, UAE and Ujjain, Madhya Pradesh, India, and take on remote work for clients worldwide.",
  },
  {
    question: "What does Hussaini IT Services do?",
    answer:
      "We build digital presence (websites, SEO, and Google Business Profile), custom software (CRM, SaaS, and ERP), run Google Ads and social media campaigns, and deploy AI voice calling agents for growing businesses.",
  },
  {
    question: "How do I start a project?",
    answer: `Send a message via the contact form, email ${companyInfo.email}, or WhatsApp ${companyInfo.whatsapp.display}. We reply within one business day.`,
  },
  {
    question: "Do you only work with large companies?",
    answer:
      "No. We work with startups, local businesses, and established brands. Scope and timeline are set in a written proposal before work starts.",
  },
];

export const contactFaqs = [
  {
    question: "How can I contact Hussaini IT Services?",
    answer: `Email ${companyInfo.email}, call ${companyInfo.phones.map((p) => p.display).join(" or ")}, WhatsApp ${companyInfo.whatsapp.display}, or use the contact form at ${siteUrl}/contact.`,
  },
  {
    question: "Where is Hussaini IT Services located?",
    answer: `${companyInfo.name} operates from ${companyInfo.locations.join(" and ")}, serving clients in the UAE, India, and internationally.`,
  },
  {
    question: "How quickly will you respond to a project inquiry?",
    answer:
      "We aim to respond to new inquiries within one business day with next steps and, where helpful, a brief discovery call recommendation.",
  },
];

function mdLink(title: string, url: string, note?: string) {
  return note ? `- [${title}](${url}): ${note}` : `- [${title}](${url})`;
}

function pageUrl(path: string) {
  return path === "/" ? siteUrl : `${siteUrl}${path}`;
}

const keyPageNotes: Record<string, { title: string; note: string }> = {
  "/": { title: "Home", note: "Overview of digital presence, custom software, ads, and AI services" },
  "/about": { title: "About", note: "Company background, founders, and how we work" },
  "/services": { title: "Services", note: "Full list of IT and marketing services" },
  "/portfolio": { title: "Portfolio", note: "Selected websites and digital projects" },
  "/case-studies": { title: "Case studies", note: "Challenge, solution and measured results for client projects" },
  "/pricing": { title: "Pricing", note: "Website, ecommerce and SEO packages, quoted individually in INR, AED or SAR" },
  "/free-website-audit": { title: "Free website audit", note: "Request a free website and SEO review" },
  "/faq": { title: "FAQ", note: "Answers about offices, services, process, ownership and pricing" },
  "/blog": { title: "Blog", note: "Articles on web, SEO, and digital growth" },
  "/testimonials": { title: "Testimonials", note: "Client reviews and case feedback" },
  "/contact": { title: "Contact", note: "Start a project or request a consultation" },
  "/careers": { title: "Careers", note: "Open roles and hiring process" },
  "/best-it-services": { title: "Best IT services", note: "City pages for the markets we serve" },
};

/** Posts most useful to answer engines; others are still listed below these */
const KEY_POST_LIMIT = 12;

export async function buildLlmTxt() {
  const keyPages = publicRoutes
    .filter((route) => keyPageNotes[route.path])
    .map((route) => {
      const meta = keyPageNotes[route.path];
      return mdLink(meta.title, pageUrl(route.path), meta.note);
    })
    .join("\n");

  const serviceLinks = servicePages
    .map((service) => mdLink(service.title, `${siteUrl}/services/${service.slug}`, service.metaDescription))
    .join("\n");

  const hubLinks = marketHubs
    .map((hub) => mdLink(hub.metaTitle, `${siteUrl}${marketHref(hub.slug)}`, hub.metaDescription))
    .join("\n");

  const serviceCityLinks = serviceLocationPages
    .map((page) => {
      const resolved = resolveServiceLocation(page);
      return mdLink(resolved.h1, `${siteUrl}${resolved.href}`, page.metaDescription);
    })
    .join("\n");

  const locationLinks = locationPages
    .map((location) =>
      mdLink(
        `Best IT services in ${location.city}`,
        `${siteUrl}${location.href}`,
        `${location.city}, ${location.country} — ${location.industries.slice(0, 3).join(", ")}`,
      ),
    )
    .join("\n");

  const industryLinks = industryPages
    .map((industry) => mdLink(industry.name, `${siteUrl}${industryHref(industry.slug)}`, industry.metaDescription))
    .join("\n");

  const posts = (await fetchBlogs()).filter((post) => isLivePost(post)).slice(0, KEY_POST_LIMIT);
  const blogLinks = posts
    .map((post) => mdLink(post.title, `${siteUrl}/blog/${post.slug}`, resolveBlogMetaDescription(post)))
    .join("\n");

  return `# ${siteName}

> Websites, ecommerce, SEO, custom software, ads and AI voice agents — offices in Ujjain (Madhya Pradesh, India) and Dubai (UAE), serving India, the UAE, Saudi Arabia and the wider GCC.

${siteName} helps businesses build a complete digital identity, develop custom CRM and SaaS platforms, run Google Ads and social media campaigns, and deploy AI voice calling agents. The India office in Ujjain serves Madhya Pradesh and the rest of India; the Dubai office serves the UAE in person and Saudi Arabia, Oman, Qatar, Kuwait and Bahrain remotely.

## Pages
${keyPages}

## Regions
${mdLink("All regions", `${siteUrl}/it-services`, "India, UAE, Saudi Arabia and GCC hubs")}
${hubLinks}

## Services
${mdLink("All services", `${siteUrl}/services`, "Web, SEO, social, ecommerce, and AI offerings")}
${serviceLinks}

## Services by city
${serviceCityLinks}

## Locations
${mdLink("All cities", `${siteUrl}/best-it-services`, "Markets we serve in India, the UAE, Saudi Arabia and the GCC")}
${locationLinks}

## Industries
${mdLink("All industries", `${siteUrl}/industries`, "Sector pages linked to real portfolio projects")}
${industryLinks}

## Key articles
${blogLinks || "- (no published posts)"}

## Contact
${mdLink("Website", siteUrl, "Official company website")}
${mdLink("Email", `mailto:${companyInfo.email}`, companyInfo.email)}
${companyInfo.phones.map((phone) => mdLink(`Phone ${phone.label}`, phone.href, phone.display)).join("\n")}
${mdLink("WhatsApp", companyInfo.socials.whatsapp, companyInfo.whatsapp.display)}
${mdLink("LinkedIn", companyInfo.socials.linkedin)}
${mdLink("Instagram", companyInfo.socials.instagram)}
${mdLink("Facebook", companyInfo.socials.facebook)}

## Optional
${mdLink("Sitemap", `${siteUrl}/sitemap.xml`, "Machine-readable list of public URLs")}
${mdLink("Text sitemap", `${siteUrl}/sitemap.txt`)}
${mdLink("RSS feed", `${siteUrl}${rssFeedPath}`)}
${mdLink("Privacy policy", `${siteUrl}/privacy-policy`)}
${mdLink("Terms and conditions", `${siteUrl}/terms-and-conditions`)}
`;
}

/**
 * Plain-text sitemap: one absolute URL per line, nothing else (Google's text sitemap format).
 * Shares the URL list with sitemap.xml so the two never drift.
 */
export async function buildSitemapTxt() {
  const entries = await getSiteUrlEntries();
  return `${entries.map((entry) => siteUrlFor(entry.path)).join("\n")}\n`;
}
