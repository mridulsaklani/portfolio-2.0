"use client";

import { useEffect, useRef } from "react";

const INTERACTIVE_SELECTOR = "a, button, input, textarea, [data-tilt], [role='button'], [role='tab']";

export default function CursorField() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const raw = useRef({ x: 0, y: 0 });
  const lagged = useRef({ x: 0, y: 0 });
  const frame = useRef(0);

  useEffect(() => {
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!canHover || reduced) return;

    let live = false;

    const onMove = (event: PointerEvent) => {
      raw.current.x = event.clientX;
      raw.current.y = event.clientY;
      if (!live) {
        // first real pointer position: snap the ring here so it doesn't fly in from the corner
        live = true;
        lagged.current.x = event.clientX;
        lagged.current.y = event.clientY;
        document.documentElement.classList.add("cursor-ready");
      }
      if (dot.current) {
        dot.current.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
      }
    };

    const onOver = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null;
      const active = target?.closest(INTERACTIVE_SELECTOR);
      document.documentElement.classList.toggle("cursor-active", Boolean(active));
    };

    const tick = () => {
      lagged.current.x += (raw.current.x - lagged.current.x) * 0.18;
      lagged.current.y += (raw.current.y - lagged.current.y) * 0.18;
      if (ring.current) {
        ring.current.style.transform = `translate3d(${lagged.current.x}px, ${lagged.current.y}px, 0)`;
      }
      frame.current = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    frame.current = requestAnimationFrame(tick);

    return () => {
      document.documentElement.classList.remove("cursor-ready", "cursor-active");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      cancelAnimationFrame(frame.current);
    };
  }, []);

  return (
    <div className="cursor-field" aria-hidden="true">
      <div ref={dot} className="cursor-dot" />
      <div ref={ring} className="cursor-ring" />
    </div>
  );
}
