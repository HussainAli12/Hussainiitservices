import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export interface LinkCardItem {
  href: string;
  title: string;
  description?: string;
}

/** Simple grid of linked cards used on hubs, industries and listings */
export function LinkCardGrid({ items, columns = 3 }: { items: LinkCardItem[]; columns?: 2 | 3 | 4 }) {
  const cols = { 2: "sm:grid-cols-2", 3: "sm:grid-cols-2 lg:grid-cols-3", 4: "sm:grid-cols-2 lg:grid-cols-4" }[columns];
  return (
    <ul className={`grid gap-3 ${cols}`}>
      {items.map((item) => (
        <li key={item.href}>
          <Link href={item.href} className="premium-card group flex h-full items-start justify-between gap-3 rounded-xl px-5 py-4">
            <span>
              <span className="block text-sm font-semibold text-foreground group-hover:text-accent">{item.title}</span>
              {item.description && <span className="mt-1 block text-sm leading-relaxed text-muted">{item.description}</span>}
            </span>
            <ArrowUpRight size={14} className="mt-1 shrink-0 text-accent" aria-hidden />
          </Link>
        </li>
      ))}
    </ul>
  );
}
