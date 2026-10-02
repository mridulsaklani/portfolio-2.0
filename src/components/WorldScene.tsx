"use client";

import dynamic from "next/dynamic";

const Experience = dynamic(() => import("@/components/scene/Experience"), {
  ssr: false,
  loading: () => null,
});

export default function WorldScene() {
  return (
    <div className="scene-layer" aria-hidden="true">
      <Experience />
    </div>
  );
}
