import type { DbPortfolio } from "@/lib/types/database";
import { getPortfolioTag } from "@/lib/seo/portfolio-tags";

export interface TrustedClient {
  id: string;
  name: string;
  logoUrl: string;
  href: string;
  category: string;
  title: string;
  summary: string;
  highlight: string | null;
  services: string[];
}

/** Unique client logos from published portfolio projects. */
export function getTrustedClients(projects: DbPortfolio[]): TrustedClient[] {
  const seen = new Set<string>();
  const clients: TrustedClient[] = [];

  for (const project of projects) {
    const logoUrl = project.logo_url?.trim();
    if (!logoUrl || seen.has(logoUrl)) continue;

    seen.add(logoUrl);
    const name = project.client_name?.trim() || project.title;
    const tags = (project.tags ?? []).map((tag) => tag.trim()).filter(Boolean);
    const services = (tags.length > 0 ? tags : [project.category]).slice(0, 4);
    const highlight = (project.highlights ?? []).map((item) => item.trim()).find(Boolean) ?? null;

    clients.push({
      id: project.id,
      name,
      logoUrl,
      href: `/portfolio/${project.slug}`,
      category: project.category,
      title: project.title,
      summary: project.description.trim(),
      highlight,
      services,
    });
  }

  return clients;
}

/**
 * Trusted-by logos ordered for a page: projects matching the service / industry / country first,
 * then everyone else so the marquee stays full. Uses tags from portfolio-tags.ts.
 */
export function getRelevantTrustedClients(
  projects: DbPortfolio[],
  match: { service?: string; industry?: string; country?: string } = {},
): TrustedClient[] {
  const score = (project: DbPortfolio) => {
    const tag = getPortfolioTag(project);
    if (!tag) return 0;
    return (
      (match.service && tag.services.includes(match.service) ? 4 : 0) +
      (match.industry && tag.industries.includes(match.industry) ? 4 : 0) +
      (match.country && tag.country === match.country ? 2 : 0)
    );
  };

  const ordered = projects
    .map((project, index) => ({ project, index, score: score(project) }))
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map((entry) => entry.project);

  return getTrustedClients(ordered);
}
