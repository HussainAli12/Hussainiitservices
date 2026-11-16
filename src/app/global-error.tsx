"use client";

import Link from "next/link";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className="min-h-screen bg-navy text-white antialiased">
        <section className="mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-4 py-16 sm:px-6 lg:px-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/45">
            Error 500
          </p>
          <h1 className="mt-5 max-w-3xl font-display text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            The site couldn&apos;t load.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
            A serious error stopped this page. Try again, or come back in a few minutes.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={reset}
              className="inline-flex min-h-11 items-center justify-center rounded-md bg-white px-5 py-2.5 text-sm font-semibold text-navy transition-colors hover:bg-white/90"
            >
              Try again
            </button>
            <Link
              href="/"
              className="inline-flex min-h-11 items-center justify-center rounded-md border border-white/20 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:border-white/45"
            >
              Go home
            </Link>
          </div>
          {error.digest ? (
            <p className="mt-6 font-mono text-xs text-white/35">Reference {error.digest}</p>
          ) : null}
        </section>
      </body>
    </html>
  );
}
