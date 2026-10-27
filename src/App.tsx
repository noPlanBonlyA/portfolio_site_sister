import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { useStore } from './store';
import { BottomBar, Cursor, Flash, Hud, Labels, Leader, Letterbox, Slate, Subtitle, TitleCard, Toast, useKeys } from './ui/Overlay';
import { Sections } from './sections/Sections';
import Plain from './plain/Plain';
import { snapTo } from './nav';
import type { Quality } from './three/Scene';
import { POSES, type View } from './scene/layout';

const Scene = lazy(() => import('./three/Scene'));

function hasWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

function useHash() {
  const [hash, setHash] = useState(() => window.location.hash);
  useEffect(() => {
    const on = () => setHash(window.location.hash);
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  return hash;
}

function quality(): Quality {
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const cores = navigator.hardwareConcurrency || 4;
  const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
  const lowEnd = coarse && (cores < 6 || mem < 4);
  return { dpr: [1, coarse ? 1.5 : 2], bloom: !lowEnd, mouseLook: !coarse };
}

// dev helper: ?view=about jumps straight to a view (for screenshots)
function devJump() {
  if (!import.meta.env.DEV) return;
  const v = new URLSearchParams(window.location.search).get('view') as View | null;
  if (v && v in POSES) {
    useStore.getState().set({ view: v, leaderDone: true, panel: true, phase: 'idle' });
    snapTo(v);
  }
  if (new URLSearchParams(window.location.search).get('grade') === 'color') useStore.getState().set({ grade: 'color' });
  // ?og hides the HUD for rendering the Open Graph image
  if (new URLSearchParams(window.location.search).has('og')) document.documentElement.classList.add('og');
}

function Studio() {
  const view = useStore((s) => s.view);
  const grade = useStore((s) => s.grade);
  const q = useMemo(quality, []);
  useKeys();
  useEffect(devJump, []);
  return (
    <div className={`root t-${grade} v-${view}`}>
      <a className="skip-link" href="#plain">
        Skip 3D — plain version
      </a>
      <Suspense fallback={null}>
        <Scene quality={q} />
      </Suspense>
      <Labels />
      <Letterbox />
      <TitleCard />
      <Sections />
      <Subtitle />
      <BottomBar />
      <Hud />
      <Slate />
      <Toast />
      <Flash />
      <Cursor />
      <Leader />
    </div>
  );
}

export default function App() {
  const hash = useHash();
  const webgl = useMemo(hasWebGL, []);
  const plain = hash === '#plain' || hash.startsWith('#p-') || !webgl;
  useEffect(() => {
    document.documentElement.classList.toggle('is-plain', plain);
  }, [plain]);
  return plain ? <Plain webgl={webgl} /> : <Studio />;
}
