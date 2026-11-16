import {
  Shield,
  Clock,
  Users,
  Award,
  Search,
  Share2,
  MapPin,
  Code2,
  Smartphone,
  Apple,
  ShoppingCart,
  Store,
  Palette,
  CreditCard,
  Video,
  Brain,
  Globe,
  PhoneCall,
  Megaphone,
  Briefcase,
  type LucideIcon,
} from "lucide-react";

export interface NavLink {
  label: string;
  href: string;
}

export interface ServiceItem {
  icon: LucideIcon;
  title: string;
  href: string;
  slug: string;
}

export interface FeaturedService {
  icon: LucideIcon;
  title: string;
  description: string;
  tags: string[];
  slug: string;
  href: string;
  image: string;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  highlights: string[];
  tags: string[];
  image?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  quote: string;
  rating: number;
}

export const navLinks: NavLink[] = [
  { label: "About", href: "/about" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Blog", href: "/blog" },
  { label: "Testimonials", href: "/testimonials" },
  { label: "Contact", href: "/contact" },
];

export const allServices: ServiceItem[] = [
  { icon: Globe, title: "Digital Online Presence", slug: "digital-online-presence", href: "/services/digital-online-presence" },
  { icon: Code2, title: "Custom Software Development", slug: "custom-software-development", href: "/services/custom-software-development" },
  { icon: Megaphone, title: "Google Ads & Social Media", slug: "ads-and-social-media", href: "/services/ads-and-social-media" },
  { icon: PhoneCall, title: "AI Voice Calling Agent", slug: "ai-voice-calling-agent", href: "/services/ai-voice-calling-agent" },
  { icon: Search, title: "SEO", slug: "seo", href: "/services/seo" },
  { icon: Share2, title: "Social Media Management", slug: "social-media-management", href: "/services/social-media-management" },
  { icon: MapPin, title: "Google Business Profile", slug: "google-business-profile", href: "/services/google-business-profile" },
  { icon: Code2, title: "Web Development", slug: "web-development", href: "/services/web-development" },
  { icon: Smartphone, title: "Android Apps", slug: "android-apps", href: "/services/android-apps" },
  { icon: Apple, title: "iOS Apps", slug: "ios-apps", href: "/services/ios-apps" },
  { icon: ShoppingCart, title: "Ecommerce", slug: "ecommerce", href: "/services/ecommerce" },
  { icon: Store, title: "Customized Ecommerce Store", slug: "customized-ecommerce-store", href: "/services/customized-ecommerce-store" },
  { icon: Palette, title: "Logo & Brochure Designing", slug: "logo-brochure-designing", href: "/services/logo-brochure-designing" },
  { icon: CreditCard, title: "Business Card Designing", slug: "business-card-designing", href: "/services/business-card-designing" },
  { icon: Video, title: "Video Editing", slug: "video-editing", href: "/services/video-editing" },
  { icon: Brain, title: "AI Integration", slug: "ai-integration", href: "/services/ai-integration" },
];

export const featuredServices: FeaturedService[] = [
  {
    icon: Globe,
    title: "Digital Online Presence",
    slug: "digital-online-presence",
    href: "/services/digital-online-presence",
    description:
      "Build a complete digital identity — professional websites, SEO, and Google Business Profile optimization so customers find, trust, and choose your brand online.",
    tags: ["Website Building", "SEO", "Google Business Profile", "Digital Identity"],
    image: "/services/digital-online-presence.jpg",
  },
  {
    icon: Code2,
    title: "Custom Software Development",
    slug: "custom-software-development",
    href: "/services/custom-software-development",
    description:
      "Tailored business software built around how you operate — CRM systems, SaaS platforms, and ERP solutions that streamline workflows and scale with your team.",
    tags: ["CRM", "SaaS Applications", "ERP Software", "Custom Platforms"],
    image: "/services/custom-software-development.jpg",
  },
  {
    icon: Megaphone,
    title: "Google Ads & Social Media",
    slug: "ads-and-social-media",
    href: "/services/ads-and-social-media",
    description:
      "Paid and organic growth under one roof — Google Ads campaign management plus social media strategy, content, and community management across the platforms that matter.",
    tags: ["Google Ads", "Meta Ads", "Social Media", "Campaign Management"],
    image: "/services/ads-and-social-media.jpg",
  },
  {
    icon: PhoneCall,
    title: "AI Voice Calling Agents",
    slug: "ai-voice-calling-agent",
    href: "/services/ai-voice-calling-agent",
    description:
      "Intelligent AI voice agents that handle inbound and outbound calls, qualify leads, book appointments, and deliver 24/7 customer support in a natural conversational style.",
    tags: ["Lead Qualification", "Appointment Booking", "24/7 Support", "Multilingual"],
    image: "/services/ai-voice-calling-agent.jpg",
  },
];

export const heroFeatures = [
  { icon: Globe, label: "Digital Presence", desc: "Websites, SEO & Google Profile" },
  { icon: Code2, label: "Custom Software", desc: "CRM, SaaS & ERP builds" },
  { icon: Megaphone, label: "Ads & Social", desc: "Google Ads & social media" },
  { icon: PhoneCall, label: "AI Voice Agents", desc: "24/7 intelligent calling" },
];

export interface BlogTopic {
  slug: string;
  label: string;
  tagline: string;
  icon: LucideIcon;
}

export interface PortfolioWorkType {
  label: string;
  tagline: string;
  icon: LucideIcon;
}

export const portfolioWorkTypes: PortfolioWorkType[] = [
  {
    label: "Web Development",
    tagline: "Corporate sites & web applications",
    icon: Code2,
  },
  {
    label: "Ecommerce",
    tagline: "Shopify stores & online retail",
    icon: ShoppingCart,
  },
  {
    label: "Digital Marketing",
    tagline: "SEO, ads & social campaigns",
    icon: Megaphone,
  },
  {
    label: "Custom Software",
    tagline: "CRM, SaaS & business tools",
    icon: Briefcase,
  },
];

export const blogTopics: BlogTopic[] = [
  {
    slug: "digital-online-presence",
    label: "Digital Presence",
    tagline: "Websites, SEO & local search",
    icon: Globe,
  },
  {
    slug: "custom-software-development",
    label: "Custom Software",
    tagline: "CRM, SaaS & ERP insights",
    icon: Code2,
  },
  {
    slug: "ads-and-social-media",
    label: "Ads & Social",
    tagline: "Google Ads & social media tips",
    icon: Megaphone,
  },
  {
    slug: "ai-voice-calling-agent",
    label: "AI Voice Agents",
    tagline: "Automation & voice AI",
    icon: PhoneCall,
  },
];

export const defaultSiteStats = {
  projects_delivered: 15,
  global_clients: 15,
  years_experience: 2,
  client_satisfaction: 98,
  projects_completed: 15,
  countries_served: 2,
  happy_clients: 15,
};

export const stats = [
  { key: "projects_delivered" as const, value: 15, suffix: "+", label: "Projects Delivered" },
  { key: "global_clients" as const, value: 15, suffix: "+", label: "Global Clients" },
  { key: "years_experience" as const, value: 2, suffix: "+", label: "Years Experience" },
  { key: "client_satisfaction" as const, value: 98, suffix: "%", label: "Client Satisfaction" },
];

export const whyChooseUs = [
  {
    icon: Shield,
    title: "Enterprise Security",
    description:
      "Industry-standard security practices protecting your data and applications.",
  },
  {
    icon: Clock,
    title: "On-Time Delivery",
    description:
      "Committed timelines with transparent progress tracking and communication.",
  },
  {
    icon: Users,
    title: "Dedicated Team",
    description:
      "Expert developers and marketers assigned to your project from start to finish.",
  },
  {
    icon: Award,
    title: "Quality Assured",
    description:
      "Rigorous testing and code reviews ensuring exceptional product quality.",
  },
];

export const trackRecord = [
  { key: "client_satisfaction" as const, value: 98, suffix: "%", label: "Client Satisfaction" },
  { key: "projects_completed" as const, value: 15, suffix: "+", label: "Projects Completed" },
  { key: "countries_served" as const, value: 2, suffix: "+", label: "Countries Served" },
  { key: "happy_clients" as const, value: 15, suffix: "+", label: "Happy Clients" },
];

export const projects: Project[] = [
  {
    id: "al-hadaf",
    title: "Al Hadaf Metal Coating",
    category: "Web Development",
    description:
      "Corporate website for an industrial metal coating company with service descriptions, testimonials, and blog.",
    highlights: ["99.9% uptime", "100% SEO optimization"],
    tags: ["React", "Node.js", "Google Sheets API"],
  },
  {
    id: "burhani-guards",
    title: "Burhani Guards Performance Tracker",
    category: "Web Application",
    description:
      "Custom web application for managing security personnel performance, attendance, and reporting.",
    highlights: ["3s load time", "100% user satisfaction"],
    tags: ["React", "Node.js", "MongoDB"],
  },
  {
    id: "himmat-oilfield",
    title: "Himmat Oilfield Shopify Store",
    category: "Ecommerce",
    description:
      "Ecommerce platform for oilfield equipment with product catalog, cart, and secure checkout.",
    highlights: ["5-star rating", "30% engagement increase"],
    tags: ["Shopify Plus", "Liquid", "JavaScript"],
  },
  {
    id: "safinat",
    title: "Safinat Safinaas Ecom App",
    category: "Ecommerce",
    description:
      "Fashion ecommerce web application with dynamic listings, reviews, and personalized recommendations.",
    highlights: ["2000+ products", "50% faster inquiries"],
    tags: ["Webflow", "Custom Code", "Analytics"],
  },
  {
    id: "advance-cinematics",
    title: "Advance Cinematics Portfolio",
    category: "Portfolio Website",
    description:
      "Cinematic portfolio for a Senior Video Editor and Motion Graphics Designer with Vimeo and YouTube integration.",
    highlights: ["Cinematic UI", "Premium media showcase"],
    tags: ["React", "Tailwind CSS", "Vimeo", "YouTube"],
  },
  {
    id: "badshah-property",
    title: "Badshah Property",
    category: "Real Estate",
    description:
      "Modern real estate website for property listings, lead generation, and local SEO optimization.",
    highlights: ["Improved lead generation", "Local SEO visibility"],
    tags: ["React", "Tailwind CSS", "Shadcn UI"],
  },
  {
    id: "aadtra-smm",
    title: "AADTRA Social Media",
    category: "Digital Marketing",
    description:
      "LinkedIn-focused social media management for industrial brand presence in Oil & Gas and Infrastructure.",
    highlights: ["B2B authority building", "Industry engagement"],
    tags: ["LinkedIn", "Content Strategy", "Canva"],
  },
  {
    id: "mahakal-bike",
    title: "Mahakal Bike Rental",
    category: "Web Development",
    description:
      "Bike rental booking platform for tourists and pilgrims visiting Mahakal Temple in Ujjain.",
    highlights: ["Seamless bookings", "Local SEO optimized"],
    tags: ["React", "Tailwind CSS", "Shadcn UI"],
  },
];

export const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Industrial Client",
    role: "Marketing Director",
    company: "AADTRA",
    quote:
      "Hussaini IT Services transformed our LinkedIn presence. Their strategic content approach helped us build authority in the industrial sector and attract serious B2B decision-makers.",
    rating: 5,
  },
  {
    id: "2",
    name: "Business Owner",
    role: "Founder",
    company: "Gulfpole",
    quote:
      "The team delivered consistent, professional social media management that strengthened our brand credibility across GCC markets. Engagement from contractors and infrastructure companies increased significantly.",
    rating: 5,
  },
  {
    id: "3",
    name: "Property Developer",
    role: "Director",
    company: "Badshah Property",
    quote:
      "Our new website looks premium and generates quality leads daily. The local SEO optimization has made a real difference in property search visibility.",
    rating: 5,
  },
  {
    id: "4",
    name: "Creative Professional",
    role: "Senior Video Editor",
    company: "Advance Cinematics",
    quote:
      "They built a cinematic portfolio that truly represents my work. Fast loading, beautiful design, and seamless Vimeo integration — exactly what I needed to impress clients.",
    rating: 5,
  },
  {
    id: "5",
    name: "Homestay Owner",
    role: "Manager",
    company: "Saifuddin & Sons Homestay",
    quote:
      "Our homestay website near Mahakal Temple has increased direct bookings and inquiries. Clean design, mobile-friendly, and perfectly targeted for pilgrims and tourists.",
    rating: 5,
  },
];

export interface Technology {
  name: string;
  logo: string;
}

export const technologies: Technology[] = [
  { name: "React", logo: "/tech/react.svg" },
  { name: "Next.js", logo: "/tech/nextjs.svg" },
  { name: "Node.js", logo: "/tech/nodejs.svg" },
  { name: "AWS", logo: "/tech/aws.svg" },
  { name: "Shopify", logo: "/tech/shopify.svg" },
  { name: "WordPress", logo: "/tech/wordpress.svg" },
  { name: "Flutter", logo: "/tech/flutter.svg" },
  { name: "TypeScript", logo: "/tech/typescript.svg" },
  { name: "Google Ads", logo: "/tech/google-ads.svg" },
  { name: "Meta Ads", logo: "/tech/meta.svg" },
  { name: "Canva", logo: "/tech/canva.svg" },
  { name: "Webflow", logo: "/tech/webflow.svg" },
];

export const companyInfo = {
  name: "Hussaini IT Services",
  email: "info@hussainiitservices.com",
  phone: "+91 7024951915",
  phones: [
    { label: "India", display: "+91 7024951915", href: "tel:+917024951915" },
    { label: "India", display: "+91 7777881545", href: "tel:+917777881545" },
    { label: "UAE", display: "+971 55 365 9826", href: "tel:+971553659826" },
  ],
  whatsapp: {
    display: "+91 7024951915",
    href: "https://wa.me/917024951915",
  },
  location: "Dubai, UAE & Ujjain, India",
  locations: ["Dubai, UAE", "Ujjain, Madhya Pradesh, India"],
  // Must match the primary domain used in Google Search Console (www)
  website: "https://www.hussainiitservices.com",
  socials: {
    linkedin: "https://www.linkedin.com/company/hussaini-it-services/",
    instagram: "https://www.instagram.com/hussaini_it_services/",
    facebook: "https://www.facebook.com/profile.php?id=61588450138978",
    whatsapp: "https://wa.me/917024951915",
  },
};

export interface Founder {
  name: string;
  role: "Founder" | "Co-Founder";
  image: string;
  bio: string;
  focus: string[];
  linkedin?: string;
}

export const founders: Founder[] = [
  {
    name: "Hussain Mesharwala",
    role: "Founder",
    image: "/team/hussain-mesharwala.jpeg",
    bio: "Hussain founded Hussaini IT Services to help businesses grow through premium digital solutions. He leads sales, marketing, and client relationships — owning projects end-to-end from first conversation to delivery, and building long-term partnerships across the UAE, India, and beyond.",
    focus: ["Sales & Business Development", "Marketing Strategy", "Client Relationships", "Project Ownership"],
    linkedin: "https://www.linkedin.com/in/hussain-mesharwala/",
  },
  {
    name: "Adam Pithenwala",
    role: "Co-Founder",
    image: "/team/adam-pithenwala.jpeg",
    bio: "Adam co-founded Hussaini IT Services to bring deep technical expertise to every engagement. He leads all technical operations — from architecture and coding to project management and delivery — ensuring each build is scalable, performant, and aligned with client goals.",
    focus: ["Software Development", "Technical Architecture", "Project Management", "Engineering Delivery"],
    linkedin: "https://www.linkedin.com/in/adam-pithewan",
  },
];
