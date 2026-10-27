// WebAudio sound design: synthesized clap / footsteps / whoosh / room tone + two voice lines.
// Nothing is created before the visitor turns sound on (a user gesture).

type Kind = 'clap' | 'steps' | 'whoosh' | 'voice';

const VOICES = { action: '/audio/vo-action.mp3', cut: '/audio/vo-cut.mp3' } as const;

let ctx: AudioContext | null = null;
let out: GainNode;
let amb: GainNode;
let on = false;
const buffers: Partial<Record<keyof typeof VOICES, AudioBuffer>> = {};

function init() {
  const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  if (!AC) return false;
  const c = new AC();
  ctx = c;
  out = c.createGain();
  out.gain.value = 0.8;
  out.connect(c.destination);

  // room tone: brown noise through a low-pass + a faint 55 Hz hum
  const len = c.sampleRate * 4;
  const buf = c.createBuffer(1, len, c.sampleRate);
  const d = buf.getChannelData(0);
  let last = 0;
  for (let i = 0; i < len; i++) {
    const w = Math.random() * 2 - 1;
    last = (last + 0.02 * w) / 1.02;
    d[i] = last * 3.2;
  }
  const src = c.createBufferSource();
  src.buffer = buf;
  src.loop = true;
  const lp = c.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.value = 420;
  amb = c.createGain();
  amb.gain.value = 0;
  src.connect(lp);
  lp.connect(amb);
  amb.connect(c.destination);
  src.start();
  const hum = c.createOscillator();
  const hg = c.createGain();
  hum.frequency.value = 55;
  hg.gain.value = 0.012;
  hum.connect(hg);
  hg.connect(amb);
  hum.start();
  return true;
}

/** returns the new on/off state, or null if WebAudio is unavailable */
export function setSound(next: boolean): boolean | null {
  if (!ctx && !init()) return null;
  on = next;
  const c = ctx!;
  if (c.state === 'suspended') c.resume();
  amb.gain.setTargetAtTime(on ? 0.22 : 0, c.currentTime, on ? 0.6 : 0.15);
  if (on) (Object.keys(VOICES) as (keyof typeof VOICES)[]).forEach(load);
  return on;
}

function load(k: keyof typeof VOICES) {
  if (buffers[k] || !ctx) return Promise.resolve(buffers[k]);
  return fetch(VOICES[k])
    .then((r) => r.arrayBuffer())
    .then((ab) => new Promise<AudioBuffer>((res, rej) => ctx!.decodeAudioData(ab, res, rej)))
    .then((b) => (buffers[k] = b))
    .catch(() => undefined);
}

export function sfx(kind: Kind, arg?: number | 'action' | 'cut') {
  if (!on || !ctx) return;
  const c = ctx;
  const t0 = c.currentTime + 0.01;
  const noise = (dur: number) => {
    const b = c.createBuffer(1, Math.ceil(c.sampleRate * dur), c.sampleRate);
    const d = b.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const n = c.createBufferSource();
    n.buffer = b;
    return n;
  };
  const env = (g: GainNode, t: number, a: number, peak: number, dec: number) => {
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + a);
    g.gain.exponentialRampToValueAtTime(0.0001, t + a + dec);
  };

  if (kind === 'clap') {
    [0, 0.018].forEach((off, k) => {
      const n = noise(0.2);
      const f = c.createBiquadFilter();
      const g = c.createGain();
      f.type = 'bandpass';
      f.frequency.value = k ? 2600 : 1700;
      f.Q.value = 0.9;
      n.connect(f);
      f.connect(g);
      g.connect(out);
      env(g, t0 + off, 0.002, k ? 0.35 : 0.9, 0.09);
      n.start(t0 + off);
      n.stop(t0 + off + 0.2);
    });
    const o = c.createOscillator();
    const g2 = c.createGain();
    o.type = 'triangle';
    o.frequency.setValueAtTime(180, t0);
    o.frequency.exponentialRampToValueAtTime(70, t0 + 0.08);
    o.connect(g2);
    g2.connect(out);
    env(g2, t0, 0.002, 0.35, 0.1);
    o.start(t0);
    o.stop(t0 + 0.2);
  } else if (kind === 'steps') {
    const count = typeof arg === 'number' ? arg : 4;
    for (let i = 0; i < count; i++) {
      const t = t0 + i * 0.47 + (i % 2 ? 0.03 : 0);
      const o = c.createOscillator();
      const g = c.createGain();
      o.type = 'sine';
      o.frequency.setValueAtTime(95, t);
      o.frequency.exponentialRampToValueAtTime(45, t + 0.1);
      o.connect(g);
      g.connect(out);
      env(g, t, 0.004, 0.32, 0.14);
      o.start(t);
      o.stop(t + 0.2);
      const n = noise(0.06);
      const f = c.createBiquadFilter();
      const g3 = c.createGain();
      f.type = 'highpass';
      f.frequency.value = 1800;
      n.connect(f);
      f.connect(g3);
      g3.connect(out);
      env(g3, t, 0.002, 0.07, 0.03);
      n.start(t);
      n.stop(t + 0.06);
    }
  } else if (kind === 'whoosh') {
    const n = noise(0.7);
    const f = c.createBiquadFilter();
    const g = c.createGain();
    f.type = 'bandpass';
    f.Q.value = 1.2;
    f.frequency.setValueAtTime(300, t0);
    f.frequency.exponentialRampToValueAtTime(3200, t0 + 0.45);
    n.connect(f);
    f.connect(g);
    g.connect(out);
    env(g, t0, 0.15, 0.16, 0.4);
    n.start(t0);
    n.stop(t0 + 0.7);
  } else if (kind === 'voice') {
    const k = arg === 'cut' ? 'cut' : 'action';
    load(k).then((b) => {
      if (!b || !on) return;
      const s = c.createBufferSource();
      s.buffer = b;
      s.connect(out);
      s.start();
    });
  }
}
