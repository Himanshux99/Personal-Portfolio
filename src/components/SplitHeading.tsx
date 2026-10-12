import { motion, useReducedMotion } from "motion/react";
import type { ElementType } from "react";

interface Props {
  text: string;
  /** Trailing part of `text` rendered in the accent colour. */
  accent?: string;
  as?: ElementType;
  id?: string;
  className?: string;
  delay?: number;
}

/** Heading whose words slide up out of a mask when scrolled into view. */
export default function SplitHeading({ text, accent, as: Tag = "h2", id, className, delay = 0 }: Props) {
  const reduce = useReducedMotion();
  const words = text.split(" ");
  const accentStart = accent && text.endsWith(accent) ? words.length - accent.split(" ").length : words.length;
  return (
    <Tag id={id} className={className} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} aria-hidden className="inline-block overflow-hidden pb-[0.08em] align-bottom">
          <motion.span
            className={`inline-block ${i >= accentStart ? "text-signal" : ""}`}
            initial={reduce ? false : { y: "110%", rotate: 4 }}
            whileInView={{ y: 0, rotate: 0 }}
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            transition={{ duration: 0.9, delay: delay + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
          >
            {w}
          </motion.span>
          {i < words.length - 1 && " "}
        </span>
      ))}
    </Tag>
  );
}
