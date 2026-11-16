import type { Channel, DealStage, Lifecycle, TaskType } from "@/lib/crm/types";

export const DEAL_STAGES: { value: DealStage; label: string; open: boolean }[] = [
  { value: "new", label: "New lead", open: true },
  { value: "contacted", label: "Contacted", open: true },
  { value: "discovery", label: "Discovery call", open: true },
  { value: "requirements", label: "Requirements", open: true },
  { value: "proposal", label: "Proposal sent", open: true },
  { value: "negotiation", label: "Negotiation", open: true },
  { value: "won", label: "Won", open: false },
  { value: "lost", label: "Lost", open: false },
];

export const OPEN_STAGES = DEAL_STAGES.filter((stage) => stage.open).map((stage) => stage.value);

export function stageLabel(stage: DealStage) {
  return DEAL_STAGES.find((entry) => entry.value === stage)?.label ?? stage;
}

export const LIFECYCLES: { value: Lifecycle; label: string }[] = [
  { value: "lead", label: "Lead" },
  { value: "client", label: "Client" },
  { value: "inactive", label: "Inactive" },
];

export const LEAD_SOURCES: { value: string; label: string }[] = [
  { value: "website", label: "Website enquiry" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "instagram", label: "Instagram" },
  { value: "google_ads", label: "Google Ads" },
  { value: "google_business", label: "Google Business Profile" },
  { value: "referral", label: "Referral" },
  { value: "cold_call", label: "Cold call" },
  { value: "walk_in", label: "Walk-in / event" },
  { value: "existing_client", label: "Existing client" },
  { value: "other", label: "Other" },
];

export function sourceLabel(value: string) {
  return LEAD_SOURCES.find((entry) => entry.value === value)?.label ?? value;
}

/** What Hussaini IT Services sells; mirrors the services on the website. */
export const CRM_SERVICES = [
  "Web Development",
  "Ecommerce",
  "Customized Ecommerce Store",
  "Custom Software Development",
  "Android Apps",
  "iOS Apps",
  "SEO",
  "Google Ads & Social Media",
  "Social Media Management",
  "Google Business Profile",
  "Digital Online Presence",
  "AI Voice Calling Agent",
  "AI Integration",
  "Logo & Brochure Designing",
  "Business Card Designing",
  "Video Editing",
];

export const LOST_REASONS = [
  "Price too high",
  "Chose a competitor",
  "No response",
  "Not ready yet",
  "No budget",
  "Out of scope",
  "Other",
];

export const CHANNELS: { value: Channel; label: string; loggable: boolean }[] = [
  { value: "call", label: "Call", loggable: true },
  { value: "whatsapp", label: "WhatsApp", loggable: true },
  { value: "email", label: "Email", loggable: true },
  { value: "instagram", label: "Instagram", loggable: true },
  { value: "meeting", label: "Meeting", loggable: true },
  { value: "note", label: "Note", loggable: true },
  { value: "website", label: "Website form", loggable: false },
];

export function channelLabel(channel: Channel) {
  return CHANNELS.find((entry) => entry.value === channel)?.label ?? channel;
}

/** One-tap outcomes per channel. `positive` colours the badge green, `negative` amber. */
export const OUTCOMES: Record<Channel, { value: string; tone?: "positive" | "negative" }[]> = {
  call: [
    { value: "Connected", tone: "positive" },
    { value: "Interested", tone: "positive" },
    { value: "Asked to call back" },
    { value: "Not interested", tone: "negative" },
    { value: "No answer", tone: "negative" },
    { value: "Busy", tone: "negative" },
    { value: "Switched off", tone: "negative" },
    { value: "Wrong number", tone: "negative" },
  ],
  whatsapp: [
    { value: "Sent" },
    { value: "Read, no reply", tone: "negative" },
    { value: "Replied", tone: "positive" },
    { value: "Shared portfolio" },
    { value: "Shared quotation" },
    { value: "Voice note" },
  ],
  email: [
    { value: "Sent" },
    { value: "Replied", tone: "positive" },
    { value: "Proposal sent" },
    { value: "Bounced", tone: "negative" },
  ],
  instagram: [
    { value: "DM sent" },
    { value: "Replied", tone: "positive" },
    { value: "Story reply" },
    { value: "Commented" },
    { value: "Seen, no reply", tone: "negative" },
  ],
  meeting: [
    { value: "Held", tone: "positive" },
    { value: "Online meeting", tone: "positive" },
    { value: "Rescheduled" },
    { value: "No-show", tone: "negative" },
  ],
  website: [{ value: "Enquiry received", tone: "positive" }],
  note: [],
};

export function outcomeTone(channel: Channel, outcome: string | null) {
  return OUTCOMES[channel]?.find((entry) => entry.value === outcome)?.tone;
}

export const TASK_TYPES: { value: TaskType; label: string }[] = [
  { value: "call", label: "Call" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "email", label: "Email" },
  { value: "instagram", label: "Instagram" },
  { value: "meeting", label: "Meeting" },
  { value: "proposal", label: "Send proposal" },
  { value: "other", label: "Other" },
];

const inr = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
const inrCompact = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  notation: "compact",
  maximumFractionDigits: 1,
});

/** ₹1,50,000 */
export function formatInr(value: number) {
  return inr.format(value || 0);
}

/** ₹1.5L — for tight spaces like board column totals. */
export function formatInrCompact(value: number) {
  return inrCompact.format(value || 0);
}

/** Digits only, with India's country code added to 10-digit numbers, for wa.me links. */
export function whatsappNumber(raw: string | null | undefined) {
  const digits = (raw ?? "").replace(/\D/g, "");
  if (!digits) return null;
  return digits.length === 10 ? `91${digits}` : digits;
}

export function instagramUrl(handle: string | null | undefined) {
  if (!handle) return null;
  const trimmed = handle.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://instagram.com/${trimmed.replace(/^@/, "")}`;
}
