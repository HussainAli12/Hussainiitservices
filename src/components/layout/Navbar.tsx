"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { m, AnimatePresence } from "framer-motion";
import { ArrowUpRight, ChevronDown, Menu, Phone, X } from "lucide-react";
import { companyInfo, featuredServices } from "@/lib/constants";
import { useMotionBudget } from "@/components/providers/MotionBudgetProvider";
import { canUseHeavyEffects } from "@/lib/motion-budget";
import { Logo } from "@/components/ui/Logo";
import { ServicesDropdown } from "@/components/layout/ServicesDropdown";
import { BlogDropdown } from "@/components/layout/BlogDropdown";
import { BlogRecentLinks } from "@/components/layout/BlogRecentLinks";
import { PortfolioDropdown } from "@/components/layout/PortfolioDropdown";
import { PortfolioRecentLinks } from "@/components/layout/PortfolioRecentLinks";
import { cn } from "@/lib/utils";
import { useChrome } from "@/components/providers/ChromeProvider";
import { promoBannerNavPaddingClass, promoBannerNavTopClass } from "@/lib/site-header";


function NavItem({
  href,
  label,
  active,
  onClick,
}: {
  href: string;
  label: string;
  active: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "group relative px-3 py-2 text-sm font-medium transition-colors",
        active ? "text-foreground" : "text-slate-600 hover:text-foreground",
      )}
    >
      {label}
      <span
        className={cn(
          "absolute bottom-0.5 left-3 right-3 h-0.5 origin-left rounded-full bg-accent transition-transform duration-300",
          active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
        )}
      />
    </Link>
  );
}

interface NavbarProps {
  promoOffset?: boolean;
}

export function Navbar({ promoOffset = false }: NavbarProps) {
  const pathname = usePathname();
  const chrome = useChrome();
  const leadingNavLinks = [{ label: chrome.nav.home, href: chrome.homeHref }];
  const trailingNavLinks = [{ label: chrome.nav.testimonials, href: "/testimonials" }];
  const budget = useMotionBudget();
  const heavyEffects = canUseHeavyEffects(budget);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [portfolioOpen, setPortfolioOpen] = useState(false);
  const [blogOpen, setBlogOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [mobilePortfolioOpen, setMobilePortfolioOpen] = useState(false);
  const [mobileBlogOpen, setMobileBlogOpen] = useState(false);
  const servicesRef = useRef<HTMLDivElement>(null);
  const portfolioRef = useRef<HTMLDivElement>(null);
  const blogRef = useRef<HTMLDivElement>(null);
  const closeServicesTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closePortfolioTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeBlogTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isHome = pathname === "/";
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
  const isServicesActive = pathname === "/services" || pathname.startsWith("/services/");
  const isPortfolioActive = pathname === "/portfolio" || pathname.startsWith("/portfolio/");
  const isBlogActive = pathname === "/blog" || pathname.startsWith("/blog/");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  // Close every menu when the route changes (state adjusted during render, not in an effect)
  const [menuPath, setMenuPath] = useState(pathname);
  if (menuPath !== pathname) {
    setMenuPath(pathname);
    setMobileOpen(false);
    setServicesOpen(false);
    setPortfolioOpen(false);
    setBlogOpen(false);
    setMobileServicesOpen(false);
    setMobilePortfolioOpen(false);
    setMobileBlogOpen(false);
  }

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as Node;
      if (servicesRef.current && !servicesRef.current.contains(target)) {
        setServicesOpen(false);
      }
      if (portfolioRef.current && !portfolioRef.current.contains(target)) {
        setPortfolioOpen(false);
      }
      if (blogRef.current && !blogRef.current.contains(target)) {
        setBlogOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    return () => {
      if (closeServicesTimerRef.current) clearTimeout(closeServicesTimerRef.current);
      if (closePortfolioTimerRef.current) clearTimeout(closePortfolioTimerRef.current);
      if (closeBlogTimerRef.current) clearTimeout(closeBlogTimerRef.current);
    };
  }, []);

  const openServices = () => {
    if (closeServicesTimerRef.current) clearTimeout(closeServicesTimerRef.current);
    setServicesOpen(true);
  };

  const closeServicesSoon = () => {
    closeServicesTimerRef.current = setTimeout(() => setServicesOpen(false), 140);
  };

  const openPortfolio = () => {
    if (closePortfolioTimerRef.current) clearTimeout(closePortfolioTimerRef.current);
    setPortfolioOpen(true);
  };

  const closePortfolioSoon = () => {
    closePortfolioTimerRef.current = setTimeout(() => setPortfolioOpen(false), 140);
  };

  const openBlog = () => {
    if (closeBlogTimerRef.current) clearTimeout(closeBlogTimerRef.current);
    setBlogOpen(true);
  };

  const closeBlogSoon = () => {
    closeBlogTimerRef.current = setTimeout(() => setBlogOpen(false), 140);
  };

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 z-50 px-3 transition-all duration-300 sm:px-4",
          promoOffset ? promoBannerNavTopClass : "top-0",
          promoOffset ? promoBannerNavPaddingClass : scrolled ? "pt-2 sm:pt-3" : "pt-3 sm:pt-4",
        )}
      >
        <nav
          aria-label="Main navigation"
          className={cn(
            "mx-auto flex h-[3.75rem] max-w-7xl items-center gap-4 rounded-2xl border px-4 transition-all duration-300 sm:h-16 sm:px-5 lg:px-6",
            scrolled || !isHome
              ? heavyEffects
                ? "border-border/80 bg-white/95 shadow-[0_10px_40px_rgba(15,39,68,0.08)] backdrop-blur-xl"
                : "border-border/80 bg-white/98 shadow-[0_10px_40px_rgba(15,39,68,0.08)]"
              : heavyEffects
                ? "border-border/50 bg-white/80 shadow-[0_4px_24px_rgba(15,39,68,0.04)] backdrop-blur-lg"
                : "border-border/50 bg-white/95 shadow-[0_4px_24px_rgba(15,39,68,0.04)]",
          )}
        >
          <Link href={chrome.homeHref} className="shrink-0" aria-label="Hussaini IT Services home">
            <Logo size="sm" />
          </Link>

          <div className="hidden h-full flex-1 items-center justify-center lg:flex">
            <div className="flex h-full items-center">
              {leadingNavLinks.map((link) => (
                <NavItem
                  key={link.href}
                  href={link.href}
                  label={link.label}
                  active={isActive(link.href)}
                />
              ))}

              <div
                ref={servicesRef}
                className="relative flex items-center self-stretch"
                onMouseEnter={openServices}
                onMouseLeave={closeServicesSoon}
                onFocusCapture={openServices}
                onBlurCapture={(event) => {
                  const next = event.relatedTarget as Node | null;
                  if (!next || !servicesRef.current?.contains(next)) {
                    closeServicesSoon();
                  }
                }}
              >
                <Link
                  href={chrome.servicesHref}
                  className={cn(
                    "group relative flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors",
                    isServicesActive || servicesOpen
                      ? "text-foreground"
                      : "text-slate-600 hover:text-foreground",
                  )}
                >
                  {chrome.nav.services}
                  <ChevronDown
                    size={14}
                    className={cn("transition-transform duration-200", servicesOpen && "rotate-180")}
                  />
                  <span
                    className={cn(
                      "absolute bottom-0.5 left-3 right-3 h-0.5 origin-left rounded-full bg-accent transition-transform duration-300",
                      isServicesActive || servicesOpen
                        ? "scale-x-100"
                        : "scale-x-0 group-hover:scale-x-100",
                    )}
                  />
                </Link>
                <ServicesDropdown open={servicesOpen} onClose={() => setServicesOpen(false)} />
              </div>

              <div
                ref={portfolioRef}
                className="relative flex items-center self-stretch"
                onMouseEnter={openPortfolio}
                onMouseLeave={closePortfolioSoon}
                onFocusCapture={openPortfolio}
                onBlurCapture={(event) => {
                  const next = event.relatedTarget as Node | null;
                  if (!next || !portfolioRef.current?.contains(next)) {
                    closePortfolioSoon();
                  }
                }}
              >
                <Link
                  href="/portfolio"
                  className={cn(
                    "group relative flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors",
                    isPortfolioActive || portfolioOpen
                      ? "text-foreground"
                      : "text-slate-600 hover:text-foreground",
                  )}
                >
                  {chrome.nav.portfolio}
                  <ChevronDown
                    size={14}
                    className={cn("transition-transform duration-200", portfolioOpen && "rotate-180")}
                  />
                  <span
                    className={cn(
                      "absolute bottom-0.5 left-3 right-3 h-0.5 origin-left rounded-full bg-accent transition-transform duration-300",
                      isPortfolioActive || portfolioOpen
                        ? "scale-x-100"
                        : "scale-x-0 group-hover:scale-x-100",
                    )}
                  />
                </Link>
                <PortfolioDropdown open={portfolioOpen} onClose={() => setPortfolioOpen(false)} />
              </div>

              <div
                ref={blogRef}
                className="relative flex items-center self-stretch"
                onMouseEnter={openBlog}
                onMouseLeave={closeBlogSoon}
                onFocusCapture={openBlog}
                onBlurCapture={(event) => {
                  const next = event.relatedTarget as Node | null;
                  if (!next || !blogRef.current?.contains(next)) {
                    closeBlogSoon();
                  }
                }}
              >
                <Link
                  href="/blog"
                  className={cn(
                    "group relative flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors",
                    isBlogActive || blogOpen
                      ? "text-foreground"
                      : "text-slate-600 hover:text-foreground",
                  )}
                >
                  {chrome.nav.blog}
                  <ChevronDown
                    size={14}
                    className={cn("transition-transform duration-200", blogOpen && "rotate-180")}
                  />
                  <span
                    className={cn(
                      "absolute bottom-0.5 left-3 right-3 h-0.5 origin-left rounded-full bg-accent transition-transform duration-300",
                      isBlogActive || blogOpen
                        ? "scale-x-100"
                        : "scale-x-0 group-hover:scale-x-100",
                    )}
                  />
                </Link>
                <BlogDropdown open={blogOpen} onClose={() => setBlogOpen(false)} />
              </div>

              {trailingNavLinks.map((link) => (
                <NavItem
                  key={link.href}
                  href={link.href}
                  label={link.label}
                  active={isActive(link.href)}
                />
              ))}
            </div>
          </div>

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <a
              href={companyInfo.phones[0].href}
              className="hidden items-center gap-2 rounded-full border border-border px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:border-accent/25 hover:text-foreground xl:inline-flex"
            >
              <Phone size={14} className="text-accent" aria-hidden />
              {companyInfo.phones[0].display}
            </a>

            <Link
              href="/contact"
              className="hidden items-center gap-1.5 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy sm:inline-flex"
            >
              {chrome.nav.getInTouch}
              <ArrowUpRight size={15} aria-hidden />
            </Link>

            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border text-foreground transition-colors hover:bg-surface lg:hidden"
              onClick={() => setMobileOpen((open) => !open)}
              aria-label={mobileOpen ? chrome.nav.closeMenu : chrome.nav.openMenu}
              aria-expanded={mobileOpen}
              aria-controls="mobile-navigation"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <m.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-navy/30 backdrop-blur-[2px] lg:hidden"
              aria-label={chrome.nav.closeMenu}
              onClick={() => setMobileOpen(false)}
            />

            <m.aside
              id="mobile-navigation"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 360, damping: 34 }}
              className="fixed inset-y-0 right-0 z-50 flex w-full max-w-[min(100%,24rem)] flex-col bg-white lg:hidden"
            >
              <div className="flex items-center justify-between border-b border-border px-5 py-4">
                <Logo size="sm" />
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border"
                  aria-label={chrome.nav.closeMenu}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-5">
                <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-wider text-muted">
                  {chrome.nav.menu}
                </p>
                <div className="space-y-0.5">
                  {leadingNavLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-center justify-between rounded-xl px-3 py-3 text-[15px] font-medium transition-colors",
                        isActive(link.href)
                          ? "bg-surface text-accent"
                          : "text-foreground hover:bg-surface",
                      )}
                    >
                      {link.label}
                      <ArrowUpRight size={16} className="text-muted/60" />
                    </Link>
                  ))}

                  <div
                    className={cn(
                      "flex items-center overflow-hidden rounded-xl transition-colors",
                      isServicesActive ? "bg-surface text-accent" : "text-foreground hover:bg-surface",
                    )}
                  >
                    <Link
                      href={chrome.servicesHref}
                      onClick={() => setMobileOpen(false)}
                      className="flex flex-1 items-center px-3 py-3 text-[15px] font-medium"
                    >
                      {chrome.nav.services}
                    </Link>
                    <button
                      type="button"
                      onClick={() => setMobileServicesOpen((open) => !open)}
                      className="inline-flex h-full items-center px-3 py-3 text-muted transition-colors hover:text-foreground"
                      aria-expanded={mobileServicesOpen}
                      aria-label={mobileServicesOpen ? "Collapse services menu" : "Expand services menu"}
                    >
                      <ChevronDown
                        size={18}
                        className={cn("transition-transform", mobileServicesOpen && "rotate-180")}
                      />
                    </button>
                  </div>

                  <AnimatePresence initial={false}>
                    {mobileServicesOpen && (
                      <m.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-0.5 pb-2 pl-1">
                          {featuredServices.map((service) => (
                            <Link
                              key={service.slug}
                              href={service.href}
                              onClick={() => setMobileOpen(false)}
                              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted transition-colors hover:bg-surface hover:text-foreground"
                            >
                              <service.icon size={16} className="shrink-0 text-accent" />
                              {service.title}
                            </Link>
                          ))}
                          <Link
                            href={chrome.servicesHref}
                            onClick={() => setMobileOpen(false)}
                            className="mx-3 mt-1 inline-flex items-center gap-1 text-sm font-semibold text-accent"
                          >
                            {chrome.nav.viewAllServices}
                            <ArrowUpRight size={14} />
                          </Link>
                        </div>
                      </m.div>
                    )}
                  </AnimatePresence>

                  <div
                    className={cn(
                      "flex items-center overflow-hidden rounded-xl transition-colors",
                      isPortfolioActive ? "bg-surface text-accent" : "text-foreground hover:bg-surface",
                    )}
                  >
                    <Link
                      href="/portfolio"
                      onClick={() => setMobileOpen(false)}
                      className="flex flex-1 items-center px-3 py-3 text-[15px] font-medium"
                    >
                      {chrome.nav.portfolio}
                    </Link>
                    <button
                      type="button"
                      onClick={() => setMobilePortfolioOpen((open) => !open)}
                      className="inline-flex h-full items-center px-3 py-3 text-muted transition-colors hover:text-foreground"
                      aria-expanded={mobilePortfolioOpen}
                      aria-label={
                        mobilePortfolioOpen ? "Collapse portfolio menu" : "Expand portfolio menu"
                      }
                    >
                      <ChevronDown
                        size={18}
                        className={cn("transition-transform", mobilePortfolioOpen && "rotate-180")}
                      />
                    </button>
                  </div>

                  <AnimatePresence initial={false}>
                    {mobilePortfolioOpen && (
                      <m.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-0.5 pb-2 pl-1">
                          <PortfolioRecentLinks
                            enabled={mobilePortfolioOpen}
                            onNavigate={() => setMobileOpen(false)}
                            showWorkTypesFallback
                          />
                          <Link
                            href="/portfolio"
                            onClick={() => setMobileOpen(false)}
                            className="mx-3 mt-1 inline-flex items-center gap-1 text-sm font-semibold text-accent"
                          >
                            {chrome.nav.viewAllProjects}
                            <ArrowUpRight size={14} />
                          </Link>
                        </div>
                      </m.div>
                    )}
                  </AnimatePresence>

                  <div
                    className={cn(
                      "flex items-center overflow-hidden rounded-xl transition-colors",
                      isBlogActive ? "bg-surface text-accent" : "text-foreground hover:bg-surface",
                    )}
                  >
                    <Link
                      href="/blog"
                      onClick={() => setMobileOpen(false)}
                      className="flex flex-1 items-center px-3 py-3 text-[15px] font-medium"
                    >
                      {chrome.nav.blog}
                    </Link>
                    <button
                      type="button"
                      onClick={() => setMobileBlogOpen((open) => !open)}
                      className="inline-flex h-full items-center px-3 py-3 text-muted transition-colors hover:text-foreground"
                      aria-expanded={mobileBlogOpen}
                      aria-label={mobileBlogOpen ? "Collapse blog menu" : "Expand blog menu"}
                    >
                      <ChevronDown
                        size={18}
                        className={cn("transition-transform", mobileBlogOpen && "rotate-180")}
                      />
                    </button>
                  </div>

                  <AnimatePresence initial={false}>
                    {mobileBlogOpen && (
                      <m.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-0.5 pb-2 pl-1">
                          <BlogRecentLinks
                            enabled={mobileBlogOpen}
                            onNavigate={() => setMobileOpen(false)}
                            showTopicsFallback
                          />
                          <Link
                            href="/blog"
                            onClick={() => setMobileOpen(false)}
                            className="mx-3 mt-1 inline-flex items-center gap-1 text-sm font-semibold text-accent"
                          >
                            {chrome.nav.viewAllArticles}
                            <ArrowUpRight size={14} />
                          </Link>
                        </div>
                      </m.div>
                    )}
                  </AnimatePresence>

                  {trailingNavLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-center justify-between rounded-xl px-3 py-3 text-[15px] font-medium transition-colors",
                        isActive(link.href)
                          ? "bg-surface text-accent"
                          : "text-foreground hover:bg-surface",
                      )}
                    >
                      {link.label}
                      <ArrowUpRight size={16} className="text-muted/60" />
                    </Link>
                  ))}
                </div>

                <div className="mt-8 border-t border-border pt-6">
                  <p className="mb-3 px-2 text-[11px] font-semibold uppercase tracking-wider text-muted">
                    {chrome.nav.contact}
                  </p>
                  <div className="space-y-2 px-2 text-sm text-muted">
                    {companyInfo.phones.map((phone) => (
                      <a
                        key={phone.href}
                        href={phone.href}
                        className="block transition-colors hover:text-accent"
                      >
                        {phone.display}
                        <span className="text-muted/70"> · {phone.label}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              <div className="border-t border-border p-4">
                <Link
                  href="/contact"
                  onClick={() => setMobileOpen(false)}
                  className="flex w-full items-center justify-center gap-1.5 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-navy"
                >
                  {chrome.nav.getInTouch}
                  <ArrowUpRight size={15} />
                </Link>
              </div>
            </m.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
