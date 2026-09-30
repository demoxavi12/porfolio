import { useEffect, useState } from "react";

const STEPS = [0, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.5, 0.6, 0.75, 1];

/**
 * Replayable visibility for section animations.
 *
 * Becomes true when a meaningful part of the element is on screen —
 * `threshold` of the element, or of the viewport for elements taller than
 * it — and false only once the element has left completely. So:
 *   enter → true (play) · leave → false (reset) · enter again → true (replay)
 * One IntersectionObserver, no scroll listeners, cleaned up on unmount.
 */
export function useInViewReplay(ref, { threshold = 0.25 } = {}) {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          setInView(false);
          return;
        }
        const ofViewport = entry.intersectionRect.height / window.innerHeight;
        if (Math.max(entry.intersectionRatio, ofViewport) >= threshold) setInView(true);
      },
      { threshold: STEPS }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, threshold]);

  return inView;
}
