import { ogContentType, ogSize, renderOgCard, renderOgImageOnly } from "@/lib/og/card";
import { formatBlogDate, getBlogDisplayDate } from "@/lib/blog/format";
import { fetchBlogBySlug, fetchBlogs } from "@/lib/data/fetch";

export const alt = "Article from the Hussaini IT Services blog";
export const size = ogSize;
export const contentType = ogContentType;
export const revalidate = 3600;

/** Prerender one card per page at build time */
export async function generateStaticParams() {
  return (await fetchBlogs()).map((post) => ({ slug: post.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await fetchBlogBySlug(slug);
  // Covers are designed social graphics already — use them as-is rather than overlaying text.
  if (post?.cover_image_url) return renderOgImageOnly(post.cover_image_url);
  return renderOgCard({
    eyebrow: "Blog",
    title: post?.title ?? "Hussaini IT Services blog",
    footer: post ? `${post.author || "Hussaini IT Services"} · ${formatBlogDate(getBlogDisplayDate(post))}` : undefined,
  });
}
