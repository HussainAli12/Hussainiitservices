import {
  Apple,
  Brain,
  CheckCircle2,
  ClipboardList,
  Code2,
  CreditCard,
  Globe,
  MapPin,
  Megaphone,
  Palette,
  PenTool,
  PhoneCall,
  Rocket,
  Search,
  Share2,
  ShoppingCart,
  Smartphone,
  Store,
  Video,
  type LucideIcon,
} from "lucide-react";

export const serviceTags: Record<string, string[]> = {
  "digital-online-presence": ["Website Building", "SEO", "Google Business Profile", "Digital Identity"],
  "custom-software-development": ["CRM", "SaaS Applications", "ERP Software", "Custom Platforms"],
  "ads-and-social-media": ["Google Ads", "Meta Ads", "Social Media", "Campaign Management"],
  seo: ["Keyword Research", "On-Page SEO", "Local SEO", "Analytics"],
  "social-media-management": ["Content Strategy", "LinkedIn", "Instagram", "Community"],
  "google-business-profile": ["Profile Setup", "Reviews", "Google Maps", "Local Posts"],
  "web-development": ["Next.js", "React", "WordPress", "SEO-ready"],
  "android-apps": ["Flutter", "Play Store", "UX Flows", "APIs"],
  "ios-apps": ["Flutter", "App Store", "TestFlight", "iPhone & iPad"],
  ecommerce: ["Shopify", "Checkout", "Catalogues", "Analytics"],
  "customized-ecommerce-store": ["Custom Logic", "B2B Pricing", "Checkout", "Admin"],
  "logo-brochure-designing": ["Logo", "Print", "Brand Files", "Brochures"],
  "business-card-designing": ["Print-ready", "Team Variants", "QR Codes", "Layout"],
  "video-editing": ["Reels", "Captions", "Brand Films", "Ads"],
  "ai-integration": ["Assistants", "Automation", "CRM", "Guardrails"],
  "ai-voice-calling-agent": ["Inbound", "Outbound", "Booking", "Multilingual"],
};

export const serviceIcons: Record<string, LucideIcon> = {
  "digital-online-presence": Globe,
  "custom-software-development": Code2,
  "ads-and-social-media": Megaphone,
  seo: Search,
  "social-media-management": Share2,
  "google-business-profile": MapPin,
  "web-development": Code2,
  "android-apps": Smartphone,
  "ios-apps": Apple,
  ecommerce: ShoppingCart,
  "customized-ecommerce-store": Store,
  "logo-brochure-designing": Palette,
  "business-card-designing": CreditCard,
  "video-editing": Video,
  "ai-integration": Brain,
  "ai-voice-calling-agent": PhoneCall,
};

export const processIcons: LucideIcon[] = [ClipboardList, PenTool, Rocket];

export function getServiceIcon(slug: string): LucideIcon {
  return serviceIcons[slug] ?? Search;
}

export function getServiceTags(slug: string): string[] {
  return serviceTags[slug] ?? [];
}

export const outcomeIcon = CheckCircle2;


/** Local OG/hero stills under /public/services — only slugs with assets */
const SERVICE_OG_IMAGES: Record<string, string> = {
  "digital-online-presence": "/services/digital-online-presence.jpg",
  "custom-software-development": "/services/custom-software-development.jpg",
  "ads-and-social-media": "/services/ads-and-social-media.jpg",
  "ai-voice-calling-agent": "/services/ai-voice-calling-agent.jpg",
  "google-business-profile": "/services/google-business-profile.jpg",
  seo: "/services/seo.jpg",
  "social-media-management": "/services/social-media-management.jpg",
};

export function serviceOgImagePath(slug: string): string | undefined {
  return SERVICE_OG_IMAGES[slug];
}
