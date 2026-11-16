"use client";

import { useChrome } from "@/components/providers/ChromeProvider";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { m, useReducedMotion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { allServices, companyInfo } from "@/lib/constants";
import { Logo } from "@/components/ui/Logo";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  WhatsAppIcon,
} from "@/components/ui/SocialIcons";
import { cn } from "@/lib/utils";

const pageLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Industries", href: "/industries" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "Pricing", href: "/pricing" },
  { label: "Free Website Audit", href: "/free-website-audit" },
  { label: "FAQ", href: "/faq" },
  { label: "Blog", href: "/blog" },
  { label: "Testimonials", href: "/testimonials" },
  { label: "Careers", href: "/careers" },
  { label: "Contact", href: "/contact" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms-and-conditions" },
];

const socialLinks = [
  { label: "LinkedIn", href: companyInfo.socials.linkedin, Icon: LinkedInIcon },
  { label: "Instagram", href: companyInfo.socials.instagram, Icon: InstagramIcon },
  { label: "Facebook", href: companyInfo.socials.facebook, Icon: FacebookIcon },
  { label: "WhatsApp", href: companyInfo.socials.whatsapp, Icon: WhatsAppIcon },
];

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-sm text-slate-400 transition-colors hover:text-white"
    >
      {children}
    </Link>
  );
}

function FooterBrandMark() {
  const reduceMotion = useReducedMotion();

  return (
    <div
      aria-hidden
      className="relative mx-auto mt-2 h-[clamp(5rem,18vw,11rem)] max-w-7xl overflow-hidden px-4 sm:px-6 lg:px-8"
    >
      <m.div
        initial={reduceMotion ? false : { y: 48, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, margin: "-5%" }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="pointer-events-none absolute inset-x-4 bottom-0 select-none sm:inset-x-6 lg:inset-x-8"
      >
        <p
          className="text-center text-[clamp(2.75rem,11.5vw,8.5rem)] font-bold uppercase leading-[0.85] tracking-[-0.045em]"
          style={{
            background: "linear-gradient(180deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.05) 45%, rgba(255,255,255,0) 100%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          Hussaini IT Services
        </p>
      </m.div>
    </div>
  );
}

export function Footer() {
  const pathname = usePathname();
  const chrome = useChrome();
  const label = (link: { label: string; href: string }) => chrome.pageLabels[link.href] ?? link.label;
  const localHref = (href: string) => (href === "/" ? chrome.homeHref : href === "/services" ? chrome.servicesHref : href);
  const showCta = pathname !== "/contact";

  return (
    <footer className="bg-black text-white">
      <div className="mx-3 pt-6 sm:mx-5 sm:pt-8 lg:mx-8">
        <div className="rounded-t-[1.75rem] bg-[#141414] px-5 py-12 sm:rounded-t-[2rem] sm:px-8 sm:py-14 lg:px-14 lg:py-16">
          {showCta && (
            <div className="mb-10 grid gap-8 border-b border-white/10 pb-10 lg:grid-cols-[minmax(0,1.3fr)_auto] lg:items-end lg:gap-12">
              <div>
                <h2 className="max-w-xl text-2xl font-bold tracking-tight sm:text-3xl">
                  {chrome.footer.ctaTitle}
                </h2>
                <p className="mt-3 max-w-lg text-sm leading-relaxed text-slate-400 sm:text-base">
                  {chrome.footer.ctaText}
                </p>
              </div>
              <div className="flex flex-row flex-wrap items-center gap-3">
                <Link
                  href="/contact"
                  className="inline-flex min-h-11 items-center justify-center rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-light"
                >
                  {chrome.footer.schedule}
                </Link>
                <Link
                  href="/portfolio"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/15 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:border-white/30 hover:bg-white/5"
                >
                  {chrome.footer.explore}
                  <ArrowRight size={16} aria-hidden />
                </Link>
              </div>
            </div>
          )}

          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,24rem)] lg:items-start lg:gap-16">
            <div>
              <Logo
                size="sm"
                className="[&_.text-slate-600]:text-slate-400 [&_span]:text-white"
              />
              <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-400">
                {chrome.footer.tagline}
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-2">
                {socialLinks.map(({ label, href, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className={cn(
                      "inline-flex h-9 w-9 items-center justify-center rounded-md",
                      "bg-white/5 text-slate-400 transition-colors hover:bg-white/10 hover:text-white",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-3 text-sm font-semibold text-white">{chrome.footer.contact}</p>
              <ul className="space-y-2.5 text-sm text-slate-400">
                <li>
                  <a
                    href={`mailto:${companyInfo.email}`}
                    className="whitespace-nowrap transition-colors hover:text-white"
                  >
                    {companyInfo.email}
                  </a>
                </li>
                {companyInfo.phones.map((phone) => (
                  <li key={phone.href}>
                    <a
                      href={phone.href}
                      className="whitespace-nowrap transition-colors hover:text-white"
                    >
                      {phone.display}
                      <span className="text-slate-400"> · {phone.label}</span>
                    </a>
                  </li>
                ))}
                {companyInfo.locations.map((location) => (
                  <li key={location} className="whitespace-nowrap">
                    {location}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-12 grid gap-10 border-t border-white/10 pt-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-3">
              <p className="mb-4 text-sm font-semibold text-white">{chrome.footer.pages}</p>
              <ul className="space-y-2.5">
                {pageLinks.map((link) => (
                  <li key={link.href}>
                    <FooterLink href={localHref(link.href)}>{label(link)}</FooterLink>
                  </li>
                ))}
              </ul>
            </div>

            <div className="sm:col-span-2 lg:col-span-7">
              <p className="mb-4 text-sm font-semibold text-white">{chrome.footer.services}</p>
              <ul className="grid grid-cols-1 gap-x-8 gap-y-2.5 sm:grid-cols-2 lg:grid-cols-3">
                <li>
                  <FooterLink href={chrome.servicesHref}>{chrome.footer.allServices}</FooterLink>
                </li>
                {allServices.map((service) => (
                  <li key={service.slug}>
                    <FooterLink href={service.href}>{chrome.serviceNames[service.slug] ?? service.title}</FooterLink>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-2">
              <p className="mb-4 text-sm font-semibold text-white">{chrome.footer.legal}</p>
              <ul className="space-y-2.5">
                {legalLinks.map((link) => (
                  <li key={link.href}>
                    <FooterLink href={localHref(link.href)}>{label(link)}</FooterLink>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <details className="group mt-12 border-t border-white/10 pt-8">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-white [&::-webkit-details-marker]:hidden">
              <span>{chrome.footer.bestIt}</span>
              <ChevronDown
                size={18}
                className="shrink-0 text-slate-400 transition-transform duration-200 group-open:rotate-180"
                aria-hidden
              />
            </summary>
            <p className="mt-3 max-w-2xl text-sm text-slate-400">
              {chrome.footer.bestItIntro}
            </p>
            <ul className="mt-5 grid grid-cols-1 gap-x-8 gap-y-2.5 sm:grid-cols-2 lg:grid-cols-4">
              <li>
                <FooterLink href="/best-it-services">{chrome.footer.allCities}</FooterLink>
              </li>
              {chrome.hubLinks.map((hub) => (
                <li key={hub.href}>
                  <FooterLink href={hub.href}>{hub.label}</FooterLink>
                </li>
              ))}
              {chrome.cityLinks.map((city) => (
                <li key={city.href}>
                  <FooterLink href={city.href}>{city.label}</FooterLink>
                </li>
              ))}
            </ul>
          </details>
        </div>
      </div>

      <FooterBrandMark />

      <p className="pb-6 pt-2 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} {companyInfo.name}. {chrome.footer.rights}
      </p>
    </footer>
  );
}
