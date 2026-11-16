export interface DbTestimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  quote: string;
  rating: number;
  website_url: string | null;
  location: string | null;
  logo_url: string | null;
  is_published: boolean;
  created_at: string;
}

export type PortfolioCoverType = "logo" | "screenshot";

export interface PortfolioGalleryImage {
  url: string;
  alt: string;
}

export interface DbPortfolio {
  id: string;
  slug: string;
  title: string;
  category: string;
  client_name: string | null;
  description: string;
  challenge: string | null;
  solution: string | null;
  results: string | null;
  highlights: string[];
  tags: string[];
  tech_stack: string[];
  content: string;
  gallery: PortfolioGalleryImage[];
  logo_url: string | null;
  image_url: string | null;
  cover_type: PortfolioCoverType;
  cover_image_alt: string | null;
  meta_description: string | null;
  meta_keywords: string[] | null;
  project_url: string | null;
  is_published: boolean;
  sort_order: number;
  created_at: string;
  /** Set by admin on save — optional until migration 16 runs */
  updated_at?: string | null;
}

export interface DbContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  created_at: string;
}

export interface DbBlog {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image_url: string | null;
  cover_image_alt: string | null;
  meta_description: string | null;
  meta_keywords: string[] | null;
  author: string | null;
  is_published: boolean;
  published_at: string;
  created_at: string;
  updated_at: string;
}

export interface DbSiteStats {
  id: string;
  projects_delivered: number;
  global_clients: number;
  years_experience: number;
  client_satisfaction: number;
  projects_completed: number;
  countries_served: number;
  happy_clients: number;
  updated_at: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}
