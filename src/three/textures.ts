// Procedural canvas textures (generated once, tiny, no downloads).
import { CanvasTexture, LinearFilter, RepeatWrapping, SRGBColorSpace, type Texture } from 'three';

const cache = new Map<string, Texture>();

function make(key: string, w: number, h: number, draw: (g: CanvasRenderingContext2D, w: number, h: number) => void, srgb = true) {
  const hit = cache.get(key);
  if (hit) return hit;
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  draw(c.getContext('2d')!, w, h);
  const t = new CanvasTexture(c);
  if (srgb) t.colorSpace = SRGBColorSpace;
  t.minFilter = LinearFilter;
  t.generateMipmaps = false;
  cache.set(key, t);
  return t;
}

/** white radial falloff — tinted & used additively for light pools / soft glows */
export const radialTex = () =>
  make('radial', 256, 256, (g, w, h) => {
    const r = g.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
    r.addColorStop(0, 'rgba(255,255,255,1)');
    r.addColorStop(0.35, 'rgba(255,255,255,.55)');
    r.addColorStop(0.7, 'rgba(255,255,255,.14)');
    r.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = r;
    g.fillRect(0, 0, w, h);
  });

/** black soft ellipse for contact shadows */
export const shadowTex = () =>
  make('shadow', 256, 128, (g, w, h) => {
    g.save();
    g.scale(1, h / w);
    const r = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2);
    r.addColorStop(0, 'rgba(0,0,0,.85)');
    r.addColorStop(0.55, 'rgba(0,0,0,.45)');
    r.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = r;
    g.fillRect(0, 0, w, w);
    g.restore();
  });

/** polished concrete: dark warm gradient (stage end bright), slab seams, faint mottling */
export const floorTex = (wUnits: number, dUnits: number) =>
  make('floor', 2048, 1296, (g, w, h) => {
    const lin = g.createLinearGradient(0, 0, 0, h);
    lin.addColorStop(0, '#1a1511');
    lin.addColorStop(0.4, '#0c0a08');
    lin.addColorStop(1, '#060505');
    g.fillStyle = lin;
    g.fillRect(0, 0, w, h);
    // mottling
    for (let i = 0; i < 2400; i++) {
      const x = Math.random() * w;
      const y = Math.random() * h;
      const r = 6 + Math.random() * 40;
      g.fillStyle = `rgba(${Math.random() < 0.5 ? '255,240,220' : '0,0,0'},${0.012 + Math.random() * 0.02})`;
      g.beginPath();
      g.ellipse(x, y, r, r * 0.6, 0, 0, Math.PI * 2);
      g.fill();
    }
    // slab seams every 6 units
    const sx = w / wUnits;
    const sy = h / dUnits;
    g.strokeStyle = 'rgba(255,255,255,.05)';
    g.lineWidth = 2;
    for (let u = 2; u < wUnits; u += 6) {
      g.beginPath();
      g.moveTo(u * sx, 0);
      g.lineTo(u * sx, h);
      g.stroke();
    }
    for (let v = 6; v < dUnits; v += 6) {
      g.beginPath();
      g.moveTo(0, v * sy);
      g.lineTo(w, v * sy);
      g.stroke();
    }
    // stage spill: warm glow along the far edge
    const r = g.createRadialGradient(w / 2, 0, 0, w / 2, 0, w * 0.32);
    r.addColorStop(0, 'rgba(255,196,120,.22)');
    r.addColorStop(1, 'rgba(255,196,120,0)');
    g.fillStyle = r;
    g.fillRect(0, 0, w, h);
  });

/** acoustic wall panels */
export const wallTex = () => {
  const t = make('wall', 512, 512, (g, w, h) => {
    g.fillStyle = '#0d0c0b';
    g.fillRect(0, 0, w, h);
    const cols = 4;
    for (let i = 0; i < cols; i++) {
      const x = (i * w) / cols;
      const lg = g.createLinearGradient(x, 0, x + w / cols, 0);
      lg.addColorStop(0, '#171512');
      lg.addColorStop(0.5, '#110f0d');
      lg.addColorStop(1, '#0b0a09');
      g.fillStyle = lg;
      g.fillRect(x + 4, 0, w / cols - 8, h);
    }
    const v = g.createLinearGradient(0, 0, 0, h);
    v.addColorStop(0, 'rgba(0,0,0,.9)');
    v.addColorStop(0.4, 'rgba(0,0,0,.15)');
    v.addColorStop(0.8, 'rgba(0,0,0,.2)');
    v.addColorStop(1, 'rgba(0,0,0,.95)');
    g.fillStyle = v;
    g.fillRect(0, 0, w, h);
  });
  t.wrapS = RepeatWrapping;
  return t;
};

/** blurred bulb-arch outline used as an additive glow over the proscenium */
export const archTex = () =>
  make('arch', 1024, 460, (g, w, h) => {
    g.filter = 'blur(12px)';
    g.strokeStyle = 'rgba(255,255,255,1)';
    g.lineWidth = 26;
    const pad = 40;
    const r = 120;
    g.beginPath();
    g.moveTo(pad, h);
    g.lineTo(pad, pad + r);
    g.arcTo(pad, pad, pad + r, pad, r);
    g.lineTo(w - pad - r, pad);
    g.arcTo(w - pad, pad, w - pad, pad + r, r);
    g.lineTo(w - pad, h);
    g.stroke();
  });

/** vertical light-beam gradient (top bright → bottom faint, soft sides) */
export const beamTex = () =>
  make('beam', 128, 256, (g, w, h) => {
    const v = g.createLinearGradient(0, 0, 0, h);
    v.addColorStop(0, 'rgba(255,255,255,.9)');
    v.addColorStop(1, 'rgba(255,255,255,.18)');
    g.fillStyle = v;
    g.fillRect(0, 0, w, h);
    g.globalCompositeOperation = 'destination-in';
    const s = g.createLinearGradient(0, 0, w, 0);
    s.addColorStop(0, 'rgba(0,0,0,0)');
    s.addColorStop(0.3, 'rgba(0,0,0,1)');
    s.addColorStop(0.7, 'rgba(0,0,0,1)');
    s.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = s;
    g.fillRect(0, 0, w, h);
  });
