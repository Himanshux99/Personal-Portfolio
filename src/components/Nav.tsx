import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { site } from "../site";
import PixelButton from "./PixelButton";
import { usePhase } from "../boot";

const links = [
  { id: "work", label: "Work" },
  { id: "about", label: "About" },
  { id: "stack", label: "Stack" },
  { id: "playground", label: "Playground" },
];

const watched = [...links.map((l) => l.id), "contact"];

function useActiveSection() {
  const [active, setActive] = useState("");
  useEffect(() => {
    const els = watched.map((id) => document.getElementById(id)).filter((e): e is HTMLElement => !!e);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    const hero = document.getElementById("top");
    const heroIo = new IntersectionObserver(([e]) => e.isIntersecting && setActive(""), { threshold: 0.4 });
    if (hero) heroIo.observe(hero);
    return () => {
      io.disconnect();
      heroIo.disconnect();
    };
  }, []);
  return active;
}

const cell = "relative flex h-14 w-32 items-center justify-center border-l border-ink px-5 font-mono text-[0.7rem] uppercase tracking-[0.04em]";

export default function Nav() {
  const [open, setOpen] = useState(false);
  const delay = 0;
  const active = useActiveSection();
  const ready = usePhase() === "ready";

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <motion.header
      initial={{ opacity: 0, y: -14 }}
      animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: -14 }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed inset-x-0 top-0 z-50 border-b font-semibold border-ink bg-bg ${ready ? "" : "pointer-events-none"}`}
    >
      <nav aria-label="Primary" className="mx-2 flex h-14 items-stretch justify-between">
        <a href="#top" onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 md:px-5">
          <span aria-hidden className="grid h-6 w-6 place-items-center bg-ink font-mono text-[0.6rem] font-medium text-bg">
            hc
          </span>
          <span className="text-sm font-semibold uppercase tracking-[-0.02em]">Himanshu Choyal</span>
        </a>

        <ul className="hidden items-stretch lg:flex">
          {links.map((l) => (
            <li key={l.id} className="flex">
              <PixelButton variant="nav" href={`#${l.id}`} aria-current={active === l.id ? "true" : undefined} className={cell}>
                {l.label}
                {active === l.id && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-x-0 bottom-0 h-[3px] bg-accent"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
              </PixelButton>
            </li>
          ))}
          <li className="flex">
            <PixelButton variant="nav" href={site.github} target="_blank" rel="noreferrer" className={`${cell} gap-2`} aria-label="GitHub profile, opens in a new tab">
              GitHub <ArrowUpRight size={13} strokeWidth={1.5} />
            </PixelButton>
          </li>
          <li className="flex">
            <PixelButton variant="accent" href="#contact" className={`${cell} text-signal data-[on=true]:text-white`}>
              Contact
              {active === "contact" && <motion.span layoutId="nav-active" className="absolute inset-x-0 bottom-0 h-[3px] bg-accent" />}
            </PixelButton>
          </li>
        </ul>

        <button
          type="button"
          className="flex items-center gap-2 border-l border-ink px-4 font-mono text-[0.7rem] uppercase lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={18} strokeWidth={1.5} /> : <Menu size={18} strokeWidth={1.5} />}
          {open ? "Close" : "Menu"}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="border-t border-ink bg-bg lg:hidden"
          >
            <ul className="mx-2 flex flex-col px-4 py-2">
              {[...links, { id: "contact", label: "Contact" }, { id: "github", label: "GitHub" }].map((l, i) => (
                <motion.li
                  key={l.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 * i, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                  <a
                    href={l.id === "github" ? site.github : `#${l.id}`}
                    {...(l.id === "github" ? { target: "_blank", rel: "noreferrer" } : {})}
                    onClick={() => setOpen(false)}
                    className="flex min-h-14 items-center justify-between border-b border-line-strong text-2xl font-semibold uppercase tracking-[-0.03em] last:border-0"
                  >
                    {l.label}
                    <ArrowUpRight size={20} strokeWidth={1.25} />
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
