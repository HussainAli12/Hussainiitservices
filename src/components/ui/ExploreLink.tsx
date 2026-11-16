"use client";

import Link from "next/link";
import { m } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExploreLinkProps {
  href: string;
  label: string;
  className?: string;
}

export function ExploreLink({ href, label, className }: ExploreLinkProps) {
  return (
    <m.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ x: 4 }}
      className="inline-flex"
    >
      <Link
        href={href}
        className={cn(
          "group inline-flex items-center gap-2 text-sm font-semibold text-accent transition-colors hover:text-navy",
          className
        )}
      >
        {label}
        <ArrowRight
          size={16}
          className="transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1.5"
        />
      </Link>
    </m.div>
  );
}
