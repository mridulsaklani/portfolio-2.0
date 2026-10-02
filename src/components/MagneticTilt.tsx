"use client";

import { useEffect } from "react";

export default function MagneticTilt() {
  useEffect(() => {
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!canHover || reduced) return;

    let active: HTMLElement | null = null;

    const onMove = (event: PointerEvent) => {
      const target = (event.target as HTMLElement | null)?.closest<HTMLElement>("[data-tilt]");
      if (!target) return;
      active = target;
      const bounds = target.getBoundingClientRect();
      const px = (event.clientX - bounds.left) / bounds.width - 0.5;
      const py = (event.clientY - bounds.top) / bounds.height - 0.5;
      target.style.setProperty("--rx", (px * 10).toFixed(2));
      target.style.setProperty("--ry", (py * 10).toFixed(2));
    };

    const onLeave = (event: PointerEvent) => {
      const target = (event.target as HTMLElement | null)?.closest<HTMLElement>("[data-tilt]");
      if (!target) return;
      target.style.setProperty("--rx", "0");
      target.style.setProperty("--ry", "0");
      if (active === target) active = null;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerout", onLeave, { passive: true });

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerout", onLeave);
    };
  }, []);

  return null;
}
