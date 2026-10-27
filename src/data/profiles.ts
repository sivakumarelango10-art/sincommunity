/**
 * Detailed leadership profiles, keyed by team member id. Everything here comes from material the
 * person supplied to SINC (for example their résumé). Personal contact details (phone, email,
 * home city), grades and job-search statements are deliberately not published.
 * Empty or missing fields are simply not shown on the profile page.
 */
import type { Project, ProfileLink } from "./founder";

export interface Experience { role: string; org: string; when?: string; text: string }
export interface Education { award: string; school: string; when?: string; /** still studying here */ current?: boolean }

export interface LeaderProfile {
  /** short line under the name, e.g. their field */
  headline?: string;
  /** search description (max 160 characters); defaults to name, role and responsibilities */
  description?: string;
  bio: string[];
  education?: Education[];
  experience?: Experience[];
  projects?: Project[];
  skills?: string[];
  certifications?: string[];
  achievements?: string[];
  activities?: string[];
  /** public profiles the person lists on their own résumé */
  links?: ProfileLink[];
}

export const PROFILES: Record<string, LeaderProfile> = {
  // source: Karmjit SG's résumé, supplied by SINC (27 Oct 2026); public links checked the same day
  karmjith: {
    headline: "Full-stack developer and AI/ML enthusiast",
    description:
      "Karmjit SG, Co-Founder of SINC (Society for Innovation, Network & Collaboration), a full-stack developer and B.Tech CSE (AI & ML) student.",
    bio: [
      "Karmjit is a B.Tech Computer Science Engineering (Artificial Intelligence & Machine Learning) student at Yenepoya University, through the Kalvium programme. He builds full-stack web applications and AI/ML projects, and is interested in software engineering, developer tools and practical product development.",
      "He works across the stack with React, Next.js, Tailwind CSS, Node.js, FastAPI, Spring Boot, PostgreSQL, MongoDB and Supabase, and on computer vision with TensorFlow and MobileNetV2. During a web development internship at Zyrocore he worked on development, debugging, UI improvements and deployment.",
      "As a Co-Founder of SINC, he works on design coordination, product design and UI/UX direction.",
    ],
    education: [
      { award: "B.Tech, Computer Science Engineering (Artificial Intelligence & Machine Learning)", school: "Yenepoya University (Kalvium programme)", current: true },
    ],
    experience: [
      { role: "Web Development Intern", org: "Zyrocore", text: "Worked on real-world web application development, debugging, UI improvements, deployment and project delivery." },
      { role: "Developer", org: "Anushkaa Knits World / ASP Fashions", text: "Developed and deployed an e-commerce web application, working with Supabase, authentication, storage, Git and GitHub, and Vercel deployment troubleshooting." },
    ],
    projects: [
      { name: "Lab Allotment System", text: "A full-stack lab allocation platform with student and faculty interfaces, an admin dashboard, authentication and data management." },
      { name: "DevMate AI", text: "A developer productivity application with a React front end and a FastAPI back end, built around AI-assisted coding workflows." },
      { name: "AI Waste Management System", text: "Waste classification with TensorFlow and MobileNetV2, sorting images into green-bin and red-bin categories." },
      { name: "SmartSpend – Revenue Tracker", text: "A revenue and finance tracker designed for practical household use: daily tracking, budgeting and usability." },
      { name: "Synaptix – Holographic Gesture Interface", text: "An experimental AI-powered gesture interface for touchless interaction, using computer vision and an interactive UI." },
      { name: "Anushkaa Knits World / ASP Fashions", text: "An e-commerce web application with product browsing, admin product management, Supabase integration and storage." },
    ],
    skills: [
      "Python", "Java", "JavaScript", "TypeScript", "HTML5", "CSS3", "React", "Next.js", "Tailwind CSS", "UI/UX implementation",
      "Node.js", "FastAPI", "Flask", "Spring Boot", "REST APIs", "PostgreSQL", "MongoDB", "SQL", "Supabase", "TensorFlow",
      "MobileNetV2", "Computer vision", "Image classification", "Prompt engineering", "Git", "GitHub", "Vercel",
    ],
    activities: [
      "Vibeathon 2025, Replit × Polaris School of Technology, Bengaluru (participant)",
      "ESoC 2026 (participant)",
      "INCON-SDG 2026, Yenepoya University: research project “AI-Based Early Warning System for Identifying At-Risk Students in Higher Education”",
      "Yenepoya University hackathon activities, Mangalore campus",
    ],
    links: [
      { kind: "github", label: "GitHub", detail: "karmjitsg09", url: "https://github.com/karmjitsg09" },
      { kind: "website", label: "Portfolio", detail: "karmjit.me", url: "https://karmjit.me/" },
    ],
  },
  // source: Prajith P's résumé, supplied by SINC (27 Oct 2026); public links checked the same day
  prajith: {
    headline: "Full-stack developer and AI & machine learning student",
    description:
      "Prajith P, Co-Founder of SINC (Society for Innovation, Network & Collaboration), a full-stack developer and B.Tech AI & ML student.",
    bio: [
      "Prajith is a B.Tech Artificial Intelligence & Machine Learning student at Yenepoya (Deemed to be University). He builds full-stack applications and AI-assisted tools, and is interested in software engineering and applied AI.",
      "He works with React, TypeScript, Python, FastAPI, PostgreSQL and Supabase. With his team Kalvi Coders, he placed second overall among 80 teams at a 2026 hackathon with Syllora, an AI study assistant.",
      "As a Co-Founder of SINC, he works on design, UI/UX collaboration and product interface development.",
    ],
    education: [
      { award: "B.Tech, Artificial Intelligence & Machine Learning", school: "Yenepoya (Deemed to be University)", when: "2025 – 2029 (expected)", current: true },
    ],
    projects: [
      { name: "Syllora – AI Study Assistant", text: "Document-grounded study features using PDF text extraction and OCR, semantic search, and local language-model question answering with source context. Built with React, FastAPI, PostgreSQL/pgvector, Supabase and Ollama." },
      { name: "FixMyCity – Civic Service Platform", text: "Citizen, worker and administrator workflows for reporting civic issues, assigning work and tracking complaint status, with APIs for complaints, activity records and photo uploads. Built with React, Node.js, PostgreSQL and Supabase." },
      { name: "Avizhtham Herbals – E-commerce Website", text: "A responsive storefront for herbal products across desktop and mobile, built with Next.js, React, TypeScript and reusable UI components." },
      { name: "TraceShield AI – Fraud Detection Prototype", text: "REST endpoints in Python and FastAPI that flag anomalous transactions with scikit-learn’s Isolation Forest and return fraud-risk predictions." },
      { name: "ProofPath – Skills Verification MVP", text: "A collaborative skill-verification platform with challenge submissions, rubric-based feedback and student portfolios, built with React, TypeScript and Supabase." },
    ],
    skills: [
      "Python", "Java", "C++", "JavaScript", "TypeScript", "React", "Next.js", "Vite", "HTML", "CSS", "Tailwind CSS", "UI/UX design",
      "FastAPI", "Node.js", "Express", "REST APIs", "PostgreSQL", "MongoDB", "Supabase", "scikit-learn", "Ollama",
      "Semantic search / RAG", "GitHub", "Vercel", "Figma",
    ],
    achievements: ["Second place overall among 80 teams at a 2026 hackathon, with team Kalvi Coders, for Syllora (study-material search and Q&A)"],
    links: [{ kind: "github", label: "GitHub", detail: "Prajith321", url: "https://github.com/Prajith321" }],
  },
  // source: Aaditya R M's résumé, supplied by SINC (27 Oct 2026)
  "aaditya-r-m": {
    headline: "Machine learning and deep learning, computer vision",
    description:
      "Aaditya R M, Founding Advisor of SINC (Society for Innovation, Network & Collaboration), and an M.Tech CSE student specialising in machine learning.",
    bio: [
      "Aaditya is an M.Tech Computer Science and Engineering student at Amrita Vishwa Vidyapeetham, Chennai, specialising in machine learning and deep learning. His hands-on work covers computer vision, transformer architectures and medical image analysis.",
      "He works in Python on data preprocessing, model training and performance evaluation, using TensorFlow, PyTorch, scikit-learn and OpenCV. Before his postgraduate studies he completed a B.Tech in Information Technology at PSG College of Technology, Coimbatore.",
      "As SINC’s Founding Advisor, he provides strategic guidance, advice and support, and direction for the organisation.",
    ],
    education: [
      { award: "M.Tech, Computer Science and Engineering", school: "Amrita Vishwa Vidyapeetham, Chennai", when: "2025 – 2027" },
      { award: "B.Tech, Information Technology", school: "PSG College of Technology, Coimbatore", when: "2022 – 2025" },
      { award: "Diploma in Information Technology", school: "PSG Polytechnic College, Coimbatore", when: "2019 – 2022" },
    ],
    experience: [
      {
        role: "Project Intern – Automation Engineer",
        org: "JK Automations, Coimbatore",
        when: "Apr – Jun 2024",
        text: "Developed and enhanced industrial automation tools with Siemens SCADA WinCC and C++, working on CNC machine data integration, sensor monitoring and real-time data acquisition for manufacturing systems. Implemented new features and resolved more than 40 software bugs to improve system stability.",
      },
    ],
    projects: [
      {
        name: "Automated Brain Tumor Segmentation using MRI Images",
        text: "A medical image segmentation system built with convolutional neural networks and transformer-based architectures at Amrita Vishwa Vidyapeetham, with image preprocessing, augmentation and model optimisation. It reached 93% accuracy and an improved Dice coefficient for tumour boundary detection, evaluated on accuracy, precision, recall, F1-score and confusion matrices.",
      },
      {
        name: "Schizophrenia Classification using Vision Transformer Models",
        text: "Deep learning pipelines for MRI image classification at PSG College of Technology, implementing ViT, CvT, Swin Transformer and DeiT models and comparing them on accuracy and F1-score. The transformer models improved classification reliability over baseline CNN models.",
      },
      {
        name: "Face Mask and Social Distance Detection System",
        text: "A real-time computer vision system in Python and OpenCV with face detection, mask classification and distance estimation, and a JavaScript front end for monitoring alerts and visualisation.",
      },
    ],
    skills: [
      "Python", "C++", "JavaScript", "SQL", "Deep learning", "Supervised and unsupervised learning", "CNNs",
      "Vision Transformers (ViT)", "Swin Transformer", "Feature engineering", "Model evaluation", "TensorFlow", "PyTorch",
      "scikit-learn", "OpenCV", "NumPy", "Pandas", "Matplotlib", "Git", "Siemens SCADA WinCC", "HTML", "CSS", "WordPress",
    ],
    certifications: ["C++ Programming (100 hours), E Box"],
    achievements: ["Second place, CRYPTO GATHERERS, Kumaraguru College of Technology"],
    activities: [
      "Inter-college cricket tournament, PSG College of Technology",
      "Volunteer, ICOISCIS conference",
      "Executive member, CAP and Nature Club",
    ],
  },
};
