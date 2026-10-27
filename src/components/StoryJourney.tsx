import { useEffect, useRef } from "react";
import { STORY_CHAPTERS } from "../data/content";
import { gsap, useGSAP, ScrollTrigger, EASE } from "../motion/gsap";
import { useDeferredMotion } from "../motion/MotionContext";
import { useSectionReveal } from "../motion/hooks";
import { StoryScene } from "./StoryScene";
import "./StoryJourney.css";

/** Splits a chapter title around its emphasised phrase. */
function Title({ title, emphasis }: { title: string; emphasis: string }) {
  const i = title.indexOf(emphasis);
  if (i < 0) return <>{title}</>;
  return <>{title.slice(0, i)}<mark>{emphasis}</mark>{title.slice(i + emphasis.length)}</>;
}

export function StoryJourney() {
  const motion = useDeferredMotion(); // built after the first paint
  const root = useRef<HTMLElement>(null);
  useSectionReveal(root, []);

  /* a short pinned sequence driven by native scrolling, on every screen tall enough to hold it.
     The layout (stacked on upright screens, side by side on wide or short-landscape ones) is CSS;
     matchMedia re-runs this whenever the screen crosses between those layouts. */
  useGSAP(() => {
    if (!motion || !root.current) return;
    const el = root.current;
    gsap.matchMedia().add({
      side: "(min-width: 1024px) and (min-height: 640px), (max-height: 639.98px) and (min-aspect-ratio: 5/4)",
      tall: "(min-height: 300px)",
    }, (mmCtx) => {
      if (!mmCtx.conditions?.tall) return;
      // a frame sized to the whole page (some embeds) cannot scroll, so a pinned scene could never advance
      if (document.documentElement.scrollHeight - window.innerHeight < window.innerHeight) return;
      const stage = el.querySelector<HTMLElement>(".story__stage")!;
      const inner = el.querySelector<HTMLElement>(".story__inner")!;
      const scene = el.querySelector<SVGSVGElement>(".story__visual .story-scene")!;
      const fill = el.querySelector<HTMLElement>(".story__progress-fill")!;
      const chapters = gsap.utils.toArray<HTMLElement>(".chapter", el);
      const steps = gsap.utils.toArray<HTMLElement>(".story__step", el);

      // use the pinned layout only when every chapter fits on this screen; otherwise keep the stacked story
      const fits = () => {
        const sceneH = scene.getBoundingClientRect().height;
        return inner.scrollHeight <= inner.clientHeight + 1 && inner.getBoundingClientRect().height <= stage.clientHeight + 1 && sceneH >= 96;
      };
      el.classList.add("is-pinned");
      if (!fits()) el.classList.add("is-tight");
      if (!fits()) { el.classList.remove("is-pinned", "is-tight"); return; }

      let current = -1;
      // chapter changes create short tweens outside any context; the cleanup below restores everything
      const show = (index: number) => {
        if (index === current) return;
        const dir = index > current ? 1 : -1;
        const prev = chapters[current];
        current = index;
        scene.setAttribute("data-stage", String(index));
        el.setAttribute("data-chapter", String(index));
        chapters.forEach((c, i) => c.classList.toggle("is-active", i === index));
        steps.forEach((s, i) => { s.classList.toggle("is-done", i < index); s.classList.toggle("is-current", i === index); });
        if (prev) gsap.to(prev, { opacity: 0, y: -28 * dir, duration: 0.45, ease: "power2.in", overwrite: true });
        gsap.fromTo(chapters[index], { opacity: 0, y: 36 * dir }, { opacity: 1, y: 0, duration: 0.8, ease: EASE.out, delay: prev ? 0.18 : 0, overwrite: true });
      };

      gsap.set(chapters, { opacity: 0 }); // opacity only: inactive chapters stay readable by assistive tech
      show(0);
      ScrollTrigger.create({
        trigger: stage,
        start: "top top+=72",
        end: () => `+=${window.innerHeight * 0.75 * (STORY_CHAPTERS.length - 1)}`,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          fill.style.setProperty("--p", String(self.progress));
          show(Math.min(STORY_CHAPTERS.length - 1, Math.floor(self.progress * STORY_CHAPTERS.length * 0.999)));
        },
      });
      return () => {
        gsap.killTweensOf(chapters);
        gsap.set(chapters, { clearProps: "opacity,transform" });
        fill.style.removeProperty("--p");
        el.classList.remove("is-pinned", "is-tight");
        el.removeAttribute("data-chapter");
        chapters.forEach((c) => c.classList.remove("is-active"));
        steps.forEach((s) => s.classList.remove("is-done", "is-current"));
        scene.setAttribute("data-stage", "0");
      };
    });
    // no manual mm.revert(): the matchMedia belongs to this context and is reverted with it
  }, { scope: root, dependencies: [motion], revertOnUpdate: true });

  /* stacked layout (motion off, or a screen too small to pin): chapter emphasis arrives as each chapter is read */
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      if (el.classList.contains("is-pinned")) return;
      entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("is-active"); });
    }, { rootMargin: "0px 0px -35% 0px" });
    el.querySelectorAll(".chapter").forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, []);

  return (
    <section className="story" id="story" ref={root} aria-labelledby="story-title">
      <div className="story__stage">
        <div className="story__inner container">
          <div className="story__text">
            <header className="story__header">
              <p className="eyebrow" data-reveal>Our story</p>
              <h2 id="story-title" className="story__title" data-reveal>Why SINC exists</h2>
            </header>
            <ol className="story__chapters">
              {STORY_CHAPTERS.map((c, i) => (
                <li key={c.id} className="chapter" data-index={i}>
                  <div className="chapter__scene"><StoryScene stage={i} revealOnView /></div>
                  <div className="chapter__copy">
                    <p className="chapter__kicker"><span>0{i + 1}</span>{c.kicker}</p>
                    <h3 className="chapter__title"><Title title={c.title} emphasis={c.emphasis} /></h3>
                    <p className="chapter__body">{c.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="story__visual" aria-hidden="true">
            <StoryScene stage={0} />
            <div className="story__progress">
              <div className="story__progress-track"><div className="story__progress-fill" /></div>
              <ol className="story__steps">
                {STORY_CHAPTERS.map((c, i) => <li key={c.id} className="story__step"><span>0{i + 1}</span></li>)}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
