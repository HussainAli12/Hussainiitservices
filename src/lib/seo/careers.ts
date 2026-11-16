export interface CareerSalary {
  currency: "INR";
  min: number;
  max: number;
  unit: "YEAR";
}

export interface CareerRole {
  id: string;
  title: string;
  location: string;
  type: string;
  summary: string;
  focus: string[];
  datePosted: string;
  validThrough: string;
  salary: CareerSalary;
}

/** India hiring office used for JobPosting jobLocation.address */
export const ujjainHiringOffice = {
  streetAddress: "Ujjain office",
  addressLocality: "Ujjain",
  addressRegion: "Madhya Pradesh",
  postalCode: "456001",
  addressCountry: "IN",
} as const;

export function formatCareerSalary(salary: CareerSalary) {
  const lakh = (value: number) => {
    const n = value / 100_000;
    return Number.isInteger(n) ? `${n}` : n.toFixed(1).replace(/\.0$/, "");
  };
  return `₹${lakh(salary.min)}–${lakh(salary.max)} LPA`;
}

export function formatCareerDate(isoDate: string) {
  return new Date(`${isoDate}T00:00:00+05:30`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatOfficeAddress() {
  return `${ujjainHiringOffice.streetAddress}, ${ujjainHiringOffice.addressLocality}, ${ujjainHiringOffice.addressRegion} ${ujjainHiringOffice.postalCode}`;
}

export const careerValues = [
  {
    title: "Own the work",
    description: "Small team, real responsibility. You see a project from brief to launch, not a 40-person chain of handoffs.",
  },
  {
    title: "Ship with taste",
    description: "We care how things look and how they load. Sloppy UI and slow pages do not leave the office.",
  },
  {
    title: "Talk like adults",
    description: "Clients get honest timelines. Internally we prefer a written update over a meeting that could have been a note.",
  },
  {
    title: "In the room in Ujjain",
    description: "Hiring is based at our Ujjain office. You work with the team in person — not as a name on a remote roster.",
  },
];

export const careerRoles: CareerRole[] = [
  {
    id: "fullstack-developer",
    title: "Full-stack Developer",
    location: "Ujjain",
    type: "Full-time",
    summary:
      "Build marketing sites and web apps in Next.js, React, and Node. You will work directly with the co-founder on architecture and delivery.",
    focus: ["Next.js", "TypeScript", "APIs", "Performance"],
    datePosted: "2026-09-04",
    validThrough: "2026-12-31",
    salary: { currency: "INR", min: 300000, max: 800000, unit: "YEAR" },
  },
  {
    id: "seo-associate",
    title: "SEO & Content Associate",
    location: "Ujjain",
    type: "Full-time",
    summary:
      "Research keywords, improve on-page SEO, and draft landing pages that can actually rank. Comfortable with Search Console and honest reporting.",
    focus: ["Keyword research", "On-page SEO", "Copy", "Search Console"],
    datePosted: "2026-09-04",
    validThrough: "2026-12-31",
    salary: { currency: "INR", min: 240000, max: 480000, unit: "YEAR" },
  },
  {
    id: "social-media-executive",
    title: "Social Media Executive",
    location: "Ujjain",
    type: "Full-time",
    summary:
      "Plan and publish LinkedIn and Instagram for B2B and local brands. You will own the calendar, not just the captions.",
    focus: ["LinkedIn", "Instagram", "Design briefs", "Analytics"],
    datePosted: "2026-09-04",
    validThrough: "2026-12-31",
    salary: { currency: "INR", min: 240000, max: 420000, unit: "YEAR" },
  },
  {
    id: "business-development",
    title: "Business Development",
    location: "Ujjain",
    type: "Full-time",
    summary:
      "Run first conversations with inbound leads, write clear proposals, and keep the pipeline tidy. You like selling a real service, not a script.",
    focus: ["Discovery calls", "Proposals", "CRM", "Follow-up"],
    datePosted: "2026-09-04",
    validThrough: "2026-12-31",
    salary: { currency: "INR", min: 240000, max: 600000, unit: "YEAR" },
  },
];

export const hiringSteps = [
  { title: "Introduce yourself", description: "Email a CV, portfolio or relevant links, and two sentences on why you want to work in Ujjain." },
  { title: "Conversation", description: "A short call with a founder about how you work — not a puzzle interview." },
  { title: "Paid task", description: "A small, paid exercise that looks like the real job." },
  { title: "Offer", description: "Written scope, compensation, and start date. No mystery rounds." },
];
