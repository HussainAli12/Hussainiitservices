import { HomePage } from "@/components/HomePage";
import { PageSeo } from "@/components/seo/PageSeo";
import { fetchPortfolio, fetchSiteStats, fetchTestimonials } from "@/lib/data/fetch";
import { getTrustedClients } from "@/lib/portfolio/clients";
import { stats as heroStatMeta, trackRecord as trackMeta } from "@/lib/constants";
import { hreflangLanguages } from "@/i18n/routes";
import { createPageMetadata } from "@/lib/seo";
import { homeFaqs } from "@/lib/seo/content";
import {
  breadcrumbJsonLd,
  faqJsonLd,
  webPageJsonLd,
} from "@/lib/seo/jsonld";

export const revalidate = 120;

export const metadata = createPageMetadata({
  title: "Web & IT Services in Dubai & Ujjain",
  description:
    "Grow with Hussaini IT Services — websites & SEO, custom CRM/SaaS, Google Ads & social, and AI voice agents. Based in Dubai and Ujjain, serving the UAE, India, and worldwide.",
  path: "/",
  languages: hreflangLanguages("/"),
});

export default async function Home() {
  const [portfolio, testimonials, siteStats] = await Promise.all([
    fetchPortfolio(),
    fetchTestimonials(),
    fetchSiteStats(),
  ]);

  const heroStats = heroStatMeta.map((item) => ({
    value: siteStats[item.key],
    suffix: item.suffix,
    label: item.label,
  }));

  const trackRecord = trackMeta.map((item) => ({
    value: siteStats[item.key],
    suffix: item.suffix,
    label: item.label,
  }));

  const pageTitle = "Web & IT Services in Dubai & Ujjain";
  const pageDescription =
    "Grow with Hussaini IT Services — websites & SEO, custom CRM/SaaS, Google Ads & social, and AI voice agents. Based in Dubai and Ujjain, serving the UAE, India, and worldwide.";

  return (
    <>
      <PageSeo
        schemas={[
          webPageJsonLd({ title: pageTitle, description: pageDescription, path: "/" }),
          breadcrumbJsonLd([{ name: "Home", path: "/" }]),
          faqJsonLd(homeFaqs),
        ]}
      />
      <HomePage
        portfolio={portfolio.slice(0, 4)}
        clients={getTrustedClients(portfolio)}
        testimonials={testimonials}
        heroStats={heroStats}
        trackRecord={trackRecord}
        faqs={homeFaqs}
      />
    </>
  );
}
