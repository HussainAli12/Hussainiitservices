import { truncateMeta } from "@/lib/seo/text";
import { locationHref, locationIndex } from "@/lib/seo/location-index";

export interface LocationPageContent {
  slug: string;
  city: string;
  region: string;
  country: string;
  href: string;
  headline: string;
  intro: string;
  body: string[];
  industries: string[];
  highlights: string[];
  faqs: { question: string; answer: string }[];
}

type LocationContent = Omit<LocationPageContent, "slug" | "city" | "region" | "country" | "href">;

/** Page copy per city, keyed by slug (identity fields live in location-index.ts) */
const locationContent: Record<string, LocationContent> = {
  dubai: {
    headline: "Best IT services in Dubai for real estate, trade & growth brands",
    intro:
      "Hussaini IT Services works from Dubai with businesses that need websites, SEO, Google Business Profile, and digital marketing that convert in the UAE.",
    body: [
      "Dubai buyers compare you on Google, Maps, and Instagram before they call. We build the site, local SEO, and social presence so those searches turn into enquiries — not just traffic.",
      "We understand free-zone and mainland businesses, bilingual English/Arabic landing pages, and the speed expected in the UAE. Delivery is run from our Dubai base with a named owner on every project.",
    ],
    industries: ["Real estate", "Trade & logistics", "Hospitality", "Professional services"],
    highlights: [
      "Local team presence in Dubai",
      "Google Business Profile and Maps for UAE",
      "English and Arabic-ready websites",
      "Same-week response on new briefs",
    ],
    faqs: [
      {
        question: "Do you meet clients in Dubai?",
        answer:
          "Yes. We can schedule a call or an in-person meeting in Dubai after the first brief. Most projects also run well on WhatsApp and video.",
      },
      {
        question: "Can you manage Google Business Profile for a Dubai location?",
        answer:
          "Yes. We set categories, photos, posts, and review replies so your Maps listing matches the website NAP.",
      },
    ],
  },
  "abu-dhabi": {
    headline: "Best IT services in Abu Dhabi for B2B and formal brands",
    intro:
      "Web development, SEO, and digital marketing for Abu Dhabi companies that need a premium online presence without a bloated agency process.",
    body: [
      "Abu Dhabi brands often sell to government, energy, and family businesses. We write and build for that audience — clear offers, fast pages, and proof that holds up in a procurement conversation.",
      "Work is coordinated from Dubai with remote stand-ups that fit UAE hours. You get one team for the website, local SEO, and ongoing content.",
    ],
    industries: ["Energy", "Government contractors", "Healthcare", "Education"],
    highlights: [
      "UAE-hour project communication",
      "Sites built for procurement and B2B",
      "Local SEO for Abu Dhabi searches",
      "Content that matches formal brand tone",
    ],
    faqs: [
      {
        question: "Do I need an Abu Dhabi office to work with you?",
        answer:
          "No. We serve Abu Dhabi clients from Dubai and remotely. If you have a local Google listing, we can still optimize it.",
      },
      {
        question: "Can you work with Arabic-first brands?",
        answer:
          "Yes. We can structure bilingual pages and leave space for your Arabic copy, or coordinate translation with your team.",
      },
    ],
  },
  sharjah: {
    headline: "Best IT services in Sharjah for manufacturers & local services",
    intro:
      "Practical IT and digital marketing for Sharjah manufacturers, traders, and local services who need to be found in the Northern Emirates.",
    body: [
      "Sharjah searches are often local and intent-heavy — workshops, suppliers, clinics, and schools. We focus on Google Business Profile, a fast mobile site, and pages that name the areas you actually serve.",
      "You do not need a large retainer to start. Many Sharjah clients begin with a website plus Maps setup, then add social or SEO once leads are flowing.",
    ],
    industries: ["Manufacturing", "Education", "Healthcare", "Local services"],
    highlights: [
      "Maps and local SEO for Sharjah",
      "Mobile-first websites",
      "Clear pricing conversations",
      "Support in English and Hindi",
    ],
    faqs: [
      {
        question: "Is this only for companies based in Sharjah?",
        answer:
          "No. We also help Dubai and Ajman businesses that sell into Sharjah and want location pages or a second Google listing.",
      },
      {
        question: "How fast can a Sharjah business website launch?",
        answer:
          "A focused marketing site is typically 2–6 weeks after we have your content and approvals.",
      },
    ],
  },
  kuwait: {
    headline: "Best IT services in Kuwait for retail and family businesses",
    intro:
      "Remote-first web, SEO, and social for Kuwait companies that want a GCC-ready digital partner without hiring a full in-house team.",
    body: [
      "Kuwait brands compete on Instagram and Google as much as on referrals. We build the site and the content system so your offer is clear in English and, where needed, Arabic.",
      "Projects are run from our Dubai and Ujjain offices on GCC working hours. WhatsApp is the default for day-to-day updates.",
    ],
    industries: ["Retail", "Automotive", "Clinics", "Family businesses"],
    highlights: [
      "GCC time-zone coverage",
      "Instagram and website working together",
      "Ecommerce and enquiry funnels",
      "No local office required",
    ],
    faqs: [
      {
        question: "Do you travel to Kuwait?",
        answer:
          "Most work is remote. A visit can be arranged for larger retainers; the first phase is always a video discovery call.",
      },
      {
        question: "Can you run paid ads in Kuwait?",
        answer:
          "Yes, once tracking and creatives are in place. Organic site and social work usually comes first so ad spend is not wasted.",
      },
    ],
  },
  indore: {
    headline: "Best IT services in Indore for startups and mid-size companies",
    intro:
      "IT, websites, and SEO for Indore businesses that want the same quality as a metro agency — with a team already working in Madhya Pradesh.",
    body: [
      "Indore is close to our Ujjain office. That means faster meetings, local context, and websites that mention the neighbourhoods and search terms your customers actually use.",
      "We work with manufacturers, educators, clinics, and growing D2C brands. Typical start: a fast website, Google Business Profile, and a simple lead form.",
    ],
    industries: ["Education", "Manufacturing", "Healthcare", "D2C"],
    highlights: [
      "Nearby office in Ujjain",
      "Local SEO for Indore searches",
      "In-person kickoff when useful",
      "Hindi and English support",
    ],
    faqs: [
      {
        question: "Can we meet in Indore?",
        answer:
          "Yes. We can travel from Ujjain for a kickoff or review. Day-to-day work still runs on WhatsApp and scheduled calls.",
      },
      {
        question: "Do you only take large Indore companies?",
        answer:
          "No. We scope for startups and established firms. The proposal states price and timeline before any build starts.",
      },
    ],
  },
  ujjain: {
    headline: "Best IT company in Ujjain — web, SEO & digital marketing",
    intro:
      "Hussaini IT Services is an IT company in Ujjain. We build websites, SEO, Google Business Profile, and digital marketing for local businesses and brands across Madhya Pradesh.",
    body: [
      "People searching for the best IT services in Ujjain or the best IT company in Ujjain usually want a team that is actually here — not a listing farmed from another city. Our India office is in Ujjain. We design, develop, and rank websites for hospitality, education, retail, and professional firms in the city and nearby towns.",
      "Ujjain searches mix locals, pilgrims, and buyers from Indore and Dewas. We write pages for the areas and services you really cover, set up Google Maps, and keep the site fast on mobile data. You can visit the office, send WhatsApp notes, or run the project on calls. The scope stays written either way.",
    ],
    industries: ["Hospitality", "Education", "Local retail", "Professional services"],
    highlights: [
      "India office in Ujjain",
      "Local SEO and Google Maps",
      "Hindi and English delivery",
      "Mobile-first builds",
    ],
    faqs: [
      {
        question: "Who is the best IT company in Ujjain?",
        answer:
          "It depends on the brief. Hussaini IT Services is an IT company based in Ujjain — we build websites, SEO, and digital marketing in-house, with a named owner on every project.",
      },
      {
        question: "Do you offer the best IT services in Ujjain for small businesses?",
        answer:
          "Yes. We scope websites, Google Business Profile, and SEO for shops, clinics, hotels, and professional firms — with a written price before any build starts.",
      },
      {
        question: "Are you actually based in Ujjain?",
        answer:
          "Yes. Our India office is in Ujjain. We also have an office in Dubai. India phone support is listed on the contact page.",
      },
      {
        question: "Can you help a hotel or homestay near Mahakal?",
        answer:
          "Yes. We have built hospitality sites for this market — bookings, enquiry forms, and local search pages.",
      },
    ],
  },
  dewas: {
    headline: "Best IT services in Dewas for industry and local commerce",
    intro:
      "Websites, SEO, and digital marketing for Dewas manufacturers, traders, and local firms — delivered from our Ujjain office, about an hour away.",
    body: [
      "Dewas is an industrial town. Buyers look up suppliers, plants, and local services on Google before they call. We build a clear site, a Google Business Profile, and pages that name the industrial areas you actually serve.",
      "We can visit from Ujjain for a kickoff. Day-to-day work stays on WhatsApp and a written weekly note so the plant manager is not stuck in meetings.",
    ],
    industries: ["Manufacturing", "Chemicals", "Trade", "Local services"],
    highlights: [
      "Office nearby in Ujjain",
      "Local SEO for Dewas searches",
      "Hindi and English support",
      "Sites that work on factory-floor phones",
    ],
    faqs: [
      {
        question: "Can you visit a Dewas factory or office?",
        answer:
          "Yes. Dewas is a short drive from our Ujjain office. We can do an in-person kickoff; most updates after that are on WhatsApp.",
      },
      {
        question: "Do you only work with large Dewas plants?",
        answer:
          "No. We also take shops, clinics, and smaller traders. Price and timeline are in the proposal before we start.",
      },
    ],
  },
  ratlam: {
    headline: "Best IT services in Ratlam for traders and growing SMEs",
    intro:
      "IT services for Ratlam businesses — websites, Google Maps, and SEO from a team based in Ujjain, not a metro agency that never visits.",
    body: [
      "Ratlam is a trading and railway town. Searches are local: wholesale, gold, clinics, coaching, and hotels. We set up Maps, a fast mobile site, and service pages that match how people here actually search.",
      "You do not need a Delhi-style retainer. Many Ratlam clients start with a website plus Google Business Profile, then add SEO once calls start coming in.",
    ],
    industries: ["Trade", "Jewellery", "Healthcare", "Education"],
    highlights: [
      "Ujjain office, Ratlam market",
      "Google Maps and local SEO",
      "Hindi-first conversations",
      "Clear, written pricing",
    ],
    faqs: [
      {
        question: "Will you come to Ratlam?",
        answer:
          "Yes, for a kickoff or a review when it helps. Regular work runs on calls from Ujjain so we do not burn a day on travel for every update.",
      },
      {
        question: "Can you help a shop that only has Instagram today?",
        answer:
          "Yes. We often start with a simple site and a Google listing so people who search on Maps can find you, then keep Instagram in the plan.",
      },
    ],
  },
  mandsaur: {
    headline: "Best IT services in Mandsaur for local business visibility",
    intro:
      "Web development, SEO, and Google Business Profile work for Mandsaur farms, traders, and local brands — run from Ujjain.",
    body: [
      "Mandsaur searches are practical: agriculture, temples, education, and town-centre retail. We write pages for the products and areas you sell into, and we keep the site light for mobile data.",
      "Kickoffs can be in person from Ujjain or on a video call. You get a written scope, not a slide deck that dies in the inbox.",
    ],
    industries: ["Agriculture", "Education", "Retail", "Hospitality"],
    highlights: [
      "Nearby Ujjain team",
      "Local search for Mandsaur",
      "Hindi and English delivery",
      "Mobile-first websites",
    ],
    faqs: [
      {
        question: "Do I need to travel to Ujjain to work with you?",
        answer:
          "No. We can start on a call. If a meeting in Mandsaur or Ujjain is useful, we schedule it.",
      },
      {
        question: "Can you build a site for a Mandsaur school or coaching class?",
        answer:
          "Yes. Enquiry forms, course pages, and a Google listing are a typical start.",
      },
    ],
  },
  nagda: {
    headline: "Best IT services in Nagda for plants, vendors & town brands",
    intro:
      "Websites and local SEO for Nagda businesses, from industrial suppliers to town shops. Delivery is from our Ujjain office.",
    body: [
      "Nagda is a compact industrial town. A good site and a correct Maps listing matter more than a brand film. We fix the basics: speed, contact details, and pages that say what you sell.",
      "We can visit from Ujjain when a walkthrough of the unit helps. Updates stay written so the owner can read them after shift.",
    ],
    industries: ["Manufacturing", "Local retail", "Healthcare", "Transport"],
    highlights: [
      "Short trip from the Ujjain office",
      "Google Business Profile setup",
      "Hindi support",
      "Simple, fast websites",
    ],
    faqs: [
      {
        question: "Is Nagda too small for an IT company?",
        answer:
          "No. Small towns still get Google searches. We scope to the size of the business, not a metro package.",
      },
      {
        question: "Can you take over an old website?",
        answer:
          "Yes. We audit it first and tell you whether to repair it or rebuild.",
      },
    ],
  },
  shajapur: {
    headline: "Best IT services in Shajapur for shops and service firms",
    intro:
      "IT company work for Shajapur — websites, SEO, and digital marketing from the Ujjain office for district businesses that want to be found online.",
    body: [
      "Shajapur searches are local and seasonal: agriculture, education, clinics, and government-adjacent services. We build pages around those terms and keep Google Maps accurate.",
      "You talk to the same people who build the site. No account manager reciting a script from another city.",
    ],
    industries: ["Agriculture", "Education", "Healthcare", "Local services"],
    highlights: [
      "Ujjain-based team",
      "Local SEO for Shajapur",
      "Hindi and English",
      "Written quotes before work starts",
    ],
    faqs: [
      {
        question: "How do Shajapur projects usually start?",
        answer:
          "A call, a written scope, then a website or Google Business Profile. SEO is added once the site is live and accurate.",
      },
      {
        question: "Can you help a clinic or hospital in Shajapur?",
        answer:
          "Yes. We handle the site, Maps categories, and enquiry flow. Medical claims stay yours to approve.",
      },
    ],
  },
  mumbai: {
    headline: "Best IT services in Mumbai for D2C, SaaS & agency-ready brands",
    intro:
      "Web and growth projects for Mumbai startups and brands that want a senior-feeling build without a 20-person agency overhead.",
    body: [
      "Mumbai teams move quickly and expect clean UI, analytics, and a backlog they can see. We run sprints from Ujjain with calls that fit Mumbai evenings when needed.",
      "Typical work: marketing sites, Shopify, SEO for competitive categories, and LinkedIn for B2B founders.",
    ],
    industries: ["Fintech", "Media", "D2C", "Consulting"],
    highlights: [
      "Sprint-style delivery",
      "Shopify and Next.js builds",
      "SEO for competitive Indian terms",
      "Founder-friendly reporting",
    ],
    faqs: [
      {
        question: "Do you have an office in Mumbai?",
        answer:
          "No. We serve Mumbai remotely from Ujjain and Dubai. Kickoffs are on video; visits can be planned for larger retainers.",
      },
      {
        question: "Can you join our existing product team?",
        answer:
          "Yes, as a specialist pod for the website, SEO, or a campaign — with one point of contact.",
      },
    ],
  },
  delhi: {
    headline: "Best IT services in Delhi NCR for competitive local search",
    intro:
      "IT services for Delhi NCR companies that need a credible website, local SEO, and campaigns that survive a crowded search results page.",
    body: [
      "Delhi and Gurgaon searches are competitive. We do not promise page-one for every term. We pick winnable service and locality keywords, then build pages that deserve to rank.",
      "Delivery is remote with IST coverage. You get written weekly notes, not just a Slack dump.",
    ],
    industries: ["Education", "Real estate", "Healthcare", "B2B services"],
    highlights: [
      "IST working hours",
      "Locality and service-page SEO",
      "Corporate and startup sites",
      "Transparent ranking reports",
    ],
    faqs: [
      {
        question: "Do you work across Noida and Gurgaon too?",
        answer:
          "Yes. Delhi NCR is treated as one market. We can create location pages where they are genuine service areas.",
      },
      {
        question: "How do you handle very competitive keywords?",
        answer:
          "We pair head terms with long-tail and local pages, and we say so in the proposal if a term will take longer than a quarter.",
      },
    ],
  },
  riyadh: {
    headline: "Best IT services in Riyadh for GCC-ready digital presence",
    intro:
      "Web, SEO, and digital marketing for Riyadh companies expanding online as Vision 2030 shifts more buying to search and social.",
    body: [
      "Riyadh projects often need a bilingual site, a serious visual tone, and tracking that finance teams can understand. We build that stack and keep the CMS simple for your internal editors.",
      "We operate from Dubai — a short hop for the GCC — with remote delivery as the default.",
    ],
    industries: ["Construction", "Retail", "Healthcare", "Professional services"],
    highlights: [
      "Bilingual site structure",
      "GCC-friendly process",
      "SEO and Google Business support",
      "Clear commercial reporting",
    ],
    faqs: [
      {
        question: "Do you have a KSA commercial registration?",
        answer:
          "We deliver as a UAE/India studio. Contracting and invoicing are confirmed in the proposal for each client.",
      },
      {
        question: "Can you support Arabic UI?",
        answer:
          "Yes. We implement RTL layouts and place your Arabic content. Copywriting in Arabic is scoped separately if you need us to source it.",
      },
    ],
  },
  doha: {
    headline: "Best IT services in Doha for hospitality and professional firms",
    intro:
      "Premium websites and digital marketing for Doha businesses that want GCC-quality delivery without a long local agency waitlist.",
    body: [
      "Doha brands are judged on polish. We design conservative, fast sites — hospitality, professional services, and events — and connect them to Instagram and Google.",
      "Communication sits on WhatsApp and weekly calls from Dubai. You always know what ships next.",
    ],
    industries: ["Hospitality", "Events", "Education", "Retail"],
    highlights: [
      "Design-led marketing sites",
      "Instagram and web alignment",
      "Remote delivery from Dubai",
      "Launch QA on mobile",
    ],
    faqs: [
      {
        question: "Is everything remote for Qatar clients?",
        answer:
          "Yes, unless a visit is agreed. Discovery, design reviews, and launch can all run on video.",
      },
      {
        question: "Can you take over an existing WordPress or Webflow site?",
        answer:
          "Yes. We audit it first and tell you whether to rebuild or repair.",
      },
    ],
  },
  // ---------------------------------------------------------------------------
  // TODO(content-review): Cities below were added in the seo-expansion branch.
  // First drafts written from public knowledge of each market — please review
  // tone and local details before launch. No client names or results are claimed.
  // ---------------------------------------------------------------------------
  bhopal: {
    headline: "Best IT services in Bhopal for institutions, clinics & builders",
    intro:
      "Websites, SEO, and Google Business Profile for Bhopal businesses — run by a Madhya Pradesh team from our Ujjain office, a few hours away by road.",
    body: [
      "Bhopal is the state capital, so a lot of local buying is formal: coaching institutes, hospitals, builders, consultants, and suppliers who sell to departments. Buyers check the website and the Maps listing before they ever call. We build both to read as credible, current, and easy to contact.",
      "Areas like MP Nagar, Arera Colony, Kolar Road, and Hoshangabad Road are searched by name. We write location and service pages around the places you actually cover instead of one generic “Bhopal” page. Kickoffs can be in person; weekly work runs on WhatsApp and calls.",
    ],
    industries: ["Education & coaching", "Healthcare", "Real estate", "Government suppliers"],
    highlights: [
      "Madhya Pradesh team (Ujjain office)",
      "Locality pages for Bhopal searches",
      "Hindi and English delivery",
      "Written scope and price before work starts",
    ],
    faqs: [
      {
        question: "Do you have an office in Bhopal?",
        answer:
          "No. Our India office is in Ujjain. We serve Bhopal from there and can travel for a kickoff or review when it helps the project.",
      },
      {
        question: "Can you build a website for a coaching institute in Bhopal?",
        answer:
          "Yes. Course pages, batch timings, enquiry forms, and a Google Business Profile are a typical start. We can add result or faculty pages once you share the content.",
      },
      {
        question: "Do you write pages for specific Bhopal areas?",
        answer:
          "Yes, where you genuinely serve them. We avoid thin copy-paste area pages because they rarely rank and can hurt the rest of the site.",
      },
    ],
  },
  jabalpur: {
    headline: "Best IT services in Jabalpur for manufacturers, traders & clinics",
    intro:
      "Web development, SEO, and local search for Jabalpur firms that want a professional online presence — delivered remotely by our Madhya Pradesh team.",
    body: [
      "Jabalpur has a strong base of manufacturing, defence-linked suppliers, wholesale trade, and medical and education institutions. Most of these buyers want proof before they enquire: what you make, certifications, locations, and a phone number that works. We build sites that put those facts first.",
      "Projects run remotely from Ujjain with scheduled calls and WhatsApp updates in Hindi or English. If an on-site visit is useful for photography or a plant walkthrough, we plan it into the proposal.",
    ],
    industries: ["Manufacturing", "Defence suppliers", "Wholesale trade", "Healthcare"],
    highlights: [
      "Remote delivery from our MP office",
      "B2B-ready product and capability pages",
      "Google Maps setup for Jabalpur",
      "Hindi and English support",
    ],
    faqs: [
      {
        question: "Can you work with a Jabalpur company without meeting in person?",
        answer:
          "Yes. Discovery, design reviews, and launch all run well on video calls. We can schedule a visit if the project needs one.",
      },
      {
        question: "Do you build product catalogue websites for manufacturers?",
        answer:
          "Yes. We build catalogue and enquiry sites where buyers can browse products and send a quote request, with an admin so your team can update items.",
      },
      {
        question: "How long does a Jabalpur business website take?",
        answer:
          "A focused business website is usually 2–6 weeks once content and approvals are ready. Catalogue or ecommerce builds take longer and are scoped in writing.",
      },
    ],
  },
  gwalior: {
    headline: "Best IT services in Gwalior for tourism, education & retail",
    intro:
      "IT services for Gwalior — websites, SEO, and Google Business Profile for hotels, schools, clinics, and retailers, run by our Madhya Pradesh team.",
    body: [
      "Gwalior draws visitors to the fort and heritage sites, and has a large education and healthcare sector alongside local retail. That mix means two kinds of search: visitors looking for stays, travel, and food, and residents looking for schools, doctors, and shops. We plan pages for whichever audience you serve.",
      "Work is delivered remotely from Ujjain. You get a written scope, a named owner, and updates on WhatsApp. We have built hospitality and travel sites for Ujjain’s visitor market, and the same booking and enquiry patterns apply here.",
    ],
    industries: ["Tourism & hospitality", "Education", "Healthcare", "Retail"],
    highlights: [
      "Hospitality and travel site experience",
      "Local SEO for Gwalior searches",
      "Hindi-first conversations",
      "Mobile-first, fast websites",
    ],
    faqs: [
      {
        question: "Can you build a booking or enquiry site for a Gwalior hotel?",
        answer:
          "Yes. We build hotel and homestay sites with room pages, enquiry or WhatsApp booking, and a Google Business Profile that matches the website details.",
      },
      {
        question: "Do you work with schools in Gwalior?",
        answer:
          "Yes. Admission enquiry forms, course and fee pages (with figures you provide), and a correct Maps listing are a common first project.",
      },
      {
        question: "Where is your team based?",
        answer:
          "Our India office is in Ujjain, Madhya Pradesh. We also have an office in Dubai. Gwalior projects are run remotely from Ujjain.",
      },
    ],
  },
  sagar: {
    headline: "Best IT services in Sagar for colleges, traders & local firms",
    intro:
      "Websites, Google Maps, and SEO for Sagar businesses — from coaching centres and clinics to agri traders — run by our Madhya Pradesh team in Ujjain.",
    body: [
      "Sagar is a university town and a trading centre for the surrounding district. Students and parents search for colleges, coaching, and hostels; farmers and dealers search for agri inputs and traders; residents search for clinics and shops. We build pages around those real queries.",
      "Most Sagar clients start small: a fast mobile website and a Google Business Profile. SEO and social come next once enquiries are flowing. Every step is quoted in writing first.",
    ],
    industries: ["Education", "Agri trade", "Healthcare", "Local retail"],
    highlights: [
      "MP-based team",
      "Google Business Profile for Sagar",
      "Light pages for mobile data",
      "Hindi and English delivery",
    ],
    faqs: [
      {
        question: "Is Sagar too small a market for SEO?",
        answer:
          "No. Local searches like coaching, clinics, and dealers still happen every day. We scope the work to the size of the market, not a metro package.",
      },
      {
        question: "Can you help a hostel or PG near a college in Sagar?",
        answer:
          "Yes. A simple site with photos, facilities, and a WhatsApp enquiry button, plus a Maps listing, is usually enough to start.",
      },
      {
        question: "Do you visit Sagar?",
        answer:
          "Most work is remote from Ujjain. A visit can be planned for larger projects or when on-site photography is needed.",
      },
    ],
  },
  jeddah: {
    headline: "Best IT services in Jeddah for trade, retail & hospitality",
    intro:
      "Web development, SEO, and ecommerce for Jeddah businesses — delivered from our Dubai office with GCC working hours and bilingual-ready builds.",
    body: [
      "Jeddah is Saudi Arabia’s Red Sea port city and a gateway for visitors heading to Makkah and Madinah. That puts trading companies, retailers, hotels, and travel operators side by side in search results. We build sites that state the offer clearly, load fast on mobile, and leave room for Arabic content.",
      "We are a UAE/India studio, so Jeddah work is remote-first from Dubai. Discovery and reviews run on video; day-to-day updates on WhatsApp. Contracting and invoicing terms are confirmed in each proposal.",
    ],
    industries: ["Import & trade", "Retail & ecommerce", "Hospitality", "Travel"],
    highlights: [
      "Dubai office, GCC hours",
      "RTL-ready Arabic/English layouts",
      "Ecommerce and enquiry funnels",
      "Google Business Profile for Jeddah",
    ],
    faqs: [
      {
        question: "Do you have an office in Jeddah?",
        answer:
          "No. We serve Jeddah remotely from our Dubai office. Calls are scheduled in Saudi working hours.",
      },
      {
        question: "Can you build an Arabic and English website for a Jeddah company?",
        answer:
          "Yes. We build RTL layouts and place your Arabic copy. If you need us to source Arabic copywriting or translation, we scope it separately.",
      },
      {
        question: "Can you set up an online store that sells in Saudi Arabia?",
        answer:
          "Yes. We build ecommerce stores and connect the payment and delivery options you choose. Gateway approval and local compliance stay with your business.",
      },
    ],
  },
  dammam: {
    headline: "Best IT services in Dammam for industrial and B2B companies",
    intro:
      "Corporate websites, LinkedIn, and SEO for Dammam’s industrial, oil and gas service, and logistics companies — delivered remotely from Dubai.",
    body: [
      "Dammam and the wider Eastern Province are built around energy, industrial services, contracting, and logistics. Buyers here are procurement teams and engineers. They want capability statements, certifications, project lists, and a clear contact route — not stock-photo marketing.",
      "We have built B2B websites and run LinkedIn for industrial brands in the region, including metal coating and oil and gas–linked companies. Dammam projects run from our Dubai office, remote-first, with written weekly updates.",
    ],
    industries: ["Oil & gas services", "Industrial contracting", "Logistics", "Manufacturing"],
    highlights: [
      "Industrial B2B website experience",
      "LinkedIn management for GCC brands",
      "Remote delivery from Dubai",
      "Bilingual-ready site structure",
    ],
    faqs: [
      {
        question: "Have you worked with industrial companies before?",
        answer:
          "Yes. Our portfolio includes an industrial metal coating website and LinkedIn management for industrial and oil and gas–linked brands in the GCC. See the portfolio for details.",
      },
      {
        question: "Can you manage LinkedIn for a Dammam contractor?",
        answer:
          "Yes. We plan content around projects, capability, and hiring, and keep the posting schedule consistent so the page looks active to buyers.",
      },
      {
        question: "Do you visit Dammam?",
        answer:
          "Most work is remote. A visit can be discussed for larger retainers; discovery always starts on a video call.",
      },
    ],
  },
  "al-khobar": {
    headline: "Best IT services in Al Khobar for retail, clinics & firms",
    intro:
      "Websites, SEO, social media, and Google Business Profile for Al Khobar retailers, clinics, and professional firms — run remotely from our Dubai office.",
    body: [
      "Al Khobar is the Eastern Province’s retail and lifestyle centre, with restaurants, clinics, showrooms, and professional services serving residents and the many companies based nearby. Searches are local and mobile, so Maps and a quick-loading site matter more than a long brand story.",
      "We set up the website, the Google listing, and the social content system together so your details match everywhere. Delivery is remote-first from Dubai on Saudi working hours.",
    ],
    industries: ["Retail & showrooms", "Clinics", "Restaurants", "Professional services"],
    highlights: [
      "Google Maps and local SEO",
      "Instagram and website working together",
      "GCC time-zone delivery",
      "RTL-ready builds",
    ],
    faqs: [
      {
        question: "Is Al Khobar treated separately from Dammam?",
        answer:
          "Yes, when your customers search that way. We can create a page per city you genuinely serve, each with its own details.",
      },
      {
        question: "Can you manage Google reviews for an Al Khobar clinic?",
        answer:
          "We set up review requests and draft replies for your approval. We never post fake reviews or buy them.",
      },
      {
        question: "Do you run social media in Arabic?",
        answer:
          "We can publish Arabic content you supply or approve. Arabic copywriting is scoped separately if you need us to source it.",
      },
    ],
  },
  makkah: {
    headline: "Best IT services in Makkah for hotels, Umrah & visitor services",
    intro:
      "Websites, booking enquiry flows, and local search for Makkah hotels, Umrah service providers, and visitor-facing businesses — delivered from Dubai.",
    body: [
      "Makkah’s economy is shaped by pilgrims. Hotels, transport, Umrah operators, restaurants, and retailers compete for visitors who often search from abroad, in several languages, on a phone. Clear pricing pages (with your figures), WhatsApp contact, and fast mobile pages matter most.",
      "Our Ujjain team has built websites for pilgrim-facing businesses in a temple city — a travels operator and hospitality enquiries near Mahakal. The same patterns apply: trust signals, simple booking enquiry, and correct Maps details. Makkah work is run remotely from Dubai.",
    ],
    industries: ["Hotels", "Umrah & Hajj services", "Transport", "Retail"],
    highlights: [
      "Pilgrim-market website experience",
      "WhatsApp-first enquiry flows",
      "Multilingual-ready structure",
      "Remote delivery from Dubai",
    ],
    faqs: [
      {
        question: "Can you build a website for an Umrah service provider?",
        answer:
          "Yes. Package pages, an enquiry form, and WhatsApp contact are the usual core. Licensing and package details come from you; we do not publish claims we cannot verify.",
      },
      {
        question: "Can the site support visitors who speak different languages?",
        answer:
          "Yes. We can structure the site for English and Arabic first and add other languages you supply. Each language gets its own URL so it can be found in search.",
      },
      {
        question: "Do you have staff in Makkah?",
        answer:
          "No. We work remotely from our Dubai office. Photography or on-site content would be arranged with you locally.",
      },
    ],
  },
  madinah: {
    headline: "Best IT services in Madinah for hospitality and local retail",
    intro:
      "Web development, Google Business Profile, and SEO for Madinah hotels, visitor services, and local shops — remote delivery from our Dubai office.",
    body: [
      "Madinah serves a steady flow of visitors alongside its resident community. Hotels near the Prophet’s Mosque, transport and ziyarat services, date and gift shops, and restaurants all depend on being found on Maps and contacted quickly. We focus on those basics first.",
      "We have built hospitality and travels websites for a pilgrimage city in India, and apply the same approach here: honest details, quick enquiry, and pages that load fast on a visitor’s phone. Work is remote-first from Dubai.",
    ],
    industries: ["Hotels", "Ziyarat & transport", "Dates & gift retail", "Restaurants"],
    highlights: [
      "Hospitality site experience",
      "Google Maps accuracy",
      "WhatsApp enquiry",
      "Arabic/English-ready layouts",
    ],
    faqs: [
      {
        question: "Can you list a Madinah shop on Google Maps?",
        answer:
          "Yes. We set up or clean up the Google Business Profile — categories, hours, photos, and contact details — and keep it consistent with the website.",
      },
      {
        question: "Can you build an online store for dates or gifts?",
        answer:
          "Yes. We build ecommerce stores with the payment and delivery options you choose. Shipping rules and gateway approvals stay with your business.",
      },
      {
        question: "How do Madinah projects start?",
        answer:
          "With a video call, then a written scope and price. Nothing is built before you approve the proposal.",
      },
    ],
  },
  ajman: {
    headline: "Best IT services in Ajman for SMEs, free-zone firms & retail",
    intro:
      "Websites, SEO, and Google Business Profile for Ajman SMEs, free-zone companies, and local retail — from our Dubai office, a short drive away.",
    body: [
      "Ajman is full of small and medium businesses: free-zone traders, workshops, clinics, salons, and shops serving residents who also commute to Dubai and Sharjah. Many already have Instagram but no proper website or Maps listing. That gap is usually the first thing we fix.",
      "Because Ajman is close to our Dubai base, meetings are easy to arrange. Most projects still run on WhatsApp and calls, with a written scope and price before work starts.",
    ],
    industries: ["Free-zone trading", "Retail", "Clinics & salons", "Workshops"],
    highlights: [
      "Close to our Dubai office",
      "Website plus Maps starter projects",
      "English, Hindi, and Arabic-ready",
      "Clear pricing conversations",
    ],
    faqs: [
      {
        question: "Can we meet in Ajman?",
        answer:
          "Yes. Ajman is close to our Dubai office, so an in-person meeting can be arranged after the first call.",
      },
      {
        question: "We only have Instagram. Where should we start?",
        answer:
          "Usually with a simple website and a Google Business Profile, so people who search on Google and Maps can find and contact you. Instagram stays in the plan.",
      },
      {
        question: "Do you serve Sharjah and Ajman together?",
        answer:
          "Yes. If you serve both, we can create a page for each city with its own details rather than one generic page.",
      },
    ],
  },
  "ras-al-khaimah": {
    headline: "Best IT services in Ras Al Khaimah for tourism and industry",
    intro:
      "Web development, SEO, and digital marketing for Ras Al Khaimah resorts, tour operators, manufacturers, and free-zone companies — run from Dubai.",
    body: [
      "Ras Al Khaimah combines a growing tourism and resort market with manufacturing and a large free-zone business community. Tourism brands need visual, booking-ready sites; industrial and free-zone firms need clear capability pages and a credible corporate presence. We build for both.",
      "Work is coordinated from our Dubai office. Kickoffs can be in person when it helps; regular updates run on WhatsApp and scheduled calls on UAE hours.",
    ],
    industries: ["Tourism & resorts", "Manufacturing", "Free-zone companies", "Real estate"],
    highlights: [
      "UAE-based team in Dubai",
      "Tourism and B2B site experience",
      "Local SEO for RAK searches",
      "English and Arabic-ready layouts",
    ],
    faqs: [
      {
        question: "Do you work with tour operators in Ras Al Khaimah?",
        answer:
          "Yes. We build tour and travels sites with package pages, route or activity pages, and WhatsApp booking — similar to travels websites in our portfolio.",
      },
      {
        question: "Can you build a corporate site for a RAK free-zone company?",
        answer:
          "Yes. Company profile, services, certifications, and enquiry pages, with a CMS your team can update.",
      },
      {
        question: "Will you travel to Ras Al Khaimah?",
        answer:
          "We can arrange a meeting for a kickoff when useful. Most of the project runs remotely from Dubai.",
      },
    ],
  },
  muscat: {
    headline: "Best IT services in Muscat for hospitality, trade & contractors",
    intro:
      "Remote-first websites, SEO, and social media for Muscat businesses in hospitality, trading, and contracting — delivered from our Dubai office.",
    body: [
      "Muscat’s economy mixes tourism and hospitality with construction, logistics, and trading houses — many family-owned. Buyers expect a polished, modest brand presence and fast replies. We build sites that present the business clearly in English, with room for Arabic.",
      "Oman is on a similar time zone to the UAE, so projects run comfortably from Dubai on video calls and WhatsApp. Contracting terms are confirmed in each proposal.",
    ],
    industries: ["Hospitality & tourism", "Construction", "Trading houses", "Logistics"],
    highlights: [
      "Same-region time zone",
      "Remote delivery from Dubai",
      "Corporate and hospitality sites",
      "LinkedIn and Instagram support",
    ],
    faqs: [
      {
        question: "Do you have an office in Oman?",
        answer:
          "No. We serve Muscat remotely from our Dubai office. Oman is on a similar time zone, so scheduling is easy.",
      },
      {
        question: "Can you redesign an old company website in Muscat?",
        answer:
          "Yes. We audit the current site first, keep the pages that already rank, and set up redirects so you do not lose search traffic.",
      },
      {
        question: "Can you manage LinkedIn for an Omani contractor?",
        answer:
          "Yes. We manage LinkedIn for industrial and contracting brands in the GCC, focused on projects, capability, and consistent posting.",
      },
    ],
  },
  manama: {
    headline: "Best IT services in Manama for finance, services & retail",
    intro:
      "Websites, SEO, and digital marketing for Manama’s professional services, finance-adjacent firms, hospitality, and retail — remote from our Dubai office.",
    body: [
      "Manama is a compact, competitive market with a strong financial and professional services sector, plus hospitality and retail serving residents and weekend visitors. Firms here are judged on polish and trust: clear team pages, credentials, and fast, secure websites.",
      "Delivery is remote-first from Dubai, a short flight away. You get a named project owner, a written scope, and weekly progress notes.",
    ],
    industries: ["Professional services", "Finance-adjacent firms", "Hospitality", "Retail"],
    highlights: [
      "Design-led corporate websites",
      "Security and performance basics built in",
      "Remote delivery from Dubai",
      "English and Arabic-ready",
    ],
    faqs: [
      {
        question: "Do you work with regulated businesses in Bahrain?",
        answer:
          "We build the website and marketing. Any regulated claims, disclosures, or approvals stay with your compliance team, and we publish only what you sign off.",
      },
      {
        question: "Is everything remote for Manama clients?",
        answer:
          "Yes, unless a visit is agreed. Discovery, design reviews, and launch all run on video calls.",
      },
      {
        question: "Can you take over hosting and maintenance?",
        answer:
          "Yes. We can move the site to managed hosting, set up backups and monitoring, and offer a maintenance retainer.",
      },
    ],
  },
};

export const locationPages: LocationPageContent[] = locationIndex.map((entry) => {
  const content = locationContent[entry.slug];
  if (!content) throw new Error(`Missing location content for ${entry.slug}`);
  return { ...entry, href: locationHref(entry.slug), ...content };
});

export function getLocationPage(slug: string) {
  return locationPages.find((location) => location.slug === slug);
}

export function getLocationSlugs() {
  return locationPages.map((location) => location.slug);
}

/** Rendered as "<title> | Hussaini IT Services" — keep under 60 chars total */
export function locationMetaTitle(location: LocationPageContent) {
  return `Best IT Services in ${location.city}`;
}

export function locationMetaDescription(location: LocationPageContent) {
  return truncateMeta(location.intro);
}

export type MarketSlug = "india" | "uae" | "saudi-arabia" | "gcc";

const COUNTRY_MARKET: Record<string, MarketSlug> = {
  India: "india",
  "United Arab Emirates": "uae",
  "Saudi Arabia": "saudi-arabia",
  Kuwait: "gcc",
  Qatar: "gcc",
  Oman: "gcc",
  Bahrain: "gcc",
};

const COUNTRY_CODES: Record<string, string> = {
  India: "IN",
  "United Arab Emirates": "AE",
  "Saudi Arabia": "SA",
  Kuwait: "KW",
  Qatar: "QA",
  Oman: "OM",
  Bahrain: "BH",
};

/** Hub a city belongs to. UAE and Saudi cities also roll up into the GCC hub. */
export function locationMarket(location: Pick<LocationPageContent, "country">): MarketSlug {
  return COUNTRY_MARKET[location.country] ?? "gcc";
}

export function locationCountryCode(location: Pick<LocationPageContent, "country">) {
  return COUNTRY_CODES[location.country];
}

export function isIndiaLocation(location: Pick<LocationPageContent, "country">) {
  return location.country === "India";
}

export function locationSeoKeywords(city: string) {
  return [
    `best IT services in ${city}`,
    `best IT company in ${city}`,
    `best IT services ${city}`,
    `best IT company ${city}`,
    `IT company in ${city}`,
    `IT services in ${city}`,
    `web development company ${city}`,
    `SEO company ${city}`,
    `digital marketing agency ${city}`,
  ];
}

export const locationOfficeGeo: Record<
  string,
  { region: string; placename: string; position: string; icbm: string; latitude: number; longitude: number }
> = {
  dubai: {
    region: "AE-DU",
    placename: "Dubai",
    position: "25.2048;55.2708",
    icbm: "25.2048, 55.2708",
    latitude: 25.2048,
    longitude: 55.2708,
  },
  ujjain: {
    region: "IN-MP",
    placename: "Ujjain",
    position: "23.1765;75.7885",
    icbm: "23.1765, 75.7885",
    latitude: 23.1765,
    longitude: 75.7885,
  },
};
