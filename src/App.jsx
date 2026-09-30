import { useCallback, useLayoutEffect, useState } from "react";
import About from "./components/about/About";
import Atmosphere from "./components/atmosphere/Atmosphere";
import Contact from "./components/contact/Contact";
import Cursor from "./components/cursor/Cursor";
import Footer from "./components/footer/Footer";
import Hero from "./components/hero/Hero";
import Intro from "./components/intro/Intro";
import Nav from "./components/nav/Nav";
import Record from "./components/record/Record";
import Stack from "./components/stack/Stack";
import Work from "./components/work/Work";

// The title sequence plays on every full page load (never on scroll — it only
// exists at load). Reduced-motion visitors go straight to the hero.
function shouldPlayIntro() {
  try {
    return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return true;
  }
}

// A fresh load always starts at the top: drop any #section left in the URL
// and override whatever scroll position the browser tried to restore.
function startAtTop() {
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  if (window.location.hash) {
    history.replaceState(null, "", window.location.pathname + window.location.search);
  }
  window.scrollTo({ top: 0, left: 0, behavior: "instant" });
}

export default function App() {
  const [intro, setIntro] = useState(shouldPlayIntro);
  const [ready, setReady] = useState(() => !intro);

  // Before the first paint, so the visitor never sees a lower section first.
  useLayoutEffect(() => {
    startAtTop();
  }, []);

  const reveal = useCallback(() => setReady(true), []);
  const done = useCallback(() => setIntro(false), []);

  return (
    <>
      {/* The intro comes first in the DOM: when it unmounts, the next Tab lands on
          the skip link rather than past it. */}
      {intro && <Intro onReveal={reveal} onDone={done} />}
      <a href="#work" className="skip-link">
        Skip to content
      </a>
      <Atmosphere />
      <Cursor />
      <Nav />
      <main>
        <Hero ready={ready} />
        <Work />
        <About />
        <Stack />
        <Record />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
