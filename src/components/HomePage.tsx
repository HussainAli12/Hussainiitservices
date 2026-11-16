import { SiteLayout } from "@/components/layout/SiteLayout";
import { Hero, type HeroStat } from "@/components/sections/Hero";
import { TrustedBy } from "@/components/sections/TrustedBy";
import { WhyChooseUs, type TrackStat } from "@/components/sections/WhyChooseUs";
import { Technologies } from "@/components/sections/Technologies";
import { HomeAboutPreview } from "@/components/sections/home/HomeAboutPreview";
import { HomeServicesPreview } from "@/components/sections/home/HomeServicesPreview";
import { HomePortfolioPreview } from "@/components/sections/home/HomePortfolioPreview";
import { HomeTestimonialsPreview } from "@/components/sections/home/HomeTestimonialsPreview";
import { FaqSection } from "@/components/sections/FaqSection";
import type { FaqItem } from "@/components/ui/FaqAccordion";
import type { TrustedClient } from "@/lib/portfolio/clients";
import type { DbPortfolio, DbTestimonial } from "@/lib/types/database";

interface HomePageProps {
  portfolio: DbPortfolio[];
  clients: TrustedClient[];
  testimonials: DbTestimonial[];
  heroStats: HeroStat[];
  trackRecord: TrackStat[];
  faqs: FaqItem[];
}

export function HomePage({ portfolio, clients, testimonials, heroStats, trackRecord, faqs }: HomePageProps) {
  return (
    <SiteLayout>
      <Hero stats={heroStats} />
      <TrustedBy clients={clients} />
      <HomeAboutPreview />
      <HomeServicesPreview />
      <WhyChooseUs trackRecord={trackRecord} />
      <HomePortfolioPreview items={portfolio} />
      <Technologies />
      <HomeTestimonialsPreview items={testimonials} />
      <FaqSection
        title="Questions we hear first"
        subtitle="Short answers about who we are, where we work, and how a project starts."
        items={faqs}
      />
    </SiteLayout>
  );
}
