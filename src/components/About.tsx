import { Compass, Hammer, Wrench } from "lucide-react";
import Reveal from "./Reveal";
import SplitHeading from "./SplitHeading";

const notes = [
  {
    icon: Compass,
    title: "Curious about the whole path",
    body: "A screen is the visible end of a request that crosses an API, a database, sometimes a model, and a server someone has to keep running. I keep moving between those parts to understand each one.",
  },
  {
    icon: Hammer,
    title: "I learn by building",
    body: "Most of what I know came from starting something I did not yet know how to finish: a Kubernetes rollout, a SHAP explanation, a Godot lobby. The gaps show up quickly when you try to ship.",
  },
  {
    icon: Wrench,
    title: "Useful before impressive",
    body: "The projects here begin with a plain problem, like long chats, print queues or report writing, and then pick the tools. I would rather ship something small that works than list a technology I have only read about.",
  },
];

export default function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="section-pad border-t border-ink">
      <div className="shell">
        <Reveal>
          <p className="label">About</p>
          <SplitHeading id="about-title" className="h2 mt-4 max-w-[16ch]" text="I like knowing what happens after the button is pressed." />
        </Reveal>

        <div className="mt-14 grid border border-ink md:mt-20 md:grid-cols-3">
          {notes.map((n, i) => (
            <Reveal key={n.title} delay={i * 0.07} className="border-b border-ink last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0">
              <div className="flex h-full flex-col">
                <div className="draft-dots grid h-44 place-items-center border-b border-line-strong bg-surface/60">
                  <n.icon size={72} strokeWidth={0.6} aria-hidden />
                </div>
                <div className="flex flex-1 flex-col p-5 md:p-7">
                  <span className="mono text-[0.7rem] uppercase text-mute">[{String(i + 1).padStart(2, "0")}]</span>
                  <h3 className="mt-3 text-2xl font-semibold uppercase leading-[0.98] tracking-[-0.04em]">{n.title}</h3>
                  <p className="mt-4 text-[0.95rem] leading-relaxed text-ink/75">{n.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
