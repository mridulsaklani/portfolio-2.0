import type { Metadata } from "next";
import { ArrowDown, Info } from "lucide-react";
import ProjectCard from "@/components/projects/ProjectCard";
import ProjectsBrowser from "@/components/projects/ProjectsBrowser";
import { SAMPLE_CONTENT, projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Projects",
  description: "Selected projects in AI/ML, agents, cloud and full-stack engineering, with tech stacks, architecture and results.",
};

export default function ProjectsPage() {
  const featured = projects.filter((project) => project.featured).slice(0, 2);
  const techCount = new Set(projects.flatMap((project) => project.tech.flatMap((group) => group.items.map((item) => item.name)))).size;
  const categoryCount = new Set(projects.map((project) => project.category)).size;

  return (
    <main className="projects-page section-wrap" data-scene="projects">
      <header className="page-hero">
        <div className="eyebrow"><span className="pulse-dot" /> SELECTED WORK <span className="eyebrow-index">PROJECTS / 2026</span></div>
        <h1>Systems I’ve<br /><span className="title-accent">built &amp; shipped.</span></h1>
        <p className="page-lede">AI products, agent workflows, cloud platforms and full-stack tools — each with the problem, the architecture, the stack and what it achieved.</p>
        <dl className="page-stats">
          <div><dt>Projects</dt><dd>{projects.length}</dd></div>
          <div><dt>Disciplines</dt><dd>{categoryCount}</dd></div>
          <div><dt>Technologies</dt><dd>{techCount}</dd></div>
        </dl>
        {SAMPLE_CONTENT && (
          <p className="sample-note"><Info size={16} aria-hidden="true" /><span>These are sample projects used as placeholder content. Replace them in <code>src/data/projects.ts</code>.</span></p>
        )}
        <a className="scroll-cue" href="#featured">Featured work <ArrowDown size={14} aria-hidden="true" /></a>
      </header>

      {featured.length > 0 && (
        <section id="featured" className="projects-featured" aria-labelledby="featured-title">
          <div className="section-kicker"><span>01</span><i />FEATURED</div>
          <h2 id="featured-title" className="sr-only">Featured projects</h2>
          <div className="featured-grid">
            {featured.map((project) => <ProjectCard key={project.slug} project={project} size="feature" />)}
          </div>
        </section>
      )}

      <section id="all" className="projects-all" aria-labelledby="all-title">
        <div className="section-kicker"><span>02</span><i />ALL PROJECTS</div>
        <h2 id="all-title" className="section-title">Browse the full archive</h2>
        <ProjectsBrowser projects={projects} />
      </section>
    </main>
  );
}
