import { useSyncExternalStore } from "react";

// Tiny global store kept outside React so keyboard shortcuts and the hero's
// WebGL loop can read it: Inspect mode, readiness for the loader, and the
// "loaded" flag the hero waits on.

let inspect = false;
const inspectListeners = new Set<() => void>();

export function setInspect(on: boolean) {
  inspect = on;
  document.documentElement.classList.toggle("inspecting", on);
  inspectListeners.forEach((l) => l());
}

export function useInspect() {
  return useSyncExternalStore(
    (l) => {
      inspectListeners.add(l);
      return () => {
        inspectListeners.delete(l);
      };
    },
    () => inspect,
  );
}

// ---- Readiness: the loader waits on these (fonts, the fluid chunk, images).
const readyTasks: Promise<unknown>[] = [];
export function registerReady(p: Promise<unknown>) {
  readyTasks.push(p.catch(() => undefined));
}
export function getReadyTasks() {
  return readyTasks;
}

// ---- Loaded: flips once the loader has finished its exit.
let loaded = false;
const loadedListeners = new Set<() => void>();
export function setLoaded() {
  if (loaded) return;
  loaded = true;
  loadedListeners.forEach((l) => l());
}
export function useLoaded() {
  return useSyncExternalStore(
    (l) => {
      loadedListeners.add(l);
      return () => {
        loadedListeners.delete(l);
      };
    },
    () => loaded,
  );
}
