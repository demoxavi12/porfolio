import { useEffect, useRef } from "react";
import { onFrame } from "../../lib/loop";
import { pointer } from "../../lib/pointer";

/**
 * The hidden signature: a football that plays through the hero.
 *
 * Lightweight physics (gravity, drag, restitution, rolling friction, spin
 * from velocity). The letters of the name are solid obstacles, so the ball
 * can never sit on top of them. Front project cards are obstacles too, and
 * each contact is reported through onHit so the card can react.
 *
 * One pass shortly after the hero settles, then at most two different,
 * quieter passes much later — never the same replay on a loop.
 */

// Launch profiles, in units of stage width (w) / height (h) per frame at 60fps.
const DESKTOP_PASSES = [
  // Lofted in from the top right, aimed to drop onto the PulseOps card; from
  // there physics takes it — usually a skip along the top of the name.
  { x: 1.01, y: 0.12, aim: ".hw--pulseops .frame", along: 0.7, frames: 30 },
  // A driven ground pass from the left, under the name.
  { x: -0.03, y: 0.9, vx: 0.0058, vy: -0.004 },
  // Chipped in from the right, low.
  { x: 1.03, y: 0.82, vx: -0.0052, vy: -0.011 },
];
const MOBILE_PASSES = [
  { x: 1.05, y: 0.94, vx: -0.011, vy: -0.004 },
  { x: -0.05, y: 0.94, vx: 0.01, vy: -0.006 },
];

const FIRST_DELAY = 2600; // after the name and cards have settled
const LATER_DELAY = [28000, 46000];
const MAX_LIFETIME = 11000;

export default function Ball({ stageRef, ready, onHit }) {
  const ballRef = useRef(null);
  const spinRef = useRef(null);
  const shadowRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!ready) return;
    const stage = stageRef.current;
    const ball = ballRef.current;
    const spin = spinRef.current;
    const shadow = shadowRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const mobile = window.matchMedia("(max-width: 760px)").matches;
    const passes = mobile ? MOBILE_PASSES : DESKTOP_PASSES;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const s = { active: false, x: 0, y: 0, vx: 0, vy: 0, angle: 0, spin: 0, born: 0, r: 16, grounded: false, supported: false };
    const trail = [];
    let pass = 0;
    let nextAt = performance.now() + FIRST_DELAY;
    let W = 0;
    let H = 0;
    let lastHit = new Map(); // card -> timestamp, so one contact = one reaction

    const gravity = () => H * 0.00062;
    let capInset = 0;
    const size = () => {
      W = stage.clientWidth;
      H = stage.clientHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      s.r = Math.max(12, Math.min(W * 0.0135, 21));
      const row = stage.querySelector(".hero__row--1");
      capInset = row ? parseFloat(getComputedStyle(row).fontSize) * 0.065 : 0;
      ball.style.width = ball.style.height = `${s.r * 2}px`;
      shadow.style.setProperty("--ball-d", `${s.r * 2}px`);
    };
    size();
    window.addEventListener("resize", size);

    const launch = (profile) => {
      let vx = (profile.vx ?? -0.006) * W;
      let vy = (profile.vy ?? 0) * H;
      const x = profile.x * W + (profile.x > 1 ? s.r * 2 : 0);
      const y = profile.y * H;
      const target = profile.aim && stage.querySelector(profile.aim);
      if (target && target.offsetParent) {
        // Solve the projectile so it lands on the target's top edge in `frames`.
        const origin = stage.getBoundingClientRect();
        const r = target.getBoundingClientRect();
        const tx = r.left - origin.left + r.width * profile.along;
        const ty = r.top - origin.top - s.r;
        const T = profile.frames;
        vx = (tx - x) / T;
        vy = (ty - y - 0.5 * gravity() * T * T) / T;
      }
      Object.assign(s, {
        active: true,
        x,
        y,
        vx,
        vy,
        spin: vx * 0.02,
        born: performance.now(),
        grounded: false,
      });
      s.y = Math.min(s.y, H - s.r);
      trail.length = 0;
      lastHit = new Map();
      ball.classList.add("is-active");
      shadow.classList.add("is-active");
    };

    const retire = (now) => {
      s.active = false;
      ball.classList.remove("is-active");
      shadow.classList.remove("is-active");
      pass += 1;
      if (pass < passes.length) {
        nextAt = now + LATER_DELAY[0] + Math.random() * (LATER_DELAY[1] - LATER_DELAY[0]);
      } else {
        nextAt = Infinity;
      }
    };

    // Tap / click kicks the ball away from the pointer.
    const kick = (e) => {
      if (!s.active) return;
      const box = stage.getBoundingClientRect();
      const dx = s.x - (e.clientX - box.left);
      const dir = dx === 0 ? (Math.random() > 0.5 ? 1 : -1) : Math.sign(dx);
      s.vx = dir * W * 0.0085;
      s.vy = -H * 0.016;
      s.spin = s.vx * 0.05;
      s.grounded = false;
      s.born = performance.now(); // a fresh kick earns a fresh lifetime
    };
    ball.addEventListener("pointerdown", kick);

    // Name letters: solid. Only front cards collide — back cards are "further away".
    const collect = () => {
      const origin = stage.getBoundingClientRect();
      const local = (el, pad = 0) => {
        const r = el.getBoundingClientRect();
        return {
          l: r.left - origin.left - pad,
          t: r.top - origin.top - pad,
          r: r.right - origin.left + pad,
          b: r.bottom - origin.top + pad,
        };
      };
      // Letter boxes include line-height above the capitals; trim it so the
      // ball rolls on the cap line rather than floating above it.
      const name = [
        [stage.querySelector(".hero__row--1 .chars"), capInset],
        [stage.querySelector(".hero__xavier .chars"), 0],
        [stage.querySelector(".hero__suna"), 0],
      ]
        .filter(([el]) => el)
        .map(([el, inset]) => {
          const box = local(el, 3);
          return { ...box, t: box.t + inset, kind: "name" };
        });
      const cards = [...stage.querySelectorAll(".hw.is-front")]
        .filter((el) => el.offsetParent)
        .map((el) => ({ ...local(el.querySelector(".frame")), kind: "card", i: Number(el.dataset.i) }));
      return [...name, ...cards];
    };

    const collide = (box, now) => {
      const cx = Math.max(box.l, Math.min(s.x, box.r));
      const cy = Math.max(box.t, Math.min(s.y, box.b));
      let nx = s.x - cx;
      let ny = s.y - cy;
      let dist = Math.hypot(nx, ny);
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

      if (ny < -0.6) s.supported = true; // resting on a top surface
      const vn = s.vx * nx + s.vy * ny;
      if (vn >= 0) return;
      const impact = vn < -1;
      const e = impact ? (box.kind === "name" ? 0.52 : 0.6) : 0; // resting contact doesn't bounce
      s.vx -= (1 + e) * vn * nx;
      s.vy -= (1 + e) * vn * ny;
      const tx = -ny;
      const ty = nx;
      const vt = s.vx * tx + s.vy * ty;
      if (impact) {
        // Impact friction along the surface; spin picks up from it.
        s.vx -= vt * 0.12 * tx;
        s.vy -= vt * 0.12 * ty;
      }
      s.spin = vt / s.r;

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
      for (let i = 1; i < trail.length; i++) {
        const a = trail[i - 1];
        const b = trail[i];
        const k = i / trail.length;
        ctx.strokeStyle = `rgba(20, 18, 15, ${(k * 0.28 * b.life).toFixed(3)})`;
        ctx.lineWidth = 1 + k * 1.2;
        ctx.setLineDash([2, 5]);
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    };

    let last = performance.now();
    const stop = onFrame((now) => {
      const box = stage.getBoundingClientRect();
      const visible = box.bottom > 0 && box.top < window.innerHeight && !document.hidden;
      const dt = Math.min((now - last) / 16.67, 2.5);
      last = now;

      // Fade the trail even when the ball has gone.
      for (const p of trail) p.life -= 0.012 * dt;
      while (trail.length && trail[0].life <= 0) trail.shift();

      if (!s.active) {
        if (visible && now >= nextAt) launch(passes[pass]);
        drawTrail();
        return;
      }
      if (!visible) return;

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
        s.vx *= 1 - 0.0016 * h;
        s.vy *= 1 - 0.0016 * h;
        s.x += s.vx * h;
        s.y += s.vy * h;

        // The stage floor is the touchline: bounce, then roll.
        s.grounded = false;
        s.supported = false;
        if (s.y > floor) {
          s.y = floor;
          if (s.vy > 1.4) {
            s.vy = -s.vy * 0.58;
            s.vx *= 0.94;
          } else {
            s.vy = 0;
            s.grounded = true;
            s.vx *= 1 - 0.0016 * h;
          }
        }

        for (const o of obstacles) collide(o, now);

        // Card tops and letter tops are never perfectly level: a slow ball
        // keeps rolling the way it was going and drops off the edge.
        if (s.supported && Math.abs(s.vx) < 1.4) {
          s.vx += (Math.sign(s.vx) || -1) * 0.09 * h;
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

      const gone = s.x < -s.r * 4 || s.x > W + s.r * 4 || s.y > H + s.r * 4;
      const tired = now - s.born > MAX_LIFETIME || (s.grounded && Math.abs(s.vx) < 0.15);
      if (gone) retire(now);
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
