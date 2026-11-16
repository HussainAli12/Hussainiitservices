import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { BlogMarkdown } from "@/components/blog/BlogMarkdown";
import {
  PortfolioCaseStudy,
  type CaseStudySection,
} from "@/components/sections/portfolio/PortfolioCaseStudy";
import { PortfolioDeliverables } from "@/components/sections/portfolio/PortfolioDeliverables";
import { PortfolioGallery } from "@/components/sections/portfolio/PortfolioGallery";
import { PortfolioGridCard } from "@/components/sections/portfolio/PortfolioGridCard";
import { PortfolioCover, getPortfolioCoverProps } from "@/components/ui/PortfolioCover";
import { portfolioCoverAspectClass } from "@/lib/portfolio/cover";
import { resolvePortfolioCoverAlt } from "@/lib/seo/portfolio";
import { normalizeExternalUrl } from "@/lib/utils";
import type { DbPortfolio } from "@/lib/types/database";
import { cn } from "@/lib/utils";

interface PortfolioProjectProps {
  project: DbPortfolio;
  related: DbPortfolio[];
}

export function PortfolioProject({ project, related }: PortfolioProjectProps) {
  const liveUrl = normalizeExternalUrl(project.project_url);
  const coverAlt = resolvePortfolioCoverAlt(project);

  const caseStudySections: CaseStudySection[] = [
    project.challenge ? { title: "Challenge", body: project.challenge } : null,
    project.solution ? { title: "Solution", body: project.solution } : null,
    project.results ? { title: "Results", body: project.results } : null,
  ].filter((section): section is CaseStudySection => section !== null);

  return (
    <article>
      <header className="page-top-navy bg-navy pb-10 text-white sm:pb-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-white/55">
            <Link href="/" className="transition-colors hover:text-white">
              Home
            </Link>
            <span aria-hidden>/</span>
            <Link href="/portfolio" className="transition-colors hover:text-white">
              Portfolio
            </Link>
            <span aria-hidden>/</span>
            <span className="text-white/80">{project.title}</span>
          </nav>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">
              {project.category}
            </span>
            {project.client_name ? (
              <span className="text-sm text-white/55">{project.client_name}</span>
            ) : null}
          </div>

          <h1 className="mt-5 max-w-4xl font-display text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl md:leading-[1.08]">
            {project.title}
          </h1>

          <p className="mt-5 max-w-3xl text-base leading-relaxed text-white/70 sm:text-lg">
            {project.description}
          </p>

          {project.tech_stack.length > 0 ? (
            <div className="mt-6 flex flex-wrap gap-2">
              {project.tech_stack.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/75"
                >
                  {item}
                </span>
              ))}
            </div>
          ) : null}

          {liveUrl ? (
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-navy"
            >
              Visit live project
              <ExternalLink size={14} />
            </a>
          ) : null}
        </div>
      </header>

      <div className="border-b border-border bg-surface">
        <PortfolioCover
          {...getPortfolioCoverProps(project)}
          title={coverAlt}
          priority
          className={cn("mx-auto max-w-6xl", portfolioCoverAspectClass)}
        />
      </div>

      <PortfolioCaseStudy sections={caseStudySections} />
      <PortfolioDeliverables items={project.highlights} />

      {project.content.trim() ? (
        <section className="border-t border-border py-12 sm:py-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <BlogMarkdown content={project.content} />
          </div>
        </section>
      ) : null}

      <PortfolioGallery images={project.gallery} />

      {related.length > 0 ? (
        <section className="border-t border-border py-12 sm:py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">More projects</h2>
            <div className="mt-8 grid gap-6 sm:gap-8 md:grid-cols-2">
              {related.map((item) => (
                <PortfolioGridCard key={item.id} project={item} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </article>
  );
}
