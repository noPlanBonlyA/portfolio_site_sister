// "Skip 3D": the same content as a plain, scrolling, accessible page.
import { useEffect } from 'react';
import { about, backstage, contact, intro, portfolio, projects, scenes, showreel } from '../content';
import { Heading, PhotoBox, ScreenplayLines } from '../sections/Sections';

export default function Plain({ webgl }: { webgl: boolean }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="plain">
      <header className="plain-top">
        <span className="logo">M · Dmitrieva</span>
        <nav aria-label="Sections">
          {(['about', 'portfolio', 'showreel', 'projects', 'contact', 'backstage'] as const).map((k) => (
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
              <ScreenplayLines />
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
              <video src={showreel.video} poster={showreel.poster} controls playsInline preload="none" aria-label={showreel.title} />
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
              </figure>
            ))}
          </div>
        </section>

      </main>
      <footer className="plain-foot eyebrow">© Mariia Dmitrieva · Saint Petersburg</footer>
    </div>
  );
}
