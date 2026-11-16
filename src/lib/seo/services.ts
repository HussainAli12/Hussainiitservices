export interface ServicePageContent {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  headline: string;
  intro: string;
  body: string[];
  outcomes: string[];
  process: { title: string; description: string }[];
  faqs: { question: string; answer: string }[];
}

export const servicePages: ServicePageContent[] = [
  {
    slug: "digital-online-presence",
    title: "Digital Online Presence",
    metaTitle: "Digital Online Presence Services",
    metaDescription:
      "Build your digital identity with professional websites, SEO, and Google Business Profile optimization from Hussaini IT Services in Dubai, Ujjain, the UAE, and India.",
    keywords: [
      "digital online presence",
      "website building Dubai",
      "SEO and Google Business Profile",
      "digital identity UAE",
    ],
    headline: "Your complete digital identity — website, search, and local visibility",
    intro:
      "We help businesses show up professionally online. That means a fast, credible website, SEO that brings qualified traffic, and a Google Business Profile that wins local searches — all aligned as one digital identity.",
    body: [
      "Most clients start with a website that reflects how they actually sell: clear services, trust signals, and contact paths that convert. We build with Next.js, React, or WordPress depending on your content workflow, and bake in on-page SEO from day one.",
      "Search engine optimization and Google Business Profile work together — not as separate projects. We map keywords to your services, fix technical SEO, optimize your Maps listing, and keep NAP, reviews, and location pages consistent so Google trusts one brand, not three versions of it.",
    ],
    outcomes: [
      "Professional website matched to your brand and goals",
      "SEO strategy with keyword research and on-page fixes",
      "Google Business Profile setup, optimization, and management",
      "Unified digital identity across Search, Maps, and your site",
    ],
    process: [
      { title: "Discover", description: "Audit your current site, search visibility, and local listings." },
      { title: "Build", description: "Website, SEO foundations, and Google Profile alignment." },
      { title: "Grow", description: "Ongoing optimization, content, and local search improvements." },
    ],
    faqs: [
      {
        question: "Do I need a website if I only want SEO or Google Business Profile?",
        answer:
          "You can start with Google Business Profile or SEO on an existing site. We recommend a website as the anchor of your digital identity — it gives SEO something to rank and gives customers a place to convert after they find you on Maps.",
      },
      {
        question: "What is included in digital online presence?",
        answer:
          "Website building, search engine optimization, and Google Business Profile management. Scope is defined in a written proposal — some clients start with one piece and expand once results are visible.",
      },
      {
        question: "Do you work with businesses in Dubai and Ujjain?",
        answer:
          "Yes. We are based in Dubai and Ujjain and run local SEO, Google Profile, and website projects for clients across the UAE, India, and remote markets.",
      },
    ],
  },
  {
    slug: "custom-software-development",
    title: "Custom Software Development",
    metaTitle: "Custom Software Development",
    metaDescription:
      "Custom CRM, SaaS, and ERP software development from Hussaini IT Services. Tailored business platforms for teams in Dubai, Ujjain, the UAE, and India.",
    keywords: [
      "custom software development Dubai",
      "CRM development UAE",
      "SaaS application development",
      "ERP software India",
    ],
    headline: "Software built for how your business actually runs",
    intro:
      "Off-the-shelf tools rarely fit growing operations. We design and build custom CRM systems, SaaS applications, and ERP software that match your workflows, integrations, and reporting needs.",
    body: [
      "Discovery starts with how your team works today — sales pipelines, inventory, approvals, field teams, or customer portals. We map roles, data flows, and integrations before writing production code so scope stays honest.",
      "Delivery includes admin dashboards, role-based access, API integrations, and handover documentation. Stacks we use most: Next.js, React, Node.js, and PostgreSQL — chosen for maintainability and scale, not hype.",
    ],
    outcomes: [
      "Custom CRM tailored to your sales and client workflows",
      "SaaS platforms with subscriptions, dashboards, and user roles",
      "ERP modules for inventory, operations, and reporting",
      "Integrations with payment, email, and third-party tools",
    ],
    process: [
      { title: "Scope", description: "Workflows, users, integrations, and success metrics." },
      { title: "Build", description: "Design, development, testing, and staging review." },
      { title: "Launch", description: "Deployment, training, and ongoing support options." },
    ],
    faqs: [
      {
        question: "What types of custom software do you build?",
        answer:
          "CRM systems, SaaS applications, ERP software, internal dashboards, booking platforms, and industry-specific tools. We scope each project after a short discovery call.",
      },
      {
        question: "How is this different from a website?",
        answer:
          "Websites are marketing and information. Custom software handles operations — user accounts, workflows, data, and integrations. Many clients have both.",
      },
      {
        question: "Do you maintain software after launch?",
        answer:
          "Yes. We offer retainers for updates, monitoring, and new features. You own the codebase and we document everything at handover.",
      },
    ],
  },
  {
    slug: "ads-and-social-media",
    title: "Google Ads & Social Media",
    metaTitle: "Google Ads & Social Media Management",
    metaDescription:
      "Google Ads campaign management and social media strategy from Hussaini IT Services. Paid and organic growth for brands in the UAE, India, and worldwide.",
    keywords: [
      "Google Ads management Dubai",
      "social media management UAE",
      "Meta Ads agency",
      "LinkedIn marketing India",
    ],
    headline: "Paid ads and social media that drive enquiries, not vanity metrics",
    intro:
      "We manage Google Ads campaigns and social media platforms together so your brand stays visible where buyers search and scroll — with tracking, creative, and reporting in one team.",
    body: [
      "Google Ads covers Search, Display, and Performance Max where the offer fits. We structure campaigns around services and locations you actually sell, set conversion tracking before spend scales, and review search terms weekly so budget goes to qualified clicks.",
      "Social media management covers LinkedIn, Instagram, and Facebook — content calendars, brand-safe creatives, community replies, and organic posts that support your sales cycle. Paid social on Meta and LinkedIn can run alongside when creative and landing pages are ready.",
    ],
    outcomes: [
      "Google Ads setup, tracking, and ongoing campaign management",
      "Social media strategy, content, and publishing",
      "Meta and LinkedIn paid campaigns when scoped",
      "Monthly reporting on leads, reach, and cost per result",
    ],
    process: [
      { title: "Plan", description: "Channels, budget, audiences, and conversion goals." },
      { title: "Launch", description: "Campaigns, creatives, and tracking verification." },
      { title: "Optimize", description: "Weekly reviews, A/B tests, and budget shifts." },
    ],
    faqs: [
      {
        question: "Do you manage both Google Ads and social media?",
        answer:
          "Yes. They can be one retainer or separate scopes. We recommend aligning messaging across paid search and social so prospects see a consistent brand.",
      },
      {
        question: "Which social platforms do you manage?",
        answer:
          "Primarily LinkedIn, Instagram, and Facebook. We recommend channels based on your audience rather than posting everywhere by default.",
      },
      {
        question: "What budget do I need for Google Ads?",
        answer:
          "Ad spend is separate from our management fee. We recommend a minimum test budget based on your market — we set expectations in the proposal before any spend goes live.",
      },
    ],
  },
  {
    slug: "seo",
    title: "Search Engine Optimization",
    metaTitle: "SEO Services in Dubai & Ujjain",
    metaDescription:
      "SEO services from Hussaini IT Services in Dubai and Ujjain. Keyword research, on-page SEO, technical SEO, and local search to grow organic traffic in the UAE and India.",
    keywords: ["SEO Dubai", "SEO Ujjain", "local SEO UAE", "technical SEO agency"],
    headline: "SEO that brings qualified buyers, not just traffic",
    intro:
      "We plan and implement search engine optimization for businesses that need to be found in Google Search and Maps. Work is based in Dubai and Ujjain, with campaigns for clients across the UAE, India, and remote markets.",
    body: [
      "Every engagement starts with keyword research, competitor gaps, and a technical crawl. We then fix indexation, titles, internal links, and on-page structure so Google can understand the service you actually sell.",
      "Local SEO is included where it matters: Google Business Profile, location pages, and review strategy for Dubai, Ujjain, and other cities you serve. Reporting stays simple — rankings, organic leads, and the pages that convert.",
    ],
    outcomes: [
      "Keyword map aligned to services and locations",
      "On-page and technical fixes on your live site",
      "Local SEO and Google Business Profile support",
      "Monthly ranking and traffic reporting",
    ],
    process: [
      { title: "Audit", description: "Crawl, keywords, competitors, and conversion paths." },
      { title: "Fix", description: "Titles, content, speed, schema, and internal links." },
      { title: "Grow", description: "New pages, local signals, and ongoing optimization." },
    ],
    faqs: [
      {
        question: "How long until SEO results show?",
        answer:
          "Most sites see measurable movement in 8–12 weeks. Competitive terms in Dubai or national India searches can take longer. We set expectations from the audit, not a generic promise.",
      },
      {
        question: "Do you offer local SEO for Dubai and Ujjain?",
        answer:
          "Yes. We optimize Google Business Profiles, location content, and citations for UAE and India markets, including multi-location businesses.",
      },
      {
        question: "Will you rewrite our website copy?",
        answer:
          "We improve titles, headings, and key landing pages as part of SEO. Larger content builds are scoped after the audit so you only pay for pages that can rank.",
      },
    ],
  },
  {
    slug: "social-media-management",
    title: "Social Media Management",
    metaTitle: "Social Media Management UAE & India",
    metaDescription:
      "LinkedIn, Instagram, and Facebook management from Hussaini IT Services. Content strategy, design, and community management for B2B and consumer brands in the UAE and India.",
    keywords: ["social media management Dubai", "LinkedIn marketing UAE", "Instagram agency Ujjain"],
    headline: "Social content that builds authority and enquiries",
    intro:
      "We run social media for industrial, professional, and consumer brands that need a consistent presence — not random posts. Strategy, creative, publishing, and reporting sit in one team.",
    body: [
      "LinkedIn is a core channel for B2B clients in oil & gas, infrastructure, and professional services. We write posts that speak to buyers, not vanity metrics, and keep a cadence your team can approve quickly.",
      "Instagram and Facebook support brand and local businesses. Creative is produced to your brand system, with captions, hashtags, and community replies handled on an agreed schedule.",
    ],
    outcomes: [
      "Monthly content calendar and brand-safe creatives",
      "LinkedIn, Instagram, and Facebook publishing",
      "Community replies and basic inbox handling",
      "Performance notes on what actually drove reach or leads",
    ],
    process: [
      { title: "Positioning", description: "Audience, offer, and channel mix." },
      { title: "Production", description: "Calendar, copy, and design in your brand." },
      { title: "Publish", description: "Scheduling, engagement, and monthly review." },
    ],
    faqs: [
      {
        question: "Which platforms do you manage?",
        answer:
          "Primarily LinkedIn, Instagram, and Facebook. We recommend a channel mix from your sales cycle rather than posting everywhere by default.",
      },
      {
        question: "Do you run paid social ads?",
        answer:
          "Organic management is the core retainer. Meta Ads and LinkedIn Ads can be added once creative and tracking are in place.",
      },
      {
        question: "How many posts per month?",
        answer:
          "Typical retainers include 12–20 posts depending on channels. Volume is agreed in the proposal so quality stays consistent.",
      },
    ],
  },
  {
    slug: "google-business-profile",
    title: "Google Business Profile",
    metaTitle: "Google Business Profile Optimization",
    metaDescription:
      "Google Business Profile setup and management for local search in Dubai, Ujjain, and other cities. Reviews, photos, posts, and Maps visibility from Hussaini IT Services.",
    keywords: ["Google Business Profile Dubai", "Google Maps SEO", "GBP optimization India"],
    headline: "Win the map pack for the searches that pay",
    intro:
      "Your Google Business Profile is often the first listing a nearby customer sees. We set it up correctly, keep categories and photos accurate, and build a review habit that supports Maps rankings.",
    body: [
      "We audit name, categories, services, attributes, and duplicate listings that split your authority. Then we align the profile with your website NAP so Google treats one business, not three versions of it.",
      "Ongoing management covers posts, photo updates, Q&A, and review responses. For multi-city operators we keep Dubai, Ujjain, or additional locations consistent without keyword stuffing the business name.",
    ],
    outcomes: [
      "Clean profile with correct categories and services",
      "Photo and post cadence for Maps freshness",
      "Review request and response process",
      "Duplicate listing cleanup where we can claim them",
    ],
    process: [
      { title: "Claim", description: "Verify access and fix NAP mismatches." },
      { title: "Optimize", description: "Categories, services, photos, and description." },
      { title: "Maintain", description: "Posts, reviews, and monthly visibility checks." },
    ],
    faqs: [
      {
        question: "Can you manage more than one location?",
        answer:
          "Yes. Each location needs its own profile, photos, and reviews. We set a process so UAE and India listings stay accurate.",
      },
      {
        question: "Do reviews really affect rankings?",
        answer:
          "Review volume, recency, and ratings are strong local signals. We help you ask at the right moment and reply professionally — we do not buy fake reviews.",
      },
      {
        question: "How is this different from SEO?",
        answer:
          "SEO covers your website. Google Business Profile is the Maps listing. Most local businesses need both so Search and Maps reinforce each other.",
      },
    ],
  },
  {
    slug: "web-development",
    title: "Web Development",
    metaTitle: "Web Development in Dubai & Ujjain",
    metaDescription:
      "Custom website development with React, Next.js, and WordPress. Fast, SEO-ready sites for businesses in Dubai, the UAE, Ujjain, and India from Hussaini IT Services.",
    keywords: ["web development Dubai", "Next.js agency UAE", "website design Ujjain"],
    headline: "Websites built to load fast and convert",
    intro:
      "We design and build marketing sites and custom web apps. Stacks we use most: Next.js, React, WordPress, and Webflow — chosen for your content workflow, not a one-size template.",
    body: [
      "Projects include information architecture, UI, responsive build, analytics, and basic on-page SEO so the site can be indexed on day one. We avoid page-builder bloat unless WordPress is the right CMS for your editors.",
      "If you already have a site, we can rebuild it for speed, accessibility, and cleaner URLs. Hosting, domains, and training are part of handover so your team can update content without us in the way.",
    ],
    outcomes: [
      "Custom design matched to your brand",
      "Responsive Next.js, React, or WordPress build",
      "On-page SEO, analytics, and contact forms",
      "Launch support and editor training",
    ],
    process: [
      { title: "Scope", description: "Pages, integrations, and success metrics." },
      { title: "Build", description: "Design, development, and content migration." },
      { title: "Launch", description: "QA, SEO checks, and go-live support." },
    ],
    faqs: [
      {
        question: "How long does a website take?",
        answer:
          "Most marketing sites take 2–6 weeks after content is ready. Custom applications are estimated after a short discovery call.",
      },
      {
        question: "Do you work with existing brands?",
        answer:
          "Yes. Send your logo, colours, and any Figma or PDF guidelines. We can also create a simple system if you do not have one.",
      },
      {
        question: "Will the site be SEO-ready?",
        answer:
          "Yes. Titles, headings, sitemap, robots, and performance are part of the build. Ongoing SEO retainers are optional after launch.",
      },
    ],
  },
  {
    slug: "android-apps",
    title: "Android App Development",
    metaTitle: "Android App Development",
    metaDescription:
      "Android app development with Flutter and native-ready architecture. Hussaini IT Services designs, builds, and launches business apps for UAE and India companies.",
    keywords: ["Android app development Dubai", "Flutter app India", "mobile app agency UAE"],
    headline: "Android apps that match how your operations actually work",
    intro:
      "We build Android applications for bookings, field teams, catalogues, and internal tools. Flutter is our default when you also need iOS later; we choose native only when the product requires it.",
    body: [
      "Discovery covers user roles, offline needs, and store listing requirements. You get wireframes before we write production code, so scope stays honest.",
      "Delivery includes Play Store submission support, crash monitoring setup, and a handover of the codebase. We can retain for updates after launch.",
    ],
    outcomes: [
      "Product scope and UX flows",
      "Flutter or Android build with API integration",
      "Play Store listing and asset guidance",
      "Post-launch fix window and optional retainers",
    ],
    process: [
      { title: "Discover", description: "Users, features, and store constraints." },
      { title: "Design", description: "Flows, UI, and API contracts." },
      { title: "Ship", description: "Build, test, and Play Store release." },
    ],
    faqs: [
      {
        question: "Can one codebase cover Android and iOS?",
        answer:
          "Usually yes, with Flutter. We flag platform-specific work (payments, notifications, store rules) during scoping.",
      },
      {
        question: "Do you publish to the Play Store?",
        answer:
          "We prepare the listing and guide the release. You keep the developer account; we submit with you or on your behalf if access is granted.",
      },
      {
        question: "What about backend and admin?",
        answer:
          "We can build the API and a simple admin, or integrate the systems you already use.",
      },
    ],
  },
  {
    slug: "ios-apps",
    title: "iOS App Development",
    metaTitle: "iOS App Development",
    metaDescription:
      "iOS app development for iPhone and iPad. Hussaini IT Services builds Flutter and Apple-ready apps for businesses in the UAE and India.",
    keywords: ["iOS app development Dubai", "iPhone app agency", "Flutter iOS India"],
    headline: "iOS apps that feel native and pass App Store review",
    intro:
      "We design and build iPhone and iPad apps with a clear path through App Store review. Flutter covers most products; we plan Apple-specific features (Sign in with Apple, notifications, IAP) up front.",
    body: [
      "Review guidelines catch teams off guard. We design privacy prompts, account deletion, and listing metadata as part of the project, not as a last-minute scramble.",
      "You receive TestFlight builds during development so stakeholders can tap the real product before it goes live.",
    ],
    outcomes: [
      "UX tailored to iOS patterns",
      "TestFlight builds during development",
      "App Store listing and review support",
      "Handover of source and certificates process",
    ],
    process: [
      { title: "Plan", description: "Features, Apple guidelines, and accounts." },
      { title: "Build", description: "UI, APIs, and TestFlight cycles." },
      { title: "Release", description: "Store listing, review, and launch." },
    ],
    faqs: [
      {
        question: "Do I need an Apple Developer account?",
        answer:
          "Yes. The account stays in your company name. We help you enrol and configure certificates.",
      },
      {
        question: "Can you update the app after launch?",
        answer:
          "Yes. Most clients keep a monthly or quarterly update retainer for OS changes and small features.",
      },
      {
        question: "Will it work on iPad?",
        answer:
          "We can ship iPhone-only or adaptive iPad layouts. That choice is made in the proposal because it affects design time.",
      },
    ],
  },
  {
    slug: "ecommerce",
    title: "Ecommerce Development",
    metaTitle: "Ecommerce Website Development",
    metaDescription:
      "Shopify and custom ecommerce development from Hussaini IT Services. Product catalogues, checkout, and conversion work for stores in the UAE and India.",
    keywords: ["Shopify development Dubai", "ecommerce website UAE", "online store Ujjain"],
    headline: "Stores that are easy to buy from and easy to run",
    intro:
      "We build ecommerce on Shopify when you need speed to launch, and custom stacks when the catalogue or pricing is too specific for a theme. Checkout, shipping, and payment methods are scoped for UAE and India from day one.",
    body: [
      "Theme work includes collection architecture, product templates, and trust content (shipping, returns, local payment logos). We connect analytics so you can see which products actually sell, not just which get clicks.",
      "If you are migrating from another platform, we plan redirects so SEO equity is not thrown away with the old URLs.",
    ],
    outcomes: [
      "Shopify or custom storefront",
      "Payments and shipping for your markets",
      "Product templates and merchandising structure",
      "Analytics and launch QA",
    ],
    process: [
      { title: "Catalogue", description: "Products, variants, and tax/shipping rules." },
      { title: "Build", description: "Theme or custom storefront and checkout." },
      { title: "Sell", description: "QA, redirects, and go-live checklist." },
    ],
    faqs: [
      {
        question: "Shopify or custom — how do you decide?",
        answer:
          "Shopify is the default for most catalogues. We recommend custom when you have unusual pricing, B2B rules, or a product experience a theme cannot support cleanly.",
      },
      {
        question: "Do you handle payment gateways in the UAE and India?",
        answer:
          "We integrate the gateways you choose (for example Shopify Payments, Stripe, or local providers) and test checkout on mobile.",
      },
      {
        question: "Can you migrate my existing store?",
        answer:
          "Yes. We move products, customers where possible, and set 301 redirects from old URLs.",
      },
    ],
  },
  {
    slug: "customized-ecommerce-store",
    title: "Customized Ecommerce Store",
    metaTitle: "Custom Ecommerce Store Development",
    metaDescription:
      "Custom ecommerce stores with tailored catalogues, B2B pricing, and checkout flows. Built by Hussaini IT Services for brands that outgrow generic themes.",
    keywords: ["custom ecommerce Dubai", "B2B store development", "Shopify Plus agency"],
    headline: "Ecommerce shaped around your catalogue, not a theme's limits",
    intro:
      "Some stores need more than a theme: dealer pricing, bulk enquiry, configurators, or a catalogue that does not fit standard variants. We build those stores as custom Shopify work or a dedicated web app.",
    body: [
      "We map the buying journey with you — quote, approval, or instant checkout — then implement only the rules that sales actually uses. That keeps the build smaller than a full ERP rewrite.",
      "Admins get a merchandising workflow they can live with. If Shopify Admin is enough, we extend it. If not, we add a thin admin for the pieces Shopify cannot model.",
    ],
    outcomes: [
      "Custom product and pricing logic",
      "Checkout or enquiry flow that matches sales",
      "Admin merchandising that your team can run",
      "Performance and SEO on collection pages",
    ],
    process: [
      { title: "Model", description: "Products, roles, and pricing rules." },
      { title: "Prototype", description: "Key flows before full build." },
      { title: "Harden", description: "Payments, edge cases, and launch." },
    ],
    faqs: [
      {
        question: "Is this the same as a normal Shopify site?",
        answer:
          "No. A customized store includes logic a theme cannot do well — B2B price lists, configurators, or multi-step approval. We only recommend it when a standard store would fight you every week.",
      },
      {
        question: "Can we start simple and customize later?",
        answer:
          "Yes. Many clients launch on Shopify, then we add custom apps once the catalogue and sales process are proven.",
      },
      {
        question: "Who owns the code?",
        answer:
          "You own custom work we build for you, as defined in the project agreement. Theme and third-party app licenses stay with their vendors.",
      },
    ],
  },
  {
    slug: "logo-brochure-designing",
    title: "Logo & Brochure Designing",
    metaTitle: "Logo and Brochure Design",
    metaDescription:
      "Logo, brand mark, and brochure design from Hussaini IT Services. Print-ready and digital files for companies in Dubai, the UAE, and India.",
    keywords: ["logo design Dubai", "brochure design UAE", "brand identity Ujjain"],
    headline: "Identity and print that look as serious as the business",
    intro:
      "We design logos and brochures for companies that need to look credible in a pitch, a trade show, or a Google Business profile. Deliverables are print-ready and digital, with clear usage rules.",
    body: [
      "Logo work includes concept directions, a primary mark, and files for web, social, and print. We do not lock you into a style that only works on a white homepage.",
      "Brochures are structured around the offer: problem, proof, services, and contact. We write or tighten copy if you need it, then export for print shops and PDF share.",
    ],
    outcomes: [
      "Logo concepts and a final mark",
      "File pack for print, web, and social",
      "Brochure layout and print-ready export",
      "Simple brand usage notes",
    ],
    process: [
      { title: "Brief", description: "Audience, competitors, and must-keep elements." },
      { title: "Concepts", description: "Directions you can react to quickly." },
      { title: "Deliver", description: "Final files and print checks." },
    ],
    faqs: [
      {
        question: "How many logo concepts do we get?",
        answer:
          "Typically two to three distinct directions, then refinements on the one you choose. Extra rounds can be added in the proposal.",
      },
      {
        question: "Do you print the brochures?",
        answer:
          "We deliver print-ready files and can coordinate with a printer you already use. Print production itself is quoted separately if you want us to manage it.",
      },
      {
        question: "Can this match our existing website?",
        answer:
          "Yes. If we also built the site, we keep type and colour consistent. If not, send current brand files and we will align.",
      },
    ],
  },
  {
    slug: "business-card-designing",
    title: "Business Card Designing",
    metaTitle: "Business Card Design",
    metaDescription:
      "Business card design with print-ready files. Clean layouts for teams in Dubai and Ujjain from Hussaini IT Services.",
    keywords: ["business card design Dubai", "visiting card design Ujjain"],
    headline: "Cards that scan cleanly and print without surprises",
    intro:
      "We design business cards that stay readable at a glance — name, role, phone, and the one URL people should remember. Files are set up for standard print sizes used in the UAE and India.",
    body: [
      "If you already have a logo, we work within it. If not, a simple mark can be designed as part of a small identity pack.",
      "You receive front/back artwork, bleed, and a PDF your printer can use. QR codes to your site or WhatsApp are optional.",
    ],
    outcomes: [
      "Front and back layout",
      "Print-ready PDF with bleed",
      "Optional QR to site or WhatsApp",
      "Team name/role variants if needed",
    ],
    process: [
      { title: "Details", description: "Names, titles, and print size." },
      { title: "Design", description: "One to two layout options." },
      { title: "Files", description: "Print PDF and a digital preview." },
    ],
    faqs: [
      {
        question: "What size do you design for?",
        answer:
          "Standard UAE and India visiting-card sizes unless you specify otherwise. We confirm with your printer if they have a template.",
      },
      {
        question: "Can you design cards for the whole team?",
        answer:
          "Yes. We lock the layout, then swap names and titles. Volume pricing is in the proposal.",
      },
      {
        question: "Do you include foil or special finishes?",
        answer:
          "We can design for foil, spot UV, or textured stock. Those finishes depend on the printer and are specified before artwork is final.",
      },
    ],
  },
  {
    slug: "video-editing",
    title: "Video Editing",
    metaTitle: "Video Editing Services",
    metaDescription:
      "Video editing for ads, reels, and brand films. Hussaini IT Services cuts social-ready and web-ready videos for clients in the UAE and India.",
    keywords: ["video editing Dubai", "reels editor UAE", "promotional video India"],
    headline: "Edits that hold attention on the platforms you actually use",
    intro:
      "We edit promotional videos, reels, and short brand films from footage you supply or from a shoot we help plan. Deliverables are sized for Instagram, LinkedIn, YouTube, and your website.",
    body: [
      "A typical job includes a first cut, one structured revision round, captions, and colour that matches your brand. We will tell you if the raw footage cannot support the story you want — before you spend the budget.",
      "For social retainers, we can batch weekly reels from a single shoot day so you are not filming every morning.",
    ],
    outcomes: [
      "First cut and a clear revision round",
      "Captions and platform-specific exports",
      "Colour and audio cleanup",
      "Optional thumbnail or cover frame",
    ],
    process: [
      { title: "Brief", description: "Audience, length, and platform." },
      { title: "Cut", description: "Story, pacing, and captions." },
      { title: "Export", description: "Revisions and platform files." },
    ],
    faqs: [
      {
        question: "Do you film, or only edit?",
        answer:
          "Editing is the core service. We can recommend a shooter in Dubai or Ujjain, or work from footage you already have.",
      },
      {
        question: "What do you need from us?",
        answer:
          "Raw clips, brand colours/logo, any must-use lines, and the platform (Reel, ad, YouTube). A rough voiceover script helps if there is VO.",
      },
      {
        question: "How fast can a reel turn around?",
        answer:
          "Simple social cuts are often 2–4 business days after we have footage. Longer films are scheduled in the proposal.",
      },
    ],
  },
  {
    slug: "ai-integration",
    title: "AI Integration",
    metaTitle: "AI Integration for Business Websites",
    metaDescription:
      "Practical AI integration for websites and operations: chat, document search, automation, and internal tools. Implemented by Hussaini IT Services.",
    keywords: ["AI integration Dubai", "ChatGPT for business", "AI automation UAE"],
    headline: "AI features that sit inside your real workflow",
    intro:
      "We add AI where it saves time or improves response quality — site assistants, document Q&A, lead triage, and internal tools. We do not bolt a generic chatbot onto a page and call the project done.",
    body: [
      "Scope starts with the data you are allowed to use and the action the model should take (answer, draft, classify, or hand off to a human). Then we implement with clear fallbacks so customers are not stuck in a loop.",
      "Integrations typically land in Next.js apps, CRMs, or WhatsApp. You keep control of prompts, logging, and what gets stored.",
    ],
    outcomes: [
      "Use-case and data-access plan",
      "Assistant or automation in your product",
      "Handoff to email, CRM, or a person",
      "Basic monitoring and prompt ownership",
    ],
    process: [
      { title: "Define", description: "Job-to-be-done and allowed data." },
      { title: "Build", description: "Model, UI, and guardrails." },
      { title: "Review", description: "Test real queries and tune." },
    ],
    faqs: [
      {
        question: "Which AI models do you use?",
        answer:
          "We pick based on cost, privacy, and the task. Common options include current OpenAI and comparable APIs. You are not locked into a brand in the marketing copy.",
      },
      {
        question: "Will it train on our customer data?",
        answer:
          "Not unless you explicitly choose a setup that does. Default builds use API calls with retention settings you approve.",
      },
      {
        question: "Is this the same as the AI voice agent?",
        answer:
          "No. AI integration is for web and ops tools. The voice agent is a separate calling product. They can share a knowledge base if that helps.",
      },
    ],
  },
  {
    slug: "ai-voice-calling-agent",
    title: "AI Voice Calling Agents",
    metaTitle: "AI Voice Calling Agents",
    metaDescription:
      "AI voice agents for inbound and outbound calls: lead qualification, appointment booking, and after-hours support. Built by Hussaini IT Services for UAE and India businesses.",
    keywords: ["AI voice agent Dubai", "AI calling bot", "appointment booking voice AI"],
    headline: "A voice agent that answers, qualifies, and books",
    intro:
      "Our AI voice calling agents handle inbound and outbound calls in a natural conversational style. Typical jobs: qualify leads, book appointments, and cover the hours your team cannot.",
    body: [
      "We write the call script with you — opening, qualifying questions, objection handling, and when to transfer to a human. Multilingual support is available when the use case needs English plus Hindi or another language.",
      "The agent connects to your calendar or CRM so bookings and notes do not live in a spreadsheet. You get call logs to review quality instead of guessing what callers heard.",
    ],
    outcomes: [
      "Script and qualification criteria you approve",
      "Inbound and/or outbound calling",
      "Calendar or CRM booking",
      "Call logs and a human-handoff path",
    ],
    process: [
      { title: "Script", description: "Outcomes, questions, and escalation." },
      { title: "Connect", description: "Phone, calendar, and CRM." },
      { title: "Tune", description: "Listen to real calls and adjust." },
    ],
    faqs: [
      {
        question: "Will callers know it is AI?",
        answer:
          "We recommend being transparent. The agent still needs a clear voice, short questions, and a fast path to a person when the request is complex.",
      },
      {
        question: "Can it book appointments automatically?",
        answer:
          "Yes, when we connect a calendar with real availability. Rules (buffers, staff, locations) are set during setup.",
      },
      {
        question: "Does it work for UAE and India numbers?",
        answer:
          "We scope telephony per country so caller ID, working hours, and language match the market you are calling.",
      },
    ],
  },
];

export function getServicePage(slug: string) {
  return servicePages.find((service) => service.slug === slug);
}

export function getServiceSlugs() {
  return servicePages.map((service) => service.slug);
}
