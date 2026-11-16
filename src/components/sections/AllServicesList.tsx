"use client";

import Link from "next/link";
import { allServices } from "@/lib/constants";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

export function AllServicesList() {
  return (
    <div className="flex flex-wrap justify-center gap-4">
      {allServices.map((service, i) => (
        <RevealOnScroll
          key={service.title}
          delay={i * 0.05}
          className="w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.667rem)]"
        >
          <Link
            href={service.href}
            className="premium-card flex h-full items-start gap-4 rounded-xl p-6 transition-colors hover:border-accent/25"
          >
            <div className="icon-box h-12 w-12 shrink-0">
              <service.icon size={22} />
            </div>
            <div>
              <h3 className="mb-1 font-display font-semibold">{service.title}</h3>
              <p className="text-sm text-muted">
                Professional {service.title.toLowerCase()} for businesses in the UAE and India.
              </p>
            </div>
          </Link>
        </RevealOnScroll>
      ))}
    </div>
  );
}
