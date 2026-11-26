import { useSyncExternalStore } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { useGSAP } from "@gsap/react";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger, SplitText, MotionPathPlugin, Draggable, InertiaPlugin, useGSAP);

export { gsap, ScrollTrigger, SplitText, Draggable, useGSAP };

export const REDUCED =
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
export const FINE = typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches;

/* ---------- smooth scroll, driven by GSAP's ticker so scrubs stay in sync */
export let lenis: Lenis | null = null;
export function startScroll() {
  if (REDUCED || lenis) return;
  lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 0.9 });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((t) => lenis?.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}
export function scrollTo(target: string | number) {
  if (lenis) lenis.scrollTo(target, { duration: 1.6 });
  else if (typeof target === "number") window.scrollTo(0, target);
  else document.querySelector(target)?.scrollIntoView();
}
export function lockScroll(on: boolean) {
  if (lenis) (on ? lenis.stop() : lenis.start());
  document.documentElement.style.overflow = on ? "hidden" : "";
}

/* ---------- tiny store: has the preloader finished? */
let loaded = false;
const subs = new Set<() => void>();
export function setLoaded() {
  if (loaded) return;
  loaded = true;
  subs.forEach((f) => f());
}
export const useLoaded = () =>
  useSyncExternalStore(
    (f) => {
      subs.add(f);
      return () => subs.delete(f);
    },
    () => loaded,
  );

/* ---------- Galle local time, for the little live clock */
export const galleTime = () =>
  new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Colombo" }).format(new Date());
