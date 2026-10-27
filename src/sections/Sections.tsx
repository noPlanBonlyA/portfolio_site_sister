import { type FormEvent, type ReactNode, useEffect, useRef, useState } from 'react';
import { about, action, backstage, bloopers, breathe, contact, portfolio, projects, scenes, showreel, wardrobe, type Photo } from '../content';
import { go } from '../nav';
import { reducedMotion, useStore } from '../store';
import { sfx } from '../sound';
import { breathLevel, fx } from '../three/fx';
import { Back, IconArrowRight, IconDownload, IconHanger, IconPlay, useQuietFocus } from '../ui/icons';
import type { SectionKey } from '../scene/layout';

/** "Theatre *meets* psychology" — odd-indexed parts are italic */
export const Heading = ({ parts, className = 'h2', as: Tag = 'h2' }: { parts: string[]; className?: string; as?: 'h2' | 'h3' }) => (
  <Tag className={className}>{parts.map((p, i) => (i % 2 ? <em key={i}>{p}</em> : p))}</Tag>
);

export const Eyebrow = ({ k, text }: { k: SectionKey; text?: string }) => (
  <p className="eyebrow">
    <b>Scene {scenes[k].no}</b> · {text ?? scenes[k].name}
  </p>
);

/** moves keyboard focus into a panel when it opens */
const useFocusOnOpen = useQuietFocus;

function Panel({ side, label, children, className = '' }: { side: 'r' | 'l' | 'full'; label: string; children: ReactNode; className?: string }) {
  const ref = useFocusOnOpen<HTMLElement>();
  return (
    <section ref={ref} tabIndex={-1} className={`panel panel-${side} ${className}`} aria-label={label}>
      {children}
    </section>
  );
}

export function PhotoBox({ p, className = '' }: { p: Photo; className?: string }) {
  return p.src ? <img className={`photo ${className}`} src={p.src} alt={p.alt} loading="lazy" decoding="async" /> : <div className="slot">{p.slot}</div>;
}

// ── 01 About ────────────────────────────────────────────────────────────────
export function About() {
  const pg = about.page;
  return (
    <Panel side="r" label="About me">
      <Back />
      <Eyebrow k="about" />
      <Heading parts={about.heading} />
      <div className="page">
        <div className="polaroid">
          <div className="ptape" />
          <img className="photo" src={about.portrait.src} alt={about.portrait.alt} />
        </div>
        <p className="pg-no">{pg.number}</p>
        <p>
          <b>{pg.slug}</b>
        </p>
        <p className="pg-action">{pg.action}</p>
        <p className="cue">{pg.cue}</p>
        <p className="paren">{pg.paren}</p>
        <p className="dlg">{pg.dialogue}</p>
        <p className="pg-trans">{pg.transition}</p>
      </div>
      <div className="row">
        <button className="btn" onClick={() => go('showreel')}>
          {about.cta}
          <IconPlay />
        </button>
      </div>
    </Panel>
  );
}

// ── 02 Portfolio ────────────────────────────────────────────────────────────
export function Portfolio() {
  const [cat, setCat] = useState(0);
  const [mode, setMode] = useState<'reel' | 'sheet'>('reel');
  const c = portfolio.categories[cat];
  const letter = String.fromCharCode(65 + cat);
  const items = c.photos.map((p, i) => ({ ...p, no: String(i + 1).padStart(2, '0') + letter }));
  return (
    <Panel side="full" label="Portfolio">
      <div className="pf-head">
        <div>
          <Eyebrow k="portfolio" />
          <Heading parts={portfolio.heading} />
        </div>
        <div className="pf-ctrl">
          <div className="tabs" role="tablist" aria-label="Category">
            {portfolio.categories.map((k, i) => (
              <button key={k.label} role="tab" aria-selected={i === cat} className={`tab${i === cat ? ' on' : ''}`} onClick={() => setCat(i)}>
                {k.label}
              </button>
            ))}
          </div>
          <div className="grade-sw" role="group" aria-label="View as">
            <button className={`gbtn${mode === 'reel' ? ' on' : ''}`} aria-pressed={mode === 'reel'} onClick={() => setMode('reel')}>
              {portfolio.modes.reel}
            </button>
            <button className={`gbtn${mode === 'sheet' ? ' on' : ''}`} aria-pressed={mode === 'sheet'} onClick={() => setMode('sheet')}>
              {portfolio.modes.sheet}
            </button>
          </div>
        </div>
      </div>
      {mode === 'reel' ? (
        <div className="reelbox" key={cat} tabIndex={0} aria-label={`${c.label} — film reel`}>
          <div className="sprk top" />
          <div className="sprk bottom" />
          <div className="track" style={{ animationDuration: `${items.length * 9}s` }}>
            {[...items, ...items].map((p, i) => (
              <figure className="frame" key={i} aria-hidden={i >= items.length}>
                <div className="pic">
                  <PhotoBox p={p} />
                </div>
                <figcaption className="cap">
                  <b>{p.no}</b>
                  {p.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      ) : (
        <div className="sheet" key={cat}>
          {items.map((p) => (
            <figure className="shot" key={p.no}>
              <div className="pic">
                <PhotoBox p={p} />
              </div>
              {p.best && <div className="circle" aria-label="best take" />}
              <figcaption className="cap">
                <b>{p.no}</b>
                {p.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      )}
      <div className="pf-foot">
        <Back />
        <span className="eyebrow">{portfolio.footnote}</span>
      </div>
    </Panel>
  );
}

// ── 03 Showreel (viewfinder) ────────────────────────────────────────────────
function Timecode() {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const t0 = performance.now();
    let raf = 0;
    const tick = () => {
      const s = (performance.now() - t0) / 1000;
      const f = Math.floor((s % 1) * 24);
      const p = (n: number) => String(n).padStart(2, '0');
      if (ref.current) ref.current.textContent = `${p(Math.floor(s / 3600))}:${p(Math.floor(s / 60) % 60)}:${p(Math.floor(s) % 60)}:${p(f)}`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return <span ref={ref}>00:00:00:00</span>;
}

function LiteYouTube({ id, title }: { id: string; title: string }) {
  const [on, setOn] = useState(false);
  if (on)
    return (
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`}
        title={title}
        allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
        allowFullScreen
      />
    );
  return (
    <button className="yt" onClick={() => setOn(true)} aria-label={`Play: ${title}`}>
      <img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" loading="lazy" />
      <span className="yt-play">
        <IconPlay />
      </span>
    </button>
  );
}

export function Showreel() {
  const grade = useStore((s) => s.grade);
  const ref = useFocusOnOpen<HTMLElement>();
  return (
    <section ref={ref} tabIndex={-1} className="vf" aria-label="Showreel">
      <div className="vf-frame">
        <i className="corner tl" />
        <i className="corner tr" />
        <i className="corner bl" />
        <i className="corner br" />
        <div className="vfline tl">
          <i className="recdot" aria-hidden="true" />
          {showreel.readout.rec}
        </div>
        <div className="vfline tr">
          {showreel.readout.specs} · {grade === 'bw' ? 'B&W' : '3200K'}
        </div>
        <div className="vfbox">
          {showreel.youtubeId ? (
            <LiteYouTube id={showreel.youtubeId} title={showreel.title} />
          ) : (
            <>
              <video className="photo-v" src={grade === 'bw' ? '/video/hero-bw.mp4' : '/video/hero-color.mp4'} poster="/video/hero-poster.jpg" autoPlay muted loop playsInline aria-label={showreel.title} />
              <div className="vf-note">{showreel.placeholderNote}</div>
            </>
          )}
          <div className="vf-centre" aria-hidden="true" />
        </div>
        <div className="vfline bl">
          TC <Timecode />
        </div>
        <div className="vfline br">{showreel.readout.batt}</div>
      </div>
      <div className="vf-cap">
        <Eyebrow k="showreel" text={showreel.eyebrow} />
        <Back />
      </div>
    </section>
  );
}

// ── 04 Projects ─────────────────────────────────────────────────────────────
export function Projects() {
  const f = projects.featured;
  return (
    <Panel side="r" label="Projects">
      <Back />
      <Eyebrow k="projects" text={projects.eyebrow} />
      <div className="feature">
        <div className="poster">
          <img className="photo" src={f.poster} alt="" />
          <div className="poster-shade" />
          <p className="eyebrow poster-kicker">{f.kicker}</p>
          <div className="poster-foot">
            <div className="poster-title">{f.title}</div>
            <div className="billing">{f.billing}</div>
          </div>
        </div>
        <div className="feature-text">
          <p className="eyebrow">{f.label}</p>
          <p className="body ph">{f.text}</p>
          <div>
            <a className="btn" href={f.url} target={f.url.startsWith('http') ? '_blank' : undefined} rel="noopener">
              {f.cta}
              <IconArrowRight />
            </a>
          </div>
        </div>
      </div>
      <p className="eyebrow soon">{projects.comingSoonLabel}</p>
      <div className="tickets">
        {projects.tickets.map((t, i) => (
          <div className="ticket" key={t.title}>
            <span className="eyebrow sm">Admit one · {String(i + 1).padStart(2, '0')}</span>
            <h3 className="ticket-title">{t.title}</h3>
            <p className="body ph sm">{t.text}</p>
            {t.breathe && (
              <div>
                <button className="btn btn-ghost btn-sm" onClick={() => go('breathe')}>
                  {t.cta}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      <p className="eyebrow psst">{projects.psst}</p>
    </Panel>
  );
}

// ── 05 Contacts ─────────────────────────────────────────────────────────────
export function Contacts() {
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get('name') || '');
    const email = String(fd.get('email') || '');
    const message = String(fd.get('message') || '');
    if (contact.formEndpoint) {
      setState('sending');
      try {
        const r = await fetch(contact.formEndpoint, { method: 'POST', headers: { Accept: 'application/json', 'Content-Type': 'application/json' }, body: JSON.stringify({ name, email, message }) });
        if (!r.ok) throw new Error(String(r.status));
      } catch {
        setState('error');
        return;
      }
    } else {
      // TODO: replace with a Formspree-style endpoint (content.ts → contact.formEndpoint)
      const body = `${message}\n\n— ${name}${email ? ` <${email}>` : ''}`;
      window.location.href = `mailto:${contact.rows[0].value}?subject=${encodeURIComponent(`Hello from ${name || 'the website'}`)}&body=${encodeURIComponent(body)}`;
    }
    sfx('voice', 'cut');
    setState('sent');
  };
  const f = contact.form;
  return (
    <Panel side="l" label="Contacts">
      <Back />
      <Eyebrow k="contact" />
      <Heading parts={contact.heading} />
      <div className="roll">
        {contact.rows.map((r) =>
          r.href ? (
            <a className="endrow" href={r.href} key={r.label} target={r.href.startsWith('http') ? '_blank' : undefined} rel="noopener">
              <span>{r.label}</span>
              <b>{r.value}</b>
            </a>
          ) : (
            <div className="endrow" key={r.label}>
              <span>{r.label}</span>
              <b>{r.value}</b>
            </div>
          ),
        )}
        <div className="row">
          <a className="btn btn-ghost" href={contact.cv.href} download={contact.cv.href !== '#' ? '' : undefined}>
            {contact.cv.label}
            <IconDownload />
          </a>
        </div>
      </div>
      <form className="form" onSubmit={onSubmit}>
        <div className="form-2">
          <div className="field">
            <label htmlFor="s-name">{f.name}</label>
            <input id="s-name" name="name" type="text" placeholder={f.namePh} autoComplete="name" required />
          </div>
          <div className="field">
            <label htmlFor="s-mail">{f.email}</label>
            <input id="s-mail" name="email" type="email" placeholder={f.emailPh} autoComplete="email" required />
          </div>
        </div>
        <div className="field">
          <label htmlFor="s-msg">{f.message}</label>
          <textarea id="s-msg" name="message" rows={3} placeholder={f.messagePh} required />
        </div>
        <div>
          <button className="btn" type="submit" disabled={state === 'sending'}>
            {state === 'sent' ? f.sent : state === 'sending' ? f.sending : f.send}
          </button>
          {state === 'error' && (
            <p className="body form-err" role="alert">
              {f.error}
            </p>
          )}
          {state === 'sent' && <span className="sr-only" role="status">{f.sent}</span>}
        </div>
      </form>
    </Panel>
  );
}

// ── 06 Backstage (mirror) ───────────────────────────────────────────────────
export function Backstage() {
  const [i, setI] = useState(0);
  const ref = useFocusOnOpen<HTMLElement>();
  const n = backstage.photos.length;
  useEffect(() => {
    if (reducedMotion()) return;
    const id = window.setInterval(() => setI((x) => (x + 1) % n), 4000);
    return () => clearInterval(id);
  }, [n]);
  return (
    <section ref={ref} tabIndex={-1} className="backstage" aria-label="Backstage">
      <div className="mirror">
        <div className="mframe" />
        <div className="glass">
          {backstage.photos.map((p, k) => (
            <img key={p.src + k} className={`photo${k === i ? ' on' : ''}`} src={p.src} alt={k === i ? p.alt : ''} aria-hidden={k !== i} />
          ))}
        </div>
        <div className="lipstick">{backstage.note}</div>
      </div>
      <div className="mcap">
        <Eyebrow k="backstage" text={backstage.eyebrow} />
        <p className="body ph sm" aria-live="polite">
          {backstage.photos[i].caption}
        </p>
        <div className="mdots">
          {backstage.photos.map((_, k) => (
            <button key={k} className={k === i ? 'on' : ''} aria-label={`Photo ${k + 1}`} aria-pressed={k === i} onClick={() => setI(k)} />
          ))}
        </div>
        <Back />
      </div>
    </section>
  );
}

// ── 07 Wardrobe ─────────────────────────────────────────────────────────────
export function Wardrobe() {
  return (
    <Panel side="r" label="Wardrobe">
      <Back />
      <Eyebrow k="wardrobe" />
      <Heading parts={wardrobe.heading} />
      <p className="body intro">{wardrobe.intro}</p>
      <ul className="hangers">
        {wardrobe.looks.map((l, i) => (
          <li className="hanger" key={i} tabIndex={0}>
            <IconHanger />
            <div>
              <div className="rn">{l.role}</div>
              <p className="eyebrow">
                Look {String(i + 1).padStart(2, '0')} · {l.production}, {l.year}
              </p>
            </div>
            <img className="pv photo" src={l.photo} alt={`${l.role} — ${l.production}`} loading="lazy" />
          </li>
        ))}
      </ul>
    </Panel>
  );
}

// ── Action! ─────────────────────────────────────────────────────────────────
export function ActionMode() {
  const cut = useQuietFocus<HTMLButtonElement>();
  return (
    <>
      <div className="actword" aria-hidden="true">
        {action.word}
      </div>
      <div className="cutbar">
        <button
          className="cutbtn"
          ref={cut}
          onClick={() => {
            sfx('voice', 'cut');
            go('set');
          }}
        >
          <i aria-hidden="true" />
          {action.cut}
        </button>
      </div>
    </>
  );
}

// ── Breathe (box breathing; the arch bulbs follow the same clock) ───────────
export function Breathe() {
  const circle = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  useEffect(() => {
    fx.breathT0 = performance.now();
    let raf = 0;
    const s = breathe.stepSeconds;
    const tick = () => {
      const now = performance.now();
      const lvl = breathLevel(now, s);
      if (circle.current) circle.current.style.transform = `scale(${0.55 + 0.45 * lvl})`;
      const k = Math.floor(((now - fx.breathT0) / 1000 / s) % 4);
      setStep((o) => (o === k ? o : k));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      fx.breathT0 = 0;
    };
  }, []);
  return (
    <>
      <div className="breath" aria-hidden="true">
        <div className="bcircle" ref={circle} />
        <div className="bword" key={step}>
          {breathe.steps[step]}
        </div>
      </div>
      <div className="bcard">
        <p className="eyebrow">
          <b>{breathe.eyebrow[0]}</b> · {breathe.eyebrow[1]}
        </p>
        <p className="body">{breathe.text}</p>
        <p className="sr-only" aria-live="polite">
          {breathe.steps[step]}
        </p>
        <Back to="projects" label={breathe.back} />
      </div>
    </>
  );
}

// ── Blooper reel ────────────────────────────────────────────────────────────
export function Bloopers() {
  const ref = useFocusOnOpen<HTMLDivElement>();
  return (
    <div className="bloop" ref={ref} tabIndex={-1} role="dialog" aria-label="Blooper reel">
      <p className="eyebrow">
        <b>{bloopers.eyebrow[0]}</b> · {bloopers.eyebrow[1]}
      </p>
      <div className="bgrid">
        {bloopers.takes.map((t, i) => (
          <div className="bframe" key={i} style={{ transform: `rotate(${t.tilt}deg) translateY(${i % 2 ? 14 : 0}px)` }}>
            {t.src ? <img className="photo" src={t.src} alt="Blooper" /> : <div className="slot">{t.slot}</div>}
            <p>{t.caption}</p>
          </div>
        ))}
      </div>
      <button
        className="cutbtn"
        onClick={() => {
          sfx('clap');
          useStore.getState().set({ bloop: false });
        }}
      >
        <i aria-hidden="true" />
        {bloopers.close}
      </button>
    </div>
  );
}

export function Sections() {
  const view = useStore((s) => s.view);
  const panel = useStore((s) => s.panel);
  const bloop = useStore((s) => s.bloop);
  return (
    <>
      {panel && view === 'about' && <About />}
      {panel && view === 'portfolio' && <Portfolio />}
      {panel && view === 'showreel' && <Showreel />}
      {panel && view === 'projects' && <Projects />}
      {panel && view === 'contact' && <Contacts />}
      {panel && view === 'backstage' && <Backstage />}
      {panel && view === 'wardrobe' && <Wardrobe />}
      {view === 'action' && panel && <ActionMode />}
      {view === 'breathe' && panel && <Breathe />}
      {bloop && <Bloopers />}
    </>
  );
}
