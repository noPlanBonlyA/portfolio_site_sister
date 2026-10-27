import { create } from 'zustand';
import type { SectionKey, View } from './scene/layout';

export type Grade = 'bw' | 'color';
export type Phase = 'idle' | 'turn' | 'walk';

interface State {
  view: View;
  phase: Phase;
  /** section UI is on screen (after the walk) */
  panel: boolean;
  grade: Grade;
  sound: boolean;
  take: number;
  hover: SectionKey | null;
  leaderDone: boolean;
  slate: { key: SectionKey; take: number; id: number } | null;
  sub: string | null;
  toast: { text: string; id: number } | null;
  flash: number;
  bloop: boolean;
  set: (p: Partial<State>) => void;
}

export const useStore = create<State>((set) => ({
  view: 'title',
  phase: 'idle',
  panel: false,
  grade: 'bw',
  sound: false,
  take: 0,
  hover: null,
  leaderDone: false,
  slate: null,
  sub: null,
  toast: null,
  flash: 0,
  bloop: false,
  set: (p) => set(p),
}));

let toastTimer = 0;
export function toast(text: string, ms = 1300) {
  window.clearTimeout(toastTimer);
  useStore.getState().set({ toast: { text, id: Date.now() } });
  toastTimer = window.setTimeout(() => useStore.getState().set({ toast: null }), ms);
}

export const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const isTouch = () => typeof window !== 'undefined' && window.matchMedia('(hover: none), (pointer: coarse)').matches;

if (import.meta.env.DEV) (window as unknown as { __store: typeof useStore }).__store = useStore;
