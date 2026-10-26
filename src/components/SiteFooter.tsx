import { NAV_ITEMS, SITE } from "../config/site";
import { useMotion, useMotionEnabled } from "../motion/MotionContext";
import { goToSection } from "./SiteHeader";
import { IconArrowUp, IconArrowUpRight, IconReplay, Logo } from "./ui";
import "./SiteFooter.css";

export function SiteFooter({ onReplay }: { onReplay: (trigger: HTMLElement) => void }) {
  const { toggle, enabled, systemReduced } = useMotion();   // hydration-safe value for the visible label
  const motion = useMotionEnabled();          // effect-safe value for behaviour

  const toTop = () => {
    window.scrollTo({ top: 0, behavior: motion ? "smooth" : "auto" });
    document.querySelector<HTMLElement>(".brand")?.focus({ preventScroll: true });
  };

  return (
    <footer className="footer on-dark">
      <div className="container">
        <div className="footer__top">
          <div className="footer__brand">
            <span className="footer__logo"><Logo size={56} /></span>
            <div>
              <p className="footer__name">SINC</p>
              <p className="footer__full">{SITE.fullName}</p>
            </div>
          </div>
          <p className="footer__tagline">{SITE.tagline}</p>
        </div>

        <div className="footer__cols">
          <nav aria-label="Footer">
            <p className="footer__heading">Explore</p>
            <ul>
              {NAV_ITEMS.map((n) => (
                <li key={n.id}>
                  <a href={`#${n.id}`} onClick={(e) => { e.preventDefault(); goToSection(n.id, motion); }}>{n.label}</a>
                </li>
              ))}
              <li><a href="#faq" onClick={(e) => { e.preventDefault(); goToSection("faq", motion); }}>FAQ</a></li>
            </ul>
          </nav>
          <div>
            <p className="footer__heading">Community</p>
            <ul>
              <li>
                <a href={SITE.links.login} target="_blank" rel="noopener noreferrer">
                  Log In / Enter SINC <IconArrowUpRight /><span className="sr-only">(opens the SINC platform in a new tab)</span>
                </a>
              </li>
              <li>
                <a href={SITE.links.join} target="_blank" rel="noopener noreferrer">
                  Join SINC <IconArrowUpRight /><span className="sr-only">(opens the SINC platform in a new tab)</span>
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className="footer__heading">Experience</p>
            <ul>
              <li><button type="button" onClick={(e) => onReplay(e.currentTarget)}><IconReplay /> Replay our story</button></li>
              <li>
                <button type="button" role="switch" aria-checked={enabled} onClick={toggle}>
                  <span className={`footer__switch${enabled ? " is-on" : ""}`} aria-hidden="true"><i /></span>
                  Motion {enabled ? "on" : "off"}
                </button>
                {!enabled && systemReduced && (
                  <p className="footer__note">Off because this device is set to reduce motion. Switch it on to see the animations.</p>
                )}
              </li>
              <li><button type="button" onClick={toTop}><IconArrowUp /> Back to top</button></li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <p>© <span suppressHydrationWarning>{new Date().getFullYear()}</span> SINC — {SITE.fullName}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
