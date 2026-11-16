import Link from "next/link";
import { MapPin } from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { PageSeo } from "@/components/seo/PageSeo";
import { PageHeader } from "@/components/ui/PageHeader";
import { createPageMetadata } from "@/lib/seo";
import { breadcrumbJsonLd, locationCollectionJsonLd, webPageJsonLd } from "@/lib/seo/jsonld";
import { locationPages } from "@/lib/seo/locations";

const title = "Best IT Services by City";
const description =
  "City pages for IT services from Hussaini IT Services across Madhya Pradesh, the UAE, Saudi Arabia and the GCC — web, SEO and marketing for each market.";

export const metadata = createPageMetadata({
  title,
  description,
  path: "/best-it-services",
});

const countryOrder = ["India", "United Arab Emirates", "Saudi Arabia", "Qatar", "Kuwait", "Oman", "Bahrain"];

export default function BestItServicesIndexPage() {
  const groups = countryOrder
    .map((country) => ({
      country,
      cities: locationPages.filter((location) => location.country === country),
    }))
    .filter((group) => group.cities.length > 0);

  return (
    <>
      <PageSeo
        schemas={[
          webPageJsonLd({
            title,
            description,
            path: "/best-it-services",
            type: "CollectionPage",
          }),
          locationCollectionJsonLd(),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Best IT Services", path: "/best-it-services" },
          ]),
        ]}
      />
      <SiteLayout>
        <PageHeader
          breadcrumbs={[{ name: "Home", path: "/" }, { name: "Best IT Services", path: "/best-it-services" }]}
          badge="Locations"
          title="Best IT services by city across India, UAE, Saudi Arabia & GCC"
          subtitle="Dedicated pages for markets we serve — from Ujjain, Indore and Bhopal to Dubai, Riyadh and Jeddah — with local web, SEO, and marketing focus."
        />
        <section className="py-12 sm:py-16 md:py-24">
          <div className="mx-auto max-w-7xl space-y-14 px-4 sm:px-6 lg:px-8">
            {groups.map((group) => (
              <div key={group.country}>
                <h2 className="mb-6 font-display text-2xl font-bold tracking-tight sm:text-3xl">
                  {group.country}
                </h2>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {group.cities.map((location) => (
                    <Link
                      key={location.slug}
                      href={location.href}
                      className="premium-card group flex h-full flex-col rounded-2xl p-6"
                    >
                      <div className="icon-box h-12 w-12">
                        <MapPin size={22} />
                      </div>
                      <h3 className="mt-5 font-display text-xl font-bold group-hover:text-accent">
                        {location.city}
                      </h3>
                      <p className="mt-1 text-sm text-muted">{location.region}</p>
                      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{location.intro}</p>
                      <span className="mt-5 text-sm font-semibold text-accent">
                        Best IT services in {location.city}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </SiteLayout>
    </>
  );
}
