import { useCallback, useEffect, useLayoutEffect, useRef, useState, type MouseEvent } from "react";
import { NAV_ITEMS, SITE, type NavId } from "../config/site";
import { gsap, useGSAP, EASE } from "../motion/gsap";
import { lockScroll } from "../motion/hooks";
import { useMotionEnabled } from "../motion/MotionContext";
import { JoinButton, Logo, LoginLink, IconArrowUpRight } from "./ui";
import "./SiteHeader.css";

const useIsoLayout = typeof window === "undefined" ? useEffect : useLayoutEffect;

/** Scrolls to a section, accounting for the sticky header, and moves focus there for keyboard users. */
export function goToSection(id: string, smooth: boolean) {
  const target = document.getElementById(id);
  if (!target) return;
  target.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
  const heading = id === "top" ? (target.querySelector<HTMLElement>("h1") ?? target) : (target.querySelector<HTMLElement>("h2, h1") ?? target);
  heading.setAttribute("tabindex", "-1");
  heading.focus({ preventScroll: true });
  history.replaceState(null, "", `#${id}`);
}

/** Section links: in-page anchors on the home page, "/#section" from every other page. */
const sectionHref = (id: string, onHome: boolean) => (onHome ? `#${id}` : `/#${id}`);

interface HeaderProps {
  /** true on the home page (section links scroll in place and the active section is tracked) */
  onHome?: boolean;
  /** on other pages: the navigation item that matches the page */
  current?: NavId | null;
}

export function SiteHeader({ onHome = true, current = null }: HeaderProps) {
  const motion = useMotionEnabled();
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<NavId | null>(onHome ? null : current);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuTl = useRef<gsap.core.Timeline | null>(null);

  /* header treatment after scrolling */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* active section (home page only) */
  useEffect(() => {
    if (!onHome) return;
    const sections = NAV_ITEMS.map((n) => document.getElementById(n.id)).filter(Boolean) as HTMLElement[];
    const visible = new Map<string, boolean>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => visible.set(e.target.id, e.isIntersecting));
        const current = NAV_ITEMS.find((n) => visible.get(n.id));
        setActive(current ? current.id : null);
      },
      { rootMargin: "-42% 0px -52% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [onHome]);

  /* animated active-section indicator */
  const placeIndicator = useCallback(() => {
    const nav = navRef.current, ind = indicatorRef.current;
    if (!nav || !ind) return;
    const link = active ? nav.querySelector<HTMLElement>(`[data-nav="${active}"]`) : null;
    if (!link) { ind.style.opacity = "0"; return; }
    const n = nav.getBoundingClientRect(), r = link.getBoundingClientRect();
    ind.style.opacity = "1";
    ind.style.width = `${r.width}px`;
    ind.style.transform = `translateX(${r.left - n.left}px)`;
  }, [active]);
  useIsoLayout(() => { placeIndicator(); }, [placeIndicator]);
  useEffect(() => {
    window.addEventListener("resize", placeIndicator);
    document.fonts?.ready.then(placeIndicator).catch(() => {});
    return () => window.removeEventListener("resize", placeIndicator);
  }, [placeIndicator]);

  /* mobile menu: choreography, focus trap, Escape, scroll lock, focus restore */
  const { contextSafe } = useGSAP({ scope: menuRef });

  const closeMenu = useCallback((restoreFocus = true) => {
    setMenuOpen(false);
    if (restoreFocus) toggleRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    setMenuVisible(true);
    const release = lockScroll();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.preventDefault(); closeMenu(); return; }
      if (e.key !== "Tab" || !menuRef.current) return;
      const items = [toggleRef.current, ...menuRef.current.querySelectorAll<HTMLElement>("a, button")].filter(Boolean) as HTMLElement[];
      const i = items.indexOf(document.activeElement as HTMLElement);
      if (e.shiftKey && (i <= 0)) { e.preventDefault(); items[items.length - 1].focus(); }
      else if (!e.shiftKey && i === items.length - 1) { e.preventDefault(); items[0].focus(); }
    };
    document.addEventListener("keydown", onKey);
    const onResize = () => { if (window.innerWidth >= 960) closeMenu(false); };
    window.addEventListener("resize", onResize);
    return () => { release(); document.removeEventListener("keydown", onKey); window.removeEventListener("resize", onResize); };
  }, [menuOpen, closeMenu]);

  const animateMenu = contextSafe((open: boolean) => {
    const panel = menuRef.current;
    if (!panel) return;
    menuTl.current?.kill();
    if (!motion) {
      if (!open) setMenuVisible(false);
      else panel.querySelector<HTMLElement>("a")?.focus();
      return;
    }
    const links = panel.querySelectorAll(".mobile-menu__item");
    const tl = gsap.timeline();
    if (open) {
      tl.fromTo(panel, { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.55, ease: EASE.inOut })
        .fromTo(links, { y: 28, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5, ease: EASE.out, stagger: 0.07 }, "-=0.25")
        .fromTo(".mobile-menu__line", { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.8, ease: EASE.draw }, "<")
        // focus once the first link is visible (autoAlpha 0 means visibility:hidden, which can't take focus),
        // and confirm at the end in case anything interrupted it
        .add(() => panel.querySelector<HTMLElement>("a")?.focus(), 0.42)
        .eventCallback("onComplete", () => {
          if (!panel.contains(document.activeElement)) panel.querySelector<HTMLElement>("a")?.focus();
        });
    } else {
      tl.to(links, { y: -12, autoAlpha: 0, duration: 0.2, stagger: 0.03 })
        .to(panel, { clipPath: "inset(0% 0% 100% 0%)", duration: 0.4, ease: EASE.inOut }, "-=0.1")
        .add(() => setMenuVisible(false));
    }
    menuTl.current = tl;
  });

  useEffect(() => {
    if (menuOpen && menuVisible) animateMenu(true);
    else if (!menuOpen && menuVisible) animateMenu(false);
  }, [menuOpen, menuVisible]);

  const onMenuNav = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    if (!onHome) return; // a normal link to the home page section
    e.preventDefault();
    menuTl.current?.kill();
    setMenuOpen(false);
    setMenuVisible(false);
    // scroll lock is released synchronously by the effect cleanup on the next render; wait one frame
    requestAnimationFrame(() => goToSection(id, motion));
  };

  return (
    <header className={`site-header${scrolled ? " is-scrolled" : ""}${menuOpen ? " menu-open" : ""}`}>
      <div className="site-header__inner">
        <a className="brand" href={onHome ? "#top" : "/"} aria-label={onHome ? `${SITE.name} — back to top` : `${SITE.name} — home`}>
          <span className="brand__logo" data-brand-logo><Logo size={40} eager alt="SINC logo" /></span>
          <span className="brand__word">SINC</span>
        </a>

        <nav className="site-nav" aria-label="Main" ref={navRef}>
          {NAV_ITEMS.map((n) => (
            <a key={n.id} href={sectionHref(n.id, onHome)} data-nav={n.id} className={active === n.id ? "is-active" : undefined}
              aria-current={active === n.id ? (onHome ? "location" : "page") : undefined}>
              {n.label}
            </a>
          ))}
          <a href="/about" data-nav="about" className={active === "about" ? "is-active" : undefined}
            aria-current={active === "about" ? "page" : undefined}>About</a>
          <span className="site-nav__indicator" ref={indicatorRef} aria-hidden="true" />
        </nav>

        <div className="site-header__actions">
          <LoginLink className="text-link site-header__login" />
          <JoinButton small />
          <button
            ref={toggleRef}
            type="button"
            className="menu-toggle"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span className="menu-toggle__bar" /><span className="menu-toggle__bar" />
          </button>
        </div>
      </div>

      <div id="mobile-menu" ref={menuRef} className="mobile-menu" role="dialog" aria-modal="true" aria-label="Menu" hidden={!menuVisible}>
        <svg className="mobile-menu__art" viewBox="0 0 400 600" preserveAspectRatio="none" aria-hidden="true">
          <path className="mobile-menu__line" d="M-10 560 C 120 520, 140 380, 230 340 S 360 200, 410 40" />
        </svg>
        <nav aria-label="Mobile">
          <ul>
            {NAV_ITEMS.map((n, i) => (
              <li key={n.id} className="mobile-menu__item">
                <a href={sectionHref(n.id, onHome)} onClick={(e) => onMenuNav(e, n.id)}>
                  <span className="mobile-menu__num">0{i + 1}</span>{n.label}
                </a>
              </li>
            ))}
            <li className="mobile-menu__item">
              <a href="/about"><span className="mobile-menu__num">0{NAV_ITEMS.length + 1}</span>About</a>
            </li>
            <li className="mobile-menu__item mobile-menu__actions">
              <a className="btn" href={SITE.links.join} target="_blank" rel="noopener noreferrer">
                Join SINC <IconArrowUpRight /><span className="sr-only">(opens the SINC platform in a new tab)</span>
              </a>
              <LoginLink className="btn btn-ghost" />
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
