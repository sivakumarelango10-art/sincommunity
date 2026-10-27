/**
 * /llms.txt — a short, plain-text description of SINC with links to its main pages, following the
 * proposed llms.txt format. Some AI tools read it; it is not a ranking signal and guarantees nothing.
 * Generated from the same data as the website, so the facts always match the pages.
 */
import { SITE, SITE_URL } from "../config/site";
import { LEADERS } from "../data/leadership";
import { ROUTES } from "./routes";

export function llmsTxt(): string {
  const page = (id: string) => ROUTES.find((r) => r.id === id)!;
  const link = (path: string, label: string, note: string) => `- [${label}](${SITE_URL}${path === "/" ? "/" : path}): ${note}`;
  return [
    `# ${SITE.name} – ${SITE.fullName}`,
    "",
    `> ${SITE.definition} Official website: ${SITE_URL}/`,
    "",
    `${SITE.name} is incubated at ${SITE.incubator}, ${SITE.address.locality}, ${SITE.address.region}, India. Contact: ${SITE.email}. Instagram: ${SITE.social.instagram.url}`,
    "",
    "## Leadership",
    ...LEADERS.map((l) => link(l.path, `${l.member.name} – ${l.member.role}`, l.summary)),
    "",
    "## Pages",
    link("/", "Home", page("home").description),
    link("/about", "About SINC", page("about").description),
    link("/leadership", "Leadership", page("leadership").description),
    link("/team", "Meet the team", page("team").description),
    link("/contact", "Contact", page("contact").description),
    "",
    "## Optional",
    link("/privacy", "Privacy Policy", page("privacy").description),
    link("/terms", "Terms of Use", page("terms").description),
    "",
  ].join("\n");
}
