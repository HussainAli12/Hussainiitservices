"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, BookOpen, Loader2 } from "lucide-react";
import { blogTopics } from "@/lib/constants";

export interface RecentBlogPost {
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image_url: string | null;
}

interface BlogRecentLinksProps {
  enabled: boolean;
  onNavigate?: () => void;
  showTopicsFallback?: boolean;
}

function BlogThumbnail({
  title,
  coverImageUrl,
}: {
  title: string;
  coverImageUrl: string | null;
}) {
  if (coverImageUrl) {
    return (
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-border/80 bg-surface sm:h-16 sm:w-16">
        <Image
          src={coverImageUrl}
          alt={title}
          fill
          sizes="64px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          unoptimized={coverImageUrl.endsWith(".svg")}
        />
      </div>
    );
  }

  return (
    <div className="icon-box h-14 w-14 shrink-0 rounded-xl sm:h-16 sm:w-16">
      <BookOpen size={18} aria-hidden />
      <span className="sr-only">{title}</span>
    </div>
  );
}

function BlogTopicsGrid({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {blogTopics.map((topic) => (
        <Link
          key={topic.slug}
          href="/blog"
          onClick={onNavigate}
          className="group relative overflow-hidden rounded-xl border border-border/80 bg-surface/30 p-4 transition-all duration-300 hover:border-accent/25 hover:bg-white hover:shadow-[0_8px_24px_rgba(29,78,216,0.08)]"
        >
          <span
            aria-hidden
            className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-accent transition-transform duration-300 group-hover:scale-x-100"
          />
          <div className="icon-box h-10 w-10">
            <topic.icon size={18} />
          </div>
          <p className="mt-4 text-sm font-semibold text-foreground group-hover:text-accent">
            {topic.label}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-muted">{topic.tagline}</p>
        </Link>
      ))}
    </div>
  );
}

export function BlogRecentLinks({
  enabled,
  onNavigate,
  showTopicsFallback = false,
}: BlogRecentLinksProps) {
  const [posts, setPosts] = useState<RecentBlogPost[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!enabled || loaded) return;

    let cancelled = false;

    fetch("/api/blog/recent")
      .then((res) => (res.ok ? res.json() : []))
      .then((data: RecentBlogPost[]) => {
        if (!cancelled) {
          setPosts(Array.isArray(data) ? data : []);
          setLoaded(true);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setPosts([]);
          setLoaded(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [enabled, loaded]);

  // Fetch runs once the dropdown is enabled; show the skeleton until it resolves.
  const loading = enabled && !loaded;
  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-border/80 bg-surface/40 py-10 text-sm text-muted">
        <Loader2 size={16} className="animate-spin text-accent" aria-hidden />
        Loading articles…
      </div>
    );
  }

  if (posts.length === 0) {
    return showTopicsFallback ? <BlogTopicsGrid onNavigate={onNavigate} /> : null;
  }

  return (
    <ul className="space-y-2.5">
      {posts.map((post) => (
        <li key={post.slug}>
          <Link
            href={`/blog/${post.slug}`}
            onClick={onNavigate}
            className="group relative flex items-start gap-3.5 overflow-hidden rounded-xl border border-border/80 bg-surface/30 p-3.5 transition-all duration-300 hover:border-accent/25 hover:bg-white hover:shadow-[0_8px_24px_rgba(29,78,216,0.08)] sm:gap-4 sm:p-4"
          >
            <span
              aria-hidden
              className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-accent transition-transform duration-300 group-hover:scale-x-100"
            />
            <BlogThumbnail title={post.title} coverImageUrl={post.cover_image_url} />
            <div className="min-w-0 flex-1 py-0.5">
              <p className="line-clamp-2 text-sm font-semibold leading-snug text-foreground group-hover:text-accent">
                {post.title}
              </p>
              {post.excerpt ? (
                <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted">{post.excerpt}</p>
              ) : null}
            </div>
            <ArrowUpRight
              size={15}
              className="mt-1 shrink-0 text-muted opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
              aria-hidden
            />
          </Link>
        </li>
      ))}
    </ul>
  );
}
