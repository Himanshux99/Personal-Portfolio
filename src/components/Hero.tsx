import type { ReactNode } from "react";
import { motion } from "motion/react";
import { ArrowDown } from "lucide-react";
import Pipeline from "./Pipeline";

const ease = [0.16, 1, 0.3, 1] as const;

function Line({ children, delay }: { children: ReactNode; delay: number }) {
  return (
    <span className="block overflow-hidden pb-[0.08em]">
      <motion.span
        className="block"
        initial={{ y: "105%" }}
        animate={{ y: 0 }}
        transition={{ duration: 1, delay, ease }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export default function Hero() {
  return (
    <section id="top" className="relative flex min-h-[100dvh] flex-col justify-end pb-10 pt-28 md:pb-14">
      <div className="shell">
        <h1 className="display text-[clamp(2.9rem,9.6vw,8.4rem)]">
          <Line delay={0.15}>From interface</Line>
          <Line delay={0.27}>
            to <span className="text-accent">infrastructure.</span>
          </Line>
        </h1>

        <div className="mt-8 grid gap-8 md:mt-10 lg:grid-cols-[minmax(0,26rem)_1fr] lg:gap-14">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7, ease }}
          >
            <p className="max-w-[34ch] text-lg leading-snug text-ink/90">
              Himanshu Choyal, IT engineering student in Mumbai. I build interfaces, intelligent systems and the
              pipelines that ship them.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#work" className="btn btn-primary">
                Selected work <ArrowDown size={16} strokeWidth={1.75} />
              </a>
              <a href="#contact" className="btn">
                Get in touch
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.85, ease }}
          >
            <Pipeline />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
