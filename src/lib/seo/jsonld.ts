import { featuredServices, allServices, founders, companyInfo } from "@/lib/constants";
import type { DbBlog, DbPortfolio, DbTestimonial } from "@/lib/types/database";
import { defaultDescription, defaultOgImage, siteName, siteUrl } from "@/lib/seo";
import { resolveBlogKeywords, resolveBlogMetaDescription } from "@/lib/seo/blog";
import {
  resolvePortfolioKeywords,
  resolvePortfolioMetaDescription,
} from "@/lib/seo/portfolio";
import type { ServicePageContent } from "@/lib/seo/services";
import { serviceOgImagePath } from "@/lib/seo/service-visuals";
import {
  locationCountryCode,
  locationOfficeGeo,
  locationPages,
  type LocationPageContent,
} from "@/lib/seo/locations";
import { careerRoles, ujjainHiringOffice } from "@/lib/seo/careers";

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.path === "/" ? "" : item.path}`,
    })),
  };
}

export function webPageJsonLd({
  title,
  description,
  path,
  type = "WebPage",
}: {
  title: string;
  description: string;
  path: string;
  type?: "WebPage" | "CollectionPage" | "AboutPage" | "ContactPage";
}) {
  return {
    "@context": "https://schema.org",
    "@type": type,
    name: title,
    description,
    url: `${siteUrl}${path === "/" ? "" : path}`,
    isPartOf: { "@id": `${siteUrl}/#website` },
    about: { "@id": `${siteUrl}/#organization` },
    inLanguage: "en",
    publisher: { "@id": `${siteUrl}/#organization` },
  };
}

export function faqJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function servicesCatalogJsonLd() {
  const featured = featuredServices.map((service) => ({
    title: service.title,
    description: service.description,
    url: `${siteUrl}${service.href}`,
  }));

  const additional = allServices.map((service) => ({
    title: service.title,
    description: `${service.title} services by ${siteName}.`,
    url: `${siteUrl}${service.href}`,
  }));

  const unique = new Map<string, { title: string; description: string; url: string }>();
  for (const service of [...featured, ...additional]) {
    if (!unique.has(service.title)) {
      unique.set(service.title, service);
    }
  }

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${siteName} Services`,
    description: "SEO, web development, ecommerce, social media, and AI services.",
    url: `${siteUrl}/services`,
    itemListElement: [...unique.values()].map((service, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: service.url,
      item: {
        "@type": "Service",
        name: service.title,
        description: service.description,
        url: service.url,
        provider: { "@id": `${siteUrl}/#organization` },
        areaServed: ["United Arab Emirates", "India", "United Kingdom"],
      },
    })),
  };
}

export function serviceJsonLd(service: ServicePageContent) {
  const imagePath = serviceOgImagePath(service.slug);

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.metaDescription,
    url: `${siteUrl}/services/${service.slug}`,
    ...(imagePath ? { image: `${siteUrl}${imagePath}` } : {}),
    provider: { "@id": `${siteUrl}/#organization` },
    areaServed: [
      { "@type": "Country", name: "India" },
      { "@type": "Country", name: "United Arab Emirates" },
      { "@type": "Country", name: "Saudi Arabia" },
      { "@type": "Country", name: "Oman" },
      { "@type": "Country", name: "Qatar" },
      { "@type": "Country", name: "Kuwait" },
      { "@type": "Country", name: "Bahrain" },
    ],
    serviceType: service.title,
  };
}

export function contactPageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: `Contact ${siteName}`,
    description: `Contact ${siteName} in Dubai or Ujjain for web development, SEO, and digital marketing.`,
    url: `${siteUrl}/contact`,
    mainEntity: { "@id": `${siteUrl}/#organization` },
  };
}

export function portfolioItemListJsonLd(items: DbPortfolio[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${siteName} Portfolio`,
    description: "Web development, ecommerce, and digital marketing projects.",
    url: `${siteUrl}/portfolio`,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${siteUrl}/portfolio/${item.slug}`,
      item: {
        "@type": "CreativeWork",
        name: item.title,
        description: item.description,
        genre: item.category,
        url: `${siteUrl}/portfolio/${item.slug}`,
        creator: { "@id": `${siteUrl}/#organization` },
        keywords: item.tags?.join(", "),
      },
    })),
  };
}

export function portfolioProjectJsonLd(project: DbPortfolio) {
  const keywords = resolvePortfolioKeywords(project);
  const images = [
    project.image_url,
    project.logo_url,
    ...project.gallery.map((item) => item.url),
  ].filter(Boolean);

  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: resolvePortfolioMetaDescription(project),
    genre: project.category,
    keywords: keywords.join(", "),
    image: images.length > 0 ? images : `${siteUrl}${defaultOgImage.url}`,
    url: `${siteUrl}/portfolio/${project.slug}`,
    creator: { "@id": `${siteUrl}/#organization` },
    ...(project.client_name ? { about: project.client_name } : {}),
    ...(project.project_url ? { sameAs: project.project_url } : {}),
  };
}

export function testimonialsItemListJsonLd(items: DbTestimonial[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${siteName} Client Reviews`,
    description: defaultDescription,
    url: `${siteUrl}/testimonials`,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Review",
        author: {
          "@type": "Person",
          name: item.name,
          jobTitle: item.role,
        },
        reviewBody: item.quote,
        reviewRating: {
          "@type": "Rating",
          ratingValue: item.rating,
          bestRating: 5,
          worstRating: 1,
        },
        itemReviewed: { "@id": `${siteUrl}/#organization` },
      },
    })),
  };
}

export function aboutPageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: `About ${siteName}`,
    description: `Learn about ${siteName} — a web development and digital marketing studio in Dubai and Ujjain.`,
    url: `${siteUrl}/about`,
    mainEntity: { "@id": `${siteUrl}/#organization` },
  };
}

export function foundersJsonLd() {
  return founders.map((founder) => ({
    "@context": "https://schema.org",
    "@type": "Person",
    name: founder.name,
    jobTitle: founder.role,
    description: founder.bio,
    image: `${siteUrl}${founder.image}`,
    url: founder.linkedin,
    sameAs: founder.linkedin ? [founder.linkedin] : undefined,
    worksFor: { "@id": `${siteUrl}/#organization` },
    knowsAbout: founder.focus,
  }));
}

export function blogCollectionJsonLd(posts: DbBlog[]) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${siteName} Blog`,
    description: `Articles on web development, SEO, and digital marketing from ${siteName}.`,
    url: `${siteUrl}/blog`,
    isPartOf: { "@id": `${siteUrl}/#website` },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: posts.map((post, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${siteUrl}/blog/${post.slug}`,
        name: post.title,
      })),
    },
  };
}

/** Person for named authors (with LinkedIn when the author is a founder), else the Organization */
function blogAuthorJsonLd(author: string | null) {
  const name = author?.trim();
  if (!name || name === siteName) return { "@type": "Organization", "@id": `${siteUrl}/#organization`, name: siteName };
  const founder = founders.find((item) => item.name.toLowerCase() === name.toLowerCase());
  return {
    "@type": "Person",
    name,
    ...(founder?.linkedin ? { url: founder.linkedin, sameAs: [founder.linkedin], jobTitle: founder.role } : {}),
    worksFor: { "@id": `${siteUrl}/#organization` },
  };
}

export function blogPostingJsonLd(post: DbBlog) {
  const wordCount = post.content.trim().split(/\s+/).filter(Boolean).length;
  const keywords = resolveBlogKeywords(post);

  const postUrl = `${siteUrl}/blog/${post.slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: resolveBlogMetaDescription(post),
    image: post.cover_image_url || `${siteUrl}${defaultOgImage.url}`,
    keywords: keywords.join(", "),
    datePublished: post.published_at,
    dateModified: post.updated_at || post.published_at,
    wordCount,
    inLanguage: "en",
    url: postUrl,
    author: blogAuthorJsonLd(post.author),
    ...(post.cover_image_url
      ? {
          image: {
            "@type": "ImageObject",
            url: post.cover_image_url,
            caption: post.cover_image_alt || post.title,
          },
        }
      : {}),
    publisher: { "@id": `${siteUrl}/#organization` },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": postUrl,
    },
  };
}

export function locationServiceJsonLd(location: LocationPageContent) {
  const officeGeo = locationOfficeGeo[location.slug];
  const countryCode = locationCountryCode(location);

  // Only our office cities are real local businesses; other cities are a Service with areaServed.
  return {
    "@context": "https://schema.org",
    "@type": officeGeo ? "ProfessionalService" : "Service",
    "@id": `${siteUrl}${location.href}#service`,
    name: `Best IT services in ${location.city}`,
    alternateName: [`Best IT company in ${location.city}`, `${siteName} ${location.city}`],
    description: location.intro,
    url: `${siteUrl}${location.href}`,
    image: `${siteUrl}${defaultOgImage.url}`,
    provider: { "@id": `${siteUrl}/#organization` },
    ...(officeGeo ? { parentOrganization: { "@id": `${siteUrl}/#organization` } } : {}),
    areaServed: {
      "@type": "City",
      name: location.city,
      containedInPlace: {
        "@type": "Country",
        name: location.country,
      },
    },
    ...(officeGeo
      ? {
          address: {
            "@type": "PostalAddress",
            addressLocality: location.city,
            addressRegion: location.region,
            addressCountry: countryCode,
          },
          geo: {
            "@type": "GeoCoordinates",
            latitude: officeGeo.latitude,
            longitude: officeGeo.longitude,
          },
        }
      : {}),
    serviceType: [
      `IT services in ${location.city}`,
      `Web development in ${location.city}`,
      `SEO in ${location.city}`,
      ...allServices.map((service) => service.title),
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `IT services in ${location.city}`,
      itemListElement: allServices.map((service) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: service.title,
          url: `${siteUrl}${service.href}`,
        },
      })),
    },
  };
}

export function locationCollectionJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Best IT services by city",
    description: "City pages for IT services, web development, and digital marketing from Hussaini IT Services.",
    url: `${siteUrl}/best-it-services`,
    numberOfItems: locationPages.length,
    itemListElement: locationPages.map((location, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: `Best IT services in ${location.city}`,
      url: `${siteUrl}${location.href}`,
    })),
  };
}

function careerDescriptionHtml(role: (typeof careerRoles)[number]) {
  const salaryRange = `₹${role.salary.min.toLocaleString("en-IN")}–₹${role.salary.max.toLocaleString("en-IN")}`;
  const officeLine = `${ujjainHiringOffice.streetAddress}, ${ujjainHiringOffice.addressLocality}, ${ujjainHiringOffice.addressRegion} ${ujjainHiringOffice.postalCode}`;

  return [
    `<p>${role.summary}</p>`,
    `<p>This is a ${role.type.toLowerCase()} role at ${officeLine}, India. The work is on-site.</p>`,
    `<p>Focus areas: ${role.focus.join(", ")}.</p>`,
    `<p>Base salary: ${salaryRange} per year, depending on experience.</p>`,
    `<p>Apply by emailing ${companyInfo.email} with the subject "Application: ${role.title}". Include a CV, portfolio or relevant links, and two sentences on why you want to work in Ujjain.</p>`,
  ].join("");
}

export function careersJsonLd() {
  const officeGeo = locationOfficeGeo.ujjain;

  return careerRoles.map((role) => ({
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: role.title,
    description: careerDescriptionHtml(role),
    identifier: {
      "@type": "PropertyValue",
      name: siteName,
      value: role.id,
    },
    datePosted: role.datePosted,
    validThrough: `${role.validThrough}T23:59:59+05:30`,
    employmentType: "FULL_TIME",
    hiringOrganization: {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: siteName,
      sameAs: siteUrl,
      logo: `${siteUrl}/icon-512.png`,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        streetAddress: ujjainHiringOffice.streetAddress,
        addressLocality: ujjainHiringOffice.addressLocality,
        addressRegion: ujjainHiringOffice.addressRegion,
        postalCode: ujjainHiringOffice.postalCode,
        addressCountry: ujjainHiringOffice.addressCountry,
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: officeGeo.latitude,
        longitude: officeGeo.longitude,
      },
    },
    baseSalary: {
      "@type": "MonetaryAmount",
      currency: role.salary.currency,
      value: {
        "@type": "QuantitativeValue",
        minValue: role.salary.min,
        maxValue: role.salary.max,
        unitText: role.salary.unit,
      },
    },
    applicantLocationRequirements: {
      "@type": "Country",
      name: "India",
    },
    directApply: true,
    url: `${siteUrl}/careers#${role.id}`,
    applicationContact: {
      "@type": "ContactPoint",
      email: companyInfo.email,
    },
  }));
}

/** Service schema for a service + city landing page, with the city as areaServed */
export function serviceAreaJsonLd({
  name,
  description,
  path,
  serviceType,
  city,
  region,
  country,
  imagePath,
}: {
  name: string;
  description: string;
  path: string;
  serviceType: string;
  city: string;
  region?: string;
  country: string;
  imagePath?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${siteUrl}${path}#service`,
    name,
    description,
    url: `${siteUrl}${path}`,
    serviceType,
    ...(imagePath ? { image: `${siteUrl}${imagePath}` } : {}),
    provider: { "@id": `${siteUrl}/#organization` },
    areaServed: {
      "@type": "City",
      name: city,
      ...(region && region !== city
        ? {
            containedInPlace: {
              "@type": "AdministrativeArea",
              name: region,
              containedInPlace: { "@type": "Country", name: country },
            },
          }
        : { containedInPlace: { "@type": "Country", name: country } }),
    },
  };
}

/** Generic ItemList of links (hubs, industries, case studies) */
export function linkItemListJsonLd(name: string, path: string, items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    url: `${siteUrl}${path}`,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: `${siteUrl}${item.path}`,
    })),
  };
}
