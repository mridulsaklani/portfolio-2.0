import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ProjectNotFound() {
  return (
    <main className="section-wrap status-page" data-scene="projects">
      <span className="status-code">404</span>
      <h1>That project doesn’t exist.</h1>
      <p>It may have been renamed or removed. Browse the full list instead.</p>
      <Link className="button button-primary" data-tilt href="/projects"><ArrowLeft size={16} aria-hidden="true" /> Back to projects</Link>
    </main>
  );
}
