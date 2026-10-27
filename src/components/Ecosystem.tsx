import { useRef, useState, type KeyboardEvent } from "react";
import { STAGES } from "../data/content";
import { gsap, useGSAP, EASE } from "../motion/gsap";
import { useDeferredMotion } from "../motion/MotionContext";
import { IconArrowLeft, IconArrowRight } from "./ui";
import "./Ecosystem.css";

/* node positions along the desktop pathway (viewBox 1200 x 300) */
// node positions and the progress fill are mirrored in Ecosystem.css (.eco__node--N, [data-active]),
// so the prerendered markup carries no inline styles; change both together
const PTS = [[70, 200], [280, 110], [490, 190], [700, 100], [910, 180], [1120, 95]];
const seg = (i: number) => {
  const [x0, y0] = PTS[i], [x1, y1] = PTS[i + 1];
  const mx = (x0 + x1) / 2;
  return `M${x0} ${y0} C ${mx} ${y0}, ${mx} ${y1}, ${x1} ${y1}`;
};
const RETURN = `M${PTS[5][0]} ${PTS[5][1]} C 1220 260, 1000 300, 600 292 S 10 290, ${PTS[0][0]} ${PTS[0][1]}`;

/** Small illustration for each stage — the same line language, growing in complexity. */
function StageArt({ index }: { index: number }) {
  const common = { className: "eco-art__line", pathLength: 1 } as const;
  return (
    <svg className="eco-art" viewBox="0 0 240 180" aria-hidden="true" data-stage={index}>
      {index === 0 && (<>
        <circle className="eco-art__dot" cx="120" cy="95" r="12" />
        {[0, 60, 120, 180, 240, 300].map((a) => {
          const r = (a * Math.PI) / 180;
          return <path key={a} {...common} d={`M${120 + Math.cos(r) * 26} ${95 + Math.sin(r) * 26} L${120 + Math.cos(r) * 46} ${95 + Math.sin(r) * 46}`} />;
        })}
      </>)}
      {index === 1 && (<>
        <path {...common} d="M30 40 C 80 40, 90 92, 120 92" /><path {...common} d="M210 40 C 160 40, 150 92, 120 92" /><path {...common} d="M120 160 L120 104" />
        <circle className="eco-art__node" cx="30" cy="40" r="10" /><circle className="eco-art__node" cx="210" cy="40" r="10" /><circle className="eco-art__node" cx="120" cy="160" r="10" />
        <circle className="eco-art__dot" cx="120" cy="92" r="10" />
      </>)}
      {index === 2 && (<>
        <path className="eco-art__fill" d="M60 130 L120 40 L180 130 Z" />
        <path {...common} d="M60 130 L120 40 L180 130 Z" />
        {[[60, 130], [120, 40], [180, 130]].map(([x, y]) => <circle key={x} className="eco-art__node" cx={x} cy={y} r="11" />)}
      </>)}
      {index === 3 && (<>
        <rect className="eco-art__fill" x="70" y="45" width="100" height="90" rx="18" />
        <path {...common} d="M88 45 H152 a18 18 0 0 1 18 18 V117 a18 18 0 0 1 -18 18 H88 a18 18 0 0 1 -18 -18 V63 a18 18 0 0 1 18 -18 Z" />
        <path {...common} d="M95 95 L112 110 L146 76" />
        <circle className="eco-art__node" cx="30" cy="90" r="8" /><circle className="eco-art__node" cx="210" cy="90" r="8" />
        <path {...common} d="M38 90 H70" /><path {...common} d="M170 90 H202" />
      </>)}
      {index === 4 && (<>
        {[[48, 100], [96, 70], [144, 70], [192, 100], [96, 130], [144, 130]].map(([x, y]) => <rect key={`${x}${y}`} className="eco-art__fill eco-art__block" x={x - 20} y={y - 16} width="40" height="32" rx="8" />)}
        <path {...common} d="M48 100 L96 70 L144 70 L192 100 L144 130 L96 130 Z" />
        <path {...common} d="M96 70 L96 130 M144 70 L144 130" />
      </>)}
      {index === 5 && (<>
        <circle className="eco-art__dot" cx="60" cy="110" r="11" />
        <path {...common} d="M60 110 C 110 110, 120 50, 190 40" /><path {...common} d="M60 110 C 120 110, 140 100, 200 96" /><path {...common} d="M60 110 C 110 112, 130 160, 186 158" />
        {[[190, 40], [200, 96], [186, 158]].map(([x, y]) => <circle key={x + y} className="eco-art__node" cx={x} cy={y} r="9" />)}
        <path className="eco-art__line eco-art__line--dash" pathLength={1} d="M186 158 C 120 178, 40 170, 52 122" />
      </>)}
    </svg>
  );
}

export function Ecosystem() {
  const motion = useDeferredMotion(); // built after the first paint
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const stage = STAGES[active];

  const select = (i: number, focus = false) => {
    const next = (i + STAGES.length) % STAGES.length;
    setActive(next);
    if (focus) root.current?.querySelector<HTMLButtonElement>(`#eco-tab-${next}`)?.focus();
  };
  const onKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const map: Record<string, number> = { ArrowRight: i + 1, ArrowDown: i + 1, ArrowLeft: i - 1, ArrowUp: i - 1, Home: 0, End: STAGES.length - 1 };
    if (e.key in map) { e.preventDefault(); select(map[e.key], true); }
  };

  /* section colour transition into navy + entrance */
  useGSAP(() => {
    if (!motion || !root.current) return;
    const el = root.current;
    // the navy field opens outward from a rounded panel as the section arrives
    gsap.fromTo(el.querySelector(".eco__bg"), { clipPath: "inset(7% 4% 0% 4% round 56px)" }, {
      clipPath: "inset(0% 0% 0% 0% round 0px)", ease: "none",
      scrollTrigger: { trigger: el, start: "top 95%", end: "top 25%", scrub: true },
    });
    const q = gsap.utils.selector(el);
    if (el.getBoundingClientRect().top < window.innerHeight * 0.45) return; // already on screen: leave it as it is
    const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 45%", toggleActions: "play none none none" } });
    // opacity only, so the stage buttons stay reachable by keyboard before they appear
    tl.from(q(".eco__head > *"), { y: 30, opacity: 0, duration: 0.85, ease: EASE.out, stagger: 0.08 })
      .from(q(".eco__track"), { drawSVG: "0%", duration: 1.4, ease: EASE.draw, stagger: 0.12 }, "-=0.4")
      .from(q(".eco__vline"), { scaleY: 0, transformOrigin: "50% 0%", duration: 1.3, ease: EASE.draw }, "<")
      .from(q(".eco__node"), { scale: 0.6, opacity: 0, duration: 0.55, ease: "back.out(2)", stagger: 0.08 }, "<0.2")
      .from(q(".eco__return"), { drawSVG: "0%", duration: 1.6, ease: EASE.draw }, "-=0.6")
      .from(q(".eco__detail"), { y: 30, opacity: 0, duration: 0.8, ease: EASE.out }, "-=1.2");
  }, { scope: root, dependencies: [motion], revertOnUpdate: true });

  /* stage change: progress line, illustration and copy */
  useGSAP(() => {
    if (!motion || !root.current) return;
    const q = gsap.utils.selector(root);
    gsap.fromTo(q(".eco__swap"), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.45, ease: EASE.out, stagger: 0.05, overwrite: true });
    gsap.fromTo(q(".eco-art .eco-art__line:not(.eco-art__line--dash)"), { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.8, ease: EASE.draw, stagger: 0.06, overwrite: true });
    gsap.fromTo(q(".eco-art circle, .eco-art .eco-art__fill"), { scale: 0.4, autoAlpha: 0, transformOrigin: "50% 50%" },
      { scale: 1, autoAlpha: 1, duration: 0.5, ease: "back.out(2)", stagger: 0.05, delay: 0.15, overwrite: true });
  }, { scope: root, dependencies: [active, motion] });

  return (
    <section className="eco on-dark" id="ecosystem" ref={root} aria-labelledby="eco-title">
      <div className="eco__bg" aria-hidden="true" />
      <div className="container">
        <div className="eco__head">
          <p className="eyebrow">The ecosystem</p>
          <h2 id="eco-title" className="heading-xl">From one idea to opportunities for many.</h2>
          <p className="eco__intro">
            Our long-term vision is an ecosystem where ideas become collaborations, collaborations become projects, and successful work creates opportunities for others.
            It is a possible path, not a promise that every project becomes a company.
          </p>
        </div>

        <div className="eco__path">
          <svg className="eco__svg" viewBox="0 0 1200 300" aria-hidden="true">
            <path className="eco__return" d={RETURN} />
            {PTS.slice(0, -1).map((_, i) => (
              <g key={i}>
                <path className="eco__track" d={seg(i)} />
                <path className={`eco__progress${i < active ? " is-on" : ""}`} pathLength={1} d={seg(i)} />
              </g>
            ))}
          </svg>
          <span className="eco__return-label">Opportunities inspire new ideas</span>

          <div className="eco__nodes" role="tablist" aria-label="Ecosystem stages" data-active={active}>
            {/* smaller screens: the vertical pathway and its progress */}
            <span className="eco__vline" aria-hidden="true"><span className="eco__vfill" /></span>
            {STAGES.map((s, i) => (
              <button key={s.id} id={`eco-tab-${i}`} type="button" role="tab" className={`eco__node eco__node--${i}`}
                aria-selected={i === active} aria-controls="eco-panel" tabIndex={i === active ? 0 : -1}
                data-state={i < active ? "done" : i === active ? "active" : "next"}
                onClick={() => select(i)} onKeyDown={(e) => onKey(e, i)}>
                <span className="eco__node-dot" aria-hidden="true" />
                <span className="eco__node-num">0{i + 1}</span>
                <span className="eco__node-name">{s.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="eco__detail" id="eco-panel" role="tabpanel" aria-labelledby={`eco-tab-${active}`}>
          <div className="eco__detail-art"><StageArt index={active} /></div>
          <div className="eco__detail-copy">
            <p className="eco__count eco__swap">{String(active + 1).padStart(2, "0")} / 06 · {stage.name}</p>
            <h3 className="eco__line eco__swap">{stage.line}</h3>
            <p className="eco__desc eco__swap">{stage.description}</p>
            <div className="eco__controls">
              <button type="button" className="eco__step" onClick={() => select(active - 1)} aria-label={`Previous stage: ${STAGES[(active + 5) % 6].name}`}>
                <IconArrowLeft />
              </button>
              <button type="button" className="eco__step" onClick={() => select(active + 1)} aria-label={`Next stage: ${STAGES[(active + 1) % 6].name}`}>
                <IconArrowRight />
              </button>
              <span className="eco__next">Next: {STAGES[(active + 1) % 6].name}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
