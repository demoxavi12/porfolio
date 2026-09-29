import { useRef } from "react";
import { projects } from "../../data/content";
import { useInView } from "../../hooks/useInView";
import Chars from "../ui/Chars";
import Chapter from "./Chapter";
import "./work.css";

export default function Work() {
  const headRef = useRef(null);
  const inView = useInView(headRef);

  return (
    <section id="work" className="work" aria-labelledby="work-title">
      <header className={`work__head ${inView ? "is-in" : ""}`} ref={headRef} data-theme="light">
        <p className="mono work__count reveal">({String(projects.length).padStart(2, "0")}) Deployed · open source</p>
        <h2 id="work-title" className="work__title" aria-label="Selected work">
          <span className="display">
            <Chars text="Selected" step={0.04} />
          </span>
          <span className="serif">
            <Chars text="work" step={0.05} delay={0.3} />
          </span>
        </h2>
        <p className="work__intro reveal" style={{ "--r": 3 }}>
          Three full-stack systems, each with its own authentication, data model and API surface. Scroll — each one
          opens up.
        </p>
      </header>

      {projects.map((project) => (
        <Chapter key={project.id} project={project} total={projects.length} />
      ))}
    </section>
  );
}
