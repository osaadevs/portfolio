import { Fragment, useRef } from "react";
import { INTRO } from "../data";
import { REDUCED, gsap, useGSAP } from "../lib";
import { useGo } from "../router";
import { Nib, Pill } from "../ui/kit";

// Introduction. A paper sheet that slides up over the hero before any work
// is shown: who I am in one sentence (filling in as you read), three
// numbers, the people I've worked with, and the way to the full story.

export function Intro() {
  const root = useRef<HTMLElement>(null);
  const go = useGo();

  useGSAP(
    () => {
      if (REDUCED) return;
      const q = gsap.utils.selector(root);
      gsap.fromTo(
        q("[data-w]"),
        { opacity: 0.15 },
        { opacity: 1, stagger: 0.05, ease: "none", scrollTrigger: { trigger: q("[data-statement]")[0], start: "top 80%", end: "bottom 55%", scrub: 0.5 } },
      );
      gsap.from(q("[data-stat]"), {
        yPercent: 40,
        opacity: 0,
        duration: 0.9,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: { trigger: q("[data-stats]")[0], start: "top 85%" },
      });
    },
    { scope: root },
  );

  const [first, ...rest] = INTRO.statement.split("Osanda,");

  return (
    <section ref={root} id="intro" data-ink="#070b14" className="relative z-10 rounded-t-[40px] bg-paper text-night md:rounded-t-[64px]">
      <div className="frame pb-16 pt-16 md:pb-20 md:pt-24">
        <p data-statement className="display max-w-[26ch] text-[clamp(1.6rem,3.6vw,3.8rem)] font-bold leading-[1.12] tracking-[-0.03em]">
          {first.split(" ").map((w, i) =>
            w ? (
              <span key={`a${i}`} data-w>
                {w}{" "}
              </span>
            ) : null,
          )}
          <span data-w>Osanda,</span>
          <span className="mx-[0.14em] inline-block h-[0.8em] w-[0.8em] translate-y-[0.1em] overflow-hidden rounded-full align-baseline">
            <img src="/portrait.jpg" alt="" className="size-full object-cover" />
          </span>
          {rest
            .join("")
            .split(" ")
            .map((w, i) =>
              w ? (
                <Fragment key={`b${i}`}>
                  <span data-w>{w}</span>{" "}
                </Fragment>
              ) : null,
            )}
        </p>

        <div className="mt-10">
          <Pill onClick={() => go("/about")} tone="night" cursor="About">
            More about me
          </Pill>
        </div>

        <dl data-stats className="mt-16 grid grid-cols-3 gap-4 md:mt-24 md:gap-10">
          {INTRO.stats.map((s) => (
            <div key={s.label} data-stat className="border-t border-night/15 pt-6 md:pt-8">
              <dt className="display text-[clamp(2.6rem,6vw,5.6rem)] leading-none text-signal">{s.value}</dt>
              <dd className="mt-3 max-w-[18ch] text-sm leading-snug text-night/65 md:text-[15px]">{s.label}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Clients: a slow strip that pauses on hover. Names for now; each
          item can become a logo without touching the layout. */}
      <div className="border-t border-night/10 pb-16 pt-10 md:pb-24">
        <p className="frame text-sm text-night/55">Worked with</p>
        <div
          className="group mt-6 overflow-hidden"
          style={{ maskImage: "linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)", WebkitMaskImage: "linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)" }}
        >
          <ul className="flex w-max animate-[marquee_38s_linear_infinite] group-hover:[animation-play-state:paused] motion-reduce:animate-none">
            {[...INTRO.clients, ...INTRO.clients].map((c, i) => (
              <li key={i} aria-hidden={i >= INTRO.clients.length} className="flex items-center gap-10 pr-10 md:gap-16 md:pr-16">
                <span className="display whitespace-nowrap text-[clamp(1.3rem,2.4vw,2.2rem)] font-bold tracking-[-0.02em] text-night/70">{c}</span>
                <Nib className="size-4 text-night/20" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
