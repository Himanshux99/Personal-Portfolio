import { useId, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Minus, Plus } from "lucide-react";
import { projects, type Project, type ProjectId } from "../data/content";
import Reveal from "./Reveal";
import SplitHeading from "./SplitHeading";
import CanarySim from "./visuals/CanarySim";
import LoanReview from "./visuals/LoanReview";
import AnswerFoldMock from "./visuals/AnswerFoldMock";
import ReportFlow from "./visuals/ReportFlow";
import PrintQueue from "./visuals/PrintQueue";
import LanLobby from "./visuals/LanLobby";

const byId = (id: ProjectId) => projects.find((p) => p.id === id)!;

const statusStyle: Record<Project["status"]["kind"], string> = {
  live: "bg-accent text-accent-ink border-accent",
  built: "bg-accent text-accent-ink border-accent",
  wip: "border-ink text-ink",
  concept: "border-line-strong text-mute",
};

/** Title bar of a drawing sheet: index on the left, status on the right. */
function SheetBar({ project, index }: { project: Project; index: number }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-ink px-4 py-2.5 md:px-6">
      <span className="mono text-[0.7rem] uppercase">
        [{String(index + 1).padStart(2, "0")}] / 06
      </span>
      <span className={`mono border px-2 py-0.5 text-[0.66rem] uppercase ${statusStyle[project.status.kind]}`}>
        {project.status.label}
      </span>
    </div>
  );
}

function ProjectText({ project }: { project: Project }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <div>
      <h3
        id={`${project.id}-title`}
        className="text-[clamp(1.8rem,3.2vw,3rem)] font-semibold uppercase leading-[0.95] tracking-[-0.045em]"
      >
        {project.name}
      </h3>
      <p className="mt-4 max-w-[44ch] text-[1.05rem] leading-snug text-ink/80">{project.kicker}</p>

      <p className="mono mt-5 text-[0.68rem] uppercase leading-relaxed text-mute">{project.stack.join(" / ")}</p>

      <div className="mt-6 flex flex-wrap gap-2">
        <button
          type="button"
          className="btn btn-sm"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <Minus size={14} strokeWidth={1.5} /> : <Plus size={14} strokeWidth={1.5} />}
          {open ? "Hide details" : "Details"}
        </button>
        {project.links.map((l) => (
          <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className="btn btn-sm">
            {l.label}
            <ArrowUpRight size={14} strokeWidth={1.5} />
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
            <div className="mt-6 space-y-5 border-t border-ink pt-5 text-sm leading-relaxed">
              <div>
                <h4 className="label">The problem</h4>
                <p className="mt-1.5 max-w-[56ch] text-ink/85">{project.problem}</p>
              </div>
              <div>
                <h4 className="label">What it covers</h4>
                <ul className="mt-1.5 max-w-[56ch] list-disc space-y-1 pl-4 text-ink/85 marker:text-signal">
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

function Sheet({ id, index, children, className = "" }: { id: ProjectId; index: number; children: ReactNode; className?: string }) {
  const project = byId(id);
  return (
    <Reveal className={className}>
      <article id={id} aria-labelledby={`${id}-title`} className="flex h-full scroll-mt-20 flex-col border border-ink bg-bg">
        <SheetBar project={project} index={index} />
        {children}
      </article>
    </Reveal>
  );
}

const visualCell = "draft-dots border-t border-ink bg-surface/60 p-4 md:p-8 lg:border-l lg:border-t-0";

export default function Work() {
  return (
    <section id="work" aria-labelledby="work-title" className="section-pad">
      <div className="shell">
        <Reveal>
          <p className="label">Projects</p>
          <SplitHeading id="work-title" className="h2 mt-4 max-w-[12ch]" text="Selected work" />
          <p className="mt-6 max-w-[52ch] text-lg text-ink/75">
            Six projects, each at its real stage. Some are working repositories, some are concepts. The label on each says which.
          </p>
        </Reveal>

        <div className="mt-14 space-y-6 md:mt-20 md:space-y-8">
          <Sheet id="zero-downtime" index={0}>
            <div className="grid lg:grid-cols-12">
              <div className="p-5 md:p-8 lg:col-span-5">
                <ProjectText project={byId("zero-downtime")} />
              </div>
              <div className={`${visualCell} lg:col-span-7`}>
                <CanarySim />
              </div>
            </div>
          </Sheet>

          <Sheet id="loan" index={1}>
            <div className="grid lg:grid-cols-12">
              <div className={`${visualCell} order-2 lg:order-1 lg:col-span-7 lg:border-l-0 lg:border-r`}>
                <LoanReview />
              </div>
              <div className="order-1 p-5 md:p-8 lg:order-2 lg:col-span-5">
                <ProjectText project={byId("loan")} />
              </div>
            </div>
          </Sheet>

          <Sheet id="answerfold" index={2}>
            <div className="p-5 md:p-8">
              <div className="max-w-3xl">
                <ProjectText project={byId("answerfold")} />
              </div>
            </div>
            <div className="draft-dots hidden border-t border-ink bg-surface/60 p-4 md:block md:p-8">
              <AnswerFoldMock />
            </div>
          </Sheet>

          <div className="grid gap-6 md:gap-8 lg:grid-cols-2">
            <Sheet id="nss" index={3} className="h-full">
              <div className="p-5 md:p-8">
                <ProjectText project={byId("nss")} />
              </div>
              <div className="draft-dots flex-1 border-t border-ink bg-surface/60 p-4 md:p-8">
                <ReportFlow />
              </div>
            </Sheet>
            <Sheet id="vprint" index={4} className="h-full">
              <div className="p-5 md:p-8">
                <ProjectText project={byId("vprint")} />
              </div>
              <div className="draft-dots flex-1 border-t border-ink bg-surface/60 p-4 md:p-8">
                <PrintQueue />
              </div>
            </Sheet>
          </div>

          <Sheet id="lan-game" index={5}>
            <div className="grid lg:grid-cols-12">
              <div className="p-5 md:p-8 lg:col-span-5">
                <ProjectText project={byId("lan-game")} />
              </div>
              <div className={`${visualCell} lg:col-span-7`}>
                <LanLobby />
              </div>
            </div>
          </Sheet>
        </div>
      </div>
    </section>
  );
}
