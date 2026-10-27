// Navigation choreography: turn the head → walk (with bob) → slate → panel.
import gsap from 'gsap';
import { CatmullRomCurve3, MathUtils, Vector3 } from 'three';
import { BASE_ASPECT, POSES, PROPS, SECTION_KEYS, TURN_YAW, type SectionKey, type View } from './scene/layout';
import { reducedMotion, useStore } from './store';
import { scenes, subtitles } from './content';
import { sfx } from './sound';

// tweens follow wall-clock time, so they stay in sync with the slate/panel timers
gsap.ticker.lagSmoothing(0);

/** Live camera state read by CameraRig every frame (degrees for angles). */
export const cam = { x: 0, y: 0, z: 0, yaw: 0, pitch: 0, bob: 0, roll: 0, fade: 0 };

let aspect = BASE_ASPECT;
export function setAspect(a: number) {
  aspect = a;
}

const isSection = (v: View): v is SectionKey => (SECTION_KEYS as string[]).includes(v);

/** Pose for a view, adapted to the viewport (narrow screens step back to keep the set in frame). */
export function getPose(view: View) {
  const p = POSES[view];
  let [x, y, z] = p.pos;
  let pitch = p.pitch;
  if (aspect < BASE_ASPECT) {
    // narrow screens: step back a little and tilt down (the rest is reached by swiping)
    const k = Math.min(BASE_ASPECT / aspect - 1, 2.2);
    const back = view === 'set' ? 2.4 * k : view === 'action' ? 3 * k : view === 'breathe' ? 1.5 * k : 0;
    const yaw = MathUtils.degToRad(p.yaw);
    x += Math.sin(yaw) * back;
    z += Math.cos(yaw) * back;
    if (view === 'set') {
      y += 0.9 * k;
      pitch -= Math.min(4 * k, 8);
    }
  }
  return { x, y, z, yaw: p.yaw, pitch };
}

export function snapTo(view: View) {
  Object.assign(cam, getPose(view), { bob: 0, roll: 0 });
}

// ── path planning: detour around prop footprints ─────────────────────────────
function planPath(from: Vector3, to: Vector3) {
  const pts = [from.clone(), to.clone()];
  const boxes = PROPS.map((p) => ({ cx: p.base[0], cz: p.base[2], hw: p.size[0] / 2 + 0.7, hd: 1.1, h: p.size[1] }));
  for (let iter = 0; iter < 5; iter++) {
    let inserted = false;
    for (let i = 0; i < pts.length - 1 && !inserted; i++) {
      const a = pts[i];
      const b = pts[i + 1];
      for (let s = 1; s < 24 && !inserted; s++) {
        const q = a.clone().lerp(b, s / 24);
        for (const bx of boxes) {
          if (q.y > bx.h + 0.6) continue;
          if (Math.abs(q.x - bx.cx) < bx.hw && Math.abs(q.z - bx.cz) < bx.hd) {
            const side = Math.sign(q.x - bx.cx) || 1;
            pts.splice(i + 1, 0, new Vector3(bx.cx + side * (bx.hw + 0.35), q.y, bx.cz));
            inserted = true;
            break;
          }
        }
      }
    }
    if (!inserted) break;
  }
  return new CatmullRomCurve3(pts, false, 'centripetal', 0.5);
}

const shortestTo = (from: number, to: number) => from + ((((to - from + 180) % 360) + 360) % 360) - 180;

let tl: gsap.core.Timeline | null = null;
let timers: number[] = [];
const later = (fn: () => void, ms: number) => timers.push(window.setTimeout(fn, ms));

export function isMoving() {
  return !!tl && tl.isActive();
}

export function go(target: View) {
  const st = useStore.getState();
  const cur = st.view;
  if (target === cur && !isMoving()) return;
  tl?.kill();
  timers.forEach(clearTimeout);
  timers = [];

  const take = st.take + 1;
  const fromTitle = cur === 'title';
  const crane = target === 'action' || target === 'breathe' || fromTitle || target === 'title';
  const sub =
    target === 'set'
      ? subtitles.back
      : isSection(target)
        ? subtitles.walking(scenes[target].prop)
        : target === 'action'
          ? subtitles.action
          : target === 'breathe'
            ? subtitles.breathe
            : null;

  const turnFirst = cur === 'set' && isSection(target) && !isMoving();
  st.set({ view: target, phase: turnFirst ? 'turn' : 'walk', panel: false, take, sub: fromTitle ? null : sub, hover: null, bloop: false, slate: null });

  const dest = getPose(target);
  const reduce = reducedMotion();

  if (reduce) {
    // cross-fade cut: dip to black, jump, come back
    tl = gsap.timeline();
    tl.to(cam, { fade: 1, duration: 0.3, ease: 'power1.in' })
      .add(() => Object.assign(cam, dest, { bob: 0, roll: 0 }))
      .to(cam, { fade: 0, duration: 0.45, ease: 'power1.out' })
      .add(() => useStore.getState().set({ phase: 'idle', panel: true, sub: null }));
    return;
  }

  cam.fade = 0;
  tl = gsap.timeline();
  if (turnFirst) {
    tl.to(cam, { yaw: TURN_YAW[target as SectionKey], pitch: 0, duration: 0.9, ease: 'power2.inOut' });
    tl.add(() => useStore.getState().set({ phase: 'walk' }));
  }

  const walkDur = target === 'action' || target === 'breathe' ? 2.8 : fromTitle ? 2.6 : 2.2;
  const walkStart = turnFirst ? 0.9 : 0;

  let curve: CatmullRomCurve3;
  let yaw0 = 0;
  let yaw1 = 0;
  let pitch0 = 0;
  const steps = Math.round(walkDur * 1.8);
  const p = { t: 0 };
  const tmp = new Vector3();
  const tan = new Vector3();
  tl.to(
    p,
    {
      t: 1,
      duration: walkDur,
      ease: crane ? 'power2.inOut' : 'power1.inOut',
      onStart: () => {
        const from = new Vector3(cam.x, cam.y, cam.z);
        const to = new Vector3(dest.x, dest.y, dest.z);
        curve = crane
          ? new CatmullRomCurve3([from, from.clone().lerp(to, 0.5).setY(Math.max(from.y, to.y) + (fromTitle ? 1.5 : 0.5)), to], false, 'centripetal')
          : planPath(from, to);
        yaw0 = cam.yaw;
        yaw1 = shortestTo(yaw0, dest.yaw);
        pitch0 = cam.pitch;
      },
      onUpdate: () => {
        const t = p.t;
        curve.getPointAt(t, tmp);
        cam.x = tmp.x;
        cam.y = tmp.y;
        cam.z = tmp.z;
        const e = t * t * (3 - 2 * t);
        let yaw = yaw0 + (yaw1 - yaw0) * e;
        if (!crane && curve.points.length > 2) {
          // glance along the path while walking around something
          curve.getTangentAt(Math.min(t, 0.999), tan);
          const heading = MathUtils.radToDeg(Math.atan2(-tan.x, -tan.z));
          const d = shortestTo(yaw, heading) - yaw;
          if (Math.abs(d) < 60) yaw += d * Math.sin(Math.PI * t) * 0.35;
        }
        cam.yaw = yaw;
        cam.pitch = pitch0 + (dest.pitch - pitch0) * e;
        if (!crane) {
          const env = Math.sin(Math.PI * t);
          cam.bob = Math.abs(Math.sin(t * Math.PI * steps)) * 0.07 * env - 0.02 * env;
          cam.roll = Math.sin(t * Math.PI * steps) * 0.3 * env;
        }
      },
      onComplete: () => {
        cam.bob = 0;
        cam.roll = 0;
        useStore.getState().set({ phase: 'idle', sub: null });
      },
    },
    walkStart,
  );

  if (!fromTitle && target !== 'title') later(() => sfx('steps', Math.round(walkDur * 1.8)), walkStart * 1000);

  if (isSection(target)) {
    later(() => {
      useStore.getState().set({ slate: { key: target, take, id: Date.now() } });
      later(() => sfx('clap'), 520);
      later(() => useStore.getState().set({ slate: null }), 1300);
    }, (walkStart + 0.9) * 1000);
  }
  if (target === 'action') later(() => sfx('voice', 'action'), 300);
  // panels slide in a little before the camera settles
  later(() => useStore.getState().set({ panel: true }), (walkStart + walkDur * 0.72) * 1000);
}

/** clapperboard click: in Projects it counts claps for the blooper reel */
let claps = 0;
let clapTimer = 0;
export function clapClick(onCount: (left: number) => void) {
  const st = useStore.getState();
  if (st.view !== 'projects') return go('projects');
  claps++;
  window.clearTimeout(clapTimer);
  clapTimer = window.setTimeout(() => (claps = 0), 1600);
  sfx('clap');
  if (claps >= 3) {
    claps = 0;
    sfx('whoosh');
    st.set({ bloop: true, toast: null });
  } else onCount(3 - claps);
}
