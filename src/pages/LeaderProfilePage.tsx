import { SITE } from "../config/site";
import { LEADERS, type Leader } from "../data/leadership";
import { portrait, portraitSrcSet } from "../data/team";
import type { RouteMeta } from "../seo/routes";
import { IconArrowRight, JoinButton } from "../components/ui";
import { PageShell } from "./PageShell";

/** Profile for a co-founder or the founding advisor: confirmed name, designation, approved photo
    and responsibilities. A verified biography appears automatically once it is added to the data. */
export function LeaderProfilePage({ route, leader }: { route: RouteMeta; leader: Leader }) {
  const m = leader.member;
  const others = LEADERS.filter((l) => l.slug !== leader.slug);
  return (
    <PageShell route={route} current="team">
      <header className="founder-hero container">
        <figure className="founder-hero__photo" data-reveal="mask">
          <img src={portrait(m.id, 800)} srcSet={portraitSrcSet(m.id)} sizes="(min-width: 900px) 40vw, 90vw"
            width={480} height={600} alt={`${m.name}, ${m.role} of SINC — ${SITE.fullName}`} fetchPriority="high" decoding="async"
            style={{ objectPosition: m.focus }} />
        </figure>
        <div className="founder-hero__text">
          <p className="eyebrow" data-reveal>{m.role}</p>
          <h1 className="page-hero__title" data-reveal>{m.name}</h1>
          <p className="founder-hero__role" data-reveal>{m.role} of SINC · {SITE.fullName}</p>
          <p className="lead" data-reveal>{leader.summary}</p>
        </div>
      </header>

      {leader.bio.length > 0 && (
        <section className="page-section container split" aria-labelledby="bio-title">
          <h2 id="bio-title" className="page-section__title" data-reveal>About {m.name}</h2>
          <div className="prose" data-reveal>{leader.bio.map((p) => <p key={p}>{p}</p>)}</div>
        </section>
      )}

      {m.responsibilities && m.responsibilities.length > 0 && (
        <section className="page-section container split" aria-labelledby="resp-title">
          <h2 id="resp-title" className="page-section__title" data-reveal>Role at SINC</h2>
          <ul className="chip-list" data-reveal>{m.responsibilities.map((r) => <li key={r}>{r}</li>)}</ul>
        </section>
      )}

      <section className="page-section container" aria-labelledby="others-title">
        <h2 id="others-title" className="page-section__title" data-reveal>SINC leadership</h2>
        <ul className="leader-mini">
          {others.map((l) => (
            <li key={l.slug} data-reveal>
              <a href={l.path}><strong>{l.member.name}</strong><span>{l.member.role}</span><IconArrowRight /></a>
            </li>
          ))}
        </ul>
        <p data-reveal><a className="text-link" href="/leadership">All of SINC’s leadership <IconArrowRight /></a></p>
      </section>

      <section className="page-cta container" aria-labelledby="leader-cta">
        <h2 id="leader-cta" className="page-cta__title" data-reveal>Build something with SINC.</h2>
        <div className="page-cta__actions" data-reveal>
          <JoinButton />
          <a className="btn btn-ghost" href="/contact">Contact SINC</a>
        </div>
      </section>
    </PageShell>
  );
}
