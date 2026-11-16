import { contactFaqs, homeFaqs, serviceFaqs } from "@/lib/seo/content";
import { pricingFaqs } from "@/lib/seo/pricing";

export interface FaqGroup {
  id: string;
  title: string;
  items: { question: string; answer: string }[];
}

/**
 * Global FAQ (/faq). Reuses existing FAQ copy from the home, services, contact and pricing pages
 * and adds a few process questions.
 * TODO(content-review): review the "Working with us" answers below.
 */
const processFaqs = [
  {
    question: "Who owns the website and code after launch?",
    answer:
      "You do. Once the project is paid for, the website, content and code are yours, and we hand over access and documentation.",
  },
  {
    question: "How do you communicate during a project?",
    answer:
      "Mostly WhatsApp and scheduled calls, with a staging link so you can see progress. Every project has a named owner on our side.",
  },
  {
    question: "Do you work in Hindi and Arabic as well as English?",
    answer:
      "We work in English and Hindi. For Arabic, we build RTL layouts and place Arabic content you provide; Arabic copywriting is scoped separately.",
  },
  {
    question: "Can you take over a website another agency built?",
    answer: "Yes. We audit it first and tell you honestly whether to repair or rebuild.",
  },
];

function dedupe(items: { question: string; answer: string }[]) {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = item.question.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export const faqGroups: FaqGroup[] = [
  { id: "about", title: "About us", items: dedupe([...homeFaqs, ...contactFaqs]) },
  { id: "services", title: "Services", items: dedupe(serviceFaqs) },
  { id: "working-with-us", title: "Working with us", items: processFaqs },
  { id: "pricing", title: "Pricing & payment", items: pricingFaqs },
];

/** Every FAQ once, for FAQPage schema */
export const allFaqs = dedupe(faqGroups.flatMap((group) => group.items));
