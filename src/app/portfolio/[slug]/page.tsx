import { notFound } from "next/navigation";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { PortfolioProject } from "@/components/sections/portfolio/PortfolioProject";
import { PageSeo } from "@/components/seo/PageSeo";
import { fetchPortfolioBySlug, fetchPortfolioSlugs, fetchRelatedPortfolio } from "@/lib/data/fetch";
import { createPageMetadata } from "@/lib/seo";
import {
  breadcrumbJsonLd,
  portfolioProjectJsonLd,
  webPageJsonLd,
} from "@/lib/seo/jsonld";
import {
  resolvePortfolioCoverAlt,
  resolvePortfolioKeywords,
  resolvePortfolioMetaDescription,
} from "@/lib/seo/portfolio";

export const revalidate = 120;

interface PortfolioProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PortfolioProjectPageProps) {
  const { slug } = await params;
  const project = await fetchPortfolioBySlug(slug);

  if (!project) {
    return createPageMetadata({
      title: "Project Not Found",
      description: "This portfolio project could not be found.",
      path: `/portfolio/${slug}`,
      noindex: true,
    });
  }

  return createPageMetadata({
    title: `${project.title} — Portfolio Case Study`,
    description: resolvePortfolioMetaDescription(project),
    path: `/portfolio/${project.slug}`,
    image: project.image_url || project.logo_url || undefined,
    imageAlt: resolvePortfolioCoverAlt(project),
    keywords: resolvePortfolioKeywords(project),
  });
}

export default async function PortfolioProjectPage({ params }: PortfolioProjectPageProps) {
  const { slug } = await params;
  const project = await fetchPortfolioBySlug(slug);
  if (!project) notFound();

  const related = await fetchRelatedPortfolio(project);

  return (
    <>
      <PageSeo
        schemas={[
          webPageJsonLd({
            title: project.title,
            description: resolvePortfolioMetaDescription(project),
            path: `/portfolio/${project.slug}`,
          }),
          portfolioProjectJsonLd(project),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Portfolio", path: "/portfolio" },
            { name: project.title, path: `/portfolio/${project.slug}` },
          ]),
        ]}
      />
      <SiteLayout>
        <PortfolioProject project={project} related={related} />
      </SiteLayout>
    </>
  );
}

export async function generateStaticParams() {
  const slugs = await fetchPortfolioSlugs();
  return slugs.map((slug) => ({ slug }));
}
