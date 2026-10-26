/**
 * Website copy: story chapters, explorer roles and intents, ecosystem stages, values and FAQs.
 * Everything here describes SINC's purpose and the possibilities of its community.
 * Do not add statistics, testimonials or claims that SINC has not verified.
 */

/* ---------------------------------------------------------------- opening story */
export const INTRO_SCENES = [
  { id: "a", label: "An idea" },
  { id: "b", label: "Different strengths" },
  { id: "c", label: "Connection" },
  { id: "d", label: "Our people" },
  { id: "e", label: "Our belief" },
  { id: "f", label: "SINC" },
] as const;

/* ---------------------------------------------------------------- Why SINC exists */
export interface StoryChapter {
  id: string;
  kicker: string;
  title: string;
  /** a word or phrase inside `title` that gains emphasis when the chapter is active */
  emphasis: string;
  body: string;
}

export const STORY_CHAPTERS: StoryChapter[] = [
  {
    id: "ambition",
    kicker: "It starts with you",
    title: "People everywhere have ideas and ambition.",
    emphasis: "ideas and ambition",
    body: "A student with a question. A developer with a side project. A founder with a problem worth solving. Ambition shows up everywhere, in every kind of person.",
  },
  {
    id: "distance",
    kicker: "The gap",
    title: "Finding complementary people can be difficult.",
    emphasis: "complementary people",
    body: "The person who can design what you build, or build what you imagine, is often outside your usual circle. Good ideas stall when the right people never meet.",
  },
  {
    id: "space",
    kicker: "What SINC does",
    title: "SINC creates space for connection and collaboration.",
    emphasis: "connection and collaboration",
    body: "SINC brings together people with different skills, ideas and perspectives, so they can find collaborators, teammates, mentors and co-founders who share their drive.",
  },
  {
    id: "together",
    kicker: "What happens next",
    title: "People learn, build and grow together.",
    emphasis: "learn, build and grow",
    body: "When different strengths meet, people learn from one another, take on bigger ideas and turn them into real work, side by side.",
  },
  {
    id: "forward",
    kicker: "Where it leads",
    title: "Progress creates opportunities for others.",
    emphasis: "opportunities for others",
    body: "Every collaboration can open a door for someone new. That is the community we are building: one where shared progress keeps moving forward.",
  },
];

/* ---------------------------------------------------------------- Find your place */
export type RoleId =
  | "students" | "developers" | "designers" | "founders"
  | "creators" | "researchers" | "freelancers" | "ai-engineers";

export interface Role {
  id: RoleId;
  label: string;
  singular: string;
  headline: string;
  description: string;
  /** complementary strengths shown in the illustration */
  connects: [string, string, string];
}

export const ROLES: Role[] = [
  {
    id: "students", label: "Students", singular: "student",
    headline: "Learn by building with others.",
    description: "Bring your curiosity. Find peers to start a project with, people further along who can share what they know, and teammates for your next hackathon.",
    connects: ["Peers", "Builders", "Mentors"],
  },
  {
    id: "developers", label: "Developers", singular: "developer",
    headline: "Code is better with good company.",
    description: "Meet designers who can shape what you build, founders with problems worth solving, and other developers to learn alongside.",
    connects: ["Designers", "Founders", "Developers"],
  },
  {
    id: "designers", label: "Designers", singular: "designer",
    headline: "Give great ideas their shape.",
    description: "Find developers who can bring your designs to life, founders who value clarity, and creators who think visually too.",
    connects: ["Developers", "Founders", "Creators"],
  },
  {
    id: "founders", label: "Founders", singular: "founder",
    headline: "Find the people who see it too.",
    description: "Meet people who might become co-founders, early teammates or advisors, and test your idea with people who bring different strengths.",
    connects: ["Co-founders", "Developers", "Designers"],
  },
  {
    id: "creators", label: "Creators", singular: "creator",
    headline: "Make something people remember.",
    description: "Collaborate with designers, developers and storytellers, share your work and learn new ways to bring ideas to an audience.",
    connects: ["Designers", "Marketers", "Developers"],
  },
  {
    id: "researchers", label: "Researchers", singular: "researcher",
    headline: "Take discovery beyond the lab.",
    description: "Explore ideas across disciplines, find builders who can turn findings into something usable, and share knowledge with curious people.",
    connects: ["Builders", "Founders", "Students"],
  },
  {
    id: "freelancers", label: "Freelancers", singular: "freelancer",
    headline: "Go further than you can alone.",
    description: "Meet trusted collaborators for larger projects, people with complementary skills, and peers who understand independent work.",
    connects: ["Collaborators", "Designers", "Developers"],
  },
  {
    id: "ai-engineers", label: "AI Engineers", singular: "AI engineer",
    headline: "Point powerful tools at real problems.",
    description: "Find domain experts with problems worth solving, product thinkers and designers, and other engineers exploring what AI can do.",
    connects: ["Domain experts", "Designers", "Founders"],
  },
];

export type IntentId = "build" | "learn" | "explore";

export interface Intent {
  id: IntentId;
  label: string;
  possibilities: [string, string, string];
}

export const INTENTS: Intent[] = [
  {
    id: "build", label: "Build something",
    possibilities: ["Find a project team", "Meet collaborators with complementary skills", "Turn an idea into a first version"],
  },
  {
    id: "learn", label: "Learn and grow",
    possibilities: ["Learn from peers and mentors", "Share what you know", "Get honest feedback on your work"],
  },
  {
    id: "explore", label: "Explore opportunities",
    possibilities: ["Explore ideas across disciplines", "Discover projects to contribute to", "Meet people with different perspectives"],
  },
];

/* ---------------------------------------------------------------- Ecosystem */
export interface Stage {
  id: string;
  name: string;
  line: string;
  description: string;
}

export const STAGES: Stage[] = [
  { id: "ideas", name: "Ideas", line: "Every great thing starts with a what-if.",
    description: "A question, a spark, a problem worth solving. Bring it into a space where other people can help it grow." },
  { id: "collaborations", name: "Collaborations", line: "Different strengths, one direction.",
    description: "An idea finds people who complete it: someone who builds, someone who designs, someone who asks what is next." },
  { id: "projects", name: "Projects", line: "Talk turns into shared work.",
    description: "Collaborators commit to something concrete, divide the work and start making it real." },
  { id: "products", name: "Products", line: "Work that people can use.",
    description: "Some projects grow into products that solve a real problem for real people." },
  { id: "companies", name: "Companies", line: "A team with a future.",
    description: "A few products may grow into companies, with a team, a purpose and room to grow." },
  { id: "opportunities", name: "Opportunities", line: "Success opens doors for others.",
    description: "Progress creates new roles, new problems to solve and new reasons to connect, and those spark the next ideas." },
];

/* ---------------------------------------------------------------- Mission, vision, values */
export const MISSION =
  "Bring people with different strengths together, encourage meaningful collaboration, and help them turn shared ambition into action.";
export const VISION =
  "A growing ecosystem where people, ideas, and opportunities connect—and progress opens doors for others.";

export const VALUES = [
  { id: "collaboration", name: "Collaboration", text: "Bring different strengths to the same table, and move forward together." },
  { id: "curiosity", name: "Curiosity", text: "Ask better questions, explore new ideas and stay open to other ways of doing things." },
  { id: "trust", name: "Trust and accountability", text: "Show up, follow through, and treat every connection with honesty and respect." },
  { id: "inclusion", name: "Inclusion", text: "Different backgrounds make stronger teams. Make room for everyone to contribute and belong." },
  { id: "learning", name: "Learning and growth", text: "Learn from the process, share what you know and help someone take their next step." },
  { id: "initiative", name: "Initiative", text: "Turn intentions into action, and take ownership of your contribution." },
  { id: "impact", name: "Shared impact", text: "Create something useful, and let its success open a door for someone else." },
];

/* ---------------------------------------------------------------- FAQ */
export const FAQS = [
  {
    id: "what",
    q: "What is SINC?",
    a: "SINC, the Society for Innovation, Network & Collaboration, is a growing community that connects people and helps them work toward their ambitions. It brings together people with different skills, ideas and perspectives so they can find collaborators, learn from one another and build together.",
  },
  {
    id: "who",
    q: "Who can join?",
    a: "Anyone with ambition and curiosity: students, developers, designers, founders, creators, researchers, freelancers, AI engineers and people who simply want to learn and build with others.",
  },
  {
    id: "idea",
    q: "Do I need an existing idea or team?",
    a: "No. You can arrive with an idea, a skill, a question or simply the drive to learn. Finding the right people is what SINC is for.",
  },
  {
    id: "connections",
    q: "What kinds of connections can I explore?",
    a: "Teammates for a project, collaborators with complementary skills, peers to learn with, people who can share their experience, and potential co-founders. The connections you make depend on the people you meet and what you choose to build together.",
  },
  {
    id: "join",
    q: "How do I join?",
    a: "Select “Join SINC” to open the SINC platform. There you can sign up for an account, or log in if you already have one.",
  },
];
