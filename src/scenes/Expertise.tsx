import { useRef } from "react";
import { EXPERTISE } from "../data";
import { REDUCED, gsap, useGSAP } from "../lib";
import { useGo } from "../router";
import { Pill } from "../ui/kit";

// Expertise. Three service cards that stick and stack as you scroll, each
// one settling on top of the last while the one beneath sinks back. Same
// behaviour on desktop and phones; only the inside of the card reflows.

export function Expertise() {
  const root = useRef<HTMLElement>(null);
  const go = useGo();

  useGSAP(
    () => {
      if (REDUCED) return;
      const cards = gsap.utils.toArray<HTMLElement>("[data-card]", root.current);
      cards.forEach((card, i) => {
        const next = cards[i + 1];
        if (!next) return;
        gsap.to(card.firstElementChild, {
          scale: 0.92,
          opacity: 0.5,
          ease: "none",
          scrollTrigger: { trigger: next, start: "top bottom", end: `top ${72 + (i + 1) * 28}px`, scrub: true },
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="expertise" data-ink="#eef1f6" className="relative rounded-b-[40px] bg-night pb-24 pt-20 text-paper md:rounded-b-[64px] md:pt-28">
      <div className="frame">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <h2 className="display text-[clamp(2.6rem,7vw,7rem)]">Expertise</h2>
          <p className="max-w-[38ch] text-paper/65 md:pb-3 md:text-right">
            I work across product, brand and photography, so the app, the identity and the imagery can come from one hand.
          </p>
        </div>

        <div className="mt-14 md:mt-20">
          {EXPERTISE.map((e, i) => (
            <article
              key={e.title}
              data-card
              className="sticky mb-[14svh] last:mb-0"
              style={{ top: `calc(72px + ${i * 28}px)` }}
            >
              <div
                data-ink={e.ink}
                className="grid min-h-[min(76svh,660px)] origin-top gap-7 overflow-hidden rounded-[28px] p-6 md:grid-cols-12 md:gap-14 md:rounded-[44px] md:p-12 lg:p-14"
                style={{ background: e.bg, color: e.ink }}
              >
                <div className="order-2 flex flex-col md:order-1 md:col-span-7">
                  <p className="display text-[clamp(1.2rem,2vw,1.8rem)] opacity-50">{String(i + 1).padStart(2, "0")}</p>
                  <h3 className="display mt-3 text-[clamp(2.2rem,5.2vw,5.4rem)]">{e.title}</h3>
                  <p className="mt-4 max-w-[44ch] text-[15px] leading-relaxed opacity-80 md:mt-6 md:text-lg">{e.body}</p>
                  <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-2 text-sm font-medium md:mt-auto md:pt-10 md:text-[15px]">
                    {e.items.map((it) => (
                      <li key={it} className="border-t border-current/20 pt-2">
                        {it}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 text-sm opacity-60">{e.tools}</p>
                </div>
                <div className="relative order-1 h-40 overflow-hidden rounded-[18px] md:order-2 md:col-span-5 md:h-auto md:rounded-[28px]">
                  <img src={e.img} alt="" className="absolute inset-0 size-full object-cover" draggable={false} />
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-20 flex flex-col items-start gap-5 border-t border-paper/15 pt-10 md:flex-row md:items-center md:justify-between">
          <p className="display text-[clamp(1.5rem,3vw,2.6rem)]">Have a project in mind?</p>
          <Pill onClick={() => go("#contact")} cursor="Contact">
            Start a conversation
          </Pill>
        </div>
      </div>
    </section>
  );
}
