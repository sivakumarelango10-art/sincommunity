# SINC website

**Society for Innovation, Network & Collaboration** — *Where Ambition Finds Its People.*

The public brand and community website for SINC. Built with React, Vite, TypeScript and GSAP (ScrollTrigger, SplitText, DrawSVG). Every "Join SINC" and "Log In" action opens the existing SINC platform at <https://sinc-platform.vercel.app/login>, which handles sign-up and sign-in.

---

## Requirements

- [Node.js](https://nodejs.org) **20.19 or newer** (22 LTS recommended). Check with `node -v`.

## Setup and running (Windows PowerShell)

Open PowerShell in the `sinc-website` folder, then:

```powershell
npm install          # first time only — installs exact versions from package-lock.json
npm run dev          # development server with hot reload → http://localhost:5173
```

Press `Ctrl + C` to stop the server.

### Production build and preview

```powershell
npm run build        # type-checks, builds and prerenders → dist\
npm run preview      # serves the built site → http://localhost:4173
```

Upload the contents of `dist\` to any static host (Vercel, Netlify, GitHub Pages, cPanel, S3…). No server code is needed.

The same commands work in macOS/Linux terminals.

### Other scripts

| Command | What it does |
|---|---|
| `npm run typecheck` | TypeScript check only |
| `npm run images` | Rebuilds the optimised team photos and logo images from `assets-original\` |

---

## Where to edit things

| What | File |
|---|---|
| Platform link (Join / Log In), Instagram link, brand name, tagline, belief, storage keys, navigation | `src/config/site.ts` |
| Team names, roles, order, founding/team grouping, responsibilities, photo focus | `src/data/team.ts` |
| Founder profile (bio, vision, responsibilities, verified links; education/experience/achievements appear once filled in) | `src/data/founder.ts` |
| Leadership profiles (founder, co-founders, founding advisor): page address, summary and biography | `src/data/leadership.ts` (the roles and responsibilities come from `src/data/team.ts`) |
| Page titles, search descriptions, structured data (JSON-LD) and the list of pages | `src/seo/routes.ts` |
| Production web address used for canonical links, sitemap and structured data | `SITE_URL` in `src/config/site.ts` |
| About, Leadership, profile, Team, Contact, Privacy, Terms and 404 pages | `src/pages/` |
| Story chapters, "Find your place" roles and intents, ecosystem stages, mission, vision, values, FAQ, opening-story scene labels | `src/data/content.ts` |
| Opening story wording and timing | `src/components/IntroStory.tsx` (`SCENE_START`, the timeline and the words block) |
| Colours, fonts, type scale, spacing, radii, shadows, motion durations and easings | `src/styles/tokens.css` (motion values are mirrored in `src/motion/gsap.ts`) |
| Each section's layout and styling | `src/components/<Section>.tsx` and `<Section>.css` |

### Team photos

- Originals are kept untouched in `assets-original/`.
- Each photo has its own crop, measured around the face, in `scripts/photo-crops.json` (`face.x`, `face.y`, `face.headHeight` and pixel crop boxes for the `portrait` 4:5 and `square` formats).
- To change a crop: edit the box in `photo-crops.json`, then run `npm run images`. Derivatives are written to `public/images/team/` (never upscaled beyond the source pixels).
- To add a person: put the original in `assets-original/`, add an entry in `photo-crops.json`, run `npm run images`, then add them to `src/data/team.ts`.
- After replacing a photo, increase `PHOTO_REV` in `src/data/team.ts` so visitors' browsers load the new image instead of a cached one.

### Logo

`assets-original/sinc-logo.jpeg` is the supplied logo. `sinc-logo-mark-transparent.png` is the same artwork with the white background removed, used where the logo sits on blue or pale backgrounds. Optimised sizes are in `public/images/brand/`.

---

## The opening story and motion settings

- **First visit** (motion on): the ~15-second opening story plays in six scenes, then the logo travels into the header and the hero entrance plays. The visit is remembered as soon as the story starts, so refreshing never forces it again.
- **Returning visits**: the page loads directly with a short hero entrance.
- **Controls**: *Skip intro* (visible from the first frame), *Pause/Resume*, *Replay*, and `Esc`. Scrolling and focus are restored on close. *Watch our story* (hero) and *Replay our story* (footer) replay it at any time.
- **Motion off** (footer switch, remembered in this browser) or **reduced motion** set in the operating system: no automatic story, no pinned scrolling, parallax, path drawing or magnetic buttons. Content is identical, and the story can still be watched as gentle crossfades.
- **Blocked storage** (private modes, strict privacy settings): the site works normally; the story simply never plays automatically.

To show the full story again to everyone (for example after changing it), change `STORAGE_KEYS.introSeen` in `src/config/site.ts`. To test locally, clear the site's local storage in your browser's developer tools.

---

## Pages and search engines

| URL | Page |
|---|---|
| `/` | Home |
| `/about` | About SINC: what it is, who it brings together, mission, vision, values |
| `/leadership` | SINC's leadership: founder, co-founders and founding advisor, each linking to their profile |
| `/leadership/elango-s` | Elango S, Founder (full profile: bio, vision, projects, skills, education, verified links) |
| `/leadership/karmjit-sg`, `/leadership/prajith-p` | Karmjit SG and Prajith P, Co-Founders |
| `/leadership/aaditya-r-m` | Aaditya R M, Founding Advisor |
| `/founder` | Permanently redirects (308) to `/leadership/elango-s` |
| `/team` | Meet the SINC team, with responsibilities |
| `/contact` | Instagram, the SINC platform, and the founder's LinkedIn |
| `/privacy`, `/terms` | Privacy Policy and Terms of Use (written from what the site actually does; review them before relying on them legally) |
| anything else | The SINC 404 page, served with a real 404 status |

`npm run build` writes each page as its own HTML file (`dist/about.html` and so on) with its own title, description,
canonical link (`https://www.sincommunity.in/...`, the address Vercel serves; `sincommunity.in` redirects there), social sharing tags and structured data, plus `dist/sitemap.xml`,
`dist/robots.txt` and `dist/llms.txt` (a plain-text summary of SINC and its pages for AI tools, generated from the same data). `vercel.json` serves them at clean addresses (`/about`), redirects `/about/` and
`/about.html` to `/about`, redirects `/founder` to `/leadership/elango-s`, and caches the hashed files in `assets/` for a year.

To add a co-founder's or the advisor's details: add an entry for their team id in `src/data/profiles.ts`
(biography, education, experience, projects, skills, certifications, achievements, activities; every field is
optional). The profile page and its structured data pick them up automatically; empty fields are not shown.
Aaditya R M's entry, taken from his résumé, is the example. Never add phone numbers, personal email addresses,
home towns or grades. Only add public profile links (LinkedIn and so on) that the person has confirmed.

To add a page: add it to `ROUTES` in `src/seo/routes.ts`, create its component in `src/pages/`, add it to
`RoutePage` in `src/App.tsx`, and (if it belongs in the footer) to `PAGES` in `src/config/site.ts`.
The sitemap updates itself.

Known search crawlers are shown the page straight away, without the 15-second opening story; the content is the same.

## How it is built

```
src/
  config/site.ts            central links, brand text, storage keys, navigation
  data/team.ts              the team members
  data/content.ts           all section copy and FAQs
  data/founder.ts           founder profile (verified details only)
  data/leadership.ts        the four leadership profiles (addresses, summaries)
  data/profiles.ts          supplied background for co-founders and the advisor (bio, education, projects…)
  seo/routes.ts             pages, titles, descriptions, canonical links, structured data
  seo/llms.ts               llms.txt
  pages/                    About, Leadership, LeaderProfile, Founder, Team, Contact, Privacy, Terms, 404 (+ PageShell)
  motion/gsap.ts            the single animation system (plugin registration, motion tokens)
  motion/MotionContext.tsx  motion preference (OS setting + footer switch)
  motion/hooks.ts           section reveals, magnetic CTAs, scroll locking
  motion/storage.ts         storage that never throws
  components/               SiteHeader, IntroStory, Hero, StoryJourney (+StoryScene), CommunityExplorer,
                            Ecosystem, MissionValues, Team (+portrait viewer), FAQ, JoinSection, SiteFooter
  styles/tokens.css         design tokens
scripts/
  build-images.mjs          image derivatives (sharp)
  photo-crops.json          per-photo crop configuration
  prerender.mjs             renders every page to its own HTML file, and writes sitemap.xml, robots.txt and llms.txt
```

- **Prerendered HTML.** `npm run build` renders the page to static HTML, so the logo, every heading and all narrative text are in the delivered markup before JavaScript runs. React then hydrates it.
- **One animation system.** GSAP drives every timeline and scroll scene through `useGSAP`, which cleans up timelines, ScrollTriggers and SplitText on unmount, and on React StrictMode remounts in development. CSS handles only small hover/focus transitions.
- **Native scrolling.** There is no scroll hijacking. In-page links scroll in JavaScript so the motion setting always applies and the sticky header is accounted for.
- **Accessibility.** The site has semantic headings, real buttons and links, and visible focus rings. The opening story and the portrait viewer are native `<dialog>` elements with focus management. The mobile menu has a focus trap, Escape, focus restore and scroll locking. Tabs and accordions are ARIA-correct with keyboard support. The narrative stays readable without animation.

## Verified before delivery

Production build and TypeScript check, then browser tests in Chromium:

- Home page: 86 automated checks against both the production and development builds (opening story, motion settings,
  blocked storage, keyboard use, every control, touch scrolling on phone and tablet profiles).
- Every page: status codes, titles, descriptions, canonical links, robots tags, one `h1`, image alt text,
  structured data, internal links, redirects, the 404 page, sitemap, robots.txt and llms.txt; on each leadership
  profile, that the visible name and role match its Person data (196 checks, against a local
  server that follows `vercel.json` the way Vercel does).
- No horizontal overflow and no console errors at 360, 390, 768, 1024, 1440 and 1920 px and on landscape phones.
- Lighthouse (local, simulated throttling) for performance, accessibility, best practices and SEO.

Local note: `npm run preview` serves `/about` and the other pages, but unknown addresses fall back to the home page
there. On Vercel they get the SINC 404 page with a 404 status.
