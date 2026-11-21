# Redesign plan: "The Nib"

Date: 21 November 2026. Supersedes the "Explicit exclusions" list in `portfolio-design-research.md`: loaders, cursor followers and 3D are now in. Uppercase mono eyebrows stay out.

**Design read:** solo designer-developer portfolio for product/UX hiring managers and clients. The language is kinetic and playful, but precise. Built with React, Motion, React Three Fiber and scroll-driven choreography.
**Dials:** variance 8, motion 8, density 3.

## The idea

Haoqi has his cursor. Osanda has **the pen nib** cut into the `a` of the osa wordmark. The nib is the protagonist of the whole site:

- it **writes** (loader, signature, ink trail)
- it **points** (the cursor)
- it **inspects** (Inspect mode, where the site shows how it was built)

Every effect has to trace back to the nib or to the real work. If an effect does neither, cut it.

## Brand inputs

| Asset | Source | Use |
|---|---|---|
| osa wordmark, 3 vector paths (o, s, a with nib hole) | `PersonalBranding/OsaWordmark.ai`, extracted to SVG | Loader, 3D hero object, nav mark, favicon |
| Cobalt variant `#0036EA` | page 3 of the .ai file | Seed accent for palette A |
| Grainy cyan-to-navy gradient + "Design with Intent, Build with Precision." | `WallpaperMac.psd` (LinkedIn cover) | Hero background shader and headline, so the site matches LinkedIn |
| Photo stills | `PersonalBranding/Photos` | Contact-sheet section (phase 2) |
| Signature | `public/signature.png` | Finale sign-off |

## Colour: a Palette Lab instead of picking blind

Colours aren't final, so the prototype ships three palettes as CSS-variable sets. Press `P`, or use a small swatch control, to switch live on the real site. Pick one after seeing it with the real work, then delete the lab.

| | A. Cobalt Ink | B. Deep Signal | C. Vermilion |
|---|---|---|---|
| Mood | Graphic, confident, light | Evolves the LinkedIn cover, dark | Fresh and unexpected, dark |
| Ground | cool off-white `#EDEFF2` | navy-black `#070B14` | graphite `#121212` |
| Ink | `#0E1116` | `#E8EEF6` | `#EFEDEA` |
| Accent (only one) | cobalt `#0036EA` | ice cyan `#7FD8F0` | vermilion `#FF4520` |
| Hero shader | cobalt into paper, light grain | cover gradient as-is | graphite with vermilion heat |

The rules hold in every palette: one accent, one corner-radius system (pill for interactive, 0 for imagery) and no glows.

## Type

- **Display:** Bricolage Grotesque Variable, heavy weights. Its soft, chunky forms rhyme with the wordmark. Emphasis uses weight within the same family, never a second typeface.
- **Body/UI:** Geist Variable.
- **No mono** except inside Inspect mode, where it shows real code values. Self-hosted via `@fontsource-variable`.

## Page sequence (home)

1. **Loader (ink fill).** The wordmark fills with ink from the nib outward. Progress tracks real readiness (fonts, hero textures, the 3D chunk), with a 900 ms floor and a 2.5 s cap. Exit: the camera dives through the counter of the `o`, and that hole becomes the mask that reveals the hero. Skipped for reduced motion and for repeat visits in the same session.
2. **Hero.** The 3D extruded osa wordmark (built from the real SVG paths) sits in front of the animated grain-gradient shader. It tilts toward the pointer, and the nib catches a highlight. Left-aligned: "Design with intent, build with precision." plus one line of subtext and one CTA ("See work"). The first featured project peeks above the fold.
3. **Featured work (sticky stack).** 3 projects, each a full-viewport artboard: large real image, title, role, a one-line problem, and a link to the case study. As the next card arrives, the previous one shrinks back. The nib draws a selection frame around the active artboard (Figma-style handles, real pixel size).
4. **Work index.** The remaining projects as a large typographic list. On hover, the cursor carries that project's image (hover preview). On touch, thumbnails show inline.
5. **About (phase 2).** Portrait, a short story, experience as a compact timeline, CV link. Skills and certifications move here in condensed form.
6. **Contact sheet (phase 2).** Photography as a draggable film strip. Hovering a frame shows its real EXIF.
7. **Finale.** The 3D wordmark returns as a bookend. Your signature writes itself, followed by the email (scramble-decode on hover) and socials.

## Site-wide systems

- **Nib cursor:** a small nib that rotates toward its direction of travel. It becomes a "View" pill over projects and a caret over text. Desktop with a fine pointer only. The native cursor stays available to assistive tech.
- **Ink trail:** a 2D canvas in the hero only. The nib leaves a fading accent-coloured stroke.
- **Inspect mode (`I` key + nav toggle):** an overlay showing spacing redlines, type specs, colour tokens, component names and the grid, read from `data-inspect` attributes. Project frames get pixel dimensions. This is the showpiece for "designer who codes".
- **Nav:** osa mark left; Work, About, Contact, Inspect toggle right. One line, 64 px.
- **Smooth scroll:** keep Lenis with native document scroll. No virtual-scroll hijack.

## Tech

- Add `three`, `@react-three/fiber`, `@react-three/drei` in a lazy chunk that loads behind the loader. Add `@fontsource-variable/bricolage-grotesque` and `@fontsource-variable/geist`.
- Animation: Motion (`useScroll`, `useTransform`, `layoutId`) for DOM work, R3F for the 3D objects. No GSAP, so libraries don't compete for frames.
- 3D: `SVGLoader`, then `ExtrudeGeometry` with bevel and a physical material. DPR clamped to 1.75, rendering pauses when off-screen, and a static SVG fallback appears if WebGL is missing.
- Tokens: CSS variables on `:root[data-palette]`, mapped into Tailwind v4 `@theme`.
- Reduced motion: no loader, a static wordmark, no cursor or trail, and stacks become plain sections.
- Touch: cursor and trail off. 3D on, at lower DPR.

## Build phases

**Phase 1, the prototype (now):** brand assets and tokens, the Palette Lab, fonts, Loader, 3D Hero, nib cursor, ink trail, Featured work stack, Work index, Inspect mode, Finale, new nav. Projects and case-study routes keep their current data.

**Phase 2:** About and timeline, contact-sheet photography, case-study pages with View Transitions, final palette chosen and the lab removed, refreshed favicon and OG image.

**Phase 3:** accessibility and performance pass (Lighthouse, keyboard, contrast in the chosen palette), plus copy edit.

## Housekeeping

- Work on branch `redesign/nib`. The existing uncommitted edits carry over untouched.
- New components live alongside the old ones. `Home` switches to the new sequence, and old components get deleted only once phase 2 lands.
- Copy rules: no em dashes, no section-number labels, no scroll cues, one label per intent ("See work", "Get in touch").
