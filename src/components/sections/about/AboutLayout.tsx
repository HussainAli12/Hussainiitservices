"use client";

import { cn } from "@/lib/utils";

interface AboutSectionShellProps {
  children: React.ReactNode;
  id?: string;
  borderedTop?: boolean;
  className?: string;
}

export function AboutSectionShell({
  children,
  id,
  borderedTop,
  className,
}: AboutSectionShellProps) {
  return (
    <section
      id={id}
      className={cn(
        "relative py-14 sm:py-20 md:py-24",
        borderedTop && "border-t border-border",
        className,
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  );
}

interface AboutSectionContentProps {
  primaryText: string;
  secondaryText: string;
  actions?: React.ReactNode;
  badge?: string;
  title?: string;
  className?: string;
}

export function AboutSectionContent({
  primaryText,
  secondaryText,
  actions,
  badge,
  title,
  className,
}: AboutSectionContentProps) {
  return (
    <div className={cn("flex h-full flex-col", className)}>
      {badge && (
        <span className="section-badge mb-5 inline-block w-fit sm:mb-6">{badge}</span>
      )}
      {title && (
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {title}
        </h2>
      )}
      <p
        className={cn(
          "text-base leading-relaxed text-foreground sm:text-lg",
          title ? "mt-4 sm:mt-5" : "mt-0",
        )}
      >
        {primaryText}
      </p>
      <p className="mt-4 text-sm leading-relaxed text-muted sm:text-base">{secondaryText}</p>
      {actions && <div className="mt-8 sm:mt-10">{actions}</div>}
    </div>
  );
}

export const aboutProcessSteps = [
  { step: "01", title: "Research", desc: "We analyze your business, audience, and competitors." },
  { step: "02", title: "Strategy", desc: "A tailored plan aligned with your growth goals." },
  { step: "03", title: "Execution", desc: "Expert delivery with transparent communication." },
  { step: "04", title: "Growth", desc: "Ongoing optimization for lasting results." },
] as const;

export function AboutProcessGrid({ compact = false }: { compact?: boolean }) {
  return (
    <div className={cn("grid grid-cols-2 gap-3 sm:gap-4", compact && "gap-3")}>
      {aboutProcessSteps.map((item) => (
        <div
          key={item.step}
          className={cn(
            "flex h-full flex-col rounded-xl border border-border bg-card p-4 sm:rounded-2xl sm:p-5",
            compact && "p-3.5 sm:p-4",
          )}
        >
          <span className="text-lg font-bold text-accent/35 sm:text-xl">{item.step}</span>
          <h3 className="mt-2 text-sm font-semibold text-foreground">{item.title}</h3>
          <p className="mt-1.5 flex-1 text-xs leading-relaxed text-muted">{item.desc}</p>
        </div>
      ))}
    </div>
  );
}

export function AboutProcessTimeline() {
  return (
    <ol className="relative space-y-0">
      {aboutProcessSteps.map((item, index) => (
        <li key={item.step} className="relative flex gap-5 pb-8 last:pb-0 sm:gap-6">
          {index < aboutProcessSteps.length - 1 && (
            <span
              aria-hidden
              className="absolute left-2.75 top-7 bottom-0 w-px bg-border sm:left-3.25"
            />
          )}

          <div className="relative z-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-accent bg-white text-[10px] font-bold text-accent sm:h-7 sm:w-7 sm:text-[11px]">
            {item.step}
          </div>

          <div className="min-w-0 pt-0.5">
            <h3 className="text-sm font-semibold text-foreground sm:text-base">{item.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">{item.desc}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
