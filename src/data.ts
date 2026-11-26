import { allProjects, type Project } from "./content";

// Everything the site says, in one place. Positioning: interface and brand
// designer who also photographs. Professional, plain, first person.
// Project lines for the newer covers only say what the covers themselves
// show; longer write-ups come from content.ts in the owner's own words.

export type Category = "UI/UX" | "Branding" | "Photography" | "Web";

export type Work = {
  slug: string;
  name: string;
  kind: string;
  category: Category;
  /** One short, plain sentence. */
  line: string;
  role: string;
  note?: string;
  img: string;
  /** Flat scene colour, sampled from the cover's edge. */
  bg: string;
  /** Text colour that reads on bg. */
  ink: string;
  /** Where the zoomed detail crops look, as object-positions. */
  focus: string[];
  project?: Project;
};

const find = (prefix: string) => allProjects.find((p) => p.title.startsWith(prefix));
const DARK = "#eef1f6";
const LIGHT = "#070b14";

export const WORKS: Work[] = [
  {
    slug: "suwa-pahana",
    name: "Suwa Pahana",
    kind: "UI/UX concept",
    category: "UI/UX",
    line: "A health record app for mothers, children and midwives, so losing the pink book no longer means losing the history.",
    role: "UI design",
    note: "CryptX 2.0, first runners up",
    img: "/covers/suwa-pahana.jpg",
    bg: "#0e4d45",
    ink: DARK,
    focus: ["50% 40%", "30% 55%", "68% 45%"],
    project: find("Digital Maternal"),
  },
  {
    slug: "leisure-land",
    name: "Leisure Land",
    kind: "Website",
    category: "Web",
    line: "A new website for a nature-inspired water park, designed from a blank page and live today.",
    role: "Web design",
    img: "/covers/leisure-land.jpg",
    bg: "#f2f2f0",
    ink: LIGHT,
    focus: ["72% 40%", "20% 45%", "75% 60%"],
    project: find("Leisure Land"),
  },
  {
    slug: "onesphere",
    name: "OneSphere",
    kind: "Mobile app",
    category: "UI/UX",
    line: "Seamless living, effortless control. Doors, climate and deliveries for the people who live in the building.",
    role: "UI design",
    img: "/covers/onesphere.jpg",
    bg: "#2a1e66",
    ink: DARK,
    focus: ["55% 45%", "40% 50%", "70% 35%"],
  },
  {
    slug: "hackx",
    name: "hackX 11.0",
    kind: "Visual identity",
    category: "Branding",
    line: "The visual identity for two hackathons, hackX 11.0 and hackX Jr 9.0, carried across a full campaign.",
    role: "Lead designer",
    img: "/covers/hackx.jpg",
    bg: "#f5f5f5",
    ink: LIGHT,
    focus: ["50% 62%", "25% 65%", "78% 65%"],
    project: find("hackX"),
  },
  {
    slug: "goodreads",
    name: "Goodreads",
    kind: "App concept",
    category: "UI/UX",
    line: "A Goodreads concept built around your shelf and the next book you'll pick up.",
    role: "UI design",
    img: "/covers/goodreads.jpg",
    bg: "#382111",
    ink: DARK,
    focus: ["52% 45%", "45% 30%", "62% 55%"],
  },
  {
    slug: "ithuru",
    name: "Ithuru",
    kind: "Mobile app",
    category: "UI/UX",
    line: "Leftover nights, shared trips. Made for Sri Lankan hotel owners and their teams.",
    role: "UI design",
    img: "/covers/ithuru.jpg",
    bg: "#053e2f",
    ink: DARK,
    focus: ["62% 40%", "48% 50%", "70% 60%"],
  },
  {
    slug: "waypoint",
    name: "Waypoint",
    kind: "Mobile app",
    category: "UI/UX",
    line: "Trips, stops and deliveries for drivers on the road, one screen at a time.",
    role: "UI design",
    img: "/covers/waypoint.jpg",
    bg: "#1d1918",
    ink: DARK,
    focus: ["50% 45%", "30% 50%", "65% 40%"],
  },
  {
    slug: "aquagrow",
    name: "AquaGrow",
    kind: "Mobile app",
    category: "UI/UX",
    line: "Pods, plants and growing conditions for a home hydroponic garden, readable at a glance.",
    role: "UI design",
    img: "/covers/aquagrow.jpg",
    bg: "#142310",
    ink: DARK,
    focus: ["50% 45%", "35% 40%", "70% 55%"],
  },
  {
    slug: "udara-antique",
    name: "Udara Antique",
    kind: "Photography and branding",
    category: "Photography",
    line: "Product photography and a visual identity for an antique dealer, built around the character of the pieces.",
    role: "Photography and branding",
    img: "/covers/udara-antique.jpg",
    bg: "#0a0a0a",
    ink: DARK,
    focus: ["50% 45%", "15% 50%", "88% 50%"],
    project: find("Udara"),
  },
  {
    slug: "inspire-by-ipe",
    name: "Inspire by IPE",
    kind: "Social media design",
    category: "Branding",
    line: "A consistent social presence for an electrical engineering and building services company.",
    role: "Solo designer",
    img: "/covers/inspire-by-ipe.jpg",
    bg: "#d9d9d9",
    ink: LIGHT,
    focus: ["50% 50%", "20% 55%", "80% 55%"],
    project: find("Inspire"),
  },
];

export const workBySlug = (slug?: string) => WORKS.find((w) => w.slug === slug);

/** Home shows the strongest four; everything lives on /work. */
export const FEATURED = ["ithuru", "leisure-land", "onesphere", "hackx"].map((s) => workBySlug(s)!);

export const CATEGORIES: ("All" | Category)[] = ["All", "UI/UX", "Branding", "Web", "Photography"];

export const HERO_COVERS = WORKS.slice(0, 8).map((w) => w.img);

export const HERO = {
  name: "Osanda Senevirathna",
  place: "Galle, Sri Lanka",
  status: "Available for freelance projects and internships",
  sub: "I design apps, websites and visual identities, and photograph products and events for the brands I work with.",
};

export const INTRO = {
  statement:
    "I'm Osanda, a UI/UX and brand designer based in Galle, Sri Lanka. For the past three years I've designed interfaces and identities, and photographed products and events, for local brands and student-led events.",
  stats: [
    { value: "3+", label: "Years designing for clients" },
    { value: "3", label: "Design awards in 2026" },
    { value: "10", label: "Selected projects" },
  ],
  clients: ["Minutes Digital", "Dessina.co", "Inspire Engineering by IPE", "Shakya Engineering", "Leisure Land", "Udara Antique", "hackX"],
};

export const EXPERTISE = [
  {
    title: "UI/UX design",
    body: "Apps and websites designed around how people actually use them, from research and user flows through to prototypes and production-ready UI.",
    items: ["User research and personas", "User flows and wireframes", "Interactive prototypes", "UI design and design systems"],
    tools: "Figma, Framer",
    // The black OneSphere cover: neutral, so the cobalt card stays the colour.
    img: "/covers/onesphere-dark.jpg",
    bg: "#0036ea",
    ink: DARK,
  },
  {
    title: "Brand identity",
    body: "Identities that hold together everywhere they appear: logo, type and colour, plus the guidelines that keep them consistent.",
    items: ["Logo and identity systems", "Brand guidelines", "Social media and campaigns", "Event branding"],
    tools: "Illustrator, Photoshop",
    img: "/covers/hackx.jpg",
    bg: "#7fd8f0",
    ink: LIGHT,
  },
  {
    title: "Photography",
    body: "Product, event and brand photography, shot, edited and colour graded from start to finish.",
    items: ["Product photography", "Event coverage", "Brand and social content", "Video and colour grading"],
    tools: "Lightroom, Premiere Pro",
    img: "/covers/udara-antique.jpg",
    bg: "#eef1f6",
    ink: LIGHT,
  },
];

export const ABOUT = {
  lead: "I'm a UI/UX and brand designer, and a photographer, studying Information Technology at the University of Kelaniya.",
  bio: [
    "I started with photography and graphic design while I was still in school. That grew into an interest in how things look and how they work, which is why I chose IT for my degree. I'm now in my second year of a BSc (Hons) in Information Technology.",
    "Design thinking is where I'm strongest. Today I work across UI/UX, brand identity and photography: as co-founder and creative lead at Minutes Digital, as lead graphic designer at Dessina.co, and with my own freelance clients.",
    "I'm heading towards product design and UX, and I'm currently working through the Google UX Design certificate and Stemlink's UI/UX Engineer bootcamp. Away from the desk I play guitar and travel when I can. The camera usually comes too.",
  ],
  facts: [
    { label: "Based in", value: "Galle, Sri Lanka" },
    { label: "Studying", value: "BSc (Hons) IT, University of Kelaniya" },
    { label: "Focus", value: "Product design and UX" },
    { label: "Open to", value: "Freelance projects and internships" },
  ],
  tools: ["Figma", "Framer", "Illustrator", "Photoshop", "Lightroom", "Premiere Pro"],
};

export const EXPERIENCE = [
  {
    period: "2023 to present",
    role: "Co-founder and Creative Lead",
    org: "Minutes Digital",
    note: "Leading photo and video production from the shoot through to the final colour grade, along with brand identity and UI/UX work for client campaigns and social content for local businesses.",
  },
  {
    period: "2023 to present",
    role: "Lead Graphic Designer",
    org: "Dessina.co",
    note: "Brand identities and logo development for corporate clients, focused on modern, minimal visual systems, plus the marketing and campaign assets that go with them.",
  },
  {
    period: "2023 to present",
    role: "Freelance Designer",
    org: "Independent",
    note: "Brand identity, social media campaigns and product photography for clients including Inspire Engineering by IPE and Shakya Engineering & Construction.",
  },
  {
    period: "2025 to present",
    role: "Media Team",
    org: "IMSSA, University of Kelaniya",
    note: "Photography, video and promotional design for department events and hackathons, and a shared media guideline so the work carries over between batches.",
  },
  {
    period: "2025 to 2026",
    role: "Media Team",
    org: "Rotaract Club, University of Kelaniya",
    note: "Event photography and editing, plus flyers, social graphics and PR visuals for flagship events including Career Fair 2026.",
  },
];

export const RECOGNITION = [
  { place: "First place", name: "PIXELS '26", detail: "Inter-university graphic design competition", year: "2026" },
  { place: "First place", name: "SLIIT CodeFest 2026", detail: "Designathon", year: "2026" },
  { place: "First runners up", name: "CryptX 2.0", detail: "Designathon, for Suwa Pahana", year: "2026" },
  { place: "First place", name: "Idealize 2022", detail: "School category, for PaperCart", year: "2022" },
];

export const EDUCATION = [
  { period: "2025 to 2029", title: "BSc (Hons) in Information Technology", org: "University of Kelaniya" },
  { period: "2023", title: "G.C.E. Advanced Level", org: "Mahinda College, Galle" },
];

export const LEARNING = [
  { title: "Google UX Design Certificate", org: "Google" },
  { title: "UI/UX Engineer Bootcamp", org: "Stemlink" },
];

export const CONTACT = {
  heading: "Let's work together.",
  intro: "I'm available for freelance projects and internships. Email is the quickest way to reach me.",
};
