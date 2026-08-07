import { Search, Scale, ListChecks, LineChart } from "lucide-react";

const STEPS = [
  { icon: Search, title: "Ask", body: "Describe a choice in your own words." },
  { icon: Scale, title: "Weigh", body: "We score environmental, economic and social impact." },
  { icon: ListChecks, title: "Act", body: "Get practical alternatives and sources to check." },
  { icon: LineChart, title: "Track", body: "Your questions build a picture of your habits." },
];

export function HowItWorks() {
  return (
    <section>
      <h2 className="font-display text-3xl">How it works</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map(({ icon: Icon, title, body }, i) => (
          <div key={title} className="rounded-3xl border bg-card p-6 text-center shadow-card">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl leaf-gradient shadow-glow">
              <Icon className="h-5 w-5 text-leaf-foreground" />
            </div>
            <div className="mt-4 text-xs uppercase tracking-widest text-muted-foreground">
              Step {i + 1}
            </div>
            <div className="mt-1 font-display text-xl">{title}</div>
            <p className="mt-1.5 text-sm text-muted-foreground">{body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
