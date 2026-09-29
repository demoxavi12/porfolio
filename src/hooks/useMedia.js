import { useSyncExternalStore } from "react";

function subscribeTo(query) {
  return (onChange) => {
    const list = window.matchMedia(query);
    list.addEventListener("change", onChange);
    return () => list.removeEventListener("change", onChange);
  };
}

export function useMedia(query) {
  return useSyncExternalStore(
    subscribeTo(query),
    () => window.matchMedia(query).matches,
    () => false
  );
}

export const REDUCED = "(prefers-reduced-motion: reduce)";
export const FINE_POINTER = "(hover: hover) and (pointer: fine)";
/** Desktop layouts where the scroll-choreographed chapters run. */
export const CINEMATIC = "(min-width: 900px) and (prefers-reduced-motion: no-preference)";

export const useReducedMotion = () => useMedia(REDUCED);
