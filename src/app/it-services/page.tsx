import { SiteLayout } from "@/components/layout/SiteLayout";
import { PageSeo } from "@/components/seo/PageSeo";
import { LinkCardGrid } from "@/components/ui/LinkCardGrid";
import { PageHeader } from "@/components/ui/PageHeader";
import { createPageMetadata } from "@/lib/seo";
import { breadcrumbJsonLd, linkItemListJsonLd, webPageJsonLd } from "@/lib/seo/jsonld";
import { marketHref, marketHubs } from "@/lib/seo/markets";

const title = "IT Services by Region";
const description =
  "Hussaini IT Services by market: India (Madhya Pradesh), the UAE, Saudi Arabia and the wider GCC — offices in Ujjain and Dubai.";

export const metadata = createPageMetadata({ title, description, path: "/it-services" });

const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: title, path: "/it-services" },
];

export default function ItServicesIndexPage() {
  return (
    <>
      <PageSeo
        schemas={[
          webPageJsonLd({ title, description, path: "/it-services", type: "CollectionPage" }),
          linkItemListJsonLd(
            title,
            "/it-services",
            marketHubs.map((hub) => ({ name: hub.metaTitle, path: marketHref(hub.slug) })),
          ),
          breadcrumbJsonLd(breadcrumbs),
        ]}
      />
      <SiteLayout>
        <PageHeader
          breadcrumbs={breadcrumbs}
          badge="Regions"
          title="IT services by region"
          subtitle="Offices in Ujjain and Dubai, serving India, the UAE, Saudi Arabia and the wider GCC."
        />
        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="sr-only">Regions</h2>
            <LinkCardGrid
              columns={2}
              items={marketHubs.map((hub) => ({
                href: marketHref(hub.slug),
                title: hub.metaTitle,
                description: hub.intro,
              }))}
            />
          </div>
        </section>
      </SiteLayout>
    </>
  );
}
