import { useEffect, useRef } from "react";
import { onFrame } from "../../lib/loop";
import { pointer } from "../../lib/pointer";
import { expand, unionRect, zoneMargin } from "./layout";

/**
 * The hidden signature: a football that plays through the hero.
 *
 * Lightweight physics (gravity, drag, restitution, rolling friction, spin
 * from velocity, a touch of curl). The name's protected rects — the same
 * ones the cards obey — deflect the ball and are never somewhere it can
 * rest, so it can never cross the letters. Front project cards are solid;
 * each contact is reported through onHit so the card can react.
 *
 * Lifecycle, tied to the hero's visibility:
 *   idle → entering → active → exiting → idle
 * First visit: a lob onto the PulseOps card. Leave the hero: reset.
 * Come back: the ball rises from the bottom in one of three sequences.
 */

// Launch profiles, in units of stage width (w) / height (h) per frame at 60fps.
const FIRST = { kind: "lob", aim: ".hw--pulseops .frame", along: 0.6 };
const FIRST_MOBILE = { kind: "roll", x: 1.05, y: 0.94, vx: -0.011, vy: -0.004 };
const RETURNS = ["bottom-aim", "bottom-chip", "bottom-curve"];

const FIRST_DELAY = 2600; // after the name and cards have settled
const RETURN_DELAY = 380;
const MAX_LIFETIME = 11000;
const EXIT_MS = 420;

export default function Ball({ stageRef, ready, visible, onHit }) {
  const ballRef = useRef(null);
  const spinRef = useRef(null);
  const shadowRef = useRef(null);
  const canvasRef = useRef(null);
  const visibleRef = useRef(false);

  useEffect(() => {
    visibleRef.current = visible;
  }, [visible]);

  useEffect(() => {
    if (!ready) return;
    const stage = stageRef.current;
    const ball = ballRef.current;
    const spin = spinRef.current;
    const shadow = shadowRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const mobile = window.matchMedia("(max-width: 760px)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const s = { x: 0, y: 0, vx: 0, vy: 0, angle: 0, spin: 0, curl: 0, born: 0, r: 16 };
    const trail = [];
    let phase = "idle"; // idle | entering | active | exiting
    let startAt = 0; // when the next sequence launches (0 = none scheduled)
    let exitAt = 0;
    let spent = false; // this visit's sequence has played
    let returning = false; // the visitor has left the hero at least once
    let wasVisible = false;
    let lastReturn = "";
    let W = 0;
    let H = 0;
    let margin = 24;
    let lastHit = new Map(); // card -> timestamp, so one contact = one reaction

    const gravity = () => H * 0.00062;
    const size = () => {
      W = stage.clientWidth;
      H = stage.clientHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      s.r = Math.max(12, Math.min(W * 0.0135, 21));
      margin = zoneMargin(W);
      ball.style.width = ball.style.height = `${s.r * 2}px`;
      shadow.style.setProperty("--ball-d", `${s.r * 2}px`);
    };
    size();
    window.addEventListener("resize", size);

    // The name's protected rects deflect; front cards are solid. Back cards
    // are "further away", so the ball passes in front of them.
    const collect = () => {
      const origin = stage.getBoundingClientRect();
      const local = (el) => {
        const r = el.getBoundingClientRect();
        return { l: r.left - origin.left, t: r.top - origin.top, r: r.right - origin.left, b: r.bottom - origin.top };
      };
      const name = [
        stage.querySelector(".hero__row--1 .chars"),
        stage.querySelector(".hero__xavier .chars"),
        stage.querySelector(".hero__suna"),
      ]
        .filter(Boolean)
        .map((el) => ({ ...expand(unionRect([el], origin), margin), kind: "zone" }));
      const cards = [...stage.querySelectorAll(".hw.is-front")]
        .filter((el) => el.offsetParent)
        .map((el) => ({ ...local(el.querySelector(".frame")), kind: "card", i: Number(el.dataset.i) }));
      return [...name, ...cards];
    };

    const nameBottom = () => Math.max(0, ...collect().filter((o) => o.kind === "zone").map((z) => z.b));

    // Solve a projectile from (x, y) that lands on (tx, ty) after T frames.
    const aimAt = (x, y, tx, ty, T) => ({ vx: (tx - x) / T, vy: (ty - y - 0.5 * gravity() * T * T) / T });

    const begin = (x, y, vx, vy, extra = {}) => {
      Object.assign(s, { x, y, vx, vy, spin: vx * 0.02, curl: 0, born: performance.now(), ...extra });
      trail.length = 0;
      lastHit = new Map();
      phase = extra.fromBelow ? "entering" : "active";
      ball.classList.add("is-active");
      shadow.classList.add("is-active");
    };

    // First visit: a lob from the nearer side onto the PulseOps card.
    const launchFirst = () => {
      if (mobile) {
        const f = FIRST_MOBILE;
        begin(f.x * W, f.y * H, f.vx * W, f.vy * H);
        return;
      }
      const target = stage.querySelector(FIRST.aim);
      if (!target || !target.offsetParent) return launchReturn();
      const origin = stage.getBoundingClientRect();
      const r = target.getBoundingClientRect();
      const tx = r.left - origin.left + r.width * FIRST.along;
      const ty = r.top - origin.top - s.r;
      const nb = nameBottom();
      const y = ty > nb ? nb + s.r * 2 + (ty - nb) * 0.2 : Math.min(ty - s.r, Math.max(90, H * 0.1));
      const x = tx > W / 2 ? W + s.r * 2 : -s.r * 2;
      const T = Math.min(70, Math.max(28, Math.abs(tx - x) / 11));
      const v = aimAt(x, y, tx, ty, T);
      begin(x, y, v.vx, v.vy);
    };

    // Returning: the ball rises from the bottom edge — a different sequence each time.
    const launchReturn = () => {
      const options = RETURNS.filter((k) => k !== lastReturn);
      let kind = options[Math.floor(Math.random() * options.length)];
      const y0 = H + s.r * 2;
      const g = gravity();
      const room = Math.max(120, H - nameBottom() - s.r * 2); // height of the space under the name
      const rise = (h) => -Math.sqrt(2 * g * (h + s.r * 3));

      if (kind === "bottom-aim") {
        const origin = stage.getBoundingClientRect();
        const nb = nameBottom();
        const cards = [...stage.querySelectorAll(".hw.is-front")]
          .filter((el) => el.offsetParent)
          .map((el) => el.querySelector(".frame").getBoundingClientRect())
          .filter((r) => r.top - origin.top > nb);
        if (cards.length) {
          const r = cards[Math.floor(Math.random() * cards.length)];
          const tx = r.left - origin.left + r.width * (0.25 + Math.random() * 0.5);
          const ty = r.top - origin.top - s.r;
          const x0 = Math.min(W * 0.9, Math.max(W * 0.1, tx + (Math.random() < 0.5 ? -1 : 1) * W * 0.18));
          const T = 44 + Math.random() * 12;
          const v = aimAt(x0, y0, tx, ty, T);
          lastReturn = kind;
          return begin(x0, y0, v.vx, v.vy, { fromBelow: true });
        }
        kind = "bottom-curve";
      }

      if (kind === "bottom-chip") {
        const left = Math.random() < 0.5;
        const x0 = W * (left ? 0.08 : 0.92);
        lastReturn = kind;
        return begin(x0, y0, (left ? 1 : -1) * W * (0.0035 + Math.random() * 0.0015), rise(room * 0.45), {
          fromBelow: true,
        });
      }

      // bottom-curve: struck with side-spin, so it bends as it rises.
      const x0 = W * (0.25 + Math.random() * 0.5);
      const dir = Math.random() < 0.5 ? -1 : 1;
      lastReturn = "bottom-curve";
      begin(x0, y0, dir * W * 0.0022, rise(room * 0.6), { fromBelow: true, curl: -dir * W * 0.00005 });
    };

    // Leaving the hero: everything goes back to idle, ready for the next visit.
    const reset = () => {
      phase = "idle";
      startAt = 0;
      exitAt = 0;
      trail.length = 0;
      ball.classList.remove("is-active");
      shadow.classList.remove("is-active");
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    const retire = (now) => {
      phase = "exiting";
      exitAt = now + EXIT_MS;
      spent = true;
      ball.classList.remove("is-active");
      shadow.classList.remove("is-active");
    };

    // Tap / click kicks the ball away from the pointer.
    const kick = (e) => {
      if (phase !== "active") return;
      const box = stage.getBoundingClientRect();
      const dx = s.x - (e.clientX - box.left);
      const dir = dx === 0 ? (Math.random() > 0.5 ? 1 : -1) : Math.sign(dx);
      s.vx = dir * W * 0.0085;
      s.vy = -H * 0.016;
      s.spin = s.vx * 0.05;
      s.born = performance.now(); // a fresh kick earns a fresh lifetime
    };
    ball.addEventListener("pointerdown", kick);

    const collide = (box, now) => {
      const cx = Math.max(box.l, Math.min(s.x, box.r));
      const cy = Math.max(box.t, Math.min(s.y, box.b));
      let nx = s.x - cx;
      let ny = s.y - cy;
      const dist = Math.hypot(nx, ny);
      if (dist >= s.r) return;

      if (dist === 0) {
        // Centre inside the box: leave by the nearest side.
        const out = [
          [s.x - box.l, -1, 0],
          [box.r - s.x, 1, 0],
          [s.y - box.t, 0, -1],
          [box.b - s.y, 0, 1],
        ].sort((a, b) => a[0] - b[0])[0];
        nx = out[1];
        ny = out[2];
        s.x += nx * (out[0] + s.r);
        s.y += ny * (out[0] + s.r);
      } else {
        nx /= dist;
        ny /= dist;
        s.x = cx + nx * s.r;
        s.y = cy + ny * s.r;
      }

      if (ny < -0.6) {
        if (box.kind === "zone") s.onZone = true;
        else s.supported = true; // resting on a card's top
      }
      const vn = s.vx * nx + s.vy * ny;
      if (vn >= 0) return;
      const impact = vn < -1;
      const e = box.kind === "zone" ? 0.72 : impact ? 0.6 : 0; // the name's zone is springy; cards absorb
      s.vx -= (1 + e) * vn * nx;
      s.vy -= (1 + e) * vn * ny;
      const tx = -ny;
      const ty = nx;
      const vt = s.vx * tx + s.vy * ty;
      if (impact) {
        s.vx -= vt * 0.12 * tx;
        s.vy -= vt * 0.12 * ty;
      }
      s.spin = vt / s.r;
      s.curl = 0; // contact kills the curl

      if (impact && box.kind === "card" && now - (lastHit.get(box.i) ?? 0) > 250) {
        lastHit.set(box.i, now);
        // Where along the card it was struck, -1 (left) … 1 (right), drives the twist.
        const along = ((s.x - box.l) / (box.r - box.l)) * 2 - 1;
        onHit(box.i, { nx, ny, speed: -vn, along });
      }
    };

    const drawTrail = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      if (trail.length < 2) return;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.setLineDash([2, 5]);
      for (let i = 1; i < trail.length; i++) {
        const a = trail[i - 1];
        const b = trail[i];
        const k = i / trail.length;
        ctx.strokeStyle = `rgba(239, 233, 220, ${(k * 0.4 * b.life).toFixed(3)})`;
        ctx.lineWidth = 1 + k * 1.2;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    };

    let last = performance.now();
    const stop = onFrame((now) => {
      const dt = Math.min((now - last) / 16.67, 2.5);
      last = now;
      const vis = visibleRef.current && !document.hidden;

      // Visibility transitions drive the lifecycle.
      if (vis !== wasVisible) {
        wasVisible = vis;
        if (vis) {
          if (!spent && phase === "idle") startAt = now + (returning ? RETURN_DELAY : FIRST_DELAY);
        } else {
          reset();
          spent = false;
          returning = true;
        }
      }
      if (!vis) return;

      // Fade the trail even when the ball has gone.
      for (const p of trail) p.life -= 0.012 * dt;
      while (trail.length && trail[0].life <= 0) trail.shift();

      if (phase === "idle" || phase === "exiting") {
        if (phase === "exiting" && now >= exitAt) phase = "idle";
        if (phase === "idle" && startAt && now >= startAt) {
          startAt = 0;
          if (returning) launchReturn();
          else launchFirst();
        }
        drawTrail();
        if (phase === "idle" || phase === "exiting") return;
      }

      const box = stage.getBoundingClientRect();
      const g = gravity();
      const floor = H - s.r - 2;
      const obstacles = collect();
      const steps = 3;
      const h = dt / steps;

      for (let k = 0; k < steps; k++) {
        // Cursor nearby leans on the ball — a touch, not a force field.
        if (pointer.moved) {
          const px = pointer.x - box.left;
          const py = pointer.y - box.top;
          const dx = s.x - px;
          const dy = s.y - py;
          const d = Math.hypot(dx, dy);
          if (d < 130 && d > 1) {
            const f = (1 - d / 130) * 0.28 * h;
            s.vx += (dx / d) * f;
            s.vy += (dy / d) * f;
          }
        }

        s.vy += g * h;
        s.vx += s.curl * h; // side-spin bends the flight
        s.curl *= 1 - 0.01 * h;
        s.vx *= 1 - 0.0016 * h;
        s.vy *= 1 - 0.0016 * h;
        s.x += s.vx * h;
        s.y += s.vy * h;

        // Entering from below: the floor switches on once the ball is above it.
        if (phase === "entering" && s.y < floor - s.r) phase = "active";

        // The stage floor is the touchline: bounce, then roll.
        s.grounded = false;
        s.supported = false;
        s.onZone = false;
        if (phase === "active" && s.y > floor) {
          s.y = floor;
          if (s.vy > 1.4) {
            s.vy = -s.vy * 0.58;
            s.vx *= 0.94;
            s.curl = 0;
          } else {
            s.vy = 0;
            s.grounded = true;
            s.vx *= 1 - 0.0016 * h;
          }
        }

        for (const o of obstacles) collide(o, now);

        // Card tops are never perfectly level: a slow ball keeps rolling and drops off the edge.
        if (s.supported && Math.abs(s.vx) < 1.4) {
          s.vx += (Math.sign(s.vx) || -1) * 0.09 * h;
          s.spin = s.vx / s.r;
        }
        // The space right above a word is never somewhere to rest: it sheds the ball.
        if (s.onZone) {
          s.vx += (Math.sign(s.vx) || -1) * 0.34 * h;
          s.spin = s.vx / s.r;
        }
      }

      // Rolling ties spin to speed; in flight spin slowly decays.
      if (s.grounded) s.spin = s.vx / s.r;
      else s.spin *= 0.995;
      s.angle += s.spin * dt;

      trail.push({ x: s.x, y: s.y, life: 1 });
      if (trail.length > (mobile ? 18 : 42)) trail.shift();
      drawTrail();

      ball.style.transform = `translate3d(${(s.x - s.r).toFixed(1)}px, ${(s.y - s.r).toFixed(1)}px, 0)`;
      spin.style.transform = `rotate(${s.angle.toFixed(3)}rad)`;
      const height = Math.max(0, floor - s.y);
      const near = Math.max(0, 1 - height / (H * 0.6));
      shadow.style.transform = `translate3d(${(s.x - s.r).toFixed(1)}px, 0, 0) scale(${(0.5 + near * 0.6).toFixed(3)}, 1)`;
      shadow.style.opacity = (near * 0.5).toFixed(3);

      const gone = s.x < -s.r * 4 || s.x > W + s.r * 4 || (phase === "active" && s.y > H + s.r * 4);
      const sankBack = phase === "entering" && s.vy > 0 && s.y > H + s.r * 3;
      const tired = now - s.born > MAX_LIFETIME || (s.grounded && Math.abs(s.vx) < 0.15);
      if (gone || sankBack) retire(now);
      else if (tired) {
        // Rather than stopping dead, it trickles off the nearest touchline.
        s.vx += Math.sign(s.x - W / 2 || 1) * 0.06 * dt;
        if (now - s.born > MAX_LIFETIME + 6000) retire(now);
      }
    });

    return () => {
      stop();
      window.removeEventListener("resize", size);
      ball.removeEventListener("pointerdown", kick);
    };
  }, [ready, stageRef, onHit]);

  return (
    <>
      <canvas className="ball-trail" ref={canvasRef} aria-hidden="true" />
      <span className="ball-shadow" ref={shadowRef} aria-hidden="true" />
      <div className="ball" ref={ballRef} data-cursor="Kick it — I play too" aria-hidden="true">
        <span className="ball__spin" ref={spinRef}>
          <BallArt />
        </span>
        <span className="ball__light" />
      </div>
    </>
  );
}

/** A monochrome, geometric ball: one central panel, five cut panels, stitched seams. */
export function BallArt() {
  const outer = [0, 72, 144, 216, 288];
  const pt = (deg, r) => {
    const a = ((deg - 90) * Math.PI) / 180;
    return [50 + Math.cos(a) * r, 50 + Math.sin(a) * r];
  };
  const pentagon = (cx, cy, r, rot) =>
    outer
      .map((d) => {
        const a = ((d + rot - 90) * Math.PI) / 180;
        return `${(cx + Math.cos(a) * r).toFixed(2)},${(cy + Math.sin(a) * r).toFixed(2)}`;
      })
      .join(" ");

  return (
    <svg viewBox="0 0 100 100" className="ball__art">
      <defs>
        <clipPath id="ball-clip">
          <circle cx="50" cy="50" r="48" />
        </clipPath>
      </defs>
      <circle cx="50" cy="50" r="48" fill="var(--ball-fill)" />
      <g clipPath="url(#ball-clip)" stroke="var(--ball-ink)" strokeWidth="1.6" strokeLinejoin="round">
        <polygon points={pentagon(50, 50, 15, 0)} fill="var(--ball-ink)" />
        {outer.map((d) => {
          const [x, y] = pt(d + 36, 47);
          const [sx, sy] = pt(d, 15);
          const [ex, ey] = pt(d, 32);
          return (
            <g key={d}>
              <line x1={sx} y1={sy} x2={ex} y2={ey} />
              <polygon points={pentagon(x, y, 15, d + 36 + 180)} fill="var(--ball-ink)" />
            </g>
          );
        })}
        {outer.map((d) => {
          const [ax, ay] = pt(d, 32);
          const [bx, by] = pt(d + 72, 32);
          return <line key={`s${d}`} x1={ax} y1={ay} x2={bx} y2={by} fill="none" />;
        })}
      </g>
      <circle cx="50" cy="50" r="48" fill="none" stroke="var(--ball-ink)" strokeWidth="2" />
    </svg>
  );
}
