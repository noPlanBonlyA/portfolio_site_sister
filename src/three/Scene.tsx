import { Suspense, useEffect } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import gsap from 'gsap';
import { NoToneMapping, SRGBColorSpace, TextureLoader } from 'three';
import { PROPS } from '../scene/layout';
import { Stage } from './Stage';
import { Props, propUrl } from './Props';
import { CameraRig, fovFor } from './CameraRig';
import { Effects } from './Effects';
import { ease, fx } from './fx';
import { useStore } from '../store';
import { markReady } from '../loading';

// start every download at once (instead of one Suspense waterfall)
['/set/color/plate.jpg', '/video/hero-poster.jpg', ...PROPS.map((p) => propUrl(p.image))].forEach((u) => useLoader.preload(TextureLoader, u));

function Ready() {
  useEffect(markReady, []);
  return null;
}

const SHADE: Partial<Record<string, number>> = { portfolio: 0.72, showreel: 0.55, backstage: 0.6, action: 0.08, breathe: 0.2 };

function Director() {
  const grade = useStore((s) => s.grade);
  useEffect(() => {
    gsap.to(fx, { sat: grade === 'color' ? 1 : 0, duration: 0.35, ease: 'power1.out', delay: 0.05 });
  }, [grade]);
  useFrame((_, dt) => {
    const s = useStore.getState();
    const special = s.view === 'action' || s.view === 'breathe';
    fx.shade = ease(fx.shade, s.panel || special ? (SHADE[s.view] ?? 0) : 0, dt, 2.2);
    fx.dim = ease(fx.dim, special ? 1 : 0, dt, 1.2);
    fx.arch = ease(fx.arch, s.view === 'action' && s.panel ? 0.4 : 0, dt, 1.4);
    fx.beam = special && s.panel ? 1 : 0;
  });
  return null;
}

export interface Quality {
  dpr: [number, number];
  bloom: boolean;
  mouseLook: boolean;
}

export default function Scene({ quality }: { quality: Quality }) {
  return (
    <Canvas
      className="webgl"
      dpr={quality.dpr}
      flat
      gl={{ antialias: true, powerPreference: 'high-performance', alpha: false, stencil: false }}
      camera={{ fov: fovFor(window.innerWidth / window.innerHeight), near: 0.1, far: 140, position: [0, 3, 9] }}
      onCreated={({ gl }) => {
        gl.toneMapping = NoToneMapping;
        gl.outputColorSpace = SRGBColorSpace;
        gl.setClearColor('#050505');
      }}
      aria-hidden="true"
    >
      <Suspense fallback={null}>
        <Stage />
        <Props />
        <CameraRig mouseLook={quality.mouseLook} />
        <Director />
        <Effects bloom={quality.bloom} />
        <Ready />
      </Suspense>
    </Canvas>
  );
}
