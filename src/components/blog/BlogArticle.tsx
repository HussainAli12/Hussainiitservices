import Link from "next/link";
import type { DbBlog } from "@/lib/types/database";
import { formatBlogDate, getBlogDisplayDate, readingTimeMinutes } from "@/lib/blog/format";
import { blogCoverAspectClass } from "@/lib/blog/cover";
import { resolveBlogCoverAlt } from "@/lib/seo/blog";
import { BlogCard } from "@/components/blog/BlogCard";
import { BlogCoverImage } from "@/components/blog/BlogCoverImage";
import { BlogMarkdown } from "@/components/blog/BlogMarkdown";
import { companyInfo } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface BlogArticleProps {
  post: DbBlog;
  related: DbBlog[];
}

export function BlogArticle({ post, related }: BlogArticleProps) {
  const minutes = readingTimeMinutes(post.content);
  const displayDate = getBlogDisplayDate(post);

  return (
    <article>
      <header className="page-top-navy bg-navy pb-14 text-white sm:pb-16 md:pb-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-white/55">
            <Link href="/" className="transition-colors hover:text-white">
              Home
            </Link>
            <span aria-hidden>/</span>
            <Link href="/blog" className="transition-colors hover:text-white">
              Blog
            </Link>
            <span aria-hidden>/</span>
            <span className="text-white/80 line-clamp-1">{post.title}</span>
          </nav>
          <p className="mt-8 text-xs font-medium tracking-wide text-white/50">
            <time dateTime={displayDate}>{formatBlogDate(displayDate)}</time>
            {post.author ? ` · ${post.author}` : ""}
            {` · ${minutes} min read`}
          </p>
          <h1 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl md:leading-[1.1]">
            {post.title}
          </h1>
          {post.excerpt ? (
            <p className="mt-5 text-base leading-relaxed text-white/70 sm:text-lg">{post.excerpt}</p>
          ) : null}
        </div>
      </header>

      {post.cover_image_url ? (
        <div className="border-b border-border bg-surface">
          <BlogCoverImage
            src={post.cover_image_url}
            alt={resolveBlogCoverAlt(post)}
            sizes="(max-width: 1024px) 100vw, 1024px"
            priority
            className={cn("mx-auto max-w-5xl", blogCoverAspectClass)}
          />
        </div>
      ) : null}

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <BlogMarkdown content={post.content} />
      </div>

      {related.length > 0 ? (
        <section className="border-t border-border bg-surface py-14 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between gap-4 border-b border-border pb-6">
              <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
                More articles
              </h2>
              <Link href="/blog" className="text-sm font-semibold text-accent">
                View all
              </Link>
            </div>
            <div className="mt-10 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <BlogCard key={item.id} post={item} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="bg-navy py-14 text-white sm:py-16">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 sm:flex-row sm:items-end sm:justify-between sm:px-6 lg:px-8">
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
              Want this done for your business?
            </h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-white/65 sm:text-base">
              We build the websites, SEO, and campaigns we write about — from Ujjain and Dubai.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="inline-flex min-h-11 items-center justify-center rounded-md bg-white px-5 py-2.5 text-sm font-semibold text-navy transition-colors hover:bg-white/90"
            >
              Start a project
            </Link>
            <a
              href={`mailto:${companyInfo.email}`}
              className="inline-flex min-h-11 items-center justify-center rounded-md border border-white/20 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:border-white/45"
            >
              {companyInfo.email}
            </a>
          </div>
        </div>
      </section>
    </article>
  );
}
