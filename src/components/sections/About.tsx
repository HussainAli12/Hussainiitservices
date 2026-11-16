"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import {
  AboutProcessGrid,
  AboutSectionContent,
  AboutSectionShell,
} from "@/components/sections/about/AboutLayout";

export function About() {
  return (
    <AboutSectionShell id="about">
      <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16 xl:gap-20">
        <RevealOnScroll direction="right">
          <AboutSectionContent
            badge="Our Story"
            title="Built for businesses that want to grow online"
            primaryText="Hussaini IT Services is a digital solutions studio focused on four core areas: digital online presence (websites, SEO, and Google Business Profile), custom software development (CRM, SaaS, and ERP), Google Ads and social media management, and AI voice calling agents. We partner with startups and enterprises to build technology that drives real business growth."
            secondaryText="From industrial B2B brands to ecommerce stores and hospitality businesses, we combine technical excellence with strategic marketing to deliver solutions that perform — on time, on budget, and with uncompromising quality."
            actions={
              <Link
                href="/services"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-border bg-white px-6 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-accent/30 hover:bg-surface"
              >
                Our Services
                <ArrowRight size={16} aria-hidden />
              </Link>
            }
            className="max-w-none"
          />
        </RevealOnScroll>

        <RevealOnScroll direction="left" delay={0.12}>
          <div className="lg:pt-8">
            <p className="mb-4 text-sm font-semibold text-foreground sm:mb-5">How we work</p>
            <AboutProcessGrid />
          </div>
        </RevealOnScroll>
      </div>
    </AboutSectionShell>
  );
}
