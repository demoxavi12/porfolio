import { useEffect, useState } from "react";

/** True once the element has scrolled into view (or while it is, with once=false). */
export function useInView(ref, { once = true, margin = "0px 0px -12% 0px" } = {}) {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) io.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { rootMargin: margin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, once, margin]);

  return inView;
}
