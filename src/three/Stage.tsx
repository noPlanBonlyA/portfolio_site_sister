import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { AdditiveBlending, Color, DoubleSide, type Mesh, type MeshBasicMaterial, PlaneGeometry, SRGBColorSpace, TextureLoader, VideoTexture } from 'three';
import { BACKDROP, DOLLY_TRACK, FLOOR, MARK, WALLS } from '../scene/layout';
import { archTex, beamTex, floorTex, radialTex, wallTex } from './textures';
import { breathLevel, ease, fx } from './fx';

export const WARM = new Color('#ffd9a8');

function Backdrop() {
  const plate = useLoader(TextureLoader, '/set/color/plate.jpg');
  const poster = useLoader(TextureLoader, '/video/hero-poster.jpg');
  const map = useMemo(() => {
    const t = plate.clone();
    t.colorSpace = SRGBColorSpace;
    t.anisotropy = 4;
    // use only the part of the plate above its floor line
    t.repeat.set(1, BACKDROP.usedFraction);
    t.offset.set(0, 1 - BACKDROP.usedFraction);
    t.needsUpdate = true;
    return t;
  }, [plate]);

  const s = BACKDROP.screen;
  const sw = s.x1 - s.x0;
  const sh = s.yTop - s.yBottom;
  const screenAspect = sw / sh;

  const matRef = useRef<MeshBasicMaterial>(null);
  const video = useMemo(() => {
    const v = document.createElement('video');
    v.src = '/video/hero-color.mp4';
    v.muted = true;
    v.loop = true;
    v.playsInline = true;
    v.crossOrigin = 'anonymous';
    v.preload = 'auto';
    v.setAttribute('aria-hidden', 'true');
    return v;
  }, []);
  const vtex = useMemo(() => {
    const t = new VideoTexture(video);
    t.colorSpace = SRGBColorSpace;
    // object-fit: cover (16:9 video into a wider screen)
    const r = 16 / 9 / screenAspect;
    t.repeat.set(1, r);
    t.offset.set(0, (1 - r) / 2);
    return t;
  }, [video, screenAspect]);
  const posterTex = useMemo(() => {
    const t = poster.clone();
    t.colorSpace = SRGBColorSpace;
    const r = 16 / 9 / screenAspect;
    t.repeat.set(1, r);
    t.offset.set(0, (1 - r) / 2);
    t.needsUpdate = true;
    return t;
  }, [poster, screenAspect]);

  useEffect(() => {
    const onPlay = () => {
      if (matRef.current) {
        matRef.current.map = vtex;
        matRef.current.needsUpdate = true;
      }
    };
    video.addEventListener('playing', onPlay);
    const tryPlay = () => video.play().catch(() => {});
    tryPlay();
    // iOS low-power mode may refuse autoplay until a gesture
    window.addEventListener('pointerdown', tryPlay, { once: true });
    const onVis = () => (document.hidden ? video.pause() : tryPlay());
    document.addEventListener('visibilitychange', onVis);
    return () => {
      video.removeEventListener('playing', onPlay);
      window.removeEventListener('pointerdown', tryPlay);
      document.removeEventListener('visibilitychange', onVis);
      video.pause();
    };
  }, [video, vtex]);

  const W = BACKDROP.x1 - BACKDROP.x0;
  const a = BACKDROP.arch;
  const archRef = useRef<MeshBasicMaterial>(null);
  useFrame(() => {
    if (archRef.current) archRef.current.opacity = Math.max(fx.arch, fx.breathT0 ? 0.1 + 0.4 * breathLevel(performance.now()) : 0);
  });

  return (
    <group>
      <mesh position={[(BACKDROP.x0 + BACKDROP.x1) / 2, BACKDROP.yTop / 2, BACKDROP.z]}>
        <planeGeometry args={[W, BACKDROP.yTop]} />
        <meshBasicMaterial map={map} toneMapped={false} />
      </mesh>
      <mesh position={[(s.x0 + s.x1) / 2, (s.yTop + s.yBottom) / 2, s.z]}>
        <planeGeometry args={[sw, sh]} />
        <meshBasicMaterial ref={matRef} map={posterTex} toneMapped={false} />
      </mesh>
      <mesh position={[(a.x0 + a.x1) / 2, (a.yTop + a.yBottom) / 2, a.z]}>
        <planeGeometry args={[a.x1 - a.x0, a.yTop - a.yBottom]} />
        <meshBasicMaterial ref={archRef} map={archTex()} color={WARM} transparent opacity={0} blending={AdditiveBlending} depthWrite={false} toneMapped={false} />
      </mesh>
    </group>
  );
}

function Floor() {
  const W = FLOOR.x1 - FLOOR.x0;
  const D = FLOOR.z1 - FLOOR.z0;
  const tex = useMemo(() => floorTex(W, D), [W, D]);
  return (
    <mesh rotation-x={-Math.PI / 2} position={[(FLOOR.x0 + FLOOR.x1) / 2, 0, (FLOOR.z0 + FLOOR.z1) / 2]}>
      <planeGeometry args={[W, D]} />
      <meshBasicMaterial map={tex} toneMapped={false} />
    </mesh>
  );
}

function Walls() {
  const tex = useMemo(() => {
    const t = wallTex().clone();
    t.repeat.set((WALLS.z1 - WALLS.z0) / 12, 1);
    t.needsUpdate = true;
    return t;
  }, []);
  const len = WALLS.z1 - WALLS.z0;
  const zc = (WALLS.z0 + WALLS.z1) / 2;
  return (
    <group>
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * WALLS.x, WALLS.height / 2, zc]} rotation-y={(-side * Math.PI) / 2}>
          <planeGeometry args={[len, WALLS.height]} />
          <meshBasicMaterial map={tex} side={DoubleSide} toneMapped={false} />
        </mesh>
      ))}
      {/* ceiling darkness + back wall behind the camera so nothing leaks */}
      <mesh position={[0, WALLS.height, zc]} rotation-x={Math.PI / 2}>
        <planeGeometry args={[WALLS.x * 2, len]} />
        <meshBasicMaterial color="#030303" />
      </mesh>
    </group>
  );
}

/** additive light pool on the floor */
export function Pool({ x, z, w, d, opacity = 1, color = WARM, y = 0.012, matRef }: { x: number; z: number; w: number; d: number; opacity?: number; color?: Color; y?: number; matRef?: React.Ref<MeshBasicMaterial> }) {
  return (
    <mesh rotation-x={-Math.PI / 2} position={[x, y, z]} renderOrder={1}>
      <planeGeometry args={[w, d]} />
      <meshBasicMaterial ref={matRef} map={radialTex()} color={color} transparent opacity={opacity} blending={AdditiveBlending} depthWrite={false} toneMapped={false} />
    </mesh>
  );
}

function FloorDressing() {
  const tape = '#d9d4c7';
  const t = DOLLY_TRACK;
  const sleepers = useMemo(() => {
    const out: number[] = [];
    for (let x = t.x0 + 0.11; x < t.x1; x += 0.96) out.push(x);
    return out;
  }, [t.x0, t.x1]);
  return (
    <group>
      {/* warm spill in front of the stage */}
      <Pool x={0} z={-30} w={42} d={14} opacity={0.32} />
      {/* actor's mark: a white gaffer-tape T in its own pool */}
      <Pool x={MARK.x} z={MARK.z} w={9} d={7} opacity={0.5} />
      <mesh rotation-x={-Math.PI / 2} position={[MARK.x, 0.02, MARK.z + 0.5]}>
        <planeGeometry args={[0.3, 2.2]} />
        <meshBasicMaterial color={tape} transparent opacity={0.6} toneMapped={false} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position={[MARK.x, 0.021, MARK.z - 0.6]}>
        <planeGeometry args={[1.6, 0.3]} />
        <meshBasicMaterial color={tape} transparent opacity={0.6} toneMapped={false} />
      </mesh>
      {/* dolly track: sleepers + two rails */}
      {sleepers.map((x) => (
        <mesh key={x} rotation-x={-Math.PI / 2} position={[x + 0.11, 0.015, (t.z0 + t.z1) / 2]}>
          <planeGeometry args={[0.22, t.z1 - t.z0]} />
          <meshBasicMaterial color="#2c2118" toneMapped={false} />
        </mesh>
      ))}
      {t.rails.map((z) => (
        <mesh key={z} rotation-x={-Math.PI / 2} position={[(t.x0 + t.x1) / 2, 0.02, z]}>
          <planeGeometry args={[t.x1 - t.x0, 0.1]} />
          <meshBasicMaterial color="#7a7672" toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

/** spotlight beam falling on the actor's mark (Action / Breathe) */
function Beam() {
  const ref = useRef<Mesh>(null);
  const mat = useRef<MeshBasicMaterial>(null);
  const cur = useRef(0);
  const geo = useMemo(() => {
    // trapezoid: narrow at the lamp, wide on the floor
    const g = new PlaneGeometry(5, 19);
    const p = g.attributes.position;
    for (let i = 0; i < p.count; i++) if (p.getY(i) > 0) p.setX(i, p.getX(i) * 0.22);
    return g;
  }, []);
  useFrame((_, dt) => {
    cur.current = ease(cur.current, fx.beam, dt, 1.6);
    if (mat.current) mat.current.opacity = cur.current * 0.55;
    if (ref.current) ref.current.visible = cur.current > 0.01;
  });
  return (
    <mesh ref={ref} geometry={geo} position={[MARK.x + 1.4, 9.4, MARK.z]} rotation-z={-0.16}>
      <meshBasicMaterial ref={mat} map={beamTex()} color={WARM} transparent opacity={0} blending={AdditiveBlending} depthWrite={false} side={DoubleSide} toneMapped={false} />
    </mesh>
  );
}

export function Stage() {
  return (
    <group>
      <Backdrop />
      <Floor />
      <Walls />
      <FloorDressing />
      <Beam />
    </group>
  );
}
