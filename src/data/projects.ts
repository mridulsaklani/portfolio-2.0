export type ProjectCategory = "AI / ML" | "Agents" | "Cloud" | "Full-stack";
export type ProjectStatus = "Live" | "In development" | "Prototype" | "Archived";
export type CoverStyle = "network" | "waves" | "grid" | "orbit" | "bars" | "rings";

export interface TechGroup {
  label: string;
  items: { name: string; why?: string }[];
}

export interface Project {
  slug: string;
  title: string;
  tagline: string;
  summary: string;
  category: ProjectCategory;
  status: ProjectStatus;
  year: number;
  featured?: boolean;
  role: string;
  team: string;
  duration: string;
  accent: string;
  cover: CoverStyle;
  /** Optional real screenshot path (e.g. "/projects/atlas.png"). Falls back to the generated cover. */
  image?: string;
  overview: string[];
  problem: string;
  solution: string;
  features: { title: string; text: string }[];
  tech: TechGroup[];
  architecture: { title: string; text: string; tag: string }[];
  challenges: { challenge: string; solution: string }[];
  metrics: { value: string; label: string }[];
  timeline: { phase: string; text: string }[];
  learnings: string[];
  gallery: { caption: string; cover: CoverStyle }[];
  links: { live?: string; repo?: string; caseStudy?: string };
}

/** Flip to false once real projects replace the sample content below. */
export const SAMPLE_CONTENT = true;

export const projectCategories: ("All" | ProjectCategory)[] = ["All", "AI / ML", "Agents", "Cloud", "Full-stack"];

export const projects: Project[] = [
  {
    slug: "atlas-rag",
    title: "Atlas RAG",
    tagline: "A knowledge assistant that answers from your documents, with sources.",
    summary: "Retrieval-augmented assistant that indexes internal documents and answers questions with cited, verifiable passages.",
    category: "AI / ML",
    status: "Live",
    year: 2026,
    featured: true,
    role: "Lead engineer",
    team: "3 people",
    duration: "5 months",
    accent: "#67e7f7",
    cover: "network",
    overview: [
      "Atlas RAG lets teams ask natural-language questions across thousands of internal documents and get answers grounded in the source text, with every claim linked to the passage it came from.",
      "The project covers the whole path from ingestion and chunking to hybrid retrieval, re-ranking, prompt assembly and an evaluation harness that keeps answer quality measurable as the corpus grows.",
    ],
    problem: "Teams lost hours searching wikis, PDFs and tickets. Keyword search missed paraphrases, and plain LLM chat invented answers with no way to verify them.",
    solution: "A retrieval pipeline that combines vector and keyword search, re-ranks candidates, and passes only the best passages to the model, which must cite them. Answers without enough evidence are declined instead of guessed.",
    features: [
      { title: "Cited answers", text: "Each statement links back to the exact document and passage used." },
      { title: "Hybrid retrieval", text: "Vector similarity plus keyword search, merged and re-ranked for precision." },
      { title: "Incremental ingestion", text: "New and changed documents are re-indexed in the background without downtime." },
      { title: "Access-aware search", text: "Results respect each user's document permissions at query time." },
      { title: "Evaluation harness", text: "A fixed question set scores retrieval and answer quality on every change." },
    ],
    tech: [
      { label: "Frontend", items: [{ name: "Next.js" }, { name: "TypeScript" }, { name: "Tailwind CSS" }] },
      { label: "Backend", items: [{ name: "FastAPI", why: "Async API with typed request models" }, { name: "Python" }, { name: "Redis", why: "Caching and job queue" }] },
      { label: "AI / Data", items: [{ name: "LangChain" }, { name: "pgvector", why: "Vector search next to relational data" }, { name: "Re-ranker model" }] },
      { label: "Infrastructure", items: [{ name: "AWS ECS" }, { name: "S3" }, { name: "CloudWatch" }] },
    ],
    architecture: [
      { tag: "01", title: "Ingest", text: "Documents are parsed, cleaned and split into overlapping chunks with metadata." },
      { tag: "02", title: "Embed & index", text: "Chunks are embedded and stored with permissions for filtered search." },
      { tag: "03", title: "Retrieve", text: "Hybrid search returns candidates that a re-ranker narrows to the best few." },
      { tag: "04", title: "Generate", text: "The model answers only from supplied passages and returns citations." },
      { tag: "05", title: "Evaluate", text: "Scheduled runs track retrieval hit-rate and answer faithfulness." },
    ],
    challenges: [
      { challenge: "Answers sounded confident when the evidence was weak.", solution: "Added a relevance threshold and a refusal path, so low-evidence questions return what was found instead of a guess." },
      { challenge: "Long PDFs produced noisy chunks that hurt retrieval.", solution: "Switched to structure-aware chunking that respects headings and tables, which raised hit-rate noticeably." },
      { challenge: "Latency crept up as the index grew.", solution: "Cached frequent queries, tuned index parameters and moved re-ranking to a batched call." },
    ],
    metrics: [
      { value: "92%", label: "Retrieval hit-rate on eval set" },
      { value: "1.8s", label: "Median answer time" },
      { value: "40k+", label: "Documents indexed" },
      { value: "−65%", label: "Time spent searching" },
    ],
    timeline: [
      { phase: "Discovery", text: "Interviewed users, collected real questions, defined success criteria." },
      { phase: "Prototype", text: "Basic vector search with a chat UI to validate the idea." },
      { phase: "Hardening", text: "Hybrid search, permissions, citations and the evaluation harness." },
      { phase: "Launch", text: "Rolled out team by team with monitoring and feedback capture." },
    ],
    learnings: [
      "Evaluation data matters more than prompt tweaking; build the question set first.",
      "Retrieval quality is the ceiling for answer quality.",
      "Declining to answer is a feature users trust.",
    ],
    gallery: [
      { caption: "Chat view with inline citations", cover: "network" },
      { caption: "Source passage inspector", cover: "grid" },
      { caption: "Evaluation dashboard", cover: "bars" },
    ],
    links: { live: "https://example.com/atlas", repo: "https://github.com/example/atlas-rag", caseStudy: "https://example.com/atlas-case-study" },
  },
  {
    slug: "sentinel-vision",
    title: "Sentinel Vision",
    tagline: "Real-time visual monitoring that turns camera feeds into alerts.",
    summary: "Computer vision service that detects events in live video streams and surfaces them on an operations dashboard.",
    category: "AI / ML",
    status: "Live",
    year: 2025,
    featured: true,
    role: "ML & backend engineer",
    team: "4 people",
    duration: "6 months",
    accent: "#a092ff",
    cover: "orbit",
    overview: [
      "Sentinel Vision processes multiple camera streams, detects defined events such as missing equipment or blocked exits, and raises alerts to an operations team in near real time.",
      "The focus was reliability: stream reconnects, model versioning, and a review loop where operators confirm or dismiss alerts to improve future models.",
    ],
    problem: "Operators watched dozens of feeds manually and missed events. Early automated tools produced so many false alarms that people ignored them.",
    solution: "A detection pipeline with tuned thresholds per camera, temporal smoothing to cut flicker, and an operator feedback loop that labels false positives for retraining.",
    features: [
      { title: "Multi-stream ingestion", text: "Handles many concurrent feeds with automatic reconnect." },
      { title: "Event rules", text: "Configurable zones and conditions per camera." },
      { title: "Temporal smoothing", text: "Requires consistent detections before alerting to reduce noise." },
      { title: "Review queue", text: "Operators confirm or dismiss alerts; decisions become training data." },
      { title: "Model versioning", text: "Roll out and roll back detection models safely." },
    ],
    tech: [
      { label: "Frontend", items: [{ name: "React" }, { name: "WebSockets", why: "Live alert feed" }] },
      { label: "Backend", items: [{ name: "FastAPI" }, { name: "Python" }, { name: "Redis Streams" }] },
      { label: "AI / Data", items: [{ name: "PyTorch" }, { name: "OpenCV" }, { name: "ONNX Runtime", why: "Faster inference" }] },
      { label: "Infrastructure", items: [{ name: "Docker" }, { name: "AWS EC2 (GPU)" }, { name: "S3" }] },
    ],
    architecture: [
      { tag: "01", title: "Capture", text: "Workers pull frames from each stream at a controlled rate." },
      { tag: "02", title: "Detect", text: "An ONNX model runs batched inference on frames." },
      { tag: "03", title: "Decide", text: "Rules and smoothing turn detections into candidate events." },
      { tag: "04", title: "Notify", text: "Alerts stream to the dashboard and are stored for review." },
    ],
    challenges: [
      { challenge: "Too many false positives at night.", solution: "Per-camera thresholds and lighting-aware preprocessing reduced noise." },
      { challenge: "GPU cost was high.", solution: "Batched inference and adaptive frame rate cut usage substantially." },
    ],
    metrics: [
      { value: "−71%", label: "False alerts" },
      { value: "24", label: "Concurrent streams per node" },
      { value: "<2s", label: "Event to alert" },
      { value: "99.5%", label: "Pipeline uptime" },
    ],
    timeline: [
      { phase: "Research", text: "Benchmarked detection models on real footage." },
      { phase: "Pipeline", text: "Built ingestion, inference and alerting." },
      { phase: "Feedback loop", text: "Added the review queue and retraining flow." },
    ],
    learnings: ["Operator trust depends on low false-alarm rates.", "Measure cost per stream early.", "Design for reconnects from day one."],
    gallery: [
      { caption: "Live alert board", cover: "orbit" },
      { caption: "Zone editor", cover: "grid" },
      { caption: "Review queue", cover: "bars" },
    ],
    links: { repo: "https://github.com/example/sentinel-vision", caseStudy: "https://example.com/sentinel-case-study" },
  },
  {
    slug: "orbit-agents",
    title: "Orbit Agents",
    tagline: "Tool-using agents with visible steps and human approval.",
    summary: "Workflow builder where AI agents call tools through explicit interfaces, with every step logged and reviewable.",
    category: "Agents",
    status: "In development",
    year: 2026,
    role: "Full-stack & AI engineer",
    team: "Solo",
    duration: "Ongoing",
    accent: "#8ef0c4",
    cover: "rings",
    overview: [
      "Orbit Agents is a workflow platform where an agent plans a task, calls tools through typed interfaces and shows each step to the user before anything risky happens.",
      "Tools are exposed through MCP-style servers so new capabilities can be added without changing the agent core.",
    ],
    problem: "Agent demos looked impressive but were hard to trust: steps were hidden, failures were silent and there was no safe way to approve actions.",
    solution: "A step-by-step execution model with typed tool contracts, a trace view for every run and approval gates for actions with side effects.",
    features: [
      { title: "Typed tool contracts", text: "Each tool declares inputs and outputs that are validated." },
      { title: "Run traces", text: "Every thought, tool call and result is stored and viewable." },
      { title: "Approval gates", text: "Risky actions pause for human confirmation." },
      { title: "Replay & debug", text: "Re-run a failed step with the same inputs." },
    ],
    tech: [
      { label: "Frontend", items: [{ name: "Next.js" }, { name: "TypeScript" }, { name: "React Flow", why: "Workflow canvas" }] },
      { label: "Backend", items: [{ name: "FastAPI" }, { name: "MongoDB / Beanie" }, { name: "Redis" }] },
      { label: "AI", items: [{ name: "LangChain" }, { name: "MCP servers" }] },
      { label: "Infrastructure", items: [{ name: "AWS Lambda" }, { name: "SQS" }] },
    ],
    architecture: [
      { tag: "01", title: "Plan", text: "The agent breaks a goal into steps." },
      { tag: "02", title: "Act", text: "Steps call tools via validated contracts." },
      { tag: "03", title: "Approve", text: "Side-effect actions wait for a human." },
      { tag: "04", title: "Trace", text: "All steps are stored for review and replay." },
    ],
    challenges: [
      { challenge: "Agents looped on ambiguous tasks.", solution: "Added step limits and a clarification step before acting." },
      { challenge: "Tool errors were hard to diagnose.", solution: "Structured error types and per-step traces made failures obvious." },
    ],
    metrics: [
      { value: "12", label: "Built-in tools" },
      { value: "100%", label: "Steps traced" },
      { value: "3×", label: "Faster task setup" },
      { value: "0", label: "Unapproved side effects" },
    ],
    timeline: [
      { phase: "Core loop", text: "Plan–act–observe loop with typed tools." },
      { phase: "Safety", text: "Approvals, limits and traces." },
      { phase: "Studio", text: "Visual workflow editor (in progress)." },
    ],
    learnings: ["Visibility builds trust in agents.", "Constrain tools before expanding autonomy.", "Good traces make debugging fast."],
    gallery: [
      { caption: "Workflow canvas", cover: "rings" },
      { caption: "Run trace timeline", cover: "waves" },
      { caption: "Approval prompt", cover: "grid" },
    ],
    links: { repo: "https://github.com/example/orbit-agents" },
  },
  {
    slug: "cumulus-deploy",
    title: "Cumulus Deploy",
    tagline: "One-command deployments to AWS with guardrails.",
    summary: "Internal deployment platform that provisions services on AWS, runs checks and rolls back automatically on failure.",
    category: "Cloud",
    status: "Live",
    year: 2025,
    role: "Cloud & backend engineer",
    team: "2 people",
    duration: "4 months",
    accent: "#7ab8ff",
    cover: "bars",
    overview: [
      "Cumulus Deploy standardises how services reach production: a declarative config describes the service and the platform provisions infrastructure, deploys and verifies health.",
      "Failed releases roll back automatically, and every deployment is recorded with who, what and when.",
    ],
    problem: "Each team deployed differently, so releases were slow, inconsistent and hard to audit.",
    solution: "A single pipeline with templates for common service types, health checks, canary releases and automatic rollback.",
    features: [
      { title: "Service templates", text: "Pre-built setups for APIs, workers and scheduled jobs." },
      { title: "Canary releases", text: "Shift traffic gradually and watch health before completing." },
      { title: "Auto rollback", text: "Failed health checks revert to the last good version." },
      { title: "Audit trail", text: "Searchable history of every deployment." },
    ],
    tech: [
      { label: "Frontend", items: [{ name: "React" }, { name: "TypeScript" }] },
      { label: "Backend", items: [{ name: "Node.js" }, { name: "PostgreSQL" }] },
      { label: "Infrastructure", items: [{ name: "AWS ECS Fargate" }, { name: "CloudFormation" }, { name: "CloudWatch" }, { name: "IAM" }] },
    ],
    architecture: [
      { tag: "01", title: "Describe", text: "A config file declares the service." },
      { tag: "02", title: "Provision", text: "Templates create the infrastructure." },
      { tag: "03", title: "Release", text: "Canary rollout with health checks." },
      { tag: "04", title: "Observe", text: "Metrics and alarms feed the decision to promote or roll back." },
    ],
    challenges: [
      { challenge: "Permissions were too broad.", solution: "Moved to least-privilege roles generated per service." },
      { challenge: "Slow rollbacks.", solution: "Kept the previous task definition warm for instant reversion." },
    ],
    metrics: [
      { value: "−80%", label: "Deploy time" },
      { value: "30+", label: "Services onboarded" },
      { value: "<60s", label: "Rollback time" },
      { value: "100%", label: "Deploys audited" },
    ],
    timeline: [
      { phase: "Templates", text: "Defined standard service shapes." },
      { phase: "Pipeline", text: "Built the release flow and checks." },
      { phase: "Rollout", text: "Migrated teams in batches." },
    ],
    learnings: ["Standardisation removes most deploy incidents.", "Make rollback boring and fast.", "Audit data pays off later."],
    gallery: [
      { caption: "Deployment timeline", cover: "bars" },
      { caption: "Canary health view", cover: "waves" },
      { caption: "Service catalogue", cover: "grid" },
    ],
    links: { caseStudy: "https://example.com/cumulus-case-study" },
  },
  {
    slug: "pulse-analytics",
    title: "Pulse Analytics",
    tagline: "A fast, real-time analytics dashboard for product teams.",
    summary: "Full-stack dashboard that streams usage events and renders live charts, funnels and cohorts.",
    category: "Full-stack",
    status: "Live",
    year: 2024,
    role: "Full-stack engineer",
    team: "3 people",
    duration: "3 months",
    accent: "#ffb86b",
    cover: "waves",
    overview: [
      "Pulse Analytics collects product events and turns them into live dashboards: active users, funnels, retention cohorts and custom queries.",
      "It is built for speed, with pre-aggregated rollups and a UI that stays responsive on large datasets.",
    ],
    problem: "Existing tools were slow and expensive for the questions the team asked every day.",
    solution: "An event pipeline with rollup tables and a query layer that serves common dashboards in milliseconds.",
    features: [
      { title: "Live charts", text: "Updates stream in without page refresh." },
      { title: "Funnels & cohorts", text: "Built-in views for conversion and retention." },
      { title: "Saved views", text: "Share dashboards with filters preserved." },
      { title: "Role-based access", text: "Control who sees which data." },
    ],
    tech: [
      { label: "Frontend", items: [{ name: "React" }, { name: "TypeScript" }, { name: "D3 / Recharts" }] },
      { label: "Backend", items: [{ name: "FastAPI" }, { name: "MongoDB" }, { name: "Redis" }] },
      { label: "Infrastructure", items: [{ name: "AWS" }, { name: "Docker" }] },
    ],
    architecture: [
      { tag: "01", title: "Collect", text: "SDK sends events to an ingest endpoint." },
      { tag: "02", title: "Aggregate", text: "Workers roll events into time buckets." },
      { tag: "03", title: "Serve", text: "Query API reads rollups with caching." },
      { tag: "04", title: "Render", text: "The dashboard streams updates over WebSockets." },
    ],
    challenges: [
      { challenge: "Slow queries on raw events.", solution: "Introduced rollup tables and indexed time buckets." },
      { challenge: "Chart jank with many series.", solution: "Downsampled on the server and virtualised legends." },
    ],
    metrics: [
      { value: "120ms", label: "p95 dashboard load" },
      { value: "5M+", label: "Events per day" },
      { value: "−55%", label: "Tooling cost" },
      { value: "40", label: "Daily active users" },
    ],
    timeline: [
      { phase: "Ingest", text: "Event pipeline and storage." },
      { phase: "Dashboards", text: "Charts, funnels and cohorts." },
      { phase: "Polish", text: "Performance and sharing." },
    ],
    learnings: ["Pre-aggregation beats clever queries.", "Perceived speed is a design problem too.", "Keep the data model simple."],
    gallery: [
      { caption: "Live overview", cover: "waves" },
      { caption: "Funnel analysis", cover: "bars" },
      { caption: "Cohort retention", cover: "grid" },
    ],
    links: { live: "https://example.com/pulse", repo: "https://github.com/example/pulse-analytics" },
  },
  {
    slug: "lumen-voice",
    title: "Lumen Voice",
    tagline: "Natural voice responses for assistants and accessibility tools.",
    summary: "Speech pipeline that converts text into expressive audio with caching, streaming and voice selection.",
    category: "AI / ML",
    status: "Prototype",
    year: 2025,
    role: "AI & backend engineer",
    team: "2 people",
    duration: "2 months",
    accent: "#f58bd0",
    cover: "grid",
    overview: [
      "Lumen Voice turns written content into natural-sounding audio, with voices chosen per use case and results cached to keep costs down.",
      "It streams audio as it is generated so listeners hear the first words quickly.",
    ],
    problem: "Generating audio for long content was slow and expensive, and repeated requests re-generated identical audio.",
    solution: "Chunked generation with streaming playback, content-hash caching and per-voice presets.",
    features: [
      { title: "Streaming playback", text: "Audio starts before the full clip is ready." },
      { title: "Voice presets", text: "Save voice and pacing choices per use case." },
      { title: "Smart caching", text: "Identical text and voice reuse stored audio." },
      { title: "Accessible by design", text: "Works with captions and keyboard control." },
    ],
    tech: [
      { label: "Frontend", items: [{ name: "Next.js" }, { name: "Web Audio API" }] },
      { label: "Backend", items: [{ name: "FastAPI" }, { name: "Redis" }, { name: "S3", why: "Audio cache" }] },
      { label: "AI", items: [{ name: "ElevenLabs" }, { name: "AWS Polly" }] },
    ],
    architecture: [
      { tag: "01", title: "Split", text: "Text is divided into speakable chunks." },
      { tag: "02", title: "Synthesize", text: "Chunks are generated in parallel." },
      { tag: "03", title: "Cache", text: "Results are stored by content hash." },
      { tag: "04", title: "Stream", text: "Audio plays back as chunks arrive." },
    ],
    challenges: [
      { challenge: "Audible gaps between chunks.", solution: "Overlap-aware splitting and short crossfades smoothed playback." },
      { challenge: "High generation cost.", solution: "Aggressive caching cut repeated calls." },
    ],
    metrics: [
      { value: "0.9s", label: "Time to first audio" },
      { value: "−60%", label: "Generation cost" },
      { value: "8", label: "Voice presets" },
      { value: "2", label: "Providers supported" },
    ],
    timeline: [
      { phase: "Spike", text: "Compared providers and voices." },
      { phase: "Pipeline", text: "Chunking, caching and streaming." },
    ],
    learnings: ["Perceived latency matters most for audio.", "Cache keys must include every input.", "Test with real content, not samples."],
    gallery: [
      { caption: "Voice studio", cover: "grid" },
      { caption: "Playback timeline", cover: "waves" },
      { caption: "Usage and cost view", cover: "bars" },
    ],
    links: { repo: "https://github.com/example/lumen-voice" },
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

export function getAdjacentProjects(slug: string): { prev: Project; next: Project } | null {
  const index = projects.findIndex((project) => project.slug === slug);
  if (index === -1 || projects.length < 2) return null;
  return {
    prev: projects[(index - 1 + projects.length) % projects.length],
    next: projects[(index + 1) % projects.length],
  };
}

export function getRelatedProjects(slug: string, limit = 3): Project[] {
  const current = getProject(slug);
  if (!current) return [];
  const others = projects.filter((project) => project.slug !== slug);
  return others
    .sort((a, b) => Number(b.category === current.category) - Number(a.category === current.category))
    .slice(0, limit);
}
