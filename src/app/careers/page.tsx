import { SiteLayout } from "@/components/layout/SiteLayout";
import { PageSeo } from "@/components/seo/PageSeo";
import { CareersPage } from "@/components/sections/careers/CareersPage";
import { createPageMetadata } from "@/lib/seo";
import { breadcrumbJsonLd, careersJsonLd, webPageJsonLd } from "@/lib/seo/jsonld";

export const metadata = createPageMetadata({
  title: "Careers — On-site Jobs in Ujjain",
  description:
    "Join Hussaini IT Services in Ujjain. Full-time on-site roles in web development, SEO, social media, and business development.",
  path: "/careers",
});

export default function CareersRoute() {
  const title = "Careers — On-site Jobs in Ujjain";
  const description =
    "Join Hussaini IT Services in Ujjain. Full-time on-site roles in web development, SEO, social media, and business development.";

  return (
    <>
      <PageSeo
        schemas={[
          webPageJsonLd({ title, description, path: "/careers" }),
          ...careersJsonLd(),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Careers", path: "/careers" },
          ]),
        ]}
      />
      <SiteLayout>
        <CareersPage />
      </SiteLayout>
    </>
  );
}
