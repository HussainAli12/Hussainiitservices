"use client";

import { m } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { featuredServices } from "@/lib/constants";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { DecorativeText } from "@/components/ui/DecorativeText";

function ServiceCard({
  service,
  index,
}: {
  service: (typeof featuredServices)[0];
  index: number;
}) {
  return (
    <RevealOnScroll delay={index * 0.12} className="h-full">
      <m.div
        className="group premium-card relative flex h-full flex-col overflow-hidden rounded-2xl p-6 sm:p-8"
        whileHover={{ y: -6 }}
        transition={{ type: "spring", stiffness: 320, damping: 24 }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        />

        <DecorativeText
          text={String(index + 1).padStart(2, "0")}
          className="pointer-events-none absolute right-5 top-5 font-display text-5xl font-bold leading-none text-accent/[0.07] sm:right-6 sm:top-6"
        />

        <div className="icon-box mb-5 h-12 w-12 shrink-0 sm:mb-6 sm:h-14 sm:w-14">
          <service.icon size={24} />
        </div>

        <h3 className="mb-3 pr-10 font-display text-lg font-bold sm:text-xl">{service.title}</h3>

        <div className="flex flex-1 flex-col">
          <p className="text-sm leading-relaxed text-muted sm:text-base">{service.description}</p>

          <div className="mt-5 flex flex-wrap gap-2">
            {service.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-border bg-surface px-3 py-1 text-[11px] font-medium text-muted transition-colors duration-300 group-hover:border-accent/20 group-hover:text-foreground sm:text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-6 border-t border-border pt-5 sm:mt-8">
          <m.a
            href={service.href}
            className="inline-flex items-center gap-2 text-sm font-semibold text-accent"
            whileHover={{ x: 3 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            Learn More
            <ArrowUpRight
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </m.a>
        </div>
      </m.div>
    </RevealOnScroll>
  );
}

export function Services() {
  return (
    <section id="services" className="relative py-16 sm:py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Services"
          title="Featured Services"
          subtitle="Our four core offerings — digital online presence, custom software development, Google Ads and social media, and AI voice calling agents."
        />

        <div className="grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2 sm:gap-6 lg:gap-8">
          {featuredServices.map((service, i) => (
            <ServiceCard key={service.title} service={service} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
