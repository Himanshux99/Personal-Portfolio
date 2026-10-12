import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { AnimatePresence, motion, useDragControls } from "motion/react";
import { ArrowUpRight, FlaskConical, Folder, Layers, Mail, Minus, Terminal, UserRound, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import PixelButton from "./PixelButton";
import SplitHeading from "./SplitHeading";
import { setPhase, usePhase } from "../boot";
import { background, ecosystem, languages, playground, projects } from "../data/content";
import { site } from "../site";

const ease = [0.16, 1, 0.3, 1] as const;

type AppId = "terminal" | "work" | "about" | "stack" | "playground" | "contact";

/* ---------- window contents ---------- */

function WorkApp() {
  const [sel, setSel] = useState<string | null>(null);
  const p = projects.find((x) => x.id === sel);
  if (p) {
    return (
      <div className="space-y-4 p-4">
        <button type="button" className="mono text-[0.68rem] uppercase text-mute underline underline-offset-4 hover:text-ink" onClick={() => setSel(null)}>
          &larr; All projects
        </button>
        <div>
          <h3 className="text-xl font-semibold uppercase tracking-[-0.03em]">{p.name}</h3>
          <p className="mono mt-1 text-[0.68rem] uppercase text-signal">{p.status.label}</p>
        </div>
        <p className="text-sm leading-snug">{p.problem}</p>
        <ul className="list-disc space-y-1 pl-4 text-sm leading-snug marker:text-accent">
          {p.built.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
        <p className="mono text-[0.68rem] uppercase text-mute">{p.stack.join(" / ")}</p>
        <p className="border-l-2 border-accent pl-3 text-xs leading-snug text-mute">{p.honesty}</p>
        <div className="flex flex-wrap gap-2">
          {p.links.map((l) => (
            <PixelButton key={l.href} href={l.href} target="_blank" rel="noreferrer" className="btn btn-sm">
              {l.label} <ArrowUpRight size={13} strokeWidth={1.5} />
              <span className="sr-only"> (opens in a new tab)</span>
            </PixelButton>
          ))}
        </div>
      </div>
    );
  }
  return (
    <ul>
      {projects.map((x, i) => (
        <li key={x.id} className="border-b border-line last:border-0">
          <button type="button" onClick={() => setSel(x.id)} className="group flex w-full items-start gap-3 p-4 text-left hover:bg-surface">
            <span className="mono pt-0.5 text-[0.68rem] text-mute">{String(i + 1).padStart(2, "0")}</span>
            <span className="flex-1">
              <span className="block text-sm font-semibold uppercase tracking-[-0.02em]">{x.name}</span>
              <span className="mt-0.5 block text-xs leading-snug text-mute">{x.kicker}</span>
            </span>
            <ArrowUpRight size={16} strokeWidth={1.5} className="mt-0.5 shrink-0 opacity-40 group-hover:opacity-100" />
          </button>
        </li>
      ))}
    </ul>
  );
}

function AboutApp() {
  return (
    <div className="space-y-4 p-4 text-sm leading-snug">
      <p>IT engineering student in Mumbai. I build interfaces, intelligent systems and the pipelines that ship them.</p>
      <dl className="mono grid grid-cols-[5rem_1fr] gap-x-3 gap-y-1 text-[0.68rem] uppercase">
        <dt className="text-mute">School</dt>
        <dd>{background.school}</dd>
        <dt className="text-mute">Degree</dt>
        <dd>{background.degree}</dd>
        <dt className="text-mute">Years</dt>
        <dd>{background.years}</dd>
      </dl>
      <ul className="divide-y divide-line border-y border-line">
        {background.highlights.map((h) => (
          <li key={h.title} className="py-2">
            <p className="font-semibold">{h.title}</p>
            <p className="text-xs text-mute">{h.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function StackApp() {
  return (
    <div className="space-y-4 p-4">
      {ecosystem.map((g) => (
        <section key={g.title}>
          <h3 className="mono flex justify-between text-[0.68rem] uppercase">
            <span>{g.title}</span>
            <span className="text-mute">{g.blurb}</span>
          </h3>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {g.items.map((i) => (
              <li key={i} className="border border-line-strong px-2 py-0.5 text-xs">
                {i}
              </li>
            ))}
          </ul>
        </section>
      ))}
      <p className="mono border-t border-dashed border-ink/40 pt-3 text-[0.68rem] uppercase text-mute">Languages: {languages.join(" / ")}</p>
    </div>
  );
}

function PlaygroundApp() {
  return (
    <ul>
      {playground.map((x) => (
        <li key={x.name} className="border-b border-line p-4 last:border-0">
          <p className="flex items-baseline justify-between gap-3">
            <span className="text-sm font-semibold">{x.name}</span>
            <span className="mono shrink-0 text-[0.6rem] uppercase text-signal">{x.category}</span>
          </p>
          <p className="mt-0.5 text-xs leading-snug text-mute">{x.note}</p>
          <p className="mono mt-1 text-[0.62rem] uppercase text-mute">{x.tag}</p>
        </li>
      ))}
    </ul>
  );
}

function ContactApp() {
  return (
    <div className="space-y-3 p-4">
      <p className="text-sm leading-snug">Got a problem worth building for? The repositories are the best way to reach me for now.</p>
      <div className="flex flex-wrap gap-2">
        {site.email && (
          <PixelButton variant="primary" href={`mailto:${site.email}`} className="btn btn-primary btn-sm">
            <Mail size={14} strokeWidth={1.5} /> {site.email}
          </PixelButton>
        )}
        <PixelButton href={site.github} target="_blank" rel="noreferrer" className="btn btn-sm">
          GitHub <ArrowUpRight size={13} strokeWidth={1.5} />
          <span className="sr-only"> (opens in a new tab)</span>
        </PixelButton>
        {site.linkedin && (
          <PixelButton href={site.linkedin} target="_blank" rel="noreferrer" className="btn btn-sm">
            LinkedIn <ArrowUpRight size={13} strokeWidth={1.5} />
            <span className="sr-only"> (opens in a new tab)</span>
          </PixelButton>
        )}
      </div>
    </div>
  );
}

const BOOT = ["hc.os 1.0 — boot ok", "mounting /work /about /stack /playground ... done", "", "hi, i'm himanshu. type `help` to poke around."];

function TerminalApp({ onOpen }: { onOpen: (id: AppId) => void }) {
  const [lines, setLines] = useState<string[]>([]);
  const [val, setVal] = useState("");
  const [hist, setHist] = useState<string[]>([]);
  const [hi, setHi] = useState(-1);
  const input = useRef<HTMLInputElement>(null);
  const end = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let i = 0;
    const id = window.setInterval(() => {
      const line = BOOT[i++];
      setLines((l) => [...l, line]);
      if (i >= BOOT.length) window.clearInterval(id);
    }, 260);
    return () => window.clearInterval(id);
  }, []);
  useEffect(() => {
    end.current?.scrollIntoView({ block: "nearest" });
  }, [lines]);

  const ids = apps.map((a) => a.id) as string[];
  const run = (raw: string): string[] => {
    const [cmd, ...rest] = raw.trim().split(/\s+/);
    const arg = rest.join(" ").toLowerCase();
    switch (cmd.toLowerCase()) {
      case "":
        return [];
      case "help":
        return ["help  whoami  ls  projects  stack  neofetch", "open <app>  contact  date  clear", "(there may be a secret or two)"];
      case "whoami":
        return ["himanshu choyal — it engineering student, mumbai.", "interfaces, intelligent systems, and the pipelines that ship them."];
      case "ls":
        return [ids.map((x) => x + "/").join("  ")];
      case "projects":
        return projects.map((p, i) => `${String(i + 1).padStart(2, "0")}  ${p.name.padEnd(16)} ${p.kicker}`);
      case "stack":
        return [...ecosystem.map((g) => `${g.title}: ${g.items.join(", ")}`), `languages: ${languages.join(", ")}`];
      case "neofetch":
        return ["  ▄▄▄▄▄    himanshu@hc.os", "  █ ▀ █    ------------", "  █▄▄▄█    school: " + background.school, "           degree: " + background.degree, "           shell:  react + typescript", "           mood:   building"];
      case "contact":
        onOpen("contact");
        return ["opening contact.app ..."];
      case "date":
        return [new Date().toString()];
      case "open":
        if (ids.includes(arg)) {
          onOpen(arg as AppId);
          return [`opening ${arg} ...`];
        }
        return [`open: no such app '${arg}'. try: ${ids.join(", ")}`];
      case "sudo":
        return arg.includes("hire") ? ["permission granted. emailing himanshu... (just use the contact app)"] : ["nice try. you are not in the sudoers file. this incident will be reported."];
      case "rm":
        return ["lol no."];
      default:
        return [`${cmd}: command not found. try \`help\``];
    }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const raw = val;
    setVal("");
    setHi(-1);
    if (raw.trim()) setHist((h) => [...h, raw]);
    if (raw.trim().toLowerCase() === "clear") return setLines([]);
    setLines((l) => [...l, `$ ${raw}`, ...run(raw)]);
  };
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowUp" && e.key !== "ArrowDown") return;
    e.preventDefault();
    const n = Math.max(-1, Math.min(hist.length - 1, hi + (e.key === "ArrowUp" ? 1 : -1)));
    setHi(n);
    setVal(n === -1 ? "" : hist[hist.length - 1 - n]);
  };

  return (
    <div className="mono h-full min-h-[11rem] cursor-text bg-ink p-3 text-[0.7rem] leading-relaxed text-bg" onClick={() => input.current?.focus()}>
      {lines.map((l, i) => (
        <p key={i} className={`whitespace-pre-wrap break-words ${l.startsWith("$") ? "text-accent" : ""}`}>
          {l || " "}
        </p>
      ))}
      <form onSubmit={submit} className="flex items-center gap-2">
        <span className="text-accent">$</span>
        <input
          ref={input}
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onKeyDown={onKey}
          aria-label="Terminal input"
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          className="min-w-0 flex-1 bg-transparent text-bg caret-accent outline-none"
        />
      </form>
      <div ref={end} />
    </div>
  );
}

/* lucide has no brand icons, so this is the GitHub mark inline. */
function GithubMark({ size }: { size: number }) {
  return (
    <svg aria-hidden width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.69 1.25 3.35.96.1-.74.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.18 1.83 1.18 3.09 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" />
    </svg>
  );
}

const iconColor: Record<AppId, string> = {
  terminal: "#16a34a",
  work: "#f59e0b",
  about: "#2563eb",
  stack: "#7c3aed",
  playground: "#ec4899",
  contact: "#ef4444",
};

const apps: {
  id: AppId;
  label: string;
  title: string;
  icon: LucideIcon;
  w: string;
  body: (open: (id: AppId) => void) => ReactNode;
}[] = [
  {
    id: "terminal",
    label: "Terminal",
    title: "terminal — hc.os",
    icon: Terminal,
    w: "30rem",
    body: (open) => <TerminalApp onOpen={open} />,
  },
  {
    id: "work",
    label: "Work",
    title: "work/ — projects",
    icon: Folder,
    w: "34rem",
    body: () => <WorkApp />,
  },
  {
    id: "about",
    label: "About",
    title: "about.txt",
    icon: UserRound,
    w: "30rem",
    body: () => <AboutApp />,
  },
  {
    id: "stack",
    label: "Stack",
    title: "stack/ — tools",
    icon: Layers,
    w: "32rem",
    body: () => <StackApp />,
  },
  {
    id: "playground",
    label: "Playground",
    title: "playground/ — experiments",
    icon: FlaskConical,
    w: "30rem",
    body: () => <PlaygroundApp />,
  },
  {
    id: "contact",
    label: "Contact",
    title: "contact.app",
    icon: Mail,
    w: "26rem",
    body: () => <ContactApp />,
  },
];

/* ---------- window chrome ---------- */

function useDesktopMode() {
  const [d, setD] = useState(() => typeof matchMedia === "function" && matchMedia("(min-width: 768px)").matches);
  useEffect(() => {
    const mq = matchMedia("(min-width: 768px)");
    const on = () => setD(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return d;
}

function DesktopWindow({
  app,
  index,
  z,
  minimized,
  bounds,
  desktop,
  onFocus,
  onClose,
  onMinimize,
  onOpen,
}: {
  app: (typeof apps)[number];
  index: number;
  z: number;
  minimized: boolean;
  bounds: React.RefObject<HTMLDivElement | null>;
  desktop: boolean;
  onFocus: () => void;
  onClose: () => void;
  onMinimize: () => void;
  onOpen: (id: AppId) => void;
}) {
  const controls = useDragControls();
  const ref = useRef<HTMLDivElement>(null);
  // Grow out of (and shrink back into) the desktop icon that launched this window.
  const [origin] = useState(() => {
    const icon = document.querySelector<HTMLElement>(`[data-app="${app.id}"]`);
    const b = bounds.current;
    if (!desktop || !icon || !b) return "50% 50%";
    const ib = icon.getBoundingClientRect();
    const bb = b.getBoundingClientRect();
    return `${ib.left + ib.width / 2 - bb.left - (96 + index * 26)}px ${ib.top + ib.height / 2 - bb.top - (10 + index * 22)}px`;
  });
  useEffect(() => {
    ref.current?.focus({ preventScroll: true });
  }, []);

  return (
    <motion.div
      ref={ref}
      role="dialog"
      aria-label={app.title}
      tabIndex={-1}
      initial={desktop ? { opacity: 0, scale: 0.05 } : { opacity: 0, scale: 0.96, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={desktop ? { opacity: 0, scale: 0.05 } : { opacity: 0, scale: 0.97 }}
      transition={{ duration: desktop ? 0.45 : 0.2, ease }}
      drag={desktop}
      dragControls={controls}
      dragListener={false}
      dragMomentum={false}
      dragElastic={0}
      dragConstraints={bounds}
      onPointerDownCapture={onFocus}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
      style={{
        zIndex: z,
        transformOrigin: origin,
        ...(desktop
          ? {
              left: 96 + index * 26,
              top: 10 + index * 22,
              width: `min(${app.w}, calc(100% - 110px))`,
              maxHeight: `calc(100% - ${18 + index * 22}px)`,
            }
          : {}),
      }}
      className={`flex flex-col border border-ink bg-bg shadow-[6px_6px_0_0_var(--color-accent)] outline-none md:absolute max-md:fixed max-md:inset-2 ${minimized ? "hidden" : ""}`}
    >
      <div
        onPointerDown={(e) => desktop && controls.start(e)}
        className={`flex h-9 shrink-0 select-none items-center justify-between border-b border-ink bg-ink pl-3 text-bg ${desktop ? "cursor-grab active:cursor-grabbing" : ""}`}
        style={{ touchAction: "none" }}
      >
        <span className="mono truncate text-[0.68rem] uppercase">{app.title}</span>
        <span className="flex h-full" onPointerDown={(e) => e.stopPropagation()}>
          <button type="button" aria-label={`Minimize ${app.label}`} onClick={onMinimize} className="grid w-9 place-items-center hover:bg-accent hover:text-accent-ink">
            <Minus size={14} strokeWidth={1.75} />
          </button>
          <button type="button" aria-label={`Close ${app.label}`} onClick={onClose} className="grid w-9 place-items-center hover:bg-accent hover:text-accent-ink">
            <X size={14} strokeWidth={1.75} />
          </button>
        </span>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">{app.body(onOpen)}</div>
    </motion.div>
  );
}

function Clock() {
  const [t, setT] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setT(new Date()), 15000);
    return () => window.clearInterval(id);
  }, []);
  return <span className="mono px-3 text-[0.68rem] uppercase">{t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>;
}

/* ---------- the laptop ---------- */

function LaptopBase() {
  return (
    <div aria-hidden className="relative z-[1] -mx-[6%] mt-[-1px]">
      <div className="relative h-3 rounded-b-[16px] rounded-t-[2px] border border-ink bg-raised md:h-4">
        <span className="absolute left-1/2 top-[-1px] h-1.5 w-[16%] -translate-x-1/2 rounded-b-[6px] border border-t-0 border-ink bg-surface" />
        <span className="absolute bottom-1/2 left-3 h-1 w-1 translate-y-1/2 rounded-full bg-accent" />
      </div>
      <div className="mx-auto mt-1 h-1.5 w-[90%] rounded-full bg-ink/10" />
    </div>
  );
}

/* A pixel-art spider drawn block by block, black on white. */
const SPIDER = [
  ".......#...................#.......",
  "......#.....................#......",
  ".....#.......................#.....",
  "....#.........................#....",
  "..##...##.................##...##..",
  "..##...##.................##...##..",
  "..#....#...................#....#..",
  ".#...##.....................##...#.",
  ".#...##.....................##...#.",
  ".#...##.....................##...#.",
  "##...##.....................##...##",
  "##...##.....................##...##",
  "##...##.....................##...##",
  "##...##.#####.........#####.##...##",
  "##...####....#.......#....####...##",
  "##...##.......#.....#.......##...##",
  "##.......#################.......##",
  "###..###......#######......###..###",
  ".######....#############....######.",
  "..###.....#....#####....#.....###..",
  "........##....#######....##........",
  ".......##...##..###..##...##.......",
  "....###....##..#####..##....###....",
  "...##.....#...#######...#.....##...",
  "..##....##....#######....##....##..",
  ".##....##.....#######.....##....##.",
  "##.....##.....#######.....##.....##",
  "##.....##.....#######.....##.....##",
  "##.....##......#####......##.....##",
  "##.....##......#####......##.....##",
  "##.....##.......###.......##.....##",
  "##.....##.......###.......##.....##",
  "##.....##........#........##.....##",
  ".#.....##........#........##.....#.",
  ".#.....##.................##.....#.",
  ".#.....##.................##.....#.",
  "..#.....#.................#.....#..",
  "..#.....#.................#.....#..",
  "..##....##...............##....##..",
  "...#...........................#...",
  "...#...........................#...",
  "....#.........................#....",
  "....#.........................#....",
  ".....#.......................#.....",
  ".....#.......................#.....",
  "......#.....................#......",
  "......#.....................#......",
];

function Wallpaper() {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = canvas.current!;
    const ctx = cv.getContext("2d")!;
    const cols = SPIDER[0].length;
    const rows = SPIDER.length;

    const draw = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = cv.clientWidth;
      const h = cv.clientHeight;
      if (!w || !h) return;
      cv.width = w * dpr;
      cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // every spider block is a 2x2 square of finer blocks, so the grid has twice the resolution
      const size = Math.max(1, Math.floor((Math.min((w * 0.9) / cols, (h * 0.92) / rows) * dpr) / 2)) / dpr;
      const gc = Math.ceil(w / size);
      const gr = Math.ceil(h / size);
      const sx = Math.floor((gc - cols * 2) / 2); // spider's top-left cell
      const sy = Math.floor((gr - rows * 2) / 2);

      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "#000";
      const put = (x: number, y: number) => {
        if (x >= 0 && y >= 0 && x < gc && y < gr) ctx.fillRect(x * size, y * size, size, size);
      };

      const put2 = (x: number, y: number) => {
        put(x, y);
        put(x + 1, y);
        put(x, y + 1);
        put(x + 1, y + 1);
      };

      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) if (SPIDER[r][c] === "#") put2(sx + c * 2, sy + r * 2);
    };

    draw();
    const ro = new ResizeObserver(draw);
    ro.observe(cv);
    return () => ro.disconnect();
  }, []);

  return <canvas ref={canvas} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full bg-white" />;
}

export default function Hero() {
  const desktop = useDesktopMode();
  const bounds = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<AppId | null>(null);
  const [stack, setStack] = useState<AppId[]>([]); // back to front
  const [min, setMin] = useState<Set<AppId>>(new Set());
  const coarse = typeof matchMedia === "function" && matchMedia("(pointer: coarse)").matches;

  const open = (id: AppId) => {
    setMin((m) => {
      const n = new Set(m);
      n.delete(id);
      return n;
    });
    setStack((s) => [...s.filter((x) => x !== id), id]);
    setSelected(id);
  };
  const close = (id: AppId) => setStack((s) => s.filter((x) => x !== id));
  const minimize = (id: AppId) => setMin((m) => new Set(m).add(id));
  const toFront = (id: AppId) => setStack((s) => (s[s.length - 1] === id ? s : [...s.filter((x) => x !== id), id]));
  // Start-up: the lid opens, the terminal icon lights up and the terminal grows out of it, then the page unlocks.
  const phase = usePhase();
  const started = phase !== "loading";
  useEffect(() => {
    if (!started) return;
    // No laptop on phones: unlock as soon as the boot screen is gone.
    if (!desktop) return setPhase("ready");
    const ids: number[] = [];
    ids.push(
      window.setTimeout(() => {
        setPhase("terminal");
        setSelected("terminal");
        ids.push(
          window.setTimeout(() => {
            open("terminal");
            ids.push(window.setTimeout(() => setPhase("ready"), 650));
          }, 500),
        );
      }, 1900),
    );
    return () => ids.forEach((id) => window.clearTimeout(id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started]);
  const top = [...stack].reverse().find((id) => !min.has(id));

  return (
    <section id="top" className="relative flex min-h-[78dvh] flex-col items-center justify-center px-4 pb-10 pt-24 md:min-h-0 md:h-[100dvh] md:min-h-[32rem] md:px-10 md:pb-4 md:pt-16">
      <div className="draft-dots pointer-events-none absolute inset-0 opacity-40" aria-hidden />

      <div className="relative z-[1] text-center">
        <SplitHeading as="h1" delay={2.6} text="From interface to infrastructure." accent="infrastructure." className="display mx-auto max-w-[18ch] text-[clamp(2rem,5.2vw,4.5rem)] md:max-w-none md:text-[clamp(1.5rem,min(3.4vw,5.5dvh),3rem)]" />
        <p className="mono mt-3 text-[0.68rem] uppercase text-mute">
          Himanshu Choyal
          {desktop && ` / ${coarse ? "tap" : "double-click"} an icon on the screen to open it`}
        </p>
        {!desktop && (
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <PixelButton variant="primary" href="#work" className="btn btn-primary">
              See the work
            </PixelButton>
            <PixelButton href="#contact" className="btn">
              Contact
            </PixelButton>
          </div>
        )}
      </div>

      {desktop && (
        <>
          <div className="relative z-[1] mt-8 flex w-full max-w-[74rem] items-end justify-center md:mt-[min(2rem,3dvh)]">
            <div style={{ perspective: 1600 }} className="min-w-0 flex-1 md:max-w-none md:flex-none md:w-[min(52rem,calc((100dvh-17rem)*1.6+1.75rem))]">
              {/* lid: hinged at the bottom, folds flat onto the base until the boot screen is gone */}
              <motion.div
                initial={{ rotateX: -89 }}
                animate={{ rotateX: phase === "loading" ? -89 : 0 }}
                transition={{
                  duration: 1.3,
                  delay: 0.35,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{ transformOrigin: "50% 100%" }}
                className="relative mx-auto w-full rounded-t-[14px] rounded-b-[3px] border border-ink bg-bg p-2 pt-4 md:p-3.5 md:pt-5"
              >
                <span aria-hidden className="absolute left-1/2 top-1.5 h-1 w-1 -translate-x-1/2 rounded-full bg-ink md:top-2" />
                <div className="relative flex aspect-[16/10] min-h-[17rem] flex-col overflow-hidden rounded-[6px] border border-ink bg-surface md:min-h-0">
                  <div className="relative min-h-0 flex-1" onPointerDown={(e) => e.target === e.currentTarget && setSelected(null)}>
                    <Wallpaper />

                    <ul className="absolute left-0 top-0 z-[1] flex max-h-full flex-col flex-wrap gap-0.5 p-1.5 md:p-3" aria-label="Desktop">
                      {apps.map((a) => {
                        const isSel = selected === a.id;
                        return (
                          <li key={a.id}>
                            <button
                              type="button"
                              data-app={a.id}
                              aria-haspopup="dialog"
                              aria-pressed={isSel}
                              onClick={(e) => {
                                if (coarse || e.detail !== 1) open(a.id);
                                else setSelected(a.id);
                              }}
                              className="group flex w-[4.25rem] flex-col items-center gap-1 p-1 outline-none md:w-[4.75rem]"
                            >
                              <span className="grid h-10 w-10 place-items-center transition-transform group-hover:scale-110 group-focus-visible:outline group-focus-visible:outline-2 group-focus-visible:outline-offset-2 group-focus-visible:outline-ink md:h-11 md:w-11" style={{ color: iconColor[a.id], filter: "drop-shadow(0 0 1.5px #fff) drop-shadow(0 0 1.5px #fff)" }}>
                                <a.icon size={isSel ? 28 : 26} strokeWidth={2} />
                              </span>
                              <span className={`mono px-1 text-[0.6rem] uppercase leading-tight ${isSel ? "bg-ink text-bg" : "bg-bg/85"}`}>{a.label}</span>
                            </button>
                          </li>
                        );
                      })}
                      <li>
                        <a href={site.github} target="_blank" rel="noreferrer" className="group flex w-[4.25rem] flex-col items-center gap-1 p-1 outline-none md:w-[4.75rem]">
                          <span className="grid h-10 w-10 place-items-center text-[#0b1220] transition-transform group-hover:scale-110 group-focus-visible:outline group-focus-visible:outline-2 group-focus-visible:outline-offset-2 group-focus-visible:outline-ink md:h-11 md:w-11" style={{ filter: "drop-shadow(0 0 1.5px #fff) drop-shadow(0 0 1.5px #fff)" }}>
                            <GithubMark size={26} />
                          </span>
                          <span className="mono bg-bg/85 px-1 text-[0.6rem] uppercase leading-tight">GitHub</span>
                          <span className="sr-only">(opens in a new tab)</span>
                        </a>
                      </li>
                    </ul>

                    {/* windows live inside the screen */}
                    <div ref={bounds} className="pointer-events-none absolute inset-0 [&>*]:pointer-events-auto">
                      <AnimatePresence>
                        {stack.map((id, i) => {
                          const app = apps.find((a) => a.id === id)!;
                          return (
                            <DesktopWindow
                              key={id}
                              app={app}
                              index={apps.indexOf(app)}
                              z={desktop ? 10 + i : 100 + i}
                              minimized={min.has(id)}
                              bounds={bounds}
                              desktop={desktop}
                              onFocus={() => toFront(id)}
                              onClose={() => close(id)}
                              onMinimize={() => minimize(id)}
                              onOpen={open}
                            />
                          );
                        })}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* taskbar */}
                  <div className="relative z-50 flex h-8 shrink-0 items-stretch border-t border-ink bg-bg">
                    <span className="mono flex items-center gap-2 border-r border-ink bg-ink px-3 text-[0.62rem] uppercase text-bg">
                      <span aria-hidden className="h-1.5 w-1.5 bg-accent" /> hc.os
                    </span>
                    <div className="flex min-w-0 flex-1 items-stretch overflow-x-auto">
                      {stack.map((id) => {
                        const app = apps.find((a) => a.id === id)!;
                        const active = top === id;
                        return (
                          <button
                            key={id}
                            type="button"
                            aria-pressed={active}
                            onClick={() => (active ? minimize(id) : open(id))}
                            className={`mono flex shrink-0 items-center gap-1.5 border-r border-ink px-2.5 text-[0.62rem] uppercase ${active ? "bg-surface" : "text-mute hover:bg-surface"}`}
                          >
                            <app.icon size={12} strokeWidth={1.5} /> {app.label}
                          </button>
                        );
                      })}
                    </div>
                    <div className="flex items-center border-l border-ink">
                      <Clock />
                    </div>
                  </div>
                </div>
              </motion.div>

              <LaptopBase />
            </div>
          </div>

          {/* desk edge */}
          <div aria-hidden className="relative z-0 mt-1 h-px w-full max-w-[74rem] bg-ink" />
        </>
      )}
    </section>
  );
}
