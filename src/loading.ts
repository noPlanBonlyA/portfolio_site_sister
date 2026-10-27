// Real preload progress for the leader countdown (hooks the three.js loading manager
// before the canvas is created, so nothing is missed).
import { useSyncExternalStore } from 'react';
import { DefaultLoadingManager } from 'three';

let state = { progress: 0, done: false, ready: false };
const subs = new Set<() => void>();
const emit = (p: Partial<typeof state>) => {
  state = { ...state, ...p };
  subs.forEach((f) => f());
};

DefaultLoadingManager.onStart = (_u, loaded, total) => emit({ progress: total ? loaded / total : 0, done: false });
DefaultLoadingManager.onProgress = (_u, loaded, total) => emit({ progress: total ? loaded / total : 0 });
DefaultLoadingManager.onLoad = () => emit({ progress: 1, done: true });
DefaultLoadingManager.onError = () => emit({});

/** called once the whole 3D scene has committed (all textures decoded) */
export const markReady = () => emit({ ready: true, progress: 1 });

export function useLoading() {
  return useSyncExternalStore(
    (f) => (subs.add(f), () => subs.delete(f)),
    () => state,
  );
}
