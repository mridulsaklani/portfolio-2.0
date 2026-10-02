"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ProjectsError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="section-wrap status-page" data-scene="projects">
      <span className="status-code">Error</span>
      <h1>Something went wrong.</h1>
      <p>The projects couldn’t be displayed. You can try again or head back home.</p>
      <div className="project-actions">
        <button type="button" className="button button-primary" onClick={reset}>Try again</button>
        <Link className="text-link" href="/">Go home</Link>
      </div>
    </main>
  );
}
