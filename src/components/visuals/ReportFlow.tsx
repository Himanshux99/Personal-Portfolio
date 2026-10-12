import type { ReactNode } from "react";
import { motion } from "motion/react";
import { ArrowDown } from "lucide-react";

const ease = [0.16, 1, 0.3, 1] as const;

const log = [
  "Mon 14:02  Plantation drive confirmed",
  "Mon 14:05  Venue: college garden",
  "Tue 09:10  Volunteers: 18 boys, 22 girls",
];

const fields = [
  ["Event", "Plantation drive"],
  ["Venue", "College garden"],
  ["Attendance", "40 (18 + 22)"],
];

const sections = ["Objectives", "Narrative", "Impact", "Conclusion", "Photos", "Signature"];

function Step({ n, title, delay, children }: { n: string; title: string; delay: number; children: ReactNode }) {
  return (
    <motion.div
      className="flex-1 border border-line bg-surface p-4"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.7, delay, ease }}
    >
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-medium">{title}</span>
        <span className="label">{n}</span>
      </div>
      <div className="mt-3">{children}</div>
    </motion.div>
  );
}

export default function ReportFlow() {
  return (
    <div>
      <div className="flex flex-col items-stretch gap-2">
        <Step n="in" title="Paste the log" delay={0}>
          <div className="mono space-y-1 text-[0.72rem] leading-relaxed text-mute">
            {log.map((l) => (
              <p key={l}>{l}</p>
            ))}
          </div>
        </Step>
        <ArrowDown aria-hidden size={18} strokeWidth={1.5} className="mx-auto shrink-0 text-signal" />
        <Step n="parse" title="Extract and draft" delay={0.12}>
          <dl className="space-y-1 text-[0.8rem]">
            {fields.map(([k, v]) => (
              <div key={k} className="flex justify-between gap-3 border-b border-line pb-1 last:border-0">
                <dt className="text-mute">{k}</dt>
                <dd className="mono">{v}</dd>
              </div>
            ))}
          </dl>
        </Step>
        <ArrowDown aria-hidden size={18} strokeWidth={1.5} className="mx-auto shrink-0 text-signal" />
        <Step n="out" title="Report.docx" delay={0.24}>
          <ul className="grid grid-cols-2 gap-x-3 gap-y-1 text-[0.8rem]">
            {sections.map((s) => (
              <li key={s} className="border-b border-line pb-1 text-ink/80">
                {s}
              </li>
            ))}
          </ul>
        </Step>
      </div>
    </div>
  );
}
