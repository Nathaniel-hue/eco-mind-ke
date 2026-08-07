import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, Lightbulb, Cpu, WifiOff, Globe, Leaf, Rocket } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About EcoMind AI — Science, method, and roadmap" },
      {
        name: "description",
        content:
          "How EcoMind AI works: the sustainability problem, our AI-powered solution, offline mode, research mode, environmental impact, and future improvements.",
      },
      { property: "og:title", content: "About EcoMind AI" },
      { property: "og:description", content: "How EcoMind AI helps people make smarter, greener decisions." },
    ],
  }),
  component: About,
});

const sections = [
  {
    icon: AlertTriangle,
    title: "The problem",
    body: "Most people want to live more sustainably but struggle to evaluate the real impact of everyday choices. Information is scattered, technical, and often contradictory. Small daily decisions — bottled water, short car trips, fast fashion — silently accumulate into a large personal footprint.",
  },
  {
    icon: Lightbulb,
    title: "Our solution",
    body: "EcoMind AI turns any question about a habit, purchase, or decision into a clear sustainability analysis: an overall score, three dimensional sub-scores, better alternatives, and practical tips. The interface is a simple search box, so anyone can use it without training.",
  },
  {
    icon: Cpu,
    title: "How the AI works",
    body: "We use a large language model behind a structured-output layer. Every response is forced to include a numeric score (0–100) across environmental, economic, and social dimensions, plus alternatives and tips. This keeps answers useful and consistent instead of generic.",
  },
  {
    icon: WifiOff,
    title: "Offline mode",
    body: "A curated local knowledge base with 30 common sustainability questions ships inside the app. If your question matches one, the answer is served instantly with no network — perfect for classrooms, low-connectivity areas, or preserving privacy.",
  },
  {
    icon: Globe,
    title: "Research mode",
    body: "When enabled, the assistant grounds answers in reputable environmental sources (governments, universities, NGOs, peer-reviewed science) and lists them at the bottom of each response so you can verify.",
  },
  {
    icon: Leaf,
    title: "Environmental impact",
    body: "By nudging users toward lower-impact alternatives — cycling instead of driving, tap over bottled water, plant-forward meals — EcoMind AI aims to compound thousands of tiny decisions into meaningful footprint reductions.",
  },
  {
    icon: Rocket,
    title: "Future improvements",
    body: "Planned: personalized footprint tracking, community leaderboards, local recycling rules by postcode, integrations with grocery and travel apps, and a curriculum-mode for schools.",
  },
];

function About() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="animate-fade-up text-center">
        <div className="text-xs uppercase tracking-widest text-muted-foreground">Science fair</div>
        <h1 className="mt-2 font-display text-5xl sm:text-6xl">About EcoMind AI</h1>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          A sustainability assistant designed to make greener decisions feel effortless — combining
          AI, a local knowledge base, and grounded research.
        </p>
      </div>

      <div className="mt-12 space-y-4">
        {sections.map((s, i) => {
          const Icon = s.icon;
          return (
            <div
              key={s.title}
              className="animate-fade-up rounded-2xl border bg-card p-6 shadow-card sm:p-8"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div className="flex items-start gap-4">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl leaf-gradient shadow-glow">
                  <Icon className="h-5 w-5 text-leaf-foreground" />
                </div>
                <div>
                  <h2 className="font-display text-2xl">{s.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {s.body}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
