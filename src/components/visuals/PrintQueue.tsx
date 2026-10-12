import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { FileText, Plus } from "lucide-react";

type State = "queued" | "printing" | "ready";
interface Job {
  id: number;
  file: string;
  pages: number;
  mode: string;
  state: State;
}

const names = ["os-lab-report.pdf", "dbms-assignment.pdf", "nss-camp-forms.pdf", "mini-project-synopsis.pdf"];
const flow: State[] = ["queued", "printing", "ready"];

const start: Job[] = [
  { id: 1, file: "java-notes-unit3.pdf", pages: 14, mode: "B/W, duplex", state: "ready" },
  { id: 2, file: "cn-lab-manual.pdf", pages: 22, mode: "B/W", state: "printing" },
  { id: 3, file: "poster-draft.pdf", pages: 1, mode: "Colour, A3", state: "queued" },
  { id: 4, file: "dbms-lab-record.pdf", pages: 18, mode: "B/W, duplex", state: "queued" },
  { id: 5, file: "nss-camp-report.pdf", pages: 9, mode: "Colour", state: "queued" },
  { id: 6, file: "internship-letter.pdf", pages: 2, mode: "B/W", state: "queued" },
];

export default function PrintQueue() {
  const [jobs, setJobs] = useState<Job[]>(start);
  const nextId = useRef(7);
  const nameIdx = useRef(0);

  const advance = (id: number) =>
    setJobs((js) =>
      js.map((j) => (j.id === id && j.state !== "ready" ? { ...j, state: flow[flow.indexOf(j.state) + 1] } : j)),
    );

  const submit = () => {
    const file = names[nameIdx.current++ % names.length];
    setJobs((js) => [
      ...js.slice(-5),
      { id: nextId.current++, file, pages: 4 + ((nextId.current * 7) % 20), mode: "B/W", state: "queued" },
    ]);
  };

  return (
    <div className="border border-line bg-surface">
      <div className="flex items-center justify-between border-b border-line px-4 py-3">
        <span className="label">Print queue, demo jobs</span>
        <button type="button" className="btn btn-sm btn-primary" onClick={submit}>
          <Plus size={14} strokeWidth={2} /> Submit a job
        </button>
      </div>
      <ul className="divide-y divide-line">
        <AnimatePresence initial={false}>
          {jobs.map((j) => (
            <motion.li
              key={j.id}
              layout
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ type: "spring", stiffness: 380, damping: 32 }}
              className="flex items-center gap-3 px-4 py-3"
            >
              <FileText size={18} strokeWidth={1.5} className="shrink-0 text-mute" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm">{j.file}</p>
                <p className="mono text-[0.7rem] text-mute">
                  {j.pages} pages, {j.mode}
                </p>
              </div>
              <button
                type="button"
                onClick={() => advance(j.id)}
                disabled={j.state === "ready"}
                aria-label={`${j.file} is ${j.state}${j.state !== "ready" ? ", press to move to the next stage" : ""}`}
                className={`mono min-w-[5.5rem] border px-2.5 py-1.5 text-center text-xs transition-colors ${
                  j.state === "ready"
                    ? "border-accent bg-accent text-accent-ink"
                    : j.state === "printing"
                      ? "border-accent text-signal hover:bg-accent/10"
                      : "border-line-strong text-mute hover:border-ink hover:text-ink"
                }`}
              >
                {j.state}
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
      <p className="border-t border-line px-4 py-3 text-xs text-mute">Press a status to advance that job.</p>
    </div>
  );
}
