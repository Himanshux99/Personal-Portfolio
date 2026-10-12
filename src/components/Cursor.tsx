import { useEffect, useRef, useState } from "react";
import AliveSquare from "./AliveSquare";

const LIFE = 100; // ms a trail point lives
const FAST = 5; // px/ms (~1200px/s) the pointer must exceed before a trail appears

/** Smooth fading accent-colour cursor trail. Mouse only. */
export default function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const canvas = useRef<HTMLCanvasElement>(null);
  const square = useRef({ x: -100, y: -100 }).current;

  useEffect(() => {
    if (matchMedia("(hover: hover) and (pointer: fine)").matches) setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const cv = canvas.current!;
    const ctx = cv.getContext("2d")!;
    const accent = getComputedStyle(document.documentElement).getPropertyValue("--color-accent").trim() || "#3085fe";
    const pts: { x: number; y: number; t: number; start: boolean }[] = [];
    let speed = 0; // smoothed pointer speed, px/ms
    let lastMove = 0;
    const target = { x: -100, y: -100 };
    const head = { x: -100, y: -100 };
    let seen = false;
    let raf = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      // Size from the element, not the window: innerWidth includes the scrollbar, which
      // would stretch the bitmap and shift the trail sideways away from the square.
      cv.width = cv.clientWidth * dpr;
      cv.height = cv.clientHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const move = (e: PointerEvent) => {
      const rect = cv.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const now = performance.now();
      if (!seen) {
        head.x = x;
        head.y = y;
        seen = true;
      } else {
        const v = Math.hypot(x - target.x, y - target.y) / Math.max(now - lastMove, 1);
        speed = speed * 0.6 + v * 0.4;
      }
      lastMove = now;
      target.x = x;
      target.y = y;
    };

    const draw = (now: number) => {
      if (now - lastMove > 60) speed = 0;
      // The trail is emitted from the square itself, not the raw pointer.
      // The square's position is in viewport coordinates; convert to canvas-local.
      const rect = cv.getBoundingClientRect();
      head.x = square.x - rect.left;
      head.y = square.y - rect.top;
      const last = pts[pts.length - 1];
      // A fast flick starts the trail; once it exists it keeps tracking the square
      // until it has drained, so the tail runs back into the box instead of stopping short.
      if (seen && (speed > FAST || pts.length > 0)) {
        // A point added after a pause starts a new stroke so gaps aren't bridged.
        const start = !last || now - last.t > 80;
        if (start || Math.hypot(head.x - last.x, head.y - last.y) > 0.5) {
          pts.push({ x: head.x, y: head.y, t: now, start });
        }
      }
      while (pts.length && now - pts[0].t > LIFE) pts.shift();

      // Map CSS pixels onto the bitmap using the live ratio, so the drawing stays
      // aligned with the pointer even if the bitmap and CSS size briefly disagree.
      ctx.setTransform(cv.width / rect.width, 0, 0, cv.height / rect.height, 0, 0);
      ctx.clearRect(0, 0, rect.width, rect.height);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = accent;
      // Quadratic curves through segment midpoints give a continuous smooth path.
      for (let i = 1; i < pts.length - 1; i++) {
        const k = 1 - (now - pts[i].t) / LIFE;
        const a = pts[i - 1], b = pts[i], c = pts[i + 1];
        if (b.start || c.start) continue;
        ctx.globalAlpha = Math.max(k, 0) * 0.9;
        ctx.lineWidth = 0.6 + 1.4 * k;
        ctx.beginPath();
        ctx.moveTo((a.x + b.x) / 2, (a.y + b.y) / 2);
        ctx.quadraticCurveTo(b.x, b.y, (b.x + c.x) / 2, (b.y + c.y) / 2);
        ctx.stroke();
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    window.addEventListener("pointermove", move);
    // The scrollbar can appear or vanish without a window resize (e.g. when the loader
    // unlocks scrolling), which changes the canvas's CSS size; observe it directly.
    const ro = new ResizeObserver(resize);
    ro.observe(cv);
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointermove", move);
      window.removeEventListener("resize", resize);
    };
  }, [enabled, square]);

  if (!enabled) return null;
  return (
    <>
      <canvas ref={canvas} aria-hidden className="pointer-events-none fixed inset-0 z-299 h-full w-full" />
      <AliveSquare shared={square} />
    </>
  );
}
