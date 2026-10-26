import { useRef, useState, type KeyboardEvent } from "react";
import { INTENTS, ROLES, type IntentId, type RoleId } from "../data/content";
import { gsap, useGSAP, EASE } from "../motion/gsap";
import { useMotionEnabled } from "../motion/MotionContext";
import { useSectionReveal } from "../motion/hooks";
import { JoinButton } from "./ui";
import "./CommunityExplorer.css";

/** Illustration: the chosen role at the centre, connected to three complementary strengths. */
function RoleConnections({ role, intent }: { role: string; intent: IntentId }) {
  const spots = [[90, 78], [420, 92], [300, 330]];
  return (
    <svg className="explorer__art" viewBox="0 0 520 400" aria-hidden="true" data-intent={intent}>
      <circle className="explorer__orbit" cx="250" cy="200" r="150" />
      {spots.map(([x, y], i) => (
        <path key={i} className="explorer__link" d={`M250 200 Q ${(250 + x) / 2 + (i - 1) * 40} ${(200 + y) / 2 - 40} ${x} ${y}`} />
      ))}
      <g className="explorer__center">
        <circle cx="250" cy="200" r="64" className="explorer__center-disc" />
        <text x="250" y="206" textAnchor="middle" className="explorer__center-label">{role}</text>
      </g>
    </svg>
  );
}

export function CommunityExplorer() {
  const motion = useMotionEnabled();
  const root = useRef<HTMLElement>(null);
  const [roleId, setRoleId] = useState<RoleId>("developers");
  const [intentId, setIntentId] = useState<IntentId>("build");
  const lastIndex = useRef(1);
  const role = ROLES.find((r) => r.id === roleId)!;
  const intent = INTENTS.find((i) => i.id === intentId)!;
  useSectionReveal(root, []);

  // restrained directional crossfade on every change; focus stays on the control the visitor used
  useGSAP(() => {
    if (!motion || !root.current) return;
    const index = ROLES.findIndex((r) => r.id === roleId);
    const dir = index >= lastIndex.current ? 1 : -1;
    lastIndex.current = index;
    const q = gsap.utils.selector(root);
    gsap.fromTo(q(".explorer__swap"), { autoAlpha: 0, x: 18 * dir }, { autoAlpha: 1, x: 0, duration: 0.45, ease: EASE.out, stagger: 0.05, overwrite: true });
    gsap.fromTo(q(".explorer__link"), { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.7, ease: EASE.draw, stagger: 0.08, overwrite: true });
    gsap.fromTo(q(".explorer__node"), { scale: 0.7, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.5, ease: "back.out(2)", stagger: 0.08, delay: 0.2, overwrite: true });
    gsap.fromTo(q(".explorer__center"), { scale: 0.85 }, { scale: 1, duration: 0.5, ease: "back.out(2.4)", transformOrigin: "50% 50%", overwrite: true });
  }, { scope: root, dependencies: [roleId, intentId, motion] });

  /* roving focus for the role tabs (arrow keys, Home, End) */
  const onRoleKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const keys: Record<string, number> = { ArrowRight: i + 1, ArrowDown: i + 1, ArrowLeft: i - 1, ArrowUp: i - 1, Home: 0, End: ROLES.length - 1 };
    if (!(e.key in keys)) return;
    e.preventDefault();
    const next = (keys[e.key] + ROLES.length) % ROLES.length;
    setRoleId(ROLES[next].id);
    root.current?.querySelector<HTMLButtonElement>(`#role-tab-${ROLES[next].id}`)?.focus();
  };

  return (
    <section className="explorer section" id="for-you" ref={root} aria-labelledby="explorer-title">
      <div className="container">
        <div className="explorer__head">
          <p className="eyebrow" data-reveal>For you</p>
          <h2 id="explorer-title" className="heading-xl" data-reveal>Find your place.</h2>
          <p className="lead" data-reveal>Choose who you are and what you are looking for, and see how SINC can fit around your ambition.</p>
        </div>

        <div className="explorer__ui" data-reveal>
          <div className="explorer__roles" role="tablist" aria-label="I am one of these">
            {ROLES.map((r, i) => (
              <button key={r.id} id={`role-tab-${r.id}`} type="button" role="tab"
                aria-selected={r.id === roleId} aria-controls="explorer-panel" tabIndex={r.id === roleId ? 0 : -1}
                className="explorer__role" onClick={() => setRoleId(r.id)} onKeyDown={(e) => onRoleKey(e, i)}>
                {r.label}
              </button>
            ))}
          </div>

          <div className="explorer__intents" role="group" aria-label="I want to">
            <span className="explorer__intents-label">I want to</span>
            {INTENTS.map((it) => (
              <button key={it.id} type="button" className="explorer__intent" aria-pressed={it.id === intentId} onClick={() => setIntentId(it.id)}>
                {it.label}
              </button>
            ))}
          </div>

          <div className="explorer__panel" id="explorer-panel" role="tabpanel" aria-labelledby={`role-tab-${roleId}`} aria-live="polite">
            <div className="explorer__copy">
              <p className="explorer__for explorer__swap">For {role.label.toLowerCase()} who want to {intent.label.toLowerCase()}</p>
              <h3 className="explorer__headline explorer__swap">{role.headline}</h3>
              <p className="explorer__desc explorer__swap">{role.description}</p>
              <ul className="explorer__list explorer__swap">
                {intent.possibilities.map((p) => <li key={p}>{p}</li>)}
              </ul>
              <div className="explorer__cta explorer__swap">
                <JoinButton>{`Join SINC as a ${role.singular}`}</JoinButton>
              </div>
              <p className="explorer__note">These are examples of what the community makes possible, not live matches or guaranteed outcomes.</p>
            </div>
            <div className="explorer__visual">
              <RoleConnections role={role.label} intent={intentId} />
              <ul className="explorer__nodes" aria-label={`People ${role.label.toLowerCase()} often connect with`}>
                {role.connects.map((c, i) => <li key={c} className={`explorer__node explorer__node--${i + 1}`}>{c}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
