import type { DbBlog } from "@/lib/types/database";

export function formatBlogDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** Public blog date — always the original publish/create time, never updated_at */
export function getBlogDisplayDate(post: Pick<DbBlog, "created_at">) {
  return post.created_at;
}

export function readingTimeMinutes(content: string) {
  const words = stripMarkdown(content).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export function stripMarkdown(value: string) {
  return value
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!\[[^\]]*\]\([^)]+\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/[*_~>#-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function blogExcerpt(post: Pick<DbBlog, "excerpt" | "content">, max = 170) {
  const text = stripMarkdown(post.excerpt || post.content);
  if (text.length <= max) return text;
  return `${text.slice(0, max).trim()}…`;
}
