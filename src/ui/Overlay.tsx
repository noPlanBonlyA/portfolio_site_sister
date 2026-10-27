import { useEffect, useRef, useState } from 'react';
import { hud, intro, scenes, site, slate as slateCopy } from '../content';
import { NAV_KEYS, PROPS, type SectionKey } from '../scene/layout';
import { go, isMoving } from '../nav';
import { isTouch, toast, useStore } from '../store';
import { setSound, sfx } from '../sound';
import { useLoading } from '../loading';
import { labelEls } from './labelRegistry';
import { pointer } from '../three/CameraRig';
import { Back, IconArrowDown, IconSoundOff, IconSoundOn, useQuietFocus } from './icons';

// ── Academy leader 3-2-1 (covers preloading) ─────────────────────────────────
export function Leader() {
  const leaderDone = useStore((s) => s.leaderDone);
  const { progress, ready } = useLoading();
  const [count, setCount] = useState(3);
  const [skipped, setSkipped] = useState(false);
  const [out, setOut] = useState(false);
  const maxP = useRef(0);
  maxP.current = Math.max(maxP.current, ready ? 1 : Math.min(progress, 0.96));

  useEffect(() => {
    if (skipped) return;
    const id = window.setInterval(() => setCount((c) => c - 1), 1000);
    return () => clearInterval(id);
  }, [skipped]);

  const finished = (count <= 0 || skipped) && ready;
  useEffect(() => {
    if (!finished) return;
    setOut(true);
    const t = window.setTimeout(() => useStore.getState().set({ leaderDone: true }), 650);
    return () => clearTimeout(t);
  }, [finished]);

  if (leaderDone) return null;
  const waiting = count <= 0 || skipped;
  return (
    <div className={`leader${out ? ' out' : ''}`} role="dialog" aria-label="Intro" aria-live="polite">
      <div className="ring">
        {!waiting && <div className="sweep" key={count} />}
        <div className="hx" />
        <div className="vx" />
        <div className="num" aria-hidden="true">
          {waiting ? <span className="pct">{Math.round(maxP.current * 100)}%</span> : count}
        </div>
      </div>
      <p className="eyebrow leader-cap">{waiting && !ready ? 'Lighting the set…' : intro.leaderCaption}</p>
      <div className="loadbar" aria-hidden="true">
        <i style={{ transform: `scaleX(${maxP.current})` }} />
      </div>
      <button className="skip" onClick={() => setSkipped(true)}>
        {intro.skip}
      </button>
    </div>
  );
}

// ── Title card on the cinema screen ──────────────────────────────────────────
export function TitleCard() {
  const view = useStore((s) => s.view);
  const leaderDone = useStore((s) => s.leaderDone);
  if (view !== 'title' || !leaderDone) return null;
  return <TitleInner />;
}

function TitleInner() {
  const btn = useQuietFocus<HTMLButtonElement>();
  return (
    <div className="title">
      <p className="eyebrow rise" style={{ animationDelay: '.3s' }}>
        {intro.eyebrow}
      </p>
      <h1 className="name rise" style={{ animationDelay: '.6s' }}>
        {intro.nameLines[0]}
        <br />
        {intro.nameLines[1]}
      </h1>
      <p className="slogan rise" style={{ animationDelay: '1s' }}>
        {intro.slogan[0]}
        <i aria-hidden="true" />
        <span className="sr-only"> | </span>
        {intro.slogan[1]}
      </p>
      <button className="explore rise" style={{ animationDelay: '1.4s' }} onClick={() => go('set')} ref={btn}>
        {intro.explore}
        <b>
          <IconArrowDown />
        </b>
      </button>
    </div>
  );
}

export function Letterbox() {
  const view = useStore((s) => s.view);
  return (
    <>
      <div className={`lbar lbar-t${view === 'title' ? ' on' : ''}`} />
      <div className={`lbar lbar-b${view === 'title' ? ' on' : ''}`} />
    </>
  );
}

// ── Top HUD ─────────────────────────────────────────────────────────────────
export function Hud() {
  const view = useStore((s) => s.view);
  const sound = useStore((s) => s.sound);
  const grade = useStore((s) => s.grade);
  const leaderDone = useStore((s) => s.leaderDone);
  const set = useStore((s) => s.set);

  const toggleSound = () => {
    const next = setSound(!sound);
    if (next === null) return toast('Sound is not supported here');
    set({ sound: next });
    if (next) toast(hud.soundOnToast);
  };
  const setGrade = (g: 'bw' | 'color') => {
    if (g === grade) return;
    sfx('whoosh');
    set({ grade: g, flash: Date.now() });
  };

  if (!leaderDone) return null;
  return (
    <header className="hud">
      <button className="logo" onClick={() => go('set')} aria-label={`${site.name} — back to the set overview`}>
        {site.logo}
      </button>
      {view !== 'title' && (
        <nav className="scene-nav" aria-label="Scenes">
          {NAV_KEYS.map((k) => (
            <button key={k} className={`navbtn${view === k ? ' on' : ''}`} aria-current={view === k ? 'page' : undefined} onClick={() => go(k)}>
              <em>{scenes[k].no}</em>
              {scenes[k].name}
            </button>
          ))}
        </nav>
      )}
      <div className="hud-r">
        <button className="actbtn" onClick={() => go('action')}>
          <i aria-hidden="true" />
          {hud.action}
        </button>
        <button className={`sndbtn${sound ? ' on' : ''}`} onClick={toggleSound} aria-label={sound ? 'Turn sound off' : 'Turn sound on'} aria-pressed={sound}>
          {sound ? <IconSoundOn /> : <IconSoundOff />}
        </button>
        <div className="grade-sw" role="group" aria-label="Colour grade">
          <button className={`gbtn${grade === 'bw' ? ' on' : ''}`} aria-pressed={grade === 'bw'} onClick={() => setGrade('bw')}>
            <i className="sw-bw" aria-hidden="true" />
            B&amp;W
          </button>
          <button className={`gbtn${grade === 'color' ? ' on' : ''}`} aria-pressed={grade === 'color'} onClick={() => setGrade('color')}>
            <i className="sw-co" aria-hidden="true" />
            Colour
          </button>
        </div>
      </div>
    </header>
  );
}

export function BottomBar() {
  const view = useStore((s) => s.view);
  const phase = useStore((s) => s.phase);
  const grade = useStore((s) => s.grade);
  const leaderDone = useStore((s) => s.leaderDone);
  if (!leaderDone || view === 'title') return null;
  const onSet = view === 'set' && phase === 'idle';
  return (
    <>
      {onSet && <div className="hint">{isTouch() ? hud.hintTouch : hud.hint}</div>}
      {onSet && (
        <div className="tc">
          <i className="recdot" aria-hidden="true" />
          {grade === 'bw' ? hud.stageBw : hud.stageColor}
        </div>
      )}
      <a className="skip3d" href="#plain">
        {hud.skip3d}
      </a>
    </>
  );
}

// ── Gaffer-tape labels over the props (positioned by CameraRig) ──────────────
export function Labels() {
  const view = useStore((s) => s.view);
  const phase = useStore((s) => s.phase);
  const hover = useStore((s) => s.hover);
  const leaderDone = useStore((s) => s.leaderDone);
  const visible = leaderDone && view === 'set' && phase === 'idle';
  return (
    <div className={`labels${visible ? ' on' : ''}`} aria-hidden={!visible}>
      {PROPS.filter((p) => p.label && p.section).map((p) => (
        <button
          key={p.id}
          ref={(el) => {
            labelEls[p.id] = el;
          }}
          className={`lab${hover === p.section ? ' hot' : ''}`}
          tabIndex={visible ? 0 : -1}
          aria-label={p.name}
          onClick={() => go(p.section as SectionKey)}
          onMouseEnter={() => useStore.getState().set({ hover: p.section })}
          onMouseLeave={() => useStore.getState().set({ hover: null })}
          onFocus={() => useStore.getState().set({ hover: p.section })}
          onBlur={() => useStore.getState().set({ hover: null })}
        >
          <span className="tape">
            <i aria-hidden="true" />
            <span>{p.label!.text}</span>
          </span>
        </button>
      ))}
    </div>
  );
}

// ── Ring cursor (overview, mouse only) ───────────────────────────────────────
export function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  const view = useStore((s) => s.view);
  const hover = useStore((s) => s.hover);
  const phase = useStore((s) => s.phase);
  useEffect(() => {
    let raf = 0;
    const loop = () => {
      if (ref.current) ref.current.style.transform = `translate3d(${pointer.x * window.innerWidth}px, ${pointer.y * window.innerHeight}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);
  const on = view === 'set' && phase === 'idle' && !isTouch();
  return (
    <div ref={ref} className={`cur${on ? ' on' : ''}${on && hover ? ' hot' : ''}`} aria-hidden="true">
      <b>{hover ? `${scenes[hover].name} — walk over` : ''}</b>
    </div>
  );
}

// ── Slate, subtitles, toast, flash, fade ─────────────────────────────────────
export function Slate() {
  const slate = useStore((s) => s.slate);
  if (!slate) return null;
  const sc = scenes[slate.key];
  return (
    <div className="slate" key={slate.id} aria-hidden="true">
      <div className="stick" />
      <div className="board">
        <div className="chalk sm">{slateCopy.prod}</div>
        <div className="slate-name">{sc.name}</div>
        <div className="slate-grid">
          <div className="chalk sm">
            Scene<div className="big">{sc.no}</div>
          </div>
          <div className="chalk sm">
            Take<div className="big">{slate.take}</div>
          </div>
          <div className="chalk sm">
            Roll<div className="big">{sc.roll}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Subtitle() {
  const sub = useStore((s) => s.sub);
  return (
    <div className="sub-wrap" aria-live="polite">
      {sub && (
        <div className="sub" key={sub}>
          <span>{sub}</span>
        </div>
      )}
    </div>
  );
}

export function Toast() {
  const t = useStore((s) => s.toast);
  return (
    <div aria-live="polite" className="toast-wrap">
      {t && (
        <div className="toast" key={t.id}>
          {t.text}
        </div>
      )}
    </div>
  );
}

export function Flash() {
  const flash = useStore((s) => s.flash);
  if (!flash) return null;
  return <div className="flash" key={flash} />;
}

/** Esc closes a panel / mode */
export function useKeys() {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      const s = useStore.getState();
      if (s.bloop) return s.set({ bloop: false });
      if (s.view === 'breathe') return go('projects');
      if (s.view !== 'title' && s.view !== 'set') go('set');
      else if (isMoving() && s.view === 'set') return;
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
}

export { Back };
