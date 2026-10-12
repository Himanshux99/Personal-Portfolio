import { background } from "../data/content";
import Reveal from "./Reveal";
import SplitHeading from "./SplitHeading";

export default function Background() {
  return (
    <section id="background" aria-labelledby="bg-title" className="section-pad border-t border-ink">
      <div className="shell">
        <Reveal>
          <p className="label">Background</p>
          <SplitHeading id="bg-title" className="h2 mt-4" text="Where I study" />
        </Reveal>

        <div className="mt-14 grid border border-ink md:mt-20 lg:grid-cols-12">
          <Reveal className="border-b border-ink p-5 md:p-8 lg:col-span-5 lg:border-b-0 lg:border-r">
            <p className="mono text-[0.7rem] uppercase text-signal">{background.years}</p>
            <p className="mt-4 text-[clamp(1.6rem,2.8vw,2.4rem)] font-semibold uppercase leading-[0.98] tracking-[-0.04em]">
              {background.degree}
            </p>
            <p className="mt-3 text-ink/75">{background.school}</p>
          </Reveal>

          <dl className="grid sm:grid-cols-2 lg:col-span-7">
            {background.highlights.map((h, i) => (
              <Reveal
                key={h.title}
                delay={i * 0.04}
                className="border-b border-line-strong p-5 last:border-b-0 sm:odd:border-r sm:[&:nth-last-child(2)]:border-b-0 md:p-6"
              >
                <dt className="font-semibold uppercase tracking-[-0.02em]">{h.title}</dt>
                <dd className="mt-1.5 text-sm leading-relaxed text-mute">{h.body}</dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
