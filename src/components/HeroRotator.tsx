import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { portrait, portraitSrcSet, focusClass, type TeamMember } from "../data/team";
import { gsap } from "../motion/gsap";

/**
 * A hero portrait that holds several people, one at a time.
 * Each new photo rises into the pill behind a soft, curved edge (the pill's own shape) while it
 * settles from a slight zoom, and the previous photo eases back. The edge is a feathered mask
 * whose position is one CSS variable (--r), so the sweep is even and never hard-cut.
 *
 * The rotator only knows how to change photo; when to change is decided by the hero
 * (one shared rhythm for every rotator, so two frames never change at the same moment).
 */
const WIPE = 1.5;      // seconds for the reveal
const SETTLE = 2.2;    // seconds for the zoom to settle (the change is complete after this)

export interface RotatorHandle {
  /** shows the next person; resolves false (and changes nothing) if their photo isn't ready yet */
  advance: () => Promise<boolean>;
  /** finishes any change in progress and leaves the current photo plain (motion switched off) */
  settle: () => void;
}

interface Props {
  people: TeamMember[];
  /** add everyone's photo (the first one is always there); the hero turns this on after page load */
  full: boolean;
  sizes: string;
  priority?: boolean;
}

export const HeroRotator = forwardRef<RotatorHandle, Props>(function HeroRotator({ people, full, sizes, priority }, ref) {
  const frame = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);
  const index = useRef(0);
  const tl = useRef<gsap.core.Timeline | null>(null);

  useImperativeHandle(ref, () => ({
    advance: async () => {
      const el = frame.current;
      if (!el || tl.current?.isActive()) return false;
      const imgs = Array.from(el.querySelectorAll<HTMLImageElement>(".hero__rot-img"));
      if (imgs.length < 2) return false;
      const from = index.current;
      const to = (from + 1) % imgs.length;
      const next = imgs[to], prev = imgs[from];
      // never start a reveal before the next photo is decoded (no flash, no half-drawn image)
      try { await next.decode(); } catch { /* not ready yet */ }
      if (!next.complete || !next.naturalWidth || !frame.current) return false;

      return new Promise<boolean>((resolve) => {
        next.classList.add("is-entering");
        gsap.set(next, { zIndex: 3, autoAlpha: 1, "--r": "10%", scale: 1.12, yPercent: 0 });
        gsap.set(prev, { zIndex: 2 });
        const t = gsap.timeline({
          onComplete: () => {
            gsap.set(prev, { autoAlpha: 0, zIndex: 1, scale: 1, yPercent: 0 });
            next.classList.remove("is-entering");
            gsap.set(next, { zIndex: 2, clearProps: "--r" });
            index.current = to;
            setCurrent(to);
            resolve(true);
          },
          onInterrupt: () => resolve(false),
        });
        t.to(next, { "--r": "118%", duration: WIPE, ease: "sine.inOut" }, 0)
          .to(next, { scale: 1, duration: SETTLE, ease: "expo.out" }, 0)
          .to(prev, { scale: 1.06, yPercent: -2.5, duration: WIPE, ease: "sine.inOut" }, 0);
        tl.current = t;
      });
    },
    settle: () => {
      tl.current?.progress(1);
      const el = frame.current;
      if (!el) return;
      el.querySelectorAll<HTMLImageElement>(".hero__rot-img").forEach((img, i) => {
        img.classList.remove("is-entering");
        gsap.set(img, i === index.current
          ? { autoAlpha: 1, zIndex: 2, clearProps: "--r,scale,yPercent" }
          : { autoAlpha: 0, zIndex: 1 });
      });
    },
  }), []);

  useEffect(() => () => { tl.current?.kill(); }, []);

  const shown = full ? people : people.slice(0, 1);
  return (
    <div className="hero__frame hero__rot" ref={frame}>
      {shown.map((m, i) => (
        <img key={m.id} className={`hero__rot-img ${focusClass(m)}`} src={portrait(m.id, 480)} srcSet={portraitSrcSet(m.id)}
          sizes={sizes} width={480} height={600} decoding="async"
          fetchPriority={i === 0 && priority ? "high" : "auto"}
          alt={`${m.name}, ${m.role} of SINC`} aria-hidden={i === current ? undefined : true} />
      ))}
    </div>
  );
});
