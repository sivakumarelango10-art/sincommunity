import { useRef } from "react";
import { FOUNDER } from "../data/founder";
import { portrait } from "../data/team";
import { FOUNDER_PATH } from "../data/leadership";
import { SITE } from "../config/site";
import { useSectionReveal } from "../motion/hooks";
import { ProfileLinks } from "./ProfileLinks";
import { IconArrowRight } from "./ui";
import "./FounderIntro.css";

// the general portrait; the descriptively named file is kept for the founder's own profile page
const photo = (size: 480 | 800) => portrait(FOUNDER.id, size);

/** Home page: the founder, his reason for starting SINC, and a link to the full profile. */
export function FounderIntro() {
  const root = useRef<HTMLElement>(null);
  useSectionReveal(root, []);
  return (
    <section className="founder section" id="founder" ref={root} aria-labelledby="founder-title">
      <div className="founder__inner container">
        <figure className="founder__photo" data-reveal="mask">
          <img src={photo(800)} srcSet={`${photo(480)} 480w, ${photo(800)} 664w`} sizes="(min-width: 900px) 36vw, 88vw"
            width={664} height={830} loading="lazy" decoding="async" alt={FOUNDER.photoAlt} />
        </figure>
        <div className="founder__text">
          <p className="eyebrow" data-reveal>Meet the founder</p>
          <h2 id="founder-title" className="heading-xl" data-reveal><a className="founder__name-link" href={FOUNDER_PATH}>{FOUNDER.name}</a></h2>
          <p className="founder__role" data-reveal>{FOUNDER.title} · {SITE.fullName}</p>
          <p className="lead" data-reveal>{FOUNDER.bio[0]}</p>
          <blockquote className="founder__quote" data-reveal>
            <p>{FOUNDER.vision}</p>
            <footer>Elango’s vision for SINC</footer>
          </blockquote>
          <div className="founder__actions" data-reveal>
            <a className="btn" href={FOUNDER_PATH}>Read the founder profile <IconArrowRight /></a>
          </div>
          <div data-reveal><ProfileLinks links={FOUNDER.links.slice(0, 2)} person={FOUNDER.name} className="profile-links--compact" /></div>
        </div>
      </div>
    </section>
  );
}
