import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { site } from "../site";

const links = [
  { id: "work", label: "Selected work" },
  { id: "about", label: "About" },
  { id: "stack", label: "Stack" },
  { id: "playground", label: "Playground" },
  { id: "contact", label: "Contact" },
];

function useActiveSection() {
  const [active, setActive] = useState<string>("");
  useEffect(() => {
    const els = links.map((l) => document.getElementById(l.id)).filter((e): e is HTMLElement => !!e);
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

export default function Nav() {
  const [open, setOpen] = useState(false);
  const active = useActiveSection();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-0 z-50 border-b border-line/70 bg-bg/80 backdrop-blur-md"
    >
      <nav aria-label="Primary" className="shell flex h-16 items-center justify-between">
        <a href="#top" className="flex items-baseline gap-2 font-medium tracking-tight" onClick={() => setOpen(false)}>
          <span className="mono text-accent">hc/</span>
          <span>Himanshu Choyal</span>
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <li key={l.id}>
              <a
                href={`#${l.id}`}
                aria-current={active === l.id ? "true" : undefined}
                className="relative block px-3 py-2 text-sm text-mute transition-colors hover:text-ink aria-[current=true]:text-ink"
              >
                {l.label}
                {active === l.id && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute inset-x-3 -bottom-px h-px bg-accent"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href={site.github}
            target="_blank"
            rel="noreferrer"
            className="btn btn-sm hidden sm:inline-flex"
            aria-label="GitHub profile, opens in a new tab"
          >
            GitHub <ArrowUpRight size={14} strokeWidth={1.75} />
          </a>
          <button
            type="button"
            className="btn btn-sm lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={18} strokeWidth={1.75} /> : <Menu size={18} strokeWidth={1.75} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="border-t border-line bg-bg lg:hidden"
          >
            <ul className="shell flex flex-col py-3">
              {[...links, { id: "github", label: "GitHub" }].map((l, i) => (
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
                    className="flex min-h-12 items-center justify-between border-b border-line text-xl tracking-tight last:border-0"
                  >
                    {l.label}
                    <ArrowUpRight size={18} strokeWidth={1.5} className="text-mute" />
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
