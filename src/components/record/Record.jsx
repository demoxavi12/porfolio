import { useEffect, useRef } from "react";
import { certifications, record } from "../../data/content";
import { useInView } from "../../hooks/useInView";
import { useReducedMotion } from "../../hooks/useMedia";
import { clamp, onFrame } from "../../lib/loop";
import "./record.css";

function Entry({ entry }) {
  const ref = useRef(null);
  const inView = useInView(ref, { margin: "0px 0px -35% 0px" });
  const [from, to] = entry.years;

  return (
    <li ref={ref} className={`record__item ${inView ? "is-in" : ""}`}>
      <p className="record__year" aria-label={to ? `${from} to 20${to}` : from}>
        <span className="display" aria-hidden="true">
          {from}
        </span>
        {to && (
          <span className="serif" aria-hidden="true">
            –{to}
          </span>
        )}
      </p>
      <div className="record__body">
        <p className="record__city mono">{entry.city}</p>
        <h3 className="record__place">{entry.place}</h3>
        <p className="record__what">{entry.what}</p>
        {entry.detail && <p className="record__detail">{entry.detail}</p>}
      </div>
    </li>
  );
}

export default function Record() {
  const listRef = useRef(null);
  const certRef = useRef(null);
  const reduced = useReducedMotion();
  const certIn = useInView(certRef);

  // The timeline's spine draws itself as you scroll.
  useEffect(() => {
    const list = listRef.current;
    if (reduced) {
      list.style.setProperty("--p", "1");
      return;
    }
    return onFrame(() => {
      const r = list.getBoundingClientRect();
      const vh = window.innerHeight;
      if (r.bottom < 0 || r.top > vh) return;
      list.style.setProperty("--p", clamp((vh * 0.65 - r.top) / r.height).toFixed(4));
    });
  }, [reduced]);

  return (
    <section id="record" className="record" data-theme="dark" data-atmos="record" aria-labelledby="record-title">
      <header className="record__head">
        <p className="mono record__label">04 / 05 — Record</p>
        <h2 id="record-title" className="record__title">
          <span className="display">Record</span> <span className="serif">so far.</span>
        </h2>
      </header>

      <ol className="record__list" ref={listRef}>
        {record.map((entry) => (
          <Entry key={entry.place} entry={entry} />
        ))}
      </ol>

      <div className={`record__certs ${certIn ? "is-in" : ""}`} ref={certRef}>
        <h3 className="mono">Certifications</h3>
        <ul>
          {certifications.map((c, i) => (
            <li key={c.name} className="reveal" style={{ "--r": i }}>
              <span className="record__cert-name">{c.name}</span>
              <span className="mono">{c.by}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
