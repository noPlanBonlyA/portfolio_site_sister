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

## Adding photos
All photos share one grade (darker, warmer, soft vignette) so they sit together. To add one:

```bash
ffmpeg -i input.jpg -vf "scale='if(gt(iw,ih),min(1600,iw),-2)':'if(gt(iw,ih),-2,min(1600,ih))',eq=contrast=1.1:brightness=-0.04:saturation=0.68:gamma=0.94,colorbalance=rs=0.04:gs=0.01:bs=-0.03:rh=0.03:bh=-0.04,curves=master='0/0.025 0.25/0.2 0.75/0.76 1/0.92',vignette=angle=PI/4.6" /tmp/out.png
cwebp -q 80 /tmp/out.png -o public/photos/<name>.webp
```

Very dark originals (e.g. night skies) need a lighter touch: raise `brightness`/`gamma`.
Then add the file to the right list in `src/content.ts`.
