import { SITE } from "../config/site";
import { FOUNDER } from "../data/founder";
import type { RouteMeta } from "../seo/routes";
import { ProfileLinks } from "../components/ProfileLinks";
import { IconArrowRight, JoinButton } from "../components/ui";
import { LEADERS } from "../data/leadership";
import { LeaderPhoto } from "../components/LeaderPhoto";
import { PageShell } from "./PageShell";


export function FounderPage({ route }: { route: RouteMeta }) {
  const extra = [
    { id: "education", title: "Education", items: FOUNDER.education },
    { id: "achievements", title: "Achievements", items: FOUNDER.achievements },
  ].filter((s) => s.items.length > 0);

  return (
    <PageShell route={route} current="team">
      <header className="founder-hero container">
        <LeaderPhoto leader={LEADERS[0]} />
        <div className="founder-hero__text">
          <p className="eyebrow" data-reveal>Founder</p>
          <h1 className="page-hero__title" data-reveal>{FOUNDER.name}<span className="page-hero__title-role"> — Founder of SINC</span></h1>
          <p className="founder-hero__role" data-reveal>{SITE.name} — {SITE.fullName} · {FOUNDER.headline}</p>
          <p className="lead" data-reveal>{FOUNDER.intro}</p>
          <div data-reveal><ProfileLinks links={FOUNDER.links} person={FOUNDER.name} /></div>
        </div>
      </header>

      <section className="page-section container split" aria-labelledby="about-founder">
        <h2 id="about-founder" className="page-section__title" data-reveal>About Elango</h2>
        <div className="prose" data-reveal>
          {FOUNDER.bio.map((p) => <p key={p}>{p}</p>)}
        </div>
      </section>

      <section className="page-section container split" aria-labelledby="why-title">
        <h2 id="why-title" className="page-section__title" data-reveal>Why SINC was created</h2>
        <div className="prose" data-reveal>
          <p>{FOUNDER.why}</p>
          <p>{SITE.belief}</p>
        </div>
      </section>

      <section className="page-section container" aria-labelledby="vision-title">
        <h2 id="vision-title" className="page-kicker" data-reveal>Founder’s vision</h2>
        <blockquote className="statement founder-quote" data-reveal>
          <p>{FOUNDER.vision}</p>
        </blockquote>
      </section>

      <section className="page-section container split" aria-labelledby="leads-title">
        <h2 id="leads-title" className="page-section__title" data-reveal>What Elango leads at SINC</h2>
        <ul className="chip-list" data-reveal>
          {FOUNDER.responsibilities.map((r) => <li key={r}>{r}</li>)}
        </ul>
      </section>

      {extra.map((s) => (
        <section key={s.id} className="page-section container split" aria-labelledby={`${s.id}-title`}>
          <h2 id={`${s.id}-title`} className="page-section__title" data-reveal>{s.title}</h2>
          <ul className="prose prose-list" data-reveal>{s.items.map((i) => <li key={i}>{i}</li>)}</ul>
        </section>
      ))}

      {FOUNDER.projects.length > 0 && (
        <section className="page-section container" aria-labelledby="projects-title">
          <h2 id="projects-title" className="page-section__title" data-reveal>Projects Elango has built</h2>
          <ul className="project-grid">
            {FOUNDER.projects.map((p) => (
              <li key={p.name} className="project-card" data-reveal>
                <h3>{p.name}</h3>
                <p>{p.text}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {FOUNDER.skills.length > 0 && (
        <section className="page-section container split" aria-labelledby="skills-title">
          <h2 id="skills-title" className="page-section__title" data-reveal>Skills</h2>
          <div data-reveal>
            <ul className="chip-list chip-list--quiet">{FOUNDER.skills.map((k) => <li key={k}>{k}</li>)}</ul>
            {FOUNDER.languages.length > 0 && <p className="founder-langs">Languages: {FOUNDER.languages.join(", ")}</p>}
          </div>
        </section>
      )}

      <section className="page-section container" aria-labelledby="others-title">
        <h2 id="others-title" className="page-section__title" data-reveal>SINC leadership</h2>
        <ul className="leader-mini">
          {LEADERS.slice(1).map((l) => (
            <li key={l.slug} data-reveal>
              <a href={l.path}><strong>{l.member.name}</strong><span>{l.member.role}</span><IconArrowRight /></a>
            </li>
          ))}
        </ul>
        <p data-reveal><a className="text-link" href="/leadership">All of SINC’s leadership <IconArrowRight /></a></p>
      </section>

      <section className="page-cta container" aria-labelledby="founder-cta">
        <h2 id="founder-cta" className="page-cta__title" data-reveal>Built with a team, for a community.</h2>
        <div className="page-cta__actions" data-reveal>
          <JoinButton />
          <a className="btn btn-ghost" href="/team">Meet the SINC team</a>
        </div>
      </section>
    </PageShell>
  );
}
