// Spatial system for the hero: a protected identity zone around the name,
// controlled-random card placement outside it, and a per-frame guard that
// keeps animated cards (and the ball) out of it. Pure functions — no DOM.

/** Small seeded PRNG so a page load has one composition, stable across resizes. */
export function seeded(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const expand = (r, mx, my = mx) => ({ l: r.l - mx, t: r.t - my, r: r.r + mx, b: r.b + my });

export const intersects = (a, b) => a.l < b.r && a.r > b.l && a.t < b.b && a.b > b.t;

const area = (r) => Math.max(0, r.r - r.l) * Math.max(0, r.b - r.t);

const overlap = (a, b) =>
  Math.max(0, Math.min(a.r, b.r) - Math.max(a.l, b.l)) * Math.max(0, Math.min(a.b, b.b) - Math.max(a.t, b.t));

/** Union of element rects, in coordinates relative to `origin`. */
export function unionRect(elements, origin) {
  let u = null;
  for (const el of elements) {
    if (!el) continue;
    const r = el.getBoundingClientRect();
    const box = { l: r.left - origin.left, t: r.top - origin.top, r: r.right - origin.left, b: r.bottom - origin.top };
    u = u ? { l: Math.min(u.l, box.l), t: Math.min(u.t, box.t), r: Math.max(u.r, box.r), b: Math.max(u.b, box.b) } : box;
  }
  return u;
}

/** Responsive breathing space around the name. */
export const zoneMargin = (W) => Math.round(Math.min(72, Math.max(24, W * 0.035)));

/** Axis-aligned extents of a w×h box rotated by `deg` and scaled by `s`. */
export function rotatedHalf(w, h, deg, s = 1) {
  const a = (Math.abs(deg) * Math.PI) / 180;
  return {
    hx: ((w * Math.cos(a) + h * Math.sin(a)) / 2) * s,
    hy: ((w * Math.sin(a) + h * Math.cos(a)) / 2) * s,
  };
}

/**
 * Smallest translation that moves `box` fully outside `zone`
 * (returns {dx:0, dy:0} if they don't intersect).
 */
export function pushOut(box, zone) {
  if (!intersects(box, zone)) return { dx: 0, dy: 0 };
  const options = [
    { dx: zone.l - box.r, dy: 0 },
    { dx: zone.r - box.l, dy: 0 },
    { dx: 0, dy: zone.t - box.b },
    { dx: 0, dy: zone.b - box.t },
  ];
  return options.sort((a, b) => Math.abs(a.dx + a.dy) - Math.abs(b.dx + b.dy))[0];
}

/**
 * Motion envelope for a card: how far idle float, pointer parallax, ball
 * bumps and hover scale can carry it from its resting place.
 */
export function envelope(card) {
  const d = Math.abs(card.depth);
  return {
    ex: 14 + 38 * d + 12 + card.w * 0.05,
    ey: 18 + 26 * d + 12 + card.h * 0.05,
  };
}

/**
 * The free space around the protected zone, cut into regions: right of the
 * name (top / middle / bottom), below it (left / centre), and above / left of
 * it when there's room. The zone itself is never a region.
 */
export function regions(bounds, zone) {
  const cells = [];
  const add = (l, t, r, b, name) => {
    if (r - l > 60 && b - t > 50) cells.push({ l, t, r, b, name, used: 0 });
  };
  const right = Math.min(bounds.r, Math.max(zone.r, bounds.l));
  const thirds = (bounds.b - bounds.t) / 3;
  add(right, bounds.t, bounds.r, bounds.t + thirds, "right-top");
  add(right, bounds.t + thirds, bounds.r, bounds.t + thirds * 2, "right-middle");
  add(right, bounds.t + thirds * 2, bounds.r, bounds.b, "right-bottom");
  const below = Math.max(zone.b, bounds.t);
  const mid = (bounds.l + right) / 2;
  add(bounds.l, below, mid, bounds.b, "below-left");
  add(mid, below, right, bounds.b, "below-centre");
  add(bounds.l, bounds.t, right, Math.min(zone.t, bounds.b), "above");
  add(bounds.l, bounds.t, Math.max(zone.l, bounds.l), bounds.b, "left");
  return cells;
}

/**
 * Controlled-random placement.
 *
 * cards: [{ w, h, depth, rot }] — measured sizes (h/w is the card's real aspect).
 * bounds: { l, t, r, b } — where cards may live (under the nav, above the floor).
 * zone: protected identity rect (already includes the safety margin).
 *
 * Each card draws a region (unused regions first), picks a random spot in it,
 * and shrinks — within limits — until its whole motion envelope clears the
 * zone and stays in bounds. Candidates are scored for spread and for staying
 * close to their intended size; the best wins. Cards may overlap each other
 * a little; they may never touch the zone. A card that can't fit anywhere
 * sits this layout out.
 */
export function placeCards({ cards, bounds, zone, rand, minWidth = 130, samples = 80 }) {
  const cells = regions(bounds, zone);
  const placed = [];
  const out = cards.map(() => null);
  if (!cells.length) return out;

  const pickCell = () => {
    const weights = cells.map((c) => (1 / (1 + c.used * 4)) * Math.pow((c.r - c.l) * (c.b - c.t), 0.35));
    let x = rand() * weights.reduce((a, b) => a + b, 0);
    for (let i = 0; i < cells.length; i++) if ((x -= weights[i]) <= 0) return cells[i];
    return cells[cells.length - 1];
  };

  const fits = (card, cx, cy, w) => {
    const h = w * (card.h / card.w);
    const { hx, hy } = rotatedHalf(w, h, card.rot);
    const { ex, ey } = envelope({ ...card, w, h });
    const rest = { l: cx - hx, t: cy - hy, r: cx + hx, b: cy + hy };
    const bleed = w * 0.1; // a little bleed off the side edges reads as scattered, not boxed
    const inBounds =
      rest.l >= bounds.l - bleed && rest.r <= bounds.r + bleed && rest.t - ey * 0.5 >= bounds.t && rest.b + ey * 0.5 <= bounds.b;
    return inBounds && !intersects(expand(rest, ex, ey), zone) ? { rest, w, h } : null;
  };

  cards.forEach((card, i) => {
    let best = null;
    for (let n = 0; n < samples; n++) {
      const cell = pickCell();
      const cx = cell.l + rand() * (cell.r - cell.l);
      const cy = cell.t + rand() * (cell.b - cell.t);
      let hit = null;
      for (let w = card.w; w >= minWidth && !hit; w *= 0.9) hit = fits(card, cx, cy, w);
      if (!hit) continue;

      let score = cell.used * 2.2 + (1 - hit.w / card.w) * 1.6 + rand() * 0.7;
      for (const other of placed) {
        const o = overlap(hit.rest, other.rect) / Math.min(area(hit.rest), area(other.rect));
        score += o > 0.3 ? 5 + o * 10 : o * -0.6; // a kiss of overlap is good, a pile-up isn't
        score += 1.4 / (1 + Math.hypot(cx - other.cx, cy - other.cy) / 180);
      }
      if (!best || score < best.score) best = { score, cx, cy, cell, ...hit };
    }
    if (!best) return;
    best.cell.used += 1;
    placed.push({ rect: best.rest, cx: best.cx, cy: best.cy });
    out[i] = { left: best.cx - best.w / 2, top: best.cy - best.h / 2, width: best.w, height: best.h };
  });

  return out;
}
