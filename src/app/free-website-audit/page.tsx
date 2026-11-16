import { CheckCircle2 } from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { PageSeo } from "@/components/seo/PageSeo";
import { WebsiteAuditForm } from "@/components/sections/audit/WebsiteAuditForm";
import { FaqSection } from "@/components/sections/FaqSection";
import { TrustedBy } from "@/components/sections/TrustedBy";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { fetchPortfolio } from "@/lib/data/fetch";
import { getTrustedClients } from "@/lib/portfolio/clients";
import { createPageMetadata } from "@/lib/seo";
import { breadcrumbJsonLd, faqJsonLd, webPageJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 3600;

const title = "Free Website & SEO Audit";
const description =
  "Get a free website and SEO audit from Hussaini IT Services: speed, mobile, SEO basics, Google Business Profile and tracking, with clear next steps.";

export const metadata = createPageMetadata({ title, description, path: "/free-website-audit" });

const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "Free Website Audit", path: "/free-website-audit" },
];

const checks = [
  { title: "Speed & mobile", description: "How fast your key pages load on a phone, and what slows them down." },
  { title: "SEO basics", description: "Titles, descriptions, headings, indexing and structured data on your main pages." },
  { title: "Google Business Profile", description: "Categories, details and consistency between your Maps listing and website." },
  { title: "Enquiry paths", description: "Whether visitors can easily call, WhatsApp or send a form from every page." },
  { title: "Tracking", description: "Whether analytics and conversion tracking are set up to measure enquiries." },
];

// TODO(content-review): confirm the audit scope and turnaround you want to promise.
const auditFaqs = [
  {
    question: "Is the audit really free?",
    answer: "Yes. There is no charge and no obligation. If you want help fixing what we find, we send a separate written quote.",
  },
  {
    question: "What do I receive?",
    answer: "A short written summary of the issues we find on your website and Google listing, ordered by priority, with recommended next steps.",
  },
  {
    question: "I don’t have a website yet. Can I still apply?",
    answer: "Yes. We review your Google Business Profile and social presence, and suggest what a first website should include.",
  },
  {
    question: "Which countries do you cover?",
    answer: "India, the UAE, Saudi Arabia and the wider GCC, from our offices in Ujjain and Dubai.",
  },
];

export default async function FreeWebsiteAuditPage() {
  const clients = getTrustedClients(await fetchPortfolio());

  return (
    <>
      <PageSeo
        schemas={[
          webPageJsonLd({ title, description, path: "/free-website-audit" }),
          faqJsonLd(auditFaqs),
          breadcrumbJsonLd(breadcrumbs),
        ]}
      />
      <SiteLayout>
        <section className="page-top border-b border-border bg-surface pb-12 sm:pb-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Breadcrumbs items={breadcrumbs} />
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
              <div className="lg:col-span-6">
                <span className="section-badge mb-5 inline-flex">Free audit</span>
                <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                  Free website & SEO audit
                </h1>
                <p className="mt-5 text-base leading-relaxed text-muted sm:text-lg">
                  Tell us about your business and we’ll review your website and Google presence, then send a short,
                  prioritised list of what to fix. No obligation.
                </p>
                <h2 className="mt-10 font-display text-xl font-bold">What we check</h2>
                <ul className="mt-4 space-y-4">
                  {checks.map((check) => (
                    <li key={check.title} className="flex gap-3">
                      <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-accent" aria-hidden />
                      <span>
                        <span className="block text-sm font-semibold text-foreground">{check.title}</span>
                        <span className="block text-sm leading-relaxed text-muted">{check.description}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="lg:col-span-6">
                <div className="premium-card rounded-2xl p-6 sm:p-8">
                  <h2 className="font-display text-xl font-bold">Request your audit</h2>
                  <p className="mt-1 mb-6 text-sm text-muted">Takes under a minute.</p>
                  <WebsiteAuditForm />
                </div>
              </div>
            </div>
          </div>
        </section>
        <TrustedBy clients={clients} />
        <FaqSection title="Free audit — FAQs" items={auditFaqs} />
      </SiteLayout>
    </>
  );
}
