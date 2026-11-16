import { getLocationPage, isIndiaLocation, locationCountryCode } from "@/lib/seo/locations";
import { getServicePage } from "@/lib/seo/services";

/**
 * Service + city landing pages (/services/[slug]/[city]).
 *
 * Only the combinations listed in `serviceLocationPages` are generated — there is no
 * automatic all-combinations matrix. To add a page, add an entry below; it is picked up by
 * generateStaticParams, the sitemap, llms.txt, the parent service page and the parent city page.
 *
 * TODO(content-review): every entry is a first draft (`reviewStatus: "draft"`). Read each one,
 * edit freely, then set reviewStatus to "approved". Facts used: our offices (Ujjain, Dubai),
 * services in services.ts, and portfolio items in the CMS. No client results, prices or
 * statistics are claimed.
 */

export interface ServiceLocationStep {
  title: string;
  description: string;
}

export interface ServiceLocationAudience {
  title: string;
  description: string;
}

export interface ServiceLocationPage {
  service: string;
  city: string;
  reviewStatus: "draft" | "approved";
  /** 2–3 sentence direct answer to “who is the best <service> company in <city>?” */
  answer: string;
  /** Hero paragraph */
  intro: string;
  /** Local context paragraphs */
  body: string[];
  /** Who it is for in this city (local industries) */
  audience: ServiceLocationAudience[];
  /** Added to the service-level “what’s included” list */
  localIncluded: string[];
  /** Overrides the service-level process when present */
  process?: ServiceLocationStep[];
  nearbyAreas: string[];
  faqs: { question: string; answer: string }[];
  /** 2–3 related blog slugs; unpublished slugs are skipped and topped up with recent posts */
  blogSlugs: string[];
  /** < 155 characters */
  metaDescription: string;
}

/** Per-service labels and defaults shared by every city page of that service */
export interface ServiceLocationServiceConfig {
  /** Used in the H1: “<h1Label> Company in <City>” */
  h1Label: string;
  /** Used in the <title>: “<titleLabel> in <City> | Hussaini IT Services” — keep short */
  titleLabel: string;
  included: string[];
  process: ServiceLocationStep[];
}

export const serviceLocationServices: Record<string, ServiceLocationServiceConfig> = {
  "web-development": {
    h1Label: "Web Development",
    titleLabel: "Web Development Company",
    included: [
      "Discovery call and written scope with timeline",
      "Custom design for desktop and mobile",
      "Build in Next.js, React or WordPress, matched to how you edit content",
      "On-page SEO basics: titles, meta, headings, schema, sitemap",
      "Contact forms, WhatsApp button and call tracking hooks",
      "Hosting setup, launch QA and handover",
    ],
    process: [
      { title: "Discover", description: "Goals, audience, pages and content you already have." },
      { title: "Design", description: "Layouts for the key pages, reviewed with you on a call." },
      { title: "Build", description: "Development, content entry and testing on real phones." },
      { title: "Launch", description: "Go-live, Search Console submission and a handover walkthrough." },
    ],
  },
  seo: {
    h1Label: "SEO",
    titleLabel: "SEO Company",
    included: [
      "Keyword research for your services and service areas",
      "Technical audit: speed, indexing, crawl errors, schema",
      "On-page optimisation of existing pages",
      "New service and location pages where there is real demand",
      "Google Business Profile alignment with the website",
      "Monthly report on rankings, traffic and enquiries",
    ],
    process: [
      { title: "Audit", description: "Technical health, current rankings and competitors." },
      { title: "Plan", description: "Keyword-to-page map and a prioritised fix list." },
      { title: "Optimise", description: "On-page, technical and content work, month by month." },
      { title: "Report", description: "Plain-language monthly report and next month’s plan." },
    ],
  },
  ecommerce: {
    h1Label: "Ecommerce Development",
    titleLabel: "Ecommerce Company",
    included: [
      "Platform choice: Shopify, WooCommerce or custom Next.js",
      "Product catalogue, categories, filters and search",
      "Cart, checkout and the payment gateway you choose",
      "Shipping, Cash on Delivery or WhatsApp ordering rules",
      "Order tracking and admin training",
      "Product schema and SEO-ready category pages",
    ],
    process: [
      { title: "Scope", description: "Catalogue size, payments, delivery and integrations." },
      { title: "Design", description: "Home, category, product and checkout flows." },
      { title: "Build", description: "Store setup, product import and payment testing." },
      { title: "Launch", description: "Live orders test, analytics and team training." },
    ],
  },
  "google-business-profile": {
    h1Label: "Google Business Profile Management",
    titleLabel: "Google Business Profile",
    included: [
      "Profile setup, claim or verification support",
      "Primary and secondary categories, services and attributes",
      "Business description, hours and service areas",
      "Photo set guidance and regular Google posts",
      "Review request process and reply drafts for your approval",
      "Name, address and phone kept consistent with your website",
    ],
    process: [
      { title: "Audit", description: "Current listing, duplicates, categories and competitors." },
      { title: "Fix", description: "Correct details, categories, photos and service areas." },
      { title: "Activate", description: "Posts, review requests and Q&A on a regular schedule." },
      { title: "Review", description: "Monthly look at calls, direction requests and views." },
    ],
  },
};

export const serviceLocationPages: ServiceLocationPage[] = [
  // ---------------------------------------------------------------- web-development
  {
    service: "web-development",
    city: "ujjain",
    reviewStatus: "draft",
    answer:
      "Hussaini IT Services is a web development company with its India office in Ujjain, Madhya Pradesh. We design and build business websites, ecommerce stores and web apps in-house, with a named owner on every project. The best company for you depends on your brief, so compare portfolios and ask every shortlist for a written scope and timeline.",
    intro:
      "Websites for Ujjain businesses, built by a team that works in Ujjain — fast on mobile, clear about what you sell, and ready for local search.",
    body: [
      "Ujjain search traffic is a mix of residents, pilgrims visiting Mahakaleshwar, and buyers from Indore and Dewas. A hotel, a jeweller and a property dealer each need a different site structure. We plan the pages around who is searching and what they need to see before they call or WhatsApp you.",
      "Our Ujjain portfolio includes a real estate website, a jewellery ecommerce store, a tour and travels site, and a custom management platform for a local community organisation. You can visit the office, meet the people building your site, and get updates on WhatsApp.",
    ],
    audience: [
      { title: "Hotels, homestays & dharamshalas", description: "Room pages, WhatsApp enquiry and Maps-ready details for visitors to Mahakal." },
      { title: "Jewellers & retail shops", description: "Catalogue or ecommerce sites with price breakups and product photos." },
      { title: "Real estate & builders", description: "Property listings, project pages and lead forms for local buyers." },
      { title: "Travel & taxi operators", description: "Packages, routes, fleet pages and quick booking enquiry." },
    ],
    localIncluded: [
      "Hindi and English content support",
      "Pages for the Ujjain areas and nearby towns you serve",
    ],
    nearbyAreas: ["Dewas", "Indore", "Nagda", "Shajapur", "Mahidpur", "Badnagar", "Tarana"],
    faqs: [
      {
        question: "Where is your web development office in Ujjain?",
        answer:
          "Our India office is in Ujjain, Madhya Pradesh. Call or WhatsApp to arrange a visit; most project updates then run on WhatsApp and calls.",
      },
      {
        question: "How long does a website take for an Ujjain business?",
        answer:
          "A focused business website usually takes 2–6 weeks after we have your content and approvals. Ecommerce stores and web apps take longer and are scoped in writing.",
      },
      {
        question: "Can you build a website for a hotel near Mahakal Temple?",
        answer:
          "Yes. Room or package pages, WhatsApp and call buttons, an enquiry form, and a Google Business Profile that matches the site are the usual core for visitor-facing businesses.",
      },
      {
        question: "Can I update the website myself after launch?",
        answer:
          "Yes. We set up an editor that suits your team — WordPress, a headless CMS, or a simple admin — and walk you through it at handover.",
      },
      {
        question: "Do you also handle SEO and Google Maps in Ujjain?",
        answer:
          "Yes. Every site launches with on-page SEO basics. Ongoing SEO and Google Business Profile management are available as separate services.",
      },
    ],
    blogSlugs: [
      "website-development-cost-in-ujjain",
      "every-business-in-ujjain-needs-online-presence-before-simhastha-2028",
      "best-it-services-in-ujjain",
    ],
    metaDescription:
      "Web development company in Ujjain: business websites, ecommerce and web apps built by our Ujjain team. Mobile-first, SEO-ready, Hindi and English.",
  },
  {
    service: "web-development",
    city: "indore",
    reviewStatus: "draft",
    answer:
      "Hussaini IT Services builds websites for Indore businesses from our Madhya Pradesh office in Ujjain, about an hour away. We handle design, development and launch in-house and can meet in Indore for kickoffs. Shortlist two or three companies, compare live work, and choose the one that gives you a clear written scope.",
    intro:
      "Business websites, web apps and online stores for Indore startups and growing firms — built by a nearby MP team, with in-person kickoffs when useful.",
    body: [
      "Indore is Madhya Pradesh’s commercial capital: startups, manufacturers around Pithampur and Sanwer Road, coaching institutes, hospitals and a busy D2C scene. Buyers compare you against Pune and Bengaluru-quality sites, so speed, clean design and clear calls to action matter.",
      "We are close enough to meet at your office in Vijay Nagar, Palasia or AB Road for a kickoff, and remote-friendly for everything after that. You get a named owner, a written scope and progress you can see on a staging link.",
    ],
    audience: [
      { title: "Startups & D2C brands", description: "Fast marketing sites and stores that convert ad and social traffic." },
      { title: "Manufacturers & industrial suppliers", description: "Capability, product catalogue and RFQ pages for B2B buyers." },
      { title: "Coaching & education", description: "Course pages, batch schedules and admission enquiry forms." },
      { title: "Clinics & hospitals", description: "Doctor profiles, departments and appointment requests." },
    ],
    localIncluded: [
      "In-person kickoff in Indore on request",
      "Hindi and English content support",
    ],
    nearbyAreas: ["Pithampur", "Dewas", "Ujjain", "Mhow", "Sanwer", "Rau", "Dhar"],
    faqs: [
      {
        question: "Do you have an office in Indore?",
        answer:
          "Our India office is in Ujjain, about an hour from Indore. We can meet in Indore for a kickoff or review; daily work runs on WhatsApp and calls.",
      },
      {
        question: "Which technology do you use for Indore business websites?",
        answer:
          "Next.js or React for performance-focused sites and web apps, WordPress when your team wants a familiar editor, and Shopify or WooCommerce for stores.",
      },
      {
        question: "Can you build a product catalogue site for a Pithampur manufacturer?",
        answer:
          "Yes. Product and capability pages, downloadable data sheets and an RFQ form, with an admin so your team can add products.",
      },
      {
        question: "Do you redesign existing websites without losing Google rankings?",
        answer:
          "Yes. We map old URLs to new ones, set up 301 redirects and keep the pages that already rank before launch.",
      },
    ],
    blogSlugs: [
      "how-long-should-a-business-website-really-take-to-build",
      "professional-website-benefits-small-businesses",
      "get-more-customers-online-2026-small-business-guide",
    ],
    metaDescription:
      "Web development company for Indore: business websites, stores and web apps by our MP team in nearby Ujjain. In-person kickoffs, SEO-ready builds.",
  },
  {
    service: "web-development",
    city: "bhopal",
    reviewStatus: "draft",
    answer:
      "Hussaini IT Services is a Madhya Pradesh web development company with its office in Ujjain, serving Bhopal clients remotely and in person for kickoffs. We design, build and launch websites in-house with a named owner. The right partner is the one whose past work and written scope match your project.",
    intro:
      "Credible, fast websites for Bhopal institutions, clinics, builders and consultants — designed and built by our Madhya Pradesh team.",
    body: [
      "As the state capital, Bhopal has many organisations that are judged on trust: coaching institutes, hospitals, NGOs, builders and firms that supply government departments. Their websites need clear information, up-to-date contact details and pages that work on any phone.",
      "We serve Bhopal from our Ujjain office. Discovery and reviews can run on video calls, with a visit for kickoff when it helps. Content can be in Hindi, English or both.",
    ],
    audience: [
      { title: "Coaching institutes & colleges", description: "Course, faculty and admission pages with enquiry forms." },
      { title: "Hospitals & clinics", description: "Departments, doctors and appointment request flows." },
      { title: "Builders & real estate", description: "Project pages, floor plans and lead capture." },
      { title: "Consultants & government suppliers", description: "Corporate profiles with credentials and tender-ready information." },
    ],
    localIncluded: [
      "Hindi and English content support",
      "Locality pages for Bhopal areas you serve",
    ],
    nearbyAreas: ["Sehore", "Raisen", "Vidisha", "Mandideep", "Narmadapuram", "Obaidullaganj"],
    faqs: [
      {
        question: "Do you have an office in Bhopal?",
        answer:
          "No. Our India office is in Ujjain. We serve Bhopal remotely and can travel for a kickoff or review when the project needs it.",
      },
      {
        question: "Can you build a bilingual Hindi and English website?",
        answer:
          "Yes. We can set up separate language versions with their own URLs, so both can be found in Google search.",
      },
      {
        question: "Can you make a website for a coaching institute in Bhopal?",
        answer:
          "Yes. Course pages, batch timings, faculty profiles and an admission enquiry form are a typical start. Results pages are added with the data you provide.",
      },
      {
        question: "What do I need to prepare before the project starts?",
        answer:
          "Your logo, a list of services, contact details and any photos you have. We help structure the rest of the content during discovery.",
      },
    ],
    blogSlugs: [
      "professional-website-benefits-small-businesses",
      "how-long-should-a-business-website-really-take-to-build",
      "get-more-customers-online-2026-small-business-guide",
    ],
    metaDescription:
      "Web development for Bhopal institutions, clinics and builders. Fast, bilingual-ready websites from our Madhya Pradesh team in Ujjain.",
  },
  {
    service: "web-development",
    city: "dubai",
    reviewStatus: "draft",
    answer:
      "Hussaini IT Services is a web development company with an office in Dubai and a delivery team in India. We build corporate websites, ecommerce stores and web apps for UAE businesses, with English and Arabic-ready layouts. Compare portfolios and ask for a written scope — the best company is the one that fits your brief and budget.",
    intro:
      "Corporate websites, ecommerce and web apps for Dubai companies — designed for UAE buyers, built fast, and ready for Arabic.",
    body: [
      "Dubai buyers check your website before they reply to a quote. Trading companies, contractors, clinics and real estate brokers all need the same basics: a clear offer, proof of work, fast mobile pages and an obvious way to WhatsApp or call.",
      "Our UAE work includes a Dubai hardware and tools supplier website with an enquiry cart, a UAE ecommerce store with Cash on Delivery, and a corporate site for a metal coating company. Projects are led from our Dubai office with development support from our India team.",
    ],
    audience: [
      { title: "Trading & supply companies", description: "Product catalogues with enquiry carts and quote requests." },
      { title: "Contractors & industrial services", description: "Capability, project and certification pages for procurement teams." },
      { title: "Real estate brokers", description: "Listings, area guides and lead forms that sync with your CRM." },
      { title: "Clinics, salons & local services", description: "Booking requests, service pages and Maps-ready details." },
    ],
    localIncluded: [
      "RTL-ready layouts for Arabic content",
      "Meetings in Dubai after the first call",
    ],
    nearbyAreas: ["Business Bay", "Deira", "Al Quoz", "JLT", "Dubai Silicon Oasis", "Sharjah", "Ajman"],
    faqs: [
      {
        question: "Do you have an office in Dubai?",
        answer:
          "Yes. We have an office in Dubai and another in Ujjain, India. Dubai clients can meet us after the first call; daily work runs on WhatsApp and calls.",
      },
      {
        question: "Can you build an Arabic and English website?",
        answer:
          "Yes. We build RTL layouts and separate language URLs. Arabic copywriting or translation is scoped separately if you need us to source it.",
      },
      {
        question: "How long does a website take in Dubai?",
        answer:
          "A focused corporate website is usually 2–6 weeks once content is ready. Ecommerce and web apps are scoped and timed in the proposal.",
      },
      {
        question: "Can you connect the website to our CRM?",
        answer:
          "Yes. We connect forms to the CRM or email tools you use, or build a custom CRM if off-the-shelf tools do not fit.",
      },
      {
        question: "Do you work with free-zone and mainland companies?",
        answer:
          "Yes. We work with both. Contracting and invoicing details are confirmed in the proposal.",
      },
    ],
    blogSlugs: [
      "website-development-company-dubai",
      "how-to-generate-more-leads-for-your-business-in-dubai",
      "local-seo-guide-for-businesses-in-dubai",
    ],
    metaDescription:
      "Web development company in Dubai: corporate websites, ecommerce and web apps with Arabic-ready layouts. Dubai office, India delivery team.",
  },
  {
    service: "web-development",
    city: "riyadh",
    reviewStatus: "draft",
    answer:
      "Hussaini IT Services builds websites for Riyadh companies remotely from our Dubai office, with development support from our India team. We deliver bilingual, RTL-ready sites and web apps with a named project owner. For any Riyadh project, compare live work and ask each company how they handle Arabic content and hosting.",
    intro:
      "Bilingual corporate websites and web apps for Riyadh companies — RTL-ready, fast and easy for your team to update.",
    body: [
      "Riyadh is where many Saudi head offices, contractors and fast-growing service companies are based. Their websites often have to satisfy several audiences at once: procurement teams, investors, job seekers and customers, in Arabic and English.",
      "We are a UAE/India studio and do not have a Riyadh office, so projects are remote-first from Dubai on Saudi working hours. Contracting and invoicing terms are confirmed in each proposal.",
    ],
    audience: [
      { title: "Construction & contracting", description: "Project portfolios, capability statements and pre-qualification pages." },
      { title: "Professional services", description: "Team, credentials and service pages for consultancies and firms." },
      { title: "Healthcare", description: "Departments, doctors and appointment requests." },
      { title: "Retail & franchises", description: "Branch locators, offers and links to online ordering." },
    ],
    localIncluded: [
      "RTL Arabic layout with separate language URLs",
      "Calls scheduled in Saudi working hours",
    ],
    nearbyAreas: ["Olaya", "Al Malqa", "King Abdullah Financial District", "Diriyah", "Al Kharj"],
    faqs: [
      {
        question: "Do you have an office in Riyadh?",
        answer:
          "No. We serve Riyadh remotely from our Dubai office, with calls in Saudi working hours.",
      },
      {
        question: "Can you build a full Arabic version of our website?",
        answer:
          "Yes. We build RTL layouts and place your Arabic content. If you need Arabic copywriting, we scope it separately.",
      },
      {
        question: "Where will the website be hosted?",
        answer:
          "We recommend hosting based on your audience and any data requirements you have, and document the setup at handover.",
      },
      {
        question: "Can you redesign our current Riyadh company website?",
        answer:
          "Yes. We audit the current site, keep what ranks, and set up redirects so search traffic is not lost.",
      },
    ],
    blogSlugs: [
      "how-long-should-a-business-website-really-take-to-build",
      "google-ai-overviews-ai-mode-seo-uae-india-2026",
      "professional-website-benefits-small-businesses",
    ],
    metaDescription:
      "Web development for Riyadh companies: bilingual RTL websites and web apps, delivered remotely from our Dubai office on Saudi working hours.",
  },
  {
    service: "web-development",
    city: "jeddah",
    reviewStatus: "draft",
    answer:
      "Hussaini IT Services builds websites for Jeddah businesses remotely from our Dubai office. We deliver Arabic and English-ready sites for trading companies, retailers and hospitality brands, with a named project owner. Compare portfolios and written scopes before choosing any Jeddah web partner.",
    intro:
      "Websites for Jeddah trading companies, retailers, hotels and travel operators — fast, bilingual-ready and built around how your customers contact you.",
    body: [
      "Jeddah is a port city and the main gateway for visitors heading to Makkah and Madinah. Importers, distributors, hotels, Umrah and travel operators and retailers all compete online, often for customers who search on a phone in more than one language.",
      "We have built tour and travels and hospitality-facing websites for a pilgrimage city in India, and trading and ecommerce sites in the UAE. Jeddah projects are run remotely from Dubai with WhatsApp updates.",
    ],
    audience: [
      { title: "Importers & distributors", description: "Product ranges, brand pages and quote requests for trade buyers." },
      { title: "Hotels & serviced apartments", description: "Room pages and enquiry flows for visitors." },
      { title: "Umrah & travel operators", description: "Package pages, WhatsApp contact and multilingual-ready structure." },
      { title: "Retailers", description: "Catalogues or full online stores with local delivery options." },
    ],
    localIncluded: [
      "RTL Arabic layout with separate language URLs",
      "WhatsApp-first enquiry flows",
    ],
    nearbyAreas: ["Makkah", "Rabigh", "Taif", "King Abdullah Economic City", "Al Balad"],
    faqs: [
      {
        question: "Do you have an office in Jeddah?",
        answer:
          "No. We serve Jeddah remotely from our Dubai office, with calls scheduled in Saudi working hours.",
      },
      {
        question: "Can you build a website for an Umrah travel company in Jeddah?",
        answer:
          "Yes. Package pages, an enquiry form and WhatsApp contact are the usual core. Licensing and package details come from you.",
      },
      {
        question: "Can the site be in Arabic and English?",
        answer:
          "Yes. We build RTL layouts with separate URLs for each language so both can rank in search.",
      },
      {
        question: "How do Jeddah projects start?",
        answer:
          "With a video call, then a written scope, price and timeline. Work begins only after you approve it.",
      },
    ],
    blogSlugs: [
      "professional-website-benefits-small-businesses",
      "get-more-customers-online-2026-small-business-guide",
      "how-long-should-a-business-website-really-take-to-build",
    ],
    metaDescription:
      "Web development for Jeddah trading, retail, hotel and travel businesses. Arabic and English-ready websites, delivered remotely from Dubai.",
  },
  // ---------------------------------------------------------------- seo
  {
    service: "seo",
    city: "ujjain",
    reviewStatus: "draft",
    answer:
      "Hussaini IT Services is an SEO company based in Ujjain, Madhya Pradesh, with a second office in Dubai. We do keyword research, technical fixes, local SEO and Google Business Profile work in-house and report monthly. Ask any SEO company in Ujjain to show you what they would change on your site first — and avoid anyone who guarantees rankings.",
    intro:
      "Local SEO for Ujjain businesses — so residents, pilgrims and buyers from nearby towns find you on Google Search and Maps.",
    body: [
      "Ujjain searches spike around festivals and pilgrim seasons and will grow ahead of Simhastha 2028. Hotels, travel operators, restaurants, jewellers and property dealers who rank in the Maps pack and the first few results get most of those calls.",
      "We focus on winnable terms: your service plus Ujjain, your service plus nearby areas, and the questions visitors actually ask. You get a written plan, monthly work and a plain-language report, from a team you can meet in Ujjain.",
    ],
    audience: [
      { title: "Hotels, homestays & travel", description: "Rank for stays and taxis near Mahakal and visitor searches." },
      { title: "Jewellers & retailers", description: "Product and category pages that show up for local shopping searches." },
      { title: "Real estate", description: "Area and project pages for property searches in Ujjain." },
      { title: "Clinics & professionals", description: "Service pages and Maps visibility for local enquiries." },
    ],
    localIncluded: [
      "Hindi and English keyword research",
      "Seasonal planning around festivals and Simhastha 2028",
    ],
    nearbyAreas: ["Dewas", "Indore", "Nagda", "Shajapur", "Mahidpur", "Badnagar"],
    faqs: [
      {
        question: "How long does SEO take to work in Ujjain?",
        answer:
          "Fixes and Google Business Profile changes can show within weeks. Ranking for competitive terms usually takes three to six months of steady work.",
      },
      {
        question: "Do you guarantee first-page rankings?",
        answer:
          "No. Nobody controls Google’s results. We commit to the work plan, transparent reporting and the terms we believe are winnable.",
      },
      {
        question: "Can SEO help my hotel get more bookings during Simhastha?",
        answer:
          "It can help you be found. Start early: pages and reviews need time to build before demand peaks.",
      },
      {
        question: "Do you also manage our Google Maps listing?",
        answer:
          "Yes. Local SEO and Google Business Profile work go together, and we keep both consistent with your website.",
      },
    ],
    blogSlugs: [
      "best-it-services-in-ujjain",
      "importance-of-google-business-profile-for-local-businesses",
      "every-business-in-ujjain-needs-online-presence-before-simhastha-2028",
    ],
    metaDescription:
      "SEO company in Ujjain: local SEO, Google Maps and technical fixes from our Ujjain team. Honest plans, monthly reports, no ranking guarantees.",
  },
  {
    service: "seo",
    city: "indore",
    reviewStatus: "draft",
    answer:
      "Hussaini IT Services provides SEO for Indore businesses from our Madhya Pradesh office in Ujjain. We run technical audits, on-page optimisation, local SEO and content in-house with monthly reporting. When comparing SEO companies in Indore, ask for a sample audit of your site and a clear list of monthly deliverables.",
    intro:
      "SEO for Indore’s competitive categories — technical fixes, service and locality pages, and local search, from a nearby MP team.",
    body: [
      "Indore is one of the most competitive search markets in Madhya Pradesh. Coaching institutes, hospitals, real estate, startups and D2C brands all bid for the same terms. Winning usually comes from a strong technical base, pages for the specific services and localities you serve, and steady content.",
      "We start with an audit and a keyword-to-page plan, then work through it month by month. Meetings in Indore can be arranged for reviews.",
    ],
    audience: [
      { title: "Coaching & education", description: "Course and locality pages for high-intent student searches." },
      { title: "Healthcare", description: "Department and doctor pages with local search signals." },
      { title: "Real estate", description: "Project, area and listing pages for property searches." },
      { title: "Startups & D2C", description: "Category and content SEO alongside paid campaigns." },
    ],
    localIncluded: [
      "Locality keyword research for Indore areas",
      "Competitor review for your category in Indore",
    ],
    nearbyAreas: ["Vijay Nagar", "Palasia", "Rau", "Pithampur", "Dewas", "Ujjain"],
    faqs: [
      {
        question: "Is SEO in Indore harder than in smaller MP cities?",
        answer:
          "Usually, yes. More businesses compete for the same terms, so we pair main keywords with locality and long-tail pages that can rank sooner.",
      },
      {
        question: "What do you report on each month?",
        answer:
          "Rankings for agreed keywords, organic traffic, enquiries from search where tracking allows, what we did, and next month’s plan.",
      },
      {
        question: "Can you do SEO on a website another agency built?",
        answer:
          "Yes. We audit it first. If something blocks SEO, such as speed or indexing, we explain the fix before starting monthly work.",
      },
      {
        question: "Do you write content as part of SEO?",
        answer:
          "Yes, where it helps. Content is planned against real searches and reviewed by you before it goes live.",
      },
    ],
    blogSlugs: [
      "google-ai-overviews-ai-mode-seo-uae-india-2026",
      "importance-of-google-business-profile-for-local-businesses",
      "get-more-customers-online-2026-small-business-guide",
    ],
    metaDescription:
      "SEO company for Indore: technical audits, locality pages, local SEO and content from our nearby Madhya Pradesh team, with monthly reports.",
  },
  {
    service: "seo",
    city: "dubai",
    reviewStatus: "draft",
    answer:
      "Hussaini IT Services is an SEO company with an office in Dubai, working with UAE businesses on technical SEO, local SEO and content. We report monthly and do not guarantee rankings. In a market as competitive as Dubai, choose an SEO partner who shows you a specific plan for your site before you sign.",
    intro:
      "SEO for Dubai businesses — technical fixes, service and area pages, and Google Maps visibility in one of the most competitive markets in the region.",
    body: [
      "Dubai search results are crowded with large brands and aggregators. Smaller firms win by targeting specific services plus specific areas — Business Bay, Deira, Al Quoz, JLT — and by having a fast, technically clean site that Google trusts.",
      "We work from our Dubai office. Monthly work covers technical health, on-page improvements, new pages where there is demand, and Google Business Profile, with a written report each month.",
    ],
    audience: [
      { title: "Trading & B2B suppliers", description: "Product and category pages that rank for buyer searches." },
      { title: "Real estate brokers", description: "Area and property-type pages for competitive Dubai searches." },
      { title: "Clinics & wellness", description: "Service pages and Maps visibility for local demand." },
      { title: "Contractors & maintenance", description: "Service-plus-area pages for high-intent searches." },
    ],
    localIncluded: [
      "English and Arabic keyword research",
      "Area pages for the Dubai communities you serve",
    ],
    nearbyAreas: ["Business Bay", "Deira", "Al Quoz", "JLT", "Dubai Marina", "Sharjah", "Ajman"],
    faqs: [
      {
        question: "How much does SEO cost in Dubai?",
        answer:
          "It depends on your site and competition. We quote a fixed monthly scope after an audit, so you know exactly what is included.",
      },
      {
        question: "Can you do Arabic SEO?",
        answer:
          "We can research Arabic keywords and optimise Arabic pages you provide. Arabic copywriting is scoped separately if needed.",
      },
      {
        question: "How soon will we see results?",
        answer:
          "Technical and Maps fixes can help within weeks. Competitive Dubai keywords typically take several months of steady work.",
      },
      {
        question: "Do you optimise for Google AI Overviews?",
        answer:
          "We structure pages with clear answers, schema and strong topical coverage, which helps with both classic results and AI features. No one can guarantee inclusion.",
      },
    ],
    blogSlugs: [
      "local-seo-guide-for-businesses-in-dubai",
      "google-ai-overviews-ai-mode-seo-uae-india-2026",
      "how-to-generate-more-leads-for-your-business-in-dubai",
    ],
    metaDescription:
      "SEO company in Dubai: technical SEO, area pages, Arabic keyword research and Google Maps from our Dubai office. Monthly reports, honest plans.",
  },
  {
    service: "seo",
    city: "riyadh",
    reviewStatus: "draft",
    answer:
      "Hussaini IT Services provides SEO for Riyadh companies remotely from our Dubai office. We handle technical SEO, Arabic and English keyword research, on-page work and Google Business Profile, with monthly reporting. Ask any Riyadh SEO provider how they will handle Arabic pages and what exactly they deliver each month.",
    intro:
      "Bilingual SEO for Riyadh companies — technical foundations, Arabic and English keyword targeting, and local search for each branch.",
    body: [
      "Saudi searches happen in both Arabic and English, and the split varies by industry. B2B buyers often search in English; consumers more often in Arabic. A good SEO plan for Riyadh maps keywords to the right language version of each page.",
      "We work remotely from Dubai on Saudi working hours. You get an audit, a keyword-to-page map for both languages and monthly progress reports.",
    ],
    audience: [
      { title: "Construction & contracting", description: "Service and project pages for B2B searches." },
      { title: "Healthcare groups", description: "Branch, department and doctor pages with local signals." },
      { title: "Retail & franchises", description: "Branch pages and Google Business Profiles for each location." },
      { title: "Professional services", description: "Topical content that builds authority for competitive terms." },
    ],
    localIncluded: [
      "Arabic and English keyword mapping",
      "hreflang setup between language versions",
    ],
    nearbyAreas: ["Olaya", "Al Malqa", "King Abdullah Financial District", "Diriyah", "Al Kharj"],
    faqs: [
      {
        question: "Do you have an SEO team in Riyadh?",
        answer:
          "No. We work remotely from our Dubai office, with calls in Saudi working hours.",
      },
      {
        question: "Should our Saudi site target Arabic or English keywords?",
        answer:
          "Usually both, on separate language pages. Research shows which language your buyers use for each service.",
      },
      {
        question: "Can you manage Google Business Profiles for several Riyadh branches?",
        answer:
          "Yes. Each branch gets its own accurate listing and, where useful, its own page on the website.",
      },
      {
        question: "How do you report progress?",
        answer:
          "A monthly report with rankings, organic traffic, enquiries where tracked, the work completed and next month’s plan.",
      },
    ],
    blogSlugs: [
      "google-ai-overviews-ai-mode-seo-uae-india-2026",
      "get-more-customers-online-2026-small-business-guide",
      "importance-of-google-business-profile-for-local-businesses",
    ],
    metaDescription:
      "SEO for Riyadh companies: Arabic and English keyword research, technical SEO and branch listings, delivered remotely from our Dubai office.",
  },
  // ---------------------------------------------------------------- ecommerce
  {
    service: "ecommerce",
    city: "dubai",
    reviewStatus: "draft",
    answer:
      "Hussaini IT Services is an ecommerce development company with an office in Dubai. We build Shopify, WooCommerce and custom Next.js stores with Cash on Delivery, WhatsApp ordering and the payment gateway you choose. Compare live stores each company has built before deciding.",
    intro:
      "Online stores for Dubai brands and traders — Shopify, WooCommerce or custom — with checkout, delivery and WhatsApp ordering set up for UAE shoppers.",
    body: [
      "UAE shoppers expect fast mobile checkout, Cash on Delivery for many categories, and a WhatsApp option when they have a question. Trading companies often need something different: an enquiry cart where buyers request a quote rather than pay online.",
      "We have built both in the UAE — a consumer store with Cash on Delivery and WhatsApp orders, and a hardware and tools supplier site with a filterable shop and enquiry cart. Projects are led from our Dubai office.",
    ],
    audience: [
      { title: "D2C & lifestyle brands", description: "Branded stores built to convert social and ad traffic." },
      { title: "Trading & hardware suppliers", description: "Catalogues with enquiry carts and quote requests." },
      { title: "Online-first sellers", description: "Fast stores with Cash on Delivery and WhatsApp ordering." },
      { title: "Retailers going online", description: "Store setup alongside your existing shop and stock." },
    ],
    localIncluded: [
      "Cash on Delivery and WhatsApp order flows",
      "Arabic-ready storefront layouts",
    ],
    nearbyAreas: ["Sharjah", "Ajman", "Abu Dhabi", "Deira", "Al Quoz"],
    faqs: [
      {
        question: "Which payment gateways can you set up in the UAE?",
        answer:
          "We integrate the gateway you choose and are approved for. Gateway contracts and approvals are between your business and the provider.",
      },
      {
        question: "Shopify or a custom store — which is better?",
        answer:
          "Shopify is fastest to launch and easy to manage. Custom Next.js stores suit unusual pricing, B2B rules or tight performance needs. We recommend one after scoping.",
      },
      {
        question: "Can customers order on WhatsApp instead of checking out?",
        answer:
          "Yes. We can add a WhatsApp order button that sends the cart details to your team, alongside or instead of online payment.",
      },
      {
        question: "Can you import our existing product list?",
        answer:
          "Yes. We import products from a spreadsheet or your current platform and check images, variants and prices before launch.",
      },
    ],
    blogSlugs: [
      "how-to-generate-more-leads-for-your-business-in-dubai",
      "get-more-customers-online-2026-small-business-guide",
      "website-development-company-dubai",
    ],
    metaDescription:
      "Ecommerce development in Dubai: Shopify, WooCommerce and custom stores with Cash on Delivery and WhatsApp ordering, from our Dubai office.",
  },
  {
    service: "ecommerce",
    city: "riyadh",
    reviewStatus: "draft",
    answer:
      "Hussaini IT Services builds online stores for Riyadh brands remotely from our Dubai office. We set up Shopify, WooCommerce or custom stores with Arabic-ready storefronts and the payment and delivery options you choose. Ask any ecommerce company in Riyadh to show live stores and explain who will maintain yours after launch.",
    intro:
      "Ecommerce stores for Riyadh brands and retailers — Arabic-ready storefronts, local payment and delivery options, and an admin your team can run.",
    body: [
      "Saudi ecommerce has grown quickly, and shoppers expect polished Arabic storefronts, fast mobile checkout and familiar payment methods. Brands moving from Instagram selling or physical stores need a store that is easy to run day to day.",
      "We work remotely from our Dubai office and draw on ecommerce stores we have built in the UAE and India. Payment gateway approvals and local compliance stay with your business; we handle the build and integration.",
    ],
    audience: [
      { title: "Fashion & lifestyle brands", description: "Visual stores with size guides, variants and lookbooks." },
      { title: "Retail chains", description: "Online stores that sit alongside branch operations." },
      { title: "Instagram sellers", description: "A proper store to replace DM-based ordering." },
      { title: "Food & gifts", description: "Delivery-zone rules, scheduling and gift options." },
    ],
    localIncluded: [
      "Arabic RTL storefront",
      "Calls scheduled in Saudi working hours",
    ],
    nearbyAreas: ["Olaya", "Al Malqa", "Diriyah", "Al Kharj", "Jeddah", "Dammam"],
    faqs: [
      {
        question: "Can you build a Saudi store in Arabic?",
        answer:
          "Yes. We build RTL storefronts and place your Arabic product content. Arabic copywriting is scoped separately if needed.",
      },
      {
        question: "Which payment methods can the store accept?",
        answer:
          "Whichever your business is approved for with a payment provider. We integrate and test them; contracts stay with you.",
      },
      {
        question: "Do you have an office in Riyadh?",
        answer:
          "No. We work remotely from our Dubai office, with Saudi-hours calls and WhatsApp updates.",
      },
      {
        question: "Who manages the store after launch?",
        answer:
          "Your team, after training. We also offer maintenance retainers for updates, apps and performance.",
      },
    ],
    blogSlugs: [
      "get-more-customers-online-2026-small-business-guide",
      "professional-website-benefits-small-businesses",
      "how-long-should-a-business-website-really-take-to-build",
    ],
    metaDescription:
      "Ecommerce development for Riyadh brands: Arabic-ready Shopify, WooCommerce or custom stores, delivered remotely from our Dubai office.",
  },
  {
    service: "ecommerce",
    city: "indore",
    reviewStatus: "draft",
    answer:
      "Hussaini IT Services builds ecommerce stores for Indore brands from our Madhya Pradesh office in Ujjain. We have launched fashion, watch, jewellery and Ayurvedic product stores in India using Next.js and WooCommerce. Compare live stores and the admin experience before choosing an ecommerce company in Indore.",
    intro:
      "Online stores for Indore D2C brands, retailers and wholesalers — fast mobile checkout, Indian payment gateways and order tracking.",
    body: [
      "Indore has a strong trading culture and a growing number of D2C brands in apparel, food, cosmetics and home goods. Many start on Instagram or marketplaces and then want their own store to keep margins and customer data.",
      "Our India ecommerce work includes a premium cotton menswear store, an online watch store, a jewellery store with price breakups and an Ayurvedic products shop. We can meet in Indore for kickoff and run the rest remotely.",
    ],
    audience: [
      { title: "Apparel & fashion brands", description: "Size, colour and variant handling with fast product pages." },
      { title: "Food & namkeen brands", description: "Shipping zones, pack sizes and order tracking." },
      { title: "Wholesalers", description: "B2B pricing, minimum order quantities or WhatsApp ordering." },
      { title: "Retailers going online", description: "A store that matches your shop’s stock and offers." },
    ],
    localIncluded: [
      "Indian payment gateway and Cash on Delivery setup",
      "In-person kickoff in Indore on request",
    ],
    nearbyAreas: ["Ujjain", "Dewas", "Pithampur", "Mhow", "Dhar"],
    faqs: [
      {
        question: "Which ecommerce platform is best for an Indore brand?",
        answer:
          "WooCommerce or Shopify for most catalogues; a custom Next.js store when you need unusual pricing or top performance. We recommend after scoping.",
      },
      {
        question: "Can you integrate Razorpay or other Indian gateways?",
        answer:
          "Yes. We integrate the gateway your business is approved for and test live payments before launch.",
      },
      {
        question: "Can you set up order tracking for customers?",
        answer:
          "Yes. Customers can see order status, and we can connect shipping partners you use.",
      },
      {
        question: "Can we move from a marketplace to our own store?",
        answer:
          "Yes. We import your product data and plan launch campaigns with you so existing customers know where to find you.",
      },
    ],
    blogSlugs: [
      "get-more-customers-online-2026-small-business-guide",
      "professional-website-benefits-small-businesses",
      "how-long-should-a-business-website-really-take-to-build",
    ],
    metaDescription:
      "Ecommerce development for Indore brands: fast stores with Indian payment gateways, COD and order tracking, from our MP team in nearby Ujjain.",
  },
  // ---------------------------------------------------------------- google-business-profile
  {
    service: "google-business-profile",
    city: "ujjain",
    reviewStatus: "draft",
    answer:
      "Hussaini IT Services manages Google Business Profiles for Ujjain businesses from our office in Ujjain. We fix categories, details and photos, post regularly and set up an honest review process. Whoever you choose, make sure they never buy or fake reviews — that can get a listing suspended.",
    intro:
      "Google Business Profile setup and management for Ujjain shops, hotels, clinics and services — so you show up correctly on Google Maps.",
    body: [
      "When visitors to Ujjain search “hotel near Mahakal” or residents search “jeweller near me”, Google Maps decides who gets the call. Wrong categories, old phone numbers, missing photos and unanswered reviews quietly send those customers elsewhere.",
      "We are based in Ujjain, so we understand the areas, landmarks and seasonal rush. We fix your listing, keep it active with posts and photos, and help you collect genuine reviews.",
    ],
    audience: [
      { title: "Hotels & homestays", description: "Accurate location, photos and booking links for visitors." },
      { title: "Shops & jewellers", description: "Products, offers and hours that match what is in store." },
      { title: "Clinics & professionals", description: "Correct categories, services and appointment links." },
      { title: "Restaurants & food", description: "Menus, photos and up-to-date opening hours." },
    ],
    localIncluded: [
      "Landmark-based directions and service areas for Ujjain",
      "Hindi and English posts",
    ],
    nearbyAreas: ["Freeganj", "Nanakheda", "Mahakal area", "Dewas Road", "Indore Road", "Dewas", "Nagda"],
    faqs: [
      {
        question: "My Ujjain business is not showing on Google Maps. Can you fix it?",
        answer:
          "Usually, yes. Common causes are unverified or duplicate listings, wrong categories or address issues. We audit and fix what we can and guide you through verification.",
      },
      {
        question: "Can you get us more Google reviews?",
        answer:
          "We set up a simple process to ask real customers for reviews and draft replies for your approval. We never buy or write fake reviews.",
      },
      {
        question: "How often should we post on our Google profile?",
        answer:
          "Regular posts help keep the listing active. We agree a schedule, such as weekly, and plan posts around offers, festivals and events.",
      },
      {
        question: "Do I need a website as well?",
        answer:
          "It helps. A website gives Google more information to trust and gives customers somewhere to go after they find you on Maps.",
      },
    ],
    blogSlugs: [
      "importance-of-google-business-profile-for-local-businesses",
      "every-business-in-ujjain-needs-online-presence-before-simhastha-2028",
      "best-it-services-in-ujjain",
    ],
    metaDescription:
      "Google Business Profile management in Ujjain: setup, categories, photos, posts and genuine reviews, handled by our team in Ujjain.",
  },
  {
    service: "google-business-profile",
    city: "indore",
    reviewStatus: "draft",
    answer:
      "Hussaini IT Services manages Google Business Profiles for Indore businesses from our Madhya Pradesh office in Ujjain. We optimise categories, details, photos and posts and set up an ethical review process. In a competitive city like Indore, choose a provider who shows you what is wrong with your current listing first.",
    intro:
      "Google Maps optimisation for Indore clinics, coaching centres, restaurants and showrooms — so you appear in local searches across the city.",
    body: [
      "Indore is spread out, and Google Maps results change from Vijay Nagar to Rajwada to Bhawarkuan. A complete, active profile with the right categories and genuine reviews is what moves you into the local three-pack for nearby searches.",
      "We audit your listing against competitors, fix the gaps and keep it active. Multi-branch businesses get a consistent setup for every location.",
    ],
    audience: [
      { title: "Clinics & diagnostic centres", description: "Services, timings and appointment links per branch." },
      { title: "Coaching centres", description: "Correct categories and posts around admissions." },
      { title: "Restaurants & cafés", description: "Menus, photos and hours that stay up to date." },
      { title: "Showrooms & retail", description: "Products, offers and directions for walk-in customers." },
    ],
    localIncluded: [
      "Multi-branch setup across Indore areas",
      "Competitor comparison for your category",
    ],
    nearbyAreas: ["Vijay Nagar", "Palasia", "Rajwada", "Bhawarkuan", "Rau", "Dewas", "Pithampur"],
    faqs: [
      {
        question: "We have three branches in Indore. Do we need three profiles?",
        answer:
          "Yes — one verified profile per real, staffed location. We set them up consistently and link each to the right page on your website.",
      },
      {
        question: "Why does a competitor rank above us on Maps?",
        answer:
          "Usually distance, category choice, profile completeness, reviews and website signals. Our audit shows which of these you can improve.",
      },
      {
        question: "Can you remove a bad review?",
        answer:
          "Only reviews that break Google’s policies can be reported for removal. For genuine negative reviews, we help you reply professionally.",
      },
      {
        question: "How soon will changes show?",
        answer:
          "Edits often appear within days. Ranking improvements on Maps typically build over several weeks.",
      },
    ],
    blogSlugs: [
      "importance-of-google-business-profile-for-local-businesses",
      "get-more-customers-online-2026-small-business-guide",
      "google-ai-overviews-ai-mode-seo-uae-india-2026",
    ],
    metaDescription:
      "Google Business Profile management for Indore: categories, photos, posts, multi-branch setup and genuine reviews, from our nearby MP team.",
  },
  {
    service: "google-business-profile",
    city: "dubai",
    reviewStatus: "draft",
    answer:
      "Hussaini IT Services manages Google Business Profiles for Dubai businesses from our Dubai office. We fix categories and details, add photos and posts, and help you collect genuine reviews, keeping everything consistent with your website. Avoid any provider that offers paid or fake reviews — Google can suspend listings for it.",
    intro:
      "Google Business Profile management for Dubai clinics, salons, restaurants, showrooms and service companies — accurate on Maps and active every week.",
    body: [
      "In Dubai, many customers find local businesses on Google Maps: “clinic near me” in JLT, “AC repair” in Al Barsha, “restaurant” in Deira. Listings with correct pins, categories, photos and recent reviews win those calls.",
      "We work from Dubai and handle setup, verification support, optimisation and ongoing posting. For service-area businesses without a shopfront, we set service areas correctly instead of a misleading address.",
    ],
    audience: [
      { title: "Clinics & wellness centres", description: "Services, practitioners and booking links." },
      { title: "Salons & spas", description: "Photos, offers and booking links that bring walk-ins." },
      { title: "Home & maintenance services", description: "Correct service areas for businesses without a shopfront." },
      { title: "Restaurants & cafés", description: "Menus, hours and photos kept current." },
    ],
    localIncluded: [
      "English and Arabic business descriptions",
      "Service-area setup for mobile businesses",
    ],
    nearbyAreas: ["JLT", "Al Barsha", "Deira", "Business Bay", "Jumeirah", "Sharjah", "Ajman"],
    faqs: [
      {
        question: "Can you verify our Google Business Profile in Dubai?",
        answer:
          "We guide you through Google’s verification steps and fix common issues. Verification itself is completed by the business owner with Google.",
      },
      {
        question: "Can a business without a shop appear on Maps?",
        answer:
          "Yes, as a service-area business. We set the areas you serve and hide the address, following Google’s guidelines.",
      },
      {
        question: "Do you post in Arabic?",
        answer:
          "We can publish Arabic posts and descriptions you provide or approve. Arabic copywriting is scoped separately if needed.",
      },
      {
        question: "Is Google Business Profile part of your SEO service?",
        answer:
          "It is included in local SEO, and also available on its own if you only need Maps management.",
      },
    ],
    blogSlugs: [
      "importance-of-google-business-profile-for-local-businesses",
      "local-seo-guide-for-businesses-in-dubai",
      "how-to-generate-more-leads-for-your-business-in-dubai",
    ],
    metaDescription:
      "Google Business Profile management in Dubai: verification help, categories, photos, Arabic posts and genuine reviews, from our Dubai office.",
  },
];

// ---------------------------------------------------------------------------
// Lookups
// ---------------------------------------------------------------------------

export function getServiceLocationPage(service: string, city: string) {
  return serviceLocationPages.find((page) => page.service === service && page.city === city);
}

export function getServiceLocationsForService(service: string) {
  return serviceLocationPages.filter((page) => page.service === service);
}

export function getServiceLocationsForCity(city: string) {
  return serviceLocationPages.filter((page) => page.city === city);
}

export function serviceLocationHref(page: Pick<ServiceLocationPage, "service" | "city">) {
  return `/services/${page.service}/${page.city}`;
}

/** Resolved page with service, city and labels — throws on broken config at build time */
export function resolveServiceLocation(page: ServiceLocationPage) {
  const service = getServicePage(page.service);
  const location = getLocationPage(page.city);
  const serviceConfig = serviceLocationServices[page.service];
  if (!service || !location || !serviceConfig) {
    throw new Error(`Invalid service-location config: ${page.service}/${page.city}`);
  }

  return {
    page,
    service,
    location,
    serviceConfig,
    href: serviceLocationHref(page),
    h1: `${serviceConfig.h1Label} Company in ${location.city}`,
    metaTitle: `${serviceConfig.titleLabel} in ${location.city}`,
    included: [...serviceConfig.included, ...page.localIncluded],
    process: page.process ?? serviceConfig.process,
    countryCode: locationCountryCode(location) ?? "",
    isIndia: isIndiaLocation(location),
  };
}

export type ResolvedServiceLocation = ReturnType<typeof resolveServiceLocation>;

/** Short label used in link lists, e.g. “SEO in Dubai” */
export function serviceLocationLinkLabel(page: ServiceLocationPage) {
  const { service, location } = resolveServiceLocation(page);
  return `${service.title} in ${location.city}`;
}
