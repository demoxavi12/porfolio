import { useEffect, useRef, useState } from "react";
import { person, socials } from "../../data/content";
import { useInView } from "../../hooks/useInView";
import Chars from "../ui/Chars";
import "./contact.css";

const LINKS = [
  ...socials.map((s) => ({ ...s, external: true })),
  { label: "Résumé", handle: "PDF · one page", href: person.resume, cursor: "Read CV", external: true },
];

export default function Contact() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const titleIn = useInView(titleRef);
  const present = useInView(sectionRef, { once: false, margin: "-40% 0px -40% 0px" });

  // The ending: while you're here, the chrome around the page steps back.
  useEffect(() => {
    document.documentElement.classList.toggle("is-quiet", present);
    return () => document.documentElement.classList.remove("is-quiet");
  }, [present]);

  useEffect(() => {
    if (!copied) return;
    const id = setTimeout(() => setCopied(false), 2400);
    return () => clearTimeout(id);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(person.email);
      setCopied(true);
    } catch {
      window.location.href = `mailto:${person.email}`;
    }
  };

  return (
    <section id="contact" ref={sectionRef} className="contact" data-theme="dark" data-atmos="contact" aria-labelledby="contact-title">
      <p className="mono contact__label">05 / 05 — Contact</p>

      <h2
        id="contact-title"
        ref={titleRef}
        className={`contact__title ${titleIn ? "is-in" : ""}`}
        aria-label="Let's build something."
      >
        <span className="display contact__row">
          <Chars text="Let’s build" step={0.035} />
        </span>
        <span className="serif contact__row contact__row--2">
          <Chars text="something." step={0.04} delay={0.35} />
        </span>
      </h2>

      <div className="contact__grid">
        <div className="contact__mail">
          <p className="contact__lede">
            Open to software engineering internships and junior developer roles. A project, a role or a question — my
            inbox is the fastest way in.
          </p>
          <a className="contact__email" href={`mailto:${person.email}`} data-cursor="Write to me">
            {person.email}
          </a>
          <button type="button" className="btn btn--paper" onClick={copy} data-cursor="Copy" data-magnetic>
            {copied ? "Copied to clipboard ✓" : "Copy address"}
          </button>
          <span className="sr-only" aria-live="polite">
            {copied ? "Email address copied" : ""}
          </span>
        </div>

        <ul className="contact__links">
          {LINKS.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                data-cursor={link.cursor}
              >
                <span className="contact__link-label">{link.label}</span>
                <span className="contact__link-handle mono">{link.handle}</span>
                <span className="contact__link-arrow" aria-hidden="true">
                  ↗
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
