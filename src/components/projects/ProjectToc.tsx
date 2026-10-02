"use client";

import { useEffect, useState } from "react";

export interface TocItem {
  id: string;
  label: string;
}

export default function ProjectToc({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const elements = items.map((item) => document.getElementById(item.id)).filter((el): el is HTMLElement => Boolean(el));
    if (!elements.length) return;
    let frame = 0;
    const compute = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const line = window.innerHeight * 0.32;
        let current = elements[0].id;
        for (const element of elements) {
          if (element.getBoundingClientRect().top <= line) current = element.id;
        }
        setActive((previous) => (previous === current ? previous : current));
      });
    };
    compute();
    window.addEventListener("scroll", compute, { passive: true });
    window.addEventListener("resize", compute);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", compute);
      window.removeEventListener("resize", compute);
    };
  }, [items]);

  return (
    <nav className="project-toc" aria-label="On this page">
      <span className="toc-title">On this page</span>
      <ol>
        {items.map((item, index) => (
          <li key={item.id}>
            <a href={`#${item.id}`} className={active === item.id ? "is-active" : ""} aria-current={active === item.id ? "location" : undefined}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              {item.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
