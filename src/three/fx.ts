// Shared, frame-rate-independent visual state (tweened by GSAP or eased in useFrame).
export const fx = {
  /** 0 = B&W, 1 = colour */
  sat: 0,
  /** darkens the 3D set behind panels */
  shade: 0,
  /** house lights down (action / breathe) */
  dim: 0,
  arch: 0,
  beam: 0,
  /** cursor torch, uv + strength */
  torchX: 0.5,
  torchY: 0.5,
  torch: 0,
  /** performance.now() when the breathing cycle started (0 = not running) */
  breathT0: 0,
};

/** box breathing 4-4-4-4 → 0..1 brightness (rises on "in", falls on "out") */
export function breathLevel(now: number, stepSeconds = 4) {
  if (!fx.breathT0) return 0;
  const t = ((now - fx.breathT0) / 1000) % (stepSeconds * 4);
  const s = stepSeconds;
  const ease = (x: number) => 0.5 - 0.5 * Math.cos(Math.PI * x);
  if (t < s) return ease(t / s);
  if (t < 2 * s) return 1;
  if (t < 3 * s) return 1 - ease((t - 2 * s) / s);
  return 0;
}

export const ease = (cur: number, target: number, dt: number, speed = 3) => cur + (target - cur) * (1 - Math.exp(-speed * dt));

if (import.meta.env.DEV) (window as unknown as { __fx: typeof fx }).__fx = fx;
