import { LEGAL_PAGES, NAV_ITEMS, PAGES, SITE } from "../config/site";
import { useMotion, useMotionEnabled } from "../motion/MotionContext";
import { goToSection } from "./SiteHeader";
import { IconArrowUp, IconArrowUpRight, IconInstagram, IconReplay, Logo } from "./ui";
import "./SiteFooter.css";

interface FooterProps {
  /** replays the opening story (home page); other pages link back to the home page instead */
  onReplay?: (trigger: HTMLElement) => void;
  onHome?: boolean;
}

export function SiteFooter({ onReplay, onHome = true }: FooterProps) {
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
            <span className="footer__logo"><Logo size={56} alt="SINC logo" /></span>
            <div>
              <p className="footer__name">SINC</p>
              <p className="footer__full">{SITE.fullName} · {SITE.domain}</p>
            </div>
          </div>
          <div className="footer__contact">
            <p className="footer__tagline">{SITE.tagline}</p>
            <p className="footer__where">
              <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
              <span aria-hidden="true"> · </span>
              <a href="/contact">Incubated at {SITE.incubator}, {SITE.address.locality}</a>
            </p>
          </div>
        </div>

        <div className="footer__cols">
          <nav aria-label="Footer">
            <p className="footer__heading">Explore</p>
            <ul>
              {[...NAV_ITEMS, { id: "faq", label: "FAQ" }].map((n) => (
                <li key={n.id}>
                  {onHome
                    ? <a href={`#${n.id}`} onClick={(e) => { e.preventDefault(); goToSection(n.id, motion); }}>{n.label}</a>
                    : <a href={`/#${n.id}`}>{n.label}</a>}
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="SINC pages">
            <p className="footer__heading">SINC</p>
            <ul>
              {PAGES.map((pg) => <li key={pg.id}><a href={pg.path}>{pg.label}</a></li>)}
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
              <li>
                <a href={SITE.social.instagram.url} target="_blank" rel="noopener noreferrer">
                  <IconInstagram /> Instagram <span className="footer__handle">{SITE.social.instagram.handle}</span>
                  <span className="sr-only">(opens Instagram in a new tab)</span>
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className="footer__heading">Experience</p>
            <ul>
              <li>
                {onReplay
                  ? <button type="button" onClick={(e) => onReplay(e.currentTarget)}><IconReplay /> Replay our story</button>
                  : <a href="/"><IconReplay /> Home and our story</a>}
              </li>
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
          <ul className="footer__legal">
            {LEGAL_PAGES.map((pg) => <li key={pg.id}><a href={pg.path}>{pg.label}</a></li>)}
          </ul>
        </div>
      </div>
    </footer>
  );
}
