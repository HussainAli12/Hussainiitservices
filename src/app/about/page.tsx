import { SiteLayout } from "@/components/layout/SiteLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { About } from "@/components/sections/About";
import { FoundersSection } from "@/components/sections/about/FoundersSection";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";
import { PageSeo } from "@/components/seo/PageSeo";
import { TrustedBy } from "@/components/sections/TrustedBy";
import { getTrustedClients } from "@/lib/portfolio/clients";
import { fetchPortfolio, fetchSiteStats } from "@/lib/data/fetch";
import { trackRecord as trackMeta } from "@/lib/constants";
import { createPageMetadata } from "@/lib/seo";
import { aboutPageJsonLd, breadcrumbJsonLd, foundersJsonLd, webPageJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 120;

export const metadata = createPageMetadata({
  title: "About Us — Dubai & Ujjain Studio",
  description:
    "Meet Hussaini IT Services — a Dubai & Ujjain studio for websites, SEO, custom software, ads, and AI voice agents. Founders, approach, and how we ship for UAE and India clients.",
  path: "/about",
});

export default async function AboutPage() {
  const [siteStats, portfolio] = await Promise.all([fetchSiteStats(), fetchPortfolio()]);
  const clients = getTrustedClients(portfolio);
  const trackRecord = trackMeta.map((item) => ({
    value: siteStats[item.key],
    suffix: item.suffix,
    label: item.label,
  }));

  const pageTitle = "About Us — Dubai & Ujjain Studio";
  const pageDescription =
    "Meet Hussaini IT Services — a Dubai & Ujjain studio for websites, SEO, custom software, ads, and AI voice agents. Founders, approach, and how we ship for UAE and India clients.";

  return (
    <>
      <PageSeo
        schemas={[
          webPageJsonLd({ title: pageTitle, description: pageDescription, path: "/about" }),
          aboutPageJsonLd(),
          ...foundersJsonLd(),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "About", path: "/about" },
          ]),
        ]}
      />
      <SiteLayout>
        <PageHeader
          breadcrumbs={[{ name: "Home", path: "/" }, { name: "About", path: "/about" }]}
          badge="About Us"
          title="A Dubai & Ujjain studio for web, SEO, software & growth"
          subtitle="We combine technical excellence with practical marketing so businesses in the UAE and India get sites, systems, and campaigns that convert."
        />
        <About />
        <TrustedBy clients={clients} className="border-t border-border" />
        <FoundersSection />
        <WhyChooseUs trackRecord={trackRecord} />
      </SiteLayout>
    </>
  );
}
