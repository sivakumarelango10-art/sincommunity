/**
 * The SINC team. Names and display roles must match exactly what the team has approved.
 * Photos are individually cropped derivatives of the originals in /assets-original
 * (crop boxes: scripts/photo-crops.json, rebuild with `npm run images`).
 */
export type TeamGroup = "founding" | "advisor" | "team";

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  group: TeamGroup;
  /** focal point (CSS object-position) used for the portrait crop */
  focus: string;
  /** what they look after, as confirmed by SINC (shown on the team page) */
  responsibilities?: string[];
}

export const TEAM: TeamMember[] = [
  { id: "elango-s", name: "Elango S", role: "Founder", group: "founding", focus: "50% 30%",
    responsibilities: ["SINC vision", "Product direction", "Strategy", "Overall coordination", "Final product decisions"] },
  { id: "karmjith", name: "Karmjit SG", role: "Co-Founder", group: "founding", focus: "50% 30%",
    responsibilities: ["Design coordination", "Product design", "UI/UX direction"] },
  { id: "prajith", name: "Prajith P", role: "Co-Founder", group: "founding", focus: "50% 30%",
    responsibilities: ["Design", "UI/UX collaboration", "Product interface development"] },
  { id: "aaditya-r-m", name: "Aaditya R M", role: "Founding Advisor", group: "advisor", focus: "50% 30%",
    responsibilities: ["Strategic guidance", "Advice and support", "Direction for the organisation"] },
  { id: "vaishnavi-m", name: "Vaishnavi M", role: "Tester", group: "team", focus: "50% 30%" },
  { id: "meghana-p-banda", name: "Meghana P Banda", role: "Tester", group: "team", focus: "50% 30%" },
  { id: "dhakshatha", name: "Dhakshatha S", role: "Developer & Social Media Team", group: "team", focus: "50% 30%" },
  { id: "ishita-das", name: "Ishita Das", role: "Designer", group: "team", focus: "50% 25%" },
  { id: "mohana-priya-g", name: "Mohana Priya G", role: "Designer", group: "team", focus: "50% 30%" },
  { id: "dhanusri-t", name: "Dhanusri T", role: "Tester & Developer", group: "team", focus: "50% 30%" },
];

/** bump after replacing any photo, so browsers fetch the new images instead of cached ones */
const PHOTO_REV = "3";
export const portrait = (id: string, size: 480 | 800 = 480) => `/images/team/${id}-portrait-${size}.webp?v=${PHOTO_REV}`;
export const square = (id: string, size: 320 | 640 = 320) => `/images/team/${id}-square-${size}.webp?v=${PHOTO_REV}`;
export const portraitSrcSet = (id: string) => `${portrait(id, 480)} 480w, ${portrait(id, 800)} 800w`;
export const squareSrcSet = (id: string) => `${square(id, 320)} 320w, ${square(id, 640)} 640w`;
