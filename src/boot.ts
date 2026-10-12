import { useSyncExternalStore } from "react";

/** Where the page is in its start-up choreography:
 *  loading (boot screen) -> lid (laptop opens) -> terminal (terminal launches) -> ready (nav shown, page scrolls). */
export type Phase = "loading" | "lid" | "terminal" | "ready";
const order: Phase[] = ["loading", "lid", "terminal", "ready"];

let phase: Phase = "loading";
const subs = new Set<() => void>();

export function setPhase(p: Phase) {
  if (order.indexOf(p) <= order.indexOf(phase)) return;
  phase = p;
  subs.forEach((f) => f());
}

export function usePhase() {
  return useSyncExternalStore(
    (f) => {
      subs.add(f);
      return () => subs.delete(f);
    },
    () => phase,
  );
}
