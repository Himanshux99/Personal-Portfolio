import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { setPhase, usePhase } from "../boot";

const ease = [0.76, 0, 0.24, 1] as const;

const lines = ["mounting /work", "loading projects", "linking stack", "starting hc.os"];
const TOTAL = 2200;

/** Boot sequence shown once per page load, then wipes upward to reveal the site. */
export default function Loader() {
  const reduce = useReducedMotion();
  const [done, setDone] = useState(false);
  const [pct, setPct] = useState(0);
  const phase = usePhase();

  useEffect(() => {
    if (reduce) {
      setDone(true);
      setPhase("ready");
      return;
    }
    document.documentElement.style.overflow = "hidden";
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min((now - start) / TOTAL, 1);
      setPct(Math.round((1 - Math.pow(1 - t, 2.2)) * 100));
      if (t < 1) raf = requestAnimationFrame(tick);
      else {
        setDone(true);
        setPhase("lid");
      }
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.style.overflow = "";
    };
  }, [reduce]);

  // The page stays locked until the laptop has opened and the terminal has launched.
  useEffect(() => {
    if (phase === "ready") document.documentElement.style.overflow = "";
  }, [phase]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="loader"
          role="status"
          aria-label="Loading"
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.8, ease }}
          className="fixed inset-0 z-[200] grid place-items-center bg-ink text-bg"
          style={{ clipPath: "inset(0 0 0% 0)" }}
        >
          <div className="draft-dots pointer-events-none absolute inset-0 opacity-[0.12]" aria-hidden />

          <div className="relative w-[min(20rem,80vw)]">
            {/* mini laptop that draws itself */}
            <svg viewBox="0 0 120 80" className="mx-auto mb-8 w-36" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
              <motion.path
                d="M20 62 V14 a4 4 0 0 1 4 -4 H96 a4 4 0 0 1 4 4 V62 Z"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.9, ease: "easeInOut" }}
              />
              <motion.path
                d="M8 62 H112 V66 a4 4 0 0 1 -4 4 H12 a4 4 0 0 1 -4 -4 Z"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.7, delay: 0.5, ease: "easeInOut" }}
              />
              <motion.rect
                x="30"
                y="20"
                width="60"
                height="34"
                className="fill-accent stroke-none"
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: [0, 1, 0.55, 1], scaleY: 1 }}
                transition={{ delay: 1.1, duration: 0.6 }}
                style={{ transformOrigin: "60px 37px" }}
              />
            </svg>

            <div className="mono mb-3 flex items-baseline justify-between text-[0.68rem] uppercase">
              <span>
                <span className="text-accent">&gt;</span> hc.os
              </span>
              <span className="tabular-nums">{pct}%</span>
            </div>

            <div className="h-1.5 w-full border border-bg/60">
              <div className="h-full bg-accent" style={{ width: `${pct}%` }} />
            </div>

            <ul className="mono mt-4 space-y-1 text-[0.62rem] uppercase text-bg/60">
              {lines.map((l, i) => (
                <motion.li
                  key={l}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 + i * 0.45, duration: 0.25 }}
                >
                  <span className="text-accent">ok</span> {l}
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
