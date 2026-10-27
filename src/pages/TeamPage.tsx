import { TEAM, portrait, portraitSrcSet, type TeamMember } from "../data/team";
import { FOUNDER } from "../data/founder";
import { leaderForMember } from "../data/leadership";
import type { RouteMeta } from "../seo/routes";
import { ProfileLinks } from "../components/ProfileLinks";
import { JoinButton } from "../components/ui";
import { PageHero, PageShell } from "./PageShell";

function ProfileCard({ m, size = "md" }: { m: TeamMember; size?: "lg" | "md" | "sm" }) {
  const isFounder = m.id === FOUNDER.id;
  const leader = leaderForMember(m.id);
  return (
    <article className={`profile-card profile-card--${size}`} data-reveal>
      <div className="profile-card__photo" data-reveal="mask">
        <img src={portrait(m.id, size === "sm" ? 480 : 800)} srcSet={portraitSrcSet(m.id)}
          sizes={size === "lg" ? "(min-width: 900px) 30vw, 90vw" : "(min-width: 900px) 22vw, 46vw"}
          width={480} height={600} loading={size === "lg" ? "eager" : "lazy"} decoding="async"
          alt={`${m.name}, ${m.role} at SINC`} style={{ objectPosition: m.focus }} />
      </div>
      <div className="profile-card__body">
        <h3 className="profile-card__name">{m.name}</h3>
        <p className="profile-card__role">{m.role}</p>
        {m.responsibilities && (
          <ul className="profile-card__resp" aria-label={`${m.name}'s responsibilities`}>
            {m.responsibilities.map((r) => <li key={r}>{r}</li>)}
          </ul>
        )}
        {isFounder && <ProfileLinks links={FOUNDER.links.slice(0, 2)} person={m.name} className="profile-links--compact" />}
        {leader && <a className="text-link" href={leader.path}>View {isFounder ? "the founder" : `${m.name}’s`} profile</a>}
      </div>
    </article>
  );
}

export function TeamPage({ route }: { route: RouteMeta }) {
  const founder = TEAM.filter((m) => m.id === FOUNDER.id);
  const cofounders = TEAM.filter((m) => m.group === "founding" && m.id !== FOUNDER.id);
  const advisors = TEAM.filter((m) => m.group === "advisor");
  const team = TEAM.filter((m) => m.group === "team");

  return (
    <PageShell route={route} current="team">
      <PageHero
        eyebrow="Our team"
        title={<>Meet the <span className="accent">SINC</span> team.</>}
        lede="SINC is being built by a team: a founder, two co-founders, a founding advisor, and the people testing, designing, developing and telling SINC’s story."
      />

      <section className="page-section container" aria-labelledby="founder-group">
        <h2 id="founder-group" className="group-title" data-reveal>Founder</h2>
        <div className="profile-grid profile-grid--one">{founder.map((m) => <ProfileCard key={m.id} m={m} size="lg" />)}</div>
      </section>

      <section className="page-section container" aria-labelledby="cofounder-group">
        <h2 id="cofounder-group" className="group-title" data-reveal>Co-Founders and Founding Advisor</h2>
        <div className="profile-grid profile-grid--three">
          {[...cofounders, ...advisors].map((m) => <ProfileCard key={m.id} m={m} />)}
        </div>
      </section>

      <section className="page-section container" aria-labelledby="team-group">
        <h2 id="team-group" className="group-title" data-reveal>Team</h2>
        <div className="profile-grid profile-grid--team">
          {team.map((m) => <ProfileCard key={m.id} m={m} size="sm" />)}
        </div>
      </section>

      <section className="page-cta container" aria-labelledby="team-cta">
        <h2 id="team-cta" className="page-cta__title" data-reveal>Build something with us.</h2>
        <div className="page-cta__actions" data-reveal>
          <JoinButton />
          <a className="btn btn-ghost" href="/about">About SINC</a>
        </div>
      </section>
    </PageShell>
  );
}
