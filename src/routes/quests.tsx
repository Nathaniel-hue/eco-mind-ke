import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Check, Flame, Flower2 } from "lucide-react";
import { loadQuestState, questsForDay, toggleQuest, type QuestState } from "@/lib/quests";
import { SproutSvg } from "@/components/Mascot";

export const Route = createFileRoute("/quests")({
  head: () => ({
    meta: [
      { title: "Daily Eco Quests — Grow your Sprout | EcoMind" },
      { name: "description", content: "Five small, fun sustainability challenges every day. Complete them all to make your Sprout bloom." },
      { property: "og:title", content: "Daily Eco Quests on EcoMind" },
      { property: "og:description", content: "Five daily eco challenges. Finish all five and your Sprout blooms." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Quests,
});

const STAGE_LINES = [
  "Sprout is a sleepy seed. Wake it up!",
  "A tiny stem! Sprout is stretching.",
  "First leaf unfurled. Looking good.",
  "Two leaves — Sprout is feeling sunny.",
  "Almost there… Sprout can smell the flowers.",
  "Sprout bloomed! You're a certified Planet Pal today.",
];

function Quests() {
  const [state, setState] = useState<QuestState | null>(null);
  useEffect(() => setState(loadQuestState()), []);
  const quests = useMemo(() => (state ? questsForDay(state.day) : []), [state?.day]);
  if (!state) return <div className="min-h-[60vh]" />;
  const n = state.done.length;

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <p className="text-xs uppercase tracking-widest text-muted-foreground">Daily Eco Quests</p>
      <h1 className="mt-2 font-display text-4xl">Five small things, one happy Sprout</h1>

      <section className={`mt-8 flex items-center gap-6 rounded-3xl border bg-card p-6 shadow-card ${n === 5 ? "shadow-glow" : ""}`}>
        <div className={n === 5 ? "animate-bounce" : ""}><SproutSvg stage={n} size={110} /></div>
        <div className="flex-1">
          <div className="font-display text-xl">{STAGE_LINES[n]}</div>
          <div className="mt-3 h-2 rounded-full bg-muted">
            <div className="h-2 rounded-full leaf-gradient transition-all duration-500" style={{ width: `${n * 20}%` }} />
          </div>
          <div className="mt-3 flex gap-4 text-sm text-muted-foreground">
            <span>{n}/5 today</span>
            <span className="inline-flex items-center gap-1"><Flame className="h-4 w-4" />{state.streak}-day streak</span>
            <span className="inline-flex items-center gap-1"><Flower2 className="h-4 w-4" />{state.blooms} blooms</span>
          </div>
        </div>
      </section>

      <ul className="mt-8 space-y-3">
        {quests.map((q) => {
          const done = state.done.includes(q.id);
          return (
            <li key={q.id}>
              <button
                onClick={() => setState(toggleQuest(state, q.id))}
                className={`flex w-full items-start gap-4 rounded-2xl border p-4 text-left transition-all hover:-translate-y-0.5 ${done ? "bg-accent/60" : "bg-card"}`}
              >
                <span className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 transition-colors ${done ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}>
                  {done && <Check className="h-4 w-4" />}
                </span>
                <span>
                  <span className={`block font-medium ${done ? "line-through opacity-70" : ""}`}>{q.title}</span>
                  <span className="block text-sm text-muted-foreground">{q.detail}</span>
                  {done && <span className="mt-1 block text-xs text-primary">🌱 {q.impact}</span>}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <p className="mt-6 text-center text-xs text-muted-foreground">New quests appear every day at midnight.</p>
    </main>
  );
}
