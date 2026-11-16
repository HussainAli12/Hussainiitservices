"use client";

import { useRef } from "react";
import { m, useMotionValue, useSpring, useTransform } from "framer-motion";
import Link from "next/link";
import { featuredServices } from "@/lib/constants";
import { useMotionBudget } from "@/components/providers/MotionBudgetProvider";
import { canUseHeavyEffects } from "@/lib/motion-budget";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ExploreLink } from "@/components/ui/ExploreLink";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { DecorativeText } from "@/components/ui/DecorativeText";

function ServicePreviewCard({
  service,
  index,
  enableTilt,
}: {
  service: (typeof featuredServices)[0];
  index: number;
  enableTilt: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 260, damping: 24 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 260, damping: 24 });

  const handleMouse = (e: React.MouseEvent) => {
    if (!enableTilt) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <RevealOnScroll delay={index * 0.1}>
      <m.div
        ref={ref}
        onMouseMove={handleMouse}
        onMouseLeave={reset}
        style={enableTilt ? { rotateX, rotateY, transformPerspective: 1000 } : undefined}
        className="group premium-card h-full overflow-hidden rounded-2xl"
        whileHover={enableTilt ? { y: -8 } : undefined}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
      >
        <Link href={service.href} className="flex h-full flex-col p-6">
          <div className="mb-5 flex items-start justify-between gap-3">
            <div className="icon-box h-12 w-12">
              <service.icon size={22} strokeWidth={1.75} />
            </div>
            <DecorativeText
              text={String(index + 1).padStart(2, "0")}
              className="font-display text-sm font-semibold tabular-nums tracking-wide text-accent/35"
            />
          </div>
          <h3 className="mb-2 font-display text-lg font-bold">{service.title}</h3>
          <p className="line-clamp-3 text-sm leading-relaxed text-muted">{service.description}</p>
        </Link>
      </m.div>
    </RevealOnScroll>
  );
}

export function HomeServicesPreview() {
  const budget = useMotionBudget();
  const enableTilt = canUseHeavyEffects(budget);

  return (
    <section className="relative border-t border-border bg-surface py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Services"
          title="What We Offer"
          subtitle="Four focused service pillars — digital presence, custom software, Google Ads and social media, and AI voice agents — built to grow your business online."
        />

        <div className="grid gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
          {featuredServices.map((service, i) => (
            <ServicePreviewCard key={service.title} service={service} index={i} enableTilt={enableTilt} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <ExploreLink href="/services" label="Explore all services" />
        </div>
      </div>
    </section>
  );
}
