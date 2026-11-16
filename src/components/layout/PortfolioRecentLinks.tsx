"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Briefcase, Loader2 } from "lucide-react";
import { portfolioWorkTypes } from "@/lib/constants";

export interface RecentPortfolioProject {
  title: string;
  slug: string;
  category: string;
  description: string;
  cover_image_url: string | null;
}

interface PortfolioRecentLinksProps {
  enabled: boolean;
  onNavigate?: () => void;
  showWorkTypesFallback?: boolean;
}

function PortfolioThumbnail({
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
      <Briefcase size={18} aria-hidden />
      <span className="sr-only">{title}</span>
    </div>
  );
}

function PortfolioWorkTypesGrid({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {portfolioWorkTypes.map((item) => (
        <Link
          key={item.label}
          href="/portfolio"
          onClick={onNavigate}
          className="group relative overflow-hidden rounded-xl border border-border/80 bg-surface/30 p-4 transition-all duration-300 hover:border-accent/25 hover:bg-white hover:shadow-[0_8px_24px_rgba(29,78,216,0.08)]"
        >
          <span
            aria-hidden
            className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-accent transition-transform duration-300 group-hover:scale-x-100"
          />
          <div className="icon-box h-10 w-10">
            <item.icon size={18} />
          </div>
          <p className="mt-4 text-sm font-semibold text-foreground group-hover:text-accent">
            {item.label}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-muted">{item.tagline}</p>
        </Link>
      ))}
    </div>
  );
}

export function PortfolioRecentLinks({
  enabled,
  onNavigate,
  showWorkTypesFallback = false,
}: PortfolioRecentLinksProps) {
  const [projects, setProjects] = useState<RecentPortfolioProject[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!enabled || loaded) return;

    let cancelled = false;

    fetch("/api/portfolio/recent")
      .then((res) => (res.ok ? res.json() : []))
      .then((data: RecentPortfolioProject[]) => {
        if (!cancelled) {
          setProjects(Array.isArray(data) ? data : []);
          setLoaded(true);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setProjects([]);
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
        Loading projects…
      </div>
    );
  }

  if (projects.length === 0) {
    return showWorkTypesFallback ? <PortfolioWorkTypesGrid onNavigate={onNavigate} /> : null;
  }

  return (
    <ul className="space-y-2.5">
      {projects.map((project) => (
        <li key={project.slug}>
          <Link
            href={`/portfolio/${project.slug}`}
            onClick={onNavigate}
            className="group relative flex items-start gap-3.5 overflow-hidden rounded-xl border border-border/80 bg-surface/30 p-3.5 transition-all duration-300 hover:border-accent/25 hover:bg-white hover:shadow-[0_8px_24px_rgba(29,78,216,0.08)] sm:gap-4 sm:p-4"
          >
            <span
              aria-hidden
              className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-accent transition-transform duration-300 group-hover:scale-x-100"
            />
            <PortfolioThumbnail title={project.title} coverImageUrl={project.cover_image_url} />
            <div className="min-w-0 flex-1 py-0.5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-accent">
                {project.category}
              </p>
              <p className="mt-1 line-clamp-2 text-sm font-semibold leading-snug text-foreground group-hover:text-accent">
                {project.title}
              </p>
              {project.description ? (
                <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted">
                  {project.description}
                </p>
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
