import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Play, RotateCcw, Zap } from "lucide-react";

const STEPS = [0, 10, 25, 50, 100];
const THRESHOLD = 5;
const HEALTHY_ERR = 0.4;
const FAULTY_ERR = 12.5;

type LogLine = { id: number; text: string; tone: "ok" | "bad" | "info" };

/** Interactive illustration of staged canary promotion with threshold rollback. Not live data. */
export default function CanarySim() {
  const [step, setStep] = useState(0);
  const [faulty, setFaulty] = useState(false);
  const [busy, setBusy] = useState(false);
  const [log, setLog] = useState<LogLine[]>([{ id: 0, text: "stable v1 serving 100% of traffic", tone: "info" }]);
  const idRef = useRef(1);
  const timers = useRef<number[]>([]);

  const push = useCallback((text: string, tone: LogLine["tone"]) => {
    setLog((l) => [...l.slice(-4), { id: idRef.current++, text, tone }]);
  }, []);

  useEffect(() => () => timers.current.forEach(window.clearTimeout), []);

  const canary = STEPS[step];
  const canaryErr = canary === 0 ? 0 : faulty ? FAULTY_ERR : HEALTHY_ERR;
  const breached = canaryErr > THRESHOLD;

  const promote = () => {
    if (busy || step >= STEPS.length - 1) return;
    const next = step + 1;
    setStep(next);
    push(`promote canary to ${STEPS[next]}%`, "info");
    setBusy(true);
    timers.current.push(
      window.setTimeout(() => {
        if (faulty) {
          push(`canary error rate ${FAULTY_ERR}% over ${THRESHOLD}% limit`, "bad");
          timers.current.push(
            window.setTimeout(() => {
              setStep(0);
              setFaulty(false);
              push("rolled back, stable v1 at 100%", "ok");
              setBusy(false);
            }, 700),
          );
        } else {
          push(next === STEPS.length - 1 ? "canary healthy, v2 is now stable" : "canary healthy, holding", "ok");
          setBusy(false);
        }
      }, 800),
    );
  };

  const reset = () => {
    timers.current.forEach(window.clearTimeout);
    timers.current = [];
    setStep(0);
    setFaulty(false);
    setBusy(false);
    setLog([{ id: idRef.current++, text: "stable v1 serving 100% of traffic", tone: "info" }]);
  };

  return (
    <div className="border border-line bg-surface">
      <div className="flex items-center justify-between border-b border-line px-4 py-3">
        <span className="label">Traffic split, simulated</span>
        <span className="label">threshold {THRESHOLD}% errors</span>
      </div>

      <div className="p-4 md:p-6">
        <div className="relative h-14 overflow-hidden border border-line-strong bg-bg">
          <div className="absolute inset-0 flex">
            <motion.div
              className="h-full bg-line-strong"
              animate={{ width: `${100 - canary}%` }}
              transition={{ type: "spring", stiffness: 140, damping: 22 }}
            />
            <motion.div
              className={`h-full ${breached ? "bg-warn" : "bg-accent"}`}
              animate={{ width: `${canary}%` }}
              transition={{ type: "spring", stiffness: 140, damping: 22 }}
            />
          </div>
          <div className="relative flex h-full items-center justify-between px-4 mono text-sm">
            <span className="text-ink">v1 stable {100 - canary}%</span>
            <span className={canary > 0 ? "font-medium text-accent-ink" : "text-mute"}>
              {canary > 0 ? `v2 canary ${canary}%` : "v2 idle"}
            </span>
          </div>
        </div>

        <dl className="mt-4 grid grid-cols-2 gap-px bg-line">
          <div className="bg-surface p-4">
            <dt className="label">v1 error rate</dt>
            <dd className="tnum mono mt-1 text-2xl">0.2%</dd>
          </div>
          <div className="bg-surface p-4">
            <dt className="label">v2 error rate</dt>
            <dd className={`tnum mono mt-1 text-2xl transition-colors ${breached ? "text-warn" : ""}`}>
              {canary === 0 ? "n/a" : `${canaryErr}%`}
            </dd>
          </div>
        </dl>

        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" className="btn btn-sm btn-primary" onClick={promote} disabled={busy || step === STEPS.length - 1}>
            <Play size={14} strokeWidth={2} /> Promote canary
          </button>
          <button
            type="button"
            className="btn btn-sm"
            aria-pressed={faulty}
            onClick={() => setFaulty((f) => !f)}
            disabled={busy}
            style={faulty ? { borderColor: "var(--color-warn)", color: "var(--color-warn)" } : undefined}
          >
            <Zap size={14} strokeWidth={2} /> Inject faults: {faulty ? "on" : "off"}
          </button>
          <button type="button" className="btn btn-sm" onClick={reset}>
            <RotateCcw size={14} strokeWidth={2} /> Reset
          </button>
        </div>

        <ul aria-live="polite" className="mono mt-4 min-h-[7.5rem] space-y-1 border-t border-line pt-3 text-xs">
          {log.map((l) => (
            <motion.li
              key={l.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              className={l.tone === "bad" ? "text-warn" : l.tone === "ok" ? "text-accent" : "text-mute"}
            >
              {l.text}
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  );
}
