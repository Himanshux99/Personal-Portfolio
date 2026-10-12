const items = ["Interfaces", "Intelligent systems", "Deployment pipelines", "Interactive experiences", "Built to be understood"];

/** The page's one marquee. */
export default function Marquee() {
  const row = items.map((t) => (
    <span key={t} className="mono flex items-center gap-8 pr-8 text-[0.7rem] uppercase tracking-[0.04em]">
      {t}
      <span aria-hidden className="text-signal">/</span>
    </span>
  ));
  return (
    <div className="overflow-hidden border-y border-ink bg-bg py-3" role="presentation">
      <div className="marquee-track flex w-max">
        <div className="flex">{row}</div>
        <div className="flex" aria-hidden>
          {row}
        </div>
      </div>
    </div>
  );
}
