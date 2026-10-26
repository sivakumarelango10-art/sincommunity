import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { SITE } from "../config/site";
import { TEAM, portrait, portraitSrcSet } from "../data/team";
import { gsap, useGSAP, SplitText, EASE, finePointer } from "../motion/gsap";
import { useMotionEnabled } from "../motion/MotionContext";
import { IconPlay, JoinButton, Logo } from "./ui";
import "./Hero.css";

/** People shown in the hero composition (the full team is introduced in the team section). */
const useIsoLayout = typeof window === "undefined" ? useEffect : useLayoutEffect;

const HERO_PEOPLE = ["karmjith", "elango-s", "dhanusri-t"].map((id) => TEAM.find((m) => m.id === id)!);

interface HeroProps {
  /** "wait" while the opening story plays, "go" to run the entrance */
  entrance: "wait" | "go";
  /** true when the entrance follows the opening story (logo handed off from the intro) */
  fromIntro: boolean;
  onWatchStory: (trigger: HTMLElement) => void;
}

export function Hero({ entrance, fromIntro, onWatchStory }: HeroProps) {
  const motion = useMotionEnabled();
  const root = useRef<HTMLElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const [guide, setGuide] = useState<{ d: string; w: number; h: number } | null>(null);
  const guideDrawn = useRef(false);

  /* the guide line: from the spark beside the eyebrow, under the headline, to the Join button */
  const measure = useCallback(() => {
    const el = root.current;
    if (!el) return;
    const copy = el.querySelector<HTMLElement>(".hero__grid");
    const spark = el.querySelector<HTMLElement>(".hero__spark");
    const cta = el.querySelector<HTMLElement>(".hero__actions .btn");
    if (!copy || !spark || !cta) return;
    const c = copy.getBoundingClientRect();
    const s = spark.getBoundingClientRect(), bt = cta.getBoundingClientRect();
    // a margin rule: down the lane beside the text, then into the Join button
    const x0 = s.left + s.width / 2 - c.left, y0 = s.top + s.height / 2 - c.top;
    const x1 = bt.left - c.left - 12, y1 = bt.top + bt.height / 2 - c.top;
    const r = Math.max(4, Math.min(18, (x1 - x0) * 0.7));
    const d = `M ${x0} ${y0 + 12} V ${y1 - r} Q ${x0} ${y1} ${x0 + r} ${y1} H ${x1}`;
    setGuide({ d, w: c.width, h: c.height });
  }, []);

  useEffect(() => {
    measure();
    const ro = new ResizeObserver(() => measure());
    if (root.current) ro.observe(root.current);
    document.fonts?.ready.then(measure).catch(() => {});
    return () => ro.disconnect();
  }, [measure]);

  /* the guide is measured after layout; keep it hidden until the entrance draws it */
  useIsoLayout(() => {
    const path = root.current?.querySelector<SVGPathElement>(".hero__guide path");
    if (!path) return;
    if (motion && !guideDrawn.current) gsap.set(path, { drawSVG: "0%" });
    else if (motion) gsap.set(path, { drawSVG: "100%" });
    else gsap.set(path, { clearProps: "all" });
  }, [guide, motion]);

  /* entrance choreography (prepared while the intro plays, run on "go") */
  useGSAP((_ctx, contextSafe) => {
    if (!motion || !root.current) return;
    const q = gsap.utils.selector(root);
    const split = SplitText.create(q(".hero__title")[0], { type: "lines,words", mask: "lines", linesClass: "hero__line" });

    const t = gsap.timeline({ paused: true, defaults: { ease: EASE.out } });
    t.from(q(".hero__eyebrow"), { y: 16, autoAlpha: 0, duration: 0.7 })
      .from(q(".hero__spark"), { scale: 0, duration: 0.5, ease: "back.out(3)" }, "<")
      .from(split.words, { yPercent: 115, duration: 1.1, stagger: 0.07 }, "-=0.35")
      .from(q(".hero__lede"), { y: 20, autoAlpha: 0, duration: 0.8 }, "-=0.75")
      .from(q(".hero__actions > *"), { y: 18, autoAlpha: 0, duration: 0.7, stagger: 0.08 }, "-=0.6")
      .add(contextSafe!(() => {
        guideDrawn.current = true;
        const path = root.current?.querySelector(".hero__guide path");
        if (path) gsap.fromTo(path, { drawSVG: "0%" }, { drawSVG: "100%", duration: 1.6, ease: EASE.draw });
      }), "-=1.1")
      .from(q(".hero__cta-dot"), { scale: 0, autoAlpha: 0, duration: 0.4, ease: "back.out(3)" }, "+=1.3")
      // portraits: mask wipes upward, images settle
      .from(q(".hero__frame"), { clipPath: "inset(100% 0% 0% 0% round 999px)", duration: 1.2, ease: EASE.inOut, stagger: 0.12 }, 0.35)
      .from(q(".hero__frame img"), { scale: 1.25, duration: 1.6, stagger: 0.12 }, 0.35)
      .fromTo(q(".hero__link"), { drawSVG: "0%" }, { drawSVG: "100%", duration: 1.1, ease: EASE.draw, stagger: 0.1 }, 1.0)
      .from(q(".hero__badge"), fromIntro ? { autoAlpha: 0, duration: 0.3 } : { scale: 0.6, autoAlpha: 0, duration: 0.9, ease: "back.out(1.6)" }, 1.4)
      .from(q(".hero__caption"), { y: 10, autoAlpha: 0, duration: 0.6 }, 1.8)
      .from(q(".hero__scroll"), { autoAlpha: 0, duration: 0.6 }, 2.0);
    tl.current = t;
    if (entrance === "go") t.play();

    // subtle depth on pointer movement (desktop, fine pointer only)
    if (finePointer()) {
      const layers = q("[data-depth]") as HTMLElement[];
      const movers = layers.map((el) => ({
        x: gsap.quickTo(el, "x", { duration: 0.9, ease: "power3.out" }),
        y: gsap.quickTo(el, "y", { duration: 0.9, ease: "power3.out" }),
        k: Number(el.dataset.depth),
      }));
      const vis = q(".hero__visual")[0] as HTMLElement;
      const onMove = (e: PointerEvent) => {
        const r = vis.getBoundingClientRect();
        const nx = (e.clientX - (r.left + r.width / 2)) / r.width;
        const ny = (e.clientY - (r.top + r.height / 2)) / r.height;
        movers.forEach((m) => { m.x(nx * m.k * 26); m.y(ny * m.k * 20); });
      };
      const onLeave = () => movers.forEach((m) => { m.x(0); m.y(0); });
      root.current.addEventListener("pointermove", onMove);
      root.current.addEventListener("pointerleave", onLeave);
      const el = root.current;
      return () => { el.removeEventListener("pointermove", onMove); el.removeEventListener("pointerleave", onLeave); };
    }
  }, { scope: root, dependencies: [motion], revertOnUpdate: true });

  useEffect(() => {
    if (entrance === "go") tl.current?.play();
  }, [entrance]);

  /* scroll: the guide continues down into the story section */
  useGSAP(() => {
    if (!motion || !root.current) return;
    gsap.fromTo(".hero__scroll-line", { drawSVG: "0%" }, {
      drawSVG: "100%", ease: "none",
      scrollTrigger: { trigger: root.current, start: "bottom 95%", end: "bottom 35%", scrub: 0.5 },
    });
    gsap.to(".hero__visual", {
      yPercent: -6, ease: "none",
      scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: 0.6 },
    });
  }, { scope: root, dependencies: [motion], revertOnUpdate: true });

  return (
    <section className="hero" id="top" ref={root} aria-labelledby="hero-title">
      <div className="hero__grid container">
        {guide && (
          <svg className="hero__guide" width={guide.w} height={guide.h} viewBox={`0 0 ${guide.w} ${guide.h}`} aria-hidden="true">
            <path d={guide.d} />
          </svg>
        )}
        <p className="hero__eyebrow"><span className="hero__spark" aria-hidden="true" />{SITE.fullName}</p>
        <h1 className="hero__title" id="hero-title">
          Where ambition <span className="hero__title-accent">finds its people.</span>
        </h1>

        <div className="hero__lower">
          <div className="hero__copy">
            <p className="hero__lede lead">
              Connect with people who share your drive. Find collaborators, learn together, and turn ideas into something real.
            </p>
            <div className="hero__actions">
              <JoinButton />
              <button type="button" className="btn btn-ghost hero__watch" onClick={(e) => onWatchStory(e.currentTarget)}>
                <span className="hero__play" aria-hidden="true"><IconPlay /></span>
                Watch our story
              </button>
              <span className="hero__cta-dot" aria-hidden="true" />
            </div>
          </div>

          <div className="hero__visual" aria-label="Members of the SINC team, connected to the SINC logo">
            <svg className="hero__links" viewBox="0 0 100 106" aria-hidden="true">
              <path className="hero__link" d="M17 72 C 18 86, 32 92, 50 92" />
              <path className="hero__link" d="M51 64 C 51 76, 51 80, 50 84" />
              <path className="hero__link" d="M84 76 C 83 88, 68 93, 50 92" />
              <circle className="hero__ring" cx="50" cy="92" r="11.5" />
            </svg>
            {HERO_PEOPLE.map((m, i) => (
              <figure key={m.id} className={`hero__person hero__person--${i + 1}`} data-depth={[0.6, 1, 0.75][i]}>
                <div className="hero__frame">
                  <img src={portrait(m.id, 480)} srcSet={portraitSrcSet(m.id)} sizes="(min-width: 960px) 160px, 30vw"
                    width={480} height={600} alt={`${m.name}, ${m.role}`} style={{ objectPosition: m.focus }}
                    fetchPriority={i === 1 ? "high" : "auto"} decoding="async" />
                </div>
              </figure>
            ))}
            <div className="hero__badge" data-depth="0.35">
              <Logo size={112} eager alt="SINC logo: three people joined around a shared centre" />
            </div>
            <a className="hero__caption" href="#team">Meet the people building SINC</a>
          </div>
        </div>
      </div>

      <div className="hero__scroll" aria-hidden="true">
        <svg viewBox="0 0 20 120" preserveAspectRatio="none"><path className="hero__scroll-line" d="M10 0 V 120" /></svg>
      </div>
    </section>
  );
}
