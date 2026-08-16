// Final copy — from docs/Portfolio_Handoff_for_Claude_Code.md (v2). This is
// the owner's own voice; do not rewrite it, do not add marketing language.
// Structure/layout follows the Figma file; words come from the handoff doc.

// Order matches the actual page flow (see Home() in App.tsx):
// Hero -> About -> Skills -> Work -> Experience -> Certifications -> Contact.
export const nav = {
  logotype: "Osanda Senevirathna",
  links: [
    { label: "About", href: "#about" },
    { label: "Skills", href: "#skills" },
    { label: "Work", href: "#work" },
    { label: "Experience", href: "#experience" },
    { label: "Certifications", href: "#certifications" },
    { label: "Contact", href: "#contact" },
  ],
  cta: "Get in touch",
};

export const hero = {
  badge: "Available for freelance projects",
  // Each line: plain text with the emphasised word(s) wrapped in **bold**.
  headlineLines: ["Design with **Intent**,", "build with **Passion**."],
  subline:
    "A designer who also writes code. Brand identity, UI/UX and photography on one side, React and full stack builds on the other.",
  name: "Osanda Senevirathna",
  title: "Designer and Developer",
  primaryCta: { label: "Get in touch", href: "#contact" },
  secondaryCta: { label: "Download CV", href: "/Osanda_Senevirathna_CV.pdf" },
  credentials: ["BSc (Hons) IT — University of Kelaniya", "CMJD Certified", "PIXELS '26 — First Place"],
};

export const about = {
  eyebrow: "ABOUT",
  heading: "A bit **about me**",
  body: [
    "I started out with photography and graphic design while I was still in school. That turned into a real interest in how things look and how they actually work, so when it came time to pick a degree I went with IT. I'm now in my second year of a BSc (Hons) in Information Technology at the University of Kelaniya.",
    "Design thinking is my core strength. I'm comfortable on the creative side, and the degree is filling in the technical half, so I can take something from a rough idea to a thing that actually runs.",
    "Where I want to end up is the creative side, but with the technical ability to back it up. Product design and UX is the main direction I'm heading in. The technical areas I'm most interested in are front end development with React, design systems, and how AI tools are going to fit into design work, because I don't think anyone has fully worked that last one out yet.",
    "Outside of all this I shoot photos, play guitar, and travel when I get the chance.",
  ],
  facts: [
    { label: "Based in", value: "Galle, Sri Lanka" },
    { label: "Studying", value: "BSc (Hons) IT, 2nd year" },
    { label: "Focus", value: "Product design & UX" },
    { label: "Open to", value: "Freelance & internships" },
  ],
};

export const skills = {
  eyebrow: "SKILLS",
  heading: "What I **work with**",
  groups: [
    { title: "Languages", tags: ["Java", "C++", "JavaScript", "SQL", "HTML", "CSS"] },
    { title: "Frameworks & Libraries", tags: ["React", "Spring Boot", "Node.js", "Express", "Tailwind CSS", "Vite"] },
    { title: "Databases", tags: ["MySQL", "PostgreSQL", "Supabase"] },
    { title: "Cloud & Hosting", tags: ["Vercel", "Render"] },
    { title: "Design & Creative", tags: ["Figma", "Photoshop", "Illustrator", "Lightroom", "Premiere Pro", "Canva", "Framer"] },
    { title: "Soft Skills", tags: ["Creative problem solving", "Teamwork", "Adaptability"] },
  ],
};

export type ProjectLink = { label: string; href: string };

export type Project = {
  kind: string;
  title: string;
  description: string;
  tags: string[];
  tagsUnconfirmed?: boolean;
  contribution: string;
  liveLink?: ProjectLink;
  repoHref?: string;
  showRepoLink: boolean;
};

export const work = {
  creative: {
    heading: "Creative **work**",
    intro: "Brand identity, campaign visuals and photography for real clients and events.",
    projects: [
      {
        kind: "BRANDING",
        title: "Inspire by IPE",
        description:
          "Social media design for an electrical engineering and building services company. I handled the visual direction and produced the post designs, keeping the look consistent across every campaign.",
        tags: ["Photoshop"],
        contribution: "Solo designer",
        liveLink: { label: "View on Facebook", href: "https://www.facebook.com/Inspirebuildingservices/" },
        showRepoLink: false,
      },
      {
        kind: "WEB BUILD",
        title: "Leisure Land Website",
        description:
          "A full redesign of the website for a nature inspired villa. I rebuilt it from scratch, working through the layout, the visual direction and the front end build.",
        tags: ["Stack TBC"],
        tagsUnconfirmed: true,
        contribution: "Solo, design and build",
        liveLink: { label: "View live", href: "https://leisureland.lk" },
        showRepoLink: false,
      },
      {
        kind: "PHOTOGRAPHY & BRANDING",
        title: "Udara Antique",
        description:
          "Product photography and brand identity for an antique dealer. I shot the pieces and built the visual identity around the character of the work itself.",
        tags: ["Lightroom", "Photoshop", "Illustrator"],
        contribution: "Solo, photography and branding",
        showRepoLink: false,
      },
      {
        kind: "VISUAL IDENTITY",
        title: "hackX 11.0 & hackX Jr 9.0",
        description:
          "Visual identity for both hackX 11.0 and hackX Jr 9.0. I led the design team and set the theme colours, typography and key visuals that ran across the whole marketing campaign for both events.",
        tags: ["Illustrator", "Photoshop"],
        contribution: "Lead designer, led the main design team",
        showRepoLink: false,
      },
    ] as Project[],
  },
  technical: {
    heading: "Technical **work**",
    intro: "University projects and personal builds. Repos are linked where they exist.",
    projects: [
      {
        kind: "FULL STACK",
        title: "Taskora",
        description:
          "A real time task management app, somewhere close to a lightweight Jira or Trello. Built as a group project for a software engineering module. Users can create, assign and track tasks, and changes show up live for everyone through Socket.IO. It also handles project manager roles, collaborators and notifications.",
        tags: ["React", "Vite", "Node.js", "Express", "PostgreSQL", "Supabase", "Prisma", "Socket.IO", "Render"],
        contribution: "Group project",
        repoHref: "https://github.com/osaadevs/task-management-system",
        showRepoLink: true,
      },
      {
        kind: "JAVA / OOP",
        title: "Pet Adoption System",
        description:
          "This one was our way into object oriented programming with Java. We built a system to handle pet adoption workflows and used it to actually work through inheritance, polymorphism, encapsulation and abstraction rather than just reading about them. It connects to a MySQL database for user data and inventory.",
        tags: ["Java", "MySQL"],
        contribution: "Group project",
        repoHref: "https://github.com/osaadevs/OOP_Project",
        showRepoLink: true,
      },
      {
        kind: "FRONT END",
        title: "This portfolio site",
        description:
          "The site you're on. Built from scratch rather than assembled in a page builder, so it doubles as a front end project.",
        tags: ["React", "Vite", "Tailwind CSS", "Framer Motion", "Vercel"],
        contribution: "Solo",
        repoHref: "https://github.com/osaadevs/portfolio",
        showRepoLink: true,
      },
      {
        kind: "C++ / FUNDAMENTALS",
        title: "Snake Game",
        description:
          "A console based snake game in C++. Small, but it covers the fundamentals properly, the real time game loop, collision detection and dynamic state management.",
        tags: ["C++"],
        contribution: "Solo",
        repoHref: "https://github.com/osaadevs/snake-game",
        showRepoLink: true,
      },
    ] as Project[],
  },
};

export type TimelineItem = {
  period: string;
  role: string;
  org?: string;
  note?: string;
};

// Flattened list for the dedicated /projects page, tagged by group for the
// filter. Order: creative first, then technical (matches the home sections).
export type GroupedProject = Project & { group: "Creative" | "Technical" };

export const allProjects: GroupedProject[] = [
  ...work.creative.projects.map((p) => ({ ...p, group: "Creative" as const })),
  ...work.technical.projects.map((p) => ({ ...p, group: "Technical" as const })),
];

export const projectsPage = {
  eyebrow: "WORK",
  heading: "All **projects**",
  intro: "Creative and technical work in one place. Filter by type below.",
  filters: ["All", "Creative", "Technical"] as const,
};

export const experienceEducation = {
  eyebrow: "EXPERIENCE & EDUCATION",
  experience: {
    title: "Experience",
    entries: [
      {
        period: "2023 — present",
        role: "Co-Founder & Creative Lead",
        org: "Minutes Digital",
        note: "Directing end to end video and photo production, from shooting and lighting through to post production and final colour grading. Leading brand identity and UI/UX design for client campaigns, and turning brand strategy into social media content for local businesses.",
      },
      {
        period: "2023 — present",
        role: "Lead Graphic Designer",
        org: "Dessina.co",
        note: "Leading brand identity design for corporate clients, focused on modern, minimalist visual systems and logo development. Executing design assets across client marketing, digital campaigns and holiday branding work.",
      },
      {
        period: "2023 — present",
        role: "Freelance Designer",
        note: "Independent design work for clients including Inspire Engineering by IPE and Shakya Engineering & Construction. Brand identity, social media campaigns and product photography.",
      },
      {
        period: "2025 — present",
        role: "Media Team",
        org: "IMSSA — University of Kelaniya",
        note: "End to end media coverage for departmental events including IM Spotlight and hackathons. Event photography, video production and post editing, plus promotional assets for social campaigns. Helped set up standardised media guidelines and a digital asset repository so the workflow carries between batches.",
      },
      {
        period: "2025 — 2026",
        role: "Media Team",
        org: "Rotaract Club — University of Kelaniya",
        note: "Event photography and post processing for club events and university wide initiatives. Designed promotional flyers, social graphics and PR visuals for flagship events including Career Fair 2026.",
      },
      {
        period: "2020 — 2023",
        role: "Web Team President",
        org: "Mahinda College",
        note: "Led the school web team for three years, handling the site and the team behind it.",
      },
    ] as TimelineItem[],
  },
  education: {
    title: "Education",
    entries: [
      {
        period: "2025 — present",
        role: "BSc (Hons) in Information Technology",
        org: "University of Kelaniya",
        note: "Expected graduation 2029",
      },
      {
        period: "2023",
        role: "G.C.E. Advanced Level, Common Stream",
        org: "Mahinda College, Galle",
        note: "Combined Mathematics, Physics, ICT",
      },
    ] as TimelineItem[],
  },
};

export const certifications = {
  eyebrow: "CERTIFICATIONS & ACHIEVEMENTS",
  heading: "Certifications & **achievements**",
  certs: [
    {
      year: "2023",
      title: "Comprehensive Master Java Developer (CMJD)",
      issuer: "Institute of Software Engineering (IJSE)",
      inProgress: false,
    },
    {
      year: "In progress",
      title: "Google UX Design Certificate",
      issuer: "Google",
      inProgress: true,
    },
    {
      year: "In progress",
      title: "Stemlink UI/UX Engineer Bootcamp",
      issuer: "Stemlink",
      inProgress: true,
    },
  ],
  achievements: [
    {
      year: "2026",
      title: "PIXELS '26 — First Place",
      issuer: "Inter university graphic design competition",
    },
    {
      year: "2026",
      title: "CryptX 2.0 — First Runners Up",
      issuer: "Designathon",
    },
    {
      year: "2022",
      title: "Idealize 2022 — First Place, School Category",
      issuer: "For PaperCart, a digital repository of categorised past papers for A/L students",
    },
  ],
  resumeBand: {
    title: "Prefer the one-page version?",
    body: "Full CV with experience, education and project detail — PDF, updated August 2026.",
    cta: "Download CV (PDF)",
    href: "/Osanda_Senevirathna_CV.pdf",
  },
};

export type ContactRow = {
  label: string;
  value: string;
  href?: string;
  icon: "mail" | "phone" | "pin" | "linkedin" | "github" | "behance";
};

export const contact = {
  eyebrow: "CONTACT",
  heading: "Let's **talk**",
  intro: "Open to freelance work and internships. The fastest way to reach me is email.",
  primaryCta: { label: "Email me", href: "mailto:senevias@gmail.com" },
  secondaryCta: { label: "Call me", href: "tel:+94772203475" },
  rows: [
    { label: "Email", value: "senevias@gmail.com", href: "mailto:senevias@gmail.com", icon: "mail" },
    { label: "Phone", value: "+94 77 220 3475", href: "tel:+94772203475", icon: "phone" },
    { label: "Location", value: "Galle, Sri Lanka", icon: "pin" },
    {
      label: "LinkedIn",
      value: "/in/osanda-senevirathna",
      href: "https://www.linkedin.com/in/osanda-senevirathna/",
      icon: "linkedin",
    },
    { label: "GitHub", value: "@osaadevs", href: "https://github.com/osaadevs", icon: "github" },
    {
      label: "Behance",
      value: "/osandasenavir",
      href: "https://www.behance.net/osandasenavir",
      icon: "behance",
    },
  ] as ContactRow[],
};

export const footer = {
  name: "Osanda Senevirathna",
  copyright: "© 2026 Osanda Senevirathna",
  links: [
    { label: "About", href: "#about" },
    { label: "Skills", href: "#skills" },
    { label: "Work", href: "#work" },
    { label: "Contact", href: "#contact" },
  ],
  social: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/osanda-senevirathna/" },
    { label: "GitHub", href: "https://github.com/osaadevs" },
    { label: "Behance", href: "https://www.behance.net/osandasenavir" },
    { label: "Instagram", href: "https://www.instagram.com/osaa.___/" },
  ],
};
