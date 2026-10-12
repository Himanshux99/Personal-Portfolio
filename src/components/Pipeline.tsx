import { Fragment, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

const layers = [
  {
    name: "Interface",
    tech: ["React", "Next.js", "Tailwind"],
    built: ["AnswerFold", "V-Print", "NSS Report Generator"],
  },
  {
    name: "Application",
    tech: ["Express", "FastAPI", "PostgreSQL"],
    built: ["Zero-Downtime Deployment", "Fair Loan Underwriting", "V-Print"],
  },
  {
    name: "Intelligence",
    tech: ["PyTorch", "SHAP", "Fairlearn"],
    built: ["Fair Loan Underwriting", "Crop disease detection", "NSS Report Generator"],
  },
  {
    name: "Infrastructure",
    tech: ["Docker", "Kubernetes", "Prometheus"],
    built: ["Zero-Downtime Deployment", "NSS Report Generator"],
  },
];

/** The hero graphic: one request travelling through the layers I work across. */
export default function Pipeline() {
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="grid grid-cols-2 gap-2 lg:flex lg:items-stretch lg:gap-0" role="tablist" aria-label="Layers I build across">
        {layers.map((l, i) => (
          <Fragment key={l.name}>
            <button
              type="button"
              role="tab"
              id={`layer-tab-${i}`}
              aria-selected={active === i}
              aria-controls="layer-panel"
              onClick={() => setActive(i)}
              onMouseEnter={() => setActive(i)}
              className={`relative min-w-0 flex-1 basis-0 border p-4 text-left transition-colors duration-300 md:p-5 ${
                active === i ? "border-accent bg-raised" : "border-line bg-surface hover:border-line-strong"
              }`}
            >
              <span className="mono block text-[0.7rem] text-mute">0{i + 1}</span>
              <span className="mt-3 block text-lg font-medium tracking-tight md:text-xl">{l.name}</span>
              <span className="mono mt-2 block text-[0.72rem] leading-relaxed text-mute">{l.tech.map((t) => (
                  <span key={t} className="mr-2 inline-block whitespace-nowrap">{t}</span>
                ))}</span>
            </button>
            {i < layers.length - 1 && (
              <div aria-hidden className="relative hidden w-14 shrink-0 self-center overflow-hidden lg:block lg:w-16">
                <div className="h-px w-full bg-line-strong" />
                <motion.div
                  className="absolute left-0 top-0 h-px w-1/3 bg-accent"
                  animate={{ x: ["-100%", "300%"] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "linear", delay: i * 0.45 }}
                />
              </div>
            )}
          </Fragment>
        ))}
      </div>

      <div
        id="layer-panel"
        role="tabpanel"
        aria-labelledby={`layer-tab-${active}`}
        className="mt-3 flex min-h-[3.25rem] flex-wrap items-center gap-x-4 gap-y-1 border border-line px-4 py-3"
      >
        <span className="label">Built here</span>
        <AnimatePresence mode="wait">
          <motion.ul
            key={active}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22 }}
            className="flex flex-wrap gap-x-5 gap-y-1 text-sm"
          >
            {layers[active].built.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </motion.ul>
        </AnimatePresence>
      </div>
    </div>
  );
}
