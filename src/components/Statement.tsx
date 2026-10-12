import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";

const phrases = [
  "A screen is the last step.",
  "Before it: an API, a database, a model.",
  "Under it: a pipeline someone has to trust.",
];

const stages = [
  { at: 0.12, label: "UI" },
  { at: 0.38, label: "API" },
  { at: 0.64, label: "Model" },
  { at: 0.9, label: "Cluster" },
];

function Phrase({ text, i, progress }: { text: string; i: number; progress: MotionValue<number> }) {
  const n = phrases.length;
  const a = i / n;
  const b = (i + 1) / n;
  const first = i === 0;
  const last = i === n - 1;
  const opacity = useTransform(progress, [a, a + 0.05, b - 0.07, b], [first ? 1 : 0, 1, 1, last ? 1 : 0]);
  const y = useTransform(progress, [a, a + 0.05, b - 0.07, b], [first ? 0 : 28, 0, 0, last ? 0 : -28]);
  return (
    <motion.p
      style={{ opacity, y }}
      className="display absolute inset-x-0 mx-auto max-w-[17ch] px-6 text-center text-[clamp(2.3rem,6.2vw,5.6rem)]"
    >
      {text}
    </motion.p>
  );
}

function Stage({ at, label, progress }: { at: number; label: string; progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [at * 0.9, at], [0.25, 1], { clamp: true });
  const left = `${at * 100}%`;
  return (
    <motion.div style={{ opacity, left }} className="absolute top-0 -translate-x-1/2">
      <span className="block h-3 w-3 -translate-y-1/2 border border-ink bg-bg" />
      <span className="mono mt-3 block text-[0.68rem] uppercase">{label}</span>
    </motion.div>
  );
}

/** Pinned scroll sequence. Each line takes over the viewport while a request trace draws across the bottom. */
export default function Statement() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const trace = useTransform(scrollYProgress, [0.02, 0.97], [0, 1], { clamp: true });
  const head = useTransform(trace, (v) => `${v * 100}%`);

  if (reduce) {
    return (
      <section className="border-b border-ink py-24" aria-label="How I think about software">
        <div className="shell space-y-10">
          {phrases.map((p) => (
            <p key={p} className="display max-w-[18ch] text-[clamp(2rem,6vw,4.5rem)]">
              {p}
            </p>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} className="relative h-[330vh] border-b border-ink" aria-label="How I think about software">
      <div className="sticky top-0 flex h-dvh items-center justify-center overflow-hidden">
        <div className="draft-dots absolute inset-0 opacity-30" aria-hidden />
        <div className="relative h-[40vh] w-full">
          {phrases.map((p, i) => (
            <Phrase key={p} text={p} i={i} progress={scrollYProgress} />
          ))}
        </div>

        <div aria-hidden className="absolute inset-x-[8%] bottom-[14dvh] h-px bg-line-strong">
          <motion.div style={{ scaleX: trace }} className="h-px origin-left bg-ink" />
          <motion.span style={{ left: head }} className="absolute -top-[5px] h-[11px] w-[11px] -translate-x-1/2 bg-accent" />
          {stages.map((s) => (
            <Stage key={s.label} at={s.at} label={s.label} progress={trace} />
          ))}
        </div>
      </div>
    </section>
  );
}
