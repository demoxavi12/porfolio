import { useEffect, useRef, useState } from "react";
import { projects, stackGround, stackLayers } from "../../data/content";
import { useInView } from "../../hooks/useInView";
import { useReducedMotion } from "../../hooks/useMedia";
import { onFrame } from "../../lib/loop";
import { scroll } from "../../lib/pointer";
import "./stack.css";

const ALL = [...stackLayers, ...stackGround].flatMap((g) => g.items);
const MARQUEE = [...new Set(ALL)].filter((t) => t.length < 16);
const usedIn = (tech) => projects.filter((p) => p.stack.includes(tech));

// Deterministic scatter so items "spread" into place from across the screen.
const scatter = (i) => ({
  "--sx": `${(((i * 37) % 13) - 6) * 7}vw`,
  "--sy": `${(((i * 53) % 9) - 4) * 9}vh`,
  "--sr": `${(((i * 29) % 7) - 3) * 6}deg`,
  "--si": i,
});

function describe(active) {
  if (!active) return "Hover or tap a technology to trace where it runs — or pick a project to light its path.";
  if (active.type === "project") {
    const p = projects.find((x) => x.id === active.id);
    return `${p.name} → ${p.stack.join(" · ")}`;
  }
  const hits = usedIn(active.id);
  if (!hits.length) return `${active.id} → part of the toolkit, not in these three projects.`;
  return `${active.id} → used in ${hits.length} of ${projects.length}: ${hits.map((p) => p.name).join(", ")}`;
}

export default function Stack() {
  const sectionRef = useRef(null);
  const mapRef = useRef(null);
  const trackRef = useRef(null);
  const [hovered, setHovered] = useState(null);
  const [pinned, setPinned] = useState(null);
  const reduced = useReducedMotion();
  const mapIn = useInView(mapRef, { margin: "0px 0px -18% 0px" });

  const active = hovered ?? pinned;
  const litTech =
    active?.type === "project"
      ? new Set(projects.find((p) => p.id === active.id).stack)
      : active?.type === "tech"
        ? new Set([active.id])
        : null;
  const litProjects = new Set(
    active?.type === "tech" ? usedIn(active.id).map((p) => p.id) : active?.type === "project" ? [active.id] : []
  );

  // Marquee speed follows scroll velocity.
  useEffect(() => {
    if (reduced) return;
    const section = sectionRef.current;
    const track = trackRef.current;
    let x = 0;
    return onFrame(() => {
      const r = section.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) return;
      x -= 0.6 + Math.min(Math.abs(scroll.velocity) * 0.35, 18);
      const half = track.scrollWidth / 2;
      if (-x > half) x += half;
      track.style.transform = `translate3d(${x.toFixed(1)}px, 0, 0)`;
    });
  }, [reduced]);

  const bind = (item) => ({
    onPointerEnter: (e) => e.pointerType === "mouse" && setHovered(item),
    onPointerLeave: () => setHovered(null),
    onFocus: () => setHovered(item),
    onBlur: () => setHovered(null),
    onClick: () => setPinned((cur) => (cur?.id === item.id ? null : item)),
    "aria-pressed": pinned?.id === item.id,
  });

  const techButton = (tech, i) => {
    const state = litTech ? (litTech.has(tech) ? "is-lit" : "is-dim") : "";
    return (
      <li key={tech} className={`stack__item ${state}`} style={scatter(i)}>
        <button type="button" data-cursor="Trace" {...bind({ type: "tech", id: tech })}>
          {tech}
        </button>
      </li>
    );
  };

  return (
    <section id="stack" ref={sectionRef} className="stack" data-theme="dark" aria-labelledby="stack-title">
      <div className="stack__marquee" aria-hidden="true">
        <div className="stack__track" ref={trackRef}>
          {[...MARQUEE, ...MARQUEE].map((t, i) => (
            <span key={i}>
              {t}
              <i>✳</i>
            </span>
          ))}
        </div>
      </div>

      <header className="stack__head">
        <p className="mono stack__label">03 / 05 — Stack</p>
        <h2 id="stack-title" className="stack__title">
          <span className="display">The stack,</span> <span className="serif">read as a request.</span>
        </h2>
      </header>

      <div className="stack__controls">
        <div className="stack__projects" role="group" aria-label="Trace a project">
          {projects.map((p) => (
            <button
              key={p.id}
              type="button"
              className={`stack__proj ${litProjects.has(p.id) ? "is-lit" : ""}`}
              style={{ "--accent": p.accent, "--on-accent": p.onAccent }}
              data-cursor="Light path"
              {...bind({ type: "project", id: p.id })}
            >
              <span className="mono">{p.index}</span> {p.name}
            </button>
          ))}
        </div>
        <p className="stack__readout mono" aria-live="polite">
          {describe(active)}
        </p>
      </div>

      <div className={`stack__map ${mapIn ? "is-in" : ""}`} ref={mapRef}>
        <div className="stack__path">
          {stackLayers.map((layer, li) => (
            <div key={layer.id} className="stack__layer">
              <header>
                <span className="mono">0{li + 1}</span>
                <h3>{layer.label}</h3>
                <p className="serif">{layer.caption}</p>
              </header>
              <ul>{layer.items.map((t, i) => techButton(t, li * 7 + i))}</ul>
            </div>
          ))}
        </div>

        <div className="stack__ground">
          {stackGround.map((group, gi) => (
            <div key={group.id} className="stack__group">
              <h3 className="mono">{group.label}</h3>
              <ul>{group.items.map((t, i) => techButton(t, 21 + gi * 6 + i))}</ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
