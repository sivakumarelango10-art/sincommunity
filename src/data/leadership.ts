/**
 * SINC leadership (owner-confirmed designations). Each leader has a profile page at
 * /leadership/<slug>. Summaries are built only from confirmed facts: name, designation and the
 * responsibilities SINC supplied. Add a verified biography as `bio` when one is provided.
 */
import { TEAM, type TeamMember } from "./team";
import { FOUNDER } from "./founder";

export interface Leader {
  member: TeamMember;
  slug: string;
  path: string;
  /** one factual sentence: who they are at SINC */
  summary: string;
  /** search description for the profile page (under 160 characters) */
  description: string;
  /** verified biography paragraphs (none supplied yet for co-founders and the advisor) */
  bio: string[];
}

const ORG = "SINC (Society for Innovation, Network & Collaboration)";
const member = (id: string) => TEAM.find((m) => m.id === id)!;
// "Design coordination" → "design coordination", but "UI/UX direction" keeps its capitals
const lower = (s: string) => (/^[A-Z][a-z]/.test(s) ? s[0].toLowerCase() + s.slice(1) : s);
const list = (items: string[]) => {
  const w = items.map(lower);
  if (w.length < 2) return w[0];
  const inner = w.some((x) => x.includes(" and "));
  if (w.length === 2 && inner) return w.join(", "); // "strategic guidance, advice and support"
  return `${w.slice(0, -1).join(", ")}${inner ? "," : ""} and ${w[w.length - 1]}`; // "advice and support, and direction"
};

const make = (id: string, slug: string, summary: (m: TeamMember) => string, bio: string[] = []): Leader => {
  const m = member(id);
  // name, role and as many of the supplied responsibilities as fit a 160-character search snippet
  const base = `${m.name}, ${m.role} of SINC (Society for Innovation, Network & Collaboration)`;
  const items = [...(m.responsibilities ?? [])];
  let description = `${base}.`;
  for (let n = items.length; n > 0; n--) {
    const d = `${base}: ${list(items.slice(0, n))}.`;
    if (d.length <= 160) { description = d; break; }
  }
  return { member: m, slug, path: `/leadership/${slug}`, summary: summary(m), description, bio };
};

export const LEADERS: Leader[] = [
  make("elango-s", "elango-s", () => FOUNDER.intro, [...FOUNDER.bio]),
  make("karmjith", "karmjit-sg", (m) => `${m.name} is a Co-Founder of ${ORG}. As Co-Founder, ${m.name} works on ${list(m.responsibilities ?? [])}.`),
  make("prajith", "prajith-p", (m) => `${m.name} is a Co-Founder of ${ORG}. As Co-Founder, ${m.name} works on ${list(m.responsibilities ?? [])}.`),
  make("aaditya-r-m", "aaditya-r-m", (m) => `${m.name} is the Founding Advisor of ${ORG}, providing ${list(m.responsibilities ?? [])}.`),
];

export const leaderBySlug = (slug: string) => LEADERS.find((l) => l.slug === slug);
export const leaderForMember = (id: string) => LEADERS.find((l) => l.member.id === id);
export const FOUNDER_PATH = LEADERS[0].path;
