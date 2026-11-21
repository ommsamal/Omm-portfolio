// All text on the site lives here. Edit this file to update the portfolio.

export const profile = {
  name: "Omm Samal",
  headline: "Computer Science Engineer | Software Developer | AI/ML Enthusiast",
  intro:
    "Final-year computer science student at KIIT University. I build software that solves practical problems, from computer vision for exercise recovery to machine learning on stock data and responsive web interfaces.",
  email: "ommsamal85@gmail.com",
  github: "https://github.com/omm-samal",
  linkedin: "https://linkedin.com/in/omm-samal",
  resume: "/Omm_Samal_Resume.pdf",
  siteUrl: "https://omm-samal.vercel.app", // change after you deploy
};

export const nav = [
  { label: "Home", href: "/#home" },
  { label: "About", href: "/#about" },
  { label: "Skills", href: "/#skills" },
  { label: "Projects", href: "/#projects" },
  { label: "Arcade", href: "/arcade" },
  { label: "Experience", href: "/#experience" },
  { label: "Achievements", href: "/#achievements" },
  { label: "Contact", href: "/#contact" },
];

export const about = [
  "I am a B.Tech Computer Science and Engineering student at KIIT University, Bhubaneswar, graduating in 2027.",
  "Most of what I know comes from building things. I have made web applications in personal finance, healthcare AI and e-commerce, and each one taught me something different: responsive layouts, working with REST APIs, and turning a model's output into something a person can use.",
  "At Cisco I completed an AI and Data Science training programme covering Python, data science, machine learning and convolutional neural networks. That is where my interest in AI and ML moved from curiosity to regular practice.",
  "I am looking for software development roles where I can keep solving real-world problems with a team I can learn from.",
];

export const skillGroups = [
  { title: "Programming languages", items: ["C", "Python", "JavaScript"] },
  { title: "Frontend development", items: ["HTML", "CSS", "React.js (basic)", "Responsive design"] },
  { title: "Backend and APIs", items: ["REST APIs", "Web development"] },
  { title: "AI and machine learning", items: ["Machine learning", "Logistic Regression", "Random Forest", "XGBoost", "LSTM", "Streamlit"] },
  { title: "Computer vision", items: ["Computer vision", "OpenCV", "MediaPipe"] },
  { title: "Developer tools", items: ["Git", "GitHub", "Linux", "Networking OS"] },
  { title: "Computer science fundamentals", items: ["Data structures and algorithms", "Signal processing", "Circuit design", "Analog and digital systems"] },
];

export type Project = {
  id: "rehab" | "stock" | "amazon";
  name: string;
  tagline: string;
  description: string;
  details: string;
  features: string[];
  tech: string[];
  github: string; // repo link; falls back to the profile until a repo is added
  demo?: string; // add a live demo link to show the button
  flagship?: boolean;
};

export const projects: Project[] = [
  {
    id: "rehab",
    name: "Physical Rehabilitation Assistant",
    tagline: "AI-guided recovery exercises for post-surgery patients",
    description:
      "An AI-guided rehabilitation platform that helps post-surgery patients perform structured recovery exercises, with computer vision checking each movement as it happens.",
    details:
      "Recovery exercises only help when they are done correctly and regularly. This platform watches the patient through a camera, gives posture feedback in real time and keeps a record of progress, so the plan can adapt as recovery milestones are reached.",
    features: [
      "Real-time posture feedback using computer vision",
      "Monitors exercise correctness",
      "Tracks patient progress",
      "Scheduling system for sessions",
      "Adaptive exercise plans tailored to recovery milestones",
    ],
    tech: ["Python", "Machine Learning", "Computer Vision", "Web"],
    github: profile.github,
    flagship: true,
  },
  {
    id: "stock",
    name: "Stock Prediction System",
    tagline: "Next-day direction for eight NSE equities",
    description:
      "StockML predicts whether a stock will close up or down the next day, for eight NSE equities, and compares four models on a live dashboard.",
    details:
      "The project treats prediction as a classification problem: up or down tomorrow. Four models are trained and compared side by side, from simple baselines to a sequence model, and the dashboard reports their test accuracy as measured, without flattering the results.",
    features: [
      "Predicts next-day price direction for eight NSE equities",
      "Four models compared: Logistic Regression, Random Forest, XGBoost and LSTM",
      "Live Streamlit dashboard",
      "Reports honest test accuracy for every model",
    ],
    tech: ["Python", "Logistic Regression", "Random Forest", "XGBoost", "LSTM", "Streamlit"],
    github: profile.github,
  },
  {
    id: "amazon",
    name: "Amazon Clone",
    tagline: "E-commerce storefront replica",
    description:
      "A replica of the Amazon storefront UI, covering the path from product listing to a simulated payment page.",
    details:
      "Built with plain HTML, CSS and JavaScript to practise the fundamentals without a framework: layout, state for the cart, filtering and a multi-step checkout, all responsive from mobile to desktop.",
    features: [
      "Product listings and search bar",
      "Product filtering",
      "Cart system with dynamic updates",
      "Checkout flow with a simulated payment page",
      "Responsive design for mobile, tablet and desktop",
    ],
    tech: ["HTML", "CSS", "JavaScript"],
    github: profile.github,
  },
];

export const experience = [
  {
    org: "Cisco",
    role: "AI and Data Science Trainee",
    points: [
      "Completed a training-based AI and Data Science programme.",
      "Covered Python, data science, machine learning and convolutional neural networks.",
    ],
  },
  {
    org: "Self-initiated projects",
    role: "Web Developer",
    points: [
      "Built multiple web applications across personal finance, healthcare AI and e-commerce domains.",
      "Applied responsive design and REST API integration to deliver production-oriented interfaces.",
    ],
  },
];

export const education = [
  { school: "KIIT University, Bhubaneswar", detail: "B.Tech in Computer Science and Engineering", years: "2023 to 2027", score: "CGPA 7.5/10" },
  { school: "Sai International Residential School, Bhubaneswar", detail: "Class XII (CBSE)", years: "2023", score: "72%" },
  { school: "Rotary Public School, Angul", detail: "Class X (CBSE)", years: "2021", score: "70%" },
];

export const achievements = [
  { title: "1st Runner-Up, Technical Fest", where: "KIIT Fest" },
  { title: "1st Prize, Music Competition", where: "KIIT Fest" },
  { title: "Participant", where: "Smart India Hackathon (SIH)" },
];

export const positions = [
  { title: "Cyber Vault Society, KIIT", years: "2024 to present", text: "Active member of the cybersecurity society; took part in CTF competitions and awareness sessions." },
  { title: "KIIT Music Society", years: "2023 to present", text: "Band member; performed at college cultural events." },
];

export const certifications = [
  { title: "Responsive Web Design", by: "freeCodeCamp" },
  { title: "JavaScript Algorithms and Data Structures", by: "freeCodeCamp" },
  { title: "Corporate Governance", by: "Starweaver (Coursera)" },
  { title: "Ethical Decision Making for Success in the Tech Industry", by: "University of Colorado Boulder (Coursera)" },
  { title: "Business for Good: Fundamentals of Corporate Responsibility", by: "London Business School (Coursera)" },
];
