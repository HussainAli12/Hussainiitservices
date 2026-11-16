import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { ExploreLink } from "@/components/ui/ExploreLink";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { AboutProcessTimeline } from "@/components/sections/about/AboutLayout";
import { companyInfo } from "@/lib/constants";

export function HomeAboutPreview() {
  return (
    <section className="relative border-t border-border bg-surface/40 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-14 xl:gap-16">
          <RevealOnScroll direction="right" className="lg:col-span-5">
            <span className="section-badge mb-5 inline-block sm:mb-6">About Us</span>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Who We Are
            </h2>

            <p className="mt-5 text-base leading-relaxed text-foreground sm:text-lg">
              A premium digital studio focused on digital presence, custom software, paid ads, and AI —
              partnering with startups and enterprises to build technology that drives real growth.
            </p>

            <p className="mt-4 border-l-2 border-accent/30 pl-5 text-sm leading-relaxed text-muted sm:text-base">
              From websites and SEO to CRM platforms, Google Ads campaigns, and AI voice agents, we
              combine technical excellence with strategic marketing — on time, on budget, and with
              uncompromising quality.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {companyInfo.locations.map((location) => {
                const href = location.startsWith("Ujjain")
                  ? "/best-it-services/ujjain"
                  : "/best-it-services/dubai";
                return (
                  <Link
                    key={location}
                    href={href}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-accent/30 hover:text-foreground"
                  >
                    <MapPin size={12} className="shrink-0 text-accent" aria-hidden />
                    {location}
                  </Link>
                );
              })}
            </div>

            <div className="mt-8 sm:mt-10">
              <ExploreLink href="/about" label="Read more about us" />
            </div>
          </RevealOnScroll>

          <RevealOnScroll direction="left" delay={0.12} className="lg:col-span-7">
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
              <div className="border-b border-border bg-surface/70 px-6 py-5 sm:px-8">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-accent">
                      Our approach
                    </p>
                    <p className="mt-1 text-sm text-muted">
                      How we take your project from idea to measurable growth
                    </p>
                  </div>
                  <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-border bg-white p-2 sm:flex">
                    <Image
                      src="/logo.svg"
                      alt="Hussaini IT Services logo"
                      width={32}
                      height={32}
                      className="h-full w-full object-contain"
                    />
                  </div>
                </div>
              </div>

              <div className="px-6 py-6 sm:px-8 sm:py-8">
                <AboutProcessTimeline />
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
