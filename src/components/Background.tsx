import { background } from "../data/content";
import Reveal from "./Reveal";

export default function Background() {
  return (
    <section id="background" aria-labelledby="bg-title" className="section-pad border-t border-line">
      <div className="shell grid gap-14 lg:grid-cols-12">
        <Reveal className="lg:col-span-5">
          <h2 id="bg-title" className="h2">
            Background
          </h2>
          <p className="mt-10 text-2xl font-medium leading-tight tracking-tight">{background.degree}</p>
          <p className="mt-2 text-lg text-ink/75">{background.school}</p>
          <p className="mono mt-3 text-sm text-accent">{background.years}</p>
        </Reveal>

        <dl className="grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:col-span-7">
          {background.highlights.map((h, i) => (
            <Reveal key={h.title} delay={i * 0.05}>
              <div className="border-t border-line pt-4">
                <dt className="font-medium tracking-tight">{h.title}</dt>
                <dd className="mt-1.5 text-sm leading-relaxed text-mute">{h.body}</dd>
              </div>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
