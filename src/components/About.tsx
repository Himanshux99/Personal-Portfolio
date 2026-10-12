import Reveal from "./Reveal";

const notes = [
  {
    lead: "Curious about the whole path.",
    body: "A screen is the visible end of a request that crosses an API, a database, sometimes a model, and a server someone has to keep running. I want to understand each of those parts, so I keep moving between them.",
  },
  {
    lead: "I learn by building.",
    body: "Most of what I know came from starting something I did not yet know how to finish: a Kubernetes rollout, a SHAP explanation, a Godot lobby. The gaps show up quickly when you try to ship.",
  },
  {
    lead: "Useful before impressive.",
    body: "The projects here begin with a plain problem, like long chats, print queues or report writing, and then pick the tools. I would rather ship something small that works than list a technology I have only read about.",
  },
];

export default function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="section-pad border-t border-line">
      <div className="shell">
        <Reveal>
          <h2 id="about-title" className="display max-w-[18ch] text-[clamp(2.4rem,6.4vw,6rem)]">
            I like knowing what happens after the button is pressed.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-10 lg:mt-24 lg:grid-cols-12">
          <div className="lg:col-span-6 lg:col-start-7">
            <div className="space-y-10">
              {notes.map((n, i) => (
                <Reveal key={n.lead} delay={i * 0.06}>
                  <p className="text-lg leading-relaxed text-ink/75">
                    <strong className="font-medium text-ink">{n.lead}</strong> {n.body}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
