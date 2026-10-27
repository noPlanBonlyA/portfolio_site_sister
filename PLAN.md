# Build plan — "The Studio"

## Key decisions
- **Camera**: one `CameraRig` driven by GSAP timelines over a plain pose object
  `{x, y, z, yaw, pitch}`. Turn (0.9s) → walk along a Catmull-Rom path that detours around
  prop footprints (2.2s) + head-bob/roll. Reduced motion: short cross-fade cuts.
- **B&W ⇄ Colour**: colour textures only + one custom post effect (`FilmGrade`) with a
  `saturation` uniform (also contrast, vignette, grain, cursor "torch", house-light dim).
  The switch is a uniform tween under a white flash — no texture swap, no reload.
- **Props**: unlit transparent billboards; picking ignores transparent pixels
  (alpha mask sampled from the image), so you can only click the actual object.
- **Labels**: DOM gaffer tape positioned by projecting `scene.json` anchors every frame
  (no clipping inside WebGL, crisp text, sized like the prototype).
- **Loading**: texture + video preload runs behind the 3-2-1 leader; if loading is slower,
  the leader shows a real % before handing over.
- **Skip 3D**: `#plain` (or no WebGL) renders the same `content.ts` as a scrolling page.

## Structure
```
public/            assets moved here (set/, photos/, video/, audio/, textures/), og.jpg, favicon.svg
src/
  content.ts       ALL copy, photo lists, links (edit this to drop in real texts/photos)
  scene/layout.ts  scene.json → Three.js coords (props, pools, labels, poses)
  store.ts         zustand: view, phase, grade, sound, take, hover, ui flags
  nav.ts           go(view): turn → walk → slate → panel orchestration
  sound.ts         WebAudio synth (clap, steps, whoosh, room tone) + voice lines
  three/           Stage.tsx (backdrop, video, floor, walls, pools, mark, track)
                   Props.tsx, CameraRig.tsx, Effects.tsx (FilmGrade + Bloom), textures.ts
  ui/              Hud, Leader, TitleCard, Labels, Cursor, Slate, Subtitle, Toast, Flash
  sections/        About, Portfolio, Showreel, Projects, Contacts, Backstage, Wardrobe,
                   ActionMode, Breathe, Bloopers
  plain/Plain.tsx  "Skip 3D" scrolling version
  styles.css
```

## Order
1. Scaffold + assets → 2. stage & props matched to `reference/views` → 3. camera/intro/slate →
4. sections + modes + sound + grade → 5. perf/mobile/a11y/Skip 3D/meta → 6. browser QA + build.
