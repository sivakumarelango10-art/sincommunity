import { useEffect, useRef, useState } from "react";
import { TEAM, portrait, portraitSrcSet, type TeamMember } from "../data/team";
import { gsap, useGSAP, EASE } from "../motion/gsap";
import { useMotionEnabled } from "../motion/MotionContext";
import { lockScroll, useSectionReveal } from "../motion/hooks";
import { IconClose } from "./ui";
import "./Team.css";

function Card({ m, size, onOpen }: { m: TeamMember; size: "lead" | "co" | "advisor" | "team"; onOpen: (m: TeamMember, el: HTMLElement) => void }) {
  return (
    <figure className={`member member--${size}`}>
      <button type="button" className="member__photo" data-reveal="mask" aria-haspopup="dialog"
        aria-label={`View a larger photo of ${m.name}, ${m.role}`} onClick={(e) => onOpen(m, e.currentTarget)}>
        <img src={portrait(m.id, size === "lead" ? 800 : 480)} srcSet={portraitSrcSet(m.id)}
          sizes={size === "lead" ? "(min-width: 960px) 38vw, 92vw" : "(min-width: 960px) 22vw, 46vw"}
          width={480} height={600} loading="lazy" decoding="async" alt="" style={{ objectPosition: m.focus }} />
      </button>
      <figcaption className="member__caption" data-reveal>
        <h3 className="member__name">{m.name}</h3>
        <p className="member__role">{m.role}</p>
      </figcaption>
    </figure>
  );
}

function PortraitViewer({ member, onClose }: { member: TeamMember | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const motion = useMotionEnabled();

  useEffect(() => {
    const d = ref.current;
    if (!d || !member) return;
    d.showModal();
    const release = lockScroll();
    if (motion) {
      gsap.fromTo(d.querySelector(".viewer__card"), { y: 40, autoAlpha: 0, scale: 0.97 }, { y: 0, autoAlpha: 1, scale: 1, duration: 0.5, ease: EASE.out });
      gsap.fromTo(d.querySelector(".viewer__photo img"), { scale: 1.12 }, { scale: 1, duration: 0.9, ease: EASE.out });
    }
    return () => { release(); if (d.open) d.close(); };
  }, [member, motion]);

  return (
    <dialog ref={ref} className="viewer" aria-labelledby="viewer-name"
      onCancel={(e) => { e.preventDefault(); onClose(); }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      {member && (
        <div className="viewer__card">
          <div className="viewer__photo">
            <img src={portrait(member.id, 800)} width={800} height={1000} alt={`${member.name}, ${member.role} at SINC`} style={{ objectPosition: member.focus }} />
          </div>
          <div className="viewer__info">
            <h2 id="viewer-name" className="viewer__name">{member.name}</h2>
            <p className="viewer__role">{member.role}</p>
          </div>
          <button type="button" className="viewer__close" onClick={onClose} aria-label="Close photo" autoFocus>
            <IconClose />
          </button>
        </div>
      )}
    </dialog>
  );
}

export function Team() {
  const motion = useMotionEnabled();
  const root = useRef<HTMLElement>(null);
  const [viewing, setViewing] = useState<TeamMember | null>(null);
  const returnTo = useRef<HTMLElement | null>(null);
  useSectionReveal(root, []);

  const founding = TEAM.filter((m) => m.group === "founding");
  const advisors = TEAM.filter((m) => m.group === "advisor");
  const team = TEAM.filter((m) => m.group === "team");

  /* subtle image drift + the connecting line through the founding team */
  useGSAP(() => {
    if (!motion || !root.current) return;
    const q = gsap.utils.selector(root);
    q(".member__photo img").forEach((img: Element, i: number) => {
      gsap.fromTo(img, { yPercent: -4 }, {
        yPercent: 4, ease: "none",
        scrollTrigger: { trigger: img.parentElement, start: "top bottom", end: "bottom top", scrub: 0.6 + (i % 3) * 0.2 },
      });
    });
    gsap.fromTo(q(".team__thread path"), { drawSVG: "0%" }, {
      drawSVG: "100%", ease: "none",
      scrollTrigger: { trigger: q(".team__founding")[0], start: "top 75%", end: "bottom 60%", scrub: 0.6 },
    });
  }, { scope: root, dependencies: [motion], revertOnUpdate: true });

  const open = (m: TeamMember, el: HTMLElement) => { returnTo.current = el; setViewing(m); };
  const close = () => { setViewing(null); requestAnimationFrame(() => returnTo.current?.focus()); };

  return (
    <section className="team section" id="team" ref={root} aria-labelledby="team-title">
      <div className="container">
        <div className="team__head">
          <p className="eyebrow" data-reveal>Our team</p>
          <h2 id="team-title" className="heading-xl" data-reveal>The people building SINC.</h2>
          <p className="lead" data-reveal>Different strengths. One shared belief.</p>
        </div>

        <div className="team__founding" data-draw-trigger>
          {/* runs behind the portraits; only the stretches between them show */}
          <svg className="team__thread" viewBox="0 0 1200 830" preserveAspectRatio="none" aria-hidden="true">
            <path d="M-30 540 C 120 480, 200 400, 300 380 S 560 240, 750 230 S 960 300, 1050 295 S 1180 200, 1240 150" />
          </svg>
          <p className="team__group-label" data-reveal>Founding team</p>
          <div className="team__founding-grid">
            <Card m={founding[0]} size="lead" onOpen={open} />
            {founding.slice(1).map((m) => <Card key={m.id} m={m} size="co" onOpen={open} />)}
            {advisors.map((m) => <Card key={m.id} m={m} size="advisor" onOpen={open} />)}
          </div>
        </div>

        <p className="team__group-label team__group-label--team" data-reveal>Team</p>
        <div className="team__grid">
          {team.map((m) => <Card key={m.id} m={m} size="team" onOpen={open} />)}
        </div>
      </div>
      <PortraitViewer member={viewing} onClose={close} />
    </section>
  );
}
