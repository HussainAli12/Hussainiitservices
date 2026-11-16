import Link from "next/link";
import { PortfolioCover, getPortfolioCoverProps } from "@/components/ui/PortfolioCover";
import { resolvePortfolioCoverAlt } from "@/lib/seo/portfolio";
import type { DbPortfolio } from "@/lib/types/database";

interface PortfolioGridCardProps {
  project: DbPortfolio;
  /** Use "h3" when the card sits under a section H2 */
  headingLevel?: "h2" | "h3";
}

function cardSummary(project: DbPortfolio) {
  const description = project.description?.trim();
  if (description) return description;

  const meta = project.meta_description?.trim();
  if (meta) return meta;

  const challenge = project.challenge?.trim();
  if (challenge) return challenge;

  return "Open the project page for the full case study, deliverables, and gallery.";
}

export function PortfolioGridCard({ project, headingLevel = "h2" }: PortfolioGridCardProps) {
  const Heading = headingLevel;
  const summary = cardSummary(project);

  return (
    <article className="group premium-card flex h-full flex-col overflow-hidden rounded-2xl transition-transform duration-300 hover:-translate-y-1">
      <Link href={`/portfolio/${project.slug}`} className="flex h-full min-h-[430px] flex-col">
        <PortfolioCover
          {...getPortfolioCoverProps(project)}
          title={resolvePortfolioCoverAlt(project)}
          className="h-44 w-full shrink-0 border-b border-border sm:h-48"
        />

        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-accent">
              {project.category}
            </span>
            {project.client_name ? (
              <span className="text-xs text-muted">{project.client_name}</span>
            ) : null}
          </div>

          <Heading className="mt-2 line-clamp-2 font-display text-xl font-bold tracking-tight group-hover:text-accent sm:text-2xl">
            {project.title}
          </Heading>

          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted">{summary}</p>

          {project.tags.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {project.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="rounded-md border border-border px-2 py-0.5 text-[10px] text-muted"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}

          {project.highlights.length > 0 ? (
            <ul className="mt-4 space-y-1.5 border-t border-border/70 pt-4">
              {project.highlights.slice(0, 2).map((item) => (
                <li key={item} className="line-clamp-1 text-xs text-muted">
                  • {item}
                </li>
              ))}
            </ul>
          ) : null}

          <span className="mt-auto inline-flex pt-5 text-sm font-semibold text-accent">
            Read more →
          </span>
        </div>
      </Link>
    </article>
  );
}
