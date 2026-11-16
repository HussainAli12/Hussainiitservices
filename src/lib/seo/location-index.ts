/**
 * Slim list of city pages (no page copy) — safe to import from client components such as the
 * footer. Page content lives in locations.ts, keyed by the same slug.
 */
export interface LocationIndexEntry {
  slug: string;
  city: string;
  region: string;
  country: string;
}

export const locationIndex: LocationIndexEntry[] = [
  { slug: "dubai", city: "Dubai", region: "Dubai", country: "United Arab Emirates" },
  { slug: "abu-dhabi", city: "Abu Dhabi", region: "Abu Dhabi", country: "United Arab Emirates" },
  { slug: "sharjah", city: "Sharjah", region: "Sharjah", country: "United Arab Emirates" },
  { slug: "kuwait", city: "Kuwait", region: "Al Asimah", country: "Kuwait" },
  { slug: "indore", city: "Indore", region: "Madhya Pradesh", country: "India" },
  { slug: "ujjain", city: "Ujjain", region: "Madhya Pradesh", country: "India" },
  { slug: "dewas", city: "Dewas", region: "Madhya Pradesh", country: "India" },
  { slug: "ratlam", city: "Ratlam", region: "Madhya Pradesh", country: "India" },
  { slug: "mandsaur", city: "Mandsaur", region: "Madhya Pradesh", country: "India" },
  { slug: "nagda", city: "Nagda", region: "Madhya Pradesh", country: "India" },
  { slug: "shajapur", city: "Shajapur", region: "Madhya Pradesh", country: "India" },
  { slug: "mumbai", city: "Mumbai", region: "Maharashtra", country: "India" },
  { slug: "delhi", city: "Delhi", region: "Delhi NCR", country: "India" },
  { slug: "riyadh", city: "Riyadh", region: "Riyadh", country: "Saudi Arabia" },
  { slug: "doha", city: "Doha", region: "Doha", country: "Qatar" },
  { slug: "bhopal", city: "Bhopal", region: "Madhya Pradesh", country: "India" },
  { slug: "jabalpur", city: "Jabalpur", region: "Madhya Pradesh", country: "India" },
  { slug: "gwalior", city: "Gwalior", region: "Madhya Pradesh", country: "India" },
  { slug: "sagar", city: "Sagar", region: "Madhya Pradesh", country: "India" },
  { slug: "jeddah", city: "Jeddah", region: "Makkah Province", country: "Saudi Arabia" },
  { slug: "dammam", city: "Dammam", region: "Eastern Province", country: "Saudi Arabia" },
  { slug: "al-khobar", city: "Al Khobar", region: "Eastern Province", country: "Saudi Arabia" },
  { slug: "makkah", city: "Makkah", region: "Makkah Province", country: "Saudi Arabia" },
  { slug: "madinah", city: "Madinah", region: "Madinah Province", country: "Saudi Arabia" },
  { slug: "ajman", city: "Ajman", region: "Ajman", country: "United Arab Emirates" },
  { slug: "ras-al-khaimah", city: "Ras Al Khaimah", region: "Ras Al Khaimah", country: "United Arab Emirates" },
  { slug: "muscat", city: "Muscat", region: "Muscat Governorate", country: "Oman" },
  { slug: "manama", city: "Manama", region: "Capital Governorate", country: "Bahrain" },
];

export function locationHref(slug: string) {
  return `/best-it-services/${slug}`;
}
