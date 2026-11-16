import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  name: string;
  path: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
  /** "dark" for navy headers */
  tone?: "light" | "dark";
  align?: "left" | "center";
}

/** Visible breadcrumb trail — pair with breadcrumbJsonLd(items) for the schema version */
export function Breadcrumbs({ items, className, tone = "light", align = "left" }: BreadcrumbsProps) {
  const dark = tone === "dark";
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        "mb-8 flex flex-wrap items-center gap-1.5 text-sm",
        dark ? "text-white/60" : "text-muted",
        align === "center" && "justify-center",
        className,
      )}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <span key={item.path} className="inline-flex items-center gap-1.5">
            {index > 0 && <ChevronRight size={14} aria-hidden />}
            {isLast ? (
              <span className={cn("font-medium", dark ? "text-white/90" : "text-foreground")} aria-current="page">
                {item.name}
              </span>
            ) : (
              <Link href={item.path} className={cn("transition-colors", dark ? "hover:text-white" : "hover:text-accent")}>
                {item.name}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
