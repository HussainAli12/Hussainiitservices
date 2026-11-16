"use client";

import { useChrome } from "@/components/providers/ChromeProvider";

import Link from "next/link";
import { m, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { BlogRecentLinks } from "@/components/layout/BlogRecentLinks";

interface BlogDropdownProps {
  open: boolean;
  onClose: () => void;
}

export function BlogDropdown({ open, onClose }: BlogDropdownProps) {
  const chrome = useChrome();
  return (
    <AnimatePresence>
      {open && (
        <m.div
          initial={{ opacity: 0, y: -6, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -4, scale: 0.98 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="absolute left-1/2 top-full z-50 mt-1 w-[min(94vw,720px)] -translate-x-1/2 origin-top overflow-hidden rounded-2xl border border-border/80 bg-white shadow-[0_24px_64px_rgba(15,39,68,0.14)]"
        >
          <div className="flex items-start justify-between gap-6 border-b border-border/70 px-6 py-5 sm:px-7">
            <div>
              <p className="text-base font-semibold text-foreground">{chrome.menus.blogTitle}</p>
              <p className="mt-1 text-sm text-muted">{chrome.menus.blogSubtitle}</p>
            </div>
            <Link
              href="/blog"
              onClick={onClose}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-accent/30 hover:text-accent"
            >
              {chrome.menus.viewAll}
              <ArrowUpRight size={14} aria-hidden />
            </Link>
          </div>

          <div className="px-4 py-4 sm:px-5 sm:py-5">
            <BlogRecentLinks enabled={open} onNavigate={onClose} showTopicsFallback />
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
