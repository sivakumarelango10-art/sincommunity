import type { ProfileLink } from "../data/founder";
import { IconArrowUpRight, IconGitHub, IconInstagram, IconLinkedIn } from "./ui";

const ICONS = { linkedin: IconLinkedIn, github: IconGitHub, instagram: IconInstagram, website: IconArrowUpRight };

/** Verified profile links, each opening in a new tab. */
export function ProfileLinks({ links, person, className = "" }: { links: readonly ProfileLink[]; person: string; className?: string }) {
  if (!links.length) return null;
  return (
    <ul className={`profile-links ${className}`} aria-label={`${person} online`}>
      {links.map((l) => {
        const Icon = ICONS[l.kind];
        return (
          <li key={l.url}>
            <a href={l.url} target="_blank" rel="noopener noreferrer me">
              <Icon /> <span>{l.label}</span>{l.detail && <span className="profile-links__detail">{l.detail}</span>}
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
