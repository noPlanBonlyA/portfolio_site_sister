// "Skip 3D": the same content as a plain, scrolling, accessible page.
import { useEffect } from 'react';
import { about, backstage, contact, intro, portfolio, projects, scenes, showreel, wardrobe } from '../content';
import { Heading, PhotoBox } from '../sections/Sections';

export default function Plain({ webgl }: { webgl: boolean }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const pg = about.page;
  return (
    <div className="plain">
      <header className="plain-top">
        <span className="logo">M · Dmitrieva</span>
        <nav aria-label="Sections">
          {(['about', 'portfolio', 'showreel', 'projects', 'contact', 'backstage', 'wardrobe'] as const).map((k) => (
            <a key={k} href={`#p-${k}`}>
              {scenes[k].name}
            </a>
          ))}
        </nav>
        {webgl && (
          <a className="btn btn-ghost btn-sm" href="#">
            Enter 3D
          </a>
        )}
      </header>
      <main>
        <section className="plain-hero">
          <p className="eyebrow">{intro.eyebrow}</p>
          <h1 className="name">
            {intro.nameLines[0]} {intro.nameLines[1]}
          </h1>
          <p className="slogan">
            {intro.slogan[0]} | {intro.slogan[1]}
          </p>
        </section>

        <section id="p-about" className="plain-sec">
          <p className="eyebrow">
            <b>Scene 01</b> · {scenes.about.name}
          </p>
          <Heading parts={about.heading} />
          <div className="plain-about">
            <img className="photo" src={about.portrait.src} alt={about.portrait.alt} loading="lazy" />
            <div className="page flat">
              <p>
                <b>{pg.slug}</b>
              </p>
              <p>{pg.action}</p>
              <p className="cue">{pg.cue}</p>
              <p className="paren">{pg.paren}</p>
              <p className="dlg">{pg.dialogue}</p>
              <p className="pg-trans">{pg.transition}</p>
            </div>
          </div>
        </section>

        <section id="p-portfolio" className="plain-sec">
          <p className="eyebrow">
            <b>Scene 02</b> · {scenes.portfolio.name}
          </p>
          <Heading parts={portfolio.heading} />
          {portfolio.categories.map((c) => (
            <div key={c.label}>
              <h3 className="plain-h3">{c.label}</h3>
              <div className="plain-grid">
                {c.photos.map((p, i) => (
                  <figure className="shot" key={i}>
                    <div className="pic">
                      <PhotoBox p={p} />
                    </div>
                    <figcaption className="cap">{p.caption}</figcaption>
                  </figure>
                ))}
              </div>
            </div>
          ))}
        </section>

        <section id="p-showreel" className="plain-sec">
          <p className="eyebrow">
            <b>Scene 03</b> · {showreel.eyebrow}
          </p>
          <div className="plain-video">
            {showreel.youtubeId ? (
              <iframe src={`https://www.youtube-nocookie.com/embed/${showreel.youtubeId}`} title={showreel.title} loading="lazy" allowFullScreen />
            ) : (
              <video src="/video/hero-color.mp4" poster="/video/hero-poster.jpg" controls muted playsInline preload="none" aria-label={showreel.title} />
            )}
          </div>
        </section>

        <section id="p-projects" className="plain-sec">
          <p className="eyebrow">
            <b>Scene 04</b> · {projects.eyebrow}
          </p>
          <h2 className="h2">{projects.featured.title}</h2>
          <p className="body">{projects.featured.kicker}</p>
          <p className="body ph">{projects.featured.text}</p>
          <p>
            <a className="btn" href={projects.featured.url}>
              {projects.featured.cta}
            </a>
          </p>
          <p className="eyebrow soon">{projects.comingSoonLabel}</p>
          <div className="tickets">
            {projects.tickets.map((t, i) => (
              <div className="ticket" key={t.title}>
                <span className="eyebrow sm">Admit one · {String(i + 1).padStart(2, '0')}</span>
                <h3 className="ticket-title">{t.title}</h3>
                <p className="body ph sm">{t.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="p-contact" className="plain-sec">
          <p className="eyebrow">
            <b>Scene 05</b> · {scenes.contact.name}
          </p>
          <Heading parts={contact.heading} />
          {contact.rows.map((r) =>
            r.href ? (
              <a className="endrow" href={r.href} key={r.label}>
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
          <p className="row">
            <a className="btn btn-ghost" href={contact.cv.href}>
              {contact.cv.label}
            </a>
          </p>
        </section>

        <section id="p-backstage" className="plain-sec">
          <p className="eyebrow">
            <b>Scene 06</b> · {backstage.eyebrow}
          </p>
          <div className="plain-grid">
            {backstage.photos.map((p, i) => (
              <figure className="shot" key={i}>
                <div className="pic">
                  <img className="photo" src={p.src} alt={p.alt} loading="lazy" />
                </div>
                <figcaption className="cap">{p.caption}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section id="p-wardrobe" className="plain-sec">
          <p className="eyebrow">
            <b>Scene 07</b> · {scenes.wardrobe.name}
          </p>
          <Heading parts={wardrobe.heading} />
          <div className="plain-grid">
            {wardrobe.looks.map((l, i) => (
              <figure className="shot" key={i}>
                <div className="pic">
                  <img className="photo" src={l.photo} alt={`${l.role} — ${l.production}`} loading="lazy" />
                </div>
                <figcaption className="cap">
                  {l.role} · Look {String(i + 1).padStart(2, '0')} · {l.production}, {l.year}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      </main>
      <footer className="plain-foot eyebrow">© Mariia Dmitrieva · Saint Petersburg</footer>
    </div>
  );
}
