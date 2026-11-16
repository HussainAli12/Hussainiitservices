import { SiteLayout } from "@/components/layout/SiteLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { TestimonialsList } from "@/components/sections/testimonials/TestimonialsList";
import { PageSeo } from "@/components/seo/PageSeo";
import { fetchTestimonials } from "@/lib/data/fetch";
import { createPageMetadata } from "@/lib/seo";
import {
  breadcrumbJsonLd,
  testimonialsItemListJsonLd,
  webPageJsonLd,
} from "@/lib/seo/jsonld";

export const revalidate = 120;

export const metadata = createPageMetadata({
  title: "Client Testimonials & Reviews",
  description:
    "Read client reviews for Hussaini IT Services — web development, SEO, social media, and digital marketing feedback from B2B, ecommerce, and hospitality clients.",
  path: "/testimonials",
});

export default async function TestimonialsPage() {
  const items = await fetchTestimonials();

  const pageTitle = "Client Testimonials & Reviews";
  const pageDescription =
    "Read client reviews for Hussaini IT Services — web development, SEO, social media, and digital marketing feedback from B2B, ecommerce, and hospitality clients.";

  return (
    <>
      <PageSeo
        schemas={[
          webPageJsonLd({ title: pageTitle, description: pageDescription, path: "/testimonials" }),
          testimonialsItemListJsonLd(items),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Testimonials", path: "/testimonials" },
          ]),
        ]}
      />
      <SiteLayout>
        <PageHeader
          breadcrumbs={[{ name: "Home", path: "/" }, { name: "Testimonials", path: "/testimonials" }]}
          badge="Testimonials"
          title="What Our Clients Say"
          subtitle="Trusted by businesses across industries — from industrial B2B to hospitality and creative professionals."
        />
        <section className="py-12 sm:py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <TestimonialsList items={items} />
          </div>
        </section>
      </SiteLayout>
    </>
  );
}
