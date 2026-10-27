/**
 * Detailed leadership profiles, keyed by team member id. Everything here comes from material the
 * person supplied to SINC (for example their résumé). Personal contact details (phone, email,
 * home city), grades and job-search statements are deliberately not published.
 * Empty or missing fields are simply not shown on the profile page.
 */
import type { Project } from "./founder";

export interface Experience { role: string; org: string; when?: string; text: string }
export interface Education { award: string; school: string; when?: string }

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
}

export const PROFILES: Record<string, LeaderProfile> = {
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
