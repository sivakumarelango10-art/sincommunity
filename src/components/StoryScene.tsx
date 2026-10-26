import { useEffect, useRef } from "react";
import "./StoryScene.css";

/**
 * The connection motif as a five-stage scene. Stage is set through data-stage, and CSS
 * transitions move between stages, so the same SVG serves the pinned desktop sequence
 * and the static per-chapter illustrations on small screens.
 *   0 individual sparks · 1 reaching but not meeting · 2 a shared space · 3 a connected group · 4 opening outward
 */
const C = { x: 300, y: 300 };
const FAR = [[92, 138], [508, 112], [536, 420], [300, 540], [70, 428]];
const NEAR = FAR.map(([x, y]) => [C.x + (x - C.x) * 0.55, C.y + (y - C.y) * 0.55]);
const TAILS = ["M0 0 c -18 -26 -44 -30 -66 -16", "M0 0 c 22 -22 50 -22 66 -6", "M0 0 c 26 8 44 30 46 56",
  "M0 0 c -8 26 0 52 18 66", "M0 0 c -26 4 -46 26 -50 52"];
const OUT = [[18, 60], [560, 40], [585, 300], [420, 590], [14, 540], [190, 590]];
const OUT_FROM = [0, 1, 2, 3, 4, 3];

const lerp = (a: number[], b: number[], t: number) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];

export function StoryScene({ stage, revealOnView = false, className = "" }: { stage: number; revealOnView?: boolean; className?: string }) {
  const ref = useRef<SVGSVGElement>(null);

  // small screens: arrive from the previous stage when the illustration scrolls into view
  useEffect(() => {
    const el = ref.current;
    if (!revealOnView || !el || stage === 0) return;
    if (document.documentElement.getAttribute("data-motion") !== "on") return;
    el.setAttribute("data-stage", String(stage - 1));
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        el.setAttribute("data-stage", String(stage));
        io.disconnect();
      }
    }, { threshold: 0.45 });
    io.observe(el);
    return () => { io.disconnect(); el.setAttribute("data-stage", String(stage)); };
  }, [revealOnView, stage]);

  return (
    <svg ref={ref} className={`story-scene ${className}`} viewBox="0 0 600 600" data-stage={stage} aria-hidden="true">
      {/* stage 3: shared field */}
      <polygon className="ss-field" points={NEAR.map((p) => p.join(",")).join(" ")} />

      {/* stage 1: reaching lines that stop short of each other */}
      {FAR.map((p, i) => {
        const q = FAR[(i + 1) % FAR.length];
        const a = lerp(p, q, 0.12), b = lerp(p, q, 0.4);
        return <path key={`r${i}`} className="ss-reach" pathLength={1} d={`M${a[0]} ${a[1]} L${b[0]} ${b[1]}`} style={{ transitionDelay: `${i * 70}ms` }} />;
      })}

      {/* stage 2: spokes into the shared space */}
      {NEAR.map((p, i) => {
        const dx = C.x - p[0], dy = C.y - p[1], len = Math.hypot(dx, dy);
        const e = [C.x - (dx / len) * 54, C.y - (dy / len) * 54];
        const ctrl = [p[0] + dx * 0.5 - dy * 0.18, p[1] + dy * 0.5 + dx * 0.18];
        return <path key={`s${i}`} className="ss-spoke" pathLength={1} d={`M${p[0]} ${p[1]} Q${ctrl[0]} ${ctrl[1]} ${e[0]} ${e[1]}`} style={{ transitionDelay: `${200 + i * 90}ms` }} />;
      })}

      {/* stage 3: everyone connected */}
      {NEAR.map((p, i) => {
        const q = NEAR[(i + 1) % NEAR.length];
        return <path key={`e${i}`} className="ss-edge" pathLength={1} d={`M${p[0]} ${p[1]} L${q[0]} ${q[1]}`} style={{ transitionDelay: `${i * 90}ms` }} />;
      })}

      {/* stage 4: progress opens outward to new people */}
      {OUT.map((o, i) => {
        const p = NEAR[OUT_FROM[i]];
        const mid = [(p[0] + o[0]) / 2 + (o[1] - p[1]) * 0.12, (p[1] + o[1]) / 2 - (o[0] - p[0]) * 0.12];
        return (
          <g key={`o${i}`} className="ss-out" style={{ transitionDelay: `${i * 80}ms` }}>
            <path className="ss-out-line" pathLength={1} d={`M${p[0]} ${p[1]} Q${mid[0]} ${mid[1]} ${o[0]} ${o[1]}`} style={{ transitionDelay: `${i * 80}ms` }} />
            <circle className="ss-out-node" cx={o[0]} cy={o[1]} r={9} style={{ transitionDelay: `${300 + i * 80}ms` }} />
          </g>
        );
      })}

      {/* stage 2+: the shared space */}
      <g className="ss-hub">
        <circle className="ss-hub-ring" cx={C.x} cy={C.y} r={50} />
        <circle className="ss-hub-ring ss-hub-ring--outer" cx={C.x} cy={C.y} r={72} />
        <image href="/images/brand/sinc-mark-160.webp" x={C.x - 34} y={C.y - 32} width={68} height={60} />
      </g>

      {/* the people: sparks that move closer from stage 2 */}
      {FAR.map((p, i) => (
        <g key={`n${i}`} className="ss-node" style={{
          ["--fx" as string]: `${p[0]}px`, ["--fy" as string]: `${p[1]}px`,
          ["--nx" as string]: `${NEAR[i][0]}px`, ["--ny" as string]: `${NEAR[i][1]}px`,
          transitionDelay: `${i * 60}ms`,
        }}>
          <path className="ss-tail" pathLength={1} d={TAILS[i]} />
          <circle className="ss-node-ring" r={17} />
          <circle className="ss-node-dot" r={7} />
        </g>
      ))}
    </svg>
  );
}
