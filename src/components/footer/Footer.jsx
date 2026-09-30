import { useRef } from "react";
import { person, sections, socials } from "../../data/content";
import { useClock } from "../../hooks/useClock";
import { useInViewReplay } from "../../hooks/useInViewReplay";
import Chars from "../ui/Chars";
import "./footer.css";

const YEAR = new Date().getFullYear();

export default function Footer() {
  const wordRef = useRef(null);
  // The closing signature replays on every return to the footer.
  const wordIn = useInViewReplay(wordRef, { threshold: 0.35 });
  const time = useClock();

  return (
    <footer className="footer" data-theme="dark" data-atmos="contact">
      <div className="footer__top">
        <nav aria-label="Footer" className="footer__col">
          <h2 className="mono">Index</h2>
          <ul>
            {sections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="u-link">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="footer__col">
          <h2 className="mono">Elsewhere</h2>
          <ul>
            {socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" className="u-link" data-cursor={s.cursor}>
                  {s.label}
                </a>
              </li>
            ))}
            <li>
              <a href={`mailto:${person.email}`} className="u-link">
                Email
              </a>
            </li>
          </ul>
        </div>
        <div className="footer__col">
          <h2 className="mono">Local time</h2>
          <p className="footer__time">
            <time>{time}</time> <span className="mono">IST</span>
          </p>
          <p className="footer__place">{person.location}, India</p>
        </div>
        <a href="#top" className="footer__top-link btn btn--line" data-magnetic data-cursor="Back to top">
          Back to top <span aria-hidden="true">↑</span>
        </a>
      </div>

      <p ref={wordRef} className={`footer__word display ${wordIn ? "is-in" : ""}`} aria-hidden="true">
        <Chars text="SWARAJ" step={0.04} />
        <Chars text="XAVIER" step={0.045} delay={0.32} className="footer__word-2" />
      </p>

      <div className="footer__base mono">
        <span>
          © {YEAR} {person.name}
        </span>
        <span>Designed &amp; built in React + Vite — zero animation libraries</span>
        <span className="footer__caret" aria-hidden="true" />
      </div>
    </footer>
  );
}
