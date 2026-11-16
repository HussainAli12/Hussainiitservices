import { notFound } from "next/navigation";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { PageSeo } from "@/components/seo/PageSeo";
import { BlogArticle } from "@/components/blog/BlogArticle";
import { fetchBlogBySlug, fetchBlogs } from "@/lib/data/fetch";
import { createPageMetadata } from "@/lib/seo";
import { resolveBlogKeywords, resolveBlogMetaDescription } from "@/lib/seo/blog";
import { blogPostingJsonLd, breadcrumbJsonLd, webPageJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 120;

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await fetchBlogBySlug(slug);
  if (!post) {
    return createPageMetadata({
      title: "Blog Post Not Found",
      description: "This blog post could not be found.",
      path: `/blog/${slug}`,
      noindex: true,
    });
  }

  return createPageMetadata({
    title: post.title,
    description: resolveBlogMetaDescription(post),
    path: `/blog/${post.slug}`,
    type: "article",
    generatedImage: true,
    publishedTime: post.published_at,
    modifiedTime: post.updated_at || post.published_at,
    authors: [post.author || "Hussaini IT Services"],
    keywords: resolveBlogKeywords(post),
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await fetchBlogBySlug(slug);
  if (!post) notFound();

  const related = (await fetchBlogs()).filter((item) => item.id !== post.id).slice(0, 3);

  return (
    <>
      <PageSeo
        schemas={[
          webPageJsonLd({
            title: post.title,
            description: resolveBlogMetaDescription(post),
            path: `/blog/${post.slug}`,
          }),
          blogPostingJsonLd(post),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: post.title, path: `/blog/${post.slug}` },
          ]),
        ]}
      />
      <SiteLayout>
        <BlogArticle post={post} related={related} />
      </SiteLayout>
    </>
  );
}

export async function generateStaticParams() {
  const posts = await fetchBlogs();
  return posts.map((post) => ({ slug: post.slug }));
}
