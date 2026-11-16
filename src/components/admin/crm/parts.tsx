"use client";

import { Globe, Handshake, Mail, Phone, StickyNote } from "lucide-react";
import { Badge } from "@/components/admin/ui/badge";
import { Button } from "@/components/admin/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/admin/ui/tooltip";
import { InstagramIcon, WhatsAppIcon } from "@/components/ui/SocialIcons";
import { CRM_SERVICES, instagramUrl, outcomeTone, stageLabel, whatsappNumber } from "@/lib/crm/config";
import type { Channel, CrmContact, DealStage, Lifecycle } from "@/lib/crm/types";
import { cn } from "@/lib/utils";

const CHANNEL_STYLE: Record<Channel, { icon: React.ComponentType<{ className?: string }>; className: string }> = {
  call: { icon: Phone, className: "bg-sky-50 text-sky-700 ring-sky-200" },
  whatsapp: { icon: WhatsAppIcon, className: "bg-emerald-50 text-emerald-700 ring-emerald-200" },
  email: { icon: Mail, className: "bg-violet-50 text-violet-700 ring-violet-200" },
  instagram: { icon: InstagramIcon, className: "bg-pink-50 text-pink-700 ring-pink-200" },
  meeting: { icon: Handshake, className: "bg-amber-50 text-amber-700 ring-amber-200" },
  website: { icon: Globe, className: "bg-blue-50 text-blue-700 ring-blue-200" },
  note: { icon: StickyNote, className: "bg-muted text-muted-foreground ring-border" },
};

export function ChannelIcon({ channel, size = "md" }: { channel: Channel; size?: "sm" | "md" }) {
  const style = CHANNEL_STYLE[channel] ?? CHANNEL_STYLE.note;
  const Icon = style.icon;
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full ring-1",
        size === "sm" ? "size-6 [&_svg]:size-3" : "size-8 [&_svg]:size-3.5",
        style.className,
      )}
    >
      <Icon />
    </span>
  );
}

const STAGE_DOT: Record<DealStage, string> = {
  new: "bg-slate-400",
  contacted: "bg-sky-500",
  discovery: "bg-indigo-500",
  requirements: "bg-violet-500",
  proposal: "bg-amber-500",
  negotiation: "bg-orange-500",
  won: "bg-emerald-500",
  lost: "bg-rose-500",
};

export function StageDot({ stage }: { stage: DealStage }) {
  return <span className={cn("size-2 shrink-0 rounded-full", STAGE_DOT[stage])} />;
}

export function StageBadge({ stage }: { stage: DealStage }) {
  return (
    <Badge variant="outline" className="gap-1.5 font-normal">
      <StageDot stage={stage} />
      {stageLabel(stage)}
    </Badge>
  );
}

export function LifecycleBadge({ lifecycle }: { lifecycle: Lifecycle }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "font-normal capitalize",
        lifecycle === "client" && "border-emerald-200 bg-emerald-50 text-emerald-700",
        lifecycle === "lead" && "border-sky-200 bg-sky-50 text-sky-700",
        lifecycle === "inactive" && "text-muted-foreground",
      )}
    >
      {lifecycle}
    </Badge>
  );
}

export function OutcomeBadge({ channel, outcome }: { channel: Channel; outcome: string | null }) {
  if (!outcome) return null;
  const tone = outcomeTone(channel, outcome);
  return (
    <Badge
      variant="outline"
      className={cn(
        "font-normal",
        tone === "positive" && "border-emerald-200 bg-emerald-50 text-emerald-700",
        tone === "negative" && "border-amber-200 bg-amber-50 text-amber-800",
      )}
    >
      {outcome}
    </Badge>
  );
}

export function ServicesPicker({ value, onChange }: { value: string[]; onChange: (value: string[]) => void }) {
  function toggle(service: string) {
    onChange(value.includes(service) ? value.filter((item) => item !== service) : [...value, service]);
  }
  return (
    <div className="flex flex-wrap gap-1.5">
      {CRM_SERVICES.map((service) => {
        const selected = value.includes(service);
        return (
          <button
            key={service}
            type="button"
            onClick={() => toggle(service)}
            aria-pressed={selected}
            className={cn(
              "rounded-full border px-2.5 py-1 text-xs transition-colors",
              selected
                ? "border-primary bg-primary text-primary-foreground"
                : "bg-background text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            {service}
          </button>
        );
      })}
    </div>
  );
}

/**
 * Call / WhatsApp / Email / Instagram buttons for a contact. Each opens the conversation in the
 * right app and then asks to log it, so manual tracking happens at the moment of contact.
 */
export function ContactActions({
  contact,
  customerInstagram,
  onLog,
  size = "sm",
}: {
  contact: Pick<CrmContact, "phone" | "whatsapp" | "email" | "instagram"> | null;
  customerInstagram?: string | null;
  onLog: (channel: Channel) => void;
  size?: "sm" | "icon-sm";
}) {
  const wa = whatsappNumber(contact?.whatsapp || contact?.phone);
  const insta = instagramUrl(contact?.instagram || customerInstagram);
  const actions: { channel: Channel; label: string; href: string | null; icon: React.ReactNode }[] = [
    { channel: "call", label: "Call", href: contact?.phone ? `tel:${contact.phone.replace(/\s/g, "")}` : null, icon: <Phone /> },
    { channel: "whatsapp", label: "WhatsApp", href: wa ? `https://wa.me/${wa}` : null, icon: <WhatsAppIcon className="size-4" /> },
    { channel: "email", label: "Email", href: contact?.email ? `mailto:${contact.email}` : null, icon: <Mail /> },
    { channel: "instagram", label: "Instagram", href: insta, icon: <InstagramIcon className="size-4" /> },
  ];

  return (
    <div className="flex flex-wrap gap-1.5">
      {actions.map((action) => {
        const button = (
          <Button
            key={action.channel}
            type="button"
            variant="outline"
            size={size}
            disabled={!action.href}
            aria-label={action.label}
            onClick={() => {
              if (!action.href) return;
              if (action.href.startsWith("http")) window.open(action.href, "_blank", "noopener");
              else window.location.href = action.href;
              onLog(action.channel);
            }}
          >
            {action.icon}
            {size === "sm" && action.label}
          </Button>
        );
        if (size === "sm") return button;
        return (
          <Tooltip key={action.channel}>
            <TooltipTrigger asChild>
              <span>{button}</span>
            </TooltipTrigger>
            <TooltipContent>{action.href ? action.label : `No ${action.label.toLowerCase()} saved`}</TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
}

/** "Due in 2 hours" / "Overdue by 3 days", coloured by urgency. */
export function DueLabel({ dueAt, className }: { dueAt: string; className?: string }) {
  const due = new Date(dueAt);
  const now = new Date();
  const overdue = due.getTime() < now.getTime();
  const sameDay = due.toDateString() === now.toDateString();
  const time = due.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" });
  const day = due.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
  return (
    <span
      className={cn(
        "text-xs tabular-nums",
        overdue ? "font-medium text-destructive" : sameDay ? "font-medium text-foreground" : "text-muted-foreground",
        className,
      )}
    >
      {overdue && !sameDay ? `Overdue · ${day}` : sameDay ? `${overdue ? "Overdue · " : "Today "}${time}` : `${day}, ${time}`}
    </span>
  );
}
