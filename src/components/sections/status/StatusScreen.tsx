import type { ReactNode } from "react";
import Link from "next/link";

export interface StatusLink {
  href: string;
  label: string;
  hint: string;
}

export const publicRecoveryLinks: StatusLink[] = [
  { href: "/", label: "Home", hint: "Start from the beginning" },
  { href: "/services", label: "Services", hint: "Web, SEO, and digital marketing" },
  { href: "/best-it-services/ujjain", label: "IT services in Ujjain", hint: "Our India office" },
  { href: "/careers", label: "Careers", hint: "Open roles in Ujjain" },
  { href: "/contact", label: "Contact", hint: "Talk to the team" },
];

interface StatusScreenProps {
  code: string;
  title: string;
  description: string;
  actions: ReactNode;
  links?: StatusLink[];
  detail?: string;
}

export function StatusScreen({
  code,
  title,
  description,
  actions,
  links = publicRecoveryLinks,
  detail,
}: StatusScreenProps) {
  return (
    <section className="min-h-[70vh] bg-navy text-white">
      <div className="page-top-navy mx-auto max-w-7xl px-4 pb-16 sm:px-6 sm:pb-20 md:pb-24 lg:px-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/70">
          Error {code}
        </p>
        <h1 className="mt-5 max-w-3xl font-display text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl md:leading-[1.05]">
          {title}
        </h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
          {description}
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-3">{actions}</div>
        {detail ? (
          <p className="mt-6 font-mono text-xs text-white/35">{detail}</p>
        ) : null}
      </div>

      {links.length > 0 ? (
        <div className="border-t border-white/10">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
              Useful pages
            </p>
            <ul className="mt-6 divide-y divide-white/10 border-t border-white/10">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group flex items-baseline justify-between gap-6 py-5"
                  >
                    <span className="font-display text-lg font-bold group-hover:text-white/80">
                      {link.label}
                    </span>
                    <span className="text-sm text-white/70 group-hover:text-white">{link.hint}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </section>
  );
}

export function statusPrimaryClassName() {
  return "inline-flex min-h-11 items-center justify-center rounded-md bg-white px-5 py-2.5 text-sm font-semibold text-navy transition-colors hover:bg-white/90";
}

export function statusSecondaryClassName() {
  return "inline-flex min-h-11 items-center justify-center rounded-md border border-white/20 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:border-white/45";
}
