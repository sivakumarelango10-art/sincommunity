import { useEffect, useRef, type RefObject } from "react";
import { gsap, useGSAP, ScrollTrigger, EASE, DUR, finePointer } from "./gsap";
import { useMotionEnabled } from "./MotionContext";

/**
 * Section entrance: every [data-reveal] inside `scope` rises in once as it enters the viewport.
 * [data-reveal="mask"] uses a clip-path wipe instead (portraits, images).
 * [data-draw] SVG strokes draw themselves on scroll.
 * Content is fully visible in CSS; the hidden starting state only exists while motion is on.
 */
export function useSectionReveal(scope: RefObject<HTMLElement | null>, deps: unknown[] = []) {
  const motion = useMotionEnabled();
  useGSAP(
    () => {
      if (!motion || !scope.current) return;
      const root = scope.current;

      const rise = gsap.utils.toArray<HTMLElement>("[data-reveal]:not([data-reveal='mask'])", root);
      if (rise.length) {
        gsap.set(rise, { y: 28, autoAlpha: 0 });
        ScrollTrigger.batch(rise, {
          start: "top 88%",
          // not `once`: a self-killing trigger during a refresh corrupts ScrollTrigger's list
          onEnter: (batch) =>
            gsap.to(batch, { y: 0, autoAlpha: 1, duration: DUR.section, ease: EASE.out, stagger: DUR.stagger, overwrite: true }),
        });
      }

      gsap.utils.toArray<HTMLElement>("[data-reveal='mask']", root).forEach((el, i) => {
        const img = el.querySelector("img");
        const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 90%", toggleActions: "play none none none" } });
        tl.fromTo(el, { clipPath: "inset(100% 0% 0% 0% round 24px)" },
          { clipPath: "inset(0% 0% 0% 0% round 24px)", duration: 1.1, ease: EASE.inOut, delay: (i % 4) * 0.08, clearProps: "clipPath" });
        if (img) tl.fromTo(img, { scale: 1.18 }, { scale: 1, duration: 1.4, ease: EASE.out, clearProps: "scale" }, "<");
      });

      gsap.utils.toArray<SVGGeometryElement>("[data-draw]", root).forEach((path) => {
        gsap.fromTo(path, { drawSVG: "0%" }, {
          drawSVG: "100%", ease: "none",
          scrollTrigger: { trigger: (path.closest("[data-draw-trigger]") as Element) || path, start: "top 85%", end: "bottom 45%", scrub: 0.6 },
        });
      });
    },
    { scope, dependencies: [motion, ...deps], revertOnUpdate: true },
  );
}

/** Subtle magnetic pull for primary desktop CTAs. Disabled for touch and when motion is off. */
export function useMagnetic<T extends HTMLElement>(strength = 0.28) {
  const ref = useRef<T>(null);
  const motion = useMotionEnabled();
  useEffect(() => {
    const el = ref.current;
    if (!el || !motion || !finePointer()) return;
    const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" });
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * strength);
      yTo((e.clientY - (r.top + r.height / 2)) * strength);
    };
    const leave = () => { xTo(0); yTo(0); };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
      gsap.set(el, { x: 0, y: 0 });
    };
  }, [motion, strength]);
  return ref;
}

/**
 * Locks page scrolling (menu, opening story, portrait viewer). Nested locks are counted,
 * so closing one overlay never unlocks the page while another is still open.
 */
let locks = 0;
let saved = { overflow: "", paddingRight: "" };
export function lockScroll(): () => void {
  const html = document.documentElement;
  if (locks === 0) {
    saved = { overflow: html.style.overflow, paddingRight: html.style.paddingRight };
    const gap = window.innerWidth - html.clientWidth;
    html.style.overflow = "hidden";
    if (gap > 0) html.style.paddingRight = `${gap}px`;
  }
  locks++;
  let released = false;
  return () => {
    if (released) return;
    released = true;
    locks = Math.max(0, locks - 1);
    if (locks === 0) {
      html.style.overflow = saved.overflow;
      html.style.paddingRight = saved.paddingRight;
    }
  };
}
