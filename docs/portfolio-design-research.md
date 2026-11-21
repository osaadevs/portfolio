# Portfolio redesign research

Date: 10 October 2026

## Brief and scope

Osanda confirmed product / UX roles as the primary audience. Branding, photography and development support that positioning. This is a research and direction proposal, not an approved redesign or implementation specification.

Reviewed the React/Vite source, shared styles, content model, homepage sections, navigation, project cards, modal, archive and preloader. Previewed the local site, opened the maternal and child health project modal, and inspected the supplied logo and existing project artwork. This was a visual/content review, not a complete accessibility or performance audit.

The older handoff in docs explains the original assignment-led structure. Its instructions are historical context; the current redesign request and explicit exclusions take precedence. Existing uncommitted source edits were left intact.

## Assessment

The current direction is coherent: restrained dark surfaces, consistent spacing, Manrope, blue accents and a recognizable signature. The underlying React components and centralized content are reusable. A framework replacement is unnecessary.

The limit is the presentation model rather than dark design itself:

- The homepage sequence is Hero → About → Skills → Work → Experience → Certifications → Contact. Product work is behind both the introductory sections and the creative-work group.
- The keyboard and glowing blue screen occupy the main visual position. They foreground development before visitors see evidence of product design.
- Work.tsx uses the same three-column card layout for each discipline. ProjectCard adds a framed image, category, tool icons, contribution and repeated detail link. The hierarchy emphasizes containers and tools over the artifact and its purpose.
- ProjectModal limits every project to one image, role, description, tags and links. The Project data type has no case-study sections, image sequence, decisions, iteration or outcomes. That is the most important expansion constraint.
- The existing maternal and child health cover combines a title and three phones. When reduced into a card, most UI detail becomes too small to assess. A wider, purpose-selected screen or flow would communicate more effectively.
- The preloader uses fixed timings totaling approximately 2.47 seconds in normal motion mode rather than tracking actual resource readiness.
- Uppercase eyebrows, the animated aura, glow, blur text effects, chip groups and repeated rounded panels conflict with the new brief.
- Navigation links disappear below the medium breakpoint without a replacement menu. On /projects, shared hash-only links still target sections absent from that route. Address both during the redesign.

## Reading the new logo

The supplied mark has heavy black mass, rounded lowercase forms and a sharp white pen-nib cutout. It feels graphic, approachable and decisive. The useful design contrast is between that expressive mark and quieter supporting typography.

Use the intact logo at a confident but bounded size. Give it generous clear space. Avoid stretching it, turning every image into a letter-shaped mask, or repeating the pen nib as decoration. Test the nib's negative space at small sizes before choosing the favicon. Request/use an original vector export at implementation time if one exists; no tracing was done in this research.

## Direction 1: Graphic clarity — recommended

**Idea:** A confident graphic identity around an immediately readable product portfolio.

**Opening composition:** Black Osa logo aligned left; plain Work, About, Contact navigation right. A short introduction uses the existing sentence “A designer who also writes code.” Below, a large maternal-health interface image enters the first viewport with the project title and an explicit concept designation. Avoid a whole screen devoted to the logo or a slogan.

**Visual system:** Near-white ground and near-black text; a sturdy proportional grotesk, medium-weight navigation, generous body size, restrained borders and mostly square imagery. Project assets supply the color. Start without a decorative accent and introduce one only if a functional or brand need becomes clear.

**Project rhythm:** One large lead project, then two differently proportioned project entries. Captions show the problem and contribution rather than software badges. Detail pages combine large screens with short explanations of decisions. A brand project can use full-bleed graphics; a UX project can use paired screens and annotated flows within the same underlying system.

**Motion:** Optional continuity from project thumbnail to detail image, brief link feedback, user-controlled image sequences. Content remains immediately visible.

**Reference:** [Studio Feixen](https://www.studiofeixen.ch/) for confidence in typography, project imagery and a graphic identity spanning different media. Borrow the confidence, not the experimental navigation or its exact homepage structure.

**Tradeoff:** Typography and image editing must carry the quality. A monochrome shell cannot compensate for weak project assets.

## Direction 2: Editorial portfolio

**Idea:** A portfolio paced like a carefully edited design publication, with room to read how decisions were made.

**Opening composition:** A smaller Osa masthead, a concise personal introduction, a large project image offset against a short text column. Subsequent projects alternate wide imagery, paired details and quiet passages of text.

**Visual system:** Soft white ground, black text, a readable serif used selectively for project titles or narrative passages, and a plain sans serif for navigation and interface captions. No paper texture, ornamental labels or manufactured nostalgia. The logo remains the strongest graphic element.

**Project rhythm:** Dedicated case-study pages with a concise opening summary and sections named for the actual decisions. For maternal health, possible topics include interpreting growth information or supporting midwife data entry, subject to evidence from the project. Photography can be presented at its natural aspect ratio.

**Reference:** [(Studio) Lotta Nieminen](https://www.lottanieminen.com/) for the observed use of large project images, restrained page furniture and editorial text/image pairings. Its navigational typography and interactions are not proposed for direct reuse.

**Tradeoff:** Strongest for thoughtful reading, but can become overly polite or resemble a branding publication. Keep real interface flows prominent so product design remains unmistakable.

## Direction 3: Visual index

**Idea:** A compact, browsable collection of projects with visible titles and a large adjacent preview.

**Opening composition:** Osa and a one-line introduction above a short selected-project index. On desktop, one column lists project titles, roles and status, while the other shows a substantial project image. Clicking opens a proper detail page. On touch devices, each title has an immediately visible preview; essential information never depends on hovering.

**Visual system:** White or very pale gray ground, black proportional type, hairline separators, minimal ornament and a small number of explicit controls. The logo supplies personality; the index supplies clarity.

**Project rhythm:** Three featured projects initially, then an expandable archive organized by product, identity, photography and development. Selecting a category should filter genuine content rather than introduce empty sections.

**Reference:** [PORTO ROCHA](https://www.portorocha.com/) for succinct project titles with descriptive premises and a browsable body of work. Its current dark rounded rows, clock and stacked presentation are not part of this proposal.

**Tradeoff:** Best for a growing archive, but feels sparse with few projects and gives less space to explain product thinking on the homepage. Better as the eventual Work archive than as the leading direction today.

## Shared content and architecture

Recommended homepage order:

1. Identity, a brief introduction and the first product project.
2. Maternal & Child Health Records: label as a concept, clarify Osanda's individual contribution, show design decisions and available evaluation evidence.
3. Leisure Land: use the actual before/after design and build story; confirm the currently unconfirmed implementation stack.
4. One selected identity project, provisionally hackX, demonstrating visual systems and design leadership.
5. Short About section, relevant experience, CV and contact.

Keep the remaining work available in an archive. Move the exhaustive tool list and certification history into About/CV. Taskora can support collaboration and implementation capability if the specific contribution is documented. Smaller university exercises need not have equal prominence with product work.

Create stable project URLs and reusable content blocks: summary, image, image pair, screen sequence, decision, iteration, outcome and reflection. Support different subsets instead of requiring the same process template for every project. Preserve useful existing content and expand it with verified material; do not fabricate research, impact metrics, quotations or outcomes.

[NN/g's UX portfolio guidance](https://www.nngroup.com/articles/ux-design-portfolios/) supports including the problem, role, constraints and design evolution alongside final visuals. This informs the content hierarchy; it does not prescribe the proposed visual style.

## Explicit exclusions

No uppercase monospace eyebrows, ambient blobs, gradient decoration, glowing buttons, generic bento layouts, fake terminal UI, cursor followers, decorative tickers, stock 3D objects, compulsory loaders or all-purpose reveal animations. Distinctiveness should come from composition, typography, the real work and the Osa identity.

## Recommended next design experiment

Compare Graphic clarity and Editorial portfolio using identical real content: the logo, one sentence of introduction, maternal-health project and Leisure Land. Design both the opening and one case-study excerpt, at desktop and mobile sizes. This tests whether each system supports both an immediate impression and sustained reading. Choose one before rebuilding the main site; retain Visual index as an archive option.

Additional reference reviewed: [Studio Dumbar's work index](https://studiodumbar.com/work), useful for discipline and project breadth, but its motion emphasis should not determine this portfolio's behavior.
