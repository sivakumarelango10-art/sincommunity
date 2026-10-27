import { useCallback, useEffect, useRef, useState } from "react";
import { STORAGE_KEYS } from "./config/site";
import { MotionProvider, onScenesReady, useMotionEnabled } from "./motion/MotionContext";
import { safeStorage } from "./motion/storage";
import { SiteHeader, goToSection } from "./components/SiteHeader";
import { Hero } from "./components/Hero";
import { StoryJourney } from "./components/StoryJourney";
import { CommunityExplorer } from "./components/CommunityExplorer";
import { Ecosystem } from "./components/Ecosystem";
import { MissionValues } from "./components/MissionValues";
import { Team } from "./components/Team";
import { FAQ } from "./components/FAQ";
import { JoinSection } from "./components/JoinSection";
import { SiteFooter } from "./components/SiteFooter";
import { IntroStory, type IntroCloseReason } from "./components/IntroStory";
import { ScrollProgress } from "./components/ScrollProgress";
import { FounderIntro } from "./components/FounderIntro";
import { routeByPath, type RouteMeta } from "./seo/routes";
import { AboutPage } from "./pages/AboutPage";
import { FounderPage } from "./pages/FounderPage";
import { LeadershipPage } from "./pages/LeadershipPage";
import { LeaderProfilePage } from "./pages/LeaderProfilePage";
import { LEADERS } from "./data/leadership";
import { TeamPage } from "./pages/TeamPage";
import { ContactPage } from "./pages/ContactPage";
import { NotFoundPage, PrivacyPage, TermsPage } from "./pages/LegalPages";

function HomePage() {
  const motion = useMotionEnabled();
  const [introOpen, setIntroOpen] = useState(false);
  const [heroEntrance, setHeroEntrance] = useState<"wait" | "go">("wait");
  const [fromIntro, setFromIntro] = useState(false);
  const opener = useRef<HTMLElement | null>(null);

  /* first visit → full story (decided before paint by the inline script); otherwise a short inline entrance */
  useEffect(() => {
    const pending = document.documentElement.classList.contains("intro-pending");
    if (pending) {
      safeStorage.set(STORAGE_KEYS.introSeen, "1"); // a refresh mid-story will not force it again
      setFromIntro(true);
      setIntroOpen(true);
    } else {
      setHeroEntrance("go");
    }
  }, []);

  /* arriving with a section in the address (e.g. /#team from another page): go there once the
     scroll scenes have laid out, so the pinned story's extra height is accounted for */
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id || !document.getElementById(id)) return;
    return onScenesReady(() => goToSection(id, false));
  }, []);

  /* every in-page link: smooth only when motion is on, offset for the sticky header, focus follows */
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element).closest?.("a[href^='#']") as HTMLAnchorElement | null;
      const id = a?.getAttribute("href")?.slice(1);
      if (!a || !id || !document.getElementById(id)) return;
      e.preventDefault();
      goToSection(id, motion);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [motion]);

  const watchStory = useCallback((trigger: HTMLElement) => {
    opener.current = trigger;
    setIntroOpen(true);
  }, []);

  const onHandoff = useCallback(() => setHeroEntrance("go"), []);

  const onClose = useCallback((_reason: IntroCloseReason) => {
    setIntroOpen(false);
    document.documentElement.classList.remove("intro-pending");
    // return focus to whatever opened the story (the page start after an automatic first-visit story)
    const back = opener.current;
    opener.current = null;
    requestAnimationFrame(() => {
      if (back && document.contains(back)) back.focus({ preventScroll: true });
      else (document.activeElement as HTMLElement | null)?.blur(); // automatic story: the next Tab starts at the top of the page
    });
  }, []);

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <ScrollProgress />
      <SiteHeader />
      <main id="main" tabIndex={-1}>
        <Hero entrance={heroEntrance} fromIntro={fromIntro} onWatchStory={watchStory} />
        <StoryJourney />
        <CommunityExplorer />
        <Ecosystem />
        <MissionValues />
        <FounderIntro />
        <Team />
        <FAQ />
        <JoinSection />
      </main>
      <SiteFooter onReplay={watchStory} />
      <IntroStory open={introOpen} onHandoff={onHandoff} onClose={onClose} />
    </>
  );
}

function RoutePage({ route }: { route: RouteMeta }) {
  switch (route.id) {
    case "home": return <HomePage />;
    case "about": return <AboutPage route={route} />;
    case "leadership": return <LeadershipPage route={route} />;
    case "leader": {
      const leader = LEADERS.find((l) => l.slug === route.leaderSlug)!;
      return leader.member.role === "Founder" ? <FounderPage route={route} /> : <LeaderProfilePage route={route} leader={leader} />;
    }
    case "team": return <TeamPage route={route} />;
    case "contact": return <ContactPage route={route} />;
    case "privacy": return <PrivacyPage route={route} />;
    case "terms": return <TermsPage route={route} />;
    default: return <NotFoundPage route={route} />;
  }
}

/** One app for every page; the URL path picks the page (each is prerendered to its own HTML file). */
export default function App({ path }: { path: string }) {
  return (
    <MotionProvider>
      <RoutePage route={routeByPath(path)} />
    </MotionProvider>
  );
}
