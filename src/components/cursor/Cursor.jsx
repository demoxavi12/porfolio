import { useEffect, useRef } from "react";
import { FINE_POINTER, useMedia } from "../../hooks/useMedia";
import { lerp, onFrame } from "../../lib/loop";
import { pointer } from "../../lib/pointer";
import "./cursor.css";

/**
 * Context-aware cursor: a small dot by default, a lime label on anything
 * with data-cursor="…", a ring on other links. Elements with data-magnetic
 * lean toward the pointer. Mouse-only — touch devices never mount it.
 */
export default function Cursor() {
  const fine = useMedia(FINE_POINTER);
  if (!fine) return null;
  return <CursorLayer />;
}

function CursorLayer() {
  const dotRef = useRef(null);
  const labelRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const root = document.documentElement;
    const dot = dotRef.current;
    const label = labelRef.current;
    const text = textRef.current;
    root.classList.add("has-cursor");

    const eased = { x: pointer.x, y: pointer.y };
    let magnet = null;
    let ready = false;

    const onOver = (e) => {
      const target = e.target.closest?.("[data-cursor], a, button, [role='button'], summary, label");
      const hint = target?.getAttribute?.("data-cursor");
      if (hint) {
        text.textContent = hint;
        root.dataset.cursorState = "label";
      } else if (target) {
        root.dataset.cursorState = "link";
      } else {
        root.dataset.cursorState = "";
      }

      const nextMagnet = e.target.closest?.("[data-magnetic]") ?? null;
      if (magnet && magnet !== nextMagnet) magnet.style.transform = "";
      magnet = nextMagnet;
    };

    const onLeaveWindow = () => root.classList.add("cursor-hidden");
    const onEnterWindow = () => root.classList.remove("cursor-hidden");
    const onDown = () => root.classList.add("cursor-down");
    const onUp = () => root.classList.remove("cursor-down");

    document.addEventListener("pointerover", onOver);
    document.addEventListener("pointerleave", onLeaveWindow);
    document.addEventListener("pointerenter", onEnterWindow);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);

    const stop = onFrame(() => {
      if (!pointer.moved) return;
      if (!ready) {
        ready = true;
        root.classList.add("cursor-ready");
      }
      eased.x = lerp(eased.x, pointer.x, 0.2);
      eased.y = lerp(eased.y, pointer.y, 0.2);
      dot.style.transform = `translate3d(${pointer.x}px, ${pointer.y}px, 0)`;
      label.style.transform = `translate3d(${eased.x}px, ${eased.y}px, 0)`;

      if (magnet) {
        const r = magnet.getBoundingClientRect();
        const dx = pointer.x - (r.left + r.width / 2);
        const dy = pointer.y - (r.top + r.height / 2);
        magnet.style.transform = `translate(${dx * 0.22}px, ${dy * 0.3}px)`;
      }
    });

    return () => {
      stop();
      root.classList.remove("has-cursor", "cursor-ready", "cursor-hidden", "cursor-down");
      delete root.dataset.cursorState;
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerleave", onLeaveWindow);
      document.removeEventListener("pointerenter", onEnterWindow);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      if (magnet) magnet.style.transform = "";
    };
  }, []);

  return (
    <>
      {/* Separate layers: the dot inverts what's under it, the label doesn't. */}
      <div className="cursor cursor--dot" aria-hidden="true">
        <span className="cursor__dot" ref={dotRef} />
      </div>
      <div className="cursor" aria-hidden="true">
        <span className="cursor__label" ref={labelRef}>
          <span className="cursor__text mono" ref={textRef} />
        </span>
      </div>
    </>
  );
}
