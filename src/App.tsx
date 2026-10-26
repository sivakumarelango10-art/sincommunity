import { useCallback, useEffect, useRef, useState } from "react";
import { STORAGE_KEYS } from "./config/site";
import { MotionProvider, useMotionEnabled } from "./motion/MotionContext";
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

function Page() {
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
        <Team />
        <FAQ />
        <JoinSection />
      </main>
      <SiteFooter onReplay={watchStory} />
      <IntroStory open={introOpen} onHandoff={onHandoff} onClose={onClose} />
    </>
  );
}

export default function App() {
  return (
    <MotionProvider>
      <Page />
    </MotionProvider>
  );
}
