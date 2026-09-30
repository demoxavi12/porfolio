import { useEffect, useRef } from "react";
import { useInView } from "../../hooks/useInView";
import { CINEMATIC, useMedia } from "../../hooks/useMedia";
import { clamp, ease, onFrame, range } from "../../lib/loop";
import Frame from "../ui/Frame";
import { SCHEMATICS } from "../ui/schematicMap";

/**
 * One project = one scroll-choreographed chapter (desktop):
 *   1. a small window sits on paper while the project name slides behind it
 *   2. the window's colour floods the viewport
 *   3. the window steps aside and the case study writes itself in
 * On mobile / reduced motion it is a calm, static composition.
 */
export default function Chapter({ project, total }) {
  const ref = useRef(null);
  const stickyRef = useRef(null);
  const cinematic = useMedia(CINEMATIC);
  const live = useInView(ref, { once: false, margin: "0px" });
  const infoIn = useInView(stickyRef, { margin: "0px 0px -20% 0px" });
  const Schematic = SCHEMATICS[project.id];

  useEffect(() => {
    const el = ref.current;
    // Every chapter lives in the dark system now.
    el.dataset.theme = "dark";
    if (!cinematic) return;
    const sticky = stickyRef.current;
    return onFrame(() => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      if (r.bottom < -vh * 0.2 || r.top > vh * 1.2) return;
      const p = clamp(-r.top / (r.height - vh));
      const open = ease(range(p, 0.02, 0.36));
      sticky.style.setProperty("--p", p.toFixed(4));
      sticky.style.setProperty("--open", open.toFixed(4));
      sticky.style.setProperty("--shift", ease(range(p, 0.36, 0.58)).toFixed(4));
      const info = range(p, 0.44, 0.72);
      sticky.style.setProperty("--info", info.toFixed(4));
      sticky.classList.toggle("is-readable", info > 0.45);

    });
  }, [cinematic]);

  // Only the accent colour: chapter text is always the light foreground ladder (work.css).
  const style = { "--accent": project.accent };

  return (
    <article
      id={`work-${project.id}`}
      ref={ref}
      className={`chapter ${live ? "is-live" : ""} ${infoIn ? "is-in" : ""}`}
      style={style}
      data-theme="dark"
      aria-labelledby={`${project.id}-title`}
    >
      <div className="chapter__sticky" ref={stickyRef}>
        <span className="chapter__ghost chapter__ghost--out display" aria-hidden="true">
          {project.ghost}
        </span>

        <div className="chapter__flood" aria-hidden="true">
          <span className="chapter__ghost chapter__ghost--in display">{project.ghost}</span>
        </div>

        <a
          className="chapter__window"
          href={project.demo}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={-1}
          aria-hidden="true"
          data-cursor="Open live demo"
        >
          <Frame url={project.url}>
            <Schematic />
          </Frame>
        </a>

        <div className="chapter__info">
          <p className="chapter__meta mono" style={{ "--k": 0 }}>
            <span>
              Project {project.index} / {String(total).padStart(2, "0")}
            </span>
            <span>{project.kind}</span>
          </p>
          <h3 id={`${project.id}-title`} className="chapter__title" style={{ "--k": 1 }}>
            <span className="display">{project.name}</span>{" "}
            <span className="serif chapter__subtitle">{project.title}</span>
          </h3>
          <p className="chapter__summary" style={{ "--k": 2 }}>
            {project.summary}
          </p>
          <ol className="chapter__notes" style={{ "--k": 3 }}>
            {project.notes.map((note, i) => (
              <li key={note}>
                <span className="mono">{String(i + 1).padStart(2, "0")}</span>
                {note}
              </li>
            ))}
          </ol>
          <p className="chapter__stack mono" style={{ "--k": 4 }}>
            <span className="sr-only">Built with: </span>
            {project.stack.map((tech, i) => (
              <span key={tech}>
                {i > 0 && (
                  <>
                    <span className="chapter__sep" aria-hidden="true">
                      {" / "}
                    </span>
                    <span className="sr-only">, </span>
                  </>
                )}
                {tech}
              </span>
            ))}
          </p>
          <div className="chapter__links" style={{ "--k": 5 }}>
            <a
              className="btn btn--line"
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="Open GitHub"
              data-magnetic
            >
              Source <span aria-hidden="true">↗</span>
              <span className="sr-only">for {project.name} on GitHub</span>
            </a>
            <a
              className="btn btn--solid"
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="Open live demo"
              data-magnetic
            >
              Live demo <span aria-hidden="true">↗</span>
              <span className="sr-only">of {project.name}</span>
            </a>
          </div>
        </div>

        <span className="chapter__progress" aria-hidden="true" />
      </div>
    </article>
  );
}
