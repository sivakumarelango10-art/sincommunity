import { SITE } from "../config/site";
import { MISSION, VALUES, VISION } from "../data/content";
import type { RouteMeta } from "../seo/routes";
import { JoinButton } from "../components/ui";
import { PageHero, PageShell } from "./PageShell";

/** Who SINC brings together (supplied by SINC). */
const PEOPLE = [
  "Software developers",
  "AI and machine learning enthusiasts",
  "Students interested in technology",
  "Designers and UI/UX professionals",
  "Startup founders and aspiring entrepreneurs",
  "Technology innovators",
  "Open-source contributors",
  "Hackathon participants",
  "Tech enthusiasts",
  "Anyone who wants to build projects with others",
];

export function AboutPage({ route }: { route: RouteMeta }) {
  return (
    <PageShell route={route} current="about">
      <PageHero
        eyebrow="About SINC"
        title={<>A technology community built for <span className="accent">collaboration.</span></>}
        lede={SITE.definition}
      >
        <p className="page-hero__message" data-reveal>{SITE.message}</p>
      </PageHero>

      <section className="page-section container split" aria-labelledby="what-title">
        <h2 id="what-title" className="page-section__title" data-reveal>What is SINC?</h2>
        <div className="prose" data-reveal>
          <p>
            SINC stands for the <strong>{SITE.fullName}</strong>. It brings ambitious people together to learn, connect,
            collaborate and build meaningful projects.
          </p>
          <p>
            SINC is not simply a social network or a general networking site. The aim is to help people find the right
            teammates, collaborators, mentors, projects and opportunities, and to turn their ideas into real outcomes.
          </p>
        </div>
      </section>

      <section className="page-section container" aria-labelledby="who-title">
        <h2 id="who-title" className="page-section__title" data-reveal>Who SINC brings together</h2>
        <ul className="tag-grid">
          {PEOPLE.map((p) => <li key={p} data-reveal><span aria-hidden="true" />{p}</li>)}
        </ul>
      </section>

      <section className="page-section container mv-pair" aria-label="Mission and vision">
        <article data-reveal>
          <h2 className="page-kicker">Our mission</h2>
          <p className="statement">{MISSION}</p>
        </article>
        <article data-reveal>
          <h2 className="page-kicker">Our vision</h2>
          <p className="statement statement--small">{VISION}</p>
        </article>
      </section>

      <section className="page-section container" aria-labelledby="values-title">
        <h2 id="values-title" className="page-section__title" data-reveal>Our values</h2>
        <dl className="value-list">
          {VALUES.map((v) => (
            <div key={v.id} data-reveal>
              <dt>{v.name}</dt>
              <dd>{v.text}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="page-section container split" aria-labelledby="different-title">
        <h2 id="different-title" className="page-section__title" data-reveal>What makes SINC different</h2>
        <div className="prose" data-reveal>
          <p>
            SINC focuses on meaningful connections and what they lead to. The goal is not only to connect people, but to help
            them find teammates, start projects, take part in hackathons, learn together and build something that matters.
          </p>
        </div>
      </section>

      <section className="page-section container now-next" aria-labelledby="today-title">
        <h2 id="today-title" className="sr-only">Where SINC is today</h2>
        <article className="note-card" data-reveal>
          <p className="page-kicker">Available today</p>
          <ul>
            <li>Create an account or log in on the SINC platform.</li>
            <li>Follow the community on Instagram at {SITE.social.instagram.handle}.</li>
          </ul>
        </article>
        <article className="note-card note-card--plain" data-reveal>
          <p className="page-kicker">What we are working towards</p>
          <ul>
            <li>Helping members find teammates and collaborators with complementary skills.</li>
            <li>Starting projects and taking part in hackathons together.</li>
            <li>Learning from peers and mentors as the community grows.</li>
          </ul>
        </article>
      </section>

      <section className="page-cta container" aria-labelledby="about-cta">
        <h2 id="about-cta" className="page-cta__title" data-reveal>Your ambition deserves good company.</h2>
        <div className="page-cta__actions" data-reveal>
          <JoinButton />
          <a className="btn btn-ghost" href="/team">Meet the team</a>
        </div>
      </section>
    </PageShell>
  );
}
