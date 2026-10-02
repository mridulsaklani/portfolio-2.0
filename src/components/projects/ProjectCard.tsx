"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/data/projects";
import ProjectCover from "./ProjectCover";

function emit(project: Project | null) {
  window.dispatchEvent(new CustomEvent("portfolio:accent", { detail: { color: project?.accent ?? null } }));
  if (project) {
    window.dispatchEvent(new CustomEvent("portfolio:node-select", { detail: { sceneId: "projects", nodeId: project.slug } }));
  }
}

export default function ProjectCard({ project, size = "regular", index }: { project: Project; size?: "regular" | "feature"; index?: number }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className={`project-card project-card-${size}`}
      data-tilt
      style={{ "--accent": project.accent } as CSSProperties}
      onMouseEnter={() => emit(project)}
      onMouseLeave={() => emit(null)}
      onFocus={() => emit(project)}
      onBlur={() => emit(null)}
      aria-label={`${project.title}: ${project.tagline}`}
    >
      <ProjectCover seed={project.slug} variant={project.cover} accent={project.accent} image={project.image} />
      <div className="project-card-body">
        <div className="project-card-meta">
          {typeof index === "number" && <span className="project-index">{String(index + 1).padStart(2, "0")}</span>}
          <span>{project.category}</span>
          <i />
          <span>{project.year}</span>
          <span className={`status-pill status-${project.status.toLowerCase().replace(/\s+/g, "-")}`}>{project.status}</span>
        </div>
        <h3>{project.title}</h3>
        <p>{size === "feature" ? project.tagline : project.summary}</p>
        <ul className="chip-row" aria-label="Key technologies">
          {project.tech.flatMap((group) => group.items).slice(0, size === "feature" ? 6 : 4).map((item) => (
            <li key={item.name}>{item.name}</li>
          ))}
        </ul>
        <span className="project-card-cta">View case study <ArrowUpRight size={15} /></span>
      </div>
    </Link>
  );
}
