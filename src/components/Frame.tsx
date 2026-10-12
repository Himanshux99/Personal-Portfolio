/** Hairline sheet border with registration marks, fixed over the viewport like a drawing frame. */
export default function Frame() {
  const mark = "mono absolute text-[11px] leading-none text-ink/60";
  return (
    <div aria-hidden className="pointer-events-none fixed inset-2 z-40 border border-ink/30">
      <span className={`${mark} left-1 top-1`}>+</span>
      <span className={`${mark} right-1 top-1`}>+</span>
      <span className={`${mark} bottom-1 left-1`}>+</span>
      <span className={`${mark} bottom-1 right-1`}>+</span>
    </div>
  );
}
