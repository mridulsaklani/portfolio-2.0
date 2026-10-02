import type { ReactNode } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Boxes,
  BrainCircuit,
  CloudCog,
  Code2,
  Network,
  Orbit,
} from "lucide-react";
import ContactForm from "@/components/ContactForm";
import NodeExplorer from "@/components/NodeExplorer";
import SystemsExplorer from "@/components/SystemsExplorer";
import { about, awsServices, engineeringPrinciples, profile, skillGroups } from "@/data/content";

function SectionHeading({
  number,
  label,
  title,
  id,
}: {
  number: string;
  label: string;
  title: ReactNode;
  id: string;
}) {
  return (
    <div className="section-heading">
      <div className="section-kicker"><span>{number}</span><i />{label}</div>
      <h2 id={id}>{title}</h2>
    </div>
  );
}

const aiNodes = [
  { id: "ai-llms", label: "LLMs & GenAI", meta: "01", detail: "Exploring language models as part of complete product systems, with APIs, data, and application behavior around them." },
  { id: "ai-rag", label: "RAG & retrieval", meta: "02", detail: "Connecting model responses to relevant source material through retrieval and carefully structured context." },
  { id: "ai-mcp", label: "MCP & agents", meta: "03", detail: "Building interest in agents that can use tools through explicit interfaces and observable steps." },
  { id: "ai-vision", label: "Computer vision", meta: "04", detail: "Turning visual model output into signals that can move through a useful application workflow." },
  { id: "ai-automation", label: "Automation", meta: "05", detail: "Applying AI to reduce repetitive work while keeping the underlying process understandable." },
];

const skillNodes = skillGroups.map((group, index) => ({
  id: `skill-${group.id}`,
  label: group.title,
  meta: `0${index + 1}`,
  detail: `${group.summary} Core areas: ${group.skills.join(" · ")}.`,
}));

const cloudNodes = awsServices.map((service) => ({
  id: `aws-${service.id}`,
  label: service.title,
  meta: service.skills.join(" / "),
  detail: `${service.detail} Services: ${service.skills.join(", ")}.`,
}));

export default function Home() {
  return (
    <main id="main">
        <section className="hero section-wrap" data-scene="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <div className="eyebrow hero-eyebrow"><span className="pulse-dot" /> SOFTWARE ENGINEERING <b>×</b> AI / ML <span className="eyebrow-index">PORTFOLIO / 2026</span></div>
            <h1 id="hero-title">Building<br /><span className="title-muted">intelligent</span><br /><span className="title-accent">systems<span className="accent-period">.</span></span></h1>
            <p className="hero-intro">I’m <strong>{profile.name}</strong> — an engineer working across software, AI/ML, and cloud to turn complex ideas into useful systems.</p>
            <div className="hero-actions">
              <a className="button button-primary" data-tilt href="#systems">Enter the systems lab <ArrowUpRight size={16} /></a>
              <a className="text-link" href="#about">Explore how I think <ArrowRight size={15} /></a>
            </div>
            <div className="hero-meta"><span>SCROLL TO CHANGE THE SYSTEM</span><span className="meta-line" /><ArrowDown size={14} strokeWidth={1.4} /></div>
          </div>
          <div className="hero-index" aria-hidden="true"><span>SYS / 001</span><i /><span>AI × SOFTWARE</span></div>
          <div className="hero-coordinate" aria-hidden="true"><span className="status-led" /> SYSTEMS ONLINE <span>·</span> M.S.S.</div>
        </section>

        <section className="about section-wrap chapter" id="about" data-scene="about" aria-labelledby="about-title">
          <div className="chapter-rail"><span>01</span><i /><span>ENGINEERING POINT OF VIEW</span></div>
          <div className="about-layout">
            <div className="about-lead-block">
              <div className="section-kicker"><span>01</span><i />A SYSTEMS MINDSET</div>
              <h2 id="about-title">I work where <span>intelligence</span> meets <span>engineering.</span></h2>
              <p className="about-lede">{about.lede}</p>
              <div className="about-mark"><span>MS<span>.</span></span><i />DESIGN THE SYSTEM<br />THEN MAKE IT USEFUL</div>
            </div>
            <div className="about-detail-block">
              <div className="about-coordinate"><span>PROFILE / 001</span><span>SOFTWARE + AI/ML</span></div>
              {about.paragraphs.map((paragraph, index) => <p key={paragraph} className={index === 0 ? "about-detail about-detail-lead" : "about-detail"}>{paragraph}</p>)}
              <div className="principle-strip" aria-label="Engineering principles">
                {engineeringPrinciples.map((principle) => <article className="principle-cell" key={principle.number}><span>{principle.number}</span><h3>{principle.title}</h3><p>{principle.text}</p></article>)}
              </div>
            </div>
          </div>
          <div className="section-endline"><span>01 / 06</span><i /><span>THINK · DESIGN · BUILD · REFINE</span></div>
        </section>

        <section className="intelligence section-wrap chapter" id="intelligence" data-scene="ai" aria-labelledby="intelligence-title">
          <div className="section-heading-row">
            <SectionHeading number="02" label="INTELLIGENCE, ENGINEERED" title={<>Models are only<br /><span>one part of the system.</span></>} id="intelligence-title" />
            <p className="section-intro">I’m interested in the full path from model capability to reliable product behavior: context, tools, APIs, and the workflow around them.</p>
          </div>
          <div className="chapter-caption"><BrainCircuit size={15} /><span>SELECT A SIGNAL TO TRACE IT THROUGH THE MODEL</span><i>INTERACTIVE / 05 NODES</i></div>
          <NodeExplorer sceneId="ai" label="AI and machine learning topics" nodes={aiNodes} />
          <div className="intelligence-foot"><span>GENERATIVE AI</span><i /><span>LLMS</span><i /><span>RAG</span><i /><span>MCP</span><i /><span>COMPUTER VISION</span><i /><span>AI AGENTS</span></div>
        </section>

        <section className="architecture section-wrap chapter" id="architecture" data-scene="cloud" aria-labelledby="architecture-title">
          <div className="architecture-head">
            <SectionHeading number="03" label="CLOUD / SYSTEM DESIGN" title={<>Make the system<br /><span>work as a whole.</span></>} id="architecture-title" />
            <div className="architecture-copy"><p>I care about how services communicate, how workloads move through a system, and what it takes to scale and operate it reliably.</p><span className="architecture-stamp"><CloudCog size={15} /> AWS SERVICE MAP <i>·</i> EXPLORABLE</span></div>
          </div>
          <div className="architecture-schematic">
            <div className="schematic-topline"><span>CONTROL PLANE / 01</span><span>SELECT A SERVICE GROUP</span><span><i /> LIVE MAP</span></div>
            <NodeExplorer sceneId="cloud" label="AWS service groups" nodes={cloudNodes} layout="constellation" />
            <div className="schematic-footer"><span>DELIVERY <b>→</b> COMPUTE <b>→</b> DATA <b>→</b> OBSERVABILITY</span><span>SCHEMATIC VIEW / SERVICE FAMILIES</span></div>
          </div>
          <div className="architecture-note"><Network size={15} /><p>Services shown reflect areas I work with and explore. This map describes service families, not a claim about a specific production deployment.</p></div>
        </section>

        <section className="skills section-wrap chapter" id="skills" data-scene="skills" aria-labelledby="skills-title">
          <div className="section-heading-row skills-heading-row">
            <SectionHeading number="04" label="THE ENGINEERING TOOLKIT" title={<>A connected<br /><span>set of disciplines.</span></>} id="skills-title" />
            <p className="section-intro">I work across the layers that bring intelligent applications together. Select a cluster to explore the tools and areas inside it.</p>
          </div>
          <div className="skills-layout">
            <div className="skills-aside"><div className="skills-aside-icon"><Boxes size={25} strokeWidth={1.15} /></div><span>CAPABILITY<br />CONSTELLATION</span><i /><p>One toolkit.<br />Many system boundaries.</p></div>
            <NodeExplorer sceneId="skills" label="Engineering skill groups" nodes={skillNodes} layout="constellation" />
          </div>
          <div className="skills-footnote"><Code2 size={15} /><span>FASTAPI · PYTHON · NODE.JS · REACT / NEXT.JS · REST APIS · POSTGRESQL · MONGODB · ELEVENLABS</span></div>
        </section>

        <section className="systems section-wrap chapter" id="systems" data-scene="systems" aria-labelledby="systems-title">
          <div className="systems-heading">
            <div><SectionHeading number="05" label="SYSTEMS EXPLORATIONS" title={<>Trace the idea<br /><span>through the architecture.</span></>} id="systems-title" /></div>
            <div className="systems-heading-side"><span className="systems-live"><i /> INTERACTIVE STUDIES</span><p>Small, explorable blueprints for the AI workflows and systems that I’m interested in building.</p></div>
          </div>
          <SystemsExplorer />
        </section>

        <section className="contact section-wrap chapter" id="contact" data-scene="contact" aria-labelledby="contact-title">
          <div className="contact-copy">
            <div className="section-kicker"><span>06</span><i />THE NEXT CONNECTION</div>
            <p className="availability"><span className="status-led" /> {profile.availability}</p>
            <h2 id="contact-title">Let’s build<br /><span>what’s next.</span></h2>
            <p className="contact-intro">I’m looking for challenging engineering problems and teams bringing software and AI together. If that sounds like your work, send me a note.</p>
            <div className="contact-signoff"><Orbit size={16} /><span>GOOD SYSTEMS START WITH A GOOD QUESTION.</span></div>
          </div>
          <div className="contact-panel"><ContactForm /></div>
        </section>
    </main>
  );
}
