import { useRef, useState } from "react";
import { MISSION, VALUES, VISION } from "../data/content";
import { gsap, useGSAP, SplitText, EASE } from "../motion/gsap";
import { useDeferredMotion } from "../motion/MotionContext";
import { useSectionReveal } from "../motion/hooks";
import { IconArrowRight, IconPlus } from "./ui";
import "./MissionValues.css";

export function MissionValues() {
  const motion = useDeferredMotion(); // built after the first paint
  const root = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<string>(VALUES[0].id);
  useSectionReveal(root, []);

  /* the mission lights up word by word as it is read */
  useGSAP(() => {
    if (!motion || !root.current) return;
    const q = gsap.utils.selector(root);
    q(".mv__statement").forEach((el: Element) => {
      // aria "none": the paragraph keeps its own text for screen readers (aria-label is not allowed on <p>);
      // words start at 0.55 opacity so even unlit text keeps a 3:1 contrast
      const split = SplitText.create(el, { type: "words", wordsClass: "mv__word", tag: "span", aria: "none" });
      gsap.fromTo(split.words, { opacity: 0.55 }, {
        opacity: 1, ease: "none", stagger: 0.1,
        scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 45%", scrub: 0.5 },
      });
    });
    gsap.fromTo(q(".mv__rule"), { scale: 0 }, { scale: 1, duration: 1.2, ease: EASE.inOut, transformOrigin: "left top",
      scrollTrigger: { trigger: q(".mv__grid")[0], start: "top 80%", toggleActions: "play none none none" } });
  }, { scope: root, dependencies: [motion], revertOnUpdate: true });

  return (
    <section className="mv section" id="mission" ref={root} aria-labelledby="mv-title">
      <div className="container">
        <h2 id="mv-title" className="sr-only">Mission, vision and values</h2>
        <div className="mv__grid">
          <article className="mv__block">
            <p className="mv__label" data-reveal><span>Mission</span></p>
            <p className="mv__statement">{MISSION}</p>
          </article>
          <span className="mv__rule" aria-hidden="true" />
          <article className="mv__block mv__block--vision">
            <p className="mv__label" data-reveal><span>Vision</span></p>
            <p className="mv__statement mv__statement--small">{VISION}</p>
          </article>
        </div>

        <div className="values">
          <div className="values__head">
            <h3 className="values__title" data-reveal>What we value</h3>
            <p className="values__sub" data-reveal>How we build matters as much as what we build.</p>
            <a className="text-link" href="/about" data-reveal>More about SINC <IconArrowRight /></a>
          </div>
          <ul className="values__list">
            {VALUES.map((v, i) => {
              const isOpen = open === v.id;
              return (
                <li key={v.id} className={`value${isOpen ? " is-open" : ""}`} data-reveal>
                  <h4 className="value__heading">
                    <button type="button" className="value__button" aria-expanded={isOpen} aria-controls={`value-${v.id}`}
                      id={`value-btn-${v.id}`} onClick={() => setOpen(isOpen ? "" : v.id)}>
                      <span className="value__num">0{i + 1}</span>
                      <span className="value__name">{v.name}</span>
                      <span className="value__icon" aria-hidden="true"><IconPlus /></span>
                    </button>
                  </h4>
                  <div className="value__panel" id={`value-${v.id}`} role="region" aria-labelledby={`value-btn-${v.id}`} inert={!isOpen || undefined}>
                    <div className="value__inner"><p>{v.text}</p></div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
