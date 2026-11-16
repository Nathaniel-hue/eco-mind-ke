import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Check, Flame, Flower2, Gamepad2 } from "lucide-react";
import {
  loadQuestState,
  questsForDay,
  toggleQuest,
  sproutStage,
  sproutStageName,
  nextGrowthAt,
  GROWTH_THRESHOLDS,
  type QuestState,
} from "@/lib/quests";
import { SproutSvg } from "@/components/Mascot";
import { Button } from "@/components/Button";
export const Route = createFileRoute("/quests")({
  staticData: { sitemap: true },
  head: () => ({
    meta: [
      { title: "Daily Eco Quests — From Sprout to Forest | EcoMind" },
      {
        name: "description",
        content:
          "Five fresh daily sustainability quests on a two-week cycle. Grow a lasting tree, grove, forest and ecosystem.",
      },
      { property: "og:title", content: "Grow your forest — EcoMind Quests" },
      {
        property: "og:description",
        content: "Small everyday actions grow into a lasting forest. Five challenges a day.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Quests,
});
function Quests() {
  const [state, setState] = useState<QuestState | null>(null);
  const [saveStatus, setSaveStatus] = useState("Saved on this device");
  useEffect(() => {
    const read = () => setState(loadQuestState());
    read();
    const accountChange = (event: StorageEvent) => {
      if (event.key === "ecomind.quest-owner") read();
    };
    const saved = () => setSaveStatus("Saved to your account");
    const failed = () => setSaveStatus("Saved on this device · account sync unavailable");
    window.addEventListener("ecomind:quests", read);
    window.addEventListener("ecomind:saved", saved);
    window.addEventListener("ecomind:sync-error", failed);
    window.addEventListener("storage", accountChange);
    const timer = setInterval(read, 30000);
    return () => {
      clearInterval(timer);
      window.removeEventListener("storage", accountChange);
      window.removeEventListener("ecomind:quests", read);
      window.removeEventListener("ecomind:saved", saved);
      window.removeEventListener("ecomind:sync-error", failed);
    };
  }, []);
  if (!state) return <main className="min-h-[60vh]" />;
  const stage = sproutStage(state.blooms),
    next = nextGrowthAt(state.blooms),
    start = GROWTH_THRESHOLDS[stage] ?? next - 40;
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <p className="text-xs uppercase tracking-widest text-muted-foreground">Daily Eco Quests</p>
      <h1 className="mt-2 font-display text-4xl">Little actions. A growing world.</h1>
      <section className="mt-8 grid items-center gap-6 border-y py-7 sm:grid-cols-[240px_1fr]">
        <div className="flex justify-center">
          <SproutSvg stage={stage} size={240} />
        </div>
        <div>
          <h2 className="text-2xl">{sproutStageName(state.blooms)}</h2>
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Flower2 size={16} />
              {state.blooms} lifetime blooms
            </span>
            <span className="inline-flex items-center gap-1">
              <Flame size={16} />
              {state.streak}-day streak
            </span>
          </div>
          <progress
            className="eco-progress mt-4 w-full"
            aria-label="Growth to next stage"
            value={state.blooms - start}
            max={next - start}
          />
          <p className="mt-2 text-sm text-muted-foreground">
            {next - state.blooms} more completed days until {sproutStageName(next).toLowerCase()}
          </p>
          <p className="mt-3 text-xs text-muted-foreground" role="status">
            {saveStatus}
          </p>
        </div>
      </section>
      <div className="mt-8 flex items-center justify-between">
        <h2 className="text-xl">Today's five</h2>
        <span className="text-sm text-muted-foreground">{state.done.length}/5 complete</span>
      </div>
      {state.done.length === 5 && (
        <p className="mt-3 text-primary" role="status">
          Day complete! One bloom added to your growing world.
        </p>
      )}
      <ul className="mt-4 space-y-3">
        {questsForDay(state.day).map((q) => {
          const done = state.done.includes(q.id);
          return (
            <li key={q.id}>
              <Button
                aria-pressed={done}
                onClick={() => setState(toggleQuest(state, q.id))}
                className={`w-full justify-start items-start gap-4 p-4 text-left ${done ? "bg-accent" : "bg-card hover:bg-accent/40"}`}
              >
                <span
                  className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full border ${done ? "bg-primary text-primary-foreground" : "bg-background"}`}
                >
                  {done && <Check size={16} />}
                </span>
                <span>
                  <span className={`block ${done ? "line-through" : ""}`}>{q.title}</span>
                  <span className="mt-1 block text-sm font-normal text-muted-foreground">
                    {q.detail}
                  </span>
                  {done && (
                    <span className="mt-2 block text-xs font-normal text-primary">{q.impact}</span>
                  )}
                </span>
              </Button>
            </li>
          );
        })}
      </ul>
      <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-t pt-6">
        <p className="text-xs text-muted-foreground">
          A new set at local midnight · repeats every two weeks
        </p>
        <Link to="/game" className="inline-flex items-center gap-2 text-sm text-primary">
          <Gamepad2 size={18} />
          Play EcoSort →
        </Link>
      </div>
    </main>
  );
}
