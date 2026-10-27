import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { STORAGE_KEYS } from "../config/site";
import { safeStorage } from "./storage";
import { ScrollTrigger } from "./gsap";

/**
 * Motion preference.
 *  - user choice "on"/"off" (footer toggle, stored) wins;
 *  - otherwise the operating system's reduced-motion setting decides.
 * `enabled` controls GSAP timelines, scroll scenes, parallax and magnetic effects;
 * the same value is mirrored to <html data-motion> so CSS transitions follow it too.
 */
type UserChoice = "on" | "off" | null;

interface MotionState {
  enabled: boolean;
  /** what the footer toggle shows */
  toggle: () => void;
  systemReduced: boolean;
}

const MotionContext = createContext<MotionState>({ enabled: true, toggle: () => {}, systemReduced: false });

const readChoice = (): UserChoice => {
  const v = safeStorage.get(STORAGE_KEYS.motion);
  return v === "on" || v === "off" ? v : null;
};

export function MotionProvider({ children }: { children: ReactNode }) {
  // initial value mirrors the attribute set by the inline script in index.html (no flash)
  const [choice, setChoice] = useState<UserChoice>(null);
  const [systemReduced, setSystemReduced] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setChoice(readChoice());
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setSystemReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setSystemReduced(e.matches);
    mq.addEventListener("change", onChange);
    setHydrated(true);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const enabled = choice === "on" ? true : choice === "off" ? false : !systemReduced;

  // set during render so the attribute (and the CSS that follows it) is already current when
  // components' layout effects measure and build their scroll scenes
  if (hydrated && typeof document !== "undefined") document.documentElement.setAttribute("data-motion", enabled ? "on" : "off");

  useEffect(() => {
    if (!hydrated) return;
    // layouts can change when scroll scenes are created or removed
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, [enabled, hydrated]);

  const toggle = useCallback(() => {
    const next: UserChoice = enabled ? "off" : "on";
    setChoice(next);
    safeStorage.set(STORAGE_KEYS.motion, next);
  }, [enabled]);

  // before hydration, report the server default so markup matches; effects only run after
  const value = useMemo(() => ({ enabled: hydrated ? enabled : true, toggle, systemReduced }), [enabled, hydrated, toggle, systemReduced]);
  return <MotionContext.Provider value={value}>{children}</MotionContext.Provider>;
}

export const useMotion = () => useContext(MotionContext);

/**
 * Motion that is safe to run right now: hydrated, enabled, and (on the very first client render)
 * consistent with the attribute the inline script set before paint.
 */
export function useMotionEnabled(): boolean {
  const { enabled } = useMotion();
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  if (!ready) {
    if (typeof document === "undefined") return false;
    return document.documentElement.getAttribute("data-motion") === "on";
  }
  return enabled;
}

/* ------------------------------------------------------------------------------------------
 * Scroll scenes below the first screen are built once the browser is idle after the page loads,
 * so that work doesn't compete with the first paint and the hero entrance. Content that is
 * already on screen is never hidden by a late setup (see useSectionReveal).
 */
let idleReady = false;
let scenesReady = false;
const idleWaiters = new Set<() => void>();
const readyWaiters = new Set<() => void>();
function whenIdle(cb: () => void) {
  if (idleReady) return cb();
  idleWaiters.add(cb);
  if (idleWaiters.size > 1) return;
  const done = () => {
    idleReady = true;
    const list = [...idleWaiters];
    idleWaiters.clear();
    list.forEach((f) => f());
    // every deferred scene now exists: measure them all together, top to bottom
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
      const after = [...readyWaiters]; readyWaiters.clear(); scenesReady = true;
      after.forEach((f) => f());
    });
  };
  const schedule = () => {
    if (typeof window.requestIdleCallback === "function") window.requestIdleCallback(done, { timeout: 900 });
    else setTimeout(done, 300);
  };
  if (document.readyState === "complete") requestAnimationFrame(schedule);
  else window.addEventListener("load", () => requestAnimationFrame(schedule), { once: true });
}

/** Like useMotionEnabled, but only true once below-the-fold scroll scenes may be built. */
export function useDeferredMotion(): boolean {
  const motion = useMotionEnabled();
  const [ready, setReady] = useState(idleReady);
  useEffect(() => {
    if (ready) return;
    let alive = true;
    whenIdle(() => { if (alive) setReady(true); });
    return () => { alive = false; };
  }, [ready]);
  return motion && ready;
}

/** Runs cb once the deferred scroll scenes exist and have been measured (e.g. to jump to /#team). */
export function onScenesReady(cb: () => void): () => void {
  if (scenesReady) { cb(); return () => {}; }
  readyWaiters.add(cb);
  whenIdle(() => {});
  return () => { readyWaiters.delete(cb); };
}
