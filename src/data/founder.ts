/**
 * Founder profile. Everything here was supplied by SINC; do not add details that have not been
 * confirmed. Empty fields are not shown on the site — fill them in to publish them.
 */
export interface ProfileLink {
  label: string;
  /** shown after the label, e.g. a handle */
  detail?: string;
  url: string;
  kind: "linkedin" | "github" | "instagram" | "website";
}

export const FOUNDER = {
  id: "elango-s",
  name: "Elango S",
  role: "Founder",
  title: "Founder of SINC",
  /** photo: assets-original/elango-s-founder.png → public/images/team/elango-s-founder-sinc-*.webp */
  photo: "elango-s-founder-sinc",
  photoAlt: "Elango S, Founder of SINC",

  intro:
    "Elango S is the founder of SINC, the Society for Innovation, Network & Collaboration: a technology-focused community where ambitious people connect, collaborate, learn and build together.",
  bio: [
    "Drawn to technology and innovation, Elango started SINC around one belief: no one should have to pursue their ambitions alone.",
    "As founder, he sets SINC’s vision, product direction and strategy, coordinates the team, and makes the final product decisions.",
  ],
  why:
    "Good ideas often stall because the right people never meet. The developer, the designer and the founder who could build something together are frequently outside each other’s circles. SINC exists to close that gap.",
  vision:
    "A collaborative technology community where developers, designers, students, founders and innovators find the right teammates and mentors, and turn their ideas into real outcomes together.",
  responsibilities: ["SINC vision", "Product direction", "Strategy", "Overall coordination", "Final product decisions"],

  links: [
    { kind: "linkedin", label: "LinkedIn", detail: "Elango S", url: "https://www.linkedin.com/in/elango-s-a7a8aa367/" },
    { kind: "github", label: "GitHub", detail: "sivakumarelango10-art", url: "https://github.com/sivakumarelango10-art" },
    { kind: "instagram", label: "Instagram", detail: "@_elanxzz_", url: "https://www.instagram.com/_elanxzz_/" },
    { kind: "instagram", label: "Instagram", detail: "@elanxzzstories", url: "https://www.instagram.com/elanxzzstories/" },
  ] as ProfileLink[],

  /* Not supplied yet: add verified details here and they will appear on the founder page. */
  education: [] as string[],
  experience: [] as string[],
  achievements: [] as string[],
} as const;
