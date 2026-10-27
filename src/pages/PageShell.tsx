import { useEffect, useRef, type ReactNode } from "react";
import type { NavId } from "../config/site";
import { crumbTrail, type RouteMeta } from "../seo/routes";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { useSectionReveal } from "../motion/hooks";
import { gsap, useGSAP, EASE } from "../motion/gsap";
import { useMotionEnabled } from "../motion/MotionContext";
import "./pages.css";

/** Layout for every page except home: header, breadcrumb, content, footer. */
export function PageShell({ route, current = null, children }: { route: RouteMeta; current?: NavId | null; children: ReactNode }) {
  const main = useRef<HTMLElement>(null);
  const motion = useMotionEnabled();
  useSectionReveal(main, [route.id]);
  // the page's opening line draws itself once, as the page arrives
  useGSAP(() => {
    if (!motion) return;
    gsap.fromTo(".page-hero__line path", { drawSVG: "0%" }, { drawSVG: "100%", duration: 1.6, ease: EASE.draw, delay: 0.25 });
  }, { scope: main, dependencies: [motion, route.id], revertOnUpdate: true });
  // production pages already carry their title; this keeps the development server in step
  useEffect(() => { document.title = route.title; }, [route.title]);

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <SiteHeader onHome={false} current={current} />
      <main id="main" tabIndex={-1} className={`page page--${route.id}`} ref={main}>
        {route.crumb && (
          <nav className="crumbs container" aria-label="Breadcrumb">
            <ol>
              {crumbTrail(route).map((c, i, all) => i < all.length - 1
                ? <li key={c.path}><a href={c.path}>{c.name}</a></li>
                : <li key={c.path} aria-current="page">{c.name}</li>)}
            </ol>
          </nav>
        )}
        {children}
      </main>
      <SiteFooter onHome={false} />
    </>
  );
}

/** Page opening: eyebrow, the page's single h1, and an optional lead paragraph. */
export function PageHero({ eyebrow, title, lede, children }: { eyebrow: string; title: ReactNode; lede?: ReactNode; children?: ReactNode }) {
  return (
    <header className="page-hero container">
      <p className="eyebrow" data-reveal>{eyebrow}</p>
      <h1 className="page-hero__title" data-reveal>{title}</h1>
      {lede && <p className="page-hero__lede lead" data-reveal>{lede}</p>}
      {children}
      <svg className="page-hero__line" viewBox="0 0 1200 40" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 30 C 220 30, 300 8, 520 10 S 860 34, 1200 12" />
      </svg>
    </header>
  );
}
