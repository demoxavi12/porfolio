import { useEffect, useRef } from "react";
import { about } from "../../data/content";
import { useInView } from "../../hooks/useInView";
import { useReducedMotion } from "../../hooks/useMedia";
import { clamp, onFrame } from "../../lib/loop";
import "./about.css";

// Flatten the statement into words, remembering which ones are emphasised.
const WORDS = about.statement.flatMap((part) => {
  const em = typeof part !== "string";
  return (em ? part.em : part).split(" ").map((word) => ({ word, em }));
});

export default function About() {
  const textRef = useRef(null);
  const notesRef = useRef(null);
  const reduced = useReducedMotion();
  const notesIn = useInView(notesRef);

  // The statement is read into existence: words ink in as you scroll.
  useEffect(() => {
    const text = textRef.current;
    if (reduced) {
      text.style.setProperty("--p", "1");
      return;
    }
    return onFrame(() => {
      const r = text.getBoundingClientRect();
      const vh = window.innerHeight;
      if (r.bottom < 0 || r.top > vh) return;
      const start = vh * 0.82;
      const end = vh * 0.4 - r.height;
      text.style.setProperty("--p", clamp((start - r.top) / (start - end)).toFixed(4));
    });
  }, [reduced]);

  return (
    <section id="about" className="about" data-theme="light" aria-labelledby="about-title">
      <div className="about__top mono">
        <h2 id="about-title">About</h2>
        <span aria-hidden="true">02 / 05</span>
      </div>

      <p className="about__statement" ref={textRef} style={{ "--n": WORDS.length }}>
        {WORDS.map(({ word, em }, i) => (
          <span key={i} className={`about__w ${em ? "serif" : ""}`} style={{ "--w": i }}>
            {word}{" "}
          </span>
        ))}
      </p>

      <dl className={`about__notes ${notesIn ? "is-in" : ""}`} ref={notesRef}>
        {about.notes.map((note, i) => (
          <div key={note.k} className="about__note reveal" style={{ "--r": i }}>
            <dt className="mono">{note.k}</dt>
            <dd>{note.v}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
