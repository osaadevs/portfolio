import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { contact, footer, hero } from "../content";
import { NIB_BOX, OSA_PATHS, OSA_VIEWBOX_STR } from "../brand/osa";
import { useSmoothScroll } from "../components/SmoothScroll";
import { setInspect, useInspect } from "./store";

// Footer: a balanced two-column contact block, a meta row (signature, the
// Inspect toggle, back to top), and a quiet tone-on-tone wordmark that fills
// from the nib, cropped by the bottom edge of the page.

const GLYPHS = "abcdefghijklmnopqrstuvwxyz0123456789";
const EMAIL = contact.rows.find((r) => r.icon === "mail")!;
const PHONE = contact.rows.find((r) => r.icon === "phone")!;
const PLACE = contact.rows.find((r) => r.icon === "pin")!;

function ScrambleEmail() {
  const [text, setText] = useState(EMAIL.value);
  const running = useRef(false);
  const run = () => {
    if (running.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    running.current = true;
    const target = EMAIL.value;
    let frame = 0;
    const total = 22;
    const id = window.setInterval(() => {
      frame += 1;
      const settled = Math.floor((frame / total) * target.length);
      setText(
        target
          .split("")
          .map((c, i) => (i < settled || /[@.]/.test(c) ? c : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
          .join(""),
      );
      if (frame >= total) {
        window.clearInterval(id);
        setText(target);
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
      className="inline-block break-all font-display normal-case text-[clamp(1.4rem,3.6vw,3.4rem)] leading-[1.1] text-accent decoration-2 underline-offset-[0.18em] hover:underline"
    >
      <span aria-hidden="true">{text}</span>
    </a>
  );
}

function InkWordmark() {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const cx = NIB_BOX.x + NIB_BOX.w / 2;
  const cy = NIB_BOX.y + NIB_BOX.h / 2;
  return (
    <svg ref={ref} viewBox={OSA_VIEWBOX_STR} className="block w-full" role="img" aria-label="osa">
      <defs>
        <linearGradient id="finale-tone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1a2a48" />
          <stop offset="0.7" stopColor="#0b1222" />
        </linearGradient>
        <clipPath id="finale-ink">
          <motion.circle
            cx={cx}
            cy={cy}
            initial={{ r: 0 }}
            animate={inView ? { r: 1700 } : undefined}
            transition={{ duration: 2, ease: [0.65, 0, 0.35, 1] }}
          />
        </clipPath>
      </defs>
      <g fill="none" stroke="var(--p-line)" strokeWidth="2.5">
        <path d={OSA_PATHS.o} />
        <path d={OSA_PATHS.s} />
        <path d={OSA_PATHS.a} />
      </g>
      <g fill="url(#finale-tone)" clipPath="url(#finale-ink)">
        <path d={OSA_PATHS.o} />
        <path d={OSA_PATHS.s} />
        <path d={OSA_PATHS.a} />
      </g>
    </svg>
  );
}

// The reveal is triggered from the wrapper: a fully clipped element never
// reports as intersecting, so it can't trigger its own whileInView.
function Signature() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  return (
    <div ref={ref} className="h-12 w-44 md:h-14 md:w-52">
      <motion.div
        className="h-full w-full bg-ink/90"
        style={{
          WebkitMaskImage: "url(/signature.png)",
          maskImage: "url(/signature.png)",
          WebkitMaskSize: "contain",
          maskSize: "contain",
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          maskPosition: "left center",
        }}
        initial={{ clipPath: "inset(0% 100% 0% 0%)" }}
        animate={inView ? { clipPath: "inset(0% 0% 0% 0%)" } : undefined}
        transition={{ duration: 1.6, ease: [0.45, 0, 0.2, 1] }}
        role="img"
        aria-label="Osanda Senevirathna signature"
      />
    </div>
  );
}

function LinkList({ title, items }: { title: string; items: { label: string; href?: string }[] }) {
  return (
    <div>
      <p className="text-xs text-faint">{title}</p>
      <ul className="mt-3 space-y-2 text-[15px]">
        {items.map((it) => (
          <li key={it.label}>
            {it.href ? (
              <a
                href={it.href}
                target={it.href.startsWith("http") || it.href.endsWith(".pdf") ? "_blank" : undefined}
                rel="noreferrer"
                className="text-ink/90 underline decoration-transparent underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
              >
                {it.label}
              </a>
            ) : (
              <span className="text-muted">{it.label}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Finale() {
  const { scrollToId } = useSmoothScroll();
  const inspect = useInspect();
  const toTop = () => (document.getElementById("top") ? scrollToId("top") : window.scrollTo(0, 0));

  return (
    <footer id="contact" data-inspect="Finale" className="relative overflow-hidden border-t border-line pt-24 md:pt-32">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        <div className="grid gap-14 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <h2 className="font-display text-[clamp(2.8rem,8vw,7.5rem)] leading-[0.92]">Let's talk.</h2>
            <p className="mt-6 max-w-[42ch] text-lg leading-relaxed text-muted">{contact.intro}</p>
            <div className="mt-8">
              <ScrambleEmail />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8 md:col-span-5 md:pb-3 md:pl-8">
            <LinkList
              title="Contact"
              items={[
                { label: PHONE.value, href: PHONE.href },
                { label: PLACE.value },
                { label: "Download CV", href: hero.secondaryCta.href },
              ]}
            />
            <LinkList title="Elsewhere" items={footer.social} />
          </div>
        </div>

        <div className="mt-20 grid grid-cols-2 items-center gap-6 border-t border-line pt-6 md:grid-cols-3">
          <Signature />
          <button
            type="button"
            onClick={() => setInspect(!inspect)}
            aria-pressed={inspect}
            className="order-last col-span-2 justify-self-start text-sm text-muted transition-colors hover:text-ink md:order-none md:col-span-1 md:justify-self-center"
          >
            Built by hand in React.{" "}
            <span className="text-ink underline decoration-accent underline-offset-4">
              {inspect ? "Close inspector" : "Inspect it"}
            </span>
            <kbd className="ml-2 rounded border border-line px-1.5 py-0.5 font-code text-[11px] text-faint">I</kbd>
          </button>
          <button type="button" onClick={toTop} className="justify-self-end text-sm text-muted transition-colors hover:text-ink">
            Back to top
          </button>
        </div>
      </div>

      <div className="relative mt-16 h-[clamp(110px,25vw,370px)] overflow-hidden px-3 sm:px-5">
        <InkWordmark />
        <div className="absolute inset-x-0 bottom-0 mx-auto flex max-w-[1400px] justify-between px-5 pb-5 text-xs text-faint sm:px-8">
          <span>{footer.copyright}</span>
          <span>Designed and built by Osanda</span>
        </div>
      </div>
    </footer>
  );
}
