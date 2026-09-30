import { useCallback, useEffect, useRef } from "react";
import { person, projects } from "../../data/content";
import { useInView } from "../../hooks/useInView";
import { useInViewReplay } from "../../hooks/useInViewReplay";
import { useReducedMotion } from "../../hooks/useMedia";
import { clamp, ease, lerp, onFrame } from "../../lib/loop";
import { pointer } from "../../lib/pointer";
import Chars from "../ui/Chars";
import Frame from "../ui/Frame";
import { CodeUI, GitUI, HttpUI, MongoUI, TokenUI } from "../ui/Schematics";
import { SCHEMATICS } from "../ui/schematicMap";
import Ball, { BallArt } from "./Ball";
import { clearOf, expand, placeCards, pushOut, rotatedHalf, seeded, unionRect, zoneMargin } from "./layout";
import "./ball.css";
import "./hero.css";

const byId = Object.fromEntries(projects.map((p) => [p.id, p]));

// The hero's world. Large = the three real projects; small = technical
// fragments drawn from them. size = share of the stage width (varied per
// load); depth < 0 sits further away (dimmer, softer). Positions are decided
// at runtime by the placement engine (layout.js).
const WINDOWS = [
  { id: "pulseops", tier: "large", size: 0.34, depth: 0.85 },
  { id: "eleve", tier: "large", size: 0.29, depth: 0.4 },
  { id: "chat", tier: "large", size: 0.25, depth: 0.6 },
  { id: "code", tier: "small", size: 0.15, depth: -0.75, url: "routes/events.js", tag: "src", ui: CodeUI },
  { id: "token", tier: "small", size: 0.12, depth: 1, url: "auth · decoded", tag: "jwt", ui: TokenUI },
  { id: "http", tier: "small", size: 0.11, depth: 0.7, url: "gateway · response", tag: "http", ui: HttpUI },
  { id: "mongo", tier: "small", size: 0.14, depth: -0.45, url: "mongosh · events", tag: "db", ui: MongoUI },
  { id: "git", tier: "small", size: 0.13, depth: 0.35, url: "~/portfolio", tag: "git", ui: GitUI },
];

const NAV_CLEARANCE = 80;
const PERSPECTIVE = 1400;
const SWAP_MS = 1150;
const SWAP_DWELL = 650; // hover this long before a card trades places
const SWAP_COOLDOWN = 2400;

const nameParts = (root) => [
  root.querySelector(".hero__row--1 .chars"),
  root.querySelector(".hero__xavier .chars"),
  root.querySelector(".hero__suna"),
];
const isShown = (el) => getComputedStyle(el).display !== "none";

export default function Hero({ ready }) {
  const sectionRef = useRef(null);
  const hoverRef = useRef(-1);
  const coordRef = useRef(null);
  const stageRef = useRef(null);
  // Spring offsets a card gets when the ball strikes it.
  const bumpsRef = useRef(WINDOWS.map(() => ({ x: 0, y: 0, r: 0, vx: 0, vy: 0, vr: 0 })));
  // The current composition: resting rects, rotations, per-card motion character.
  const layoutRef = useRef(null);
  // Set by the motion loop; called after a hover dwell.
  const swapRef = useRef(null);
  const dwellRef = useRef(0);
  const reduced = useReducedMotion();
  const live = useInView(sectionRef, { once: false, margin: "0px" });
  // The football plays when the hero is meaningfully on screen, and resets when it's gone.
  const heroVisible = useInViewReplay(sectionRef, { threshold: 0.3 });

  // ---- Placement: measure the real name, then scatter the cards in the
  // space above and below it. Re-runs on resize, font load and any change in
  // the name's size. One random seed per page load.
  useEffect(() => {
    const stage = stageRef.current;
    const windows = [...stage.querySelectorAll(".hw")];
    const rows = [...stage.querySelectorAll(".hero__row")];
    const seed = Math.floor(Math.random() * 4294967296);
    let version = 0;

    const layout = () => {
      const rand = seeded(seed);
      // Everything random is drawn from the per-load seed, in a fixed order,
      // so the composition is stable while the visitor interacts or resizes.
      const rots = WINDOWS.map(() => (rand() < 0.5 ? -1 : 1) * (1.5 + rand() * 5.5));
      const sizes = WINDOWS.map(() => 0.88 + rand() * 0.24);
      const speeds = WINDOWS.map(() => 0.65 + rand() * 0.75);
      const phases = WINDOWS.map(() => rand() * Math.PI * 2);
      const delays = WINDOWS.map(() => 0.35 + rand() * 0.7);
      const parallax = WINDOWS.map(() => 0.75 + rand() * 0.5);
      const W = stage.clientWidth;
      const H = stage.clientHeight;
      const scale = W < 1100 ? 0.82 : 1; // tablets: smaller, calmer

      // Measure SWARAJ, Xavier and SUNA at rest (without scroll drift), each
      // grown by the safety margin: three protected rects.
      const drift = rows.map((r) => r.style.transform);
      rows.forEach((r) => (r.style.transform = ""));
      const origin = stage.getBoundingClientRect();
      const words = nameParts(stage).filter(Boolean).map((el) => unionRect([el], origin));
      rows.forEach((r, k) => (r.style.transform = drift[k]));
      if (!words.length) return;
      const margin = zoneMargin(W);
      const zones = words.map((w) => expand(w, margin));
      const zone = {
        l: Math.min(...zones.map((z) => z.l)),
        t: Math.min(...zones.map((z) => z.t)),
        r: Math.max(...zones.map((z) => z.r)),
        b: Math.max(...zones.map((z) => z.b)),
      };
      const bounds = { l: 0, t: NAV_CLEARANCE, r: W, b: H - 6 };
      const mobile = window.matchMedia("(max-width: 760px)").matches;

      windows.forEach((w) => w.classList.remove("is-benched"));
      if (mobile) {
        // Phones use their own composition (hero.css): the name, then the work below it.
        windows.forEach((w) => (w.style.left = w.style.top = w.style.width = ""));
      } else {
        const shown = windows.map(isShown);
        const aspects = windows.map((w) => {
          const f = w.querySelector(".frame");
          return f.offsetHeight / Math.max(1, f.offsetWidth) || 0.69;
        });
        const cards = WINDOWS.map((c, i) => {
          const w = Math.max(c.tier === "large" ? 240 : 120, W * c.size * sizes[i] * scale);
          return {
            w,
            h: w * aspects[i],
            depth: c.depth,
            rot: rots[i],
            tier: c.tier,
            minWidth: c.tier === "large" ? Math.max(230, W * 0.16) : Math.max(110, W * 0.075),
          };
        });
        const visible = cards.map((c, i) => (shown[i] ? i : -1)).filter((i) => i >= 0);
        const placed = placeCards({ cards: visible.map((i) => cards[i]), bounds, zones, rand });
        visible.forEach((i, k) => {
          const spot = placed[k];
          const el = windows[i];
          el.classList.toggle("is-benched", !spot);
          if (!spot) return;
          el.style.left = `${spot.left.toFixed(1)}px`;
          el.style.top = `${spot.top.toFixed(1)}px`;
          el.style.width = `${spot.width.toFixed(1)}px`;
        });
      }

      // Paint the new composition at rest (guaranteed clear of the name);
      // the motion loop sees the new version and resumes from here.
      windows.forEach((el, i) => {
        el.querySelector(".hw__inner").style.transform = `rotate(${rots[i].toFixed(2)}deg)`;
        el.style.transitionDelay = `${delays[i].toFixed(2)}s`;
      });

      version += 1;
      layoutRef.current = {
        version,
        margin,
        rots,
        speeds,
        phases,
        parallax,
        bounds,
        center: { x: (zone.l + zone.r) / 2, y: (zone.t + zone.b) / 2 },
        base: windows.map((el) => {
          if (el.classList.contains("is-benched") || !el.offsetParent) return null;
          return {
            cx: el.offsetLeft + el.offsetWidth / 2,
            cy: el.offsetTop + el.offsetHeight / 2,
            w: el.offsetWidth,
            h: el.offsetHeight,
          };
        }),
      };
    };

    layout();
    // ResizeObserver and resize both run before paint, so no frame is ever
    // drawn with a stale composition.
    const ro = new ResizeObserver(layout);
    window.addEventListener("resize", layout);
    ro.observe(stage);
    ro.observe(stage.querySelector(".hero__title"));
    let alive = true;
    document.fonts?.ready.then(() => alive && layout());
    return () => {
      alive = false;
      ro.disconnect();
      window.removeEventListener("resize", layout);
    };
  }, []);

  // ---- Motion: float, parallax, hover focus, swaps, ball bumps — all inside the guard.
  useEffect(() => {
    if (reduced) return;
    const section = sectionRef.current;
    const stage = stageRef.current;
    const windows = [...section.querySelectorAll(".hw")];
    const inners = windows.map((w) => w.querySelector(".hw__inner"));
    const rows = [...section.querySelectorAll(".hero__row")];
    const parts = nameParts(stage);
    const coord = coordRef.current;
    const state = windows.map(() => ({ x: 0, y: 0, r: 0, rx: 0, ry: 0, s: 1, z: 0 }));
    // Where each card currently "lives", relative to its placed position (changes on swap).
    // `scale` lets a card resize to fit the spot it swaps into.
    const homes = windows.map(() => ({ x: 0, y: 0, scale: 1, tween: null }));
    const bumps = bumpsRef.current;
    const lastPartner = windows.map(() => -1);
    let seen = 0;
    let zones = [];
    let cooldownUntil = 0;
    let swapPointer = null;

    // Trade places with another card — only if both destinations are safe for
    // each card's size and motion, AND a curved flight path exists that never
    // touches the name. One hover, one exchange.
    swapRef.current = (i) => {
      const current = layoutRef.current;
      const now = performance.now();
      if (!current || now < cooldownUntil || homes.some((h) => h.tween)) return;
      if (swapPointer && Math.hypot(pointer.x - swapPointer.x, pointer.y - swapPointer.y) < 24) return;
      if (!current.base[i] || WINDOWS[i].tier !== "large") return;

      const spec = (k, sc = 1) => ({
        w: current.base[k].w * sc,
        h: current.base[k].h * sc,
        rot: current.rots[k],
        depth: WINDOWS[k].depth,
        tier: "large",
      });
      // Largest scale (up to 1, down to 0.55) at which card k can live at p.
      const fit = (k, p) => {
        for (let sc = 1; sc >= 0.55; sc -= 0.05) {
          if (clearOf(spec(k, sc), p.x, p.y, zones, current.bounds)) return sc;
        }
        return 0;
      };
      const at = (k) => ({ x: current.base[k].cx + homes[k].x, y: current.base[k].cy + homes[k].y });

      // A curved route from `from` to `to` for card k that never touches the
      // name: try bows of increasing depth, bowing away from the name first.
      const route = (k, from, to, scaleFrom, scaleTo) => {
        const dx = to.x - from.x;
        const dy = to.y - from.y;
        const len = Math.hypot(dx, dy) || 1;
        let nx = -dy / len;
        let ny = dx / len;
        const mx = (from.x + to.x) / 2;
        const my = (from.y + to.y) / 2;
        if ((mx - current.center.x) * nx + (my - current.center.y) * ny < 0) {
          nx = -nx;
          ny = -ny;
        }
        for (const depth of [0.28, 0.45, -0.28, 0.7, -0.5]) {
          const amp = Math.min(260, len * Math.abs(depth)) * Math.sign(depth);
          let clear = true;
          for (let u = 0; u <= 1.001 && clear; u += 0.08) {
            const e = ease(u);
            const bow = Math.sin(Math.PI * e);
            const sc = lerp(scaleFrom, scaleTo, e) * (1 - bow * 0.07);
            const { hx, hy } = rotatedHalf(current.base[k].w, current.base[k].h, current.rots[k], sc * 1.04);
            const cx = lerp(from.x, to.x, e) + nx * amp * bow;
            const cy = lerp(from.y, to.y, e) + ny * amp * bow;
            const box = { l: cx - hx, t: cy - hy, r: cx + hx, b: cy + hy };
            clear = !zones.some((z) => box.l < z.r && box.r > z.l && box.t < z.b && box.b > z.t);
          }
          if (clear) return { x: nx * amp, y: ny * amp };
        }
        return null;
      };

      const shuffled = (list) => list.sort(() => Math.random() - 0.5);
      const candidates = (tier) =>
        shuffled(
          WINDOWS.map((w, k) => k).filter(
            (k) => k !== i && WINDOWS[k].tier === tier && current.base[k] && k !== lastPartner[i]
          )
        );

      // Project cards first; if none can reach, a small fragment in the same space.
      for (const j of [...candidates("large"), ...candidates("small")]) {
        const pa = at(i);
        const pb = at(j);
        const scaleI = fit(i, pb);
        const scaleJ = WINDOWS[j].tier === "large" ? fit(j, pa) : clearOf({ ...spec(j), tier: "small" }, pa.x, pa.y, zones, current.bounds) ? 1 : 0;
        if (!scaleI || !scaleJ) continue;
        const arcI = route(i, pa, pb, homes[i].scale, scaleI);
        const arcJ = arcI && route(j, pb, pa, homes[j].scale, scaleJ);
        if (!arcI || !arcJ) continue;

        const start = (k, to, arc, lift, scaleTo) => {
          const base = current.base[k];
          homes[k].tween = {
            t0: now,
            from: { x: homes[k].x, y: homes[k].y },
            to: { x: to.x - base.cx, y: to.y - base.cy },
            arc,
            scaleFrom: homes[k].scale,
            scaleTo,
          };
          windows[k].style.zIndex = lift;
          windows[k].classList.add("is-swapping");
        };
        start(i, pb, arcI, 7, scaleI);
        start(j, pa, arcJ, 6, scaleJ);
        lastPartner[i] = j;
        lastPartner[j] = i;
        cooldownUntil = now + SWAP_COOLDOWN;
        swapPointer = { x: pointer.x, y: pointer.y };
        return;
      }
    };

    const stop = onFrame((t) => {
      const box = section.getBoundingClientRect();
      if (box.bottom < 0 || box.top > window.innerHeight) return;
      const current = layoutRef.current;
      if (!current) return;
      if (current.version !== seen) {
        // Fresh layout: every card starts from its new resting pose.
        seen = current.version;
        state.forEach((st, i) => Object.assign(st, { x: 0, y: 0, r: current.rots[i], rx: 0, ry: 0, s: 1, z: 0 }));
        homes.forEach((h, i) => {
          Object.assign(h, { x: 0, y: 0, scale: 1, tween: null });
          windows[i].style.zIndex = "";
          windows[i].classList.remove("is-swapping");
        });
        bumps.forEach((b) => Object.assign(b, { x: 0, y: 0, r: 0, vx: 0, vy: 0, vr: 0 }));
      }
      const p = clamp(-box.top / box.height);
      const hovered = hoverRef.current;
      const rects = windows.map((w) => w.getBoundingClientRect());
      const hc = hovered >= 0 ? rects[hovered] : null;
      // The live protected rects: where each word is *this frame*, plus breathing space.
      const origin = stage.getBoundingClientRect();
      zones = parts.filter(Boolean).map((el) => expand(unionRect([el], origin), current.margin));

      windows.forEach((_, i) => {
        const base = current.base[i];
        if (!base) return;
        const { depth } = WINDOWS[i];
        const rot = current.rots[i];
        const k = current.speeds[i];
        const ph = current.phases[i];
        const par = current.parallax[i];
        const amp = Math.abs(depth);

        // Swap travel: eased along a curve, dipping in scale mid-flight.
        const home = homes[i];
        let arcLift = 0;
        if (home.tween) {
          const tw = home.tween;
          const u = clamp((t - tw.t0) / SWAP_MS);
          const e = ease(u);
          const bow = Math.sin(Math.PI * e);
          home.x = lerp(tw.from.x, tw.to.x, e) + tw.arc.x * bow;
          home.y = lerp(tw.from.y, tw.to.y, e) + tw.arc.y * bow;
          home.scale = lerp(tw.scaleFrom, tw.scaleTo, e);
          arcLift = bow;
          if (u >= 1) {
            home.x = tw.to.x;
            home.y = tw.to.y;
            home.scale = tw.scaleTo;
            home.tween = null;
            windows[i].style.zIndex = "";
            windows[i].classList.remove("is-swapping");
          }
        }
        const hx0 = base.cx + home.x;
        const hy0 = base.cy + home.y;
        const dAway = Math.hypot(hx0 - current.center.x, hy0 - current.center.y) || 1;
        const drift = p * 320 * (0.55 + amp * 0.45); // scrolling carries cards away from the name

        // Each card: its own speed, phase and two-frequency drift — never one shared bob.
        const target = {
          x:
            Math.sin(t * 0.00041 * k + ph) * (4 + amp * 5) +
            Math.sin(t * 0.00017 * k + ph * 2.3) * 2 +
            pointer.nx * 24 * depth * par +
            ((hx0 - current.center.x) / dAway) * drift,
          y:
            Math.cos(t * 0.00033 * k + ph * 1.3) * (3 + amp * 3.5) +
            Math.sin(t * 0.00021 * k + ph) * 1.5 +
            pointer.ny * 10 * depth * par +
            ((hy0 - current.center.y) / dAway) * drift,
          r: rot + Math.sin(t * 0.00029 * k + ph * 0.7) * 1.4 + arcLift * 4 * Math.sign(rot),
          rx: 0,
          ry: 0,
          s: 1 - arcLift * 0.07,
          z: 0,
        };

        if (hovered === i) {
          // Focus: forward, larger, tilting toward the cursor.
          const r = rects[i];
          const lx = (pointer.x - (r.left + r.width / 2)) / r.width;
          const ly = (pointer.y - (r.top + r.height / 2)) / r.height;
          target.ry = clamp(lx, -0.6, 0.6) * 12;
          target.rx = clamp(-ly, -0.6, 0.6) * 9;
          target.r = rot * 0.3;
          target.s = 1.06;
          target.z = 50;
        } else if (hc) {
          // Everyone else steps back and makes a little room.
          const r = rects[i];
          const dx = r.left + r.width / 2 - (hc.left + hc.width / 2);
          const dy = r.top + r.height / 2 - (hc.top + hc.height / 2);
          const dist = Math.hypot(dx, dy) || 1;
          const push = 60 * Math.exp(-dist / 520);
          target.x += (dx / dist) * push;
          target.y += (dy / dist) * push;
          target.s = 0.97;
          target.z = -40;
        }

        const s = state[i];
        for (const key in target) s[key] = lerp(s[key], target[key], key === "s" || key === "z" ? 0.12 : 0.075);

        // Ball contact: a stiff, well-damped spring — a nudge, a little bounce, then settle.
        const b = bumps[i];
        b.vx = (b.vx - b.x * 0.14) * 0.8;
        b.vy = (b.vy - b.y * 0.14) * 0.8;
        b.vr = (b.vr - b.r * 0.14) * 0.8;
        b.x += b.vx;
        b.y += b.vy;
        b.r += b.vr;

        // Guard: wherever float, parallax, hover, a swap or the ball want this
        // card, it may not enter the protected rects. Push it back out, minimally.
        if (zones.length) {
          const depthScale = PERSPECTIVE / (PERSPECTIVE - Math.max(0, s.z));
          const { hx, hy } = rotatedHalf(base.w, base.h, s.r + b.r, s.s * home.scale * depthScale * 1.04);
          const cx = hx0 + s.x + b.x;
          const cy = hy0 + s.y + b.y;
          const { dx, dy } = pushOut({ l: cx - hx, t: cy - hy, r: cx + hx, b: cy + hy }, zones);
          if (dx || dy) {
            s.x += dx;
            s.y += dy;
            if (dx) b.vx = 0;
            if (dy) b.vy = 0;
          }
        }

        inners[i].style.transform =
          `translate3d(${(home.x + s.x + b.x).toFixed(2)}px, ${(home.y + s.y + b.y).toFixed(2)}px, ${s.z.toFixed(1)}px) ` +
          `rotate(${(s.r + b.r).toFixed(2)}deg) rotateX(${s.rx.toFixed(2)}deg) rotateY(${s.ry.toFixed(2)}deg) scale(${(s.s * home.scale).toFixed(3)})`;
      });

      rows[0].style.transform = `translate3d(${(-p * 18).toFixed(2)}vw, 0, 0)`;
      rows[1].style.transform = `translate3d(${(p * 14).toFixed(2)}vw, 0, 0)`;
      if (pointer.moved && coord) {
        coord.textContent = `x ${(pointer.x / window.innerWidth).toFixed(3)}  y ${(pointer.y / window.innerHeight).toFixed(3)}`;
      }
    });

    return () => {
      stop();
      swapRef.current = null;
      clearTimeout(dwellRef.current);
    };
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
    clearTimeout(dwellRef.current);
    // A deliberate hover (mouse only) earns one spatial response: a swap.
    if (e.pointerType === "mouse" && WINDOWS[i].tier === "large") {
      dwellRef.current = setTimeout(() => swapRef.current?.(i), SWAP_DWELL);
    }
  };
  const leave = (e) => {
    hoverRef.current = -1;
    clearTimeout(dwellRef.current);
    e.currentTarget.classList.remove("is-hover");
    sectionRef.current.classList.remove("has-hover");
  };

  return (
    <section
      id="top"
      ref={sectionRef}
      className={`hero ${ready ? "is-in" : ""} ${live ? "is-live" : ""}`}
      data-theme="dark"
      aria-labelledby="hero-title"
    >
      <div className="hero__atmos" aria-hidden="true" />
      <div className="hero__stage" ref={stageRef}>
        <span className="reg hero__reg hero__reg--tl" aria-hidden="true" />
        <span className="reg hero__reg hero__reg--tr" aria-hidden="true" />
        <span className="reg hero__reg hero__reg--bl" aria-hidden="true" />

        {WINDOWS.map((w, i) => {
          const project = byId[w.id];
          const style = { "--i": i };
          const layer = `${w.depth < 0 ? "is-back" : "is-front"} is-${w.tier}`;

          if (!project) {
            const UI = w.ui;
            return (
              <div key={w.id} className={`hw hw--${w.id} ${layer}`} style={style} data-i={i} aria-hidden="true">
                <div className="hw__inner">
                  <Frame url={w.url} tag={w.tag}>
                    <UI />
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
                {/* Revealed on hover — inside the card, so it can never reach the name. */}
                <span className="hw__info" aria-hidden="true">
                  <span className="hw__info-top mono">
                    <b>{project.index}</b> {project.kind}
                  </span>
                  <span className="hw__info-name">{project.name}</span>
                  <span className="hw__info-stack mono">{project.stack.slice(0, 4).join(" · ")}</span>
                  <span className="hw__info-cta mono">Case study ↘</span>
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
          <Ball stageRef={stageRef} ready={ready} visible={heroVisible} onHit={onHit} />
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
          <a href="#work" className="btn btn--ivory" data-magnetic data-cursor="Scroll">
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
