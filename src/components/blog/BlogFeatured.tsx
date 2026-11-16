import Link from "next/link";
import type { DbBlog } from "@/lib/types/database";
import { blogExcerpt, formatBlogDate, getBlogDisplayDate, readingTimeMinutes } from "@/lib/blog/format";
import { blogCoverAspectClass } from "@/lib/blog/cover";
import { resolveBlogCoverAlt } from "@/lib/seo/blog";
import { BlogCoverImage } from "@/components/blog/BlogCoverImage";

export function BlogFeatured({ post }: { post: DbBlog }) {
  const displayDate = getBlogDisplayDate(post);

  return (
    <article className="group premium-card overflow-hidden rounded-2xl transition-transform duration-300 hover:-translate-y-1">
      <Link href={`/blog/${post.slug}`} className="flex flex-col">
        {post.cover_image_url ? (
          <BlogCoverImage
            src={post.cover_image_url}
            alt={resolveBlogCoverAlt(post)}
            sizes="(max-width: 1280px) 100vw, 1280px"
            priority
            className={blogCoverAspectClass}
          />
        ) : (
          <div className={`${blogCoverAspectClass} bg-navy`} />
        )}
        <div className="flex flex-col p-6 sm:p-8 lg:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Latest</p>
          <p className="mt-3 text-xs font-medium tracking-wide text-muted">
            <time dateTime={displayDate}>{formatBlogDate(displayDate)}</time>
            {post.author ? ` · ${post.author}` : ""}
            {` · ${readingTimeMinutes(post.content)} min read`}
          </p>
          <h2 className="mt-3 max-w-4xl font-display text-2xl font-bold tracking-tight group-hover:text-accent sm:text-3xl lg:text-4xl">
            {post.title}
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted sm:text-base">
            {blogExcerpt(post, 220)}
          </p>
          <span className="mt-6 inline-block text-sm font-semibold text-accent">Read article →</span>
        </div>
      </Link>
    </article>
  );
}
