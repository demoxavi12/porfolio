import { useCallback, useState } from "react";
import About from "./components/about/About";
import Contact from "./components/contact/Contact";
import Cursor from "./components/cursor/Cursor";
import Footer from "./components/footer/Footer";
import Hero from "./components/hero/Hero";
import Intro from "./components/intro/Intro";
import Nav from "./components/nav/Nav";
import Record from "./components/record/Record";
import Stack from "./components/stack/Stack";
import Work from "./components/work/Work";

const SEEN_KEY = "sx:intro-seen";

// The title sequence plays once per session and never for reduced motion.
function shouldPlayIntro() {
  try {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
    if (window.location.hash) return false;
    return sessionStorage.getItem(SEEN_KEY) !== "1";
  } catch {
    return false;
  }
}

export default function App() {
  const [intro, setIntro] = useState(shouldPlayIntro);
  const [ready, setReady] = useState(() => !intro);

  const reveal = useCallback(() => setReady(true), []);
  const done = useCallback(() => {
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* storage unavailable — the intro simply plays again next time */
    }
    setIntro(false);
  }, []);

  return (
    <>
      <a href="#work" className="skip-link">
        Skip to content
      </a>
      {intro && <Intro onReveal={reveal} onDone={done} />}
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
