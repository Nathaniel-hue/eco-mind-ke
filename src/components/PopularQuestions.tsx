import { OFFLINE_KB } from "@/lib/offline-kb";
import { ArrowRight } from "lucide-react";

const POPULAR = OFFLINE_KB.slice(0, 6);

export function PopularQuestions({ onPick }: { onPick: (q: string) => void }) {
  return (
    <section>
      <h2 className="font-display text-3xl">Popular questions</h2>
      <p className="mt-2 text-muted-foreground">
        Start with something people ask us every week.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {POPULAR.map((entry) => (
          <button
            key={entry.question}
            onClick={() => onPick(entry.question)}
            className="group rounded-3xl border bg-card p-5 text-left shadow-card transition hover:-translate-y-0.5 hover:shadow-glow"
          >
            <div className="text-xs uppercase tracking-wider text-muted-foreground">
              {entry.data.category ?? "Everyday choices"}
            </div>
            <div className="mt-2 text-base font-medium">{entry.question}</div>
            <div className="mt-4 inline-flex items-center gap-1 text-sm text-leaf">
              See the answer
              <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
