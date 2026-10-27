# Mariia Dmitrieva — The Studio

```bash
npm install
npm run dev      # http://localhost:5173  (dev only: ?view=about jumps straight to a view)
npm run build    # static site in dist/ — deploy to Vercel as a Vite project
```

## Editing content
Everything visitors read is in `src/content.ts`. Replace the `[bracketed]` placeholders,
put new photos in `public/photos/` and reference them as `/photos/<file>`.

Open TODOs (all in `content.ts`):
- `showreel.youtubeId` — YouTube id of the video business card (empty = hero clip placeholder)
- `contact.formEndpoint` — Formspree-style endpoint (empty = the form opens the visitor's mail app)
- Instagram / Telegram links, CV PDF (`/public/cv.pdf`), HEART project URL
- `public/og.jpg` is rendered from this build (dev server + `?view=set&og&grade=color` at 1200×630)

## Layout
- `src/scene/layout.ts` — props, camera poses, backdrop (from `reference/scene.json`)
- `src/nav.ts` — turn → walk → slate → panel choreography
- `src/three/` — WebGL stage, props, camera rig, post-processing (B&W/colour grade, grain, bloom)
- `src/sections/` — the seven sections + Action / Breathe / blooper reel
- `src/plain/` — "Skip 3D" scrolling version (`#plain`, also used when WebGL is unavailable)
