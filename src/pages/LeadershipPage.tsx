import { SITE } from "../config/site";
import { LEADERS } from "../data/leadership";
import { portrait, portraitSrcSet, focusClass } from "../data/team";
import type { RouteMeta } from "../seo/routes";
import { IconArrowRight, JoinButton } from "../components/ui";
import { PageHero, PageShell } from "./PageShell";

const founderPhoto = (size: 480 | 800) => portrait("elango-s", size); // profile pages keep the named files

/** The leadership directory: the four owner-confirmed leaders, each linking to a profile page. */
export function LeadershipPage({ route }: { route: RouteMeta }) {
  return (
    <PageShell route={route} current="team">
      <PageHero
        eyebrow="Leadership"
        title={<>The people leading <span className="accent">SINC.</span></>}
        lede={`${SITE.name}, the ${SITE.fullName}, was founded by Elango S. It is led by its founder, two co-founders and a founding advisor.`}
      />
      <section className="page-section container" aria-labelledby="leaders-title">
        <h2 id="leaders-title" className="group-title" data-reveal>Founder, Co-Founders and Founding Advisor</h2>
        <ul className="leader-grid">
          {LEADERS.map((l, i) => {
            const isFounder = l.member.role === "Founder";
            return (
              <li key={l.slug} className={`leader-card${isFounder ? " leader-card--founder" : ""}`} data-reveal>
                <a className="leader-card__link" href={l.path}>
                  <span className="leader-card__photo" data-reveal="mask">
                    <img
                      src={isFounder ? founderPhoto(800) : portrait(l.member.id, 800)}
                      srcSet={isFounder ? `${founderPhoto(480)} 480w, ${founderPhoto(800)} 664w` : portraitSrcSet(l.member.id)}
                      sizes={isFounder ? "(min-width: 900px) 34vw, 90vw" : "(min-width: 900px) 22vw, 46vw"}
                      width={isFounder ? 664 : 480} height={isFounder ? 830 : 600} loading={i === 0 ? "eager" : "lazy"} decoding="async"
                      alt={`${l.member.name}, ${l.member.role} of SINC — ${SITE.fullName}`} className={focusClass(l.member)} />
                  </span>
                  <span className="leader-card__body">
                    <span className="leader-card__role">{l.member.role}</span>
                    <span className="leader-card__name">{l.member.name}</span>
                    <span className="leader-card__summary">{l.summary}</span>
                    <span className="leader-card__more">View profile <IconArrowRight /></span>
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </section>
      <section className="page-cta container" aria-labelledby="leadership-cta">
        <h2 id="leadership-cta" className="page-cta__title" data-reveal>Meet everyone building SINC.</h2>
        <div className="page-cta__actions" data-reveal>
          <a className="btn" href="/team">Meet the whole team</a>
          <JoinButton />
        </div>
      </section>
    </PageShell>
  );
}
