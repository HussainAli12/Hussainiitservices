import Link from "next/link";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { PageSeo } from "@/components/seo/PageSeo";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { PageHeader } from "@/components/ui/PageHeader";
import { createPageMetadata } from "@/lib/seo";
import { allFaqs, faqGroups } from "@/lib/seo/faqs";
import { breadcrumbJsonLd, faqJsonLd, webPageJsonLd } from "@/lib/seo/jsonld";

const title = "Frequently Asked Questions";
const description =
  "Answers about Hussaini IT Services: our offices in Ujjain and Dubai, services, how projects run, ownership, pricing and support.";

export const metadata = createPageMetadata({ title: "FAQ", description, path: "/faq" });

const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "FAQ", path: "/faq" },
];

export default function FaqPage() {
  return (
    <>
      <PageSeo
        schemas={[
          webPageJsonLd({ title, description, path: "/faq" }),
          faqJsonLd(allFaqs),
          breadcrumbJsonLd(breadcrumbs),
        ]}
      />
      <SiteLayout>
        <PageHeader
          breadcrumbs={breadcrumbs}
          badge="FAQ"
          title="Frequently asked questions"
          subtitle="Short, straight answers about who we are, what we do and how projects work."
        />
        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <nav aria-label="FAQ sections" className="mb-10 flex flex-wrap gap-2">
              {faqGroups.map((group) => (
                <a
                  key={group.id}
                  href={`#${group.id}`}
                  className="rounded-full border border-border bg-white px-3.5 py-1.5 text-sm font-medium text-foreground hover:border-accent/40 hover:text-accent"
                >
                  {group.title}
                </a>
              ))}
            </nav>
            <div className="space-y-14">
              {faqGroups.map((group) => (
                <section key={group.id} id={group.id} aria-labelledby={`${group.id}-heading`} className="scroll-mt-28">
                  <h2 id={`${group.id}-heading`} className="mb-6 font-display text-2xl font-bold tracking-tight sm:text-3xl">
                    {group.title}
                  </h2>
                  <FaqAccordion items={group.items} />
                </section>
              ))}
            </div>
            <p className="mt-14 text-center text-sm text-muted">
              Still have a question?{" "}
              <Link href="/contact" className="font-semibold text-accent hover:underline">
                Contact us
              </Link>{" "}
              — we reply within one business day.
            </p>
          </div>
        </section>
      </SiteLayout>
    </>
  );
}
