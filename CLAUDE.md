# Mariia Dmitrieva — portfolio site ("The Studio")

Portfolio website for **Mariia Dmitrieva**, an actress & creator (theatre + psychology).
The whole site is **in English**. The visitor stands on a golden-age Hollywood soundstage,
rendered in **WebGL (Three.js)**, walks between real-looking props, and each prop opens a section.

A working CSS-3D prototype of the exact concept already exists:
`reference/studio-prototype.dc.html` (logic + every text + every interaction).
It is a design prototype only — it is NOT the code base. CSS 3D was too heavy (huge planes got
dropped by the GPU, black tiles, lag), which is why this build is WebGL.
Screenshots of every camera pose are in `reference/views/*.jpg`.
Layout data (camera poses, props, labels, backdrop) is in `reference/scene.json`.

## Stack

- Vite + React + TypeScript
- three, @react-three/fiber, @react-three/drei, @react-three/postprocessing (pmndrs `postprocessing`)
- GSAP for camera moves and UI timing (or drei `CameraControls` — pick one, keep it simple)
- zustand for app state (view, theme, sound, take counter)
- Deploy target: Vercel (static build)
- No backend. The contact form can use a mailto / Formspree-style endpoint later — leave a clear TODO.

## Look & feel

Cinematic, black & white by default, fashionable, readable fonts, smooth and fast, no harsh
animations. Fonts (Google Fonts): Cormorant Garamond (display), Inter (body),
IBM Plex Mono (UI/eyebrows), Courier Prime (screenplay page, slate chalk), Permanent Marker
(gaffer-tape labels only). Palette: near-black #050505, off-white #ececec, greys;
in Colour mode accent = tungsten amber #f2b36b, REC red #ff4d4d.

## Assets (`assets/`)

- `set/color/*` and `set/bw/*` — same files in colour and pre-graded B&W:
  - `plate.jpg` 3200x1800 — backdrop: Hollywood soundstage with a bulb-lit proscenium arch,
    velvet curtains and a blank cinema screen. Use only the part above its floor line.
  - transparent cut-outs (webp): `chair` (director's chair "MARIIA"), `clap` (clapperboard
    "PROD. HEART / SCENE 01 / TAKE 1 / ROLL A / DIRECTOR M. DMITRIEVA"), `callsheet`
    (apple box + clipboard "CALL SHEET"), `dolly` (vintage studio camera on a wooden dolly),
    `cart` (film cans + reels on a rolling cart), `vanity` (bulb mirror + makeup table + stool),
    `rack` (costume rack), `spot` (big studio spotlight), `light` (fresnel on C-stand).
- `photos/` — test photos of Mariia (to be replaced/extended by real ones):
  `stage-bunny-desk.jpg`, `portrait-hair-motion.jpg`, `portrait-wink.jpg`, `music-piano.jpg`.
- `video/hero-bw.mp4` (B&W grade), `video/hero-color.mp4` (original colour), `video/hero-poster.jpg`.
  It plays muted & looped on the cinema screen inside the arch.
- `audio/vo-action.mp3` ("Quiet on set… Rolling… and… Action!"), `audio/vo-cut.mp3` ("Cut! That's a wrap.").
- `textures/grain.png` — 256px tileable film-grain noise.

Prefer colour textures + a cheap saturation/contrast post-process for B&W if it looks identical;
otherwise swap to the `bw/` textures. Either way the switch must be instant and not reload the scene.

## Scene (see `reference/scene.json`)

Coordinates in scene.json are given both in the prototype's CSS units and converted to Three.js
(`three = (x/100, (300 - y)/100, z/100)`, floor at y=0, camera eye height ≈ 3, vertical FOV ≈ 53°).
Use the `three` values; adjust by eye against `reference/views/*.jpg`.

- Backdrop plane far back (z ≈ -34) with the plate texture; the video screen is a plane just in
  front of the plate's blank screen (rect in scene.json). Add a soft additive glow plane over the
  bulb arch (used by Action / Breathe modes).
- Floor: large dark polished-concrete plane, subtle slab grid, warm light pools (additive radial
  textures), an actor's mark (white gaffer-tape "T") in a light pool in front of the stage,
  a short dolly track under the camera dolly.
- Side walls: dark acoustic panels so the set feels enclosed.
- Props are upright billboard planes (unlit `MeshBasicMaterial`, `transparent`, `alphaTest` ~0.5,
  sRGB textures) standing on the floor, each with a soft contact-shadow ellipse under it.
  Images already contain their lighting, so keep everything unlit and fake light with
  additive sprites, bloom and the pools.
- Arrangement (logical film set): stage at the back with the actor's mark; camera dolly on tracks
  facing the mark; clapperboard in front of the dolly; director's chair behind the camera (right);
  call sheet on an apple box further right; actress corner on the left = vanity mirror + costume
  rack; film cart front-left; spotlight and fresnel as decoration.
- Gaffer-tape labels (Permanent Marker on torn masking tape + pulsing dot) float above each
  clickable prop: `01 · About me`, `02 · Portfolio`, `03 · Showreel`, `04 · Projects`,
  `05 · Contacts`, `06 · Backstage`, `07 · Wardrobe`. Render them as HTML (drei `<Html>`)
  or crisp text sprites; they must never clip or overlap badly; visible only on the overview.

## Camera & navigation

Views: `title`, `set` (overview), `about`, `portfolio`, `showreel`, `projects`, `contact`,
`backstage`, `wardrobe`, `action`, `breathe`. Poses are in `scene.json → camera.poses`
(`turn-*` = the overview position already rotated toward a prop).

- Intro: Academy-leader countdown 3-2-1 (ring + sweep, ~3s, "Skip intro"), then the camera is
  pushed in on the cinema screen so the video fills the frame; letterbox bars; title card:
  eyebrow "A portfolio in five scenes", **MARIIA DMITRIEVA**, slogan
  "Actress & Creator | Merging Theatre and Psychology", button "Explore my world ↓".
  Click → camera pulls back through the arch to the overview.
- Going from the overview to a prop: (1) the camera first TURNS its head toward the prop
  (~0.9s), (2) then WALKS there (~2.2s) along a curve that never passes through props, with
  a subtle walking head-bob, (3) a light pool fades in under the prop, (4) a clapperboard
  slate pops in, claps and leaves ("SCENE 0X · <name> · TAKE n · ROLL A…"; take increments
  each navigation), (5) the section panel slides in on the side opposite to the prop.
  Subtitle at the bottom while walking: "Walking to the director's chair…".
- Between sections or back to the floor: direct walk, same bob. "Back to the floor" everywhere.
- Overview: gentle mouse-look (≤ ±1.5° yaw, ±0.8° pitch), a soft warm "torch" light following
  the cursor, ring cursor that grows on props and shows "About me — walk over".
- Top HUD: logo "M · Dmitrieva" (→ overview), scene nav (01–05), red "Action!" button,
  sound toggle, colour-grade switch "B&W | Colour". Bottom: hint + "Stage 1 · B&W 400TX".
- Post-processing: film grain, vignette, light bloom on bulbs/lamps, optional slight chromatic
  aberration. B&W ⇄ Colour swap with a short white "film flash".
- `prefers-reduced-motion`: no bob/sway, shorter moves or cross-fade cuts.

## Sections (content from Mariia's brief — keep placeholders in [brackets] until real text arrives)

1. **About me** (director's chair; panel right). Eyebrow "Scene 01 · About me",
   heading "Theatre *meets* psychology". A typed screenplay page (Courier Prime, off-white paper,
   slightly rotated) with a taped polaroid portrait:
   "INT. SOUNDSTAGE 1 — NIGHT / The marquee lights hum. MARIIA DMITRIEVA, actress & creator,
   walks onto her mark. / MARIIA (V.O.) (to camera) / [Short philosophy text — Mariia will send]
   / CUT TO:". Button "Watch video card" → Showreel.
2. **Portfolio** (film cart; full-width panel). "Frames from *the stage*". Tabs:
   Theatre & Performing Arts / Music & Dance / Leadership & Community (4–6 photos each).
   Two modes: "Film reel" (horizontal 35mm strip with sprocket holes, auto-scrolls, pauses on
   hover, frame numbers 01A…) and "Contact sheet" (grid, best takes circled in grease pencil).
   Caption format: "[Production] — [Role], [Year]". Photos B&W, colour on hover in Colour mode.
3. **Showreel** (camera dolly; full-screen viewfinder). Corner brackets, blinking "REC · A-cam",
   "ISO 800 · 24 fps · 180° · 3200K", running timecode, battery; the YouTube video-business-card
   embed goes in the frame (placeholder: hero video). Use a lite YouTube embed (load on click).
4. **Projects** (clapperboard; panel right). "Now showing": poster card **HEART**
   ("A project by Mariia Dmitrieva", billing block, [1–2 sentences], button "Explore project" →
   external HEART site, URL TBD; optional trailer later). "Coming soon" as cinema tickets
   ("Admit one · 01/02"):
   - Releasing Psychological and Physical Tension Before Going on Stage — [a couple of sentences]
     + button "Try it on stage — 1 minute" → Breathe mode.
   - Theater as a Way to Develop Communication Among Teenagers — [a couple of sentences].
   Hint "Psst — clap the slate on the left three times".
5. **Contacts** (call sheet; panel left). "End *credits*" rolling up like film credits:
   Email `mariya171207@gmail.com` (mailto), Instagram [@handle], Telegram [@handle],
   Based in Saint Petersburg; button "Download CV" (PDF TBD); form Name / Email / Message,
   submit → "That's a wrap — thank you!" (+ "Cut! That's a wrap." voice if sound is on).
6. **Backstage** (vanity mirror). Camera walks to the mirror; a large bulb-framed mirror fills
   the frame, behind-the-scenes photos cross-fade in the glass with a reflection sheen,
   lipstick note "Break a leg!" (red in Colour mode). Captions [TBD].
7. **Wardrobe** (costume rack; panel right). "Roles I've *worn*": each hanger = a role
   ("[Role]", "Look 0X · [Production], [Year]"); hovering a hanger reveals that role's photo.

Special modes:
- **Action!** — camera cranes up to a wide shot of the stage, house lights dim, the bulb arch
  glows, a spotlight beam falls on the actor's mark, big "ACTION" word, voice line if sound on;
  "Cut!" button returns to the floor.
- **Breathe** — camera stands on the actor's mark facing the stage; box breathing 4-4-4-4
  (Breathe in / Hold / Breathe out / Hold) with an expanding circle and the arch bulbs
  brightening/dimming in rhythm. "Back to projects". (Replace with Mariia's own method later.)
- **Blooper reel** — clapping the clapperboard 3× while in Projects opens "takes that didn't
  make the cut": jittery polaroids "Take 03 — [what went wrong]", button "Cut! Back to work".

Sound (off by default, toggle in HUD; nothing plays before a user gesture):
low studio room-tone/hum loop, clapper clap on each slate, footsteps while walking, whoosh on
grade switch, the two voice lines. Synthesize with WebAudio (see `sfx()` in the prototype) or
replace with real samples later.

## Quality bar

- 60 fps on a MacBook; smooth on mid-range phones. Cap DPR at 2 (1.5 on mobile), compress
  textures (KTX2/basis or tuned webp), lazy-load section photos, preload the set behind the
  countdown with a real progress indicator.
- Mobile: same scene, tap props; panels become full-screen sheets; disable bloom/mouse-look
  on low-end; landscape and portrait must both work (adjust FOV/poses for portrait).
- Accessibility: every prop is also reachable from the HUD nav; keyboard focus, Esc closes a
  panel, visible focus rings, alt text, text contrast ≥ 4.5:1, a "Skip 3D" link that shows a
  plain scrolling version of the content.
- SEO/meta: title "Mariia Dmitrieva — Actress & Creator", description, Open Graph image
  (render one from the overview), favicon.
- Keep all copy in one `content.ts` so Mariia's texts/photos can be dropped in easily.

## Workflow

1. Scaffold the project here, install deps, move `assets/` into `public/` (keep names).
2. Build the scene + camera system first and match `reference/views/*.jpg`.
3. Then HUD, sections, special modes, sound, post-processing, mobile, a11y.
4. Run the dev server and check every view in a browser (screenshots), fix visual bugs,
   then `npm run build`. Do not commit secrets; `.gitignore` node_modules and dist.
