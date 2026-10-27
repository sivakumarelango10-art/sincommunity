import { useRef } from "react";
import { gsap, useGSAP, EASE } from "../motion/gsap";
import { useDeferredMotion } from "../motion/MotionContext";
import { JoinButton, LoginLink, Logo } from "./ui";
import "./JoinSection.css";

/** The motif resolves: three paths arrive from different directions and meet at the logo. */
export function JoinSection() {
  const motion = useDeferredMotion(); // built after the first paint
  const root = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (!motion || !root.current) return;
    const el = root.current;
    const q = gsap.utils.selector(el);
    gsap.fromTo(el.querySelector(".join__bg"), { clipPath: "inset(8% 5% 0% 5% round 64px)" }, {
      clipPath: "inset(0% 0% 0% 0% round 0px)", ease: "none",
      scrollTrigger: { trigger: el, start: "top 95%", end: "top 30%", scrub: true },
    });
    gsap.fromTo(q(".join__path"), { drawSVG: "0%" }, {
      drawSVG: "100%", ease: "none", stagger: 0.08,
      scrollTrigger: { trigger: el, start: "top 70%", end: "center 55%", scrub: 0.6 },
    });
    if (el.getBoundingClientRect().top < window.innerHeight * 0.45) return; // already on screen: leave it as it is
    const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 45%", toggleActions: "play none none none" } });
    tl.from(q(".join__badge"), { scale: 0.4, autoAlpha: 0, duration: 1, ease: "back.out(1.7)" })
      .fromTo(q(".join__pulse"), { scale: 1, autoAlpha: 0.6 }, { scale: 2.4, autoAlpha: 0, duration: 1.6, ease: "power2.out" }, "-=0.5")
      .from(q(".join__title-line"), { yPercent: 110, duration: 1, ease: EASE.out, stagger: 0.1 }, "-=1.4")
      .from(q(".join__sub, .join__actions"), { y: 20, opacity: 0, duration: 0.8, ease: EASE.out, stagger: 0.1 }, "-=0.7");
  }, { scope: root, dependencies: [motion], revertOnUpdate: true });

  return (
    <section className="join on-dark" id="join" ref={root} aria-labelledby="join-title">
      <div className="join__bg" aria-hidden="true" />
      <div className="join__inner container">
        <div className="join__anchor">
          {/* (720, 300) in this drawing is the centre of the badge, at every screen size */}
          <svg className="join__art" viewBox="0 0 1440 800" aria-hidden="true">
            <path className="join__path" d="M-40 130 C 260 130, 430 300, 610 300 S 700 300, 720 300" />
            <path className="join__path" d="M1480 70 C 1200 110, 1050 300, 850 300 S 740 300, 720 300" />
            <path className="join__path" d="M1480 790 C 1380 430, 1010 300, 830 300 S 740 300, 720 300" />
            <circle className="join__orbit" cx="720" cy="300" r="150" />
          </svg>
          <div className="join__badge">
            <span className="join__pulse" aria-hidden="true" />
            <Logo size={120} alt="SINC logo" />
          </div>
        </div>
        <h2 id="join-title" className="join__title">
          <span className="join__mask"><span className="join__title-line">Your ambition deserves</span></span>
          <span className="join__mask"><span className="join__title-line">good company.</span></span>
        </h2>
        <p className="join__sub">Bring your ideas. Bring your skills. Find your people.</p>
        <div className="join__actions">
          <JoinButton variant="white" />
          <LoginLink className="text-link join__login">Already a member? Log In</LoginLink>
        </div>
      </div>
    </section>
  );
}
