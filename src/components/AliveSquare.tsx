import { useEffect, useRef } from "react";

const interactive = "a, button, [role='button'], input, textarea, summary";
const SIZE = 8;

/** A blue square that trails the pointer on a spring: stretches into its motion,
 *  turns to face it, breathes and wobbles when idle, and swells over links. */
export default function AliveSquare({ shared }: { shared?: { x: number; y: number } }) {
  const el = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = el.current!;
    const target = { x: -100, y: -100 };
    const pos = { x: -100, y: -100 };
    const vel = { x: 0, y: 0 };
    let rot = 0;
    let grow = 1;
    let growTarget = 1;
    let squash = 0;
    let down = false;
    let seen = false;
    let last = performance.now();
    let raf = 0;

    const move = (e: PointerEvent) => {
      if (!seen) {
        pos.x = e.clientX;
        pos.y = e.clientY;
        seen = true;
      }
      target.x = e.clientX;
      target.y = e.clientY;
      growTarget = (e.target as Element | null)?.closest?.(interactive) ? 1.35 : 1;
    };
    const dn = () => (down = true);
    const up = () => (down = false);

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      // Underdamped spring toward the pointer, so it overshoots and settles.
      const k = 170, c = 13;
      vel.x += ((target.x - pos.x) * k - vel.x * c) * dt;
      vel.y += ((target.y - pos.y) * k - vel.y * c) * dt;
      pos.x += vel.x * dt;
      pos.y += vel.y * dt;
      if (shared) {
        shared.x = pos.x;
        shared.y = pos.y;
      }

      const speed = Math.hypot(vel.x, vel.y);
      const moving = speed > 40;

      // A square repeats every 90°, so turn by the shortest way to the nearest face.
      const idle = Math.sin(now / 900) * 12 + 45;
      const want = moving ? (Math.atan2(vel.y, vel.x) * 180) / Math.PI : idle;
      let diff = (((want - rot) % 90) + 135) % 90 - 45;
      rot += diff * Math.min(dt * (moving ? 14 : 3), 1);

      // Stretch along the direction of travel, squash across it.
      squash += (Math.min(speed / 2200, 0.7) - squash) * Math.min(dt * 14, 1);
      growTarget = down ? growTarget * 0.7 : growTarget;
      grow += (growTarget - grow) * Math.min(dt * 12, 1);
      const breathe = 1 + Math.sin(now / 420) * 0.07 * (1 - squash);

      const sx = (1 + squash) * grow * breathe;
      const sy = (1 - squash * 0.45) * grow * breathe;
      node.style.opacity = seen ? "1" : "0";
      node.style.transform = `translate(${pos.x - SIZE / 2}px, ${pos.y - SIZE / 2}px) rotate(${rot}deg) scale(${sx}, ${sy})`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerdown", dn);
    window.addEventListener("pointerup", up);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", dn);
      window.removeEventListener("pointerup", up);
    };
  }, []);

  return (
    <div
      ref={el}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-300 bg-accent opacity-0 shadow-[0_0_14px_1px_rgba(48,133,254,0.55)] will-change-transform"
      style={{ width: SIZE, height: SIZE }}
    />
  );
}
