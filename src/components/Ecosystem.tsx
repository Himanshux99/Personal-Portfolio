import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { ecosystem, languages, playground, projects } from "../data/content";
import Reveal from "./Reveal";

interface Source {
  id: string;
  name: string;
  stack: string[];
}

export default function Ecosystem() {
  const sources: Source[] = useMemo(
    () => [
      ...projects.map((p) => ({ id: p.id, name: p.name, stack: p.stack })),
      ...playground.filter((p) => p.stack).map((p) => ({ id: p.name, name: p.name, stack: p.stack! })),
    ],
    [],
  );
  const [selected, setSelected] = useState<string | null>(null);
  const used = useMemo(() => new Set(sources.find((s) => s.id === selected)?.stack ?? []), [sources, selected]);

  const state = (item: string) => (!selected ? "idle" : used.has(item) ? "on" : "off");

  return (
    <section id="stack" aria-labelledby="stack-title" className="section-pad border-t border-line">
      <div className="shell">
        <Reveal>
          <h2 id="stack-title" className="h2 max-w-[14ch]">
            Tools, in context
          </h2>
          <p className="mt-6 max-w-[52ch] text-lg text-ink/75">
            Not every tool here is equally deep, and nothing is scored. Pick a project to see what it actually used.
          </p>
        </Reveal>

        <Reveal className="mt-10" delay={0.05}>
          <div role="group" aria-label="Highlight tools used by a project" className="flex flex-wrap gap-2">
            {sources.map((s) => (
              <button
                key={s.id}
                type="button"
                aria-pressed={selected === s.id}
                onClick={() => setSelected((cur) => (cur === s.id ? null : s.id))}
                className={`relative border px-3 py-2 text-sm transition-colors ${
                  selected === s.id ? "border-accent text-accent-ink" : "border-line-strong text-ink/80 hover:border-ink hover:text-ink"
                }`}
              >
                {selected === s.id && (
                  <motion.span
                    layoutId="eco-chip"
                    className="absolute inset-0 -z-10 bg-accent"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
                <span className="relative">{s.name}</span>
              </button>
            ))}
          </div>
        </Reveal>

        <div className="mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-5">
          {ecosystem.map((g, gi) => (
            <Reveal key={g.title} delay={gi * 0.05}>
              <div className="relative border-t border-line-strong pt-4">
                <span aria-hidden className="absolute -top-px left-0 h-px w-10 bg-accent" />
                <h3 className="text-xl font-medium tracking-tight">{g.title}</h3>
                <p className="mt-1 text-sm text-mute">{g.blurb}</p>
                <ul className="mono mt-5 space-y-2 text-[0.8rem]">
                  {g.items.map((item) => (
                    <li
                      key={item}
                      data-state={state(item)}
                      className="flex items-center gap-2 transition-opacity duration-300 data-[state=off]:opacity-30 data-[state=on]:text-accent"
                    >
                      <span
                        aria-hidden
                        className={`h-px transition-all duration-300 ${state(item) === "on" ? "w-4 bg-accent" : "w-2 bg-line-strong"}`}
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-14">
          <div className="border-t border-line pt-6">
            <p className="label">Languages</p>
            <ul className="mono mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm">
              {languages.map((l) => (
                <li
                  key={l}
                  data-state={state(l)}
                  className="transition-opacity duration-300 data-[state=off]:opacity-30 data-[state=on]:text-accent"
                >
                  {l}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
