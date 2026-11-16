import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Pause, Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/Button";
import type { ActionGameId } from "@/lib/arcade";
import type { ArcadeControls } from "@/lib/arcade-engine";
const labels: Record<ActionGameId, string> = {
  flappy: "Flap",
  runner: "Jump",
  invaders: "Sweep",
  snake: "",
  frog: "",
  breakout: "",
  catch: "",
};
export function ActionGame({ mode }: { mode: ActionGameId }) {
  const parent = useRef<HTMLDivElement>(null),
    engine = useRef<{ destroy: () => void; pause: (p: boolean) => void } | null>(null);
  const controls = useRef<ArcadeControls>({
    left: false,
    right: false,
    up: false,
    down: false,
    action: false,
  });
  const [round, setRound] = useState(0),
    [score, setScore] = useState(0),
    [best, setBest] = useState(0),
    [ended, setEnded] = useState(false),
    [paused, setPaused] = useState(false),
    [ready, setReady] = useState(false),
    [error, setError] = useState(false);
  useEffect(() => {
    let cancelled = false;
    setScore(0);
    setEnded(false);
    setPaused(false);
    setReady(false);
    setError(false);
    controls.current = { left: false, right: false, up: false, down: false, action: false };
    setBest(Number(localStorage.getItem(`ecomind.arcade.${mode}.best`)) || 0);
    import("@/lib/arcade-engine")
      .then(({ createArcade }) => {
        if (cancelled || !parent.current) return;
        engine.current = createArcade(parent.current, mode, controls.current, (value, over) => {
          setScore(value);
          setEnded(over);
          const old = Number(localStorage.getItem(`ecomind.arcade.${mode}.best`)) || 0;
          if (value > old) {
            localStorage.setItem(`ecomind.arcade.${mode}.best`, String(value));
            setBest(value);
          }
        });
        setReady(true);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });
    const blur = () => {
      controls.current.left = false;
      controls.current.right = false;
      controls.current.up = false;
      controls.current.down = false;
      controls.current.action = false;
      engine.current?.pause(true);
      setPaused(true);
    };
    window.addEventListener("blur", blur);
    return () => {
      cancelled = true;
      window.removeEventListener("blur", blur);
      engine.current?.destroy();
      engine.current = null;
    };
  }, [mode, round]);
  const directional = mode === "snake" || mode === "frog";
  const control = (key: keyof ArcadeControls, icon: React.ReactNode, label: string) => (
    <Button
      aria-label={label}
      title={label}
      disabled={paused || ended || !ready}
      className="h-12 min-w-12 touch-none select-none bg-card"
      onPointerDown={(e) => {
        e.preventDefault();
        e.currentTarget.setPointerCapture(e.pointerId);
        controls.current[key] = true;
      }}
      onPointerUp={() => {
        controls.current[key] = false;
      }}
      onPointerCancel={() => {
        controls.current[key] = false;
      }}
      onKeyDown={(e) => {
        if (e.key === " " || e.key === "Enter") controls.current[key] = true;
      }}
      onKeyUp={() => {
        controls.current[key] = false;
      }}
    >
      {icon}
    </Button>
  );
  return (
    <section className="py-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-5 text-sm">
          <span>
            Score <strong>{score}</strong>
          </span>
          <span>
            Best <strong>{best}</strong>
          </span>
        </div>
        <div className="flex gap-2">
          <Button
            aria-label={paused ? "Resume game" : "Pause game"}
            title={paused ? "Resume game" : "Pause game"}
            disabled={ended || !ready}
            onClick={() => {
              engine.current?.pause(!paused);
              setPaused(!paused);
            }}
          >
            {paused ? <Play size={16} /> : <Pause size={16} />}
          </Button>
          <Button
            aria-label="Restart game"
            title="Restart game"
            onClick={() => setRound(round + 1)}
          >
            <RotateCcw size={16} />
          </Button>
        </div>
      </div>
      <div className="relative mx-auto aspect-[10/7] w-full max-w-[600px] overflow-hidden rounded-lg border bg-muted">
        <div
          ref={parent}
          className="h-full w-full"
          role="img"
          aria-label={`${mode} ecology game board`}
        />
        {(!ready || paused || ended || error) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-background/90 text-center">
            <h3 className="text-3xl">
              {error
                ? "Game could not load"
                : ended
                  ? "Round complete"
                  : paused
                    ? "Paused"
                    : "Opening meadow…"}
            </h3>
            {ended && (
              <p>
                {score} points · Best {best}
              </p>
            )}
            {(ended || error) && (
              <Button onClick={() => setRound(round + 1)}>
                <RotateCcw size={16} />
                Play again
              </Button>
            )}
            {paused && !ended && (
              <Button
                onClick={() => {
                  engine.current?.pause(false);
                  setPaused(false);
                }}
              >
                <Play size={16} />
                Resume
              </Button>
            )}
          </div>
        )}
      </div>
      <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
        {directional && control("up", <ArrowUp size={22} />, "Move up")}
        {mode !== "flappy" &&
          mode !== "runner" &&
          control("left", <ArrowLeft size={22} />, "Move left")}
        {directional && control("down", <ArrowDown size={22} />, "Move down")}
        {mode !== "flappy" &&
          mode !== "runner" &&
          control("right", <ArrowRight size={22} />, "Move right")}
        {labels[mode] &&
          control(
            "action",
            <>
              <ArrowUp size={18} />
              {labels[mode]}
            </>,
            labels[mode],
          )}
      </div>
    </section>
  );
}
