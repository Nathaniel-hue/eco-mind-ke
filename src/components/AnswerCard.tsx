import { ScoreCard } from "./ScoreCard";
import type { AskResult } from "@/lib/use-ask";
import { ArrowUpRight, Lightbulb, WifiOff, BookOpen, Sprout } from "lucide-react";

export function AnswerCard({ result }: { result: AskResult }) {
  const { data, question, source } = result;
  const badge =
    source === "offline"
      ? { icon: WifiOff, text: "From the offline library" }
      : source === "research"
        ? { icon: BookOpen, text: "Researched with sources" }
        : { icon: Sprout, text: "Reviewed and scored" };
  const Badge = badge.icon;

  return (
    <div className="animate-fade-up grid gap-6 lg:grid-cols-[1.6fr_1fr]">
      <article className="rounded-3xl border bg-card p-6 shadow-card sm:p-8">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs text-accent-foreground">
          <Badge className="h-3.5 w-3.5" />
          {badge.text}
          {data.category ? <span className="opacity-70">· {data.category}</span> : null}
        </div>
        <h2 className="mt-4 font-display text-2xl sm:text-3xl">{question}</h2>
        <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-foreground/85">
          {data.answer.split(/\n{2,}/).map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        {data.alternatives?.length ? (
          <div className="mt-8">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Practical alternatives
            </h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {data.alternatives.map((a) => (
                <div key={a.title} className="rounded-2xl border bg-secondary/50 p-4">
                  <div className="text-sm font-semibold">{a.title}</div>
                  <p className="mt-1 text-sm text-muted-foreground">{a.why}</p>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {data.sources?.length ? (
          <div className="mt-8">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Sources
            </h3>
            <ul className="mt-3 space-y-2">
              {data.sources.map((s) => (
                <li key={s.url}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-start gap-1.5 text-sm text-foreground/80 underline-offset-4 hover:text-foreground hover:underline"
                  >
                    <ArrowUpRight className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </article>

      <aside className="space-y-6">
        <ScoreCard scores={data.scores} />
        {data.tips?.length ? (
          <div className="rounded-3xl border bg-card p-6 shadow-card">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <Lightbulb className="h-4 w-4 text-leaf" />
              Quick tips
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {data.tips.map((t) => (
                <li key={t} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-leaf" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </aside>
    </div>
  );
}
