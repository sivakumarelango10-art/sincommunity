/**
 * Every public page: its URL, file, search title and description, and structured data.
 * scripts/prerender.mjs renders each one to its own HTML file and builds sitemap.xml from this list.
 * Titles stay under ~60 characters and descriptions under ~160 so they are not cut off in results.
 */
import { SITE, SITE_URL } from "../config/site";
import { FOUNDER } from "../data/founder";
import { TEAM } from "../data/team";

export type RouteId = "home" | "about" | "founder" | "team" | "contact" | "privacy" | "terms" | "not-found";

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
    title: "SINC – Society for Innovation, Network & Collaboration",
    description: "SINC (Society for Innovation, Network & Collaboration) is a Bengaluru technology community where developers, designers, students and founders build together.",
  },
  {
    id: "about", path: "/about", file: "about.html", crumb: "About SINC", indexable: true, changefreq: "monthly", priority: 0.8,
    title: "About SINC | Society for Innovation, Network & Collaboration",
    description: "What SINC is, who it brings together, and the mission, vision and values behind this technology community for collaboration and innovation.",
  },
  {
    id: "founder", path: "/founder", file: "founder.html", crumb: "Founder", indexable: true, changefreq: "monthly", priority: 0.8, ogType: "profile",
    title: "Elango S, Founder of SINC | Technology Community",
    description: "Elango S is the founder of SINC and a B.Tech CSE (AI & ML) student at Yenepoya University, Bengaluru. His vision for SINC, what he leads, and his projects.",
    ogImage: { path: "/images/team/elango-s-founder-sinc.jpg", width: 664, height: 830, alt: "Elango S, Founder of SINC" },
    images: ["/images/team/elango-s-founder-sinc.jpg"],
  },
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

export const routeByPath = (pathname: string): RouteMeta => {
  const clean = pathname.replace(/\/index\.html$/, "/").replace(/\.html$/, "").replace(/\/+$/, "") || "/";
  return ROUTES.find((r) => r.path === clean && r.id !== "not-found") ?? ROUTES.find((r) => r.id === "not-found")!;
};

export const absolute = (p: string) => `${SITE_URL}${p === "/" ? "/" : p}`;

/* ---------------------------------------------------------------- structured data (JSON-LD) */
const ORG_ID = `${SITE_URL}/#organization`;
const SITE_ID = `${SITE_URL}/#website`;
const FOUNDER_ID = `${SITE_URL}/founder#person`;

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

function founderPerson() {
  return {
    "@type": "Person",
    "@id": FOUNDER_ID,
    name: FOUNDER.name,
    jobTitle: FOUNDER.role,
    description: `${FOUNDER.intro} ${FOUNDER.headline}.`,
    affiliation: UNIVERSITY,
    knowsAbout: FOUNDER.skills,
    knowsLanguage: FOUNDER.languages,
    image: absolute("/images/team/elango-s-founder-sinc.jpg"),
    url: absolute("/founder"),
    worksFor: { "@id": ORG_ID },
    sameAs: FOUNDER.links.map((l) => l.url),
  };
}

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

function breadcrumb(r: RouteMeta) {
  return {
    "@type": "BreadcrumbList",
    "@id": `${absolute(r.path)}#breadcrumb`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absolute("/") },
      { "@type": "ListItem", position: 2, name: r.crumb, item: absolute(r.path) },
    ],
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
    const types: Partial<Record<RouteId, string>> = { about: "AboutPage", founder: "ProfilePage", contact: "ContactPage" };
    const extra: Record<string, unknown> = { breadcrumb: { "@id": `${absolute(r.path)}#breadcrumb` } };
    if (r.id === "founder") extra.mainEntity = { "@id": FOUNDER_ID };
    graph.push(webPage(r, types[r.id] ?? "WebPage", extra), breadcrumb(r), organization());
    if (r.id === "founder") graph.push(founderPerson());
    if (r.id === "team") {
      graph.push(founderPerson());
      TEAM.filter((m) => m.id !== FOUNDER.id).forEach((m) => graph.push({ "@type": "Person", name: m.name, jobTitle: m.role, worksFor: { "@id": ORG_ID } }));
    }
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
