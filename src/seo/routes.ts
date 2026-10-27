/**
 * Every public page: its URL, file, search title and description, and structured data.
 * scripts/prerender.mjs renders each one to its own HTML file and builds sitemap.xml from this list.
 * Titles stay under ~60 characters and descriptions under ~160 so they are not cut off in results.
 */
import { SITE, SITE_URL } from "../config/site";
import { FOUNDER } from "../data/founder";
import { TEAM, type TeamMember } from "../data/team";
import { LEADERS, FOUNDER_PATH, leaderForMember, type Leader } from "../data/leadership";
import PHOTO_SIZES from "../data/photo-sizes.json";

export type RouteId = "home" | "about" | "leadership" | "leader" | "team" | "contact" | "privacy" | "terms" | "not-found";

export interface RouteMeta {
  id: RouteId;
  /** URL path without a trailing slash ("/" for home) */
  path: string;
  /** output file inside dist/ (Vercel serves /about from about.html with cleanUrls) */
  file: string;
  title: string;
  description: string;
  /** breadcrumb label (sub-pages) */
  crumb?: string;
  /** the page above this one in the breadcrumb (e.g. a profile sits under Leadership) */
  parent?: RouteId;
  /** leadership profile pages: whose profile */
  leaderSlug?: string;
  indexable: boolean;
  ogType?: "website" | "profile";
  ogImage?: { path: string; width: number; height: number; alt: string };
  changefreq?: "weekly" | "monthly" | "yearly";
  /** images listed for this page in the sitemap (helps them appear in image search) */
  images?: string[];
  priority?: number;
}

const DEFAULT_OG = { path: "/images/brand/sinc-og.jpg", width: 1200, height: 630, alt: "SINC logo: three people joined around a shared centre" };

export const ROUTES: RouteMeta[] = [
  {
    id: "home", path: "/", file: "index.html", indexable: true, changefreq: "weekly", priority: 1,
    // link previews (WhatsApp, LinkedIn, Instagram…) show the SINC logo (default og:image);
    // Google results are pointed at the founder's photo through primaryImageOfPage below
    images: ["/images/team/elango-s-founder-sinc.jpg", "/images/brand/sinc-logo.jpeg"],
    // brand searches (SINC, sincommunity, the full name) match the title; the description is the short explanation
    title: "SINC | Society for Innovation, Network & Collaboration",
    description: "SINC, the Society for Innovation, Network & Collaboration, is a Bengaluru technology community where developers, designers and founders build together.",
  },
  {
    id: "about", path: "/about", file: "about.html", crumb: "About SINC", indexable: true, changefreq: "monthly", priority: 0.8,
    title: "About SINC | Society for Innovation, Network & Collaboration",
    description: "What SINC is, who it brings together, and the mission, vision and values behind this technology community for collaboration and innovation.",
  },
  {
    id: "leadership", path: "/leadership", file: "leadership.html", crumb: "Leadership", indexable: true, changefreq: "monthly", priority: 0.8,
    images: LEADERS.map((l) => leaderImage(l)),
    title: "SINC Leadership | Founder, Co-Founders & Founding Advisor",
    description: "SINC is led by founder Elango S, co-founders Karmjit SG and Prajith P, and founding advisor Aaditya R M. Their roles and profiles.",
  },
  ...LEADERS.map((l): RouteMeta => ({
    id: "leader", leaderSlug: l.slug, path: l.path, file: `${l.path.slice(1)}.html`, crumb: l.member.name, parent: "leadership",
    indexable: true, changefreq: "monthly", priority: l.member.role === "Founder" ? 0.8 : 0.6, ogType: "profile",
    title: l.member.role === "Founder" ? "Elango S, Founder of SINC | Technology Community" : `${l.member.name}, ${l.member.role} of SINC`,
    description: l.member.role === "Founder"
      ? "Elango S is the founder of SINC and a B.Tech CSE (AI & ML) student at Yenepoya University, Bengaluru. His vision for SINC, what he leads, and his projects."
      : l.description,
    ogImage: { path: leaderImage(l), ...leaderImageSize(l), alt: `${l.member.name}, ${l.member.role} of SINC` },
    images: [leaderImage(l)],
  })),
  {
    id: "team", path: "/team", file: "team.html", crumb: "Meet the team", indexable: true, changefreq: "monthly", priority: 0.7,
    images: TEAM.map((m) => `/images/team/${m.id}-portrait-800.webp`),
    title: "Meet the SINC Team | Founder, Co-Founders & Team",
    description: "The people building SINC: founder Elango S, co-founders Karmjit SG and Prajith P, founding advisor Aaditya R M, and the SINC team.",
  },
  {
    id: "contact", path: "/contact", file: "contact.html", crumb: "Contact", indexable: true, changefreq: "yearly", priority: 0.5,
    title: "Contact SINC | Technology Community",
    description: "Contact SINC by email or Instagram. SINC is incubated at Yenepoya (Deemed-to-be University), Bengaluru Campus, Bengaluru, Karnataka.",
  },
  {
    id: "privacy", path: "/privacy", file: "privacy.html", crumb: "Privacy Policy", indexable: true, changefreq: "yearly", priority: 0.3,
    title: "Privacy Policy | SINC",
    description: "How the SINC website handles information: no forms, no tracking, and two preferences saved only in your browser.",
  },
  {
    id: "terms", path: "/terms", file: "terms.html", crumb: "Terms of Use", indexable: true, changefreq: "yearly", priority: 0.3,
    title: "Terms of Use | SINC",
    description: "The terms for using the SINC website, its content and its links to the SINC platform and other services.",
  },
  {
    id: "not-found", path: "/404", file: "404.html", indexable: false,
    title: "Page not found | SINC",
    description: "This page doesn’t exist. Find your way back to SINC, the technology community for innovation and collaboration.",
  },
];

/** the approved portrait used for a leader in previews, structured data and the sitemap */
function leaderImage(l: Leader): string {
  return l.member.role === "Founder" ? "/images/team/elango-s-founder-sinc.jpg" : `/images/team/${l.member.id}-portrait-800.webp`;
}

function leaderImageSize(l: Leader) {
  const [width, height] = (PHOTO_SIZES as Record<string, number[]>)[l.member.id] ?? [664, 830];
  return { width, height };
}

export const routeById = (id: RouteId) => ROUTES.find((r) => r.id === id)!;

export const routeByPath = (pathname: string): RouteMeta => {
  const clean = pathname.replace(/\/index\.html$/, "/").replace(/\.html$/, "").replace(/\/+$/, "") || "/";
  return ROUTES.find((r) => r.path === clean && r.id !== "not-found") ?? ROUTES.find((r) => r.id === "not-found")!;
};

export const absolute = (p: string) => `${SITE_URL}${p === "/" ? "/" : p}`;

/* ---------------------------------------------------------------- structured data (JSON-LD) */
const ORG_ID = `${SITE_URL}/#organization`;
const SITE_ID = `${SITE_URL}/#website`;
const personId = (l: Leader) => `${absolute(l.path)}#person`;
const FOUNDER_ID = `${absolute(FOUNDER_PATH)}#person`;

function organization() {
  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name: SITE.name,
    alternateName: SITE.alternateNames,
    url: absolute("/"),
    logo: { "@type": "ImageObject", url: absolute("/images/brand/sinc-logo.jpeg"), width: 1254, height: 1254 },
    image: absolute(DEFAULT_OG.path),
    description: SITE.definition,
    slogan: SITE.tagline,
    founder: { "@id": FOUNDER_ID },
    email: SITE.email,
    address: postalAddress(),
    contactPoint: { "@type": "ContactPoint", contactType: "general enquiries", email: SITE.email, availableLanguage: ["English", "Tamil"] },
    sameAs: [SITE.social.instagram.url],
  };
}

const UNIVERSITY = { "@type": "CollegeOrUniversity", name: SITE.incubator, address: postalAddress() };

function postalAddress() {
  return {
    "@type": "PostalAddress",
    streetAddress: SITE.address.street,
    addressLocality: SITE.address.locality,
    addressRegion: SITE.address.region,
    postalCode: SITE.address.postalCode,
    addressCountry: SITE.address.country,
  };
}

/** a leader as a Person: only confirmed facts, linked to the one SINC organisation entity */
function leaderPerson(l: Leader) {
  const base = {
    "@type": "Person",
    "@id": personId(l),
    name: l.member.name,
    jobTitle: l.member.role,
    description: l.summary,
    image: absolute(leaderImage(l)),
    url: absolute(l.path),
    worksFor: { "@id": ORG_ID },
  };
  if (l.member.id !== FOUNDER.id) {
    const pr = l.profile;
    if (!pr) return base;
    return {
      ...base,
      description: pr.bio[0] ?? l.summary,
      // finished courses → alumniOf; a course still running (ends after the build year) → affiliation
      ...educationLinks(pr.education ?? []),
      ...(pr.skills?.length ? { knowsAbout: pr.skills } : {}),
      ...(pr.links?.length ? { sameAs: pr.links.map((x) => x.url) } : {}),
    };
  }
  return {
    ...base,
    description: `${FOUNDER.intro} ${FOUNDER.headline}.`,
    affiliation: UNIVERSITY,
    knowsAbout: FOUNDER.skills,
    knowsLanguage: FOUNDER.languages,
    sameAs: FOUNDER.links.map((x) => x.url),
  };
}
function educationLinks(list: { school: string; when?: string; current?: boolean }[]) {
  const year = new Date().getFullYear();
  const ends = (w?: string) => Number(w?.match(/(\d{4})(?!.*\d{4})/)?.[1] ?? 0); // the last year mentioned
  const org = (e: { school: string }) => ({ "@type": "EducationalOrganization", name: e.school });
  const isCurrent = (e: { when?: string; current?: boolean }) => e.current ?? ends(e.when) > year;
  const done = list.filter((e) => !isCurrent(e) && ends(e.when) > 0).map(org);
  const current = list.filter(isCurrent).map(org);
  return { ...(done.length ? { alumniOf: done } : {}), ...(current.length ? { affiliation: current } : {}) };
}
const teamPerson = (m: TeamMember) => {
  const l = leaderForMember(m.id);
  return l ? leaderPerson(l) : { "@type": "Person", name: m.name, jobTitle: m.role, worksFor: { "@id": ORG_ID } };
};

function webPage(r: RouteMeta, type = "WebPage", extra: Record<string, unknown> = {}) {
  return {
    "@type": type,
    "@id": `${absolute(r.path)}#webpage`,
    url: absolute(r.path),
    name: r.title,
    description: r.description,
    isPartOf: { "@id": SITE_ID },
    about: { "@id": ORG_ID },
    inLanguage: "en",
    ...extra,
  };
}

export function crumbTrail(r: RouteMeta): { name: string; path: string }[] {
  const trail = [{ name: "Home", path: "/" }];
  if (r.parent) { const p = routeById(r.parent); trail.push({ name: p.crumb!, path: p.path }); }
  if (r.crumb) trail.push({ name: r.crumb, path: r.path });
  return trail;
}

function breadcrumb(r: RouteMeta) {
  return {
    "@type": "BreadcrumbList",
    "@id": `${absolute(r.path)}#breadcrumb`,
    itemListElement: crumbTrail(r).map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: absolute(c.path) })),
  };
}

export function structuredData(r: RouteMeta): object | null {
  if (!r.indexable) return null;
  const graph: object[] = [];
  if (r.id === "home") {
    const founderPhoto = { "@type": "ImageObject", url: absolute("/images/team/elango-s-founder-sinc.jpg"), width: 664, height: 830, caption: "Elango S, Founder of SINC" };
    graph.push(organization(), { "@type": "WebSite", "@id": SITE_ID, url: absolute("/"), name: SITE.name, alternateName: SITE.alternateNames, publisher: { "@id": ORG_ID }, inLanguage: "en" },
      webPage(r, "WebPage", { primaryImageOfPage: founderPhoto, image: founderPhoto }));
  } else {
    const types: Partial<Record<RouteId, string>> = { about: "AboutPage", leader: "ProfilePage", leadership: "CollectionPage", contact: "ContactPage" };
    const extra: Record<string, unknown> = { breadcrumb: { "@id": `${absolute(r.path)}#breadcrumb` } };
    const leader = r.leaderSlug ? LEADERS.find((l) => l.slug === r.leaderSlug) : undefined;
    if (leader) extra.mainEntity = { "@id": personId(leader) };
    if (r.id === "leadership") extra.mainEntity = { "@type": "ItemList", itemListElement: LEADERS.map((l, i) => ({ "@type": "ListItem", position: i + 1, item: { "@id": personId(l) } })) };
    graph.push(webPage(r, types[r.id] ?? "WebPage", extra), breadcrumb(r), organization());
    if (leader) graph.push(leaderPerson(leader));
    if (r.id === "leadership") LEADERS.forEach((l) => graph.push(leaderPerson(l)));
    if (r.id === "team") TEAM.forEach((m) => graph.push(teamPerson(m)));
  }
  return { "@context": "https://schema.org", "@graph": graph };
}

/* ---------------------------------------------------------------- <head> tags */
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function headTags(r: RouteMeta): string {
  const url = absolute(r.path);
  const og = r.ogImage ?? DEFAULT_OG;
  const lines = [
    `<title>${esc(r.title)}</title>`,
    `<meta name="description" content="${esc(r.description)}" />`,
    `<meta name="robots" content="${r.indexable ? "index, follow, max-image-preview:large" : "noindex, follow"}" />`,
  ];
  if (r.indexable) lines.push(`<link rel="canonical" href="${url}" />`);
  lines.push(
    `<meta property="og:site_name" content="${esc(SITE.name)}" />`,
    `<meta property="og:locale" content="en_IN" />`,
    `<meta property="og:type" content="${r.ogType ?? "website"}" />`,
    `<meta property="og:title" content="${esc(r.title)}" />`,
    `<meta property="og:description" content="${esc(r.description)}" />`,
    ...(r.indexable ? [`<meta property="og:url" content="${url}" />`] : []),
    `<meta property="og:image" content="${absolute(og.path)}" />`,
    `<meta property="og:image:width" content="${og.width}" />`,
    `<meta property="og:image:height" content="${og.height}" />`,
    `<meta property="og:image:alt" content="${esc(og.alt)}" />`,
    `<meta name="twitter:card" content="${og.width > og.height ? "summary_large_image" : "summary"}" />`,
    `<meta name="twitter:title" content="${esc(r.title)}" />`,
    `<meta name="twitter:description" content="${esc(r.description)}" />`,
    `<meta name="twitter:image" content="${absolute(og.path)}" />`,
  );
  const data = structuredData(r);
  if (data) lines.push(`<script type="application/ld+json">${JSON.stringify(data).replace(/</g, "\\u003c")}</script>`);
  return lines.join("\n    ");
}
