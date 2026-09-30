import { useCallback, useEffect, useRef } from "react";
import { person, projects } from "../../data/content";
import { useInView } from "../../hooks/useInView";
import { useReducedMotion } from "../../hooks/useMedia";
import { clamp, lerp, onFrame } from "../../lib/loop";
import { pointer } from "../../lib/pointer";
import Chars from "../ui/Chars";
import Frame from "../ui/Frame";
import { CodeUI, TokenUI } from "../ui/Schematics";
import { SCHEMATICS } from "../ui/schematicMap";
import Ball, { BallArt } from "./Ball";
import { expand, placeCards, pushOut, rotatedHalf, seeded, unionRect, zoneMargin } from "./layout";
import "./ball.css";
import "./hero.css";

const byId = Object.fromEntries(projects.map((p) => [p.id, p]));

// size = share of the stage width (varied per load); depth < 0 = further away (blurred).
// Where each card goes is decided at runtime by the placement engine (layout.js).
const WINDOWS = [
  { id: "pulseops", size: 0.25, depth: 0.85 },
  { id: "code", size: 0.13, depth: -0.8 },
  { id: "chat", size: 0.19, depth: 0.45 },
  { id: "eleve", size: 0.2, depth: -0.55 },
  { id: "token", size: 0.11, depth: 1 },
];

const NAV_CLEARANCE = 80;
const nameParts = (root) => [
  root.querySelector(".hero__row--1 .chars"),
  root.querySelector(".hero__xavier .chars"),
  root.querySelector(".hero__suna"),
];

export default function Hero({ ready }) {
  const sectionRef = useRef(null);
  const hoverRef = useRef(-1);
  const coordRef = useRef(null);
  const stageRef = useRef(null);
  // Spring offsets a card gets when the ball strikes it.
  const bumpsRef = useRef(WINDOWS.map(() => ({ x: 0, y: 0, r: 0, vx: 0, vy: 0, vr: 0 })));
  // The current composition: resting rects, rotations, protected-zone margin.
  const layoutRef = useRef(null);
  const reduced = useReducedMotion();
  const live = useInView(sectionRef, { once: false, margin: "0px" });

  // ---- Placement: measure the real name and cards, then scatter the cards
  // around a protected identity zone. Re-runs on resize, font load and any
  // change in the name's size. One random seed per page load.
  useEffect(() => {
    const stage = stageRef.current;
    const windows = [...stage.querySelectorAll(".hw")];
    const rows = [...stage.querySelectorAll(".hero__row")];
    const seed = Math.floor(Math.random() * 4294967296);
    let version = 0;

    const layout = () => {
      const rand = seeded(seed);
      const rots = WINDOWS.map(() => (rand() < 0.5 ? -1 : 1) * (1.5 + rand() * 5.5));
      const sizes = WINDOWS.map(() => 0.9 + rand() * 0.2);
      const W = stage.clientWidth;
      const H = stage.clientHeight;

      // Measure the name at rest (without its scroll drift).
      const drift = rows.map((r) => r.style.transform);
      rows.forEach((r) => (r.style.transform = ""));
      const name = unionRect(nameParts(stage), stage.getBoundingClientRect());
      rows.forEach((r, k) => (r.style.transform = drift[k]));
      if (!name) return;
      const margin = zoneMargin(W);
      const zone = expand(name, margin);
      const mobile = window.matchMedia("(max-width: 760px)").matches;

      if (mobile) {
        // Phones use their own composition (hero.css): the name, then the work below it.
        windows.forEach((w) => {
          w.style.left = w.style.top = w.style.width = "";
          w.classList.remove("is-benched");
        });
      } else {
        const aspects = windows.map((w) => {
          const f = w.querySelector(".frame");
          return f.offsetHeight / Math.max(1, f.offsetWidth) || 0.69;
        });
        const cards = WINDOWS.map((c, i) => {
          const w = clamp(W * c.size * sizes[i], 150, H * 0.62);
          return { w, h: w * aspects[i], depth: c.depth, rot: rots[i] };
        });
        // Biggest cards choose first; smaller ones fill in around them.
        const order = cards.map((_, i) => i).sort((a, b) => cards[b].w - cards[a].w);
        const placed = placeCards({
          cards: order.map((i) => cards[i]),
          bounds: { l: 0, t: NAV_CLEARANCE, r: W, b: H - 6 },
          zone,
          rand,
          minWidth: Math.max(130, W * 0.085),
        });
        order.forEach((i, k) => {
          const spot = placed[k];
          const el = windows[i];
          el.classList.toggle("is-benched", !spot);
          if (!spot) return;
          el.style.left = `${spot.left.toFixed(1)}px`;
          el.style.top = `${spot.top.toFixed(1)}px`;
          el.style.width = `${spot.width.toFixed(1)}px`;
        });
      }

      // Paint the new composition at rest (guaranteed clear of the zone);
      // the motion loop sees the new version and resumes from here, so no
      // offset from the previous layout is ever carried onto the new one.
      windows.forEach((el, i) => {
        el.querySelector(".hw__inner").style.transform = `rotate(${rots[i].toFixed(2)}deg)`;
      });

      const zc = { x: (zone.l + zone.r) / 2, y: (zone.t + zone.b) / 2 };
      version += 1;
      layoutRef.current = {
        version,
        margin,
        rots,
        base: windows.map((el) => {
          if (el.classList.contains("is-benched") || !el.offsetParent) return null;
          const cx = el.offsetLeft + el.offsetWidth / 2;
          const cy = el.offsetTop + el.offsetHeight / 2;
          const d = Math.hypot(cx - zc.x, cy - zc.y) || 1;
          return { cx, cy, w: el.offsetWidth, h: el.offsetHeight, away: { x: (cx - zc.x) / d, y: (cy - zc.y) / d } };
        }),
      };
      stage.dataset.laidOut = "1";
    };

    layout();
    // ResizeObserver fires after layout and before paint, so re-placing here
    // means no frame is ever drawn with a stale composition.
    const ro = new ResizeObserver(layout);
    ro.observe(stage);
    ro.observe(stage.querySelector(".hero__title"));
    let alive = true;
    document.fonts?.ready.then(() => alive && layout());
    return () => {
      alive = false;
      ro.disconnect();
    };
  }, []);

  // ---- Motion: float, parallax, hover, ball bumps — all inside the guard.
  useEffect(() => {
    if (reduced) return;
    const section = sectionRef.current;
    const stage = stageRef.current;
    const windows = [...section.querySelectorAll(".hw")];
    const inners = windows.map((w) => w.querySelector(".hw__inner"));
    const rows = [...section.querySelectorAll(".hero__row")];
    const parts = nameParts(stage);
    const coord = coordRef.current;
    const state = windows.map(() => ({ x: 0, y: 0, r: 0, rx: 0, ry: 0, s: 1 }));
    const bumps = bumpsRef.current;
    let seen = 0;

    return onFrame((t) => {
      const box = section.getBoundingClientRect();
      if (box.bottom < 0 || box.top > window.innerHeight) return;
      const current = layoutRef.current;
      if (!current) return;
      if (current.version !== seen) {
        // Fresh layout: start every card from its new resting pose.
        seen = current.version;
        state.forEach((st, i) => Object.assign(st, { x: 0, y: 0, r: current.rots[i], rx: 0, ry: 0, s: 1 }));
        bumps.forEach((b) => Object.assign(b, { x: 0, y: 0, r: 0, vx: 0, vy: 0, vr: 0 }));
      }
      const p = clamp(-box.top / box.height);
      const hovered = hoverRef.current;
      const rects = windows.map((w) => w.getBoundingClientRect());
      const hc = hovered >= 0 ? rects[hovered] : null;
      // The live protected zone: where the letters are *this frame*, plus breathing space.
      const name = unionRect(parts, stage.getBoundingClientRect());
      const zone = name && expand(name, current.margin);

      windows.forEach((_, i) => {
        const base = current.base[i];
        if (!base) return;
        const { depth } = WINDOWS[i];
        const rot = current.rots[i];
        const k = 1 + i * 0.19;
        const amp = Math.abs(depth);
        const drift = p * 320 * (0.55 + amp * 0.45); // scrolling carries cards away from the name
        const target = {
          x: Math.sin(t * 0.00041 * k + i * 1.7) * (6 + amp * 8) + pointer.nx * 38 * depth + base.away.x * drift,
          y: Math.cos(t * 0.00033 * k + i) * (8 + amp * 10) + pointer.ny * 26 * depth + base.away.y * drift,
          r: rot + Math.sin(t * 0.00029 * k + i * 2.1) * 1.4,
          rx: 0,
          ry: 0,
          s: 1,
        };

        if (hovered === i) {
          const r = rects[i];
          const lx = (pointer.x - (r.left + r.width / 2)) / r.width;
          const ly = (pointer.y - (r.top + r.height / 2)) / r.height;
          target.ry = clamp(lx, -0.6, 0.6) * 14;
          target.rx = clamp(-ly, -0.6, 0.6) * 10;
          target.r = rot * 0.3;
          target.s = 1.08;
        } else if (hc) {
          // Neighbours make room for the hovered window.
          const r = rects[i];
          const dx = r.left + r.width / 2 - (hc.left + hc.width / 2);
          const dy = r.top + r.height / 2 - (hc.top + hc.height / 2);
          const dist = Math.hypot(dx, dy) || 1;
          const push = 90 * Math.exp(-dist / 520);
          target.x += (dx / dist) * push;
          target.y += (dy / dist) * push;
          target.s = 0.96;
        }

        const s = state[i];
        for (const key in target) s[key] = lerp(s[key], target[key], key === "s" ? 0.12 : 0.075);

        // Ball contact: a stiff, well-damped spring — a nudge, then settle.
        const b = bumps[i];
        b.vx = (b.vx - b.x * 0.14) * 0.8;
        b.vy = (b.vy - b.y * 0.14) * 0.8;
        b.vr = (b.vr - b.r * 0.14) * 0.8;
        b.x += b.vx;
        b.y += b.vy;
        b.r += b.vr;

        // Guard: wherever float, parallax, hover or the ball want this card,
        // it may not enter the protected zone. Push it back out, minimally.
        if (zone) {
          const { hx, hy } = rotatedHalf(base.w, base.h, s.r + b.r, s.s * 1.04);
          const cx = base.cx + s.x + b.x;
          const cy = base.cy + s.y + b.y;
          const { dx, dy } = pushOut({ l: cx - hx, t: cy - hy, r: cx + hx, b: cy + hy }, zone);
          if (dx || dy) {
            s.x += dx;
            s.y += dy;
            if (dx) b.vx = 0;
            if (dy) b.vy = 0;
          }
        }

        inners[i].style.transform =
          `translate3d(${(s.x + b.x).toFixed(2)}px, ${(s.y + b.y).toFixed(2)}px, 0) rotate(${(s.r + b.r).toFixed(2)}deg) ` +
          `rotateX(${s.rx.toFixed(2)}deg) rotateY(${s.ry.toFixed(2)}deg) scale(${s.s.toFixed(3)})`;
      });

      rows[0].style.transform = `translate3d(${(-p * 18).toFixed(2)}vw, 0, 0)`;
      rows[1].style.transform = `translate3d(${(-p * 8).toFixed(2)}vw, 0, 0)`;
      if (pointer.moved && coord) {
        coord.textContent = `x ${(pointer.x / window.innerWidth).toFixed(3)}  y ${(pointer.y / window.innerHeight).toFixed(3)}`;
      }
    });
  }, [reduced]);

  // The struck card is pushed away from the ball and twists about the contact point.
  const onHit = useCallback((i, { nx, ny, speed, along }) => {
    const b = bumpsRef.current[i];
    if (!b) return;
    const k = Math.min(speed, 14) * 0.32;
    b.vx -= nx * k;
    b.vy -= ny * k;
    b.vr += along * Math.sign(-ny || 1) * Math.min(speed, 14) * 0.07;
  }, []);

  const enter = (i) => (e) => {
    hoverRef.current = i;
    e.currentTarget.classList.add("is-hover");
    sectionRef.current.classList.add("has-hover");
  };
  const leave = (e) => {
    hoverRef.current = -1;
    e.currentTarget.classList.remove("is-hover");
    sectionRef.current.classList.remove("has-hover");
  };

  return (
    <section
      id="top"
      ref={sectionRef}
      className={`hero ${ready ? "is-in" : ""} ${live ? "is-live" : ""}`}
      data-theme="light"
      aria-labelledby="hero-title"
    >
      <div className="hero__stage" ref={stageRef}>
        <span className="reg hero__reg hero__reg--tl" aria-hidden="true" />
        <span className="reg hero__reg hero__reg--tr" aria-hidden="true" />
        <span className="reg hero__reg hero__reg--bl" aria-hidden="true" />

        {WINDOWS.map((w, i) => {
          const project = byId[w.id];
          const style = { "--i": i };
          const layer = w.depth < 0 ? "is-back" : "is-front";

          if (!project) {
            return (
              <div key={w.id} className={`hw hw--${w.id} ${layer}`} style={style} data-i={i} aria-hidden="true">
                <div className="hw__inner">
                  <Frame url={w.id === "code" ? "routes/events.js" : "auth · decoded"} tag={w.id === "code" ? "src" : "jwt"}>
                    {w.id === "code" ? <CodeUI /> : <TokenUI />}
                  </Frame>
                </div>
              </div>
            );
          }

          const Schematic = SCHEMATICS[project.id];
          return (
            <a
              key={w.id}
              href={`#work-${project.id}`}
              className={`hw hw--${w.id} ${layer}`}
              style={{ ...style, "--accent": project.accent }}
              data-i={i}
              data-cursor="View project"
              aria-label={`${project.name} — ${project.title}. Jump to the case study.`}
              onPointerEnter={enter(i)}
              onPointerLeave={leave}
            >
              <div className="hw__inner">
                <Frame url={project.url}>
                  <Schematic />
                </Frame>
                <span className="hw__caption mono" aria-hidden="true">
                  <b>fig.{project.index}</b> {project.name} — {project.kind}
                </span>
              </div>
            </a>
          );
        })}

        <h1 className="hero__title" id="hero-title" aria-label={`${person.name}, full-stack developer`}>
          <span className="hero__row hero__row--1 display">
            <Chars text="SWARAJ" step={0.045} delay={0.05} />
          </span>
          <span className="hero__row hero__row--2">
            <span className="serif hero__xavier">
              <Chars text="Xavier" step={0.045} delay={0.3} />
            </span>
            <span className="hero__suna display">
              <Chars text="SUNA" step={0.05} delay={0.6} />
            </span>
          </span>
        </h1>

        {reduced ? (
          <div className="ball ball--rest" aria-hidden="true">
            <span className="ball__spin">
              <BallArt />
            </span>
            <span className="ball__light" />
          </div>
        ) : (
          <Ball stageRef={stageRef} ready={ready} onHit={onHit} />
        )}

        <p className="hero__coord mono" ref={coordRef} aria-hidden="true">
          x 0.500 y 0.500
        </p>
      </div>

      <div className="hero__foot">
        <p className="hero__role mono reveal" style={{ "--r": 4 }}>
          <span>{person.role}</span>
          <span>B.Tech CSE · NIST University ’27</span>
        </p>
        <p className="hero__lede reveal" style={{ "--r": 5 }}>
          I build full-stack web apps — <span className="serif">secure APIs, real-time systems</span> and the
          interfaces that sit on top of them.
        </p>
        <div className="hero__cta reveal" style={{ "--r": 6 }}>
          <a href="#work" className="btn btn--ink" data-magnetic data-cursor="Scroll">
            Selected work <span aria-hidden="true">↓</span>
          </a>
          <p className="hero__status mono">
            <i aria-hidden="true" /> {person.status}
          </p>
        </div>
      </div>
    </section>
  );
}
