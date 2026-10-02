"use client";

import { useState } from "react";
import { ArrowDownRight, ArrowRight } from "lucide-react";

export interface ExplorerNode {
  id: string;
  label: string;
  detail: string;
  meta?: string;
}

export default function NodeExplorer({
  sceneId,
  nodes,
  layout = "flow",
  label,
}: {
  sceneId: string;
  nodes: ExplorerNode[];
  layout?: "flow" | "constellation";
  label: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeNode = nodes[activeIndex];

  function selectNode(index: number) {
    setActiveIndex(index);
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("portfolio:node-select", {
          detail: { sceneId, nodeId: nodes[index].id },
        }),
      );
    }
  }

  return (
    <div className={`node-explorer node-explorer-${layout}`}>
      <div className="node-track" role="group" aria-label={label}>
        {nodes.map((node, index) => (
          <div className="node-step" key={node.id}>
            <button
              className={`node-control${activeIndex === index ? " is-active" : ""}`}
              type="button"
              data-tilt
              aria-pressed={activeIndex === index}
              onFocus={() => selectNode(index)}
              onMouseEnter={() => selectNode(index)}
              onClick={() => selectNode(index)}
            >
              <span className="node-orb" aria-hidden="true"><i /><b /></span>
              <span className="node-label">{node.label}</span>
              {node.meta && <span className="node-meta">{node.meta}</span>}
            </button>
            {index < nodes.length - 1 && <span className="node-link" aria-hidden="true"><i /><ArrowRight size={12} /></span>}
          </div>
        ))}
      </div>
      {activeNode && (
        <div className="node-insight" aria-live="polite" aria-atomic="true">
          <span className="insight-index">NODE / {String(activeIndex + 1).padStart(2, "0")}</span>
          <div>
            <h3>{activeNode.label}</h3>
            <p id={`${activeNode.id}-detail`}>{activeNode.detail}</p>
          </div>
          <ArrowDownRight className="insight-arrow" size={17} aria-hidden="true" />
        </div>
      )}
    </div>
  );
}
