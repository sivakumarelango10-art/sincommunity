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
  /** 20 words: who this role meets at SINC */
  description: string;
  /** for each "I want to" choice: three 6-word possibilities and the three kinds of people or places the illustration connects to */
  plans: Record<IntentId, { points: [string, string, string]; connects: [string, string, string] }>;
}

export const ROLES: Role[] = [
  {
    id: "students", label: "Students", singular: "student",
    headline: "Learn by building with others.",
    description: "Bring your curiosity. Meet classmates to build with, seniors who share what they learned, and teams looking for fresh energy.",
    plans: {
      build: { points: ["Start a first project with peers", "Find teammates for your next hackathon", "Turn class ideas into working prototypes"], connects: ["Peers", "Developers", "Designers"] },
      learn: { points: ["Learn from seniors who have shipped", "Get feedback on your first projects", "Pick up skills your course skips"], connects: ["Mentors", "Seniors", "Peers"] },
      explore: { points: ["Discover fields beyond your own course", "Join projects that need extra hands", "See where your skills fit best"], connects: ["Projects", "Hackathons", "Teams"] },
    },
  },
  {
    id: "developers", label: "Developers", singular: "developer",
    headline: "Code is better with good company.",
    description: "Write code that matters. Meet designers who shape what you build, founders with real problems, and developers to learn alongside.",
    plans: {
      build: { points: ["Pair with designers on real products", "Join founders building their first version", "Ship side projects with other developers"], connects: ["Designers", "Founders", "Product teams"] },
      learn: { points: ["Review code with more experienced developers", "Learn new stacks by building together", "Share what you know through mentoring"], connects: ["Mentors", "Peers", "Code reviewers"] },
      explore: { points: ["Find open projects that need contributors", "Explore AI, web and mobile work", "Meet teams looking for technical partners"], connects: ["Open projects", "Startups", "AI teams"] },
    },
  },
  {
    id: "designers", label: "Designers", singular: "designer",
    headline: "Give great ideas their shape.",
    description: "Give ideas their shape. Meet developers who bring designs to life, founders who value clarity, and creators who think visually.",
    plans: {
      build: { points: ["Design products together with your developers", "Shape a founder’s idea into screens", "Turn rough sketches into usable interfaces"], connects: ["Developers", "Founders", "Creators"] },
      learn: { points: ["Get honest critique on design work", "Learn how developers build your designs", "Grow your skills in UX research"], connects: ["Mentors", "Developers", "Reviewers"] },
      explore: { points: ["Find projects that need design leadership", "Explore brand, product and motion work", "Build a portfolio with real projects"], connects: ["Startups", "Brands", "Projects"] },
    },
  },
  {
    id: "founders", label: "Founders", singular: "founder",
    headline: "Find the people who see it too.",
    description: "Start with a problem worth solving. Meet possible co-founders, early teammates and advisors who bring the strengths you are missing.",
    plans: {
      build: { points: ["Find a co-founder who complements you", "Recruit early teammates for your idea", "Build and test your first version"], connects: ["Co-founders", "Developers", "Designers"] },
      learn: { points: ["Learn from founders who started earlier", "Test your idea with honest people", "Find advisors for your next decision"], connects: ["Advisors", "Mentors", "Early users"] },
      explore: { points: ["Meet people with problems worth solving", "Find collaborators across different skill sets", "Discover ideas that deserve a team"], connects: ["Builders", "Researchers", "Students"] },
    },
  },
  {
    id: "creators", label: "Creators", singular: "creator",
    headline: "Make something people remember.",
    description: "Make work people remember. Meet designers, developers and storytellers, share what you create, and find new ways to reach people.",
    plans: {
      build: { points: ["Produce content with designers and developers", "Launch a channel or project together", "Turn your ideas into shareable work"], connects: ["Designers", "Developers", "Marketers"] },
      learn: { points: ["Learn editing, design and storytelling skills", "Get feedback before you publish work", "Study how other creators grow audiences"], connects: ["Editors", "Designers", "Mentors"] },
      explore: { points: ["Find projects that need a storyteller", "Collaborate with brands and new communities", "Explore video, writing and design work"], connects: ["Brands", "Projects", "Communities"] },
    },
  },
  {
    id: "researchers", label: "Researchers", singular: "researcher",
    headline: "Take discovery beyond the lab.",
    description: "Take discovery beyond the lab. Meet builders who turn findings into tools, founders with real problems, and other curious minds.",
    plans: {
      build: { points: ["Turn research findings into usable tools", "Find developers to build your prototypes", "Work on projects across different disciplines"], connects: ["Developers", "Founders", "Designers"] },
      learn: { points: ["Learn methods from other research fields", "Share your findings with curious people", "Get feedback on papers and ideas"], connects: ["Students", "Mentors", "Other fields"] },
      explore: { points: ["Find real problems that need research", "Explore questions across science and technology", "Meet teams who need research partners"], connects: ["Startups", "Labs", "Projects"] },
    },
  },
  {
    id: "freelancers", label: "Freelancers", singular: "freelancer",
    headline: "Go further than you can alone.",
    description: "Go further than you can alone. Meet trusted collaborators for bigger projects, complementary skills, and peers who understand independent work.",
    plans: {
      build: { points: ["Team up for projects beyond solo", "Find partners with skills you lack", "Deliver bigger work with trusted collaborators"], connects: ["Developers", "Designers", "Writers"] },
      learn: { points: ["Learn pricing and client work together", "Pick up skills clients ask for", "Get feedback on proposals and portfolios"], connects: ["Mentors", "Peers", "Founders"] },
      explore: { points: ["Discover projects that need your skills", "Meet founders looking for flexible help", "Find collaborators for recurring client work"], connects: ["Founders", "Projects", "Agencies"] },
    },
  },
  {
    id: "ai-engineers", label: "AI Engineers", singular: "AI engineer",
    headline: "Point powerful tools at real problems.",
    description: "Point powerful tools at real problems. Meet domain experts with problems worth solving, product thinkers, designers and fellow AI engineers.",
    plans: {
      build: { points: ["Build AI features with product teams", "Pair with domain experts on problems", "Turn models into tools people use"], connects: ["Domain experts", "Designers", "Founders"] },
      learn: { points: ["Learn new models and tools together", "Share experiments and results with peers", "Get feedback on your model choices"], connects: ["Researchers", "Mentors", "Data scientists"] },
      explore: { points: ["Find problems where AI truly helps", "Explore research, product and startup work", "Meet teams looking for AI partners"], connects: ["Startups", "Researchers", "Projects"] },
    },
  },
];

export type IntentId = "build" | "learn" | "explore";

export interface Intent {
  id: IntentId;
  label: string;
}

export const INTENTS: Intent[] = [
  { id: "build", label: "Build something" },
  { id: "learn", label: "Learn and grow" },
  { id: "explore", label: "Explore opportunities" },
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
/** one sentence, shown bold */
export const MISSION =
  "To bring developers, designers, students and founders together so they can connect, collaborate and turn their ideas into real projects.";
/** the SINC community's vision, as short points */
export const VISION = [
  "A community where no one has to pursue their ambitions alone.",
  "Finding the right teammates and mentors is easy, whatever your skills or background.",
  "Ideas grow into collaborations, projects and products through shared work.",
  "Every success opens new opportunities for the next person.",
];

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
    a: "SINC, the Society for Innovation, Network & Collaboration, is a technology-focused community and collaboration ecosystem where ambitious people connect, collaborate, learn, build and grow together. It brings developers, designers, students, founders and innovators together so they can find teammates, learn from one another and turn ideas into real projects.",
  },
  {
    id: "stands",
    q: "What does SINC stand for?",
    a: "SINC stands for the Society for Innovation, Network & Collaboration. Its official website is sincommunity.in, and it is on Instagram as @sincommunity.in.",
  },
  {
    id: "leaders",
    q: "Who founded SINC, and who leads it?",
    a: "SINC was founded by Elango S. Its co-founders are Karmjit SG and Prajith P, and its founding advisor is Aaditya R M. Their profiles and photographs are on the leadership page at sincommunity.in/leadership.",
  },
  {
    id: "official",
    q: "What is SINC’s official website, and how do I contact SINC?",
    a: "SINC’s official website is sincommunity.in, its official Instagram account is @sincommunity.in, its LinkedIn page is linkedin.com/company/sincommunity, and its contact email is contact@sincommunity.in. SINC, the Society for Innovation, Network & Collaboration, is not connected with other organisations, companies or communities that use the names SINC or SIN.",
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
    id: "where",
    q: "Where is SINC based?",
    a: "SINC is incubated at Yenepoya (Deemed-to-be University), Bengaluru Campus, in Bengaluru, Karnataka. You can join the community online through the SINC platform, and reach the team at contact@sincommunity.in.",
  },
  {
    id: "join",
    q: "How do I join?",
    a: "Select “Join SINC” to open the SINC platform. There you can sign up for an account, or log in if you already have one. SINC works in your web browser today; Android and iPhone apps are coming soon.",
  },
];
