import { useCallback, useEffect, useRef, useState } from "react";
import { INTRO_SCENES } from "../data/content";
import { TEAM, square, squareSrcSet } from "../data/team";
import { SITE } from "../config/site";
import { gsap, useGSAP, EASE } from "../motion/gsap";
import { lockScroll } from "../motion/hooks";
import { useMotionEnabled } from "../motion/MotionContext";
import { IconClose, IconPause, IconPlay, IconReplay } from "./ui";
import "./IntroStory.css";

export type IntroCloseReason = "complete" | "skip";

/* scene windows in seconds — the whole sequence is ~15 s plus a short hand-off */
const SCENE_START = [0, 2.2, 5.0, 7.6, 10.3, 13.0];
const END = 15.2;
const SCENE_TEXT = [
  "An idea starts with someone.",
  "Someone who builds. Someone who designs. Someone who asks what’s next.",
  "Progress begins when people connect.",
  "Different strengths. One shared belief.",
  SITE.belief,
  `SINC. ${SITE.tagline}`,
];
/* the founder sits at the centre of the portrait arc */
const ORDER = ["karmjith", "vaishnavi-m", "aaditya-r-m", "dhakshatha", "elango-s", "meghana-p-banda", "ishita-das", "mohana-priya-g", "dhanusri-t", "prajith"];
const PEOPLE = ORDER.map((id) => TEAM.find((m) => m.id === id)!);
const N = PEOPLE.length;
const MID = (N - 1) / 2; // centre of the arc (between two portraits when the count is even)
const FOUNDER = ORDER.indexOf("elango-s");
const TOP_ROW = Math.ceil(N / 2); // two-row layouts: top row count
/** portrait indices from the centre outwards (appear) and from the outside inwards (gather) */
const CENTRE_OUT = PEOPLE.map((_, i) => i).sort((a, b) => Math.abs(a - FOUNDER) - Math.abs(b - FOUNDER) || a - b);
const OUTSIDE_IN = [...CENTRE_OUT].reverse();

type Pt = { x: number; y: number };
interface Geometry {
  w: number; h: number; g: Pt; r: number; wordsTop: number; logo: number;
  /** short landscape screens: drawing on the left, words on the right */
  side: boolean; wordsLeft: number;
  n: [Pt, Pt, Pt];
  enterL: string; enterR: string; seed: string; swirl: string[]; ring: string; thread: string;
  people: { x: number; y: number; size: number }[];
}

const rot = (p: Pt, deg: number): Pt => {
  const a = (deg * Math.PI) / 180;
  return { x: p.x * Math.cos(a) - p.y * Math.sin(a), y: p.x * Math.sin(a) + p.y * Math.cos(a) };
};

function geometry(w: number, h: number): Geometry {
  const portraitScreen = w / h < 0.9;
  const side = h < 460 && w / h > 1.5;
  const g = side ? { x: w * 0.27, y: h * 0.5 } : { x: w / 2, y: h * (portraitScreen ? 0.33 : 0.37) };
  const r = side ? Math.max(56, Math.min(h * 0.34, w * 0.14)) : Math.max(70, Math.min(w * 0.27, h * (portraitScreen ? 0.2 : 0.235), 260));
  const n: [Pt, Pt, Pt] = [
    { x: g.x, y: g.y - r },
    { x: g.x + r * 0.87, y: g.y + r * 0.5 },
    { x: g.x - r * 0.87, y: g.y + r * 0.5 },
  ];
  const enterL = `M -40 ${g.y + r * 1.05} C ${w * 0.16} ${g.y + r * 1.05}, ${n[2].x - r * 0.7} ${n[2].y}, ${n[2].x} ${n[2].y}`;
  const enterR = side   // short screens: arrive from above so the line never crosses the words
    ? `M ${n[1].x + r * 0.9} -40 C ${n[1].x + r * 0.9} ${g.y - r * 0.6}, ${n[1].x + r * 0.55} ${n[1].y}, ${n[1].x} ${n[1].y}`
    : `M ${w + 40} ${g.y - r * 0.55} C ${w * 0.84} ${g.y - r * 0.55}, ${n[1].x + r * 0.7} ${n[1].y}, ${n[1].x} ${n[1].y}`;
  const seed = `M ${g.x} ${g.y + r * 0.6} L ${g.x} ${g.y}`;
  const swirl = n.map((p) => {
    const v = { x: p.x - g.x, y: p.y - g.y };
    const c = rot(v, 55);
    const e = rot({ x: v.x * 0.22, y: v.y * 0.22 }, 110);
    return `M ${p.x} ${p.y} Q ${g.x + c.x * 0.8} ${g.y + c.y * 0.8} ${g.x + e.x} ${g.y + e.y}`;
  });
  const ring = `M ${g.x} ${g.y - r} a ${r} ${r} 0 1 1 0 ${2 * r} a ${r} ${r} 0 1 1 0 ${-2 * r}`;

  // portraits: one balanced arc on wide screens, two rows on narrow ones
  let people: { x: number; y: number; size: number }[];
  const rows = (size: number, gap: number, lift: number, drop: number) =>
    PEOPLE.map((m, i) => {
      const top = i < TOP_ROW;
      const k = top ? i - (TOP_ROW - 1) / 2 : i - TOP_ROW - (N - TOP_ROW - 1) / 2;
      return { x: g.x + k * gap, y: g.y + (top ? -lift : drop) * size, size: m.id === "elango-s" ? size * 1.08 : size };
    });
  if (side) {
    const size = Math.min(h * 0.27, (w * 0.46) / (TOP_ROW * 1.1), 96);
    people = rows(size, size * 1.1, 0.58, 0.6);
  } else if (w >= 640) {
    const span = Math.min(w * 0.86, 1120);
    const size = Math.max(52, Math.min((span / N) * 0.82, 124, h * 0.2));
    people = PEOPLE.map((_, i) => {
      const t = (i - MID) / MID;
      const s = i === FOUNDER ? size * 1.18 : size;
      return { x: g.x + t * (span / 2 - size / 2), y: g.y + r * 0.22 * t * t, size: s };
    });
  } else {
    const size = Math.min(w / (TOP_ROW * 1.12 + 0.5), 92, h * 0.13);
    people = rows(size, size * 1.12, 0.6, 0.62);
  }
  const pts = people.map((p) => `${p.x} ${p.y}`);
  const last = people[people.length - 1];
  const thread = `M -40 ${people[0].y + 20} L ${pts.join(" L ")} L ${side ? last.x + last.size * 0.9 : w + 40} ${last.y + 20}`;
  const logo = Math.min(r * 1.35, 240, w * 0.42);
  const wordsTop = side ? h / 2 : Math.min(h - 150, g.y + r * 1.22 + 28);
  const wordsLeft = side ? w * 0.52 : 0;
  return { w, h, g, r, n, enterL, enterR, seed, swirl, ring, thread, people, logo, wordsTop, side, wordsLeft };
}

interface IntroProps {
  open: boolean;
  /** called when the logo starts travelling into the page, so the hero entrance can begin */
  onHandoff: () => void;
  onClose: (reason: IntroCloseReason) => void;
}

export function IntroStory({ open, onHandoff, onClose }: IntroProps) {
  const motion = useMotionEnabled();
  const dialog = useRef<HTMLDialogElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const timeRef = useRef(0);
  const closing = useRef(false);
  const [geo, setGeo] = useState<Geometry | null>(null);
  const [paused, setPaused] = useState(false);
  const [scene, setScene] = useState(0);
  const pausedRef = useRef(false);

  /* open / close the native dialog: focus is trapped by the browser; scroll is locked */
  useEffect(() => {
    const d = dialog.current;
    if (!d || !open) return;
    closing.current = false;
    timeRef.current = 0;
    pausedRef.current = false;
    setPaused(false);
    setScene(0);
    if (!d.open) d.showModal();
    document.documentElement.classList.remove("intro-pending");
    const release = lockScroll();
    d.querySelector<HTMLButtonElement>(".intro__skip")?.focus();
    return () => { release(); if (d.open) d.close(); };
  }, [open]);

  /* measure the stage; geometry follows resizes and rotation */
  useEffect(() => {
    if (!open || !stage.current) return;
    const el = stage.current;
    const measure = () => {
      const r = el.getBoundingClientRect();
      if (r.width > 0 && r.height > 0) setGeo(geometry(Math.round(r.width), Math.round(r.height)));
    };
    measure();
    const ro = new ResizeObserver(() => measure());
    ro.observe(el);
    return () => ro.disconnect();
  }, [open]);

  const finish = useCallback((reason: IntroCloseReason) => {
    if (closing.current) return;
    closing.current = true;
    tl.current?.pause();
    const d = dialog.current;
    const done = () => { onClose(reason); };
    // close synchronously before styles are reset, so no frame of the white stage can flash
    const closeNow = () => { if (d?.open) d.close(); };
    if (!d || !motion) { if (reason === "complete") onHandoff(); done(); return; }

    if (reason === "skip") {
      onHandoff();
      gsap.to(d, { autoAlpha: 0, duration: 0.25, ease: "power1.out", onComplete: () => { closeNow(); gsap.set(d, { clearProps: "opacity,visibility" }); done(); } });
      return;
    }
    // complete: hand the logo to the header when the page is at the top, otherwise fade out
    const logo = d.querySelector<HTMLElement>(".intro__logo");
    const target = document.querySelector<HTMLElement>("[data-brand-logo]");
    const atTop = window.scrollY < 80;
    onHandoff();
    const out = gsap.timeline({ onComplete: () => { closeNow(); gsap.set(d, { clearProps: "all" }); if (logo) gsap.set(logo, { clearProps: "transform" }); done(); } });
    out.to(d.querySelectorAll(".intro__words, .intro__bar, .intro__top"), { autoAlpha: 0, duration: 0.35 }, 0);
    if (logo && target && atTop) {
      const a = logo.getBoundingClientRect(), b = target.getBoundingClientRect();
      out.to(logo, {
        x: b.left + b.width / 2 - (a.left + a.width / 2), y: b.top + b.height / 2 - (a.top + a.height / 2),
        scale: b.width / a.width, duration: 0.95, ease: EASE.inOut,
      }, 0.05);
    } else if (logo) {
      out.to(logo, { autoAlpha: 0, scale: 0.9, duration: 0.5 }, 0);
    }
    out.to(d, { backgroundColor: "rgba(251,252,255,0)", duration: 0.7, ease: "power1.inOut" }, 0.15);
    out.to(logo, { autoAlpha: 0, duration: 0.2 }, ">-0.05");
  }, [motion, onClose, onHandoff]);

  /* the timeline */
  useGSAP(() => {
    if (!open || !geo || !dialog.current) return;
    const q = gsap.utils.selector(dialog);
    const M = motion;                   // full choreography, or calm crossfades
    const mv = (d: number) => (M ? d : 0.001);
    const draw = (t: gsap.core.Timeline, sel: string | Element[], at: number | string, dur = 1.1, stagger = 0) => {
      if (M) t.fromTo(sel, { drawSVG: "0%" }, { drawSVG: "100%", duration: dur, ease: EASE.draw, stagger }, at);
      else t.set(sel, { drawSVG: "100%" }, at);
    };
    const textIn = (t: gsap.core.Timeline, sel: string, at: number) =>
      t.fromTo(q(sel), { autoAlpha: 0, y: M ? 26 : 0 }, { autoAlpha: 1, y: 0, duration: M ? 0.8 : 0.35, ease: EASE.out, stagger: M ? 0.08 : 0 }, at);
    const textOut = (t: gsap.core.Timeline, sel: string, at: number) =>
      t.to(q(sel), { autoAlpha: 0, y: M ? -16 : 0, duration: M ? 0.4 : 0.3, ease: "power2.in" }, at);

    // starting state
    gsap.set(q(".intro__words > *, .intro__roles li, .intro__person, .intro__logo, .intro__dot, .intro__hub"), { autoAlpha: 0 });
    gsap.set(q(".intro__path"), { drawSVG: "0%" });
    gsap.set(q(".intro__graph"), { transformOrigin: `${geo.g.x}px ${geo.g.y}px`, scale: 1, rotation: 0, autoAlpha: 1 });
    gsap.set(q(".intro__seedgroup"), { y: 0 });

    const t = gsap.timeline({
      paused: true,
      onUpdate: () => {
        timeRef.current = t.time();
        const s = SCENE_START.reduce((acc, start, i) => (t.time() >= start ? i : acc), 0);
        setScene((prev) => (prev === s ? prev : s));
        q(".intro__seg-fill").forEach((el: Element, i: number) => {
          const a = SCENE_START[i], b = SCENE_START[i + 1] ?? END;
          (el as HTMLElement).style.transform = `scaleX(${Math.min(1, Math.max(0, (t.time() - a) / (b - a)))})`;
        });
      },
      onComplete: () => finish("complete"),
    });

    /* A — individual ambition */
    t.to(q(".intro__dot--seed"), { autoAlpha: 1, duration: 0.3 }, 0.2)
      .from(q(".intro__dot--seed"), { scale: M ? 0 : 1, transformOrigin: "50% 50%", duration: mv(0.6), ease: "back.out(3)" }, 0.2);
    draw(t, q(".intro__seed"), 0.55, 0.9);
    textIn(t, ".intro__line--a", 0.6);
    textOut(t, ".intro__line--a", 1.85);

    /* B — different strengths */
    t.to(q(".intro__seedgroup"), { y: -geo.r, duration: mv(0.95), ease: EASE.inOut }, 2.2);
    draw(t, q(".intro__enter--l"), 2.3, 1.2);
    draw(t, q(".intro__enter--r"), 2.5, 1.2);
    t.fromTo(q(".intro__dot--l, .intro__dot--r"), { autoAlpha: 0, scale: M ? 0 : 1 }, { autoAlpha: 1, scale: 1, transformOrigin: "50% 50%", duration: mv(0.5) || 0.3, ease: "back.out(3)", stagger: 0.2 }, 3.3);
    t.set(q(".intro__roles"), { autoAlpha: 1 }, 2.5);
    t.fromTo(q(".intro__roles li"), { autoAlpha: 0, y: M ? 20 : 0 }, { autoAlpha: 1, y: 0, duration: M ? 0.7 : 0.3, ease: EASE.out, stagger: 0.6 }, 2.6);
    textOut(t, ".intro__roles", 4.6);

    /* C — connection */
    draw(t, q(".intro__swirl"), 5.0, 1.2, 0.15);
    t.to(q(".intro__enter"), { autoAlpha: 0.25, duration: 0.8 }, 5.3)
      .fromTo(q(".intro__hub"), { autoAlpha: 0, scale: M ? 0.3 : 1 }, { autoAlpha: 1, scale: 1, transformOrigin: "50% 50%", duration: mv(0.6) || 0.3, ease: "back.out(2.5)" }, 5.9)
      .to(q(".intro__graph"), { scale: M ? 1.1 : 1, rotation: M ? 12 : 0, duration: mv(2.4), ease: EASE.inOut }, 5.2);
    textIn(t, ".intro__line--c", 5.5);
    textOut(t, ".intro__line--c", 7.15);

    /* D — the people building SINC */
    t.to(q(".intro__graph"), { autoAlpha: 0.14, scale: M ? 0.94 : 1, duration: mv(0.8) || 0.4 }, 7.6);
    draw(t, q(".intro__thread"), 7.75, 1.4);
    const order = CENTRE_OUT.map((i) => q(".intro__person")[i]);
    t.fromTo(order, { autoAlpha: 0, scale: M ? 0.5 : 1, clipPath: M ? "circle(0% at 50% 50%)" : "circle(50% at 50% 50%)" },
      { autoAlpha: 1, scale: 1, clipPath: "circle(50% at 50% 50%)", duration: M ? 0.85 : 0.35, ease: EASE.out, stagger: 0.09 }, 7.7);
    textIn(t, ".intro__line--d", 8.3);
    textOut(t, ".intro__line--d", 9.85);

    /* E — the purpose */
    const reversed = OUTSIDE_IN.map((i) => q(".intro__person")[i]);
    t.to(reversed, {
      autoAlpha: 0, scale: M ? 0.45 : 1, duration: M ? 0.7 : 0.3, ease: "power2.in", stagger: 0.05,
      x: (i: number) => (M ? (geo.g.x - geo.people[OUTSIDE_IN[i]].x) * 0.45 : 0),
      y: (i: number) => (M ? (geo.g.y - geo.people[OUTSIDE_IN[i]].y) * 0.45 : 0),
    }, 10.2)
      .to(q(".intro__thread"), { autoAlpha: 0, duration: 0.5 }, 10.3)
      .to(q(".intro__graph"), { autoAlpha: 1, scale: 1, rotation: 0, duration: mv(1) || 0.4, ease: EASE.inOut }, 10.5)
      .to(q(".intro__enter"), { autoAlpha: 0, duration: 0.5 }, 10.5);
    draw(t, q(".intro__ring"), 10.75, 1.3);
    textIn(t, ".intro__line--e", 10.8);
    textOut(t, ".intro__line--e", 12.65);

    /* F — brand arrival */
    t.to(q(".intro__graph"), { autoAlpha: 0, scale: M ? 0.35 : 1, duration: mv(0.8) || 0.4, ease: "power2.in" }, 13.0)
      .fromTo(q(".intro__logo"), { autoAlpha: 0, scale: M ? 0.6 : 1, clipPath: M ? "circle(0% at 50% 50%)" : "circle(75% at 50% 50%)" },
        { autoAlpha: 1, scale: 1, clipPath: "circle(75% at 50% 50%)", duration: M ? 1.1 : 0.4, ease: EASE.out }, 13.25);
    textIn(t, ".intro__brand", 13.9);
    textIn(t, ".intro__tagline", 14.25);
    t.to({}, { duration: 0.01 }, END);

    tl.current = t;
    t.seek(timeRef.current, false);
    if (!pausedRef.current) t.play();
  }, { scope: dialog, dependencies: [open, geo, motion], revertOnUpdate: true });

  const togglePause = () => {
    const t = tl.current;
    if (!t) return;
    const next = !pausedRef.current;
    pausedRef.current = next;
    setPaused(next);
    if (next) t.pause(); else t.play();
  };
  const replay = () => {
    pausedRef.current = false;
    setPaused(false);
    timeRef.current = 0;
    tl.current?.restart();
  };

  const g = geo;
  return (
    <dialog ref={dialog} className="intro" aria-labelledby="intro-title" aria-describedby="intro-live"
      onCancel={(e) => { e.preventDefault(); finish("skip"); }}>
      <div className="intro__top">
        <p className="intro__kicker">Our story</p>
        <button type="button" className="intro__skip" onClick={() => finish("skip")}>
          Skip intro <IconClose />
        </button>
      </div>

      <div className="intro__stage" ref={stage} data-layout={g?.side ? "side" : "stack"}
        style={g ? { ["--words-top" as string]: `${g.wordsTop}px`, ["--words-left" as string]: `${g.wordsLeft}px` } : undefined}>
        {g && (
          <svg className="intro__svg" width={g.w} height={g.h} viewBox={`0 0 ${g.w} ${g.h}`} aria-hidden="true">
            <path className="intro__path intro__thread" d={g.thread} />
            <g className="intro__graph">
              <path className="intro__path intro__enter intro__enter--l" d={g.enterL} />
              <path className="intro__path intro__enter intro__enter--r" d={g.enterR} />
              {g.swirl.map((d, i) => <path key={i} className="intro__path intro__swirl" d={d} />)}
              <path className="intro__path intro__ring" d={g.ring} />
              <circle className="intro__hub" cx={g.g.x} cy={g.g.y} r={g.r * 0.2} />
              <g className="intro__seedgroup">
                <path className="intro__path intro__seed" d={g.seed} />
                <g className="intro__dot intro__dot--seed"><circle cx={g.g.x} cy={g.g.y} r={18} className="intro__dot-ring" /><circle cx={g.g.x} cy={g.g.y} r={8} /></g>
              </g>
              <g className="intro__dot intro__dot--r"><circle cx={g.n[1].x} cy={g.n[1].y} r={18} className="intro__dot-ring" /><circle cx={g.n[1].x} cy={g.n[1].y} r={8} /></g>
              <g className="intro__dot intro__dot--l"><circle cx={g.n[2].x} cy={g.n[2].y} r={18} className="intro__dot-ring" /><circle cx={g.n[2].x} cy={g.n[2].y} r={8} /></g>
            </g>
          </svg>
        )}

        {g && PEOPLE.map((m, i) => (
          <div key={m.id} className="intro__person" style={{ left: g.people[i].x, top: g.people[i].y, width: g.people[i].size, height: g.people[i].size }}>
            <img src={square(m.id, 320)} srcSet={squareSrcSet(m.id)} sizes={`${Math.round(g.people[i].size)}px`} width={320} height={320} alt="" />
          </div>
        ))}

        {g && (
          <div className="intro__logo" style={{ left: g.g.x, top: g.g.y, width: g.logo, height: g.logo }}>
            <img src="/images/brand/sinc-mark-900.webp" width={900} height={787} alt="" />
          </div>
        )}

        <div className="intro__words">
          <h2 id="intro-title" className="intro__line intro__line--a">An idea starts with someone.</h2>
          <ul className="intro__roles">
            <li><span aria-hidden="true" />Someone who builds.</li>
            <li><span aria-hidden="true" />Someone who designs.</li>
            <li><span aria-hidden="true" />Someone who asks what’s next.</li>
          </ul>
          <p className="intro__line intro__line--c">Progress begins when people connect.</p>
          <p className="intro__line intro__line--d">Different strengths. <span>One shared belief.</span></p>
          <p className="intro__line intro__line--e">No one should have to pursue their ambitions alone.</p>
          <p className="intro__brand">SINC</p>
          <p className="intro__tagline">{SITE.tagline}</p>
        </div>
        <p className="sr-only" id="intro-live" aria-live="polite">{SCENE_TEXT[scene]}</p>
      </div>

      <div className="intro__bar">
        <p className="intro__label"><span>0{scene + 1}</span> {INTRO_SCENES[scene].label}</p>
        <ol className="intro__progress" aria-hidden="true">
          {INTRO_SCENES.map((s) => <li key={s.id}><span className="intro__seg-fill" /></li>)}
        </ol>
        <div className="intro__controls">
          <button type="button" className="intro__control" onClick={togglePause} aria-label={paused ? "Resume story" : "Pause story"}>
            {paused ? <IconPlay /> : <IconPause />}
          </button>
          <button type="button" className="intro__control" onClick={replay} aria-label="Replay story from the start">
            <IconReplay />
          </button>
        </div>
      </div>
    </dialog>
  );
}
