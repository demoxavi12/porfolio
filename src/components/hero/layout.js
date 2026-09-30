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
function pushOutOne(box, zone) {
  if (!intersects(box, zone)) return { dx: 0, dy: 0 };
  const options = [
    { dx: zone.l - box.r, dy: 0 },
    { dx: zone.r - box.l, dy: 0 },
    { dx: 0, dy: zone.t - box.b },
    { dx: 0, dy: zone.b - box.t },
  ];
  return options.sort((a, b) => Math.abs(a.dx + a.dy) - Math.abs(b.dx + b.dy))[0];
}

/** Push `box` out of every protected rect (a few passes settle neighbours). */
export function pushOut(box, zones) {
  let dx = 0;
  let dy = 0;
  for (let pass = 0; pass < 4; pass++) {
    let moved = false;
    for (const z of zones) {
      const shifted = { l: box.l + dx, t: box.t + dy, r: box.r + dx, b: box.b + dy };
      const m = pushOutOne(shifted, z);
      if (m.dx || m.dy) {
        dx += m.dx;
        dy += m.dy;
        moved = true;
      }
    }
    if (!moved) break;
  }
  return { dx, dy };
}

/**
 * Motion envelope for a card: how far idle float (≈ ±11 / ±8 px), pointer
 * parallax (24 / 10 px × depth), ball bumps and a hover scale can carry
 * it from its resting place. Placement keeps this whole envelope off the
 * name; the per-frame guard covers anything beyond it (hover lift, swaps).
 */
export function envelope(card) {
  const d = Math.abs(card.depth);
  return {
    ex: 11 + 24 * d + 8 + card.w * 0.025,
    ey: 8 + 10 * d + 8 + card.h * 0.025,
  };
}

/**
 * Can a card of this size rest with its centre at (cx, cy)? True when its
 * whole motion envelope clears every protected rect and it stays in bounds
 * (a little bleed off the side edges is allowed). Used by placement and by
 * the hover swap before it moves a card anywhere.
 */
export function clearOf(card, cx, cy, zones, bounds) {
  const { hx, hy } = rotatedHalf(card.w, card.h, card.rot);
  const { ex, ey } = envelope(card);
  const rest = { l: cx - hx, t: cy - hy, r: cx + hx, b: cy + hy };
  const bleed = card.w * (card.tier === "large" ? 0.3 : 0.14); // may drift partly off the side edges
  const inBounds =
    rest.l >= bounds.l - bleed && rest.r <= bounds.r + bleed && rest.t - ey >= bounds.t && rest.b + ey <= bounds.b;
  const reach = expand(rest, ex, ey);
  return inBounds && !zones.some((z) => intersects(reach, z)) ? rest : null;
}

/**
 * Controlled-random placement above and below the name.
 *
 * cards: [{ w, h, depth, rot, tier, minWidth }] — measured sizes (h/w is the
 *   card's real aspect). tier "large" = project cards, "small" = technical
 *   fragments.
 * bounds: { l, t, r, b } — the stage area cards may use (under the nav, above the floor).
 * zones: the protected rects — SWARAJ, Xavier and SUNA, each measured and
 *   grown by a safety margin. Their pockets (e.g. right of SWARAJ, above
 *   Xavier) are free space; the words themselves never are.
 *
 * Large cards place first, dealt at random between the upper and lower band;
 * small fragments then fill in around them. Each card samples random spots
 * across its band and shrinks, within its tier's limits, until its whole
 * motion envelope clears the zones. Spread and a little overlap are
 * rewarded; pile-ups are not. A card that fits nowhere sits the layout out —
 * it never touches the name.
 */
export function placeCards({ cards, bounds, zones, rand, samples = 110 }) {
  const top = Math.min(...zones.map((z) => z.t));
  const bottom = Math.max(...zones.map((z) => z.b));
  const mid = (top + bottom) / 2;
  const bands = [
    { t: bounds.t, b: mid },
    { t: mid, b: bounds.b },
  ];
  const out = cards.map(() => null);
  const placed = [];

  const tryBand = (card, band) => {
    let best = null;
    if (band.b - band.t < 60) return null;
    // Project cards search much harder for the spot where they can be largest.
    const tries = card.tier === "large" ? samples * 4 : samples;
    for (let n = 0; n < tries; n++) {
      const cx = bounds.l + rand() * (bounds.r - bounds.l);
      const cy = band.t + rand() * (band.b - band.t);
      let hit = null;
      let w = card.w;
      for (; w >= card.minWidth && !hit; w *= card.tier === "large" ? 0.95 : 0.9) {
        const rest = clearOf({ ...card, w, h: w * (card.h / card.w) }, cx, cy, zones, bounds);
        if (rest) hit = { rest, w: w, h: w * (card.h / card.w) };
      }
      if (!hit) continue;
      // Large cards strongly prefer their full size; fragments shrink more freely.
      let score = (1 - hit.w / card.w) * (card.tier === "large" ? 4 : 1) + rand() * 0.8;
      for (const other of placed) {
        const o = overlap(hit.rest, other.rect) / Math.min(area(hit.rest), area(other.rect));
        // Project cards may stack deeply on each other (depth); nothing may touch the name.
        const limit = card.tier === "large" && other.tier === "large" ? 0.6 : card.tier === "small" && other.tier === "large" ? 0.5 : 0.45;
        score += o > limit ? 5 + o * 10 : o * -0.7; // some overlap gives depth; a pile-up hides the work
        score += 1.2 / (1 + Math.hypot(cx - other.cx, cy - other.cy) / 200);
      }
      if (!best || score < best.score) best = { score, cx, cy, ...hit };
    }
    return best;
  };

  const shuffle = (list) => {
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
    return list;
  };

  const large = shuffle(cards.map((c, i) => i).filter((i) => cards[i].tier === "large"));
  const small = shuffle(cards.map((c, i) => i).filter((i) => cards[i].tier !== "large"));
  // Large cards: a random split between the bands (never all on one side).
  const upperLarge = Math.max(1, Math.min(large.length - 1, Math.round(large.length / 2 + (rand() - 0.5))));

  const place = (i, preferUpper) => {
    const card = cards[i];
    const first = preferUpper ? bands[0] : bands[1];
    const other = preferUpper ? bands[1] : bands[0];
    let best = tryBand(card, first) ?? tryBand(card, other);
    // A project card never sits a layout out: it steps down in size instead.
    for (const floor of card.tier === "large" ? [0.82, 0.66] : []) {
      if (best) break;
      const smaller = { ...card, minWidth: card.minWidth * floor };
      best = tryBand(smaller, first) ?? tryBand(smaller, other);
    }
    if (!best) return;
    placed.push({ rect: best.rest, cx: best.cx, cy: best.cy, tier: card.tier });
    out[i] = { left: best.cx - best.w / 2, top: best.cy - best.h / 2, width: best.w, height: best.h };
  };

  large.forEach((i, k) => place(i, k < upperLarge));
  small.forEach((i) => place(i, rand() < 0.5));
  return out;
}
