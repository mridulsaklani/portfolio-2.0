"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { AdaptiveDpr, PerformanceMonitor, Sparkles } from "@react-three/drei";
import { Bloom, ChromaticAberration, EffectComposer, Vignette } from "@react-three/postprocessing";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import * as THREE from "three";
import type { SceneId } from "@/data/content";
import { buildRandoms, buildShape } from "./shapes";

/* ------------------------------------------------------------------ */
/* Configuration                                                       */
/* ------------------------------------------------------------------ */

interface Look {
  x: number;
  y: number;
  scale: number;
  opacity: number;
  rings: number;
  /** Base X tilt in radians. */
  tilt: number;
  /** If > 0 the shape sways ±sway radians instead of spinning a full turn (keeps layered shapes legible). */
  sway: number;
  a: string;
  b: string;
}

const LOOKS: Record<SceneId, Look> = {
  hero: { x: 1.6, y: -0.05, scale: 0.95, opacity: 1, rings: 0.72, tilt: -0.08, sway: 0, a: "#67e7f7", b: "#a092ff" },
  about: { x: 1.9, y: 0, scale: 0.6, opacity: 0.95, rings: 0.3, tilt: 0.0, sway: 0, a: "#67e7f7", b: "#7ab8ff" },
  ai: { x: 1.9, y: -0.1, scale: 0.62, opacity: 0.95, rings: 0.25, tilt: 0.12, sway: 0.62, a: "#a092ff", b: "#67e7f7" },
  cloud: { x: 2.0, y: -0.1, scale: 0.62, opacity: 0.95, rings: 0.25, tilt: 0.52, sway: 0.55, a: "#7ab8ff", b: "#67e7f7" },
  skills: { x: 1.9, y: 0, scale: 0.58, opacity: 0.95, rings: 0.2, tilt: 0.0, sway: 0, a: "#f58bd0", b: "#a092ff" },
  systems: { x: 1.9, y: 0, scale: 0.62, opacity: 0.95, rings: 0.25, tilt: 0.0, sway: 0, a: "#67e7f7", b: "#8ef0c4" },
  contact: { x: 1.5, y: 0, scale: 0.72, opacity: 0.9, rings: 0.4, tilt: 0.0, sway: 0.5, a: "#67e7f7", b: "#a092ff" },
  projects: { x: 0, y: 0.1, scale: 1.0, opacity: 0.5, rings: 0.0, tilt: 0.0, sway: 0.32, a: "#7ab8ff", b: "#a092ff" },
  detail: { x: 3.3, y: 1.35, scale: 0.62, opacity: 0.55, rings: 0.0, tilt: 0.0, sway: 0, a: "#67e7f7", b: "#a092ff" },
};

function sceneForPath(pathname: string): SceneId | null {
  if (pathname === "/projects") return "projects";
  if (pathname.startsWith("/projects/")) return "detail";
  if (pathname === "/") return null;
  return "projects";
}

const CAMERA_Z = 7.7;
const FOV = 42;
const damp = THREE.MathUtils.damp;

type Signals = { shockAt: number; kick: number; accent: string | null; quality: number };

/* ------------------------------------------------------------------ */
/* Particle shader                                                     */
/* ------------------------------------------------------------------ */

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uMorph;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uOpacity;
  uniform float uShock;
  uniform float uWaveY;
  uniform vec3 uPointer;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  attribute vec3 aFrom;
  attribute vec3 aTo;
  attribute vec4 aRand;
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    float stagger = aRand.x * 0.42;
    float m = clamp((uMorph - stagger) / 0.58, 0.0, 1.0);
    m = m * m * (3.0 - 2.0 * m);
    vec3 pos = mix(aFrom, aTo, m);

    float swirl = sin(m * 3.14159265);
    float ang = swirl * (aRand.z - 0.5) * 5.0;
    float cs = cos(ang);
    float sn = sin(ang);
    pos.xz = mat2(cs, -sn, sn, cs) * pos.xz;

    vec3 flow = vec3(
      sin(pos.y * 1.7 + uTime * 0.55 + aRand.y * 6.2831),
      sin(pos.z * 1.5 + uTime * 0.48 + aRand.z * 6.2831),
      sin(pos.x * 1.6 + uTime * 0.52 + aRand.w * 6.2831)
    );
    pos += flow * (0.03 + swirl * (0.55 + aRand.y * 0.9));

    float radius = length(pos);
    float shock = exp(-pow((radius - uShock * 3.8) * 2.2, 2.0)) * (1.0 - smoothstep(0.0, 1.7, uShock));
    pos += normalize(pos + vec3(0.0001)) * shock * 0.3;

    float wave = exp(-pow((pos.y - uWaveY) * 1.7, 2.0));

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    vec2 away = mv.xy - uPointer.xy;
    float dist = length(away);
    float push = uPointer.z * smoothstep(1.7, 0.0, dist);
    mv.xy += normalize(away + vec2(0.0001)) * push * 0.6;
    gl_Position = projectionMatrix * mv;

    float boost = 1.0 + wave * 1.0 + shock * 1.6 + push * 0.9;
    gl_PointSize = uSize * (0.55 + aRand.z * 0.95) * boost * uPixelRatio * (${CAMERA_Z.toFixed(1)} / -mv.z);

    float mixer = clamp(aRand.w * 0.55 + (pos.y * 0.12 + 0.5) * 0.5, 0.0, 1.0);
    vColor = mix(uColorA, uColorB, mixer) * (0.8 + wave * 1.5 + shock * 1.7 + push * 0.7);
    vAlpha = uOpacity * (0.5 + aRand.y * 0.5);
  }
`;

const fragmentShader = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float a = pow(smoothstep(0.5, 0.0, d), 1.6) * vAlpha;
    gl_FragColor = vec4(vColor, a);
    #include <colorspace_fragment>
  }
`;

/* ------------------------------------------------------------------ */
/* Scene objects                                                       */
/* ------------------------------------------------------------------ */

function ParticleField({
  sceneId,
  count,
  reducedMotion,
  signals,
}: {
  sceneId: SceneId;
  count: number;
  reducedMotion: boolean;
  signals: MutableRefObject<Signals>;
}) {
  const outer = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Group>(null);
  const rings = useRef<THREE.Group>(null);
  const satellites = useRef<(THREE.Mesh | null)[]>([]);
  const ringMaterials = useRef<(THREE.MeshBasicMaterial | null)[]>([]);
  const size = useThree((state) => state.size);
  const gl = useThree((state) => state.gl);

  const cache = useRef(new Map<SceneId, Float32Array>());
  const shape = (id: SceneId) => {
    let value = cache.current.get(id);
    if (!value) {
      value = buildShape(id, count);
      cache.current.set(id, value);
    }
    return value;
  };

  const machine = useRef({
    scene: sceneId,
    morph: 1,
    spin: 0.12,
    rotY: 0,
    lastScrollY: 0,
    scrollVel: 0,
    pointer: new THREE.Vector2(),
    pointerMoved: 0,
    colorA: new THREE.Color(LOOKS[sceneId].a),
    colorB: new THREE.Color(LOOKS[sceneId].b),
    targetA: new THREE.Color(),
    targetB: new THREE.Color(),
  });

  const { geometry, material, from, to, rand } = useMemo(() => {
    const randoms = buildRandoms(count);
    const start = Float32Array.from(buildShape(sceneId, count));
    const target = Float32Array.from(start);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(Float32Array.from(start), 3));
    geo.setAttribute("aFrom", new THREE.BufferAttribute(start, 3));
    geo.setAttribute("aTo", new THREE.BufferAttribute(target, 3));
    geo.setAttribute("aRand", new THREE.BufferAttribute(randoms, 4));
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 20);
    const mat = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      toneMapped: false,
      uniforms: {
        uTime: { value: 0 },
        uMorph: { value: 1 },
        uSize: { value: 3.1 },
        uPixelRatio: { value: 1 },
        uOpacity: { value: 1 },
        uShock: { value: 99 },
        uWaveY: { value: 0 },
        uPointer: { value: new THREE.Vector3(0, 0, 0) },
        uColorA: { value: new THREE.Color(LOOKS[sceneId].a) },
        uColorB: { value: new THREE.Color(LOOKS[sceneId].b) },
      },
    });
    return { geometry: geo, material: mat, from: start, to: target, rand: randoms };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  useEffect(() => () => {
    geometry.dispose();
    material.dispose();
  }, [geometry, material]);

  // Retarget the morph whenever the active scene changes.
  useEffect(() => {
    const m = machine.current;
    if (m.scene === sceneId) return;
    const next = shape(sceneId);
    // Freeze the current in-flight positions into `from` so interrupted morphs don't pop.
    for (let i = 0; i < count; i += 1) {
      const stagger = rand[i * 4] * 0.42;
      let k = Math.min(1, Math.max(0, (m.morph - stagger) / 0.58));
      k = k * k * (3 - 2 * k);
      for (let c = 0; c < 3; c += 1) from[i * 3 + c] = from[i * 3 + c] + (to[i * 3 + c] - from[i * 3 + c]) * k;
    }
    to.set(next);
    (geometry.getAttribute("aFrom") as THREE.BufferAttribute).needsUpdate = true;
    (geometry.getAttribute("aTo") as THREE.BufferAttribute).needsUpdate = true;
    m.morph = reducedMotion ? 1 : 0;
    m.scene = sceneId;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sceneId]);

  useFrame(({ clock, camera }, delta) => {
    const m = machine.current;
    const dt = Math.min(delta, 0.05);
    const t = reducedMotion ? 0 : clock.elapsedTime;
    const mobile = size.width < 720;
    const look = LOOKS[m.scene];
    const u = material.uniforms;

    geometry.setDrawRange(0, Math.floor(count * signals.current.quality));

    // morph progress (linear in time; per-particle easing happens in the shader)
    if (m.morph < 1) m.morph = Math.min(1, m.morph + Math.min(delta, 0.25) / 2.2);
    u.uMorph.value = reducedMotion ? 1 : m.morph;
    u.uTime.value = t;
    u.uPixelRatio.value = gl.getPixelRatio();
    u.uWaveY.value = reducedMotion ? 99 : -3.4 + ((t * 0.2) % 1) * 7.2;

    // shockwave when a node / project is selected
    const sinceShock = (performance.now() - signals.current.shockAt) / 1000;
    u.uShock.value = reducedMotion ? 99 : sinceShock;

    // pointer in view space (so the push is independent of the object's transform)
    const halfH = Math.tan(THREE.MathUtils.degToRad((camera as THREE.PerspectiveCamera).fov / 2)) * CAMERA_Z;
    const ndc = machineNdc.current;
    m.pointer.x = damp(m.pointer.x, ndc.x * halfH * (size.width / size.height), 9, dt);
    m.pointer.y = damp(m.pointer.y, ndc.y * halfH, 9, dt);
    const active = !reducedMotion && !mobile && performance.now() - machineNdc.current.t < 2500 ? 1 : 0;
    m.pointerMoved = damp(m.pointerMoved, active, 5, dt);
    u.uPointer.value.set(m.pointer.x, m.pointer.y, m.pointerMoved);

    // colours ease toward the scene look, or the project accent when one is set
    const accent = signals.current.accent;
    if (accent) {
      m.targetA.set(accent);
      m.targetB.set(accent).lerp(new THREE.Color("#ffffff"), 0.38);
    } else {
      m.targetA.set(look.a);
      m.targetB.set(look.b);
    }
    const k = 1 - Math.exp(-dt * 3);
    m.colorA.lerp(m.targetA, k);
    m.colorB.lerp(m.targetB, k);
    (u.uColorA.value as THREE.Color).copy(m.colorA);
    (u.uColorB.value as THREE.Color).copy(m.colorB);

    // composition: position, scale, opacity
    const outerGroup = outer.current;
    if (outerGroup) {
      const tx = mobile ? 0.35 : look.x;
      const ty = mobile ? -1.55 : look.y;
      const ts = look.scale * (mobile ? 0.52 : 1);
      outerGroup.position.x = damp(outerGroup.position.x, tx, 2.6, dt);
      outerGroup.position.y = damp(outerGroup.position.y, ty, 2.6, dt);
      const s = damp(outerGroup.scale.x, ts, 2.6, dt);
      outerGroup.scale.setScalar(s);
    }
    u.uOpacity.value = damp(u.uOpacity.value, look.opacity * (mobile ? 0.65 : 1), 3, dt);

    // scroll-linked spin + velocity-based energy
    const y = window.scrollY;
    const vel = dt > 0 ? (y - m.lastScrollY) / dt : 0;
    m.lastScrollY = y;
    m.scrollVel = damp(m.scrollVel, vel, 6, dt);
    if (!reducedMotion) {
      const target = 0.11 + THREE.MathUtils.clamp(m.scrollVel * 0.0011, -2.4, 2.4) + signals.current.kick;
      signals.current.kick = damp(signals.current.kick, 0, 2.2, dt);
      m.spin = damp(m.spin, target, 3.5, dt);
      m.rotY += m.spin * dt;
    }
    if (inner.current) {
      inner.current.rotation.y = look.sway > 0 ? Math.sin(m.rotY * 0.9) * look.sway : m.rotY;
      inner.current.rotation.x = damp(inner.current.rotation.x, reducedMotion ? 0 : look.tilt + ndcTilt(machineNdc.current.y, -0.2) + Math.sin(t * 0.17) * 0.06, 3, dt);
      inner.current.rotation.z = damp(inner.current.rotation.z, reducedMotion ? 0 : ndcTilt(machineNdc.current.x, 0.08), 3, dt);
    }

    // camera dolly with scroll speed
    const targetZ = CAMERA_Z - THREE.MathUtils.clamp(Math.abs(m.scrollVel) * 0.0012, 0, 0.9);
    camera.position.z = damp(camera.position.z, reducedMotion ? CAMERA_Z : targetZ, 3, dt);

    // HUD rings with orbiting satellites
    if (rings.current) {
      const rs = damp(rings.current.scale.x, look.rings * (mobile ? 0.55 : 1), 3, dt);
      rings.current.scale.setScalar(Math.max(rs, 0.0001));
      rings.current.visible = rs > 0.02;
      rings.current.rotation.y = t * 0.12;
      rings.current.children.forEach((child, i) => {
        child.rotation.z = t * (0.07 + i * 0.04) * (i % 2 ? -1 : 1);
        const sat = satellites.current[i];
        if (sat) {
          const a = t * (0.5 + i * 0.22) + i * 2.1;
          sat.position.set(Math.cos(a) * (2.9 + i * 0.34), 0, Math.sin(a) * (2.9 + i * 0.34));
        }
        ringMaterials.current[i]?.color.copy(m.colorA);
      });
    }
  });

  const ringTilts: [number, number, number][] = [[1.2, 0.2, 0], [0.5, 1.3, 0.4], [-0.7, 0.4, 1.0]];

  return (
    <group ref={outer} position={[LOOKS[sceneId].x, LOOKS[sceneId].y, 0]} scale={LOOKS[sceneId].scale}>
      <group ref={inner}>
        <points geometry={geometry} material={material} frustumCulled={false} />
      </group>
      <group ref={rings}>
        {ringTilts.map((tilt, i) => (
          <group key={i} rotation={tilt}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[2.9 + i * 0.34, 0.0045, 6, 220]} />
              <meshBasicMaterial ref={(node) => { ringMaterials.current[i] = node; }} color="#67e7f7" transparent opacity={0.28} toneMapped={false} depthWrite={false} />
            </mesh>
            <mesh ref={(node) => { satellites.current[i] = node; }}>
              <sphereGeometry args={[0.03, 12, 12]} />
              <meshBasicMaterial color="#e9fdff" toneMapped={false} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}

const machineNdc: MutableRefObject<{ x: number; y: number; t: number }> = { current: { x: 0, y: 0, t: -1e9 } };
const ndcTilt = (v: number, factor: number) => v * factor;

function PointerTracker() {
  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      machineNdc.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      machineNdc.current.y = -((event.clientY / window.innerHeight) * 2 - 1);
      machineNdc.current.t = performance.now();
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);
  return null;
}

function CameraRig({ reducedMotion }: { reducedMotion: boolean }) {
  useFrame(({ camera }, delta) => {
    const dt = Math.min(delta, 0.05);
    const tx = reducedMotion ? 0 : machineNdc.current.x * 0.32;
    const ty = reducedMotion ? 0 : machineNdc.current.y * 0.2;
    camera.position.x = damp(camera.position.x, tx, 2.2, dt);
    camera.position.y = damp(camera.position.y, ty, 2.2, dt);
    camera.lookAt(0, 0, 0);
  });
  return null;
}

function seeded(seed: number) {
  let value = seed;
  return () => {
    value = (value * 1664525 + 1013904223) % 4294967296;
    return value / 4294967296;
  };
}

function starPositions(seed: number, count: number, range: [number, number]) {
  const random = seeded(seed);
  const positions = new Float32Array(count * 3);
  for (let index = 0; index < count; index += 1) {
    const radius = range[0] + random() * (range[1] - range[0]);
    const theta = random() * Math.PI * 2;
    const y = (random() - 0.5) * 8;
    const ring = Math.sqrt(Math.max(0, radius * radius - y * y));
    positions.set([Math.cos(theta) * ring, y, Math.sin(theta) * ring], index * 3);
  }
  return positions;
}

function StarField({ reducedMotion }: { reducedMotion: boolean }) {
  const far = useRef<THREE.Group>(null);
  const near = useRef<THREE.Group>(null);
  const farMaterial = useRef<THREE.PointsMaterial>(null);
  const nearMaterial = useRef<THREE.PointsMaterial>(null);
  const farPositions = useMemo(() => starPositions(21, 360, [3.8, 11.6]), []);
  const nearPositions = useMemo(() => starPositions(47, 110, [2.6, 7.4]), []);

  useFrame(({ clock }, delta) => {
    const time = reducedMotion ? 0 : clock.elapsedTime;
    if (far.current && !reducedMotion) far.current.rotation.y += delta * 0.007;
    if (near.current && !reducedMotion) near.current.rotation.y -= delta * 0.014;
    if (farMaterial.current) farMaterial.current.opacity = 0.42 + (reducedMotion ? 0 : Math.sin(time * 0.6) * 0.07);
    if (nearMaterial.current) nearMaterial.current.opacity = 0.3 + (reducedMotion ? 0 : Math.sin(time * 0.44 + 1.7) * 0.09);
  });

  return (
    <>
      <group ref={far}>
        <points frustumCulled={false}>
          <bufferGeometry><bufferAttribute attach="attributes-position" args={[farPositions, 3]} /></bufferGeometry>
          <pointsMaterial ref={farMaterial} color="#a7dce4" size={0.013} transparent opacity={0.48} sizeAttenuation depthWrite={false} toneMapped={false} />
        </points>
      </group>
      <group ref={near}>
        <points frustumCulled={false}>
          <bufferGeometry><bufferAttribute attach="attributes-position" args={[nearPositions, 3]} /></bufferGeometry>
          <pointsMaterial ref={nearMaterial} color="#c9b8ff" size={0.021} transparent opacity={0.3} sizeAttenuation depthWrite={false} toneMapped={false} />
        </points>
      </group>
    </>
  );
}

function SceneReadySignal() {
  const frames = useRef(0);
  useFrame(() => {
    if (frames.current >= 3) return;
    frames.current += 1;
    if (frames.current === 3) {
      (window as unknown as { __portfolioSceneReady?: boolean }).__portfolioSceneReady = true;
      window.dispatchEvent(new Event("portfolio:scene-ready"));
    }
  });
  return null;
}

/* ------------------------------------------------------------------ */
/* Root                                                                */
/* ------------------------------------------------------------------ */

export default function Experience() {
  const pathname = usePathname();
  const [sceneId, setSceneId] = useState<SceneId>(() => sceneForPath(pathname) ?? "hero");
  const [reducedMotion, setReducedMotion] = useState(false);
  const [dpr, setDpr] = useState<[number, number]>([1, 1.5]);
  const [count] = useState(() => (typeof window !== "undefined" && (window.innerWidth < 720 || (navigator.hardwareConcurrency ?? 8) <= 4) ? 9000 : 22000));
  const signals = useRef<Signals>({ shockAt: -1e9, kick: 0, accent: null, quality: 1 });
  const chromaticOffset = useMemo(() => new THREE.Vector2(0.0006, 0.0011), []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const onSelect = () => {
      signals.current.shockAt = performance.now();
      signals.current.kick = 1.1;
    };
    const onAccent = (event: Event) => {
      const color = (event as CustomEvent<{ color: string | null }>).detail?.color ?? null;
      signals.current.accent = color;
      if (color) {
        signals.current.shockAt = performance.now();
      }
    };
    window.addEventListener("portfolio:node-select", onSelect);
    window.addEventListener("portfolio:accent", onAccent);
    return () => {
      window.removeEventListener("portfolio:node-select", onSelect);
      window.removeEventListener("portfolio:accent", onAccent);
    };
  }, []);

  // Which chapter is active: fixed for non-home routes, observer-driven on the home page.
  useEffect(() => {
    const fixed = sceneForPath(pathname);
    if (fixed) {
      setSceneId(fixed);
      return;
    }
    const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-scene]"));
    const visibleRatios = new Map<HTMLElement, number>();
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) visibleRatios.set(entry.target as HTMLElement, entry.isIntersecting ? entry.intersectionRatio : 0);
      const active = [...visibleRatios.entries()].filter(([, ratio]) => ratio > 0).sort((a, b) => b[1] - a[1])[0]?.[0];
      const next = active?.dataset.scene as SceneId | undefined;
      if (next) setSceneId((current) => (current === next ? current : next));
    }, { threshold: [0.08, 0.2, 0.38, 0.56], rootMargin: "-18% 0px -20% 0px" });
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [pathname]);

  return (
    <Canvas
      className="scene-canvas"
      dpr={dpr}
      camera={{ position: [0, 0, CAMERA_Z], fov: FOV, near: 0.1, far: 60 }}
      gl={{ alpha: true, antialias: false, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.setClearColor("#000000", 0);
      }}
    >
      <PerformanceMonitor
        onDecline={() => {
          setDpr([1, 1]);
          signals.current.quality = Math.max(0.45, signals.current.quality - 0.2);
        }}
        onIncline={() => {
          setDpr([1, 1.5]);
          signals.current.quality = 1;
        }}
      />
      <AdaptiveDpr pixelated={false} />
      <PointerTracker />
      <SceneReadySignal />
      <CameraRig reducedMotion={reducedMotion} />
      <StarField reducedMotion={reducedMotion} />
      <Sparkles count={count > 9000 ? 90 : 40} scale={[14, 8, 6]} size={2.2} speed={reducedMotion ? 0 : 0.22} opacity={0.4} color="#a8f4ff" />
      <ParticleField sceneId={sceneId} count={count} reducedMotion={reducedMotion} signals={signals} />
      {!reducedMotion && (
        <EffectComposer multisampling={0} enableNormalPass={false}>
          <Bloom mipmapBlur luminanceThreshold={0.22} luminanceSmoothing={0.3} intensity={0.9} radius={0.62} />
          <ChromaticAberration offset={chromaticOffset} radialModulation modulationOffset={0.4} />
          <Vignette eskil={false} offset={0.26} darkness={0.62} />
        </EffectComposer>
      )}
    </Canvas>
  );
}
