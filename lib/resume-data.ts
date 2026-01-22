// Resume Data Types and Content
// This file contains all structured resume content for the portfolio site

// ============================================================================
// Type Definitions
// ============================================================================

export interface PersonalInfo {
  name: string;
  title: string;
  location: string;
  email: string;
  website: string;
  linkedin: string;
  yearsExperience: string;
}

export interface Job {
  id: string;
  company: string;
  title: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string[];
}

export interface Project {
  id: string;
  name: string;
  url?: string;
  description: string;
  techStack: string[];
  featured: boolean;
}

export interface Skill {
  id: string;
  category: string;
  skills: string[];
  proficiency: number;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  location: string;
  year: number;
}

// ============================================================================
// Personal Information
// ============================================================================

export const personalInfo: PersonalInfo = {
  name: "Hugo Cedano",
  title: "Software Engineer",
  location: "Hollywood, FL 33026",
  email: "hugoce17@gmail.com",
  website: "hugocodes.com",
  linkedin: "linkedin.com/in/hceda17",
  yearsExperience: "10+",
};

// ============================================================================
// About / Summary
// ============================================================================

export const aboutSummary = `Full-stack engineer with 10+ years building web applications across fintech, insurance, and e-commerce. I work across the entire stack—React, Vue, Next.js, Node.js, PostgreSQL, AWS, Supabase—and I've embraced AI-assisted development as a force multiplier. The future of software is agentic, and I'm already there: using AI tools to ship faster, iterate smarter, and focus on solving problems that lead to impact and growth, while worrying less about the noise that sometimes stagnates progress.`;

// ============================================================================
// Featured Projects
// ============================================================================

export const projects: Project[] = [
  {
    id: "macrocrafter",
    name: "MacroCrafter",
    url: "https://macrocrafter.io",
    description:
      "AI-powered macro generation SaaS for World of Warcraft and Final Fantasy XIV gaming communities. Full-stack application featuring real-time streaming chat with multiple LLM providers (xAI Grok, OpenAI), three-tier Stripe subscription system with webhook lifecycle management, and secure multi-tenant architecture using Supabase Auth with PostgreSQL Row-Level Security.",
    techStack: ["Next.js 16", "React 19", "TypeScript", "Supabase (PostgreSQL)", "Redis", "Stripe", "Vercel AI SDK", "Radix UI", "Tailwind CSS", "Playwright", "Jest", "GitHub Actions", "Docker"],
    featured: true,
  },
  {
    id: "theway",
    name: "TheWay",
    url: undefined,
    description:
      "AI-powered mobile app guiding users through personalized spiritual journeys with daily devotionals, Orthodox calendar integration, and an intelligent conversational assistant. Features include a full 76-book Orthodox Bible reader with annotations, AI-generated liturgical imagery, gamified progression system, and adaptive onboarding that tailors guidance to each user's spiritual maturity level.",
    techStack: ["React Native", "Expo Router", "NativeWind", "Legend State", "NestJS", "Supabase (PostgreSQL, Edge Functions, Realtime, Auth)", "Letta AI", "Google Gemini API", "TypeScript"],
    featured: true,
  },
];

// ============================================================================
// Work Experience
// ============================================================================

export const jobs: Job[] = [
  {
    id: "goods-services",
    company: "Goods & Services",
    title: "Staff Software Engineer",
    startDate: "May 2022",
    endDate: "Current",
    isCurrent: true,
    description: [
      "Delivered full-stack features across a large-scale risk management/insurance web platform (Vue.js + JavaScript/HTML/CSS/SASS, ColdFusion/CFML, Mura CMS), contributing 1,757 commits spanning UI, APIs, and platform enhancements.",
      "Built and maintained microapp architecture within the Mura-backed ecosystem, developing Vue modules with Vuex state management and integrating them with CFML REST + WebSocket services.",
      "Implemented an AI assistant module (\"RISKIE\") as one of several major platform features, including real-time WebSocket chat, streaming UX, RBAC-driven feature controls, source attribution, and integrations with AWS services (Bedrock endpoints, S3, CloudWatch, Lambda/API Gateway, SigV4).",
      "Developed an enterprise reporting system end-to-end: dashboards with configurable filters/date ranges plus PDF generation pipelines (Payroll Audit, ANCP, Prospect) and automated email delivery workflows.",
      "Modernized build and delivery tooling by migrating to pnpm workspaces and enabling parallelized builds/workspace concurrency, drastically reducing build times and improving CI cost efficiency and developer productivity across microapps.",
      "Led platform-wide accessibility + UX improvements (WCAG/ARIA, keyboard navigation, focus states), integrated UsableNet (with page blacklisting), replaced legacy Shadowbox with native dialog patterns, and enhanced admin/event flows (registration management, flight seat preferences, bulk notifications).",
    ],
  },
  {
    id: "frontier-tech",
    company: "Frontier Tech Solutions, LLC",
    title: "Founder",
    startDate: "November 2023",
    endDate: "Current",
    isCurrent: true,
    description: [
      "MacroCrafter: AI-powered macro generation SaaS for World of Warcraft and Final Fantasy XIV gaming communities. Full-stack application featuring real-time streaming chat with multiple LLM providers (xAI Grok, OpenAI), three-tier Stripe subscription system with webhook lifecycle management, and secure multi-tenant architecture using Supabase Auth with PostgreSQL Row-Level Security.",
      "TheWay: AI-powered mobile app guiding users through personalized spiritual journeys with daily devotionals, Orthodox calendar integration, and an intelligent conversational assistant. Features include a full 76-book Orthodox Bible reader with annotations, AI-generated liturgical imagery, gamified progression system, and adaptive onboarding that tailors guidance to each user's spiritual maturity level.",
    ],
  },
  {
    id: "truist",
    company: "Truist Bank",
    title: "JavaScript Developer",
    startDate: "October 2020",
    endDate: "May 2022",
    isCurrent: false,
    description: [
      "Part of a Distributive Team.",
      "Contributing towards the development of various software solutions to deliver Cryptography as a Service. (see below)",
      "Contributing towards the development of a Web Application with Nuxt / Vue.",
      "Contributing towards the development of a GraphQL API written in TypeScript ontop of NodeJS.",
      "Contributing towards the development of a Command Line Interface written in NodeJS.",
    ],
  },
  {
    id: "rms",
    company: "Risk Management Solutions Inc.",
    title: "Front End Developer",
    startDate: "October 2018",
    endDate: "September 2020",
    isCurrent: false,
    description: [
      "Part of a Distributive Team.",
      "Contributed towards the development of a User Interface Component Library written with HTML, CSS, & JavaScript; more specifically, Stencil.JS.",
      "Contributed towards the development of a legacy web application written in CoffeeScript which used React.js for its front-end elements and flux for state management.",
      "Contributed towards the development of web application for Treaty Underwriting authored in Typescript, Vue.js, Nuxt.js, with Vuex for state management, and other tooling such as Tailwind, and Axios.",
      "Maintained related Unit & Feature tests for changes made.",
      "Worked in an Agile-driven environment to effectively maintain project timelines and utilize available resources.",
    ],
  },
  {
    id: "classwallet",
    company: "ClassWallet",
    title: "Software Developer",
    startDate: "June 2018",
    endDate: "September 2018",
    isCurrent: false,
    description: [
      "Developed an E-commerce Web Application with React, Redux, Node, Express, and MongoDB.",
      "Implemented Unit Tests with Jest/Enzyme; deployed with Docker.",
      "Designed and developed scripts with JavaScript to query various collections within MongoDB to create reports for internal teams.",
    ],
  },
  {
    id: "smart-monkeys",
    company: "Smart Monkeys Inc.",
    title: "Software Developer",
    startDate: "February 2017",
    endDate: "February 2018",
    isCurrent: false,
    description: [
      "Contributed towards the development of a complex web application that is at the heart of the ISAAC Platform.",
      "Navigated through a MeteorJS based stack that integrates dockerized NodeJS based microservices & MongoDB.",
      "Migrated about 80% of the web application from BlazeJS to ReactJS.",
      "Developed new views with ReactJS & SASS",
    ],
  },
  {
    id: "callpal",
    company: "CALLPAL, LLC",
    title: "Software Engineer",
    startDate: "June 2016",
    endDate: "December 2016",
    isCurrent: false,
    description: [
      "Designed and developed RESTful APIs to analyze and display statistics extrapolated from data stored in MySQL and Couchbase databases with ExpressJS ontop of NodeJS.",
      "Created a front-end project to display analyzed data through charts with HTML5, CSS3 & JavaScript.",
      "Created CRON Jobs in existing back-end APIs to schedule processes across internal NodeJS projects.",
      "Migrated various data sets from MySQL servers to Couchbase servers.",
    ],
  },
  {
    id: "freelance-2015",
    company: "Freelance",
    title: "Full Stack Developer",
    startDate: "October 2015",
    endDate: "January 2016",
    isCurrent: false,
    description: [
      "Designed and developed SPAs for local clients.",
      "Sometimes used MeteorJS",
      "Views were written ReactJS",
      "Wrote RESTful APIs with NodeJS; sometimes integrating MongoDB for persistent storage.",
    ],
  },
  {
    id: "sapient",
    company: "SapientRazorfish Miami",
    title: "Front End Developer",
    startDate: "March 2015",
    endDate: "August 2015",
    isCurrent: false,
    description: [
      "Created web modules using HTML5, CSS3, & JavaScript.",
      "Worked with content management system (CMS) Interwoven.",
      "Worked on the Moment of Yes Sweepstakes Landing Page",
      "Implemented various pages for Fiat Chrysler's Dodge brand",
      "Turned designs into code",
      "Fixed various bugs",
    ],
  },
  {
    id: "freelance-2014",
    company: "Freelance",
    title: "Full Stack Developer",
    startDate: "November 2014",
    endDate: "January 2015",
    isCurrent: false,
    description: [
      "Designed and developed a single page web application with NodeJS, Express, HTML, CSS, JavaScript responsible for displaying various services offered by the company and the web app allows customers to send contact information when submitting inquiries.",
    ],
  },
];

// ============================================================================
// Skills
// ============================================================================

export const skills: Skill[] = [
  {
    id: "frontend",
    category: "Frontend",
    skills: ["HTML5", "CSS3/SASS", "JavaScript/TypeScript", "React/Next.js", "Vue/Nuxt"],
    proficiency: 95,
  },
  {
    id: "backend",
    category: "Backend",
    skills: ["Node.js (Express, NestJS)", "ColdFusion (CFML/CFScript)", "REST", "GraphQL"],
    proficiency: 90,
  },
  {
    id: "data",
    category: "Data",
    skills: ["MongoDB", "MySQL", "PostgreSQL", "Couchbase"],
    proficiency: 85,
  },
  {
    id: "cloud-devops",
    category: "Cloud/DevOps",
    skills: ["Supabase", "AWS", "Docker", "Heroku", "Vercel", "Netlify"],
    proficiency: 75,
  },
  {
    id: "practices",
    category: "Practices",
    skills: ["TDD", "Functional Programming", "Software Design", "MVC", "Microservices", "Serverless"],
    proficiency: 80,
  },
  {
    id: "soft-skills",
    category: "Soft Skills",
    skills: ["Strong communicator/conversationalist"],
    proficiency: 90,
  },
  {
    id: "marketing",
    category: "Marketing",
    skills: ["SEO", "SEM", "Social Media", "Content Marketing", "Email Marketing", "Analytics", "Copywriting"],
    proficiency: 45,
  },

];

// ============================================================================
// Education
// ============================================================================

export const education: Education[] = [
  {
    id: "fiu",
    institution: "Florida International University",
    degree: "Bachelor of Science",
    field: "Computer Science",
    location: "Miami, FL",
    year: 2015,
  },
  {
    id: "mdc",
    institution: "Miami Dade College North Campus",
    degree: "Associate of Arts",
    field: "Computer Science",
    location: "Westview, FL",
    year: 2012,
  },
];

// ============================================================================
// Utility Exports
// ============================================================================

// Get all current jobs
export const currentJobs = jobs.filter((job) => job.isCurrent);

// Get featured projects only
export const featuredProjects = projects.filter((project) => project.featured);

// Get skills sorted by proficiency (highest first)
export const skillsByProficiency = [...skills].sort((a, b) => b.proficiency - a.proficiency);
