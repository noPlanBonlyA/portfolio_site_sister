// ─────────────────────────────────────────────────────────────────────────────
// ALL site copy, links and photos live here.
// Replace anything in [square brackets] with the real text when it arrives.
// Photos: put files in /public/photos/ and reference them as '/photos/<file>'.
// ─────────────────────────────────────────────────────────────────────────────

export const P = {
  wink: '/photos/portrait-wink.jpg',
  hair: '/photos/portrait-hair-motion.jpg',
  bunny: '/photos/stage-bunny-desk.jpg',
  piano: '/photos/music-piano.jpg',
};

export interface Photo {
  /** image url; leave empty to show a dashed placeholder slot */
  src?: string;
  alt: string;
  /** placeholder label when there is no src yet */
  slot?: string;
  caption: string;
  /** circled in grease pencil on the contact sheet */
  best?: boolean;
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
  wardrobe: { no: '07', name: 'Wardrobe', roll: 'G', prop: 'the costume rack' },
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
  page: {
    number: '1.',
    slug: 'INT. SOUNDSTAGE 1 — NIGHT',
    action: 'The marquee lights hum. MARIIA DMITRIEVA, actress & creator, walks onto her mark.',
    cue: 'Mariia (V.O.)',
    paren: '(to camera)',
    dialogue: '[Short philosophy text — Mariia will send. Written as her monologue.]',
    transition: 'CUT TO:',
  },
  cta: 'Watch video card',
};

// ── 02 · Portfolio ───────────────────────────────────────────────────────────
export const portfolio = {
  heading: ['Frames from ', 'the stage'],
  modes: { reel: 'Film reel', sheet: 'Contact sheet' },
  footnote: 'Hover pauses the reel · caption: production — role, year',
  categories: [
    {
      label: 'Theatre & Performing Arts',
      photos: [
        { src: P.bunny, alt: 'On stage, lying on a desk in bunny ears', caption: '[Production] — [Role], [Year]', best: true },
        { src: P.wink, alt: 'Portrait, winking', caption: '[Production] — [Role], [Year]' },
        { src: P.hair, alt: 'Movement study with flowing hair', caption: '[Production] — [Role], [Year]', best: true },
        { slot: '[Stage photo 4]', alt: '', caption: '[Production] — [Role], [Year]' },
        { slot: '[Stage photo 5]', alt: '', caption: '[Production] — [Role], [Year]' },
      ],
    },
    {
      label: 'Music & Dance',
      photos: [
        { src: P.piano, alt: 'Playing an upright piano', caption: 'Piano — [Event], [Year]', best: true },
        { slot: '[Choir performance]', alt: '', caption: 'Choir — [Event], [Year]' },
        { slot: '[Dance performance]', alt: '', caption: 'Dance — [Event], [Year]' },
        { slot: '[Instrument]', alt: '', caption: '[Instrument] — [Event], [Year]' },
      ],
    },
    {
      label: 'Leadership & Community',
      photos: [
        { slot: '[Volunteering photo]', alt: '', caption: 'Volunteering — [Org], [Year]' },
        { slot: '[School event photo]', alt: '', caption: 'School event — [Name], [Year]' },
        { slot: '[Community project photo]', alt: '', caption: '[Project], [Year]' },
        { slot: '[Event photo]', alt: '', caption: '[Event], [Year]' },
      ],
    },
  ] as { label: string; photos: Photo[] }[],
};

// ── 03 · Showreel ────────────────────────────────────────────────────────────
export const showreel = {
  eyebrow: 'Video business card',
  // TODO: put the real YouTube video id here (e.g. 'dQw4w9WgXcQ'). Empty = hero clip placeholder.
  youtubeId: '',
  title: 'Mariia Dmitrieva — video business card',
  placeholderNote: '[YouTube embed — video business card · placeholder clip]',
  play: 'Play video card',
  readout: { rec: 'Rec · A-cam', specs: 'ISO 800 · 24 fps · 180°', batt: 'Batt ▮▮▮▯ · 35mm · f/2.0' },
};

// ── 04 · Projects ────────────────────────────────────────────────────────────
export const projects = {
  eyebrow: 'Projects — now showing',
  featured: {
    title: 'HEART',
    kicker: 'A project by Mariia Dmitrieva',
    billing: '[Billing block — project team credits]',
    label: 'Featured project',
    text: '[1–2 sentences about the idea of the project]',
    cta: 'Explore project',
    // TODO: real HEART site URL
    url: '#',
    poster: P.hair,
  },
  comingSoonLabel: 'Coming soon',
  tickets: [
    {
      title: 'Releasing Psychological and Physical Tension Before Going on Stage',
      text: '[A couple of sentences — coming]',
      cta: 'Try it on stage — 1 minute',
      breathe: true,
    },
    {
      title: 'Theater as a Way to Develop Communication Among Teenagers',
      text: '[A couple of sentences — coming]',
      breathe: false,
    },
  ],
  psst: 'Psst — clap the slate on the left three times',
  clapsLeft: (n: number) => `${n} more…`,
};

// ── 05 · Contacts ────────────────────────────────────────────────────────────
export const contact = {
  heading: ['End ', 'credits'],
  rows: [
    { label: 'Email', value: 'mariya171207@gmail.com', href: 'mailto:mariya171207@gmail.com' },
    { label: 'Instagram', value: '[@handle]', href: '#' }, // TODO: https://instagram.com/<handle>
    { label: 'Telegram', value: '[@handle]', href: '#' }, // TODO: https://t.me/<handle>
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
    { src: P.wink, alt: 'Backstage photo', caption: '[Caption for this behind-the-scenes photo]' },
    { src: P.piano, alt: 'Backstage photo', caption: '[Caption for this behind-the-scenes photo]' },
    { src: P.hair, alt: 'Backstage photo', caption: '[Caption for this behind-the-scenes photo]' },
    { src: P.bunny, alt: 'Backstage photo', caption: '[Caption for this behind-the-scenes photo]' },
  ],
};

// ── 07 · Wardrobe ────────────────────────────────────────────────────────────
export const wardrobe = {
  heading: ['Roles I’ve ', 'worn'],
  intro: 'Every costume on the rack is a character. Hover a hanger to meet her.',
  looks: [
    { role: '[Role]', production: '[Production]', year: '[Year]', photo: P.bunny },
    { role: '[Role]', production: '[Production]', year: '[Year]', photo: P.hair },
    { role: '[Role]', production: '[Production]', year: '[Year]', photo: P.wink },
    { role: '[Role]', production: '[Production]', year: '[Year]', photo: P.piano },
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
