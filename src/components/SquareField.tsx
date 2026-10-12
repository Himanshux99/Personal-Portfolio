import { useEffect, useRef } from "react";


/** A field of small squares that assembles into a word. Squares scatter in, spring
 *  into place, shimmer with a rolling wave, and are shoved aside and spun by the pointer. */
export default function SquareField({ text, className = "" }: { text: string; className?: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = canvas.current!;
    const ctx = cv.getContext("2d")!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const css = getComputedStyle(document.documentElement);
    const accent = css.getPropertyValue("--color-accent").trim() || "#3085fe";
    const ink = css.getPropertyValue("--color-ink").trim() || "#0b1220";
    const line = css.getPropertyValue("--color-line-strong").trim() || "#9aa6bd";

    type Cell = { on: boolean; hx: number; hy: number; x: number; y: number; vx: number; vy: number; r: number; vr: number; heat: number; delay: number };
    let cells: Cell[] = [];
    let w = 0, h = 0;
    let gap = 11; // tighter grid on narrow screens so the letters stay readable
    const mouse = { x: -999, y: -999, active: false };
    let raf = 0;
    let last = performance.now();
    let start = 0; // set once the field scrolls into view; 0 = still waiting
    let alive = true;

    const build = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = cv.clientWidth;
      h = cv.clientHeight;
      if (!w || !h) return;
      gap = w < 520 ? 5 : w < 900 ? 8 : 11;
      cv.width = w * dpr;
      cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Rasterise the word, then keep the grid cells that fall inside a letter.
      const mask = document.createElement("canvas");
      mask.width = w;
      mask.height = h;
      const m = mask.getContext("2d", { willReadFrequently: true })!;
      const family = '"Geist Variable", Geist, system-ui, sans-serif';
      let size = h * 0.8;
      m.font = `800 ${size}px ${family}`;
      const fit = (w * 0.9) / m.measureText(text).width;
      if (fit < 1) size *= fit;
      m.font = `800 ${size}px ${family}`;
      m.textAlign = "center";
      m.textBaseline = "alphabetic";
      m.fillText(text, w / 2, h / 2 + size * 0.36);
      const px = m.getImageData(0, 0, w, h).data;

      cells = [];
      const cols = Math.floor(w / gap);
      const rows = Math.floor(h / gap);
      const ox = (w - (cols - 1) * gap) / 2;
      const oy = (h - (rows - 1) * gap) / 2;
      for (let j = 0; j < rows; j++)
        for (let i = 0; i < cols; i++) {
          const hx = ox + i * gap, hy = oy + j * gap;
          const on = px[((Math.round(hy) * w + Math.round(hx)) * 4) + 3] > 110;
          cells.push({
            on, hx, hy,
            x: reduce ? hx : Math.random() * w,
            y: reduce ? hy : Math.random() * h * 2 - h * 0.5,
            vx: 0, vy: 0, r: 0, vr: 0, heat: 0,
            delay: (hx / w) * 0.9 + Math.random() * 0.25,
          });
        }
    };

    const draw = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const t = now / 1000;
      const since = start ? (now - start) / 1000 : -1;
      ctx.clearRect(0, 0, w, h);

      for (const c of cells) {
        const wave = reduce ? 0 : (Math.sin(c.hx * 0.02 + c.hy * 0.035 - t * 1.8) + 1) / 2;
        // Squares wait scattered, then each is released on a left-to-right stagger.
        const released = reduce || since >= c.delay;

        if (released) {
          const dx = c.x - mouse.x, dy = c.y - mouse.y;
          const d = Math.hypot(dx, dy);
          if (mouse.active && d < 70 + gap * 4) {
            const f = (1 - d / (70 + gap * 4)) * 1100;
            c.vx += (dx / (d || 1)) * f * dt;
            c.vy += (dy / (d || 1)) * f * dt;
            c.vr += f * 0.9 * dt;
            c.heat = Math.min(1, c.heat + dt * 8);
          }
          const k = c.on ? 70 : 28;
          c.vx += (c.hx - c.x) * k * dt - c.vx * 6 * dt;
          c.vy += (c.hy - c.y) * k * dt - c.vy * 6 * dt;
          c.vr += -c.vr * 3 * dt;
          c.x += c.vx * dt;
          c.y += c.vy * dt;
          c.r += c.vr * dt;
          c.heat = Math.max(0, c.heat - dt * 1.1);
        }

        const settle = released ? 1 : 0.35;
        const lit = Math.min(1, c.heat + (c.on ? wave * 0.35 : 0));
        const u = gap / 11;
        const sz = (c.on ? 6.5 + wave * 1.5 + c.heat * 4 : 1.8 + c.heat * 5) * Math.max(u, 0.5);
        ctx.save();
        ctx.translate(c.x, c.y);
        ctx.rotate((c.r * Math.PI) / 180);
        ctx.globalAlpha = (c.on ? 0.85 + wave * 0.15 : 0.22 + c.heat * 0.6) * settle;
        ctx.fillStyle = c.heat > 0.15 ? accent : c.on ? (lit > 0.45 ? accent : ink) : line;
        ctx.fillRect(-sz / 2, -sz / 2, sz, sz);
        ctx.restore();
      }
      if (!reduce && alive) raf = requestAnimationFrame(draw);
    };

    const move = (e: PointerEvent) => {
      const b = cv.getBoundingClientRect();
      mouse.x = e.clientX - b.left;
      mouse.y = e.clientY - b.top;
      mouse.active = mouse.y > -60 && mouse.y < b.height + 60;
    };
    const leave = () => (mouse.active = false);

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !start) start = performance.now();
      },
      { threshold: 0.35 },
    );

    document.fonts.ready.then(() => {
      if (!alive) return;
      build();
      raf = requestAnimationFrame(draw);
      io.observe(cv);
    });
    const ro = new ResizeObserver(() => {
      build();
      if (reduce) requestAnimationFrame(draw);
    });
    ro.observe(cv);
    window.addEventListener("pointermove", move);
    document.addEventListener("pointerleave", leave);
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
    };
  }, [text]);

  return <canvas ref={canvas} role="img" aria-label={text} className={`block w-full ${className}`} />;
}
