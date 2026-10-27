/**
 * Founder profile. Everything here was supplied by SINC (including the founder's résumé);
 * do not add details that have not been confirmed. Personal phone number and home address are
 * deliberately not published. Empty fields are not shown on the site.
 */
export interface ProfileLink {
  label: string;
  /** shown after the label, e.g. a handle */
  detail?: string;
  url: string;
  kind: "linkedin" | "github" | "instagram" | "website";
}

export interface Project { name: string; text: string }

export const FOUNDER = {
  id: "elango-s",
  name: "Elango S",
  role: "Founder",
  title: "Founder of SINC",
  headline: "Web developer and full-stack enthusiast",
  /** photo: assets-original/elango-s-founder.png → public/images/team/elango-s-founder-sinc-*.webp */
  photo: "elango-s-founder-sinc",
  photoAlt: "Elango S, Founder of SINC",

  intro:
    "Elango S is the founder of SINC, the Society for Innovation, Network & Collaboration: a technology-focused community where ambitious people connect, collaborate, learn and build together.",
  bio: [
    "Elango is a web developer and full-stack enthusiast, and a B.Tech Computer Science and Engineering (AI & ML) student at Yenepoya (Deemed-to-be University), Bengaluru Campus, where SINC is incubated. He started SINC around one belief: no one should have to pursue their ambitions alone.",
    "As founder, he sets SINC’s vision, product direction and strategy, coordinates the team, and makes the final product decisions.",
    "He builds full-stack web applications with React, TypeScript, Node.js and Java, and is especially interested in AI-assisted development, automation and applying emerging technologies to real-world problems.",
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
    { kind: "website", label: "Portfolio", detail: "elanxzz.me", url: "https://elanxzz.me/" },
    { kind: "github", label: "GitHub", detail: "elangoss121-dev", url: "https://github.com/elangoss121-dev" },
  ] as ProfileLink[],

  education: ["B.Tech, Computer Science and Engineering (AI & ML), Yenepoya (Deemed-to-be University), Bengaluru Campus (current student)"] as string[],
  projects: [
    { name: "KalviLearn", text: "A coding learning and practice platform with structured modules, a browser code editor for Python, C++, Java and JavaScript, automated test-case evaluation, progress tracking and role-based access for admins, campus managers, mentors and students." },
    { name: "TeamSync Workspace", text: "A collaborative project management platform for creating workspaces, managing team members, organising projects, assigning tasks and tracking progress." },
    { name: "SmartTravel", text: "A full-stack travel booking platform with flight and hotel search, live flight tracking, seat and room selection, payments, cancellations and real-time updates, built with React, TypeScript, Spring Boot and MongoDB." },
    { name: "Zyrocore", text: "An e-commerce platform for an Indian streetwear brand, with size-based inventory, cart, secure checkout, Razorpay payments and an admin dashboard." },
  ] as Project[],
  skills: ["JavaScript", "TypeScript", "Python", "Java", "C++", "React", "Node.js", "Express", "Spring Boot", "MongoDB", "REST APIs", "WebSockets", "AI-assisted development"] as string[],
  languages: ["English", "Tamil"] as string[],
  achievements: [] as string[],
} as const;
