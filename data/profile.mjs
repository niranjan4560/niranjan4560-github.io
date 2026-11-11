/**
 * Single source of truth for all site content.
 * Every fact here comes from the resume (assets/Niranjan_NS_Resume.pdf).
 * Edit this file, then run `npm run build` to regenerate index.html.
 *
 * Fields marked `null` render a tasteful placeholder — see the TODO list in CHANGELOG.md.
 */

export const site = {
  // TODO: confirm the public URL. A repo named "niranjan4560.github.io" would serve from the domain root.
  url: 'https://niranjan4560.github.io/niranjan4560-github.io/',
  title: 'Niranjan NS — Backend & AI/ML Engineer',
  description:
    'Niranjan NS is a Computer Science undergraduate building production-style FastAPI backends, ML models and LLM pipelines, deployed with PostgreSQL and Docker.',
  locale: 'en_IN',
  ogImage: 'assets/og-image.png',
  resume: 'assets/Niranjan_NS_Resume.pdf',
};

export const person = {
  name: 'Niranjan NS',
  initials: 'NN',
  role: 'Backend & AI/ML Engineer',
  location: 'Kerala, India',
  status: 'Open to opportunities',
  // Hero: who I am + value delivered, in one line, plus one supporting sentence.
  headline: {
    lead: 'I build backends that put',
    accent: 'machine learning',
    tail: 'to work.',
  },
  subline:
    'CS undergraduate at Amrita Vishwa Vidyapeetham shipping FastAPI services, ML models and LLM pipelines — persisted in PostgreSQL and packaged with Docker.',
  photo: null, // TODO: add a square portrait at assets/photo.webp (≥ 800×800) and set 'assets/photo.webp'
};

export const links = {
  email: 'niranjanns281@gmail.com',
  phone: '+91 85477 46783',
  phoneHref: 'tel:+918547746783',
  linkedin: 'https://www.linkedin.com/in/niranjan-n-s/',
  github: 'https://github.com/niranjan4560',
};

export const about = {
  paragraphs: [
    'I’m a Computer Science undergraduate focused on backend and AI/ML systems — the API layer, the database underneath it and the model behind it.',
    'My projects take an idea end to end — engineering features, benchmarking models, exposing them through FastAPI, persisting results in PostgreSQL and shipping in Docker. When an LLM provider deprecated a model under one of my services, I built an automatic multi-model fallback so the service could switch models without application changes.',
    'Underneath it all is a solid grounding in data structures, algorithms, OOP and SQL.',
  ],
  focus: ['Backend APIs', 'Applied ML', 'LLM integration'],
};

/** Proof points shown as animated counters. Values are taken verbatim from the resume. */
export const stats = [
  { value: 3, suffix: '', label: 'Projects built' },
  { value: 0.83, decimals: 2, suffix: '+', label: 'AUC-ROC on diabetes risk model' },
  { value: 10, suffix: '', label: 'Dark-pattern categories detected' },
  { value: 40, suffix: '+', label: 'Students reached in outreach' },
];

export const projects = [
  {
    slug: 'disease-prediction',
    title: 'Disease Prediction System',
    date: 'May – Jun 2026',
    kind: 'ML platform',
    summary: 'End-to-end diabetes risk prediction — from clinical features to a REST API, dashboard and analytics.',
    problem: 'Turn raw clinical data into an automated diabetes risk assessment.',
    solution:
      'Engineered 7 clinical features, benchmarked Logistic Regression, Random Forest, LightGBM and XGBoost, and served the model through a FastAPI REST backend with a Streamlit dashboard.',
    impact:
      'Reached 0.83+ AUC-ROC and automated patient risk assessment, with predictions persisted in PostgreSQL and surfaced in Power BI.',
    stack: ['Python', 'XGBoost', 'FastAPI', 'PostgreSQL', 'Streamlit', 'Power BI'],
    metric: { value: '0.83+', label: 'AUC-ROC' },
    links: { live: null, repo: null }, // TODO: add repo / demo URLs
    image: null, // TODO: add a screenshot at assets/projects/disease-prediction.webp (16:10)
    art: 'chart',
  },
  {
    slug: 'dark-pattern-detector',
    title: 'Dark Pattern Detector',
    date: 'Jun 2026',
    kind: 'AI service',
    summary: 'An AI service that flags deceptive UI patterns and writes structured credibility reports.',
    problem: 'Identify deceptive UI patterns in an interface and report on its credibility.',
    solution:
      'Built a detection service on FastAPI, PostgreSQL and the Gemini API that identifies 10 categories of dark patterns and generates structured credibility reports.',
    impact:
      'When an AI model deprecation caused an outage, added an automated multi-model fallback layer — models now switch seamlessly without application changes.',
    stack: ['Python', 'FastAPI', 'PostgreSQL', 'Gemini API', 'Docker'],
    metric: { value: '10', label: 'pattern categories' },
    links: { live: null, repo: null }, // TODO: add repo / demo URLs
    image: null, // TODO: add a screenshot at assets/projects/dark-pattern-detector.webp (16:10)
    art: 'scan',
  },
  {
    slug: 'repvault',
    title: 'RepVault Fitness Tracker',
    date: 'Aug – Nov 2025',
    kind: 'Web app',
    summary: 'A fitness tracker with secure sign-in and workout data that follows you across devices.',
    problem: 'Let people record workouts and reach their data from any device.',
    solution:
      'Developed a React web app with secure authentication and Cloud Firestore data management for recording and accessing workouts anywhere.',
    impact:
      'Optimized Firestore queries and real-time sync to minimize unnecessary database operations and keep record access responsive and low-latency.',
    // TODO: add metric (e.g. reads saved or latency) if you measured it
    stack: ['React', 'Cloud Firestore'],
    metric: { value: 'Real-time', label: 'cross-device sync' },
    links: { live: null, repo: null }, // TODO: add repo / demo URLs
    image: null, // TODO: add a screenshot at assets/projects/repvault.webp (16:10)
    art: 'pulse',
  },
];

/** Ordered by relevance to backend / AI-ML roles. */
export const skills = [
  { group: 'Backend', icon: 'server', items: ['FastAPI', 'REST APIs', 'Python', 'SQL'] },
  { group: 'AI / ML', icon: 'spark', items: ['XGBoost', 'Scikit-learn', 'LLM integration (Gemini API)'] },
  { group: 'Data', icon: 'db', items: ['PostgreSQL', 'Cloud Firestore', 'Power BI'] },
  { group: 'Languages', icon: 'code', items: ['Python', 'Java', 'C', 'SQL', 'JavaScript'] },
  { group: 'Frontend', icon: 'layout', items: ['React', 'Streamlit'] },
  { group: 'Tooling', icon: 'box', items: ['Docker', 'Git'] },
];

export const fundamentals = ['Data structures', 'Algorithms', 'OOP', 'SQL'];

/** No formal work experience on the resume yet — this timeline covers leadership and learning. */
export const experience = [
  {
    role: 'Speaker — Cybersecurity & Digital Wellbeing Session',
    org: 'SSR Community Outreach',
    date: 'Nov 2025',
    points: [
      'Conducted an awareness session for 40+ Class IX students.',
      'Covered phishing prevention, cyberbullying and detecting AI-generated misinformation.',
    ],
  },
  {
    role: 'Workshop — Model Context Protocol (MCP)',
    org: 'Workflow automation',
    date: 'Aug 2025',
    points: ['Hands-on workflow automation with Cursor IDE and MCP servers.'],
  },
  {
    role: 'Workshop — Generative AI Product Prototyping',
    org: 'Generative AI',
    date: 'Sep 2024',
    points: ['Hands-on prototyping of products built on generative AI.'],
  },
];

export const education = [
  {
    school: 'Amrita Vishwa Vidyapeetham, Amritapuri',
    place: 'Kollam, Kerala',
    degree: 'B.Tech in Computer Science',
    detail: 'CGPA 7.94',
    date: 'Aug 2023 – Aug 2027 (expected)',
  },
  {
    school: 'Cochin Refineries School, Kochi',
    place: 'Ernakulam, Kerala',
    degree: 'CBSE Class XII · Class X',
    detail: '89.3% · 92.8%',
    date: '2022 · 2020',
  },
];

export const languages = ['English', 'Malayalam', 'Hindi', 'Tamil (spoken)'];
export const hobbies = ['Sketching', 'Photography'];

export const contact = {
  heading: 'Let’s build something reliable.',
  text: 'I’m looking for roles where I can work on backend systems and applied ML. The fastest way to reach me is email.',
  // Optional: set to a form backend URL (e.g. a Formspree endpoint) to send messages without opening a mail app.
  // When null, the form composes an email in the visitor’s mail client.
  formEndpoint: null,
};

export const nav = [
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'education', label: 'Education' },
  { id: 'contact', label: 'Contact' },
];
