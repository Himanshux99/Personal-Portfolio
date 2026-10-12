import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { playground, type PlayCategory } from "../data/content";
import Reveal from "./Reveal";
import SplitHeading from "./SplitHeading";

const filters: ("All" | PlayCategory)[] = ["All", "AI", "Web", "DevOps", "Games"];

export default function Playground() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const shown = playground.filter((p) => filter === "All" || p.category === filter);

  return (
    <section id="playground" aria-labelledby="play-title" className="section-pad border-t border-ink">
      <div className="shell">
        <Reveal>
          <p className="label">Playground</p>
          <SplitHeading id="play-title" className="h2 mt-4 max-w-[14ch]" text="Experiments" />
          <p className="mt-6 max-w-[52ch] text-lg text-ink/75">
            Smaller experiments, half-finished ideas and things I built to learn something. Tags show which ones have a public repository.
          </p>
        </Reveal>

        <div role="tablist" aria-label="Filter experiments" className="mt-10 flex flex-wrap gap-x-1 gap-y-1 border-b border-ink">
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              role="tab"
              aria-selected={filter === f}
              onClick={() => setFilter(f)}
              className={`relative px-4 py-3 font-mono text-[0.7rem] uppercase transition-colors ${filter === f ? "text-ink" : "text-mute hover:text-ink"}`}
            >
              {f}
              {filter === f && (
                <motion.span
                  layoutId="play-tab"
                  className="absolute inset-x-0 -bottom-px h-[3px] bg-accent"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
            </button>
          ))}
        </div>

        <motion.ul layout className="grid border-l border-ink sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout" initial={false}>
            {shown.map((item) => {
              const body = (
                <>
                  <div className="flex items-start justify-between gap-4">
                    <span className="mono text-[0.68rem] uppercase text-mute">{item.tag}</span>
                    {item.href && (
                      <ArrowUpRight
                        size={16}
                        strokeWidth={1.5}
                        className="shrink-0 text-mute transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-signal"
                      />
                    )}
                  </div>
                  <h3 className="mt-8 text-xl font-semibold uppercase leading-[1] tracking-[-0.03em]">{item.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-mute">{item.note}</p>
                </>
              );
              const cls = "group block h-full border-b border-r border-ink p-5 transition-colors duration-300 md:p-6";
              return (
                <motion.li
                  key={item.name}
                  layout
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                  {item.href ? (
                    <a href={item.href} target="_blank" rel="noreferrer" className={`${cls} hover:bg-raised`}>
                      {body}
                      <span className="sr-only"> (opens repository in a new tab)</span>
                    </a>
                  ) : (
                    <div className={cls}>{body}</div>
                  )}
                </motion.li>
              );
            })}
          </AnimatePresence>
        </motion.ul>
      </div>
    </section>
  );
}
