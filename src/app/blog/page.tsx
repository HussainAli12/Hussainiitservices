import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { PageSeo } from "@/components/seo/PageSeo";
import { BlogCard } from "@/components/blog/BlogCard";
import { BlogFeatured } from "@/components/blog/BlogFeatured";
import { fetchBlogs } from "@/lib/data/fetch";
import { createPageMetadata } from "@/lib/seo";
import { blogCollectionJsonLd, breadcrumbJsonLd, webPageJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 120;

export const metadata = createPageMetadata({
  title: "Blog — Web, SEO & Growth Insights",
  description:
    "Practical articles from Hussaini IT Services on websites, SEO, AI automation, and digital marketing for businesses in Dubai, the UAE, and India.",
  path: "/blog",
});

export default async function BlogPage() {
  const posts = await fetchBlogs();
  const [featured, ...rest] = posts;
  const pageTitle = "Blog — Web, SEO & Growth Insights";
  const pageDescription =
    "Practical articles from Hussaini IT Services on websites, SEO, AI automation, and digital marketing for businesses in Dubai, the UAE, and India.";

  return (
    <>
      <PageSeo
        schemas={[
          webPageJsonLd({
            title: pageTitle,
            description: pageDescription,
            path: "/blog",
            type: "CollectionPage",
          }),
          blogCollectionJsonLd(posts),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
          ]),
        ]}
      />
      <SiteLayout>
        <header
          className="page-top-navy bg-navy pb-14 text-white sm:pb-16 md:pb-20"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Breadcrumbs
              tone="dark"
              className="mb-6"
              items={[
                { name: "Home", path: "/" },
                { name: "Blog", path: "/blog" },
              ]}
            />
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/45">
              Blog
            </p>
            <h1 className="mt-5 max-w-3xl font-display text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl md:leading-[1.05]">
              Web, SEO & digital marketing insights
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
              Websites, SEO, and digital marketing — written the way we ship: clear, local, and
              useful.
            </p>
          </div>
        </header>

        <section className="py-12 sm:py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {posts.length === 0 ? (
              <p className="max-w-md text-muted">
                No articles yet. Check back soon, or add one from the admin panel.
              </p>
            ) : (
              <>
                {featured ? <BlogFeatured post={featured} /> : null}
                {rest.length > 0 ? (
                  <div className="mt-10 grid gap-6 sm:mt-12 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
                    {rest.map((post) => (
                      <BlogCard key={post.id} post={post} />
                    ))}
                  </div>
                ) : null}
              </>
            )}
          </div>
        </section>
      </SiteLayout>
    </>
  );
}
