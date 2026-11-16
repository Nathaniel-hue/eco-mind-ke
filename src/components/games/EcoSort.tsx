import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  RotateCcw,
  Trophy,
  Leaf,
  Recycle,
  Trash2,
  Battery,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Button } from "@/components/Button";
import {
  BINS,
  shuffledRound,
  scoreChoice,
  evaluateChoice,
  type SortItem,
  type Bin,
} from "@/lib/ecosort";
const icons = [Leaf, Recycle, Trash2, Battery];
export function EcoSort() {
  const [items, setItems] = useState<SortItem[]>([]),
    [index, setIndex] = useState(0),
    [score, setScore] = useState(0),
    [streak, setStreak] = useState(0),
    [best, setBest] = useState(0);
  const [choice, setChoice] = useState<Bin | null>(null),
    [sound, setSound] = useState(false),
    [haptic, setHaptic] = useState(false);
  useEffect(() => {
    setItems(shuffledRound());
    setBest(Number(localStorage.getItem("ecomind.ecosort.best")) || 0);
    setSound(localStorage.getItem("ecomind.ecosort.sound") === "true");
    setHaptic(localStorage.getItem("ecomind.ecosort.haptic") === "true");
  }, []);
  const item = items[index],
    finished = items.length > 0 && index >= items.length;
  function select(bin: Bin) {
    if (!item || choice) return;
    const { correct } = evaluateChoice(item, bin),
      next = scoreChoice(score, streak, correct);
    setChoice(bin);
    setScore(next.score);
    setStreak(next.streak);
    if (next.score > best) {
      setBest(next.score);
      localStorage.setItem("ecomind.ecosort.best", String(next.score));
    }
    if (haptic && navigator.vibrate) navigator.vibrate(correct ? 30 : [30, 40, 30]);
    if (sound) {
      try {
        const context = new AudioContext();
        const oscillator = context.createOscillator(),
          gain = context.createGain();
        oscillator.connect(gain);
        gain.connect(context.destination);
        gain.gain.value = 0.05;
        oscillator.frequency.value = correct ? 660 : 220;
        oscillator.start();
        oscillator.stop(context.currentTime + 0.12);
        oscillator.onended = () => void context.close();
      } catch {}
    }
  }
  function replay() {
    setItems(shuffledRound());
    setIndex(0);
    setScore(0);
    setStreak(0);
    setChoice(null);
  }
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <p className="text-xs uppercase tracking-widest text-muted-foreground">
        The little planet arcade
      </p>
      <h2 className="mt-2 text-3xl">EcoSort</h2>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-y py-4">
        <div className="flex gap-5 text-sm">
          <span>
            Score <strong>{score}</strong>
          </span>
          <span>
            Streak <strong>{streak}</strong>
          </span>
          <span className="inline-flex items-center gap-1">
            <Trophy size={16} />
            Best {best}
          </span>
        </div>
        <div className="flex gap-2">
          <Button
            aria-label={sound ? "Mute sound" : "Enable sound"}
            title={sound ? "Mute sound" : "Enable sound"}
            aria-pressed={sound}
            onClick={() => {
              setSound(!sound);
              localStorage.setItem("ecomind.ecosort.sound", String(!sound));
            }}
            className="px-2"
          >
            {sound ? <Volume2 size={17} /> : <VolumeX size={17} />}
          </Button>
          <label className="flex items-center gap-2 text-xs">
            <input
              type="checkbox"
              checked={haptic}
              onChange={(e) => {
                setHaptic(e.target.checked);
                localStorage.setItem("ecomind.ecosort.haptic", String(e.target.checked));
              }}
            />
            Haptics
          </label>
        </div>
      </div>
      {finished ? (
        <section className="py-16 text-center">
          <Trophy className="mx-auto h-14 w-14 text-primary" />
          <h2 className="mt-5 text-3xl">{score === 100 ? "A spotless sort!" : "Round complete"}</h2>
          <p className="mt-3 text-muted-foreground">
            {score / 10} of 10 items sorted correctly · {score} points
          </p>
          <Button onClick={replay} className="mt-6 bg-primary text-primary-foreground">
            <RotateCcw size={16} />
            Play again
          </Button>
        </section>
      ) : item ? (
        <section className="py-8">
          <p className="text-center text-sm text-muted-foreground">Item {index + 1} of 10</p>
          <div className="mt-5 flex h-48 flex-col items-center justify-center gap-4">
            <span className="text-7xl" aria-hidden>
              {item.emoji}
            </span>
            <h2 className="text-center text-2xl">{item.name}</h2>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3">
            {BINS.map((bin, i) => {
              const Icon = icons[i];
              return (
                <Button
                  key={bin}
                  disabled={Boolean(choice)}
                  onClick={() => select(bin)}
                  className={`min-h-20 flex-col whitespace-normal text-center ${choice === bin && bin !== item.bin ? "border-destructive text-destructive bg-card" : choice && bin === item.bin ? "bg-accent border-primary text-primary" : "bg-card"}`}
                >
                  {Icon && <Icon size={24} />} {bin}
                </Button>
              );
            })}
          </div>
          {choice && (
            <div className="mt-6 border-l-2 border-primary pl-4" role="status">
              <h3
                className={`text-lg ${choice === item.bin ? "text-primary" : "text-destructive"}`}
              >
                {choice === item.bin ? "Correct! +10 points" : "Incorrect — no points added"}
              </h3>
              <p className="mt-2 text-sm">
                You chose: <strong>{choice}</strong>. Correct bin: <strong>{item.bin}</strong>.
              </p>
              <p className="mt-2 text-sm text-muted-foreground">{item.tip}</p>
              <Button
                onClick={() => {
                  setIndex(index + 1);
                  setChoice(null);
                }}
                className="mt-4 bg-primary text-primary-foreground"
              >
                {index === 9 ? "See results" : "Next item"}
                <ArrowRight size={16} />
              </Button>
            </div>
          )}
        </section>
      ) : (
        <p className="py-16 text-center">Loading round…</p>
      )}
      <div className="border-t pt-5 text-xs text-muted-foreground">
        <p>General sorting guidance; local collection rules always take priority.</p>
        <Link to="/quests" className="mt-3 inline-block text-primary">
          Back to your growing world →
        </Link>
      </div>
    </main>
  );
}
