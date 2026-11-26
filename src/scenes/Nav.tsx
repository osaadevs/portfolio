import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { contact, footer } from "../content";
import { useLocation } from "react-router-dom";
import { lockScroll } from "../lib";
import { useGo } from "../router";
import { Osa } from "../ui/kit";

// Fixed header. Its colour follows whichever scene is under it, the current
// page is underlined, and on phones the menu is a full-screen cobalt sheet.

const LINKS = [
  { label: "Home", to: "/" },
  { label: "Work", to: "/work" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "#contact" },
];

/** Header ink follows whatever scene is under it (sections carry data-ink). */
function useSceneInk() {
  const ref = useRef<HTMLElement>(null);
  const { pathname } = useLocation();
  useEffect(() => {
    let raf = 0;
    const read = () => {
      raf = 0;
      const header = ref.current;
      if (!header) return;
      const hit = document
        .elementsFromPoint(window.innerWidth / 2, 34)
        .find((el) => !header.contains(el) && el.closest("[data-ink]"));
      const ink = hit?.closest<HTMLElement>("[data-ink]")?.dataset.ink;
      if (ink) header.style.color = ink;
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(read);
    };
    read();
    // Pages load lazily and land behind the transition; look again once
    // the new page is actually under the header.
    const late = [150, 600, 1400].map((ms) => window.setTimeout(read, ms));
    window.addEventListener("scroll", kick, { passive: true });
    window.addEventListener("resize", kick);
    return () => {
      late.forEach((t) => window.clearTimeout(t));
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", kick);
      window.removeEventListener("resize", kick);
    };
  }, [pathname]);
  return ref;
}

/** Hide while reading downwards, come back on any scroll up. */
function useAutoHide() {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (y < 120) setHidden(false);
      else if (y > last + 6) setHidden(true);
      else if (y < last - 6) setHidden(false);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return hidden;
}

export function Nav() {
  const [open, setOpen] = useState(false);
  const header = useSceneInk();
  const hidden = useAutoHide() && !open;
  useEffect(() => {
    lockScroll(open);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const nav = useGo();
  const { pathname } = useLocation();
  const active = (to: string) => (to === "/" ? pathname === "/" : pathname.startsWith(to));
  const go = (to: string) => {
    setOpen(false);
    requestAnimationFrame(() => nav(to));
  };

  return (
    <>
      <header
        ref={header}
        className={`pointer-events-none frame fixed inset-x-0 top-0 z-[120] flex items-center justify-between py-5 text-paper transition-[color,translate] duration-500 ease-[cubic-bezier(.16,1,.3,1)] ${hidden ? "-translate-y-full" : ""}`}
      >
        <button type="button" onClick={() => go("/")} className="pointer-events-auto" aria-label="osa, home" data-cursor="Home">
          <Osa className="h-7 w-auto sm:h-8" />
        </button>
        <nav className="pointer-events-auto hidden items-center gap-7 text-sm font-medium md:flex">
          {LINKS.slice(1, 3).map((l) => (
            <button
              key={l.to}
              type="button"
              onClick={() => go(l.to)}
              aria-current={active(l.to) ? "page" : undefined}
              className={`relative after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:bg-current after:transition-transform after:duration-500 ${active(l.to) ? "after:scale-x-100" : "after:origin-right after:scale-x-0 hover:after:origin-left hover:after:scale-x-100"}`}
            >
              {l.label}
            </button>
          ))}
          <button type="button" onClick={() => go("#contact")} className="rounded-full border border-current px-4 py-2 transition-colors hover:bg-current/10">
            Contact
          </button>
        </nav>
        <button type="button" onClick={() => setOpen(true)} className="pointer-events-auto rounded-full border border-current px-4 py-2 text-sm font-medium md:hidden">
          Menu
        </button>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[130] flex flex-col bg-signal px-5 pb-8 pt-5 text-paper md:px-8"
            initial={{ clipPath: "inset(0 0 100% 0 round 0 0 40px 40px)" }}
            animate={{ clipPath: "inset(0 0 0% 0 round 0 0 0px 0px)" }}
            exit={{ clipPath: "inset(0 0 100% 0 round 0 0 40px 40px)" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className="flex items-center justify-between">
              <Osa className="h-7 w-auto" />
              <button type="button" onClick={() => setOpen(false)} className="rounded-full border border-current px-4 py-2 text-sm font-medium">
                Close
              </button>
            </div>
            <ul className="mt-auto space-y-1">
              {LINKS.map((l, i) => (
                <li key={l.to} className="line-mask">
                  <motion.button
                    type="button"
                    onClick={() => go(l.to)}
                    className="display block text-[clamp(2.6rem,12vw,6rem)]"
                    initial={{ y: "110%" }}
                    animate={{ y: "0%" }}
                    transition={{ duration: 0.8, delay: 0.25 + i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {l.label}
                  </motion.button>
                </li>
              ))}
            </ul>
            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm">
              <a href={contact.primaryCta.href}>{contact.rows[0].value}</a>
              {footer.social.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="text-paper/70">
                  {s.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
