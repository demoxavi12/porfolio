// One requestAnimationFrame loop shared by every animated component.
// Subscribers get the frame timestamp; the loop stops when nobody listens.

const subscribers = new Set();
let frame = 0;

function tick(time) {
  subscribers.forEach((fn) => fn(time));
  frame = subscribers.size ? requestAnimationFrame(tick) : 0;
}

export function onFrame(fn) {
  subscribers.add(fn);
  if (!frame) frame = requestAnimationFrame(tick);
  return () => subscribers.delete(fn);
}

export const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));
export const lerp = (a, b, t) => a + (b - a) * t;
/** Progress (0–1) of `v` travelling from `start` to `end`. */
export const range = (v, start, end) => clamp((v - start) / (end - start));
/** Smooth ease-in-out for scroll-driven values. */
export const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
