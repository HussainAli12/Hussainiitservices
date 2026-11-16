"use client";

import { TestimonialCard } from "@/components/ui/TestimonialCard";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import type { DbTestimonial } from "@/lib/types/database";

interface TestimonialsListProps {
  items: DbTestimonial[];
}

export function TestimonialsList({ items }: TestimonialsListProps) {
  if (!items.length) {
    return (
      <p className="py-20 text-center text-muted">No testimonials yet. Check back soon.</p>
    );
  }

  return (
    <div className="space-y-14 sm:space-y-20">
      {items.map((testimonial, index) => (
        <RevealOnScroll key={testimonial.id} delay={Math.min(index * 0.06, 0.3)}>
          <article className="mx-auto max-w-4xl">
            <header className="mb-5 flex flex-wrap items-end justify-between gap-3 border-b border-border pb-4 sm:mb-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-accent">
                  Client story {String(index + 1).padStart(2, "0")}
                </p>
                <h2 className="mt-1 text-lg font-bold text-foreground sm:text-xl">
                  {testimonial.company}
                </h2>
                <p className="mt-0.5 text-sm text-muted">
                  {testimonial.name}
                  {testimonial.role ? ` · ${testimonial.role}` : ""}
                  {testimonial.location ? ` · ${testimonial.location}` : ""}
                </p>
              </div>
              {testimonial.website_url && (
                <a
                  href={testimonial.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-accent hover:text-navy"
                >
                  Visit website
                </a>
              )}
            </header>

            <TestimonialCard testimonial={testimonial} />
          </article>
        </RevealOnScroll>
      ))}
    </div>
  );
}
