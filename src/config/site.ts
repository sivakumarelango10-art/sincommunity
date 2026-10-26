/**
 * Central site configuration. Edit links, brand text and storage keys here.
 */
export const PLATFORM_URL = "https://sinc-platform.vercel.app/login";

export const SITE = {
  name: "SINC",
  fullName: "Society for Innovation, Network & Collaboration",
  tagline: "Where Ambition Finds Its People.",
  belief: "No one should have to pursue their ambitions alone.",
  /** Every "Join SINC" and "Log in" action opens the existing SINC platform (it offers both sign-up and sign-in). */
  links: {
    join: PLATFORM_URL,
    login: PLATFORM_URL,
  },
} as const;

/** Browser storage keys. Changing introSeen makes every visitor see the opening story once more. */
export const STORAGE_KEYS = {
  introSeen: "sinc-intro-seen-v2",
  motion: "sinc-motion",
} as const;

/** In-page section anchors, in reading order. */
export const NAV_ITEMS = [
  { id: "story", label: "Our Story" },
  { id: "for-you", label: "For You" },
  { id: "ecosystem", label: "Ecosystem" },
  { id: "team", label: "Our Team" },
] as const;

export type NavId = (typeof NAV_ITEMS)[number]["id"];
