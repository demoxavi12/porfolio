import { useEffect, useRef, useState } from "react";
import { person, sections, socials } from "../../data/content";
import { useClock } from "../../hooks/useClock";
import { onFrame } from "../../lib/loop";
import "./nav.css";

/**
 * Header (mark · local time · index), a full-screen index overlay, and a
 * section rail. Colours follow whatever section is underneath: every
 * section declares data-theme="light" | "dark".
 */
export default function Nav() {
  const [open, setOpen] = useState(false);
  const headerRef = useRef(null);
  const railRef = useRef(null);
  const toggleRef = useRef(null);
  const firstLinkRef = useRef(null);
  const time = useClock();

  // Theme + active section tracking, without React renders.
  useEffect(() => {
    const header = headerRef.current;
    const rail = railRef.current;
    let themed = [];
    let tracked = [];
    const collect = () => {
      themed = [...document.querySelectorAll("[data-theme]")].filter((el) => el !== header && el !== rail);
      tracked = sections.map((s) => document.getElementById(s.id)).filter(Boolean);
    };
    collect();
    window.addEventListener("resize", collect);

    const themeAt = (y) => {
      let theme = "light";
      for (const el of themed) {
        const r = el.getBoundingClientRect();
        if (r.top <= y && r.bottom > y) theme = el.dataset.theme; // deepest match wins
      }
      return theme;
    };

    let lastActive = null;
    const stop = onFrame(() => {
      const headerTheme = themeAt(30);
      if (header.dataset.theme !== headerTheme) header.dataset.theme = headerTheme;
      const mid = window.innerHeight / 2;
      const railTheme = themeAt(mid);
      if (rail.dataset.theme !== railTheme) rail.dataset.theme = railTheme;

      let active = null;
      for (const el of tracked) {
        const r = el.getBoundingClientRect();
        if (r.top <= mid && r.bottom > mid) active = el.id;
      }
      if (active !== lastActive) {
        lastActive = active;
        rail.querySelectorAll("a").forEach((a) => {
          if (a.hash === `#${active}`) a.setAttribute("aria-current", "true");
          else a.removeAttribute("aria-current");
        });
      }
    });

    return () => {
      stop();
      window.removeEventListener("resize", collect);
    };
  }, []);

  // Overlay: make the page inert, close on Escape, manage focus.
  useEffect(() => {
    const outside = document.querySelectorAll("main, footer, .rail");
    outside.forEach((el) => (el.inert = open));
    document.documentElement.classList.toggle("is-locked", open);
    if (!open) return;

    const toggle = toggleRef.current;
    firstLinkRef.current?.focus({ preventScroll: true });
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggle.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      outside.forEach((el) => (el.inert = false));
      document.documentElement.classList.remove("is-locked");
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <header className={`nav ${open ? "is-open" : ""}`} ref={headerRef} data-theme="light">
        <a href="#top" className="nav__mark" aria-label={`${person.name} — back to top`} onClick={close}>
          <span className="nav__sx" aria-hidden="true">
            SX
          </span>
          <span className="nav__name">{person.name}</span>
        </a>

        <p className="nav__meta mono">
          <span className="nav__pulse" aria-hidden="true" />
          <span>
            {person.location.split(",")[0]}, {person.country} — <time>{time}</time> IST
          </span>
        </p>

        <div className="nav__end">
          <a className="nav__cv mono u-link" href={person.resume} target="_blank" rel="noopener noreferrer" data-cursor="Read CV">
            Résumé ↗
          </a>
          <button
            ref={toggleRef}
            type="button"
            className="nav__toggle"
            aria-expanded={open}
            aria-controls="site-index"
            onClick={() => setOpen((v) => !v)}
            data-magnetic
          >
            <span className="mono">{open ? "Close" : "Index"}</span>
            <span className="nav__burger" aria-hidden="true">
              <i />
              <i />
            </span>
          </button>
        </div>
      </header>

      <div id="site-index" className={`index ${open ? "is-open" : ""}`} inert={!open} aria-hidden={!open}>
        <nav aria-label="Site index" className="index__nav">
          <ol>
            {sections.map((s, i) => (
              <li key={s.id} style={{ "--i": i }}>
                <a href={`#${s.id}`} onClick={close} ref={i === 0 ? firstLinkRef : undefined}>
                  <span className="index__num mono">0{i + 1}</span>
                  <span className="index__label display">{s.label}</span>
                  <span className="index__arrow" aria-hidden="true">
                    →
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <div className="index__foot mono">
          <a href={`mailto:${person.email}`} className="u-link">
            {person.email}
          </a>
          <span className="index__socials">
            {socials.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="u-link">
                {s.label}
              </a>
            ))}
          </span>
        </div>
      </div>

      <nav className="rail" aria-label="Sections" ref={railRef} data-theme="light">
        <ol>
          {sections.map((s, i) => (
            <li key={s.id}>
              <a href={`#${s.id}`}>
                <span className="rail__tick" aria-hidden="true" />
                <span className="rail__label mono">
                  0{i + 1} {s.short}
                </span>
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
