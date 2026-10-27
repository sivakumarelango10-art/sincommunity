import { SITE } from "../config/site";
import { FOUNDER } from "../data/founder";
import type { RouteMeta } from "../seo/routes";
import { IconArrowUpRight, IconInstagram, IconLinkedIn, IconMail, IconPin } from "../components/ui";
import { PageHero, PageShell } from "./PageShell";

export function ContactPage({ route }: { route: RouteMeta }) {
  const linkedin = FOUNDER.links.find((l) => l.kind === "linkedin");
  return (
    <PageShell route={route}>
      <PageHero
        eyebrow="Contact"
        title={<>Talk to <span className="accent">SINC.</span></>}
        lede="Email SINC or send a message on Instagram. SINC is incubated at Yenepoya (Deemed-to-be University), Bengaluru Campus."
      />
      <section className="page-section container" aria-label="Ways to reach SINC">
        <ul className="contact-grid">
          <li className="contact-card" data-reveal>
            <IconMail />
            <h2>Email</h2>
            <p>Questions, partnerships and collaboration requests.</p>
            <a className="btn" href={`mailto:${SITE.email}`}>{SITE.email.split("@")[0]}<wbr />@{SITE.email.split("@")[1]}</a>
          </li>
          <li className="contact-card" data-reveal>
            <IconPin />
            <h2>Where SINC is based</h2>
            <address className="contact-address">
              SINC, incubated at {SITE.incubator}<br />
              {SITE.address.street}<br />
              {SITE.address.locality}, {SITE.address.region} {SITE.address.postalCode}<br />
              {SITE.address.countryName}
            </address>
            <a className="btn btn-ghost" href={SITE.mapUrl} target="_blank" rel="noopener noreferrer">
              Open in Google Maps <IconArrowUpRight /><span className="sr-only">(opens in a new tab)</span>
            </a>
          </li>
          <li className="contact-card" data-reveal>
            <IconInstagram />
            <h2>Message us on Instagram</h2>
            <p>Questions, ideas and collaboration requests: send SINC a direct message.</p>
            <a className="btn btn-ghost" href={SITE.social.instagram.url} target="_blank" rel="noopener noreferrer">
              {SITE.social.instagram.handle} <IconArrowUpRight /><span className="sr-only">(opens Instagram in a new tab)</span>
            </a>
          </li>
          <li className="contact-card" data-reveal>
            <IconArrowUpRight />
            <h2>Join or log in</h2>
            <p>Create your SINC account, or sign in if you already have one.</p>
            <a className="btn btn-ghost" href={SITE.links.join} target="_blank" rel="noopener noreferrer">
              Open the SINC platform <IconArrowUpRight /><span className="sr-only">(opens in a new tab)</span>
            </a>
          </li>
          {linkedin && (
            <li className="contact-card" data-reveal>
              <IconLinkedIn />
              <h2>Connect with the founder</h2>
              <p>Reach Elango S, founder of SINC, on LinkedIn.</p>
              <a className="btn btn-ghost" href={linkedin.url} target="_blank" rel="noopener noreferrer">
                Elango S on LinkedIn <IconArrowUpRight /><span className="sr-only">(opens LinkedIn in a new tab)</span>
              </a>
            </li>
          )}
        </ul>
      </section>
    </PageShell>
  );
}
