"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { m } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  getTestimonialBentoVariant,
  TestimonialBentoCard,
  type TestimonialBentoVariant,
} from "@/components/sections/testimonials/TestimonialBentoCard";
import type { DbTestimonial } from "@/lib/types/database";
import "./TestimonialsBentoGrid.css";

const itemLayoutClasses: Record<TestimonialBentoVariant, string> = {
  default: "",
  "feature-a": "testimonials-bento-item--feature-a",
  "feature-b": "testimonials-bento-item--feature-b",
  wide: "testimonials-bento-item--wide",
};
const MOBILE_BREAKPOINT = 768;
const SPOTLIGHT_RADIUS = 280;

interface TestimonialsBentoGridProps {
  items: DbTestimonial[];
}

function updateCardGlow(
  card: HTMLElement,
  mouseX: number,
  mouseY: number,
  intensity: number,
) {
  const rect = card.getBoundingClientRect();
  const relativeX = ((mouseX - rect.left) / rect.width) * 100;
  const relativeY = ((mouseY - rect.top) / rect.height) * 100;
  card.style.setProperty("--glow-x", `${relativeX}%`);
  card.style.setProperty("--glow-y", `${relativeY}%`);
  card.style.setProperty("--glow-intensity", intensity.toString());
}

export function TestimonialsBentoGrid({ items }: TestimonialsBentoGridProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const [disableEffects, setDisableEffects] = useState(false);

  useEffect(() => {
    const checkMobile = () => setDisableEffects(window.innerWidth <= MOBILE_BREAKPOINT);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (disableEffects || !sectionRef.current || !gridRef.current || !spotlightRef.current) {
        return;
      }

      const sectionRect = sectionRef.current.getBoundingClientRect();
      const insideSection =
        event.clientX >= sectionRect.left &&
        event.clientX <= sectionRect.right &&
        event.clientY >= sectionRect.top &&
        event.clientY <= sectionRect.bottom;

      const cards = gridRef.current.querySelectorAll<HTMLElement>(".magic-bento-card");

      if (!insideSection) {
        spotlightRef.current.classList.remove("is-active");
        cards.forEach((card) => card.style.setProperty("--glow-intensity", "0"));
        return;
      }

      spotlightRef.current.classList.add("is-active");
      gsap.to(spotlightRef.current, {
        left: event.clientX,
        top: event.clientY,
        duration: 0.12,
        ease: "power2.out",
      });

      const proximity = SPOTLIGHT_RADIUS * 0.5;
      const fadeDistance = SPOTLIGHT_RADIUS * 0.75;

      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const distance =
          Math.hypot(event.clientX - centerX, event.clientY - centerY) -
          Math.max(rect.width, rect.height) / 2;
        const effectiveDistance = Math.max(0, distance);

        let intensity = 0;
        if (effectiveDistance <= proximity) {
          intensity = 1;
        } else if (effectiveDistance <= fadeDistance) {
          intensity = (fadeDistance - effectiveDistance) / (fadeDistance - proximity);
        }

        updateCardGlow(card, event.clientX, event.clientY, intensity);
      });
    },
    [disableEffects],
  );

  const handleMouseLeave = useCallback(() => {
    if (!gridRef.current || !spotlightRef.current) return;
    spotlightRef.current.classList.remove("is-active");
    gridRef.current.querySelectorAll<HTMLElement>(".magic-bento-card").forEach((card) => {
      card.style.setProperty("--glow-intensity", "0");
    });
  }, []);

  useEffect(() => {
    if (disableEffects) return;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [disableEffects, handleMouseMove, handleMouseLeave]);

  if (!items.length) {
    return (
      <p className="py-20 text-center text-muted">No testimonials yet. Check back soon.</p>
    );
  }

  return (
    <section ref={sectionRef} className="testimonials-bento-section">
      {!disableEffects && (
        <div ref={spotlightRef} className="testimonials-bento-spotlight" aria-hidden />
      )}

      <div ref={gridRef} className="testimonials-bento-grid">
        {items.map((testimonial, index) => {
          const variant = getTestimonialBentoVariant(index);
          return (
            <m.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-5%" }}
              transition={{ duration: 0.55, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
              className={cn("min-h-0", itemLayoutClasses[variant])}
            >
              <TestimonialBentoCard testimonial={testimonial} variant={variant} />
            </m.div>
          );
        })}
      </div>
    </section>
  );
}
