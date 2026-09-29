// Shared pointer + scroll state, written by passive listeners and read inside
// the frame loop — so no component re-renders on mouse move or scroll.

export const pointer = { x: 0, y: 0, nx: 0, ny: 0, moved: false };
export const scroll = { y: 0, velocity: 0 };

if (typeof window !== "undefined") {
  pointer.x = window.innerWidth / 2;
  pointer.y = window.innerHeight / 2;
  scroll.y = window.scrollY;

  window.addEventListener(
    "pointermove",
    (e) => {
      if (e.pointerType !== "mouse") return;
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.nx = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.ny = (e.clientY / window.innerHeight) * 2 - 1;
      pointer.moved = true;
    },
    { passive: true }
  );

  let last = window.scrollY;
  const track = () => {
    const y = window.scrollY;
    scroll.velocity += (y - last - scroll.velocity) * 0.2;
    scroll.y = y;
    last = y;
    requestAnimationFrame(track);
  };
  requestAnimationFrame(track);
}
