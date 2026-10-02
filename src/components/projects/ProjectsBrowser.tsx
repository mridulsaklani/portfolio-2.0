"use client";

import { useMemo, useState } from "react";
import { Search, SearchX } from "lucide-react";
import { projectCategories, type Project, type ProjectCategory } from "@/data/projects";
import ProjectCard from "./ProjectCard";

type Sort = "newest" | "oldest" | "name";

export default function ProjectsBrowser({ projects }: { projects: Project[] }) {
  const [category, setCategory] = useState<"All" | ProjectCategory>("All");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<Sort>("newest");

  const counts = useMemo(() => {
    const map = new Map<string, number>([["All", projects.length]]);
    projects.forEach((p) => map.set(p.category, (map.get(p.category) ?? 0) + 1));
    return map;
  }, [projects]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = projects.filter((p) => {
      if (category !== "All" && p.category !== category) return false;
      if (!q) return true;
      const haystack = [p.title, p.tagline, p.summary, p.category, ...p.tech.flatMap((g) => g.items.map((i) => i.name))].join(" ").toLowerCase();
      return haystack.includes(q);
    });
    return [...filtered].sort((a, b) => (sort === "name" ? a.title.localeCompare(b.title) : sort === "oldest" ? a.year - b.year : b.year - a.year));
  }, [projects, category, query, sort]);

  const reset = () => {
    setCategory("All");
    setQuery("");
    setSort("newest");
  };

  return (
    <div className="projects-browser">
      <div className="projects-toolbar">
        <div className="filter-chips" role="group" aria-label="Filter projects by category">
          {projectCategories.map((name) => (
            <button key={name} type="button" className={category === name ? "is-active" : ""} aria-pressed={category === name} onClick={() => setCategory(name)}>
              {name}
              <span>{counts.get(name) ?? 0}</span>
            </button>
          ))}
        </div>
        <div className="toolbar-controls">
          <label className="search-field">
            <Search size={16} aria-hidden="true" />
            <span className="sr-only">Search projects or technologies</span>
            <input type="search" placeholder="Search projects or tech" value={query} onChange={(event) => setQuery(event.target.value)} />
          </label>
          <label className="sort-field">
            <span className="sr-only">Sort projects</span>
            <select value={sort} onChange={(event) => setSort(event.target.value as Sort)}>
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="name">Name A–Z</option>
            </select>
          </label>
        </div>
      </div>

      <p className="results-count" role="status" aria-live="polite">
        Showing {visible.length} of {projects.length} projects
      </p>

      {visible.length > 0 ? (
        <div className="project-grid">
          {visible.map((project, index) => (
            <ProjectCard key={project.slug} project={project} index={index} />
          ))}
        </div>
      ) : (
        <div className="projects-empty">
          <SearchX size={28} strokeWidth={1.3} aria-hidden="true" />
          <h3>No projects match that search</h3>
          <p>Try a different keyword, or clear the filters to see everything.</p>
          <button type="button" className="button button-primary" onClick={reset}>Clear filters</button>
        </div>
      )}
    </div>
  );
}
