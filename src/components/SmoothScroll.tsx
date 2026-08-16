import { createContext, useCallback, useContext, useEffect, useRef, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Lenis from "lenis";

type Ctx = { scrollToId: (id: string) => void };
const SmoothCtx = createContext<Ctx>({ scrollToId: () => {} });
export const useSmoothScroll = () => useContext(SmoothCtx);

const NAV_OFFSET = -96; // clear the sticky nav pill

/**
 * Lenis-powered smooth scrolling + hash/route coordination.
 *
 * - Intercepts every in-page `#hash` link (nav, hero CTAs, footer) so it eases
 *   with Lenis; if the click happens off the home route it navigates home
 *   first and scrolls once mounted.
 * - Disabled entirely under prefers-reduced-motion (native jump instead).
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const pendingHash = useRef<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
    lenisRef.current = lenis;
    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const doScroll = useCallback((hash: string) => {
    const el = document.querySelector(hash);
    if (!el) return;
    if (lenisRef.current) {
      lenisRef.current.scrollTo(el as HTMLElement, { offset: NAV_OFFSET });
    } else {
      (el as HTMLElement).scrollIntoView();
    }
  }, []);

  // Global interceptor for hash links so Lenis (not the browser) drives them.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
      const anchor = (e.target as HTMLElement)?.closest?.("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href || !href.startsWith("#") || href === "#") return;
      e.preventDefault();
      if (location.pathname !== "/") {
        pendingHash.current = href;
        navigate("/");
      } else {
        doScroll(href);
        history.replaceState(null, "", href);
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [location.pathname, doScroll, navigate]);

  // On route change: honour a pending hash (came from another page) or reset.
  useEffect(() => {
    if (location.pathname === "/" && pendingHash.current) {
      const h = pendingHash.current;
      pendingHash.current = null;
      requestAnimationFrame(() => window.setTimeout(() => doScroll(h), 60));
    } else if (location.pathname !== "/") {
      lenisRef.current?.scrollTo(0, { immediate: true });
      window.scrollTo(0, 0);
    }
  }, [location.pathname, doScroll]);

  const scrollToId = useCallback(
    (id: string) => {
      const hash = id.startsWith("#") ? id : `#${id}`;
      if (location.pathname !== "/") {
        pendingHash.current = hash;
        navigate("/");
      } else {
        doScroll(hash);
        history.replaceState(null, "", hash);
      }
    },
    [location.pathname, navigate, doScroll],
  );

  return <SmoothCtx.Provider value={{ scrollToId }}>{children}</SmoothCtx.Provider>;
}
