/**
 * All portfolio facts live here, separate from presentation.
 * Status labels are deliberately conservative: update them as projects mature.
 */

export type ProjectId = "zero-downtime" | "loan" | "answerfold" | "nss" | "vprint" | "lan-game";

export type StatusKind = "built" | "live" | "wip" | "concept";

export interface Project {
  id: ProjectId;
  name: string;
  kicker: string;
  status: { label: string; kind: StatusKind };
  problem: string;
  built: string[];
  /** Names that match entries in `ecosystem` light up in the stack map. */
  stack: string[];
  honesty: string;
  links: { label: string; href: string }[];
}

export const projects: Project[] = [
  {
    id: "zero-downtime",
    name: "Zero-Downtime Deployment",
    kicker: "Rolling, canary and blue-green releases on Kubernetes, with rollback when a release goes bad.",
    status: { label: "Working repo, runs locally", kind: "built" },
    problem:
      "A bad build that reaches every user at once is the expensive kind of mistake. I wanted to see how far gradual rollout and fast rollback can go with open tooling.",
    built: [
      "Express backend with health checks and a metrics endpoint, and an Astro frontend served by Nginx",
      "Kubernetes manifests for rolling updates, a canary ingress and blue-green switching",
      "Prometheus scraping and Grafana dashboards for latency, errors and throughput",
      "GitHub Actions pipeline that deploys, checks rollout status and rolls back on failure",
      "Fault-injection middleware so rollback can be tested on demand",
    ],
    stack: ["Docker", "Docker Compose", "Kubernetes", "GitHub Actions", "Prometheus", "Grafana", "Node.js", "Express.js", "React.js"],
    honesty:
      "The NSS VIT website is the test application. No production traffic, uptime figures or user counts are claimed. The simulation on this page is an illustration of the idea, not live data.",
    links: [{ label: "Repository", href: "https://github.com/Himanshux99/Zero-Downtime-Deployment-Project" }],
  },
  {
    id: "loan",
    name: "Fair Loan Underwriting",
    kicker: "Credit assessment for people with no credit history, with visible reasons and a human making the call.",
    status: { label: "Proposal and concept", kind: "concept" },
    problem:
      "New-to-credit borrowers are often rejected because there is no file to score. Bank transaction patterns can say more, but only if the decision can be explained and checked for bias.",
    built: [
      "Alternative-data features drawn from bank transactions",
      "Credit models in scikit-learn on a Pandas pipeline",
      "Per-applicant explanations with SHAP",
      "Group-level fairness checks with Fairlearn",
      "FastAPI service over PostgreSQL, with a human review step on every consequential decision",
    ],
    stack: ["Python and Pandas", "Scikit-learn", "SHAP", "Fairlearn", "FastAPI", "PostgreSQL"],
    honesty:
      "This began as a proposal and technical design. It is not a deployed lending system, and the applicant shown on this page is synthetic.",
    links: [],
  },
  {
    id: "answerfold",
    name: "AnswerFold",
    kicker: "A Chrome extension idea that folds long AI answers and jumps between your own prompts.",
    status: { label: "Concept", kind: "concept" },
    problem:
      "Long AI chats turn into endless scrolling. Finding the question you asked an hour ago takes longer than it should.",
    built: [
      "Compact mode that folds long answers to a few lines",
      "Expand a block 20 lines at a time, or show the whole answer",
      "A prompt navigator with jump-to-prompt, and collapse all",
    ],
    stack: ["JavaScript", "HTML5", "CSS3"],
    honesty:
      "Still a concept. The page above is a working mock that borrows ChatGPT's dark look to show the idea, with placeholder text. It is not affiliated with OpenAI and it is not the extension itself.",
    links: [],
  },
  {
    id: "nss",
    name: "NSS Report Generator",
    kicker: "Paste an event's WhatsApp log, get a structured report as a Word file.",
    status: { label: "Live demo", kind: "live" },
    problem:
      "Writing NSS event reports by hand is repetitive: attendance counts, objectives, a narrative, photos and formatting, every time.",
    built: [
      "Parses pasted event logs and volunteer lists for date, time, venue and attendance counts",
      "Drafts objectives, narrative, impact and conclusion with Gemini",
      "Exports a formatted .docx with tables, up to four photos and a signature block",
      "Accepts a personal Gemini API key in the interface",
    ],
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Docker", "GitHub Actions", "Vercel"],
    honesty: "The log and report in the preview are sample text written for this page.",
    links: [
      { label: "Live demo", href: "https://nss-report-generator-using-ai.vercel.app" },
      { label: "Repository", href: "https://github.com/Himanshux99/NSS-Report-Generator-using-AI" },
    ],
  },
  {
    id: "vprint",
    name: "V-Print",
    kicker: "A campus print workflow where students submit jobs, pay and track them.",
    status: { label: "In development", kind: "wip" },
    problem:
      "Printing on campus runs on pen drives and counter queues. A submit-and-track flow should be simpler for students and for the shop.",
    built: [
      "React 19 and Vite client with Tailwind",
      "Firebase Cloud Functions handling Razorpay order creation and payment verification",
      "PDF handling with pdf-lib and calendar views with FullCalendar",
    ],
    stack: ["React.js", "Vite", "Tailwind CSS", "Firebase", "Razorpay", "Node.js"],
    honesty:
      "A progressive web app is the direction, but it is not claimed as finished. The queue shown is a demonstration with made-up jobs.",
    links: [{ label: "Repository", href: "https://github.com/Himanshux99/V-plus-plus" }],
  },
  {
    id: "lan-game",
    name: "Gang Games",
    kicker: "A top-down 2D LAN game about numbered cards, secrets and bluffing, built in Godot.",
    status: { label: "In development", kind: "wip" },
    problem:
      "I wanted a cooperative social-deduction game for a room full of friends on one network: shared goals, hidden information and nobody sure who to trust.",
    built: [
      "Godot project structured around autoloads, components and scenes",
      "Planned around a LAN lobby with a player-ready flow",
      "Game state and RPC-based networking for numbered-card rounds",
    ],
    stack: ["Godot"],
    honesty:
      "The repository has no README yet, so I am not describing which networking pieces are finished. The lobby above is a concept preview, not footage of the game.",
    links: [{ label: "Repository", href: "https://github.com/Himanshux99/gang-games" }],
  },
];

export type PlayCategory = "AI" | "Web" | "DevOps" | "Games";

export interface PlayItem {
  name: string;
  note: string;
  category: PlayCategory;
  tag: string;
  stack?: string[];
  href?: string;
}

export const playground: PlayItem[] = [
  {
    name: "Crop disease and pest detection",
    note: "Pick a crop, upload a leaf photo, get a prediction. Built for turmeric and bitter gourd.",
    category: "AI",
    tag: "FastAPI, PyTorch",
    stack: ["FastAPI", "PyTorch"],
  },
  {
    name: "CareQueue",
    note: "A map-first healthcare queue idea: find a service, understand how busy it is.",
    category: "Web",
    tag: "Concept",
  },
  {
    name: "Indian Sign Language translation",
    note: "Sign recognition experiments in Python.",
    category: "AI",
    tag: "Repository",
    href: "https://github.com/Himanshux99/ISL-Translation-",
  },
  {
    name: "OS process scheduler with ML",
    note: "A mini project that puts a model in charge of scheduling decisions.",
    category: "AI",
    tag: "Repository",
    href: "https://github.com/Himanshux99/OS-Process-Scheduler-ML-model-MiniProject",
  },
  {
    name: "DevOps mini projects",
    note: "A collection of small deployment and tooling exercises.",
    category: "DevOps",
    tag: "Repository",
    href: "https://github.com/Himanshux99/DevOpsMiniProjects",
  },
  {
    name: "Offline-first expense tracker",
    note: "Expenses that keep working with no connection and sync later.",
    category: "Web",
    tag: "Concept",
  },
  {
    name: "Pothole reporting",
    note: "Report road damage from a phone, with a location attached.",
    category: "Web",
    tag: "Concept",
  },
  {
    name: "Lost and found",
    note: "A campus board for items that went missing and the people who found them.",
    category: "Web",
    tag: "Concept",
  },
  {
    name: "Social media analytics dashboard",
    note: "Turning engagement numbers into something readable.",
    category: "Web",
    tag: "Concept",
  },
  {
    name: "First MERN backend",
    note: "My first Node, Express and MongoDB project, backend only.",
    category: "Web",
    tag: "Repository",
    href: "https://github.com/Himanshux99/BackendProjectProjectManagement",
  },
  {
    name: "Puzzles and small games",
    note: "Interactive puzzles and educational toys, built in Godot, Unity and plain code.",
    category: "Games",
    tag: "Ongoing",
  },
];

export interface EcoGroup {
  title: string;
  blurb: string;
  items: string[];
}

export const ecosystem: EcoGroup[] = [
  {
    title: "Interface",
    blurb: "What people touch.",
    items: ["React.js", "Next.js", "React Native", "Vite", "Tailwind CSS", "Bootstrap", "Figma", "Canva"],
  },
  {
    title: "Application",
    blurb: "What answers them.",
    items: ["Node.js", "Express.js", "FastAPI", "REST APIs", "PostgreSQL", "MongoDB", "Firebase", "Supabase", "Razorpay"],
  },
  {
    title: "Intelligence",
    blurb: "What learns and explains.",
    items: ["Python and Pandas", "Scikit-learn", "PyTorch", "SHAP", "Fairlearn", "MediaPipe"],
  },
  {
    title: "Infrastructure",
    blurb: "What keeps it running.",
    items: ["Docker", "Docker Compose", "Kubernetes", "Minikube", "GitHub Actions", "Prometheus", "Grafana", "Netlify", "AWS S3"],
  },
  {
    title: "Interactive",
    blurb: "What plays.",
    items: ["Godot", "Unity", "Blender", "Tinkercad", "AutoCAD"],
  },
];

export const languages = ["JavaScript", "Java", "Python", "C", "C++", "C#", "HTML5", "CSS3"];

export const background = {
  school: "Vidyalankar Institute of Technology, Mumbai",
  degree: "B.E. in Information Technology",
  years: "2024-2028",
  highlights: [
    { title: "NSS technical contributions", body: "Builds tools for the NSS unit, including the report generator." },
    { title: "Google Student Ambassador", body: "Community and campus activities." },
    { title: "NPTEL", body: "Programming in Java certification." },
    { title: "L&T DevOps training", body: "60 hours, which fed into the deployment project." },
    { title: "Class 12", body: "94%." },
  ],
};
