import { NextResponse } from "next/server";
import { fetchRecentPortfolio } from "@/lib/data/fetch";
import { getPortfolioCoverUrl } from "@/lib/portfolio/cover-url";

export const revalidate = 120;

export async function GET() {
  const projects = await fetchRecentPortfolio(4);
  const recent = projects.map((project) => ({
    title: project.title,
    slug: project.slug,
    category: project.category,
    description: project.description,
    cover_image_url: getPortfolioCoverUrl(project),
  }));

  return NextResponse.json(recent);
}
