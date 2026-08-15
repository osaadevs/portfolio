# osanda.xyz — Build Handoff (v2)

**For:** Claude Code
**Project:** Personal portfolio, single page, hand-coded
**Owner:** Osanda Senevirathna
**Deadline:** 16 Aug 2026
**Design source of truth:** Figma file `6Q5LhMfjaqvBr9LEGle6C9` — "Portfolio Dark Mode Reference"

All copy in Part 4 is final and written in the owner's voice. Use it as written. Do not rewrite it
to sound more polished, do not add marketing language, and do not add em dashes.

The Figma file contains dummy content in every text layer. **Take structure and styling from Figma,
take words from Part 4 of this document.** Where they disagree, this document wins on content and
Figma wins on layout.

---

## 1. Build spec

**Stack:** React + Vite + Tailwind CSS. Framer Motion for animation. Deploy to Vercel.

**Structure:** One page, no routing, no CMS, no separate project pages. Sticky nav pill with anchor
links.

**Section order** (matches the Figma `Desktop / Landing Page — Full` frame):
1. Hero
2. About
3. Skills
4. Work — Creative
5. Work — Technical
6. Experience & Education (two timeline columns, side by side)
7. Certifications & Achievements
8. Contact
9. Footer

Note this differs from a plain rubric ordering: Experience and Education share one section as two
columns, and the CV download appears twice (ghost button in hero, plus a dedicated band in section 7).

**Quality floor, non negotiable:** responsive down to 360px, visible keyboard focus, real `<a>` and
`<button>` elements, `prefers-reduced-motion` respected, no console errors, no dead links, semantic
heading order, alt text on every image. The assignment grades responsiveness, load speed and broken
links directly.

---

## 2. Design tokens

**Pull these from Figma rather than retyping them.** All 22 variables already have web code syntax
set, so `get_variable_defs` on the landing page frame returns them in CSS custom property form.
Values below are for reference and for catching drift.

`Portfolio / Dark` collection:

```css
--color-bg-base:        #141517;  /* page background */
--color-bg-surface:     #1C1E21;  /* cards */
--color-bg-elevated:    #232529;  /* tags, nested chips */
--color-border:         #2C2F34;
--color-text-primary:   #F2F4F6;
--color-text-secondary: #9AA0A6;  /* body copy */
--color-text-muted:     #6B7076;  /* labels, meta */
--color-accent:         #1F8BFF;  /* azure */
--color-accent-press:   #0F6FD9;
--color-on-accent:      #FFFFFF;
```

`Scale` collection: spacing `xs` through `2xl`, radius `sm` through `full`, stroke `hairline`.
Map these to the Tailwind theme rather than using Tailwind's defaults, so the code and the Figma
file stay in sync.

**Accent discipline:** azure is for links, active nav state, focus rings, the primary CTA, tag
accents and the section-heading second half. Not for body text, not for large filled areas.

**Type — one conflict to resolve.** The Figma file was built with **Inter**. The owner asked for
**Manrope**. Build in Manrope and update the Figma text styles to match afterwards, since Manrope
was the explicit preference and Inter was just the available default at build time. Manrope's
metrics are close enough that the Figma layout will hold.

Weights: 300, 400, 500, 600, 700, 800. Load from Google Fonts, subset to latin, `font-display: swap`.

Heading treatment carries the personality. Split weight inside a single heading, same size, same
line, as the Figma section headers do:

```html
<h2><span class="font-extralight">Creative</span> <span class="font-extrabold">work</span></h2>
```

---

## 3. Components

Thirteen components already exist in Figma. Build the React components to match these names and
props, so the design file and the codebase share a vocabulary.

| Figma component | Props / variants | React notes |
|---|---|---|
| Button | Style × Size (6 variants), `Label` | Primary (azure fill + glow shadow), ghost, sizes |
| Icon | `Name` axis, 8 glyphs | Inline SVG sprite is fine |
| Icon Button | 2 variants, `Icon` instance swap | Used in nav and contact |
| Tag | `Label` | Skill chips, tech stack tags |
| Status Badge | `Label` | The "Available for freelance projects" pill |
| Section Header | `Eyebrow`, `Heading` | Handles the split-weight heading |
| Fact Card | `Label`, `Value` | Four of these in About |
| Skill Card | `Title`, nested Tag instances | Six of these, two rows of three |
| Cert Card | `Year`, `Title`, `Issuer` | Certifications grid |
| Timeline Entry | `Date`, `Role`, `Org`, `Note` | Experience and Education columns |
| Contact Row | `Label`, `Value` | Six rows in Contact |
| Project Card | `Kind`, `Title`, `Description`, `Contribution`, `Show Repo Link` (bool) | Both work sections |
| Nav Bar | `Logotype`, nested Button | Sticky pill |

The `Show Repo Link` boolean on Project Card is what separates creative cards (no repo) from
technical cards (repo link shown). Keep that as a prop rather than making two components.

---

## 4. Motion

Rich but never distracting. The owner asked for animation on as many elements as reasonable, without
it getting in the way.

- **Page load:** hero staggers in. Signature, heading lines, subline, availability pill. Roughly
  60ms apart, 500ms each, ease-out.
- **Scroll reveal:** each section fades up 24px on enter, staggered by child, triggering once.
- **Project cards:** image scales to 1.03 on hover over 400ms, arrow shifts right 8px, border
  brightens toward `--color-accent` at low opacity.
- **Primary CTA:** the azure glow shadow from Figma intensifies slightly on hover.
- **Nav:** active section highlights as you scroll. Smooth scroll on anchor click.
- **Buttons and links:** 150ms colour transitions, underlines growing from the left.
- **Skill tags:** stagger on reveal, nothing on hover.

Wrap all of it in a `prefers-reduced-motion: reduce` guard that degrades to plain opacity fades.

---

## 5. Copy

Final. Paste as written.

### 5.1 Hero

Availability badge: `Available for freelance projects`

Heading, extrabold on "Intent" and "Passion":
```
Design with Intent, build with Passion.
```

Subline:
```
A designer who also writes code. Brand identity, UI/UX and photography on one side,
React and full stack builds on the other.
```

Name block:
```
Osanda Senevirathna
Designer and Developer
```

Credential chips (these replaced the fake client logo strip in the Figma design):
```
BSc (Hons) IT — University of Kelaniya
CMJD Certified
PIXELS '26 — First Place
```

Primary CTA `Get in touch` → Contact. Ghost CTA `Download CV` → PDF.

Photo: the headshot from the current Framer site, not the CV one. Owner is providing the export.

### 5.2 About

Heading: `A bit **about me**`

```
I started out with photography and graphic design while I was still in school. That turned
into a real interest in how things look and how they actually work, so when it came time to
pick a degree I went with IT. I'm now in my second year of a BSc (Hons) in Information
Technology at the University of Kelaniya.

Design thinking is my core strength. I'm comfortable on the creative side, and the degree is
filling in the technical half, so I can take something from a rough idea to a thing that
actually runs.

Where I want to end up is the creative side, but with the technical ability to back it up.
Product design and UX is the main direction I'm heading in. The technical areas I'm most
interested in are front end development with React, design systems, and how AI tools are
going to fit into design work, because I don't think anyone has fully worked that last one
out yet.

Outside of all this I shoot photos, play guitar, and travel when I get the chance.
```

Four Fact Cards beside it:
```
Based in      Galle, Sri Lanka
Studying      BSc (Hons) IT, 2nd year
Focus         Product design & UX
Open to       Freelance & internships
```

### 5.3 Skills

Heading: `What I **work with**`

Six Skill Cards, two rows of three:

```
Languages
Java, C++, JavaScript, SQL, HTML, CSS

Frameworks & Libraries
React, Spring Boot, Node.js, Express, Tailwind CSS, Vite

Databases
MySQL, PostgreSQL, Supabase

Cloud & Hosting
Vercel, Render

Design & Creative
Figma, Photoshop, Illustrator, Lightroom, Premiere Pro, Canva, Framer

Soft Skills
Creative problem solving, Teamwork, Adaptability
```

No percentage bars, no star ratings. Flat tag chips only.

### 5.4 Work — Creative

Heading: `Creative **work**`
Intro: `Brand identity, campaign visuals and photography for real clients and events.`

**Inspire by IPE**
```
Kind: BRANDING
Description: Social media design for an electrical engineering and building services
company. I handled the visual direction and produced the post designs, keeping the look
consistent across every campaign.
Tags: Photoshop
Contribution: Solo designer
Live: https://www.facebook.com/Inspirebuildingservices/   (label "View on Facebook")
Show Repo Link: false
```

**Leisure Land Website**
```
Kind: WEB BUILD
Description: A full redesign of the website for a nature inspired villa. I rebuilt it from
scratch, working through the layout, the visual direction and the front end build.
Tags: [CONFIRM STACK]
Contribution: Solo, design and build
Live: https://leisureland.lk
Show Repo Link: false
```

**Udara Antique**
```
Kind: PHOTOGRAPHY & BRANDING
Description: Product photography and brand identity for an antique dealer. I shot the pieces
and built the visual identity around the character of the work itself.
Tags: Lightroom, Photoshop, Illustrator
Contribution: Solo, photography and branding
Show Repo Link: false
```

**hackX 11.0 & hackX Jr 9.0**
```
Kind: VISUAL IDENTITY
Description: Visual identity for both hackX 11.0 and hackX Jr 9.0. I led the design team and
set the theme colours, typography and key visuals that ran across the whole marketing
campaign for both events.
Tags: Illustrator, Photoshop
Contribution: Lead designer, led the main design team
Show Repo Link: false
```

Note: Figma's Work section was laid out for three cards per row. Creative has four. Either wrap to a
second row or make it a 2×2 grid. Ayubo Foods has been dropped and is not coming back.

### 5.5 Work — Technical

Heading: `Technical **work**`
Intro: `University projects and personal builds. Repos are linked where they exist.`

**Taskora**
```
Kind: FULL STACK
Description: A real time task management app, somewhere close to a lightweight Jira or
Trello. Built as a group project for a software engineering module. Users can create,
assign and track tasks, and changes show up live for everyone through Socket.IO. It also
handles project manager roles, collaborators and notifications.
Tags: React, Vite, Node.js, Express, PostgreSQL, Supabase, Prisma, Socket.IO, Render
Contribution: Group project
Repo: https://github.com/osaadevs/task-management-system
Show Repo Link: true
```

**Pet Adoption System**
```
Kind: JAVA / OOP
Description: This one was our way into object oriented programming with Java. We built a
system to handle pet adoption workflows and used it to actually work through inheritance,
polymorphism, encapsulation and abstraction rather than just reading about them. It connects
to a MySQL database for user data and inventory.
Tags: Java, MySQL
Contribution: Group project
Repo: https://github.com/osaadevs/OOP_Project
Show Repo Link: true
```

**This portfolio site**
```
Kind: FRONT END
Description: The site you're on. Built from scratch rather than assembled in a page builder,
so it doubles as a front end project.
Tags: React, Vite, Tailwind CSS, Framer Motion, Vercel
Contribution: Solo
Repo: https://github.com/osaadevs/portfolio   [create this repo, see open items]
Show Repo Link: true
```

**Snake Game**
```
Kind: C++ / FUNDAMENTALS
Description: A console based snake game in C++. Small, but it covers the fundamentals
properly, the real time game loop, collision detection and dynamic state management.
Tags: C++
Contribution: Solo
Repo: https://github.com/osaadevs/snake-game
Show Repo Link: true
```

### 5.6 Experience & Education

Two Timeline Entry columns, side by side.

**Experience column** — heading `Experience`

```
2023 — present   Co-Founder & Creative Lead, Minutes Digital
                 Directing end to end video and photo production, from shooting and lighting
                 through to post production and final colour grading. Leading brand identity
                 and UI/UX design for client campaigns, and turning brand strategy into
                 social media content for local businesses.

2023 — present   Lead Graphic Designer, Dessina.co
                 Leading brand identity design for corporate clients, focused on modern,
                 minimalist visual systems and logo development. Executing design assets
                 across client marketing, digital campaigns and holiday branding work.

2023 — present   Freelance Designer
                 Independent design work for clients including Inspire Engineering by IPE and
                 Shakya Engineering & Construction. Brand identity, social media campaigns and
                 product photography.

2025 — present   Media Team, IMSSA — University of Kelaniya
                 End to end media coverage for departmental events including IM Spotlight and
                 hackathons. Event photography, video production and post editing, plus
                 promotional assets for social campaigns. Helped set up standardised media
                 guidelines and a digital asset repository so the workflow carries between
                 batches.

2025 — 2026      Media Team, Rotaract Club — University of Kelaniya
                 Event photography and post processing for club events and university wide
                 initiatives. Designed promotional flyers, social graphics and PR visuals for
                 flagship events including Career Fair 2026.

2020 — 2023      Web Team President, Mahinda College
                 Led the school web team for three years, handling the site and the team
                 behind it.
```

**Education column** — heading `Education`

```
2025 — present   BSc (Hons) in Information Technology
                 University of Kelaniya
                 Expected graduation 2029

2023             G.C.E. Advanced Level, Common Stream
                 Mahinda College, Galle
                 Combined Mathematics, Physics, ICT
```

### 5.7 Certifications & Achievements

Heading: `Certifications & **achievements**`

Cert Cards:
```
2023        Comprehensive Master Java Developer (CMJD)
            Institute of Software Engineering (IJSE)

In progress Google UX Design Certificate
            Google

In progress Stemlink UI/UX Engineer Bootcamp
            Stemlink
```

Style the two in-progress entries with `--color-text-muted` and an explicit "In progress" tag. They
must not read as completed.

Achievements:
```
2026        PIXELS '26 — First Place
            Inter university graphic design competition

2026        CryptX 2.0 — First Runners Up
            Designathon

2022        Idealize 2022 — First Place, School Category
            For PaperCart, a digital repository of categorised past papers for A/L students
```

Then the Download CV band from the Figma design.

### 5.8 Contact

Heading: `Let's **talk**`
Intro: `Open to freelance work and internships. The fastest way to reach me is email.`

Six Contact Rows:
```
Email        senevias@gmail.com                              mailto:senevias@gmail.com
Phone        +94 77 220 3475                                 tel:+94772203475
Location     Galle, Sri Lanka                                (text only)
LinkedIn     /in/osanda-senevirathna                         https://www.linkedin.com/in/osanda-senevirathna/
GitHub       @osaadevs                                       https://github.com/osaadevs
Behance      /osandasenavir                                  https://www.behance.net/osandasenavir
```

Instagram in the footer social links: `https://www.instagram.com/osaa.___/`

CV button label `Download CV`, file at `/public/Osanda_Senevirathna_CV.pdf`, served with a
`download` attribute.

### 5.9 Footer

```
© 2026 Osanda Senevirathna
```
Logotype (signature), nav repeat, social links. No blog link, no fake client logos, no testimonials.

---

## 6. Assets needed from owner

| Asset | Notes |
|---|---|
| Signature mark | SVG preferred. Nav logotype and footer |
| Headshot | From the current Framer site, not the CV version |
| Inspire by IPE image | Export from the Framer project |
| Leisure Land image | Export from the Framer project |
| Udara Antique image | Export from the Framer project |
| hackX images | New, not on the current site |
| CV PDF | Being updated last, placeholder file until then |

Export at 2x, WebP where possible, lazy load everything below the fold.

---

## 7. Open items

**Resolved since v1:**
- Leisure Land live URL is `https://leisureland.lk`
- Instagram is `https://www.instagram.com/osaa.___/`
- Ayubo Foods dropped, not starting it
- CV update is the final task, after the site ships

**Still open:**

1. **Leisure Land stack.** Described as a "vibe coded approach" but the actual framework isn't
   confirmed. Needed to fill the tags on that card.

2. **Portfolio repo.** This means the GitHub repository holding this site's own source code. It
   doesn't exist yet. Create `github.com/osaadevs/portfolio` as the first step of the build and the
   link resolves itself. Linking the bare profile URL instead would work but it's weaker, because a
   grader clicking "Repo" on a project card expects to land on that project's code, not a profile page.

3. **Font conflict.** Figma is built in Inter, the owner asked for Manrope. Building in Manrope,
   Figma to be updated after.

4. **Skills mismatch.** The Figma dummy content lists Hibernate and JavaFX under frameworks. Those
   aren't in the filled brief. If they came out of CMJD and are genuinely known, add them. If they
   were placeholder guesses, leave them out.

5. **Figma dummy content.** Every text layer in the Figma file is placeholder. The Project Card
   default still describes Leisure Land as a "marketing site for a leisure park," which is wrong,
   it's a nature inspired villa. Do not copy any text out of Figma.

---

## 8. Task order

1. Create the `portfolio` repo
2. Scaffold Vite + React + Tailwind, map the Figma Scale variables into the Tailwind theme, load Manrope
3. Pull tokens from Figma via `get_variable_defs` rather than retyping
4. Build the 13 components to match the Figma component names and props
5. Assemble sections with placeholder images, final copy from day one
6. Motion pass
7. Responsive pass, 360px up
8. Accessibility pass: focus states, reduced motion, heading order, alt text
9. Drop in real assets
10. Lighthouse, aim 90+ on performance and accessibility
11. Deploy to a Vercel subdomain, click every link
12. Switch osanda.xyz DNS last, only after verifying. The Framer site stays live until this step

**After the site ships:**
- README for `OOP_Project` (has none, graders click through)
- READMEs for `task-management-system` and `snake-game`
- Tidy the GitHub profile
- Update the CV to "Designer and Developer" and fix the degree, then re-upload
