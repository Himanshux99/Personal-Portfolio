import { useState } from "react";
import { motion } from "motion/react";

/** Synthetic applicant. Signed contributions, drawn as a diverging bar chart without tracks. */
const factors = [
  { label: "Rent paid on schedule", detail: "Recurring transfers land within the same week each month", value: 0.82 },
  { label: "Income deposits are regular", detail: "Deposits arrive at steady intervals", value: 0.55 },
  { label: "Cash buffer after bills", detail: "Balance rarely drops to zero before the next deposit", value: 0.3 },
  { label: "Short account history", detail: "Only a few months of data are available", value: -0.48 },
  { label: "One large irregular outflow", detail: "A single transfer well above the usual pattern", value: -0.22 },
];

const decisions = ["Approve", "Request more info", "Decline"] as const;

export default function LoanReview() {
  const [hover, setHover] = useState<number | null>(null);
  const [decision, setDecision] = useState<(typeof decisions)[number] | null>(null);

  return (
    <div className="border border-line bg-surface">
      <div className="flex items-center justify-between border-b border-line px-4 py-3">
        <span className="label">Applicant review, synthetic data</span>
        <span className="label">no credit file</span>
      </div>

      <div className="p-4 md:p-6">
        <p className="label">Why the model leans where it does</p>
        <ul className="mt-4 space-y-3">
          {factors.map((f, i) => (
            <li key={f.label} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
              <div className="flex items-baseline justify-between gap-4 text-sm">
                <span className={hover === i ? "text-ink" : "text-ink/80"}>{f.label}</span>
                <span className={`mono text-xs ${f.value > 0 ? "text-accent" : "text-warn"}`}>
                  {f.value > 0 ? "raises" : "lowers"}
                </span>
              </div>
              <div className="relative mt-1.5 h-3">
                <span className="absolute inset-y-0 left-1/2 w-px bg-line-strong" aria-hidden />
                <motion.span
                  aria-hidden
                  className={`absolute inset-y-0 ${f.value > 0 ? "left-1/2 origin-left bg-accent" : "right-1/2 origin-right bg-warn"}`}
                  style={{ width: `${Math.abs(f.value) * 50}%` }}
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.1 * i, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
              <p
                className={`mt-1 text-xs text-mute transition-all duration-300 ${
                  hover === i ? "max-h-6 opacity-100" : "max-h-0 overflow-hidden opacity-0"
                }`}
              >
                {f.detail}
              </p>
            </li>
          ))}
        </ul>

        <div className="mt-6 border-t border-line pt-4">
          <p className="text-sm">
            Model suggestion: <span className="font-medium text-ink">refer to a human reviewer.</span>
          </p>
          <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Reviewer decision">
            {decisions.map((d) => (
              <button
                key={d}
                type="button"
                aria-pressed={decision === d}
                onClick={() => setDecision(d)}
                className={`btn btn-sm ${decision === d ? "!border-accent !bg-accent !text-accent-ink" : ""}`}
              >
                {d}
              </button>
            ))}
          </div>
          <p aria-live="polite" className="mono mt-3 min-h-5 text-xs text-mute">
            {decision ? `Recorded: ${decision.toLowerCase()}, with the factors above attached.` : "The reviewer decides. Reasons travel with the decision."}
          </p>
        </div>
      </div>
    </div>
  );
}
