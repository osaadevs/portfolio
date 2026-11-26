import { createContext, useCallback, useContext, useRef, type AnchorHTMLAttributes, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { REDUCED, ScrollTrigger, gsap, lenis, scrollTo } from "./lib";
import { Osa } from "./ui/kit";

// Page changes. The first time you open a page in a visit, a cobalt sheet
// with a rounded edge wipes up over the old one, the route swaps underneath,
// and the sheet carries on up and off the top. After that the same trip is
// a quick cross-fade: the big move is an introduction, not a toll.

/** Pages count as "seen" by section, so every case study shares one key. */
const keyOf = (path: string) => (path.startsWith("/work/") ? "/work/:slug" : path);

type Go = (to: string) => void;
const Ctx = createContext<Go>(() => {});
export const useGo = () => useContext(Ctx);

export function TransitionProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const curtain = useRef<HTMLDivElement>(null);
  // Time the current transition started; 0 when idle. A stale value (say a
  // hot reload mid-wipe) expires so navigation can never lock up.
  const busy = useRef(0);
  const seen = useRef(new Set([keyOf(pathname)]));

  const go = useCallback<Go>(
    (to) => {
      const [path, hash] = to.split("#");
      const target = path || pathname;
      if (target === pathname) {
        scrollTo(hash ? `#${hash}` : 0);
        return;
      }
      const land = () => {
        lenis?.scrollTo(0, { immediate: true, force: true });
        window.scrollTo(0, 0);
      };
      if (REDUCED || !curtain.current) {
        navigate(target);
        land();
        if (hash) requestAnimationFrame(() => scrollTo(`#${hash}`));
        return;
      }
      if (busy.current && performance.now() - busy.current < 2500) return;
      busy.current = performance.now();
      const first = !seen.current.has(keyOf(target));
      seen.current.add(keyOf(target));

      if (!first) {
        // Fade the page and the footer under it together, so the footer
        // never flashes through mid-fade.
        const main = document.querySelectorAll("main, #contact");
        gsap
          .timeline({ onComplete: () => void (busy.current = 0) })
          .to(main, { opacity: 0, duration: 0.22, ease: "power2.in" })
          .add(() => {
            navigate(target);
            land();
          })
          .to({}, { duration: 0.05 })
          .add(() => ScrollTrigger.refresh())
          .to(main, { opacity: 1, duration: 0.4, ease: "power2.out" })
          .add(() => {
            if (hash) scrollTo(`#${hash}`);
          });
        return;
      }

      const el = curtain.current;
      gsap
        .timeline({ onComplete: () => void (busy.current = 0) })
        .set(el, { display: "grid", clipPath: "inset(100% 0% 0% 0% round 56px)" })
        .to(el, { clipPath: "inset(0% 0% 0% 0% round 0px)", duration: 0.65, ease: "power3.inOut" })
        .fromTo(el.firstElementChild, { yPercent: 60, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.4, ease: "power3.out" }, 0.3)
        .add(() => {
          navigate(target);
          land();
        })
        .to({}, { duration: 0.3 })
        .add(() => ScrollTrigger.refresh())
        .to(el.firstElementChild, { yPercent: -60, opacity: 0, duration: 0.35, ease: "power3.in" })
        .to(el, { clipPath: "inset(0% 0% 100% 0% round 56px)", duration: 0.7, ease: "power3.inOut" }, "<0.1")
        .set(el, { display: "none" })
        .add(() => {
          if (hash) scrollTo(`#${hash}`);
        });
    },
    [navigate, pathname],
  );

  return (
    <Ctx.Provider value={go}>
      {children}
      <div ref={curtain} aria-hidden="true" className="fixed inset-0 z-[160] hidden place-items-center bg-signal text-paper">
        <div>
          <Osa className="h-14 w-auto sm:h-20" />
        </div>
      </div>
    </Ctx.Provider>
  );
}

/** A link that plays the page transition. Real href, so it still works
 *  with a middle click, cmd-click or no JavaScript. */
export function TLink({ to, children, ...rest }: { to: string; children: ReactNode } & AnchorHTMLAttributes<HTMLAnchorElement>) {
  const go = useGo();
  return (
    <a
      href={to}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        go(to);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}
