"use client";

import Image from "next/image";
import Link from "next/link";
import { founders, type Founder } from "@/lib/constants";
import { LinkedInIcon } from "@/components/ui/SocialIcons";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { AboutSectionShell } from "@/components/sections/about/AboutLayout";
import { cn } from "@/lib/utils";

function FounderProfile({
  founder,
  index,
}: {
  founder: Founder;
  index: number;
}) {
  const imageFirst = index % 2 === 0;

  return (
    <RevealOnScroll delay={index * 0.1}>
      <article
        className={cn(
          "grid items-center gap-8 sm:gap-10 lg:grid-cols-12 lg:gap-12",
          !imageFirst && "lg:[&>*:first-child]:order-2 lg:[&>*:last-child]:order-1",
        )}
      >
        <div className="lg:col-span-5">
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-border bg-surface shadow-sm sm:max-w-md">
            <Image
              src={founder.image}
              alt={founder.name}
              fill
              sizes="(max-width: 1024px) 100vw, 420px"
              className="object-cover"
              priority={index === 0}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/25 to-transparent"
            />
            <div className="absolute bottom-4 left-4 right-4">
              <p className="text-lg font-bold text-white">{founder.name}</p>
              <p className="text-sm text-white/85">{founder.role}</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          <span className="text-xs font-semibold uppercase tracking-wider text-accent">
            {founder.role}
          </span>
          <h3 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {founder.name}
          </h3>
          <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg sm:leading-8">
            {founder.bio}
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {founder.focus.map((item) => (
              <span
                key={item}
                className="rounded-full border border-border bg-white px-3 py-1.5 text-xs font-medium text-muted"
              >
                {item}
              </span>
            ))}
          </div>

          {founder.linkedin && (
            <Link
              href={founder.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-accent transition-colors hover:text-accent/80"
            >
              <LinkedInIcon className="h-4 w-4" />
              Connect on LinkedIn
            </Link>
          )}
        </div>
      </article>
    </RevealOnScroll>
  );
}

export function FoundersSection() {
  return (
    <AboutSectionShell borderedTop className="bg-surface/40">
      <SectionHeader
        badge="Leadership"
        title="Meet Our Founders"
        subtitle="The team behind Hussaini IT Services — combining technical depth with business focus to deliver digital products that perform."
        align="left"
        className="mb-12 sm:mb-16"
      />

      <div className="space-y-14 sm:space-y-16 md:space-y-20">
        {founders.map((founder, index) => (
          <FounderProfile key={founder.name} founder={founder} index={index} />
        ))}
      </div>
    </AboutSectionShell>
  );
}
