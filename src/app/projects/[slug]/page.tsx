import type { CSSProperties, ReactNode } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Code2, Globe, Info } from "lucide-react";
import ProjectCard from "@/components/projects/ProjectCard";
import ProjectCover from "@/components/projects/ProjectCover";
import ProjectToc, { type TocItem } from "@/components/projects/ProjectToc";
import SceneAccent from "@/components/projects/SceneAccent";
import { SAMPLE_CONTENT, getAdjacentProjects, getProject, getRelatedProjects, projects } from "@/data/projects";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "Project not found" };
  return {
    title: project.title,
    description: project.summary,
    openGraph: { title: project.title, description: project.summary, type: "article" },
  };
}

function Section({ id, number, label, title, children }: { id: string; number: string; label: string; title: string; children: ReactNode }) {
  return (
    <section className="project-section" id={id} aria-labelledby={`${id}-title`}>
      <div className="section-kicker"><span>{number}</span><i />{label}</div>
      <h2 id={`${id}-title`}>{title}</h2>
      {children}
    </section>
  );
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const adjacent = getAdjacentProjects(project.slug);
  const related = getRelatedProjects(project.slug);

  const sections = [
    { id: "overview", label: "Overview", show: project.overview.length > 0 },
    { id: "problem", label: "Problem & solution", show: Boolean(project.problem || project.solution) },
    { id: "features", label: "Key features", show: project.features.length > 0 },
    { id: "tech", label: "Tech stack", show: project.tech.length > 0 },
    { id: "architecture", label: "Architecture", show: project.architecture.length > 0 },
    { id: "challenges", label: "Challenges", show: project.challenges.length > 0 },
    { id: "results", label: "Results", show: project.metrics.length > 0 },
    { id: "timeline", label: "Timeline", show: project.timeline.length > 0 },
    { id: "gallery", label: "Gallery", show: project.gallery.length > 0 },
    { id: "learnings", label: "Learnings", show: project.learnings.length > 0 },
  ].filter((section) => section.show);
  const toc: TocItem[] = sections.map(({ id, label }) => ({ id, label }));
  const num = (id: string) => String(sections.findIndex((section) => section.id === id) + 1).padStart(2, "0");
  const has = (id: string) => sections.some((section) => section.id === id);
  const { live, repo, caseStudy } = project.links;

  return (
    <main className="project-page section-wrap" data-scene="detail" style={{ "--accent": project.accent } as CSSProperties}>
      <SceneAccent color={project.accent} />

      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link href="/projects"><ArrowLeft size={14} aria-hidden="true" /> All projects</Link>
        <i aria-hidden="true">/</i>
        <span aria-current="page">{project.title}</span>
      </nav>

      <header className="project-hero">
        <div className="project-hero-copy">
          <div className="project-hero-tags">
            <span className="chip-solid">{project.category}</span>
            <span className={`status-pill status-${project.status.toLowerCase().replace(/\s+/g, "-")}`}>{project.status}</span>
          </div>
          <h1>{project.title}</h1>
          <p className="project-tagline">{project.tagline}</p>
          <div className="project-actions">
            {live && <a className="button button-primary" data-tilt href={live} target="_blank" rel="noopener noreferrer"><Globe size={16} aria-hidden="true" /> Live demo <ArrowUpRight size={15} aria-hidden="true" /></a>}
            {repo && <a className="button button-ghost" data-tilt href={repo} target="_blank" rel="noopener noreferrer"><Code2 size={16} aria-hidden="true" /> Source code</a>}
            {caseStudy && <a className="text-link" href={caseStudy} target="_blank" rel="noopener noreferrer">Full write-up <ArrowRight size={15} aria-hidden="true" /></a>}
            {!live && !repo && !caseStudy && <span className="muted-note">Links available on request.</span>}
          </div>
          <dl className="project-meta">
            <div><dt>Role</dt><dd>{project.role}</dd></div>
            <div><dt>Year</dt><dd>{project.year}</dd></div>
            <div><dt>Team</dt><dd>{project.team}</dd></div>
            <div><dt>Duration</dt><dd>{project.duration}</dd></div>
          </dl>
        </div>
        <div className="project-hero-visual">
          <ProjectCover seed={project.slug} variant={project.cover} accent={project.accent} image={project.image} alt={`${project.title} cover illustration`} />
        </div>
      </header>

      {SAMPLE_CONTENT && <p className="sample-note"><Info size={16} aria-hidden="true" /><span>Sample project with placeholder content. Edit it in <code>src/data/projects.ts</code>.</span></p>}

      <div className="project-layout">
        <aside className="project-aside"><ProjectToc items={toc} /></aside>

        <article className="project-content">
          {has("overview") && (
            <Section id="overview" number={num("overview")} label="OVERVIEW" title="What it is">
              {project.overview.map((paragraph) => <p className="prose" key={paragraph}>{paragraph}</p>)}
            </Section>
          )}

          {has("problem") && (
            <Section id="problem" number={num("problem")} label="CONTEXT" title="The problem & the approach">
              <div className="split-cards">
                <div className="info-card"><h3>The problem</h3><p>{project.problem}</p></div>
                <div className="info-card info-card-accent"><h3>The solution</h3><p>{project.solution}</p></div>
              </div>
            </Section>
          )}

          {has("features") && (
            <Section id="features" number={num("features")} label="CAPABILITIES" title="Key features">
              <ul className="feature-list">
                {project.features.map((feature) => (
                  <li key={feature.title}><Check size={17} aria-hidden="true" /><div><h3>{feature.title}</h3><p>{feature.text}</p></div></li>
                ))}
              </ul>
            </Section>
          )}

          {has("tech") && (
            <Section id="tech" number={num("tech")} label="STACK" title="Tech stack">
              <div className="tech-grid">
                {project.tech.map((group) => (
                  <div className="tech-group" key={group.label}>
                    <h3>{group.label}</h3>
                    <ul>
                      {group.items.map((item) => (
                        <li key={item.name}><strong>{item.name}</strong>{item.why && <span>{item.why}</span>}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {has("architecture") && (
            <Section id="architecture" number={num("architecture")} label="SYSTEM DESIGN" title="How it works">
              <ol className="arch-flow">
                {project.architecture.map((step) => (
                  <li key={step.tag}><span className="arch-tag">{step.tag}</span><h3>{step.title}</h3><p>{step.text}</p></li>
                ))}
              </ol>
            </Section>
          )}

          {has("challenges") && (
            <Section id="challenges" number={num("challenges")} label="ENGINEERING" title="Challenges & solutions">
              <div className="challenge-list">
                {project.challenges.map((item) => (
                  <div className="challenge" key={item.challenge}>
                    <div><span>Challenge</span><p>{item.challenge}</p></div>
                    <div><span>Solution</span><p>{item.solution}</p></div>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {has("results") && (
            <Section id="results" number={num("results")} label="OUTCOMES" title="Results">
              <dl className="metric-grid">
                {project.metrics.map((metric) => <div key={metric.label}><dt>{metric.label}</dt><dd>{metric.value}</dd></div>)}
              </dl>
            </Section>
          )}

          {has("timeline") && (
            <Section id="timeline" number={num("timeline")} label="PROCESS" title="Timeline">
              <ol className="timeline">
                {project.timeline.map((step, index) => (
                  <li key={step.phase}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{step.phase}</h3><p>{step.text}</p></div></li>
                ))}
              </ol>
            </Section>
          )}

          {has("gallery") && (
            <Section id="gallery" number={num("gallery")} label="VISUALS" title="Gallery">
              <div className="gallery-grid">
                {project.gallery.map((shot) => (
                  <figure key={shot.caption}>
                    <ProjectCover seed={`${project.slug}-${shot.caption}`} variant={shot.cover} accent={project.accent} alt={shot.caption} />
                    <figcaption>{shot.caption}{SAMPLE_CONTENT && <em> · placeholder</em>}</figcaption>
                  </figure>
                ))}
              </div>
            </Section>
          )}

          {has("learnings") && (
            <Section id="learnings" number={num("learnings")} label="REFLECTION" title="What I learned">
              <ul className="learnings">
                {project.learnings.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </Section>
          )}
        </article>
      </div>

      {adjacent && (
        <nav className="project-pager" aria-label="More projects">
          <Link href={`/projects/${adjacent.prev.slug}`} data-tilt><span><ArrowLeft size={14} aria-hidden="true" /> Previous</span><strong>{adjacent.prev.title}</strong></Link>
          <Link href={`/projects/${adjacent.next.slug}`} data-tilt className="pager-next"><span>Next <ArrowRight size={14} aria-hidden="true" /></span><strong>{adjacent.next.title}</strong></Link>
        </nav>
      )}

      {related.length > 0 && (
        <section className="related-projects" aria-labelledby="related-title">
          <div className="section-kicker"><span>+</span><i />KEEP EXPLORING</div>
          <h2 id="related-title">More projects</h2>
          <div className="project-grid">
            {related.map((item) => <ProjectCard key={item.slug} project={item} />)}
          </div>
        </section>
      )}
    </main>
  );
}
