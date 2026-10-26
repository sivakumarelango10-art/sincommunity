/**
 * The single animation system for the site. Every timeline, scroll scene and path drawing
 * goes through GSAP; CSS only handles small hover/focus transitions.
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText, DrawSVGPlugin);
  // pause the global timeline while the tab is hidden (decorative motion never runs offscreen)
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) gsap.globalTimeline.pause();
    else gsap.globalTimeline.resume();
  });
}

/** Motion tokens — keep in sync with --ease-* and --dur-* in styles/tokens.css */
export const EASE = {
  out: "expo.out",        // entrances
  inOut: "power3.inOut",  // shared movement between states
  soft: "power2.out",     // small interactions
  draw: "power2.inOut",   // line drawing
} as const;

export const DUR = {
  fast: 0.2,
  base: 0.4,
  section: 0.85,
  stagger: 0.08,
} as const;

/** true on devices with a precise pointer that can hover (no pointer effects on touch) */
export const finePointer = () =>
  typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

export { gsap, ScrollTrigger, SplitText, DrawSVGPlugin, useGSAP };
