import { SITE, SITE_URL, STORAGE_KEYS } from "../config/site";
import type { RouteMeta } from "../seo/routes";
import { PageHero, PageShell } from "./PageShell";

/*
 * Written from what this website actually does (no forms, no analytics, no cookies, two
 * preferences in the browser's local storage). Have both pages reviewed before relying on
 * them legally, and update them if the site starts collecting information.
 */
const UPDATED = "27 October 2026";
const host = SITE_URL.replace("https://", "");

export function PrivacyPage({ route }: { route: RouteMeta }) {
  return (
    <PageShell route={route}>
      <PageHero eyebrow="Privacy Policy" title="Privacy Policy" lede={`How the SINC website at ${host} handles information. Last updated ${UPDATED}.`} />
      <article className="page-section container legal prose">
        <h2>What this website collects</h2>
        <p>
          This website does not ask for your name, email address or any other personal details. It has no sign-up or
          contact forms, no advertising, and no analytics or tracking tools, and it does not set cookies.
        </p>

        <h2>Preferences saved in your browser</h2>
        <p>The site saves two small settings in your browser’s local storage, on your device only:</p>
        <ul>
          <li><code>{STORAGE_KEYS.introSeen}</code> remembers that the opening story has been shown, so it does not play again on every visit.</li>
          <li><code>{STORAGE_KEYS.motion}</code> remembers whether you switched animations on or off in the footer.</li>
        </ul>
        <p>These settings are never sent to SINC. You can remove them at any time by clearing this site’s data in your browser.</p>

        <h2>Hosting</h2>
        <p>
          The website is hosted by Vercel. Like any web host, Vercel processes technical information such as IP addresses
          and browser details when it delivers pages, to keep the service running and secure. Vercel’s own privacy policy
          describes how it handles that information.
        </p>

        <h2>The SINC platform and other links</h2>
        <p>
          “Join SINC” and “Log In” open the SINC platform at sinc-platform.vercel.app, which is a separate service. Any
          information you give when you create an account or sign in is handled there, not on this website.
        </p>
        <p>
          Links to Instagram, LinkedIn and GitHub open those services, which have their own privacy policies.
        </p>

        <h2>Changes to this policy</h2>
        <p>If the website changes how it handles information, this page will be updated and the date above will change.</p>

        <h2>Questions</h2>
        <p>
          Send SINC a message on Instagram at{" "}
          <a href={SITE.social.instagram.url} target="_blank" rel="noopener noreferrer">{SITE.social.instagram.handle}</a>.
        </p>
      </article>
    </PageShell>
  );
}

export function TermsPage({ route }: { route: RouteMeta }) {
  return (
    <PageShell route={route}>
      <PageHero eyebrow="Terms of Use" title="Terms of Use" lede={`The terms for using the SINC website at ${host}. Last updated ${UPDATED}.`} />
      <article className="page-section container legal prose">
        <h2>About this website</h2>
        <p>
          This website introduces SINC, the {SITE.fullName}: its purpose, its team and how to join. By using it, you agree
          to these terms.
        </p>

        <h2>Using the content</h2>
        <p>
          The SINC name, logo, text and design on this website belong to SINC. You may share links to any page. Please do
          not copy the content, logo or design for other purposes without SINC’s permission.
        </p>
        <p>
          The photographs show members of the SINC team. They may not be copied or reused without the consent of the
          people shown and of SINC.
        </p>

        <h2>The SINC platform</h2>
        <p>
          “Join SINC” and “Log In” open the SINC platform at sinc-platform.vercel.app, a separate service. Any terms
          shown on the platform apply to your use of it.
        </p>

        <h2>Links to other services</h2>
        <p>
          This website links to Instagram, LinkedIn, GitHub and the SINC platform. Those services are run under their own
          terms, and SINC is not responsible for their content or availability.
        </p>

        <h2>No guarantees</h2>
        <p>
          The website describes SINC’s purpose, values and plans. It is provided as it is, and SINC does not promise that
          it will always be available or free of errors. Descriptions of what SINC is working towards are plans, not
          promises of particular results.
        </p>

        <h2>Changes to these terms</h2>
        <p>SINC may update these terms. The date above shows when they last changed.</p>

        <h2>Questions</h2>
        <p>
          Send SINC a message on Instagram at{" "}
          <a href={SITE.social.instagram.url} target="_blank" rel="noopener noreferrer">{SITE.social.instagram.handle}</a>.
        </p>
      </article>
    </PageShell>
  );
}

export function NotFoundPage({ route }: { route: RouteMeta }) {
  return (
    <PageShell route={route}>
      <PageHero eyebrow="404" title="This page doesn’t exist." lede="The link may be old, or the address may have a typo. These pages will get you back on track.">
        <ul className="not-found__links" data-reveal>
          <li><a className="btn" href="/">Go to the home page</a></li>
          <li><a className="btn btn-ghost" href="/about">About SINC</a></li>
          <li><a className="btn btn-ghost" href="/team">Meet the team</a></li>
        </ul>
      </PageHero>
    </PageShell>
  );
}
