import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronsDownUp, ChevronsUpDown, CornerDownRight } from "lucide-react";

const turns = [
  {
    prompt: "Explain readiness and liveness probes",
    answer:
      "A liveness probe tells Kubernetes when to restart a container that has hung. A readiness probe tells it when a container may receive traffic. During a rollout, new pods only join the Service once readiness passes, which is why a slow-starting app needs a generous initial delay. Liveness should stay cheap and local, because a probe that checks a database can turn a database blip into a restart storm.",
  },
  {
    prompt: "Compare canary and blue-green releases",
    answer:
      "Blue-green keeps two full environments and flips traffic at once, so rollback is a single switch but you pay for double capacity. Canary sends a small share of traffic to the new version and widens it as metrics stay healthy, which limits the blast radius of a bad build but needs good monitoring to decide when to promote or abort.",
  },
  {
    prompt: "What should a rollback threshold be based on?",
    answer:
      "Pick signals users feel: error rate, latency percentiles and saturation. Compare the canary against the stable version at the same time, not against a fixed number alone, so a traffic spike does not trigger a false alarm. Require the breach to hold for a short window to avoid flapping.",
  },
  {
    prompt: "Write a Prometheus alert for error rate",
    answer:
      "Use a ratio of 5xx responses to all responses over five minutes, and alert when it stays above your threshold for a few minutes. Label the alert with the deployment version so you can tell a canary regression from a general outage.",
  },
];

export default function AnswerFoldMock() {
  const [compact, setCompact] = useState(true);
  const [open, setOpen] = useState<Set<number>>(new Set());
  const [current, setCurrent] = useState(0);
  const scroller = useRef<HTMLDivElement>(null);
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  const isOpen = (i: number) => !compact || open.has(i);
  const toggle = (i: number) =>
    setOpen((s) => {
      const n = new Set(s);
      if (n.has(i)) n.delete(i);
      else n.add(i);
      return n;
    });

  const jump = (i: number) => {
    setCurrent(i);
    const el = refs.current[i];
    const box = scroller.current;
    if (el && box) box.scrollTo({ top: el.offsetTop - box.offsetTop - 8, behavior: "smooth" });
  };

  return (
    <div className="border border-line bg-surface">
      <div className="flex items-center gap-3 border-b border-line px-4 py-3">
        <span className="mono flex-1 truncate border border-line bg-bg px-3 py-1 text-xs text-mute">chat.example/c/long-conversation</span>
        <span className="mono hidden bg-accent px-2 py-1 text-[0.7rem] font-medium text-accent-ink sm:block">AnswerFold</span>
      </div>

      <div className="grid md:grid-cols-[1fr_16rem]">
        <div ref={scroller} className="scroll-thin relative h-[26rem] overflow-y-auto p-4 md:p-6">
          {turns.map((t, i) => (
            <div key={t.prompt} ref={(el) => { refs.current[i] = el; }} className="mb-6 last:mb-0">
              <p className="mono text-xs text-mute">You</p>
              <p className="mt-1 text-sm font-medium">{t.prompt}</p>
              <p className="mono mt-4 text-xs text-mute">Assistant</p>
              <div className="relative mt-1 text-sm leading-relaxed text-ink/85">
                <AnimatePresence initial={false}>
                  <motion.div
                    key={isOpen(i) ? "open" : "closed"}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.25 }}
                  >
                    {isOpen(i) ? t.answer : `${t.answer.slice(0, 92).trimEnd()}...`}
                  </motion.div>
                </AnimatePresence>
              </div>
              {compact && (
                <button
                  type="button"
                  onClick={() => toggle(i)}
                  aria-expanded={isOpen(i)}
                  className="mono mt-2 text-xs text-accent link-u"
                >
                  {isOpen(i) ? "Fold answer" : "Unfold answer"}
                </button>
              )}
            </div>
          ))}
        </div>

        <aside aria-label="AnswerFold panel" className="border-t border-line bg-bg p-4 md:border-l md:border-t-0">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Compact mode</span>
            <button
              type="button"
              role="switch"
              aria-checked={compact}
              aria-label="Compact mode"
              onClick={() => setCompact((c) => !c)}
              className={`relative h-6 w-11 border transition-colors ${compact ? "border-accent bg-accent" : "border-line-strong bg-raised"}`}
            >
              <motion.span
                className={`absolute top-0.5 h-4 w-4 ${compact ? "bg-accent-ink" : "bg-mute"}`}
                animate={{ left: compact ? 24 : 2 }}
                transition={{ type: "spring", stiffness: 500, damping: 34 }}
              />
            </button>
          </div>

          <div className="mt-3 flex gap-2">
            <button type="button" className="btn btn-sm flex-1" disabled={!compact} onClick={() => setOpen(new Set(turns.map((_, i) => i)))}>
              <ChevronsUpDown size={14} strokeWidth={1.75} /> Expand
            </button>
            <button type="button" className="btn btn-sm flex-1" disabled={!compact} onClick={() => setOpen(new Set())}>
              <ChevronsDownUp size={14} strokeWidth={1.75} /> Fold
            </button>
          </div>

          <p className="label mt-5">Your prompts</p>
          <ol className="mt-2">
            {turns.map((t, i) => (
              <li key={t.prompt}>
                <button
                  type="button"
                  onClick={() => jump(i)}
                  aria-current={current === i}
                  className={`flex w-full items-start gap-2 border-l py-2 pl-3 text-left text-xs leading-snug transition-colors ${
                    current === i ? "border-accent text-ink" : "border-line text-mute hover:text-ink"
                  }`}
                >
                  <CornerDownRight size={12} strokeWidth={1.75} className="mt-0.5 shrink-0" />
                  {t.prompt}
                </button>
              </li>
            ))}
          </ol>
        </aside>
      </div>
    </div>
  );
}
