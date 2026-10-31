// Scene layout in Three.js units, derived from reference/scene.json
// (three = (x/100, (300 - y)/100, z/100); floor at y = 0; props face +z).

export type SectionKey = 'about' | 'portfolio' | 'showreel' | 'projects' | 'contact' | 'backstage';
export type View = 'title' | 'set' | SectionKey | 'action' | 'breathe';

export const SECTION_KEYS: SectionKey[] = ['about', 'portfolio', 'showreel', 'projects', 'contact', 'backstage'];
export const NAV_KEYS: SectionKey[] = ['about', 'portfolio', 'showreel', 'projects', 'contact', 'backstage'];

export const FOV = 53.13;
/** aspect the prototype (and the poses) were authored for */
export const BASE_ASPECT = 1440 / 900;

export interface Pose {
  pos: [number, number, number];
  /** degrees, three.js rotation.y (positive = turn left) */
  yaw: number;
  /** degrees, negative = look down */
  pitch: number;
}

export const POSES: Record<View, Pose> = {
  title: { pos: [0.09, 10.1, -23], yaw: 0, pitch: 0 },
  set: { pos: [-0.6, 3.9, 9], yaw: 0, pitch: 0 },
  about: { pos: [6.66, 3.2, 4], yaw: -4, pitch: 0 },
  contact: { pos: [6.5, 3.3, 0], yaw: 4, pitch: 0 },
  showreel: { pos: [0.89, 4.7, -2], yaw: 0, pitch: 0 },
  projects: { pos: [1.5, 3, 0], yaw: -4, pitch: -8 },
  portfolio: { pos: [-4.76, 3.6, 5], yaw: 0, pitch: -8 },
  backstage: { pos: [-8.63, 4.6, 2], yaw: 0, pitch: 0 },
  action: { pos: [0.09, 12, -3], yaw: 0, pitch: 0 },
  breathe: { pos: [0.09, 10.5, -13], yaw: 0, pitch: 0 },
};

/** yaw the overview camera turns its head to before walking to a section */
export const TURN_YAW: Record<SectionKey, number> = {
  about: -19.9,
  contact: -31,
  showreel: -2.8,
  projects: 4.1,
  portfolio: 25.5,
  backstage: 29.8,
};

export interface PropDef {
  id: string;
  image: string;
  section?: SectionKey;
  /** bottom-centre on the floor */
  base: [number, number, number];
  size: [number, number];
  /** in-plane tilt, degrees (counter-clockwise) */
  tilt?: number;
  label?: { text: string; anchor: [number, number, number]; font: number };
  /** light pool [w, d] and centre offset */
  pool?: [number, number];
  shadow: [number, number];
  /** a11y name */
  name?: string;
}

const L = (x: number, y: number, z: number): [number, number, number] => [x / 100, (300 - y) / 100, z / 100];

export const PROPS: PropDef[] = [
  { id: 'rack', image: 'rack', base: [-5.95, 0, -17], size: [4.12, 5.6], shadow: [5, 2] },
  { id: 'spot', image: 'spot', base: [11.305, 0, -18], size: [4.03, 6.4], shadow: [4.8, 2] },
  { id: 'light', image: 'light', base: [-9.52, 0, -13], size: [2.66, 6.4], shadow: [3.6, 1.8] },
  { id: 'dolly', image: 'dolly', section: 'showreel', base: [0.885, 0, -9], size: [5.45, 6], label: { text: '03 · Showreel', anchor: L(89, -330, -900), font: 0.4 }, pool: [10, 7], shadow: [6.4, 2.2], name: 'Showreel — the camera dolly' },
  { id: 'clap', image: 'clap', section: 'projects', base: [-1.19, 0, -7.8], size: [2.16, 2.3], tilt: 5, label: { text: '04 · Projects', anchor: L(-119, 40, -780), font: 0.39 }, pool: [7, 5], shadow: [3, 1.2], name: 'Projects — the clapperboard' },
  { id: 'chair', image: 'chair', section: 'about', base: [4.165, 0, -2.5], size: [2.89, 4.7], label: { text: '01 · About me', anchor: L(416, -200, -250), font: 0.3 }, pool: [8, 6], shadow: [3.8, 1.6], name: 'About me — the director’s chair' },
  { id: 'vanity', image: 'vanity', section: 'backstage', base: [-8.63, 0, -5], size: [3.22, 6.6], label: { text: '06 · Backstage', anchor: L(-863, -390, -500), font: 0.3 }, pool: [8, 6], shadow: [5.6, 2.2], name: 'Backstage — the dressing mirror' },
  { id: 'cart', image: 'cart', section: 'portfolio', base: [-4.76, 0, -1], size: [3.66, 4.4], label: { text: '02 · Portfolio', anchor: L(-476, -170, -100), font: 0.28 }, pool: [9, 7], shadow: [4.6, 1.8], name: 'Portfolio — the film cart' },
  { id: 'callsheet', image: 'callsheet', section: 'contact', base: [9, 0, -7], size: [2.64, 3.3], label: { text: '05 · Contacts', anchor: L(900, -60, -700), font: 0.25 }, pool: [7, 5], shadow: [3.4, 1.4], name: 'Contacts — the call sheet' },
];

export const BACKDROP = {
  z: -34,
  // plate image spans x -38..38 and y 31.03..-11.72; only the part above the floor (y >= 0) is used
  x0: -38,
  x1: 38,
  yTop: 31.03,
  usedFraction: 3103 / 4275,
  screen: { x0: -12.67, x1: 12.85, yTop: 15.83, yBottom: 4.37, z: -33.96 },
  arch: { x0: -20.27, x1: 21.53, yTop: 18.53, yBottom: -0.15, z: -33.9 },
};

export const FLOOR = { x0: -38, x1: 38, z0: -34, z1: 14 };
export const WALLS = { x: 39, height: 29, z0: -34, z1: 14 };

export const MARK = { x: -2.97, z: -16.4 };
export const DOLLY_TRACK = { x0: -4.46, x1: 6.25, z0: -9.55, z1: -8.45, rails: [-9.4, -8.6] };
