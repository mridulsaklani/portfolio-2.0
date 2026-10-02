export type SceneId = "hero" | "about" | "ai" | "cloud" | "skills" | "systems" | "contact" | "projects" | "detail";

export interface SkillGroup {
  id: string;
  title: string;
  summary: string;
  skills: string[];
}

export interface SystemExploration {
  id: string;
  number: string;
  category: string;
  title: string;
  description: string;
  flow: { id: string; label: string; detail: string }[];
  labels: string[];
}

export interface ProjectCaseStudy {
  slug: string;
  title: string;
  summary: string;
  role: string;
  stack: string[];
  outcomes: string[];
  links?: { label: string; href: string }[];
}

export const profile = {
  name: "Mridul Singh Saklani",
  shortName: "Mridul",
  roles: ["Software Engineer", "AI/ML Engineer"],
  headline: "Engineering intelligent systems for the real world.",
  summary:
    "I build scalable software and intelligent applications where software engineering, AI/ML, and cloud computing meet.",
  availability: "Open to Software Engineer and AI/ML Engineer opportunities",
};

export const about = {
  lede:
    "I’m interested in what happens around the model: the architecture, APIs, data pipelines, infrastructure, and product decisions that make intelligent software useful and reliable.",
  paragraphs: [
    "My approach goes beyond writing code. I want to understand how a system should be designed, how its components communicate, and how it behaves under real workloads. That systems view shapes the way I think about both software and AI.",
    "I work across backend services, data-processing workflows, cloud-based architectures, and AI-powered applications. On the AI/ML side, I’m especially interested in generative AI, LLMs, retrieval-augmented generation, MCPs, computer vision, AI agents, and intelligent automation.",
    "I’m continuously strengthening my understanding of distributed systems, system design, cloud architecture, AI/ML, and software engineering fundamentals. I’m looking for opportunities to work on challenging engineering problems and build products where software and AI come together.",
  ],
};

export const skillGroups: SkillGroup[] = [
  {
    id: "intelligence",
    title: "AI / ML systems",
    summary: "From model capability to useful, dependable product behavior.",
    skills: ["Generative AI", "LLMs", "RAG", "MCPs", "AI agents", "Computer vision", "Intelligent automation"],
  },
  {
    id: "engineering",
    title: "Software engineering",
    summary: "APIs and applications designed around clear system boundaries.",
    skills: ["Python", "FastAPI", "Node.js", "REST APIs", "React", "Next.js", "ElevenLabs"],
  },
  {
    id: "data",
    title: "Data & persistence",
    summary: "Data stores and processing workflows for application workloads.",
    skills: ["PostgreSQL", "Aurora PostgreSQL", "MongoDB", "Data processing", "Data pipelines"],
  },
  {
    id: "cloud",
    title: "Cloud & architecture",
    summary: "Infrastructure, queues, observability, and distributed systems.",
    skills: ["AWS", "Cloud architecture", "System design", "Distributed systems", "Scalable backends"],
  },
];

export const awsServices = [
  { id: "edge", title: "Edge & delivery", skills: ["CloudFront", "S3"], detail: "Serve application assets and content through AWS delivery and object storage services." },
  { id: "compute", title: "Compute", skills: ["EC2", "ECS / Fargate"], detail: "Run application workloads on virtual machines or container-based compute." },
  { id: "messaging", title: "Messaging", skills: ["SQS"], detail: "Connect services with queued work that can be processed independently." },
  { id: "data", title: "Data", skills: ["Aurora PostgreSQL"], detail: "Use managed relational storage for structured application data." },
  { id: "ai", title: "AI & voice", skills: ["Bedrock", "Polly"], detail: "Build with managed foundation model capabilities and text-to-speech services." },
  { id: "operations", title: "Operations & access", skills: ["IAM", "CloudWatch"], detail: "Manage access policies and observe services, workloads, and operational signals." },
];

export const systemExplorations: SystemExploration[] = [
  {
    id: "retrieval",
    number: "01",
    category: "GENERATIVE AI / RAG",
    title: "Ground an answer in useful context",
    description:
      "Explore a retrieval flow that turns a question into relevant evidence, gives a language model useful context, and returns a response people can inspect.",
    flow: [
      { id: "question", label: "Question", detail: "Interpret the request and identify what information is needed." },
      { id: "retrieve", label: "Retrieve", detail: "Find relevant passages from the connected knowledge source." },
      { id: "context", label: "Context", detail: "Select and package supporting evidence for the model." },
      { id: "llm", label: "LLM", detail: "Generate a response with the retrieved material available as context." },
      { id: "answer", label: "Grounded answer", detail: "Return a useful response with a clear connection to its source material." },
    ],
    labels: ["Embeddings", "Retrieval", "LLMs"],
  },
  {
    id: "mcp",
    number: "02",
    category: "AGENTS / MCP",
    title: "Connect reasoning to deliberate action",
    description:
      "See how an AI agent can choose a tool, use an MCP connection, observe the result, and continue with a visible, bounded workflow.",
    flow: [
      { id: "intent", label: "Intent", detail: "Understand the task and constraints supplied by the user." },
      { id: "reason", label: "Reason", detail: "Choose whether a tool is needed and what action should happen next." },
      { id: "tool", label: "MCP tool", detail: "Call an available capability through a defined MCP connection." },
      { id: "observe", label: "Observe", detail: "Inspect the tool result before deciding what to do next." },
      { id: "next", label: "Next step", detail: "Continue, ask for input, or return a result with the action visible." },
    ],
    labels: ["AI agents", "MCPs", "Automation"],
  },
  {
    id: "vision",
    number: "03",
    category: "COMPUTER VISION",
    title: "Turn visual input into a useful signal",
    description:
      "Trace the stages of a vision workflow from incoming frames through model inference to structured observations an application can act on.",
    flow: [
      { id: "image", label: "Image", detail: "Receive an image or frame as the input to the workflow." },
      { id: "preprocess", label: "Pre-process", detail: "Prepare the input in the form expected by the model." },
      { id: "inference", label: "Inference", detail: "Run the model to identify patterns in the visual input." },
      { id: "detection", label: "Detection", detail: "Turn model output into structured observations." },
      { id: "signal", label: "Signal", detail: "Pass useful observations to the next application or data-processing step." },
    ],
    labels: ["Computer vision", "Inference", "Data workflows"],
  },
];

export const engineeringPrinciples = [
  {
    number: "01",
    title: "Design the whole system",
    text: "Understand the boundaries, data flow, and failure paths around each component.",
  },
  {
    number: "02",
    title: "Make AI practical",
    text: "Pair model behavior with the APIs, retrieval, infrastructure, and product choices it needs.",
  },
  {
    number: "03",
    title: "Build for real workloads",
    text: "Think about reliability and horizontal scale from the way services communicate.",
  },
];

// Real project details can be added here when they are ready to share.
export const projectCaseStudies: ProjectCaseStudy[] = [];
