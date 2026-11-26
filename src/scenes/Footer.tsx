import { useEffect, useRef, useState } from "react";
import { contact, footer, hero } from "../content";
import { CONTACT } from "../data";
import { REDUCED, galleTime, gsap, scrollTo, useGSAP } from "../lib";
import { Osa, Pill } from "../ui/kit";

// The footer sits underneath the page and is uncovered as the last scene
// scrolls away, like lifting a sheet. Cobalt, with the wordmark rising out
// of the bottom edge, a signature that writes itself and the email that
// scrambles on hover.

const GLYPHS = "abcdefghijklmnopqrstuvwxyz0123456789";
const EMAIL = contact.rows.find((r) => r.icon === "mail")!;
const PHONE = contact.rows.find((r) => r.icon === "phone")!;

function ScrambleEmail() {
  const [text, setText] = useState(EMAIL.value);
  const running = useRef(false);
  const run = () => {
    if (running.current || REDUCED) return;
    running.current = true;
    let frame = 0;
    const total = 22;
    const id = window.setInterval(() => {
      frame += 1;
      const settled = Math.floor((frame / total) * EMAIL.value.length);
      setText(
        EMAIL.value
          .split("")
          .map((c, i) => (i < settled || /[@.]/.test(c) ? c : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
          .join(""),
      );
      if (frame >= total) {
        window.clearInterval(id);
        setText(EMAIL.value);
        running.current = false;
      }
    }, 34);
  };
  return (
    <a
      href={EMAIL.href}
      onPointerEnter={run}
      onFocus={run}
      data-cursor="Email"
      aria-label={`Email ${EMAIL.value}`}
      className="display inline-block break-all text-[clamp(1.3rem,3.4vw,3.2rem)] tracking-[-0.03em] underline decoration-ice decoration-[0.08em] underline-offset-[0.2em]"
    >
      <span aria-hidden="true">{text}</span>
    </a>
  );
}

function Time() {
  const [t, setT] = useState(galleTime);
  useEffect(() => {
    const id = window.setInterval(() => setT(galleTime()), 15000);
    return () => window.clearInterval(id);
  }, []);
  return <span className="tabular-nums">{t}</span>;
}

export function Footer() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // Sit under the page and get uncovered, but only when the whole footer
      // fits on screen; a taller sticky footer would hide its own top.
      const fit = () => {
        const el = root.current!;
        el.style.position = el.offsetHeight <= window.innerHeight ? "sticky" : "relative";
      };
      fit();
      window.addEventListener("resize", fit);
      if (REDUCED) return () => window.removeEventListener("resize", fit);
      const q = gsap.utils.selector(root);
      const st = { trigger: root.current, start: "top bottom", end: "bottom bottom", scrub: 0.6 };
      gsap.fromTo(q("[data-mark]"), { yPercent: 55 }, { yPercent: 0, ease: "none", scrollTrigger: st });
      gsap.fromTo(q("[data-inner]"), { yPercent: -25 }, { yPercent: 0, ease: "none", scrollTrigger: st });
      gsap.fromTo(
        q("[data-sign]"),
        { clipPath: "inset(0% 100% 0% 0%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 1.8, ease: "power2.inOut", scrollTrigger: { trigger: root.current, start: "top 40%" } },
      );
      return () => window.removeEventListener("resize", fit);
    },
    { scope: root },
  );

  return (
    <footer ref={root} id="contact" data-ink="#eef1f6" className="bottom-0 z-0 overflow-hidden bg-[#0b1636] text-paper">
      <div data-inner className="frame pt-24 sm:pt-20">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <h2 className="display text-[clamp(2.8rem,8vw,7.5rem)]">
              Let's work
              <br />
              together<span className="text-ice">.</span>
            </h2>
            <p className="mt-6 max-w-[44ch] text-lg leading-relaxed text-paper/70">{CONTACT.intro}</p>
            <div className="mt-6">
              <ScrambleEmail />
            </div>
          </div>
          <div className="flex flex-wrap gap-3 lg:col-span-4 lg:justify-end lg:pb-2">
            <Pill href={EMAIL.href} icon="nib" cursor="Write">
              Write to me
            </Pill>
            <Pill href={hero.secondaryCta.href} tone="ghost" external cursor="PDF">
              CV
            </Pill>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-8 border-t border-paper/12 pt-8 text-sm sm:grid-cols-4">
          <div>
            <p className="text-paper/50">Phone</p>
            <a href={PHONE.href} className="mt-2 block font-semibold">
              {PHONE.value}
            </a>
          </div>
          <div>
            <p className="text-paper/50">Galle, Sri Lanka</p>
            <p className="mt-2 font-semibold">
              <Time /> local time
            </p>
          </div>
          <div>
            <p className="text-paper/50">Elsewhere</p>
            <ul className="mt-2 space-y-1 font-semibold">
              {footer.social.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noreferrer" className="hover:text-ice">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col items-start gap-3 sm:items-end">
            <div
              data-sign
              role="img"
              aria-label="Osanda Senevirathna signature"
              className="h-11 w-36 bg-paper/85 sm:h-12 sm:w-44"
              style={{
                WebkitMaskImage: "url(/signature.png)",
                maskImage: "url(/signature.png)",
                WebkitMaskSize: "contain",
                maskSize: "contain",
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
                maskPosition: "right center",
              }}
            />
            <button type="button" onClick={() => scrollTo(0)} className="font-semibold text-paper/70 hover:text-paper">
              Back to top
            </button>
          </div>
        </div>
      </div>

      {/* Small print sits above the wordmark, so the mark stays clean. */}
      <div className="frame mt-12 flex items-center justify-between gap-4 border-t border-paper/10 pt-5 text-xs text-paper/50">
        <span>{footer.copyright}</span>
        <span className="group inline-flex items-center gap-1.5">
          Designed with
          <svg viewBox="0 0 24 24" className="size-3.5 fill-ice transition-transform duration-300 group-hover:scale-125" aria-label="love">
            <path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 4.5 6.8 4.5c2.1 0 3.6 1.1 5.2 3 1.6-1.9 3.1-3 5.2-3 3.8 0 5.9 3.9 4.4 7.3C19.5 16.4 12 21 12 21z" />
          </svg>
        </span>
      </div>

      <div className="relative mt-6 h-[clamp(80px,14vw,240px)] overflow-hidden px-3 sm:px-5">
        <div data-mark className="text-signal">
          <Osa className="block w-full" title="osa" />
        </div>
      </div>
    </footer>
  );
}
