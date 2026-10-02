import type { CSSProperties } from "react";
import type { CoverStyle } from "@/data/projects";

function hash(input: string) {
  let h = 1779033703 ^ input.length;
  for (let i = 0; i < input.length; i += 1) {
    h = Math.imul(h ^ input.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return h >>> 0;
}

function rng(seed: number) {
  let t = seed;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

const W = 400;
const H = 250;

function Network({ r, accent }: { r: () => number; accent: string }) {
  const nodes = Array.from({ length: 20 }, () => ({ x: 30 + r() * 340, y: 24 + r() * 202, s: 1.6 + r() * 3.2 }));
  const edges: [number, number][] = [];
  nodes.forEach((a, i) =>
    nodes.forEach((b, j) => {
      if (j > i && Math.hypot(a.x - b.x, a.y - b.y) < 92) edges.push([i, j]);
    }),
  );
  return (
    <g>
      {edges.map(([i, j]) => (
        <line key={`${i}-${j}`} x1={nodes[i].x} y1={nodes[i].y} x2={nodes[j].x} y2={nodes[j].y} stroke={accent} strokeOpacity=".28" />
      ))}
      {nodes.map((n, i) => (
        <circle key={i} cx={n.x} cy={n.y} r={n.s} fill={accent} fillOpacity={0.45 + (i % 3) * 0.2} />
      ))}
    </g>
  );
}

function Waves({ r, accent }: { r: () => number; accent: string }) {
  return (
    <g fill="none" stroke={accent}>
      {Array.from({ length: 6 }, (_, k) => {
        const amp = 14 + r() * 26;
        const phase = r() * 6.28;
        const freq = 0.018 + r() * 0.016;
        const base = 55 + k * 28;
        const d = Array.from({ length: 41 }, (_, i) => {
          const x = i * 10;
          return `${i === 0 ? "M" : "L"}${x},${(base + Math.sin(x * freq + phase) * amp).toFixed(1)}`;
        }).join(" ");
        return <path key={k} d={d} strokeOpacity={0.16 + k * 0.1} strokeWidth={1 + k * 0.22} />;
      })}
    </g>
  );
}

function Grid({ r, accent }: { r: () => number; accent: string }) {
  const cells = [];
  for (let x = 0; x < 15; x += 1) {
    for (let y = 0; y < 9; y += 1) {
      const lit = r() > 0.82;
      cells.push(<circle key={`${x}-${y}`} cx={26 + x * 25} cy={24 + y * 25} r={lit ? 3.4 : 1.4} fill={accent} fillOpacity={lit ? 0.9 : 0.3} />);
    }
  }
  return (
    <g>
      {cells}
      <rect x={r() * 160 + 40} y={r() * 60 + 40} width={120} height={72} fill="none" stroke={accent} strokeOpacity=".6" />
    </g>
  );
}

function Orbit({ r, accent }: { r: () => number; accent: string }) {
  return (
    <g fill="none" stroke={accent}>
      {Array.from({ length: 5 }, (_, k) => {
        const rx = 50 + k * 30;
        const ry = 20 + k * 14;
        const rot = -28 + k * 9 + r() * 6;
        const a = r() * 6.28;
        return (
          <g key={k} transform={`translate(200 125) rotate(${rot})`}>
            <ellipse rx={rx} ry={ry} strokeOpacity={0.18 + k * 0.08} />
            <circle cx={Math.cos(a) * rx} cy={Math.sin(a) * ry} r={3.2} fill={accent} stroke="none" />
          </g>
        );
      })}
      <circle cx="200" cy="125" r="14" fill={accent} fillOpacity=".5" stroke="none" />
    </g>
  );
}

function Bars({ r, accent }: { r: () => number; accent: string }) {
  return (
    <g fill={accent}>
      {Array.from({ length: 22 }, (_, i) => {
        const h = 30 + r() * 150;
        return <rect key={i} x={22 + i * 16.5} y={H - 24 - h} width="9" height={h} fillOpacity={0.18 + (h / 180) * 0.5} />;
      })}
      <rect x="22" y={H - 24} width="360" height="1" fillOpacity=".5" />
    </g>
  );
}

function Rings({ r, accent }: { r: () => number; accent: string }) {
  return (
    <g fill="none" stroke={accent} transform="translate(200 125)">
      {Array.from({ length: 6 }, (_, k) => {
        const rad = 20 + k * 20;
        const c = 2 * Math.PI * rad;
        return <circle key={k} r={rad} strokeOpacity={0.2 + k * 0.08} strokeDasharray={`${(c * (0.25 + r() * 0.5)).toFixed(0)} ${(c * 0.12).toFixed(0)}`} strokeWidth={1.4} transform={`rotate(${Math.round(r() * 360)})`} />;
      })}
    </g>
  );
}

const patterns: Record<CoverStyle, typeof Network> = { network: Network, waves: Waves, grid: Grid, orbit: Orbit, bars: Bars, rings: Rings };

export default function ProjectCover({
  seed,
  variant,
  accent,
  image,
  alt = "",
}: {
  seed: string;
  variant: CoverStyle;
  accent: string;
  image?: string;
  alt?: string;
}) {
  const Pattern = patterns[variant];
  const r = rng(hash(`${seed}:${variant}`));
  const id = `cv-${seed}-${variant}`.replace(/[^a-z0-9-]/gi, "");
  return (
    <div className="project-cover" style={{ "--accent": accent } as CSSProperties}>
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image} alt={alt} loading="lazy" decoding="async" />
      ) : (
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" role="img" aria-label={alt || undefined} aria-hidden={alt ? undefined : true}>
          <defs>
            <radialGradient id={`${id}-g`} cx="70%" cy="35%" r="85%">
              <stop offset="0" stopColor={accent} stopOpacity=".22" />
              <stop offset="1" stopColor="#07090b" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width={W} height={H} fill="#080d10" />
          <rect width={W} height={H} fill={`url(#${id}-g)`} />
          <Pattern r={r} accent={accent} />
        </svg>
      )}
    </div>
  );
}
