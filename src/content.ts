// ─────────────────────────────────────────────────────────────────────────────
// ALL site copy, links and photos live here.
// Replace anything in [square brackets] with the real text when it arrives.
// Photos: put files in /public/photos/ and reference them as '/photos/<file>'.
// ─────────────────────────────────────────────────────────────────────────────

export const P = {
  wink: '/photos/portrait-wink.jpg',
  hair: '/photos/portrait-hair-motion.jpg',
  bunny: '/photos/stage-bunny-desk.jpg',
};

export interface Photo {
  /** image url; leave empty to show a dashed placeholder slot */
  src?: string;
  alt: string;
  /** placeholder label when there is no src yet */
  slot?: string;
  caption?: string;
  /** circled in grease pencil on the contact sheet */
  best?: boolean;
  /** CSS object-position when the frame crops the photo, e.g. 'center 15%' to keep a face in view */
  focus?: string;
}

export const site = {
  name: 'Mariia Dmitrieva',
  title: 'Mariia Dmitrieva — Actress & Creator',
  description:
    'Mariia Dmitrieva — actress & creator merging theatre and psychology. Walk onto a golden-age soundstage and explore her portfolio, showreel and projects.',
  logo: 'M · Dmitrieva',
};

export const intro = {
  leaderCaption: 'Picture start · Mariia Dmitrieva',
  skip: 'Skip intro',
  eyebrow: 'A portfolio in five scenes',
  nameLines: ['Mariia', 'Dmitrieva'],
  slogan: ['Actress & Creator', 'Merging Theatre and Psychology'],
  explore: 'Explore my world',
};

export const hud = {
  hint: 'Walk the set — click a prop, or pick a scene above',
  hintTouch: 'Swipe to look around · tap a prop to walk over',
  stageBw: 'Stage 1 · B&W 400TX',
  stageColor: 'Stage 1 · Colour 500T',
  action: 'Action!',
  skip3d: 'Skip 3D',
  back: 'Back to the floor',
  soundOnToast: 'Sound on — the stage is live',
};

/** Scene metadata: number, short name, roll letter, prop name (used in "Walking to …") */
export const scenes = {
  about: { no: '01', name: 'About me', roll: 'A', prop: 'the director’s chair' },
  portfolio: { no: '02', name: 'Portfolio', roll: 'B', prop: 'the film cart' },
  showreel: { no: '03', name: 'Showreel', roll: 'C', prop: 'the camera dolly' },
  projects: { no: '04', name: 'Projects', roll: 'D', prop: 'the clapperboard' },
  contact: { no: '05', name: 'Contacts', roll: 'E', prop: 'the call sheet' },
  backstage: { no: '06', name: 'Backstage', roll: 'F', prop: 'the dressing mirror' },
} as const;

export const slate = { prod: 'Prod. Mariia Dmitrieva' };

export const subtitles = {
  back: 'Back to the floor…',
  walking: (prop: string) => `Walking to ${prop}…`,
  action: 'Quiet on set… rolling…',
  breathe: 'Stepping onto your mark…',
};

// ── 01 · About ───────────────────────────────────────────────────────────────
export const about = {
  heading: ['Theatre ', 'meets', ' psychology'],
  portrait: { src: P.wink, alt: 'Portrait of Mariia Dmitrieva' },
  /** the screenplay page, line by line: slug / action / cue / paren / dialogue / transition */
  page: [
    { k: 'slug', t: 'INT. SOUNDSTAGE 1 — NIGHT' },
    { k: 'action', t: '(The marquee lights hum. A starry sky projection flickers in the background. MARIIA DMITRIEVA, an actress and creator, walks onto her mark.)' },
    { k: 'cue', t: 'MARIIA' },
    { k: 'paren', t: '(looking up at the projection)' },
    { k: 'dialogue', t: 'People say everything happens for a reason. I look at the stars, and I know it’s true. Even the fear. Even the pain. Even the rejection. It’s all just steering you exactly where you belong.' },
    { k: 'action', t: '(She looks directly into the camera — at the audience.)' },
    { k: 'dialogue', t: 'And I am ready.' },
    { k: 'trans', t: 'CUT TO:' },
  ] as { k: 'slug' | 'action' | 'cue' | 'paren' | 'dialogue' | 'trans'; t: string }[],
  cta: 'Watch video card',
};

// ── 02 · Portfolio ───────────────────────────────────────────────────────────
// Photos are graded with one shared look (see README → "Adding photos").
const ph = (name: string, alt: string, best = false, focus?: string): Photo => ({ src: `/photos/${name}.webp`, alt, best, focus });

export const portfolio = {
  heading: ['Frames from ', 'the stage'],
  modes: { reel: 'Film reel', sheet: 'Contact sheet' },
  footnote: 'Hover pauses the reel',
  categories: [
    {
      label: 'Theatre & Performing Arts',
      photos: [
        ph('theatre-01', 'Solo on stage in a green costume and orange hat', true),
        ph('theatre-02', 'The cast lying in a circle, seen from above'),
        ph('theatre-03', 'A scene with wooden boxes in front of the curtain'),
        ph('theatre-04', 'Ensemble scene in black costumes', true),
        ph('theatre-05', 'Cast photo with the director'),
        ph('theatre-06', 'Curtain call'),
      ],
    },
    {
      label: 'Music & Dance',
      photos: [
        ph('dance-01', 'Playing an upright piano', true),
        ph('dance-02', 'Dance rehearsal, stretching on the floor'),
        ph('dance-03', 'Singing with a microphone', false, '75% 0%'),
        ph('dance-04', 'Dance performance on stage', true),
        ph('dance-05', 'Playing the guitar'),
        ph('dance-06', 'At the piano in front of a red curtain'),
      ],
    },
    {
      label: 'Leadership & Community',
      photos: [
        ph('community-01', 'Graduation ceremony', true),
        ph('community-02', 'Volunteering at a martial-arts tournament', false, 'center 12%'),
        ph('community-03', 'Hosting a school event on stage'),
        ph('community-04', 'School assembly in the hall'),
        ph('community-05', 'At an exhibition', true),
        ph('community-06', 'Hosting an event with a microphone'),
      ],
    },
  ] as { label: string; photos: Photo[] }[],
};

// ── 03 · Showreel ────────────────────────────────────────────────────────────
export const showreel = {
  eyebrow: 'Video business card',
  // Optional: a YouTube id (e.g. 'dQw4w9WgXcQ') to play from YouTube instead of the file below.
  youtubeId: '',
  /** adaptive stream (360p–720p, follows the connection) + MP4 fallback */
  hls: '/video/card/master.m3u8',
  video: '/video/card.mp4',
  poster: '/video/card-poster.jpg',
  title: 'Mariia Dmitrieva — video business card',
  play: 'Play video card',
  readout: { rec: 'Rec · A-cam', specs: 'ISO 800 · 24 fps · 180°', batt: 'Batt ▮▮▮▯ · 35mm · f/2.0' },
};

// ── 04 · Projects ────────────────────────────────────────────────────────────
export const projects = {
  eyebrow: 'Projects — now showing',
  featured: {
    title: 'HEART',
    kicker: 'A project by Mariia Dmitrieva',
    billing: 'Psychological Immersive Theatre',
    label: 'Featured project',
    subtitle: 'Psychological Immersive Theatre',
    text: 'A psychological immersive theatre and digital ecosystem where art meets healing. A safe space to take off the mask, face your fears, and finally breathe.',
    cta: 'Explore project',
    url: 'https://heart-project-delta.vercel.app/',
    poster: P.hair,
  },
  moreLabel: 'Research & workshops',
  more: [
    {
      title: 'Releasing Psychological and Physical Tension Before Going on Stage',
      text: 'An applied research project blending acting techniques with psychology. Designed and led interactive workshops for 40+ teenagers to help them manage performance anxiety and build self-confidence.',
      cta: 'Try it on stage — 1 minute',
      breathe: true,
    },
    {
      title: 'Theater as a Way to Develop Communication Among Teenagers',
      text: 'A comprehensive research project uniting a newly merged class through theatrical activities. Facilitated interactive workshops for 30+ teenagers to build trust and enhance communication skills.',
      breathe: false,
    },
  ] as { title: string; text: string; cta?: string; breathe: boolean }[],
  psst: 'Psst — clap the slate on the left three times',
  clapsLeft: (n: number) => `${n} more…`,
};

// ── 05 · Contacts ────────────────────────────────────────────────────────────
export const contact = {
  heading: ['End ', 'credits'],
  rows: [
    { label: 'Email', value: 'mariya171207@gmail.com', href: 'mailto:mariya171207@gmail.com' },
    { label: 'Instagram', value: '@ma7yme', href: 'https://instagram.com/ma7yme' },
    { label: 'Telegram', value: '@marxwaq', href: 'https://t.me/marxwaq' },
    { label: 'Based in', value: 'Saint Petersburg' },
  ],
  cv: { label: 'Download CV', href: '#' }, // TODO: put the PDF in /public/cv.pdf and set href: '/cv.pdf'
  // TODO: Formspree-style endpoint (e.g. 'https://formspree.io/f/xxxx'). Empty = opens the visitor's mail app.
  formEndpoint: '',
  form: {
    name: 'Name',
    namePh: 'Your name',
    email: 'Email',
    emailPh: 'you@studio.com',
    message: 'Message',
    messagePh: 'Casting, collaboration, workshop…',
    send: 'Send message',
    sending: 'Rolling…',
    sent: 'That’s a wrap — thank you!',
    error: 'Something jammed — please email me directly.',
  },
};

// ── 06 · Backstage ───────────────────────────────────────────────────────────
export const backstage = {
  eyebrow: 'Backstage — behind the curtain',
  note: 'Break a leg!',
  photos: [
    { src: '/photos/backstage-01.webp', alt: 'Mirror selfie by a string of lights', caption: '' },
    { src: '/photos/backstage-02.webp', alt: 'Wind in her hair on the Neva', caption: '' },
    { src: '/photos/backstage-03.webp', alt: 'A leap under a street lamp at night', caption: '' },
    { src: '/photos/backstage-04.webp', alt: 'Silhouette reaching for the stars', caption: '' },
    { src: '/photos/backstage-05.webp', alt: 'Cosy in a hoodie with her dog', caption: '' },
    { src: '/photos/backstage-06.webp', alt: 'Silhouette against a sunset window', caption: '' },
  ],
};

// ── Special modes ────────────────────────────────────────────────────────────
export const action = { word: 'Action', cut: 'Cut!' };

export const breathe = {
  eyebrow: ['Before you go on stage', 'box breathing 4 · 4 · 4 · 4'],
  // Replace with Mariia's own method later.
  text: 'Stand on your mark and follow the light of the arch: in for four, hold for four, out for four, hold for four.',
  steps: ['Breathe in', 'Hold', 'Breathe out', 'Hold'],
  stepSeconds: 4,
  back: 'Back to projects',
};

export const bloopers = {
  eyebrow: ['Blooper reel', 'takes that didn’t make the cut'],
  takes: [
    { src: P.bunny, caption: 'Take 03 — [what went wrong]', tilt: -4 },
    { src: P.wink, caption: 'Take 07 — [what went wrong]', tilt: 3 },
    { slot: '[Blooper photo]', caption: 'Take 12 — [what went wrong]', tilt: -2 },
  ] as { src?: string; slot?: string; caption: string; tilt: number }[],
  close: 'Cut! Back to work',
};
