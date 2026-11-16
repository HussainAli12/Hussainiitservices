"use client";

import Link from "next/link";
import { m } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { PortfolioCover, getPortfolioCoverProps } from "@/components/ui/PortfolioCover";
import { resolvePortfolioCoverAlt } from "@/lib/seo/portfolio";
import { normalizeExternalUrl } from "@/lib/utils";
import type { DbPortfolio } from "@/lib/types/database";

interface PortfolioCardProps {
  project: DbPortfolio;
}

export function PortfolioCard({ project }: PortfolioCardProps) {
  const liveUrl = normalizeExternalUrl(project.project_url);
  const coverAlt = resolvePortfolioCoverAlt(project);

  return (
    <m.article
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 280, damping: 22 }}
      className="group premium-card flex h-full flex-col overflow-hidden rounded-xl"
    >
      <Link href={`/portfolio/${project.slug}`} className="group/card flex flex-1 flex-col">
        <PortfolioCover
          {...getPortfolioCoverProps(project)}
          title={coverAlt}
          className="h-32 sm:h-36"
        />

        <div className="flex flex-1 flex-col p-4 sm:p-5">
          <span className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-accent">
            {project.category}
          </span>
          <h3 className="mb-1.5 font-display text-base font-bold leading-snug transition-colors group-hover/card:text-accent sm:text-[1.05rem]">
            {project.title}
          </h3>
          <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-muted sm:text-sm">
            {project.description}
          </p>

          {project.tags?.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-1">
              {project.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="rounded-md border border-border px-1.5 py-0.5 text-[10px] text-muted"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <span className="mt-auto inline-flex items-center gap-1.5 text-xs font-semibold text-accent">
            View project →
          </span>
        </div>
      </Link>

      {liveUrl ? (
        <div className="border-t border-border px-4 py-2 sm:px-5">
          <a
            href={liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[11px] font-medium text-muted hover:text-accent"
            aria-label={`Visit ${project.title} website`}
          >
            Live site
            <ExternalLink size={11} />
          </a>
        </div>
      ) : null}
    </m.article>
  );
}
