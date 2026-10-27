import { useMemo, useRef } from 'react';
import { type ThreeEvent, useFrame, useLoader } from '@react-three/fiber';
import { type Group, type Intersection, Mesh, type MeshBasicMaterial, type Raycaster, SRGBColorSpace, TextureLoader, type Texture } from 'three';
import { PROPS, type PropDef } from '../scene/layout';
import { useStore } from '../store';
import { clapClick, go } from '../nav';
import { projects } from '../content';
import { toast } from '../store';
import { shadowTex } from './textures';
import { Pool } from './Stage';
import { ease } from './fx';

const MASK = 96;

/** low-res alpha mask so clicks on transparent pixels fall through */
function alphaMask(tex: Texture) {
  const img = tex.image as CanvasImageSource & { width: number; height: number };
  const c = document.createElement('canvas');
  c.width = MASK;
  c.height = MASK;
  const g = c.getContext('2d', { willReadFrequently: true })!;
  g.drawImage(img, 0, 0, MASK, MASK);
  const d = g.getImageData(0, 0, MASK, MASK).data;
  const a = new Uint8Array(MASK * MASK);
  for (let i = 0; i < a.length; i++) a[i] = d[i * 4 + 3];
  return a;
}

export const propUrl = (id: string) => `/set/color/${id}.webp`;

function Prop({ def }: { def: PropDef }) {
  const tex = useLoader(TextureLoader, propUrl(def.image));
  const [w, h] = def.size;
  const group = useRef<Group>(null);
  const poolMat = useRef<MeshBasicMaterial>(null);
  const lift = useRef(0);
  const pool = useRef(0);

  const map = useMemo(() => {
    const t = tex.clone();
    t.colorSpace = SRGBColorSpace;
    t.anisotropy = 4;
    t.needsUpdate = true;
    return t;
  }, [tex]);

  const mesh = useMemo(() => {
    const m = new Mesh();
    if (def.section) {
      const mask = alphaMask(tex);
      m.raycast = function (raycaster: Raycaster, hits: Intersection[]) {
        const tmp: Intersection[] = [];
        Mesh.prototype.raycast.call(this, raycaster, tmp);
        for (const hit of tmp) {
          if (!hit.uv) continue;
          const x = Math.min(MASK - 1, Math.floor(hit.uv.x * MASK));
          const y = Math.min(MASK - 1, Math.floor((1 - hit.uv.y) * MASK));
          if (mask[y * MASK + x] > 90) hits.push(hit);
        }
      };
    } else m.raycast = () => {};
    return m;
  }, [def.section, tex]);

  const interactive = () => {
    const s = useStore.getState();
    if (s.leaderDone === false) return false;
    if (s.view === 'set' && s.phase === 'idle') return true;
    return def.id === 'clap' && s.view === 'projects' && s.phase === 'idle';
  };

  useFrame((_, dt) => {
    const s = useStore.getState();
    const hovered = s.hover === def.section && s.view === 'set';
    lift.current = ease(lift.current, hovered ? 0.1 : 0, dt, 8);
    if (group.current) group.current.position.y = lift.current;
    // light pool fades in once the camera is walking to (or standing at) this prop
    const on = def.section && s.view === def.section && s.phase !== 'turn' ? 1 : 0;
    pool.current = ease(pool.current, on, dt, on ? 1.4 : 3);
    if (poolMat.current) poolMat.current.opacity = pool.current * 0.42;
  });

  const handlers = def.section
    ? {
        onPointerOver: (e: ThreeEvent<PointerEvent>) => {
          if (!interactive()) return;
          e.stopPropagation();
          useStore.getState().set({ hover: def.section });
          document.body.style.cursor = 'pointer';
        },
        onPointerOut: () => {
          if (useStore.getState().hover === def.section) useStore.getState().set({ hover: null });
          document.body.style.cursor = '';
        },
        onClick: (e: ThreeEvent<MouseEvent>) => {
          if (!interactive()) return;
          e.stopPropagation();
          document.body.style.cursor = '';
          if (def.id === 'clap') clapClick((left) => toast(projects.clapsLeft(left)));
          else go(def.section!);
        },
      }
    : {};

  const [bx, , bz] = def.base;
  return (
    <group>
      <mesh rotation-x={-Math.PI / 2} position={[bx, 0.008, bz]} renderOrder={1}>
        <planeGeometry args={def.shadow} />
        <meshBasicMaterial map={shadowTex()} transparent depthWrite={false} toneMapped={false} />
      </mesh>
      {def.pool && <Pool x={bx} z={bz} w={def.pool[0]} d={def.pool[1]} opacity={0} matRef={poolMat} y={0.014} />}
      <group ref={group}>
        <primitive object={mesh} position={[bx, h / 2, bz]} rotation-z={((def.tilt ?? 0) * Math.PI) / 180} {...handlers}>
          <planeGeometry args={[w, h]} />
          <meshBasicMaterial map={map} transparent alphaTest={0.04} toneMapped={false} />
        </primitive>
      </group>
    </group>
  );
}

export function Props() {
  return (
    <group>
      {PROPS.map((p) => (
        <Prop key={p.id} def={p} />
      ))}
    </group>
  );
}
