import { NextResponse } from "next/server";
import { fetchBlogs } from "@/lib/data/fetch";

export const revalidate = 120;

export async function GET() {
  const posts = await fetchBlogs();
  const recent = posts.slice(0, 4).map((post) => ({
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    cover_image_url: post.cover_image_url,
  }));

  return NextResponse.json(recent);
}
