import { useId, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Minus, Plus } from "lucide-react";
import { projects, type Project, type ProjectId } from "../data/content";
import Reveal from "./Reveal";
import CanarySim from "./visuals/CanarySim";
import LoanReview from "./visuals/LoanReview";
import AnswerFoldMock from "./visuals/AnswerFoldMock";
import ReportFlow from "./visuals/ReportFlow";
import PrintQueue from "./visuals/PrintQueue";
import LanLobby from "./visuals/LanLobby";

const byId = (id: ProjectId) => projects.find((p) => p.id === id)!;

const statusStyle: Record<Project["status"]["kind"], string> = {
  live: "border-accent text-accent",
  built: "border-accent text-accent",
  wip: "border-line-strong text-ink",
  concept: "border-line-strong text-mute",
};

function ProjectText({ project, index }: { project: Project; index: number }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <span className="mono text-sm text-mute">{String(index + 1).padStart(2, "0")}</span>
        <span className={`mono border px-2 py-0.5 text-[0.7rem] ${statusStyle[project.status.kind]}`}>
          {project.status.label}
        </span>
      </div>
      <h3 id={`${project.id}-title`} className="mt-4 text-[clamp(1.9rem,3.4vw,3rem)] font-semibold leading-[1.02] tracking-[-0.035em]">
        {project.name}
      </h3>
      <p className="mt-4 max-w-[44ch] text-lg leading-snug text-ink/80">{project.kicker}</p>

      <p className="mono mt-5 text-xs leading-relaxed text-mute">{project.stack.join(" / ")}</p>

      <div className="mt-6 flex flex-wrap gap-2">
        <button
          type="button"
          className="btn btn-sm"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <Minus size={14} strokeWidth={2} /> : <Plus size={14} strokeWidth={2} />}
          {open ? "Hide details" : "Details"}
        </button>
        {project.links.map((l) => (
          <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className="btn btn-sm">
            {l.label}
            <ArrowUpRight size={14} strokeWidth={1.75} />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        ))}
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-6 space-y-5 border-t border-line pt-5 text-sm leading-relaxed">
              <div>
                <h4 className="label">The problem</h4>
                <p className="mt-1.5 max-w-[56ch] text-ink/85">{project.problem}</p>
              </div>
              <div>
                <h4 className="label">What it covers</h4>
                <ul className="mt-1.5 max-w-[56ch] list-disc space-y-1 pl-4 text-ink/85 marker:text-accent">
                  {project.built.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="label">What I am not claiming</h4>
                <p className="mt-1.5 max-w-[56ch] text-mute">{project.honesty}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Feature({ id, index, visual, flip, children }: { id: ProjectId; index: number; visual: ReactNode; flip?: boolean; children?: ReactNode }) {
  const project = byId(id);
  return (
    <article id={id} className="scroll-mt-24 border-t border-line pt-10 md:pt-14" aria-labelledby={`${id}-title`}>
      <Reveal>
        <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-14">
          <div className={`lg:col-span-5 ${flip ? "lg:order-2" : ""}`}>
            <ProjectText project={project} index={index} />
            {children}
          </div>
          <div className={`lg:col-span-7 ${flip ? "lg:order-1" : ""}`}>{visual}</div>
        </div>
      </Reveal>
    </article>
  );
}

export default function Work() {
  const nss = byId("nss");
  const vprint = byId("vprint");
  const lan = byId("lan-game");
  const af = byId("answerfold");

  return (
    <section id="work" aria-labelledby="work-title" className="section-pad">
      <div className="shell">
        <Reveal>
          <h2 id="work-title" className="h2 max-w-[16ch]">
            Selected work
          </h2>
          <p className="mt-6 max-w-[52ch] text-lg text-ink/75">
            Six projects, each at its real stage. Some are working repositories, some are concepts. The label on each says which.
          </p>
        </Reveal>

        <div className="mt-16 space-y-16 md:mt-24 md:space-y-24">
          <Feature id="zero-downtime" index={0} visual={<CanarySim />} />
          <Feature id="loan" index={1} visual={<LoanReview />} flip />

          <article id="answerfold" className="scroll-mt-24 border-t border-line pt-10 md:pt-14">
            <Reveal>
              <div className="grid items-end gap-10 lg:grid-cols-12">
                <div className="lg:col-span-6">
                  <ProjectText project={af} index={2} />
                </div>
              </div>
              <div className="mt-10">
                <AnswerFoldMock />
              </div>
            </Reveal>
          </article>

          <div className="grid gap-16 border-t border-line pt-10 md:pt-14 lg:grid-cols-2 lg:gap-14">
            <article id="nss" className="scroll-mt-24">
              <Reveal>
                <ProjectText project={nss} index={3} />
                <div className="mt-8">
                  <ReportFlow />
                </div>
              </Reveal>
            </article>
            <article id="vprint" className="scroll-mt-24">
              <Reveal delay={0.1}>
                <ProjectText project={vprint} index={4} />
                <div className="mt-8">
                  <PrintQueue />
                </div>
              </Reveal>
            </article>
          </div>

          <article id="lan-game" className="scroll-mt-24 border-t border-line pt-10 md:pt-14">
            <Reveal>
              <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-14">
                <div className="lg:col-span-5">
                  <ProjectText project={lan} index={5} />
                </div>
                <div className="lg:col-span-7">
                  <LanLobby />
                </div>
              </div>
            </Reveal>
          </article>
        </div>
      </div>
    </section>
  );
}
