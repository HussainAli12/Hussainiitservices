import { SiteLayout } from "@/components/layout/SiteLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { ContactSection } from "@/components/sections/ContactSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { PageSeo } from "@/components/seo/PageSeo";
import { createPageMetadata } from "@/lib/seo";
import { contactFaqs } from "@/lib/seo/content";
import { breadcrumbJsonLd, contactPageJsonLd, faqJsonLd, webPageJsonLd } from "@/lib/seo/jsonld";

export const metadata = createPageMetadata({
  title: "Contact Us — Dubai & Ujjain",
  description:
    "Contact Hussaini IT Services in Dubai or Ujjain for web development, SEO, ads, and AI voice agents. Email info@hussainiitservices.com, phone, WhatsApp, or the form — reply within one business day.",
  path: "/contact",
});

export default function ContactPage() {
  const pageTitle = "Contact Us — Dubai & Ujjain";
  const pageDescription =
    "Contact Hussaini IT Services in Dubai or Ujjain for web development, SEO, ads, and AI voice agents. Email info@hussainiitservices.com, phone, WhatsApp, or the form — reply within one business day.";

  return (
    <>
      <PageSeo
        schemas={[
          webPageJsonLd({ title: pageTitle, description: pageDescription, path: "/contact" }),
          contactPageJsonLd(),
          faqJsonLd(contactFaqs),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Contact", path: "/contact" },
          ]),
        ]}
      />
      <SiteLayout>
        <PageHeader
          breadcrumbs={[{ name: "Home", path: "/" }, { name: "Contact", path: "/contact" }]}
          badge="Contact"
          title="Contact Hussaini IT Services in Dubai or Ujjain"
          subtitle="Tell us about your project — email, phone, WhatsApp, or the form. We reply within one business day."
        />
        <ContactSection />
        <FaqSection
          title="Contact & Location FAQs"
          subtitle="How to reach us and what to expect after you submit an inquiry."
          items={contactFaqs}
        />
      </SiteLayout>
    </>
  );
}
