import { SITE } from "../config/site";
import { LEADERS, type Leader } from "../data/leadership";
import type { RouteMeta } from "../seo/routes";
import { IconArrowRight, JoinButton } from "../components/ui";
import { ProfileLinks } from "../components/ProfileLinks";
import { LeaderPhoto } from "../components/LeaderPhoto";
import { PageShell } from "./PageShell";

/** Profile for a co-founder or the founding advisor: confirmed name, designation, approved photo
    and responsibilities. A verified biography appears automatically once it is added to the data. */
export function LeaderProfilePage({ route, leader }: { route: RouteMeta; leader: Leader }) {
  const m = leader.member;
  const others = LEADERS.filter((l) => l.slug !== leader.slug);
  const pr = leader.profile;
  const first = m.name.split(" ")[0];
  const lists = [
    { id: "certifications", title: "Certifications", items: pr?.certifications ?? [] },
    { id: "achievements", title: "Achievements", items: pr?.achievements ?? [] },
    { id: "activities", title: "Leadership and activities", items: pr?.activities ?? [] },
  ].filter((x) => x.items.length > 0);
  return (
    <PageShell route={route} current="team">
      <header className="founder-hero container">
        <LeaderPhoto leader={leader} />
        <div className="founder-hero__text">
          <p className="eyebrow" data-reveal>{m.role}</p>
          <h1 className="page-hero__title" data-reveal>{m.name}</h1>
          <p className="founder-hero__role" data-reveal>{m.role} of SINC · {pr?.headline ?? SITE.fullName}</p>
          <p className="lead" data-reveal>{leader.summary}</p>
          {pr?.links && pr.links.length > 0 && <div data-reveal><ProfileLinks links={pr.links} person={m.name} /></div>}
        </div>
      </header>

      {leader.bio.length > 0 && (
        <section className="page-section container split" aria-labelledby="bio-title">
          <h2 id="bio-title" className="page-section__title" data-reveal>About {first}</h2>
          <div className="prose" data-reveal>{leader.bio.map((p) => <p key={p}>{p}</p>)}</div>
        </section>
      )}

      {m.responsibilities && m.responsibilities.length > 0 && (
        <section className="page-section container split" aria-labelledby="resp-title">
          <h2 id="resp-title" className="page-section__title" data-reveal>Role at SINC</h2>
          <ul className="chip-list" data-reveal>{m.responsibilities.map((r) => <li key={r}>{r}</li>)}</ul>
        </section>
      )}

      {pr?.education && pr.education.length > 0 && (
        <section className="page-section container split" aria-labelledby="education-title">
          <h2 id="education-title" className="page-section__title" data-reveal>Education</h2>
          <ul className="timeline-list" data-reveal>
            {pr.education.map((e) => (
              <li key={e.award}><strong>{e.award}</strong><span>{e.school}</span>{e.when && <span className="timeline-list__when">{e.when}</span>}</li>
            ))}
          </ul>
        </section>
      )}

      {pr?.experience && pr.experience.length > 0 && (
        <section className="page-section container split" aria-labelledby="experience-title">
          <h2 id="experience-title" className="page-section__title" data-reveal>Experience</h2>
          <ul className="timeline-list" data-reveal>
            {pr.experience.map((e) => (
              <li key={e.role + e.org}>
                <strong>{e.role}</strong><span>{e.org}</span>{e.when && <span className="timeline-list__when">{e.when}</span>}
                <p>{e.text}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {pr?.projects && pr.projects.length > 0 && (
        <section className="page-section container" aria-labelledby="projects-title">
          <h2 id="projects-title" className="page-section__title" data-reveal>Projects</h2>
          <ul className="project-grid">
            {pr.projects.map((x) => (
              <li key={x.name} className="project-card" data-reveal><h3>{x.name}</h3><p>{x.text}</p></li>
            ))}
          </ul>
        </section>
      )}

      {pr?.skills && pr.skills.length > 0 && (
        <section className="page-section container split" aria-labelledby="skills-title">
          <h2 id="skills-title" className="page-section__title" data-reveal>Skills</h2>
          <ul className="chip-list chip-list--quiet" data-reveal>{pr.skills.map((k) => <li key={k}>{k}</li>)}</ul>
        </section>
      )}

      {lists.map((x) => (
        <section key={x.id} className="page-section container split" aria-labelledby={`${x.id}-title`}>
          <h2 id={`${x.id}-title`} className="page-section__title" data-reveal>{x.title}</h2>
          <ul className="prose prose-list" data-reveal>{x.items.map((i) => <li key={i}>{i}</li>)}</ul>
        </section>
      ))}

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
