import Link from "next/link";
import type { DbBlog } from "@/lib/types/database";
import { blogExcerpt, formatBlogDate, getBlogDisplayDate, readingTimeMinutes } from "@/lib/blog/format";
import { blogCoverAspectClass } from "@/lib/blog/cover";
import { resolveBlogCoverAlt } from "@/lib/seo/blog";
import { BlogCoverImage } from "@/components/blog/BlogCoverImage";

interface BlogCardProps {
  post: DbBlog;
  /** Use "h3" when the card sits under a section H2 */
  headingLevel?: "h2" | "h3";
}

export function BlogCard({ post, headingLevel = "h2" }: BlogCardProps) {
  const Heading = headingLevel;
  const displayDate = getBlogDisplayDate(post);

  return (
    <article className="group premium-card h-full overflow-hidden rounded-2xl transition-transform duration-300 hover:-translate-y-1">
      <Link href={`/blog/${post.slug}`} className="flex h-full flex-col">
        {post.cover_image_url ? (
          <BlogCoverImage
            src={post.cover_image_url}
            alt={resolveBlogCoverAlt(post)}
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={blogCoverAspectClass}
          />
        ) : (
          <div className={`${blogCoverAspectClass} bg-navy`} />
        )}
        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <p className="text-xs font-medium tracking-wide text-muted">
            <time dateTime={displayDate}>{formatBlogDate(displayDate)}</time>
            {post.author ? ` · ${post.author}` : ""}
            {` · ${readingTimeMinutes(post.content)} min read`}
          </p>
          <Heading className="mt-2 font-display text-xl font-bold tracking-tight group-hover:text-accent sm:text-2xl">
            {post.title}
          </Heading>
          <p className="mt-3 flex-1 text-sm leading-relaxed text-muted sm:text-base">
            {blogExcerpt(post)}
          </p>
          <span className="mt-5 text-sm font-semibold text-accent">Read article →</span>
        </div>
      </Link>
    </article>
  );
}
