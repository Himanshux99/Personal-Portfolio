import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowDown,
  ArrowUp,
  AudioLines,
  Check,
  Copy,
  Ellipsis,
  Library,
  Lightbulb,
  Maximize2,
  MessageCircle,
  Mic,
  Pin,
  Plus,
  RefreshCw,
  Search,
  Share,
  SquarePen,
  ThumbsDown,
  ThumbsUp,
  Volume2,
} from "lucide-react";

/*
 * A mock of a long ChatGPT conversation with the AnswerFold extension layered on top.
 * Visuals imitate ChatGPT's dark theme for illustration. It is not affiliated with OpenAI,
 * and every word of conversation text is placeholder content.
 */

const LINE_HEIGHT = 26; // px, matches leading below
const FOLDED_LINES = 3;
const STEP_LINES = 20;

interface Turn {
  prompt: string;
  title: string;
  paragraphs: string[];
}

const turns: Turn[] = [
  {
    prompt: "Explain readiness and liveness probes",
    title: "Readiness and liveness probes",
    paragraphs: [
      "A liveness probe answers one question: is this container stuck? If the probe fails enough times in a row, Kubernetes kills the container and starts a new one. It is meant for deadlocks and hangs that the process cannot recover from by itself, so the check should be cheap, local and independent of other services.",
      "A readiness probe answers a different question: should this pod receive traffic right now? A failing readiness probe does not restart anything. It simply removes the pod from the Service endpoints until it passes again. During a rolling update, new pods only start taking requests once readiness succeeds, which is what stops a slow start from turning into errors for users.",
      "Slow applications also benefit from a startup probe, which holds off the other two until the app has finished booting. A common mistake is pointing liveness at a database check. When the database blips, every pod fails liveness at once and the cluster restarts the whole service, which turns a small outage into a large one. Keep dependency checks in readiness and keep liveness boring.",
      "In practice I give each probe its own path, such as /healthz for liveness and /ready for readiness, and I set timeouts generous enough that a garbage collection pause does not count as a failure.",
    ],
  },
  {
    prompt: "Compare canary and blue-green releases",
    title: "Canary and blue-green releases",
    paragraphs: [
      "Blue-green keeps two complete environments side by side. The blue one serves users while the green one receives the new version and gets tested without real traffic. When it looks healthy, you switch the router, load balancer or Service selector, and green becomes live. Rollback is the same switch in reverse, which is its biggest strength.",
      "The cost is capacity and state. You pay for two full environments during the release, and anything stateful, like a database schema, has to work with both versions at the same time. That usually means making migrations backward compatible and splitting risky changes into several smaller releases.",
      "A canary release sends a small share of real traffic to the new version first, for example ten percent through a weighted ingress. You watch error rate, latency and saturation for the canary and compare them with the stable version. If the numbers hold, you widen the share in steps. If they cross a threshold, you send everything back to stable.",
      "Canary limits the blast radius of a bad build, because only a slice of users ever sees it, but it depends on good monitoring. Without trustworthy metrics you cannot tell a healthy canary from a quietly failing one. It also means two versions serve traffic at once for a while, so sessions, caches and API contracts need to tolerate that.",
      "Neither is strictly better. Blue-green is simple and fast to reverse when you can afford the capacity. Canary is gentler on users and cheaper to run, but it asks more of your observability. Many teams combine them: validate in a green environment first, then shift traffic gradually.",
      "A good rule of thumb is to pick the strategy by asking what a bad release would cost. If a few minutes of errors for everyone is unacceptable, shift gradually. If you need an instant escape hatch above all else, keep the old environment warm.",
      "Whichever you choose, practise the rollback before you need it. A rollback path that has never been exercised is a hope, not a plan, and the first time you run it should not be during an incident.",
    ],
  },
  {
    prompt: "What should a rollback threshold be based on?",
    title: "Choosing a rollback threshold",
    paragraphs: [
      "Base the threshold on signals that users actually feel: the share of requests that fail, latency at the 95th and 99th percentiles, and how close the service is to saturation. CPU alone is rarely a good rollback trigger.",
      "Compare the canary against the stable version over the same time window instead of relying on one fixed number. If traffic spikes or a dependency slows down, both versions suffer together and the comparison stays fair. A fixed limit, such as five percent errors, is still a useful safety net on top.",
      "Require the breach to last for a short window before acting, so a single bad second does not cause flapping, and make the decision automatic so nobody has to be awake for it. Finally, rehearse it: inject faults on purpose and confirm that the rollback really happens.",
    ],
  },
  {
    prompt: "Write a Prometheus alert for error rate",
    title: "Alerting on error rate",
    paragraphs: [
      "Use the ratio of failed responses to all responses over a window of a few minutes, not a raw count, so the alert scales with traffic. In Prometheus that is a rate of 5xx responses divided by a rate of all responses.",
      "Alert when the ratio stays above your threshold for several minutes, and label the alert with the version or deployment so you can tell a canary regression from a general outage at a glance.",
    ],
  },
];

type Mode = "folded" | "partial" | "full";

function IconSpan({ children }: { children: React.ReactNode }) {
  return (
    <span aria-hidden className="grid h-8 w-8 place-items-center text-[#b4b4b4]">
      {children}
    </span>
  );
}

function AnswerCard({
  turn,
  mode,
  compact,
  onMode,
}: {
  turn: Turn;
  mode: Mode;
  compact: boolean;
  onMode: (m: Mode) => void;
}) {
  const inner = useRef<HTMLDivElement>(null);
  const [contentH, setContentH] = useState(0);
  const [copied, setCopied] = useState(false);

  useLayoutEffect(() => {
    const el = inner.current;
    if (!el) return;
    const measure = () => setContentH(el.offsetHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const total = Math.max(1, Math.round(contentH / LINE_HEIGHT));
  const foldedH = FOLDED_LINES * LINE_HEIGHT;
  const partialH = Math.min(contentH, (FOLDED_LINES + STEP_LINES) * LINE_HEIGHT);
  const canFold = compact && contentH > 0 && total > FOLDED_LINES + 1;
  const partialIsFull = partialH >= contentH;

  const effective: Mode = !canFold ? "full" : mode;
  const height = contentH === 0 ? "auto" : effective === "folded" ? foldedH : effective === "partial" ? partialH : contentH;
  const faded = canFold && effective !== "full";
  const remainingNow = total - (effective === "folded" ? FOLDED_LINES : FOLDED_LINES + STEP_LINES);
  const step = Math.max(1, Math.min(STEP_LINES, remainingNow));

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(turn.paragraphs.join("\n\n"));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable in this context */
    }
  };

  const expand = () => onMode(effective === "folded" && !partialIsFull ? "partial" : "full");

  return (
    <div>
      <h4 className="mb-5 text-[1.2rem] font-semibold leading-tight text-[#f3f3f3]">{turn.title}</h4>

      <div className="rounded-[1.5rem] bg-[#2a2a2a]">
        <div className="flex items-center justify-between px-5 pt-3.5">
          <span className="text-sm text-[#b4b4b4]">Writing</span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={copy}
              aria-label={copied ? "Copied" : "Copy answer"}
              className="grid h-8 w-8 place-items-center rounded-lg text-[#d6d6d6] transition-colors hover:bg-white/10"
            >
              {copied ? <Check size={18} strokeWidth={1.5} /> : <Copy size={18} strokeWidth={1.5} />}
            </button>
            <button
              type="button"
              onClick={() => onMode(effective === "full" ? "folded" : "full")}
              aria-label={effective === "full" ? "Fold answer" : "Open full answer"}
              disabled={!canFold}
              className="grid h-8 w-8 place-items-center rounded-lg text-[#d6d6d6] transition-colors hover:bg-white/10 disabled:opacity-40"
            >
              <Maximize2 size={17} strokeWidth={1.5} />
            </button>
          </div>
        </div>

        <motion.div
          initial={false}
          animate={{ height }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-hidden px-5"
          style={faded ? { WebkitMaskImage: "linear-gradient(to bottom, #000 40%, transparent 100%)", maskImage: "linear-gradient(to bottom, #000 40%, transparent 100%)" } : undefined}
        >
          <div ref={inner} className="space-y-4 pb-5 pt-3 text-[0.97rem] text-[#ececec]" style={{ lineHeight: `${LINE_HEIGHT}px` }}>
            {turn.paragraphs.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>
        </motion.div>

      </div>

      {canFold && (
        <div className="mt-3 flex flex-wrap items-center gap-3">
          {effective === "full" ? (
            <button type="button" onClick={() => onMode("folded")} className={foldBtn}>
              Collapse <ArrowUp size={13} className="ml-0.5 inline" aria-hidden />
            </button>
          ) : (
            <>
              <button type="button" onClick={expand} className={foldBtn}>
                Expand +{step} lines <ArrowDown size={13} className="ml-0.5 inline" aria-hidden />
              </button>
              <button type="button" onClick={() => onMode("full")} className={foldBtn}>
                Show all
              </button>
            </>
          )}
        </div>
      )}

      <div className="mt-4 flex items-center gap-0.5" aria-hidden>
        <IconSpan><Copy size={17} strokeWidth={1.5} /></IconSpan>
        <IconSpan><ThumbsUp size={17} strokeWidth={1.5} /></IconSpan>
        <IconSpan><ThumbsDown size={17} strokeWidth={1.5} /></IconSpan>
        <IconSpan><Share size={17} strokeWidth={1.5} /></IconSpan>
        <IconSpan><Volume2 size={17} strokeWidth={1.5} /></IconSpan>
        <IconSpan><RefreshCw size={17} strokeWidth={1.5} /></IconSpan>
        <IconSpan><Ellipsis size={17} strokeWidth={1.5} /></IconSpan>
      </div>
    </div>
  );
}

const pill =
  "af-glow rounded-xl bg-[#1b1b1b] px-4 py-2 text-sm font-medium text-[#f3f3f3] transition-colors hover:bg-[#262626]";

/** Buttons AnswerFold adds under each answer. The glow marks what the extension contributes. */
const foldBtn =
  "af-glow rounded-xl bg-[#1b1b1b] px-4 py-2 text-sm font-medium text-[#f3f3f3] transition-colors hover:bg-[#262626]";

function Navigator({
  current,
  onJump,
  onPrev,
  onCollapseAll,
  className = "",
}: {
  current: number;
  onJump: (i: number) => void;
  onPrev: () => void;
  onCollapseAll: () => void;
  className?: string;
}) {
  // Rests as buttons plus tick marks, and unfolds into the prompt list on hover or keyboard focus.
  const [open, setOpen] = useState(false);
  return (
    <nav
      aria-label="AnswerFold prompt navigator"
      className={className}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOpen(false);
      }}
    >
      <button type="button" onClick={onPrev} className={`${pill} self-end`}>
        <ArrowUp size={13} className="mr-1 inline" aria-hidden />
        Prompt
      </button>

      <AnimatePresence mode="wait" initial={false}>
        {open ? (
          <motion.ol
            key="list"
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformOrigin: "top right" }}
            className="af-glow overflow-hidden rounded-2xl bg-[#1b1b1b] py-1"
          >
            {turns.map((t, i) => (
              <li key={t.prompt}>
                <button
                  type="button"
                  onClick={() => onJump(i)}
                  aria-current={current === i ? "true" : undefined}
                  title={t.prompt}
                  className={`block w-full truncate px-4 py-3 text-left text-[0.86rem] font-medium transition-colors hover:bg-white/5 ${
                    current === i ? "text-white" : "text-[#9b9b9b]"
                  }`}
                >
                  {t.prompt}
                </button>
              </li>
            ))}
          </motion.ol>
        ) : (
          <motion.div
            key="ticks"
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
            className="flex flex-col items-end gap-2 self-end py-2 pr-3"
          >
            {turns.map((t, i) => (
              <span
                key={t.prompt}
                className={`h-[2px] w-28 transition-colors ${current === i ? "bg-[#ececec]" : "bg-[#5a5a5a]"}`}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <button type="button" onClick={onCollapseAll} className={`${pill} self-end`}>
        Collapse all
      </button>
    </nav>
  );
}

export default function AnswerFoldMock() {
  const [compact, setCompact] = useState(true);
  const [modes, setModes] = useState<Mode[]>(() => turns.map(() => "folded"));
  const [current, setCurrent] = useState(0);
  const scroller = useRef<HTMLDivElement>(null);
  const blocks = useRef<(HTMLDivElement | null)[]>([]);

  const setMode = (i: number, m: Mode) => setModes((ms) => ms.map((v, idx) => (idx === i ? m : v)));

  const jump = useCallback((i: number) => {
    const el = blocks.current[i];
    const box = scroller.current;
    if (el && box) box.scrollTo({ top: Math.max(0, el.offsetTop - 24), behavior: "smooth" });
  }, []);

  const onScroll = () => {
    const box = scroller.current;
    if (!box) return;
    let idx = 0;
    blocks.current.forEach((el, i) => {
      if (el && el.offsetTop - 80 <= box.scrollTop) idx = i;
    });
    setCurrent((c) => (c === idx ? c : idx));
  };

  useEffect(() => {
    onScroll();
  }, []);

  const prev = () => jump(Math.max(0, current - (scroller.current && blocks.current[current] && scroller.current.scrollTop - blocks.current[current]!.offsetTop > 120 ? 0 : 1)));
  const collapseAll = () => setModes(turns.map(() => "folded"));

  return (
    <div className="overflow-hidden border border-ink bg-bg">
      {/* browser bar with the extension control */}
      <div className="flex items-center gap-3 border-b border-ink bg-surface px-3 py-2">
        <span className="mono flex-1 truncate border border-line-strong bg-bg px-3 py-1 text-xs text-mute">https://chatgpt.com/</span>
        <label className="af-glow flex cursor-pointer items-center gap-2 bg-accent px-2.5 py-1 font-mono text-[0.68rem] uppercase text-accent-ink">
          AnswerFold
          <span className="sr-only">Compact mode</span>
          <input
            type="checkbox"
            role="switch"
            checked={compact}
            onChange={(e) => setCompact(e.target.checked)}
            className="h-3.5 w-3.5 accent-[#1d1d1b]"
          />
          <span aria-hidden>{compact ? "On" : "Off"}</span>
        </label>
      </div>

      <div className="flex h-[40rem] bg-[#0d0d0d] text-[#ececec]">
        {/* left rail, decorative */}
        <div aria-hidden className="hidden w-14 shrink-0 flex-col items-center gap-5 border-r border-white/10 py-5 text-[#d6d6d6] sm:flex">
          <MessageCircle size={22} strokeWidth={1.5} className="mb-1" />
          <SquarePen size={19} strokeWidth={1.5} />
          <Search size={19} strokeWidth={1.5} />
          <Pin size={19} strokeWidth={1.5} />
          <MessageCircle size={19} strokeWidth={1.5} />
          <Library size={19} strokeWidth={1.5} />
          <span className="mt-auto grid h-8 w-8 place-items-center rounded-full bg-[#d4500c] text-[0.65rem] font-medium text-white">HC</span>
        </div>

        <div className="relative flex min-w-0 flex-1 flex-col">
          {/* header */}
          <div className="flex items-center justify-between px-4 py-3 md:px-6">
            <span className="text-[1.05rem] font-medium">ChatGPT</span>
            <span aria-hidden className="flex items-center gap-4 text-sm text-[#d6d6d6]">
              <span className="flex items-center gap-1.5">
                <Share size={15} strokeWidth={1.5} /> Share
              </span>
              <Ellipsis size={18} strokeWidth={1.5} />
            </span>
          </div>

          {/* compact navigator for narrow screens */}
          {compact && (
            <div className="flex gap-2 overflow-x-auto border-y border-white/10 px-3 py-2 lg:hidden">
              <button type="button" onClick={prev} className={`${pill} shrink-0 !px-3 !py-1.5`}>
                <ArrowUp size={13} className="mr-1 inline" aria-hidden />
                Prompt
              </button>
              {turns.map((t, i) => (
                <button
                  key={t.prompt}
                  type="button"
                  onClick={() => jump(i)}
                  aria-current={current === i ? "true" : undefined}
                  className={`${pill} max-w-[11rem] shrink-0 truncate !px-3 !py-1.5 ${current === i ? "!text-white" : "!text-[#9b9b9b]"}`}
                >
                  {t.prompt}
                </button>
              ))}
              <button type="button" onClick={collapseAll} className={`${pill} shrink-0 !px-3 !py-1.5`}>
                Collapse all
              </button>
            </div>
          )}

          <div ref={scroller} onScroll={onScroll} className="relative flex-1 overflow-y-auto scroll-smooth px-4 pb-6 md:px-6 [scrollbar-color:#3a3a3a_transparent] [scrollbar-width:thin]">
            <div className="relative mx-auto max-w-[44rem] pb-10">
              {turns.map((t, i) => (
                <div
                  key={t.prompt}
                  ref={(el) => {
                    blocks.current[i] = el;
                  }}
                  className="pt-6"
                >
                  <div className="flex justify-end">
                    <p className="max-w-[85%] rounded-full bg-[#14398a] px-5 py-3 text-[0.97rem] leading-snug text-white">{t.prompt}</p>
                  </div>
                  <div className="mt-10">
                    <AnswerCard turn={t} mode={modes[i]} compact={compact} onMode={(m) => setMode(i, m)} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* right-hand AnswerFold navigator, wide screens */}
          {compact && (
            <Navigator
              current={current}
              onJump={jump}
              onPrev={prev}
              onCollapseAll={collapseAll}
              className="absolute right-3 top-[26%] hidden w-56 flex-col gap-2 lg:flex xl:w-60"
            />
          )}

          {/* composer, decorative */}
          <div aria-hidden className="px-4 pb-4 md:px-6">
            <div className="mx-auto flex max-w-[44rem] items-center gap-3 rounded-full border border-white/10 bg-[#1b1b1b] px-4 py-3 text-[#9b9b9b]">
              <Plus size={20} strokeWidth={1.5} className="text-[#d6d6d6]" />
              <span className="flex-1 text-[0.97rem]">Ask ChatGPT</span>
              <span className="hidden items-center gap-1.5 text-sm text-[#d6d6d6] sm:flex">
                <Lightbulb size={16} strokeWidth={1.5} /> Think
              </span>
              <Mic size={18} strokeWidth={1.5} className="text-[#d6d6d6]" />
              <span className="grid h-9 w-9 place-items-center rounded-full bg-[#2f6bde] text-white">
                <AudioLines size={18} strokeWidth={1.75} />
              </span>
            </div>
          </div>
        </div>
      </div>
      <p className="border-t border-ink bg-surface px-3 py-2 font-mono text-[0.66rem] uppercase text-mute">
        <span aria-hidden className="af-glow mr-2 inline-block h-2.5 w-2.5 align-middle" />
        Glowing controls are added by AnswerFold. Everything else is the host page.
      </p>
    </div>
  );
}
