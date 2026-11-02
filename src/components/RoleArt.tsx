import type { JSX } from "react";
import type { RoleId } from "../data/content";

/**
 * One illustration per role for the "Find your place" explorer, drawn in a 160 × 160 box with the
 * SINC palette. Decorative (the panel's text says the same thing), so the svg is aria-hidden.
 */
const NAVY = "var(--navy)";
const BLUE = "var(--blue)";
const SOFT = "#dbe6ff";
const MID = "#9db8ff";

function Students() {
  return (
    <g>
      {/* open book */}
      <path d="M80 82 C 62 72, 40 70, 22 76 L22 134 C 40 128, 62 130, 80 140 Z" fill={SOFT} stroke={BLUE} strokeWidth="3" strokeLinejoin="round" />
      <path d="M80 82 C 98 72, 120 70, 138 76 L138 134 C 120 128, 98 130, 80 140 Z" fill="#fff" stroke={BLUE} strokeWidth="3" strokeLinejoin="round" />
      <path d="M80 82 V140" stroke={BLUE} strokeWidth="3" />
      {[92, 104, 116].map((y) => <path key={y} d={`M94 ${y - 2} C 106 ${y - 7}, 118 ${y - 8}, 128 ${y - 6}`} stroke={MID} strokeWidth="3" strokeLinecap="round" fill="none" />)}
      {/* graduation cap */}
      <path d="M80 20 L136 42 L80 64 L24 42 Z" fill={NAVY} />
      <path d="M50 52 V68 C 62 78, 98 78, 110 68 V52 L80 64 Z" fill={BLUE} />
      <path d="M136 42 V64" stroke={NAVY} strokeWidth="3" strokeLinecap="round" />
      <circle cx="136" cy="68" r="5" fill={BLUE} />
    </g>
  );
}

function Developers() {
  return (
    <g>
      <rect x="14" y="26" width="132" height="104" rx="14" fill={NAVY} />
      <rect x="14" y="26" width="132" height="24" rx="14" fill="#13306e" />
      <rect x="14" y="40" width="132" height="10" fill="#13306e" />
      {[30, 42, 54].map((x, i) => <circle key={x} cx={x} cy="38" r="4" fill={i === 0 ? "#6e98ff" : "#3a5aa8"} />)}
      <path d="M48 76 L34 90 L48 104" stroke="#6e98ff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M112 76 L126 90 L112 104" stroke="#6e98ff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M88 70 L72 110" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
      <rect x="34" y="114" width="40" height="6" rx="3" fill="#3a5aa8" />
      <rect x="80" y="114" width="26" height="6" rx="3" fill="#6e98ff" />
      {/* cursor */}
      <rect x="110" y="114" width="4" height="10" rx="1" fill="#fff" />
    </g>
  );
}

function Designers() {
  return (
    <g>
      <rect x="16" y="18" width="128" height="104" rx="12" fill="#fff" stroke={BLUE} strokeWidth="3" />
      <path d="M16 46 H144" stroke={SOFT} strokeWidth="2" />
      <path d="M58 18 V122" stroke={SOFT} strokeWidth="2" />
      {/* pen curve with anchors */}
      <path d="M34 104 C 52 54, 98 112, 126 44" stroke={NAVY} strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M34 104 L 50 62 M126 44 L 104 92" stroke={MID} strokeWidth="2" strokeDasharray="3 4" />
      {[[34, 104], [126, 44]].map(([x, y]) => <rect key={x} x={x - 6} y={y - 6} width="12" height="12" rx="2" fill="#fff" stroke={BLUE} strokeWidth="3" />)}
      {[[50, 62], [104, 92]].map(([x, y]) => <circle key={x} cx={x} cy={y} r="5" fill={BLUE} />)}
      {/* swatches */}
      {[NAVY, BLUE, MID, SOFT].map((c, i) => <rect key={i} x={30 + i * 28} y="132" width="20" height="20" rx="6" fill={c} stroke={i === 3 ? MID : "none"} />)}
    </g>
  );
}

function Founders() {
  return (
    <g>
      {/* launch path and milestones */}
      <path d="M18 146 C 44 140, 70 118, 92 86" stroke={MID} strokeWidth="3" strokeDasharray="4 7" fill="none" strokeLinecap="round" />
      <path d="M26 146 V116" stroke={NAVY} strokeWidth="3" strokeLinecap="round" />
      <path d="M26 116 L44 122 L26 128 Z" fill={BLUE} />
      <circle cx="60" cy="126" r="5" fill={BLUE} />
      {/* rocket */}
      <g transform="translate(-30 -8) scale(1.22) rotate(40 108 62)">
        <path d="M108 8 C 126 26, 130 56, 124 92 H92 C 86 56, 90 26, 108 8 Z" fill="#fff" stroke={NAVY} strokeWidth="3" />
        <circle cx="108" cy="46" r="10" fill={BLUE} stroke={NAVY} strokeWidth="3" />
        <path d="M92 74 L78 96 L92 92 Z M124 74 L138 96 L124 92 Z" fill={NAVY} />
        <path d="M98 94 C 100 108, 104 114, 108 120 C 112 114, 116 108, 118 94 Z" fill="#6e98ff" />
      </g>
    </g>
  );
}

function Creators() {
  return (
    <g>
      <rect x="14" y="30" width="112" height="84" rx="14" fill={NAVY} />
      <path d="M60 54 L90 72 L60 90 Z" fill="#fff" />
      <rect x="26" y="122" width="88" height="8" rx="4" fill={SOFT} />
      <rect x="26" y="122" width="52" height="8" rx="4" fill={BLUE} />
      <circle cx="78" cy="126" r="7" fill="#fff" stroke={BLUE} strokeWidth="3" />
      {/* sound waves */}
      <path d="M134 58 C 142 66, 142 78, 134 86" stroke={BLUE} strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M144 48 C 158 62, 158 82, 144 96" stroke={MID} strokeWidth="4" fill="none" strokeLinecap="round" />
      {/* sparkle */}
      <path d="M128 14 L132 24 L142 28 L132 32 L128 42 L124 32 L114 28 L124 24 Z" fill={BLUE} />
    </g>
  );
}

function Researchers() {
  return (
    <g>
      {/* chart */}
      <path d="M18 18 V128 H146" stroke={MID} strokeWidth="3" fill="none" strokeLinecap="round" />
      {[[36, 108], [52, 96], [66, 100], [80, 82], [96, 74], [112, 58]].map(([x, y]) => <circle key={x} cx={x} cy={y} r="5" fill={BLUE} />)}
      <path d="M30 112 L118 52" stroke={NAVY} strokeWidth="2.5" strokeDasharray="5 5" />
      {/* magnifier */}
      <circle cx="104" cy="66" r="26" fill="rgba(219,230,255,0.55)" stroke={NAVY} strokeWidth="5" />
      <path d="M123 85 L142 104" stroke={NAVY} strokeWidth="8" strokeLinecap="round" />
      {/* flask */}
      <path d="M36 24 H58 M41 24 V52 L24 86 C 20 94, 26 100, 34 100 H60 C 68 100, 74 94, 70 86 L53 52 V24" fill="#fff" stroke={NAVY} strokeWidth="3" strokeLinejoin="round" />
      <path d="M30 80 H64 L69 89 C 71 94, 67 97, 62 97 H32 C 27 97, 23 94, 25 89 Z" fill={BLUE} />
      <circle cx="44" cy="70" r="3.5" fill={BLUE} />
      <circle cx="52" cy="62" r="2.5" fill={MID} />
    </g>
  );
}

function Freelancers() {
  const peers = [[22, 34], [138, 34], [22, 132], [138, 132]];
  return (
    <g>
      {peers.map(([x, y]) => <path key={`${x}${y}`} d={`M80 86 L${x} ${y}`} stroke={MID} strokeWidth="3" strokeDasharray="4 6" />)}
      {peers.map(([x, y]) => (
        <g key={`p${x}${y}`}>
          <circle cx={x} cy={y} r="14" fill="#fff" stroke={BLUE} strokeWidth="3" />
          <circle cx={x} cy={y - 3} r="4.5" fill={BLUE} />
          <path d={`M${x - 7} ${y + 8} C ${x - 6} ${y + 1}, ${x + 6} ${y + 1}, ${x + 7} ${y + 8}`} fill={BLUE} />
        </g>
      ))}
      {/* briefcase */}
      <path d="M66 62 V54 C 66 50, 68 48, 72 48 H88 C 92 48, 94 50, 94 54 V62" stroke={NAVY} strokeWidth="5" fill="none" />
      <rect x="44" y="62" width="72" height="54" rx="10" fill={NAVY} />
      <path d="M44 84 H116" stroke="#13306e" strokeWidth="4" />
      <rect x="72" y="78" width="16" height="12" rx="3" fill="#6e98ff" />
    </g>
  );
}

function AIEngineers() {
  const layers = [[30, [40, 80, 120]], [80, [28, 62, 98, 132]], [130, [56, 104]]] as const;
  const links: string[] = [];
  for (let l = 0; l < layers.length - 1; l++)
    for (const a of layers[l][1]) for (const b of layers[l + 1][1]) links.push(`M${layers[l][0]} ${a} L${layers[l + 1][0]} ${b}`);
  return (
    <g>
      {links.map((d) => <path key={d} d={d} stroke={MID} strokeWidth="2" />)}
      {layers.map(([x, ys], l) => ys.map((y) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r={l === 1 ? 10 : 11} fill={l === 1 ? BLUE : "#fff"} stroke={l === 1 ? BLUE : NAVY} strokeWidth="3" />
      )))}
      {/* chip */}
      <rect x="62" y="0" width="36" height="18" rx="5" fill={NAVY} />
      <text x="80" y="13" textAnchor="middle" fontSize="11" fontWeight="800" fill="#fff" fontFamily="var(--font-body)">AI</text>
      {/* spark on the output */}
      <circle cx="130" cy="56" r="16" fill="none" stroke="#6e98ff" strokeWidth="2" strokeDasharray="3 4" />
    </g>
  );
}

const ART: Record<RoleId, () => JSX.Element> = {
  students: Students,
  developers: Developers,
  designers: Designers,
  founders: Founders,
  creators: Creators,
  researchers: Researchers,
  freelancers: Freelancers,
  "ai-engineers": AIEngineers,
};

/** chip anchor points in the 520 × 400 scene (mirrored in CommunityExplorer.css) */
const C = { x: 260, y: 184, r: 96 };
/*
 * Three branches 120° apart. Each visible line is the same length (LINE): it starts just outside
 * the disc and stops at the edge of its label, so labels sit further out on the angled branches,
 * where a wide pill is cut at an angle, than on the straight one below.
 */
const START = C.r + 8, LINE = 58;
const BRANCHES = [{ a: -150, edge: 46 }, { a: -30, edge: 46 }, { a: 90, edge: 24 }];
const rad = (a: number) => (a * Math.PI) / 180;
export const CHIP_POINTS = BRANCHES.map(({ a, edge }) => {
  const r = START + LINE + edge;
  return [+(C.x + r * Math.cos(rad(a))).toFixed(1), +(C.y + r * Math.sin(rad(a))).toFixed(1)];
});

/** the scene: the role's illustration in a soft disc, linked to three people or places */
export function RoleScene({ role, label, intent }: { role: RoleId; label: string; intent: string }) {
  const Art = ART[role];
  return (
    <svg className="explorer__art" viewBox="0 0 520 400" aria-hidden="true" data-intent={intent}>
      <circle className="explorer__orbit" cx={C.x} cy={C.y} r={START + LINE / 2} />
      {BRANCHES.map(({ a }, i) => {
        const cx = Math.cos(rad(a)), cy = Math.sin(rad(a));
        const d = `M${(C.x + cx * START).toFixed(1)} ${(C.y + cy * START).toFixed(1)} L${(C.x + cx * (START + LINE)).toFixed(1)} ${(C.y + cy * (START + LINE)).toFixed(1)}`;
        return <path key={i} className="explorer__link" d={d} />;
      })}
      <g className="explorer__center">
        <circle cx={C.x} cy={C.y} r={C.r} className="explorer__center-disc" />
        <g transform={`translate(${C.x - 64} ${C.y - 82}) scale(0.8)`}><Art /></g>
        <rect x={C.x - 60} y={C.y + 52} width="120" height="28" rx="14" className="explorer__center-pill" />
        <text x={C.x} y={C.y + 71} textAnchor="middle" className="explorer__center-label">{label}</text>
      </g>
    </svg>
  );
}
