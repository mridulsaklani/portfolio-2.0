"use client";

import { useEffect } from "react";

/** Tints the persistent 3D scene with a project's accent colour while mounted. */
export default function SceneAccent({ color }: { color: string }) {
  useEffect(() => {
    window.dispatchEvent(new CustomEvent("portfolio:accent", { detail: { color } }));
    return () => {
      window.dispatchEvent(new CustomEvent("portfolio:accent", { detail: { color: null } }));
    };
  }, [color]);
  return null;
}
