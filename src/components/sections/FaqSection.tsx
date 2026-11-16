import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { FaqItem } from "@/components/ui/FaqAccordion";

interface FaqSectionProps {
  title?: string;
  subtitle?: string;
  items: FaqItem[];
  /** Small label above the heading */
  badge?: string;
}

export function FaqSection({
  title = "Frequently Asked Questions",
  subtitle = "Quick answers about our services, process, and how we work with clients.",
  items,
  badge = "FAQ",
}: FaqSectionProps) {
  return (
    <section className="border-t border-border bg-surface py-12 sm:py-16 md:py-24" aria-labelledby="faq-heading">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge={badge}
          title={title}
          subtitle={subtitle}
          headingId="faq-heading"
          className="mb-10 sm:mb-12"
        />
        <FaqAccordion items={items} />
      </div>
    </section>
  );
}
