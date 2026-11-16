"use client";

import { m } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { whyChooseUs } from "@/lib/constants";
import { CountUp } from "@/components/ui/CountUp";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { cn } from "@/lib/utils";
import { DecorativeText } from "@/components/ui/DecorativeText";

export interface TrackStat {
  value: number;
  suffix: string;
  label: string;
}

interface WhyChooseUsProps {
  trackRecord: TrackStat[];
}

const ease = [0.16, 1, 0.3, 1] as const;

function WhyFeatureCard({
  item,
  index,
}: {
  item: (typeof whyChooseUs)[0];
  index: number;
}) {
  return (
    <RevealOnScroll delay={index * 0.08}>
      <m.div
        whileHover={{ y: -4 }}
        transition={{ type: "spring", stiffness: 320, damping: 26 }}
        className="group relative h-full overflow-hidden rounded-2xl border border-border bg-card p-5 sm:p-6"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/45 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
        <DecorativeText
          text={String(index + 1).padStart(2, "0")}
          className="pointer-events-none absolute right-4 top-4 text-4xl font-bold leading-none text-accent/[0.07] sm:right-5 sm:top-5"
        />

        <div className="icon-box mb-4 h-11 w-11 sm:mb-5 sm:h-12 sm:w-12">
          <item.icon size={20} />
        </div>
        <h3 className="mb-2 pr-8 text-base font-semibold text-foreground sm:text-lg">
          {item.title}
        </h3>
        <p className="text-sm leading-relaxed text-muted">{item.description}</p>
      </m.div>
    </RevealOnScroll>
  );
}

export function WhyChooseUs({ trackRecord }: WhyChooseUsProps) {
  return (
    <section id="why-us" className="relative border-t border-border bg-surface/50 py-16 sm:py-24 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-14 xl:gap-16">
          <RevealOnScroll className="lg:col-span-4 xl:col-span-5">
            <div className="lg:sticky lg:top-28">
              <span className="section-badge mb-5 inline-block sm:mb-6">Why Us</span>
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-[2.35rem] lg:leading-tight">
                Grow Your Business with Our Agency
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted sm:mt-5 sm:text-lg">
                We combine technical excellence with business acumen to deliver solutions that
                drive real results.
              </p>
              <Link
                href="/about"
                className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-accent transition-colors hover:text-navy"
              >
                Learn more about us
                <ArrowUpRight size={16} />
              </Link>
            </div>
          </RevealOnScroll>

          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-8 xl:col-span-7">
            {whyChooseUs.map((item, i) => (
              <WhyFeatureCard key={item.title} item={item} index={i} />
            ))}
          </div>
        </div>

        <RevealOnScroll delay={0.15}>
          <div className="mt-12 overflow-hidden rounded-2xl border border-border bg-card shadow-sm sm:mt-16">
            <div className="border-b border-border px-6 py-5 sm:px-8 sm:py-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-accent">
                Track record
              </p>
              <h3 className="mt-1 text-xl font-bold text-foreground sm:text-2xl">
                Results that speak for themselves
              </h3>
            </div>

            <div className="grid grid-cols-2 divide-border md:grid-cols-4 md:divide-x">
              {trackRecord.map((stat, i) => (
                <m.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.5, ease }}
                  className={cn(
                    "px-5 py-6 text-center sm:px-8 sm:py-8 md:text-left",
                    i % 2 === 0 && "border-r border-border md:border-r-0",
                    i < 2 && "border-b border-border md:border-b-0",
                  )}
                >
                  <div className="text-3xl font-bold text-accent sm:text-4xl md:text-[2.5rem] md:leading-none">
                    <CountUp end={stat.value} suffix={stat.suffix} />
                  </div>
                  <p className="mt-2 text-xs font-medium uppercase tracking-wide text-muted sm:text-sm">
                    {stat.label}
                  </p>
                </m.div>
              ))}
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
