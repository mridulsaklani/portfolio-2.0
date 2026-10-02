"use client";

import { useState, type KeyboardEvent } from "react";
import { systemExplorations } from "@/data/content";
import NodeExplorer from "@/components/NodeExplorer";

export default function SystemsExplorer() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = systemExplorations[activeIndex];

  function moveTab(event: KeyboardEvent<HTMLButtonElement>, nextIndex: number) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      const index = (nextIndex + 1) % systemExplorations.length;
      setActiveIndex(index);
      document.getElementById(`exploration-tab-${systemExplorations[index].id}`)?.focus();
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      const index = (nextIndex - 1 + systemExplorations.length) % systemExplorations.length;
      setActiveIndex(index);
      document.getElementById(`exploration-tab-${systemExplorations[index].id}`)?.focus();
    }
  }

  return (
    <div className="systems-explorer">
      <div className="exploration-tabs" role="tablist" aria-label="Systems explorations">
        {systemExplorations.map((item, index) => (
          <button
            key={item.id}
            id={`exploration-tab-${item.id}`}
            type="button"
            data-tilt
            role="tab"
            aria-selected={activeIndex === index}
            aria-controls={`exploration-panel-${item.id}`}
            tabIndex={activeIndex === index ? 0 : -1}
            onClick={() => setActiveIndex(index)}
            onKeyDown={(event) => moveTab(event, index)}
          >
            <span>{item.number}</span>{item.category}
          </button>
        ))}
      </div>
      <article
        className="exploration-panel"
        id={`exploration-panel-${active.id}`}
        role="tabpanel"
        aria-labelledby={`exploration-tab-${active.id}`}
        tabIndex={0}
      >
        <div className="exploration-panel-copy">
          <span className="exploration-label">{active.category} <i>·</i> SYSTEMS EXPLORATION</span>
          <h3>{active.title}</h3>
          <p>{active.description}</p>
          <div className="tag-row">{active.labels.map((label) => <span key={label}>{label}</span>)}</div>
        </div>
        <NodeExplorer
          key={active.id}
          sceneId="systems"
          label={`${active.title} stages`}
          nodes={active.flow.map((step) => ({
            id: `${active.id}-${step.id}`,
            label: step.label,
            detail: step.detail,
          }))}
        />
      </article>
      <p className="lab-disclaimer"><span>↳</span> Interactive architecture studies based on my technical interests; these are not shipped project case studies.</p>
    </div>
  );
}
