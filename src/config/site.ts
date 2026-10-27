/**
 * Central site configuration. Edit links, brand text and storage keys here.
 */
export const PLATFORM_URL = "https://sinc-platform.vercel.app/login";

/** The production address. Canonical links, the sitemap and structured data are built from it. */
export const SITE_URL = "https://sincommunity.in";

export const SITE = {
  name: "SINC",
  fullName: "Society for Innovation, Network & Collaboration",
  tagline: "Where Ambition Finds Its People.",
  message: "Connect. Collaborate. Innovate.",
  /** other names people search for; used in structured data so Google connects them to this site */
  alternateNames: ["SINC Community", "sincommunity", "sincommunity.in", "Society for Innovation, Network & Collaboration"],
  domain: "sincommunity.in",
  /** one-line definition used in copy and structured data */
  definition: "SINC is a technology-focused community and collaboration ecosystem where ambitious people connect, collaborate, learn, build and grow together.",
  belief: "No one should have to pursue their ambitions alone.",
  /** Every "Join SINC" and "Log in" action opens the existing SINC platform (it offers both sign-up and sign-in). */
  links: {
    join: PLATFORM_URL,
    login: PLATFORM_URL,
  },
  /** Verified social accounts only (supplied by SINC). Add more here when they exist. */
  social: {
    instagram: { url: "https://www.instagram.com/sincommunity.in/", handle: "@sincommunity.in" },
  },
} as const;

/** Browser storage keys. Changing introSeen makes every visitor see the opening story once more. */
export const STORAGE_KEYS = {
  introSeen: "sinc-intro-seen-v2",
  motion: "sinc-motion",
} as const;

/** Public pages, each prerendered to its own HTML file and listed in the sitemap. */
export const PAGES = [
  { id: "about", path: "/about", label: "About SINC" },
  { id: "founder", path: "/founder", label: "Founder" },
  { id: "team", path: "/team", label: "Meet the team" },
  { id: "contact", path: "/contact", label: "Contact" },
] as const;
export const LEGAL_PAGES = [
  { id: "privacy", path: "/privacy", label: "Privacy Policy" },
  { id: "terms", path: "/terms", label: "Terms of Use" },
] as const;

/** In-page section anchors on the home page, in reading order. */
export const NAV_ITEMS = [
  { id: "story", label: "Our Story" },
  { id: "for-you", label: "For You" },
  { id: "ecosystem", label: "Ecosystem" },
  { id: "team", label: "Our Team" },
] as const;

export type NavId = (typeof NAV_ITEMS)[number]["id"] | "about";
