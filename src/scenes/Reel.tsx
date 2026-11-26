import { useRef } from "react";
import { FEATURED as REEL, type Work } from "../data";
import { REDUCED, gsap, useGSAP } from "../lib";
import { useGo } from "../router";
import { Pill } from "../ui/kit";

// Selected work. It arrives as a sheet sliding up, then pins.
// Each project is a full-screen flat scene in its cover's own colour, laid
// out as a small collage: the cover, and a zoomed detail card tucked over
// its corner. Scrolling cuts to the next scene with the same rounded wipe.

function Title({ text }: { text: string }) {
  return (
    <h3 className="display text-[clamp(2.2rem,11.5cqw,6rem)]">
      {text.split(" ").map((w, wi) => (
        <span key={wi} className="line-mask mr-[0.2em] inline-block last:mr-0">
          <span className="inline-block whitespace-nowrap">
            {w.split("").map((c, i) => (
              <span key={i} data-ch className="inline-block">
                {c}
              </span>
            ))}
          </span>
        </span>
      ))}
    </h3>
  );
}

function Scene({ w, i }: { w: Work; i: number }) {
  const dark = w.ink !== "#070b14";
  const go = useGo();
  const open = () => go(`/work/${w.slug}`);
  return (
    <article
      data-scene
      data-ink={w.ink}
      className={`${REDUCED ? "relative" : "absolute inset-0"} h-[100svh] overflow-hidden`}
      style={{ background: w.bg, color: w.ink, zIndex: i }}
    >
      <div
        data-content
        className="frame relative flex h-full flex-col justify-center gap-8 pb-16 pt-24 md:grid md:grid-cols-12 md:items-center md:gap-10 md:pb-20"
      >
        {/* Collage */}
        <div className="relative md:order-2 md:col-span-7">
          <button
            type="button"
            data-frame
            onClick={open}
            data-cursor="View"
            aria-label={`View ${w.name}`}
            className="group/f relative block aspect-[16/9] w-full overflow-hidden rounded-[20px] shadow-[0_50px_90px_-40px_rgba(0,0,0,0.55)] md:rounded-[30px]"
          >
            <img
              data-img
              src={w.img}
              alt=""
              draggable={false}
              className="size-full scale-[1.12] object-cover transition-[scale] duration-[900ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover/f:scale-[1.18]"
            />
          </button>
          <div
            data-detail
            aria-hidden="true"
            className="absolute -bottom-[10%] right-[4%] aspect-[4/5] w-[28%] overflow-hidden rounded-[16px] shadow-[0_30px_60px_-25px_rgba(0,0,0,0.6)] md:-left-[6%] md:-top-[12%] md:bottom-auto md:right-auto md:w-[24%] md:rounded-[24px]"
            style={{ outline: `6px solid ${w.bg}` }}
          >
            <img src={w.img} alt="" draggable={false} className="size-full scale-[2.3] object-cover" style={{ objectPosition: w.focus[0] }} />
          </div>
        </div>

        {/* Words. A size container, so titles scale to fit this column and
            never run under the collage. */}
        <div className="@container relative flex flex-col md:order-1 md:col-span-5 md:h-full md:justify-between md:py-4">
          <p className="hidden items-baseline gap-3 md:flex">
            <span className="display text-[clamp(1.4rem,2.4vw,2.2rem)] tabular-nums">{String(i + 1).padStart(2, "0")}</span>
            <span className="text-sm opacity-60">of {String(REEL.length).padStart(2, "0")}</span>
          </p>
          <div>
            <p className="mb-3 text-sm font-medium opacity-70">
              <span className="md:hidden">{String(i + 1).padStart(2, "0")} · </span>
              {w.kind}
              {w.role ? ` · ${w.role}` : ""}
            </p>
            <Title text={w.name} />
            {w.line && <p className="mt-4 max-w-[36ch] text-[15px] leading-relaxed opacity-80 md:mt-5 md:text-lg">{w.line}</p>}
            {w.note && <p className="mt-3 text-sm font-semibold opacity-90">{w.note}</p>}
            <div className="mt-6 md:mt-8">
              <Pill onClick={open} tone={dark ? "paper" : "night"} cursor="View">
                View case study
              </Pill>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export function Reel() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (REDUCED) return;
      const q = gsap.utils.selector(root);
      const stage = q("[data-stage]")[0] as HTMLElement;
      const scenes = q("[data-scene]") as HTMLElement[];
      const bars = q("[data-bar]") as HTMLElement[];
      const n = scenes.length;

      // Arrive as a sheet over the hero: rounded top flattens as it lands.
      gsap.fromTo(
        stage,
        { borderTopLeftRadius: 48, borderTopRightRadius: 48 },
        { borderTopLeftRadius: 0, borderTopRightRadius: 0, ease: "none", scrollTrigger: { trigger: root.current, start: "top 60%", end: "top top", scrub: true } },
      );

      scenes.forEach((s, i) => {
        if (i > 0) gsap.set(s, { clipPath: "inset(100% 0% 0% 0% round 48px 48px 0px 0px)" });
        if (i > 0) gsap.set(s.querySelectorAll("[data-ch]"), { yPercent: 115 });
      });

      // Scene one's title rises and its detail card settles as the sheet lands.
      gsap.fromTo(
        scenes[0].querySelectorAll("[data-ch]"),
        { yPercent: 115 },
        { yPercent: 0, duration: 0.9, stagger: 0.03, ease: "power3.out", scrollTrigger: { trigger: root.current, start: "top 45%", toggleActions: "play none none reverse" } },
      );
      gsap.fromTo(
        scenes[0].querySelector("[data-detail]"),
        { yPercent: 40, rotate: -14 },
        { yPercent: 0, rotate: -5, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "top top", scrub: true } },
      );

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: () => `+=${n * 100}%`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
          onUpdate: (st) => {
            const p = st.progress * n;
            bars.forEach((b, i) => gsap.set(b, { scaleX: Math.min(1, Math.max(0, p - i)) }));
          },
        },
      });

      tl.fromTo(scenes[0].querySelector("[data-img]"), { yPercent: -5 }, { yPercent: 5, duration: 1 }, 0);
      for (let i = 1; i < n; i++) {
        const at = i - 0.45;
        const prev = scenes[i - 1];
        const s = scenes[i];
        tl.to(s, { clipPath: "inset(0% 0% 0% 0% round 0px 0px 0px 0px)", duration: 0.6, ease: "power2.inOut" }, at)
          .to(prev.querySelector("[data-content]"), { yPercent: -8, scale: 0.94, opacity: 0.25, duration: 0.6, ease: "power2.inOut" }, at)
          .fromTo(s.querySelector("[data-frame]"), { yPercent: 40, rotate: 4 }, { yPercent: 0, rotate: 0, duration: 0.6, ease: "power3.out" }, at + 0.05)
          .fromTo(s.querySelector("[data-detail]"), { yPercent: 90, rotate: -16 }, { yPercent: 0, rotate: -5, duration: 0.6, ease: "power3.out" }, at + 0.15)
          .to(s.querySelectorAll("[data-ch]"), { yPercent: 0, duration: 0.3, stagger: 0.02, ease: "power3.out" }, at + 0.3)
          .fromTo(s.querySelector("[data-img]"), { yPercent: -5 }, { yPercent: 5, duration: 1 }, at);
      }
      tl.to({}, { duration: 0.35 });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="work" aria-label="Selected work" className="relative z-20 bg-paper">
      <div data-stage className={REDUCED ? "" : "relative h-[100svh] overflow-hidden"} style={{ background: REEL[0].bg }}>
        {REEL.map((w, i) => (
          <Scene key={w.slug} w={w} i={i} />
        ))}
        {!REDUCED && (
          <div className="frame pointer-events-none absolute inset-x-0 bottom-6 z-50 flex gap-1.5 md:bottom-8" aria-hidden="true">
            {REEL.map((w) => (
              <span key={w.name} className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/25 mix-blend-difference">
                <span data-bar className="block h-full origin-left scale-x-0 bg-white" />
              </span>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
