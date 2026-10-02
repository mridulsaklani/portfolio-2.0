import type { SceneId } from "@/data/content";

type Rand = () => number;
const TAU = Math.PI * 2;

function mulberry32(seed: number): Rand {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function hashString(input: string) {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Roughly normal, bounded to about [-1, 1]. */
const gauss = (r: Rand) => (r() + r() + r() - 1.5) / 1.5;

function rotate(p: [number, number, number], rx: number, ry: number, rz: number): [number, number, number] {
  let [x, y, z] = p;
  let c = Math.cos(rx), s = Math.sin(rx);
  [y, z] = [y * c - z * s, y * s + z * c];
  c = Math.cos(ry); s = Math.sin(ry);
  [x, z] = [x * c + z * s, -x * s + z * c];
  c = Math.cos(rz); s = Math.sin(rz);
  [x, y] = [x * c - y * s, x * s + y * c];
  return [x, y, z];
}

function onSphere(r: Rand, radius: number): [number, number, number] {
  const u = r() * 2 - 1;
  const a = r() * TAU;
  const s = Math.sqrt(1 - u * u);
  return [Math.cos(a) * s * radius, u * radius, Math.sin(a) * s * radius];
}

function lerp3(a: number[], b: number[], t: number): [number, number, number] {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
}

/** Builds a point cloud of `n` particles that forms the silhouette for a given scene. */
export function buildShape(id: SceneId, n: number): Float32Array {
  const r = mulberry32(hashString(id));
  const out = new Float32Array(n * 3);
  const put = (i: number, p: [number, number, number]) => {
    out[i * 3] = p[0];
    out[i * 3 + 1] = p[1];
    out[i * 3 + 2] = p[2];
  };

  switch (id) {
    case "hero": {
      const ringTilts: [number, number][] = [[0.9, 0.2], [-0.6, 1.0], [0.25, -0.85]];
      for (let i = 0; i < n; i += 1) {
        const t = i / n;
        if (t < 0.5) {
          const [x, y, z] = onSphere(r, 1.55 + gauss(r) * 0.045);
          put(i, [x, y, z]);
        } else if (t < 0.74) {
          const d = onSphere(r, 0.8 * Math.pow(r(), 1.7));
          put(i, d);
        } else {
          const k = i % 3;
          const a = r() * TAU;
          const radius = 2.05 + k * 0.26 + gauss(r) * 0.025;
          const p = rotate([Math.cos(a) * radius, gauss(r) * 0.025, Math.sin(a) * radius], ringTilts[k][0], ringTilts[k][1], 0);
          put(i, p);
        }
      }
      break;
    }

    case "about": {
      const levels = 26;
      for (let i = 0; i < n; i += 1) {
        const t = r();
        const rung = r() < 0.2;
        const yLevel = rung ? (Math.floor(r() * levels) / (levels - 1)) : t;
        const y = (yLevel - 0.5) * 6.2;
        const angle = y * 1.55;
        const radius = 1.05;
        const a = [Math.cos(angle) * radius, y, Math.sin(angle) * radius];
        const b = [Math.cos(angle + Math.PI) * radius, y, Math.sin(angle + Math.PI) * radius];
        let p: [number, number, number];
        if (rung) p = lerp3(a, b, r());
        else p = i % 2 === 0 ? [a[0], a[1], a[2]] : [b[0], b[1], b[2]];
        p = [p[0] + gauss(r) * 0.04, p[1] + gauss(r) * 0.04, p[2] + gauss(r) * 0.04];
        put(i, rotate(p, 0, 0, 0.42));
      }
      break;
    }

    case "ai": {
      const layers = [3, 5, 6, 5, 3];
      const nodes: number[][] = [];
      const layerStart: number[] = [];
      layers.forEach((count, li) => {
        layerStart.push(nodes.length);
        for (let k = 0; k < count; k += 1) {
          const y = (k - (count - 1) / 2) * (3.4 / Math.max(count - 1, 1)) * 1.0;
          nodes.push([(li - 2) * 1.3, y, (r() - 0.5) * 1.1]);
        }
      });
      const edges: [number, number][] = [];
      for (let li = 0; li < layers.length - 1; li += 1) {
        for (let a = 0; a < layers[li]; a += 1) {
          for (let b = 0; b < layers[li + 1]; b += 1) edges.push([layerStart[li] + a, layerStart[li + 1] + b]);
        }
      }
      for (let i = 0; i < n; i += 1) {
        if (r() < 0.32) {
          const node = nodes[Math.floor(r() * nodes.length)];
          put(i, [node[0] + gauss(r) * 0.11, node[1] + gauss(r) * 0.11, node[2] + gauss(r) * 0.11]);
        } else {
          const [a, b] = edges[Math.floor(r() * edges.length)];
          const p = lerp3(nodes[a], nodes[b], r());
          put(i, [p[0] + gauss(r) * 0.012, p[1] + gauss(r) * 0.012, p[2] + gauss(r) * 0.012]);
        }
      }
      break;
    }

    case "cloud": {
      const slabs = [-1.55, -0.52, 0.52, 1.55];
      for (let i = 0; i < n; i += 1) {
        const roll = r();
        let p: [number, number, number];
        if (roll < 0.62) {
          const y = slabs[Math.floor(r() * slabs.length)];
          p = [(Math.floor(r() * 13) - 6) * 0.29 + gauss(r) * 0.012, y + gauss(r) * 0.012, (Math.floor(r() * 9) - 4) * 0.29 + gauss(r) * 0.012];
        } else if (roll < 0.8) {
          const y = slabs[Math.floor(r() * slabs.length)];
          const side = Math.floor(r() * 4);
          const along = (r() - 0.5) * 2;
          const hx = 1.9;
          const hz = 1.3;
          p = side === 0 ? [along * hx, y, -hz] : side === 1 ? [along * hx, y, hz] : side === 2 ? [-hx, y, along * hz] : [hx, y, along * hz];
        } else {
          const corners: [number, number][] = [[-1.9, -1.3], [1.9, -1.3], [-1.9, 1.3], [1.9, 1.3], [0, 0]];
          const c = corners[Math.floor(r() * corners.length)];
          p = [c[0] + gauss(r) * 0.015, (r() - 0.5) * 3.1, c[1] + gauss(r) * 0.015];
        }
        put(i, rotate(p, 0.0, 0.62, 0));
      }
      break;
    }

    case "skills": {
      for (let i = 0; i < n; i += 1) {
        if (r() < 0.16) {
          put(i, rotate(onSphere(r, 0.55 * Math.pow(r(), 0.6)), 0.9, 0, 0));
          continue;
        }
        const radius = Math.pow(r(), 0.72) * 3.2;
        const branch = ((i % 3) / 3) * TAU;
        const spin = radius * 1.15;
        const spread = (0.35 + radius * 0.05) * gauss(r) * 0.55;
        const theta = branch + spin + spread;
        const p: [number, number, number] = [Math.cos(theta) * radius, gauss(r) * 0.12 * (1 - radius / 4), Math.sin(theta) * radius];
        put(i, rotate(p, 0.95, 0, 0.2));
      }
      break;
    }

    case "systems": {
      for (let i = 0; i < n; i += 1) {
        if (r() < 0.82) {
          const t = r() * TAU;
          const rr = Math.cos(3 * t) + 2;
          const p: [number, number, number] = [rr * Math.cos(2 * t), rr * Math.sin(2 * t), -Math.sin(3 * t)];
          const k = 0.78;
          put(i, [p[0] * k + gauss(r) * 0.12, p[1] * k + gauss(r) * 0.12, p[2] * k * 1.2 + gauss(r) * 0.12]);
        } else {
          const a = r() * TAU;
          put(i, rotate([Math.cos(a) * 3.15, gauss(r) * 0.02, Math.sin(a) * 3.15], 1.15, 0.3, 0));
        }
      }
      break;
    }

    case "contact": {
      const radii = [0.8, 1.45, 2.1, 2.75, 3.4];
      for (let i = 0; i < n; i += 1) {
        if (r() < 0.12) {
          put(i, onSphere(r, 0.45 * Math.pow(r(), 0.5)));
          continue;
        }
        const k = Math.floor(r() * radii.length);
        const a = r() * TAU;
        const radius = radii[k] + gauss(r) * 0.02;
        put(i, [Math.cos(a) * radius, Math.sin(a) * radius, Math.sin(a * 3 + k) * 0.22 + gauss(r) * 0.02]);
      }
      break;
    }

    case "projects": {
      const cols = [-1.95, 0, 1.95];
      const rows = [0.78, -0.78];
      const hw = 0.82;
      const hh = 0.58;
      for (let i = 0; i < n; i += 1) {
        const cx = cols[Math.floor(r() * cols.length)];
        const cy = rows[Math.floor(r() * rows.length)];
        const z = (cx / 1.95) * 0.28 + (cy > 0 ? 0.12 : -0.12);
        const roll = r();
        let p: [number, number, number];
        if (roll < 0.52) {
          const side = Math.floor(r() * 4);
          const along = (r() - 0.5) * 2;
          p = side === 0 ? [cx + along * hw, cy - hh, z] : side === 1 ? [cx + along * hw, cy + hh, z] : side === 2 ? [cx - hw, cy + along * hh, z] : [cx + hw, cy + along * hh, z];
        } else if (roll < 0.86) {
          const line = Math.floor(r() * 4);
          const length = line === 0 ? 1 : 0.55 + (line % 2) * 0.25;
          p = [cx - hw + 0.18 + r() * (hw * 2 - 0.36) * length, cy + hh - 0.32 - line * 0.2, z];
        } else {
          p = [cx - hw * 0.62 + r() * 0.38, cy + hh * 0.5, z];
        }
        put(i, rotate([p[0] + gauss(r) * 0.008, p[1] + gauss(r) * 0.008, p[2]], 0.0, -0.32, 0.0));
      }
      break;
    }

    case "detail":
    default: {
      const h = 1.45;
      const corners: [number, number, number][] = [];
      for (const x of [-h, h]) for (const y of [-h, h]) for (const z of [-h, h]) corners.push([x, y, z]);
      const cubeEdges: [number, number][] = [];
      corners.forEach((a, i) => corners.forEach((b, j) => {
        if (j > i) {
          const diff = Number(a[0] !== b[0]) + Number(a[1] !== b[1]) + Number(a[2] !== b[2]);
          if (diff === 1) cubeEdges.push([i, j]);
        }
      }));
      const ph = 1.05;
      const oct: [number, number, number][] = [[ph, 0, 0], [-ph, 0, 0], [0, ph, 0], [0, -ph, 0], [0, 0, ph], [0, 0, -ph]];
      const octEdges: [number, number][] = [];
      oct.forEach((a, i) => oct.forEach((b, j) => {
        if (j > i && !(a[0] === -b[0] && a[1] === -b[1] && a[2] === -b[2])) octEdges.push([i, j]);
      }));
      for (let i = 0; i < n; i += 1) {
        const roll = r();
        let p: [number, number, number];
        if (roll < 0.5) {
          const [a, b] = cubeEdges[Math.floor(r() * cubeEdges.length)];
          p = lerp3(corners[a], corners[b], r());
        } else if (roll < 0.78) {
          const [a, b] = octEdges[Math.floor(r() * octEdges.length)];
          p = lerp3(oct[a], oct[b], r());
        } else {
          p = onSphere(r, 0.5 * Math.pow(r(), 0.5));
        }
        put(i, rotate([p[0] + gauss(r) * 0.012, p[1] + gauss(r) * 0.012, p[2] + gauss(r) * 0.012], 0.5, 0.6, 0));
      }
      break;
    }
  }
  return out;
}

/** Per-particle random seeds: x = morph stagger, y/z/w = shader variation. */
export function buildRandoms(n: number): Float32Array {
  const r = mulberry32(90210);
  const out = new Float32Array(n * 4);
  for (let i = 0; i < out.length; i += 1) out[i] = r();
  return out;
}
