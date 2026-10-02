"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const LINES = [
  "INIT MS.SYSTEMS KERNEL",
  "LOADING NEURAL INTERFACE",
  "CALIBRATING SIGNAL GRAPH",
  "PORTFOLIO ONLINE",
];

const STORAGE_KEY = "ms-boot-seen";
const LINE_INTERVAL = 260;
const HOLD_AFTER_LINES = 320;
const EXIT_DURATION = 640;
const MAX_WAIT = 3800; // never hold the page hostage if WebGL is slow or unavailable

type ReadyWindow = Window & { __portfolioSceneReady?: boolean };

export default function BootSequence() {
  const [mounted, setMounted] = useState(false);
  const [visibleLines, setVisibleLines] = useState(0);
  const [exiting, setExiting] = useState(false);
  const timers = useRef<number[]>([]);
  const exitStarted = useRef(false);

  const clearTimers = useCallback(() => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  }, []);

  const beginExit = useCallback(() => {
    if (exitStarted.current) return;
    exitStarted.current = true;
    clearTimers();
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* storage unavailable — sequence simply replays next load */
    }
    setExiting(true);
    timers.current.push(
      window.setTimeout(() => {
        setMounted(false);
        document.body.style.overflow = "";
      }, EXIT_DURATION),
    );
  }, [clearTimers]);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let alreadySeen = false;
    try {
      alreadySeen = sessionStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      alreadySeen = false;
    }
    if (reduced || alreadySeen || window.location.pathname !== "/") return;

    exitStarted.current = false;
    setMounted(true);
    setVisibleLines(0);
    setExiting(false);
    document.body.style.overflow = "hidden";

    // Lift the overlay only when the minimum sequence has played AND the 3D scene has rendered
    // its first frames, so the hero never reveals an empty canvas that pops in afterwards.
    let minElapsed = false;
    let sceneReady = (window as ReadyWindow).__portfolioSceneReady === true;
    const tryExit = () => {
      if (minElapsed && sceneReady) beginExit();
    };
    const onSceneReady = () => {
      sceneReady = true;
      tryExit();
    };
    window.addEventListener("portfolio:scene-ready", onSceneReady);

    LINES.forEach((_, index) => {
      timers.current.push(window.setTimeout(() => setVisibleLines(index + 1), index * LINE_INTERVAL));
    });
    timers.current.push(
      window.setTimeout(() => {
        minElapsed = true;
        tryExit();
      }, LINES.length * LINE_INTERVAL + HOLD_AFTER_LINES),
    );
    timers.current.push(window.setTimeout(beginExit, MAX_WAIT));

    return () => {
      window.removeEventListener("portfolio:scene-ready", onSceneReady);
      clearTimers();
      document.body.style.overflow = "";
    };
  }, [beginExit, clearTimers]);

  if (!mounted) return null;

  return (
    <div className={`boot-sequence${exiting ? " is-exiting" : ""}`} aria-hidden="true">
      <button type="button" className="boot-skip" onClick={beginExit} tabIndex={-1}>
        SKIP
      </button>
      <div className="boot-panel">
        <div className="boot-mark">MS<span>.</span></div>
        <div className="boot-lines">
          {LINES.slice(0, visibleLines).map((line, index) => (
            <p key={line} className="boot-line">
              <span className="boot-caret">{index === visibleLines - 1 && !exiting ? "›" : "✓"}</span>
              {line}
            </p>
          ))}
        </div>
        <div className="boot-bar"><span style={{ transform: `scaleX(${visibleLines / LINES.length})` }} /></div>
      </div>
    </div>
  );
}
