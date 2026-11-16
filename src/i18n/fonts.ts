import { Noto_Sans_Arabic, Noto_Sans_Devanagari } from "next/font/google";

/** Arabic-friendly font for /ar (RTL) */
export const arabicFont = Noto_Sans_Arabic({
  variable: "--font-arabic",
  subsets: ["arabic"],
  weight: ["400", "600", "700"],
  display: "swap",
});

/** Devanagari font for /hi */
export const devanagariFont = Noto_Sans_Devanagari({
  variable: "--font-devanagari",
  subsets: ["devanagari"],
  weight: ["400", "600", "700"],
  display: "swap",
});
