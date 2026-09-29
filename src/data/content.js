// Single source of truth for everything the portfolio says.
// Every fact here comes from the résumé (public/SWARAJXAVIER_CSE_NIST.pdf)
// or the previous version of the site — nothing is invented.

export const person = {
  name: "Swaraj Xavier Suna",
  first: "Swaraj",
  middle: "Xavier",
  last: "Suna",
  role: "Full-stack developer",
  location: "Berhampur, Odisha",
  country: "IN",
  timezone: "Asia/Kolkata",
  email: "swarajxaviersuna@gmail.com",
  resume: "/SWARAJXAVIER_CSE_NIST.pdf",
  status: "Open to SDE internships & junior developer roles",
};

export const socials = [
  {
    label: "GitHub",
    handle: "demoxavi12",
    href: "https://github.com/demoxavi12",
    cursor: "Open GitHub",
  },
  {
    label: "LinkedIn",
    handle: "in/swaraj-6009a8332",
    href: "https://www.linkedin.com/in/swaraj-6009a8332/",
    cursor: "Open LinkedIn",
  },
  {
    label: "LeetCode",
    handle: "swaraj_xavier_suna",
    href: "https://leetcode.com/u/swaraj_xavier_suna/",
    cursor: "Open LeetCode",
  },
];

export const sections = [
  { id: "work", label: "Selected work", short: "Work" },
  { id: "about", label: "About", short: "About" },
  { id: "stack", label: "Stack", short: "Stack" },
  { id: "record", label: "Record", short: "Record" },
  { id: "contact", label: "Contact", short: "Contact" },
];

export const projects = [
  {
    id: "pulseops",
    index: "01",
    name: "PulseOps",
    title: "Notification & Analytics Dashboard",
    kind: "Mini SaaS system",
    ghost: "PULSEOPS",
    accent: "#2B45F5",
    onAccent: "#F1ECE2",
    theme: "dark",
    url: "mini-saas-system.vercel.app",
    summary:
      "A multi-service dashboard that pulls events and notifications from several backend services into one place — behind role-based access, with cached and rate-limited APIs.",
    notes: [
      "Aggregates events and notifications from 3+ backend services",
      "Role-based access control and protected admin routes with JWT",
      "Redis caching and rate limiting on the request path",
      "REST APIs for auth, event ingestion, notifications and analytics",
    ],
    stack: ["React.js", "Node.js", "Express.js", "MongoDB", "Redis", "JWT Auth", "REST APIs"],
    github: "https://github.com/demoxavi12/notification-analytics-dashboard",
    demo: "https://mini-saas-system.vercel.app/",
  },
  {
    id: "chat",
    index: "02",
    name: "Real-Time Chat",
    title: "Real-Time Chat Application",
    kind: "Messaging platform",
    ghost: "REALTIME",
    accent: "#FF5A1F",
    onAccent: "#14120F",
    theme: "light",
    url: "real-time-chat-application.vercel.app",
    summary:
      "A real-time messaging platform where authenticated users talk across public and private rooms, with bidirectional client–server events over WebSockets.",
    notes: [
      "Concurrent multi-user messaging over WebSockets with Socket.IO",
      "JWT-based authentication for every connection",
      "Public and private chat rooms",
      "Modular REST APIs following MVC for maintainability and debugging",
    ],
    stack: ["React.js", "Node.js", "Express.js", "MongoDB", "Socket.IO", "JWT Auth", "REST APIs", "MVC"],
    github: "https://github.com/demoxavi12/real-time-chat-application",
    demo: "https://real-time-chat-application-taupe-six.vercel.app/",
  },
  {
    id: "eleve",
    index: "03",
    name: "Elevé",
    title: "E-Commerce Platform",
    kind: "Full-stack storefront",
    ghost: "ELEVÉ",
    accent: "#6E1F45",
    onAccent: "#F1ECE2",
    theme: "dark",
    url: "e-commerce-platform.vercel.app",
    summary:
      "A full-stack storefront with authentication, product management, a shopping cart and Stripe checkout — plus role-based admin controls.",
    notes: [
      "Auth, product catalogue management and cart",
      "Stripe API integration for payments",
      "Role-based admin controls and JWT-secured API workflows",
      "Modular API design — responses under 400 ms during testing, load-tested with simulated concurrent users",
    ],
    stack: ["React.js", "Node.js", "Express.js", "MongoDB", "JWT Auth", "Stripe API", "REST APIs", "Postman"],
    github: "https://github.com/demoxavi12/e-commerce-platform",
    demo: "https://e-commerce-platform-six-phi.vercel.app/",
  },
];

// The stack, arranged the way a request travels through it.
export const stackLayers = [
  {
    id: "interface",
    label: "Interface",
    caption: "what the user touches",
    items: ["React.js", "HTML5", "CSS3", "Tailwind CSS"],
  },
  {
    id: "server",
    label: "Server",
    caption: "where requests are decided",
    items: ["Node.js", "Express.js", "REST APIs", "JWT Auth", "MVC", "Socket.IO", "Stripe API"],
  },
  {
    id: "data",
    label: "Data",
    caption: "what is kept & how fast",
    items: ["MongoDB", "Mongoose", "Redis", "SQL", "DBMS"],
  },
];

export const stackGround = [
  { id: "languages", label: "Languages", items: ["Java", "JavaScript", "Python", "C", "SQL"] },
  {
    id: "foundations",
    label: "Foundations",
    items: ["Data Structures & Algorithms", "OOP", "Collections Framework", "Operating Systems", "Computer Networks"],
  },
  { id: "tooling", label: "Tooling", items: ["Git", "GitHub", "Postman", "Docker (basics)", "Linux", "VS Code"] },
  {
    id: "concepts",
    label: "Concepts",
    items: ["API Security", "Rate Limiting", "Async Programming", "Debugging", "Team Collaboration"],
  },
];

export const about = {
  statement: [
    "I'm a computer science student who builds full-stack web apps —",
    { em: "the APIs, auth and caching underneath," },
    "and the interface you actually",
    { em: "touch." },
  ],
  notes: [
    { k: "Based in", v: "Berhampur, Odisha, India" },
    { k: "Studying", v: "B.Tech CSE at NIST University, 2023 – 2027" },
    { k: "Practice", v: "200+ DSA problems across LeetCode & GeeksforGeeks" },
    { k: "Built", v: "4+ full-stack MVPs focused on scalability and backend optimisation" },
    { k: "Drawn to", v: "Backend optimisation, API security and real-time systems" },
  ],
};

export const record = [
  {
    years: ["2020", "22"],
    place: "Ravenshaw Higher Secondary School",
    city: "Cuttack",
    what: "Intermediate (CHSE)",
  },
  {
    years: ["2023", "27"],
    place: "NIST University",
    city: "Berhampur",
    what: "B.Tech — Computer Science & Engineering",
    detail: "CGPA 8.38 / 10",
  },
  {
    years: ["2025"],
    place: "Smart India Hackathon",
    city: "Participant",
    what: "Contributed to FarmAssist",
    detail:
      "A web and mobile farm-biosecurity platform — livestock health monitoring, vaccination tracking, compliance management and multilingual access.",
  },
];

export const certifications = [
  { name: "Full Stack Web Development", by: "NIST University" },
  { name: "Big Data Analytics", by: "NIELIT, Patna" },
];
