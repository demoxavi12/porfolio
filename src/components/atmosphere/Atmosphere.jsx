import { useEffect } from "react";
import "./atmosphere.css";

/**
 * The page's shared dark environment: one fixed layer of very large, soft
 * colour fields (plus grain) behind every section. Sections are transparent
 * over it and declare a mood with data-atmos="…"; whichever section crosses
 * the middle of the viewport sets <html data-atmos>, and the registered
 * colour properties cross-fade — so the colour evolves as you scroll while
 * the room itself never changes. One IntersectionObserver, no scroll loop.
 */
export default function Atmosphere() {
  useEffect(() => {
    const root = document.documentElement;
    const sections = [...document.querySelectorAll("[data-atmos]")];
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) root.dataset.atmos = entry.target.dataset.atmos;
        }
      },
      // A thin line across the middle of the viewport.
      { rootMargin: "-50% 0px -50% 0px" }
    );
    sections.forEach((s) => io.observe(s));
    if (!root.dataset.atmos) root.dataset.atmos = "hero";
    return () => io.disconnect();
  }, []);

  return <div className="atmos" aria-hidden="true" />;
}
