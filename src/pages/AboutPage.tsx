import { useRef } from "react";
import { hero } from "../content";
import { ABOUT, EDUCATION, EXPERIENCE, LEARNING, RECOGNITION } from "../data";
import { Draggable, REDUCED, gsap, useGSAP } from "../lib";
import { Pill } from "../ui/kit";

// About. Portrait and a one-line summary up top, the story in three short
// paragraphs, then the record: experience, recognition (as stickers you can
// move around), education and what I'm learning, and the tools I use.

const STICKERS = [
  { cls: "bg-signal text-paper -rotate-6", pos: "left-[4%] top-[7%]" },
  { cls: "bg-night text-paper rotate-3", pos: "right-[5%] top-[10%]" },
  { cls: "bg-ice text-night rotate-2", pos: "left-[22%] top-[48%]" },
  { cls: "bg-paper text-night -rotate-3", pos: "right-[8%] bottom-[8%]" },
];

function Heading({ children }: { children: string }) {
  return <h2 className="display text-[clamp(2rem,4.4vw,4.2rem)]">{children}</h2>;
}

export default function AboutPage() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const board = q("[data-board]")[0];
      Draggable.create(q("[data-sticker]"), { bounds: board, inertia: true, zIndexBoost: true, edgeResistance: 0.7 });
      if (REDUCED) return;
      gsap.from(q("[data-rise]"), { yPercent: 110, duration: 1.1, ease: "expo.out", stagger: 0.08, delay: 0.25 });
      gsap.from(q("[data-fade]"), { opacity: 0, y: 24, duration: 1, ease: "power3.out", stagger: 0.08, delay: 0.45 });
      gsap.fromTo(q("[data-portrait]"), { clipPath: "inset(12% 12% 12% 12% round 40px)" }, { clipPath: "inset(0% 0% 0% 0% round 32px)", duration: 1.4, ease: "expo.out", delay: 0.3 });
      q("[data-row]").forEach((el: Element) =>
        gsap.from(el, { y: 40, opacity: 0, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 90%" } }),
      );
      // Experience timeline: the line fills with the scroll, each role lights
      // up as it reaches the middle of the screen.
      const list = q("[data-timeline]")[0];
      gsap.fromTo(q("[data-line]"), { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: list, start: "top 55%", end: "bottom 55%", scrub: true } });
      q("[data-entry]").forEach((el: Element) =>
        gsap.fromTo(
          el,
          { opacity: 0.35 },
          {
            opacity: 1,
            duration: 0.4,
            scrollTrigger: {
              trigger: el,
              start: "top 55%",
              toggleActions: "play none none reverse",
              onToggle: (st) => el.classList.toggle("is-on", st.isActive || st.progress > 0),
            },
          },
        ),
      );
      gsap.from(q("[data-sticker]"), { scale: 0, rotate: -30, duration: 0.9, stagger: 0.12, ease: "back.out(2)", scrollTrigger: { trigger: board, start: "top 75%" } });
    },
    { scope: root },
  );

  return (
    <div ref={root} data-ink="#070b14" className="relative rounded-b-[40px] bg-paper text-night md:rounded-b-[64px]">
      <div className="mx-auto max-w-[1500px] px-5 pb-24 pt-28 md:px-8 md:pt-36">
        {/* Intro */}
        <div className="grid gap-10 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <h1 className="display text-[clamp(3.4rem,13vw,12rem)]">
              <span className="line-mask">
                <span data-rise className="block">
                  About
                </span>
              </span>
            </h1>
            <p data-fade className="display mt-8 max-w-[24ch] text-[clamp(1.4rem,2.6vw,2.4rem)] font-bold leading-[1.15] tracking-[-0.03em]">
              {ABOUT.lead}
            </p>
          </div>
          <div className="md:col-span-4 md:col-start-9">
            <div data-portrait className="aspect-[4/5] overflow-hidden rounded-[32px] bg-paper-2">
              <img src="/portrait.jpg" alt="Osanda Senevirathna" className="size-full object-cover" />
            </div>
          </div>
        </div>

        {/* Story */}
        <div className="mt-20 grid gap-y-8 border-t border-night/15 pt-10 md:mt-28 md:grid-cols-12 md:gap-x-10">
          <div className="md:col-span-4">
            <Heading>Story</Heading>
          </div>
          <div className="max-w-[68ch] space-y-5 text-lg leading-relaxed text-night/80 md:col-span-7 md:col-start-6">
            {ABOUT.bio.map((p) => (
              <p key={p.slice(0, 24)} data-row>
                {p}
              </p>
            ))}
            <dl className="!mt-10 grid grid-cols-2 gap-x-6 gap-y-6 text-base">
              {ABOUT.facts.map((f) => (
                <div key={f.label} data-row className="border-t border-night/15 pt-3">
                  <dt className="text-sm text-night/55">{f.label}</dt>
                  <dd className="mt-1 font-semibold leading-snug text-night">{f.value}</dd>
                </div>
              ))}
            </dl>
            <div className="!mt-10" data-row>
              <Pill href={hero.secondaryCta.href} tone="night" external cursor="PDF">
                Download CV
              </Pill>
            </div>
          </div>
        </div>

        {/* Experience: a timeline that fills as you scroll */}
        <div className="mt-20 grid gap-y-8 border-t border-night/15 pt-10 md:mt-28 md:grid-cols-12 md:gap-x-10">
          <div className="md:col-span-4">
            <div className="md:sticky md:top-28">
              <Heading>Experience</Heading>
              <p className="mt-4 max-w-[30ch] text-[15px] text-night/60">Studio, agency, freelance and university media work, most recent first.</p>
            </div>
          </div>
          <ol data-timeline className="relative md:col-span-7 md:col-start-6">
            <span aria-hidden="true" className="absolute bottom-3 left-[7px] top-3 w-[2px] bg-night/10 md:-left-[21px]">
              <span data-line className="block size-full origin-top bg-signal" />
            </span>
            {EXPERIENCE.map((r) => (
              <li key={r.role + r.org} data-entry className="group/e relative pb-14 pl-10 last:pb-0 md:pl-0">
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-1 size-4 rounded-full md:-left-[28px] border-2 border-night/25 bg-paper transition-[background-color,border-color,transform] duration-500 group-[.is-on]/e:scale-110 group-[.is-on]/e:border-signal group-[.is-on]/e:bg-signal"
                />
                <p className="text-sm font-semibold tabular-nums text-signal">{r.period}</p>
                <p className="display mt-2 text-[clamp(1.4rem,2.6vw,2.3rem)] leading-tight">{r.role}</p>
                <p className="mt-1 text-[15px] font-semibold text-night/70">{r.org}</p>
                <p className="mt-4 max-w-[60ch] text-[15px] leading-relaxed text-night/70">{r.note}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* Recognition */}
        <div className="mt-20 border-t border-night/15 pt-10 md:mt-28">
          <Heading>Recognition</Heading>
          <div className="mt-10 grid gap-y-8 md:grid-cols-12 md:gap-x-10">
            <ul className="text-[15px] md:col-span-4">
              {RECOGNITION.map((a) => (
                <li key={a.name} className="flex items-baseline justify-between gap-4 border-b border-night/10 py-4 first:pt-0">
                  <span>
                    <span className="block font-semibold">{a.name}</span>
                    <span className="text-night/60">
                      {a.place} · {a.detail}
                    </span>
                  </span>
                  <span className="tabular-nums text-night/55">{a.year}</span>
                </li>
              ))}
            </ul>
            <div data-board className="relative h-[440px] overflow-hidden rounded-[28px] bg-paper-2 md:col-span-7 md:col-start-6 md:h-[460px]">
              <p className="absolute bottom-4 left-5 text-xs text-night/45">Drag to rearrange</p>
              {RECOGNITION.map((a, i) => {
                const st = STICKERS[i % STICKERS.length];
                return (
                  <div
                    key={a.name}
                    data-sticker
                    data-cursor="Drag"
                    className={`absolute ${st.pos} w-[min(240px,62%)] touch-none select-none rounded-[22px] p-5 shadow-[0_18px_30px_-18px_rgba(7,11,20,0.6)] ${st.cls}`}
                  >
                    <p className="display text-lg leading-tight">{a.place}</p>
                    <p className="mt-2 text-sm font-semibold">{a.name}</p>
                    <p className="mt-1 text-xs opacity-75">
                      {a.detail}, {a.year}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Education, learning, tools */}
        <div className="mt-20 grid gap-y-8 border-t border-night/15 pt-10 md:mt-28 md:grid-cols-12 md:gap-x-10">
          <div className="md:col-span-4">
            <Heading>Education</Heading>
          </div>
          <div className="grid gap-10 sm:grid-cols-2 md:col-span-7 md:col-start-6">
            <div>
              <p className="text-sm text-night/55">Degree and school</p>
              <ul className="mt-4 space-y-4">
                {EDUCATION.map((e) => (
                  <li key={e.title} data-row>
                    <p className="font-semibold">{e.title}</p>
                    <p className="text-[15px] text-night/65">
                      {e.org}, {e.period}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-sm text-night/55">Currently learning</p>
              <ul className="mt-4 space-y-4">
                {LEARNING.map((l) => (
                  <li key={l.title} data-row>
                    <p className="font-semibold">{l.title}</p>
                    <p className="text-[15px] text-night/65">{l.org}, in progress</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="sm:col-span-2">
              <p className="text-sm text-night/55">Tools</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {ABOUT.tools.map((t) => (
                  <li key={t} className="rounded-full bg-paper-2 px-4 py-2 text-sm font-semibold">
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
