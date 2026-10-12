import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

const players = ["Host", "Player 2", "Player 3", "Player 4"];
const hands = [
  [7, 31, 52],
  [14, 26, 60],
  [3, 45, 58],
  [19, 38, 71],
];

/** Pixel-styled concept preview of a lobby-to-round flow. Not footage of the game. */
export default function LanLobby() {
  const [ready, setReady] = useState<boolean[]>([true, false, false, false]);
  const [dealt, setDealt] = useState(false);
  const all = ready.every(Boolean);

  const toggle = (i: number) => {
    if (dealt) return;
    setReady((r) => r.map((v, idx) => (idx === i ? !v : v)));
  };
  const reset = () => {
    setDealt(false);
    setReady([true, false, false, false]);
  };

  return (
    <div className="relative overflow-hidden border border-line bg-[#0f120d] p-4 md:p-6" style={{ backgroundImage: "radial-gradient(var(--color-line) 1px, transparent 1px)", backgroundSize: "16px 16px" }}>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
        {players.map((p, i) => (
          <div key={p} className="flex flex-col items-center">
            <button
              type="button"
              aria-pressed={ready[i]}
              aria-label={`${p}: ${ready[i] ? "ready" : "not ready"}`}
              onClick={() => toggle(i)}
              className="group flex flex-col items-center gap-3 outline-offset-8"
            >
              {/* A blocky top-down sprite built from CSS, no image asset needed */}
              <motion.div
                className="relative h-14 w-14"
                animate={{ y: ready[i] ? [0, -4, 0] : 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className={`pixel absolute inset-0 ${ready[i] ? "bg-accent" : "bg-line-strong"}`} />
                <div className="absolute left-3 top-4 h-2 w-2 bg-accent-ink" />
                <div className="absolute right-3 top-4 h-2 w-2 bg-accent-ink" />
                <div className="absolute inset-x-3 bottom-3 h-1.5 bg-accent-ink/70" />
              </motion.div>
              <span className="mono text-xs">{p}</span>
              <span className={`mono border px-2 py-0.5 text-[0.7rem] ${ready[i] ? "border-accent text-accent" : "border-line-strong text-mute"}`}>
                {ready[i] ? "ready" : "waiting"}
              </span>
            </button>

            <div className="mt-4 flex h-16 items-end gap-1">
              <AnimatePresence>
                {dealt &&
                  hands[i].map((n, c) => (
                    <motion.div
                      key={n}
                      initial={{ y: 30, opacity: 0, rotateY: 90 }}
                      animate={{ y: 0, opacity: 1, rotateY: 0 }}
                      transition={{ delay: 0.12 * c + 0.05 * i, type: "spring", stiffness: 260, damping: 22 }}
                      className="mono flex h-14 w-9 items-center justify-center border-2 border-ink bg-bg text-sm font-medium"
                    >
                      {n}
                    </motion.div>
                  ))}
              </AnimatePresence>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-line pt-4">
        <button type="button" className="btn btn-sm btn-primary" disabled={!all || dealt} onClick={() => setDealt(true)}>
          Start round
        </button>
        <button type="button" className="btn btn-sm" onClick={reset}>
          Back to lobby
        </button>
        <p aria-live="polite" className="mono text-xs text-mute">
          {dealt ? "Cards dealt. Everyone sees only their own hand." : all ? "All players ready." : "Click a player to toggle ready."}
        </p>
      </div>
    </div>
  );
}
