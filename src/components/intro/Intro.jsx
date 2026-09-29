import { useEffect, useRef, useState } from "react";
import Chars from "../ui/Chars";
import "./intro.css";

const REVEAL_AT = 3500; // ink panel starts lifting
const DONE_AT = 4400; // intro unmounts

const FRAGMENTS = [
  { label: "POST /api/events", tone: "cobalt", x: 8, y: 14, w: 22, t: 0.3 },
  { label: "socket.io · #general", tone: "tangerine", x: 64, y: 62, w: 26, t: 0.62 },
  { label: "jwt.verify(token)", tone: "lime", x: 70, y: 12, w: 18, t: 0.95 },
  { label: "stripe.checkout", tone: "plum", x: 12, y: 66, w: 24, t: 1.4 },
  { label: "redis.get → HIT", tone: "paper", x: 38, y: 80, w: 28, t: 1.8 },
  { label: "rateLimit() → 429", tone: "tangerine", x: 4, y: 38, w: 20, t: 2.2 },
  { label: "GET /products 200", tone: "cobalt", x: 74, y: 36, w: 20, t: 2.55 },
];

/**
 * A ~4s personal title sequence. Plays once per session, never with
 * prefers-reduced-motion (App decides), and can be skipped with the button
 * or Escape.
 */
export default function Intro({ onReveal, onDone }) {
  const [leaving, setLeaving] = useState(false);
  const skipRef = useRef(null);

  useEffect(() => {
    const root = document.documentElement;
    const button = skipRef.current;
    root.classList.add("is-locked");
    button.focus({ preventScroll: true });

    let finished = false;
    let revealed = false;
    const timers = [];
    const reveal = () => {
      if (revealed) return;
      revealed = true;
      setLeaving(true);
      onReveal();
    };
    const finish = () => {
      if (finished) return;
      finished = true;
      root.classList.remove("is-locked");
      onDone();
    };
    const skip = () => {
      timers.forEach(clearTimeout);
      reveal();
      timers.push(setTimeout(finish, 700));
    };

    timers.push(setTimeout(reveal, REVEAL_AT), setTimeout(finish, DONE_AT));
    const onKey = (e) => e.key === "Escape" && skip();
    window.addEventListener("keydown", onKey);
    button.addEventListener("click", skip);

    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener("keydown", onKey);
      button.removeEventListener("click", skip);
      root.classList.remove("is-locked");
    };
  }, [onReveal, onDone]);

  return (
    <div className={`intro ${leaving ? "is-leaving" : ""}`}>
      <div className="intro__frags" aria-hidden="true">
        {FRAGMENTS.map((f) => (
          <span
            key={f.label}
            className={`intro__frag intro__frag--${f.tone}`}
            style={{ left: `${f.x}%`, top: `${f.y}%`, width: `${f.w}vw`, "--t": `${f.t}s` }}
          >
            <i className="mono">{f.label}</i>
          </span>
        ))}
      </div>

      <span className="intro__scan" aria-hidden="true" />

      <div className="intro__words" aria-hidden="true">
        <span className="intro__word intro__word--1 display" style={{ "--start": "0.25s" }}>
          <Chars text="SWARAJ" step={0.05} />
        </span>
        <span className="intro__word intro__word--2 serif" style={{ "--start": "1.3s" }}>
          <Chars text="Xavier" step={0.05} />
        </span>
        <span className="intro__word intro__word--3 display" style={{ "--start": "2.3s" }}>
          <Chars text="SUNA" step={0.06} />
        </span>
      </div>

      <div className="intro__meta mono" aria-hidden="true">
        <span>SX — Portfolio</span>
        <span className="intro__bar">
          <i />
        </span>
        <span>Berhampur, IN</span>
      </div>

      <button ref={skipRef} type="button" className="intro__skip mono" data-cursor="Skip">
        Skip intro <span aria-hidden="true">→</span>
      </button>
    </div>
  );
}
