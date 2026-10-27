import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { MathUtils, type PerspectiveCamera, Vector3 } from 'three';
import { BASE_ASPECT, FOV, PROPS } from '../scene/layout';
import { cam, isMoving, setAspect, snapTo } from '../nav';
import { isTouch, reducedMotion, useStore } from '../store';
import { ease, fx } from './fx';
import { labelEls } from '../ui/labelRegistry';

const D2R = MathUtils.DEG2RAD;

/** vertical FOV: keep the authored horizontal coverage on narrower screens, within limits */
export function fovFor(aspect: number) {
  if (aspect >= BASE_ASPECT) return FOV;
  const hHalf = Math.atan(Math.tan((FOV * D2R) / 2) * BASE_ASPECT);
  return Math.min(2 * Math.atan(Math.tan(hHalf) / aspect) / D2R, 62);
}

export const pointer = { x: 0.5, y: 0.5, active: false };

export function CameraRig({ mouseLook }: { mouseLook: boolean }) {
  const camera = useThree((s) => s.camera) as PerspectiveCamera;
  const size = useThree((s) => s.size);
  const sway = useRef({ yaw: 0, pitch: 0 });
  const torch = useRef(0);
  const pan = useRef(0);
  const panNow = useRef(0);
  const v = new Vector3();

  useEffect(() => {
    const aspect = size.width / Math.max(1, size.height);
    setAspect(aspect);
    camera.fov = fovFor(aspect);
    camera.updateProjectionMatrix();
    if (!isMoving()) snapTo(useStore.getState().view);
  }, [size, camera]);

  useEffect(() => {
    snapTo(useStore.getState().view);
    const onMove = (e: PointerEvent) => {
      pointer.x = e.clientX / window.innerWidth;
      pointer.y = e.clientY / window.innerHeight;
      pointer.active = e.pointerType === 'mouse';
    };
    // touch: swipe the overview left/right to look around
    let drag: { x: number; pan: number } | null = null;
    const onDown = (e: PointerEvent) => {
      if (e.pointerType === 'mouse' || !(e.target instanceof HTMLCanvasElement)) return;
      drag = { x: e.clientX, pan: pan.current };
    };
    const onDrag = (e: PointerEvent) => {
      if (!drag) return;
      const s = useStore.getState();
      if (s.view !== 'set' || s.phase !== 'idle') return;
      const limit = Math.max(0, (BASE_ASPECT / (window.innerWidth / window.innerHeight) - 1) * 14);
      pan.current = MathUtils.clamp(drag.pan + ((e.clientX - drag.x) / window.innerWidth) * 50, -limit, limit);
    };
    const onUp = () => (drag = null);
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    window.addEventListener('pointermove', onDrag, { passive: true });
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onDrag);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
  }, []);

  useFrame((_, dt) => {
    const s = useStore.getState();
    const onSet = s.view === 'set' && s.phase === 'idle' && s.leaderDone;
    const look = onSet && mouseLook && pointer.active && !reducedMotion();
    sway.current.yaw = ease(sway.current.yaw, look ? -(pointer.x - 0.5) * 3 : 0, dt, 2.2);
    sway.current.pitch = ease(sway.current.pitch, look ? -(pointer.y - 0.5) * 1.6 : 0, dt, 2.2);

    if (s.view !== 'set') pan.current = 0;
    panNow.current = ease(panNow.current, pan.current, dt, 6);

    camera.position.set(cam.x, cam.y + cam.bob, cam.z);
    camera.rotation.order = 'YXZ';
    camera.rotation.set((cam.pitch + sway.current.pitch) * D2R, (cam.yaw + sway.current.yaw + panNow.current) * D2R, cam.roll * D2R);
    camera.updateMatrixWorld();

    // torch follows the cursor on the overview
    torch.current = ease(torch.current, onSet && pointer.active && !isTouch() ? 1 : 0, dt, 2);
    fx.torch = torch.current;
    fx.torchX = pointer.x;
    fx.torchY = 1 - pointer.y;

    // project gaffer-tape labels
    const focal = size.height / 2 / Math.tan((camera.fov * D2R) / 2);
    for (const p of PROPS) {
      const el = p.label && labelEls[p.id];
      if (!el || !p.label) continue;
      v.set(...p.label.anchor).applyMatrix4(camera.matrixWorldInverse);
      const depth = -v.z;
      v.applyMatrix4(camera.projectionMatrix);
      if (depth < 0.5) {
        el.style.visibility = 'hidden';
        continue;
      }
      const x = (v.x * 0.5 + 0.5) * size.width;
      const y = (-v.y * 0.5 + 0.5) * size.height;
      const px = Math.max(11, Math.min(34, (p.label.font * 0.86 * focal) / depth));
      el.style.visibility = '';
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      el.style.fontSize = `${px.toFixed(1)}px`;
    }
  });

  return null;
}

