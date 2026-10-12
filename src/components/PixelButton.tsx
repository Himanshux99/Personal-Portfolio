import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { ComponentPropsWithoutRef, CSSProperties, PointerEvent, ReactNode } from "react";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

type Variant = "nav" | "accent" | "primary" | "ghost";
type Reveal = "square" | "arrow" | "none";

/* fill = colour the blocks resolve to, text = label colour once filled */
const tones: Record<Variant, { fill: string; text: string; reveal: Reveal }> = {
  nav: { fill: "var(--color-ink)", text: "var(--color-bg)", reveal: "square" },
  accent: { fill: "var(--color-accent)", text: "#fff", reveal: "arrow" },
  primary: { fill: "var(--color-ink)", text: "var(--color-bg)", reveal: "none" },
  ghost: { fill: "var(--color-ink)", text: "var(--color-bg)", reveal: "none" },
};

const BLOCK = 8; // target block edge in px
const IN_MS = 260;
const FILL_MS = IN_MS + 140; // last block's delay plus its stepped fade
const OUT_MS = 340;
const OUT_HOLD_MS = 160; // pause before the blocks start clearing

type Props = {
  variant?: Variant;
  /** Override the built-in accent indicator for the variant. */
  reveal?: Reveal;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<"a">, "children"> &
  Omit<ComponentPropsWithoutRef<"button">, "children" | "href">;

const reduced = () => typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Hover/focus/press fills the control with a mosaic of square blocks that flip
 * on in a staggered, left-to-right-biased random order, and flip off again in
 * the opposite bias. Blocks are plain DOM nodes; stagger is applied as
 * transition-delay so a mid-flight reversal simply re-times the remaining blocks.
 */
export default function PixelButton({ variant = "ghost", reveal, className = "", children, onPointerEnter, onPointerLeave, onPointerDown, onPointerUp, onPointerCancel, onFocus, onBlur, ...rest }: Props) {
  const tone = tones[variant];
  const mark = reveal ?? tone.reveal;
  const ref = useRef<HTMLElement>(null);
  const layer = useRef<HTMLSpanElement>(null);
  const [grid, setGrid] = useState({ cols: 0, rows: 0 });
  const [on, setOn] = useState(false);
  const release = useRef<number>(0);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const cols = Math.max(1, Math.round(el.clientWidth / BLOCK));
      const rows = Math.max(1, Math.round(el.clientHeight / BLOCK));
      setGrid((g) => (g.cols === cols && g.rows === rows ? g : { cols, rows }));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const retime = useCallback((entering: boolean) => {
    const kids = layer.current?.children;
    if (!kids?.length) return;
    const still = reduced();
    const span = entering ? IN_MS : OUT_MS;
    const { cols } = grid;
    for (let i = 0; i < kids.length; i++) {
      const bias = (i % cols) / Math.max(1, cols - 1);
      const dir = bias; // fill and clear both sweep left to right
      const t = still ? 0 : (0.3 * Math.random() + 0.7 * dir) * span + (entering ? 0 : OUT_HOLD_MS);
      (kids[i] as HTMLElement).style.transitionDelay = `${t.toFixed(0)}ms`;
    }
  }, [grid]);

  const enteredAt = useRef(0);
  const pendingOff = useRef<number>(0);

  const apply = useCallback(
    (next: boolean) => {
      setOn((cur) => {
        if (cur === next) return cur;
        retime(next);
        return next;
      });
    },
    [retime],
  );

  /* A fill always plays to the end: a leave that arrives mid-fill waits for it to finish. */
  const set = useCallback(
    (next: boolean) => {
      window.clearTimeout(pendingOff.current);
      if (next) {
        if (!on) enteredAt.current = performance.now();
        apply(true);
        return;
      }
      const wait = reduced() ? 0 : enteredAt.current + FILL_MS - performance.now();
      if (wait > 0) pendingOff.current = window.setTimeout(() => apply(false), wait);
      else apply(false);
    },
    [apply, on],
  );

  useEffect(
    () => () => {
      window.clearTimeout(release.current);
      window.clearTimeout(pendingOff.current);
    },
    [],
  );

  const style: CSSProperties & Record<string, string> = { "--px-fill": tone.fill, "--px-text": tone.text };

  return (
    <PolyEl
      {...rest}
      ref={ref}
      data-on={on}
      style={{ ...style, ...(rest.style as CSSProperties) }}
      className={`px ${className}`}
      onPointerEnter={(e: PointerEvent<HTMLElement>) => {
        onPointerEnter?.(e as never);
        if (e.pointerType !== "touch") set(true);
      }}
      onPointerLeave={(e: PointerEvent<HTMLElement>) => {
        onPointerLeave?.(e as never);
        if (e.pointerType !== "touch") set(false);
      }}
      onPointerDown={(e: PointerEvent<HTMLElement>) => {
        onPointerDown?.(e as never);
        if (e.pointerType === "touch") {
          window.clearTimeout(release.current);
          set(true);
        }
      }}
      onPointerUp={(e: PointerEvent<HTMLElement>) => {
        onPointerUp?.(e as never);
        if (e.pointerType === "touch") release.current = window.setTimeout(() => set(false), 320);
      }}
      onPointerCancel={(e: PointerEvent<HTMLElement>) => {
        onPointerCancel?.(e as never);
        set(false);
      }}
      onFocus={(e: React.FocusEvent<HTMLElement>) => {
        onFocus?.(e as never);
        if (e.currentTarget.matches(":focus-visible")) set(true);
      }}
      onBlur={(e: React.FocusEvent<HTMLElement>) => {
        onBlur?.(e as never);
        set(false);
      }}
    >
      <span ref={layer} aria-hidden className="px-layer" style={{ gridTemplate: `repeat(${grid.rows}, 1fr) / repeat(${grid.cols}, 1fr)` }}>
        {Array.from({ length: grid.cols * grid.rows }, (_, i) => (
          <i key={i} />
        ))}
      </span>
      {children}
      {mark === "square" && (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute right-[7px] top-1/2 -mt-[3px] h-1.5 w-1.5 bg-accent"
          initial={false}
          animate={{ opacity: on ? 1 : 0, scale: on ? 1 : 0.2 }}
          transition={{ duration: 0.18, delay: on ? 0.14 : 0, ease: [0.16, 1, 0.3, 1] }}
        />
      )}
      {mark === "arrow" && (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute right-[5px] top-1/2 -mt-[6px]"
          initial={false}
          animate={{ opacity: on ? 1 : 0, x: on ? 0 : -8 }}
          transition={{ duration: 0.2, delay: on ? 0.12 : 0, ease: [0.16, 1, 0.3, 1] }}
        >
          <ArrowRight size={12} strokeWidth={1.75} />
        </motion.span>
      )}
    </PolyEl>
  );
}

/* Renders an <a> when href is present, otherwise a <button>. */
function PolyEl({ ref, ...props }: Record<string, unknown> & { ref?: React.Ref<HTMLElement> }) {
  return props.href ? (
    <a ref={ref as React.Ref<HTMLAnchorElement>} {...(props as ComponentPropsWithoutRef<"a">)} />
  ) : (
    <button ref={ref as React.Ref<HTMLButtonElement>} type="button" {...(props as ComponentPropsWithoutRef<"button">)} />
  );
}
