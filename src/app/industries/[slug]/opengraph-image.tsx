import { ogContentType, ogSize, renderOgCard } from "@/lib/og/card";
import { getIndustryPage } from "@/lib/seo/industries";
import { industryPages } from "@/lib/seo/industries";

export const alt = "Industry solutions — Hussaini IT Services";
export const size = ogSize;
export const contentType = ogContentType;

/** Prerender one card per page at build time */
export function generateStaticParams() {
  return industryPages.map((industry) => ({ slug: industry.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const industry = getIndustryPage(slug);
  return renderOgCard({
    eyebrow: industry ? `Industry · ${industry.name}` : "Industries",
    title: industry?.headline ?? "Industries we serve",
  });
}
