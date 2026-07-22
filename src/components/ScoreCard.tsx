import type { SustainabilityScores } from "@/lib/offline-kb";
import { Leaf, Coins, Users, Star } from "lucide-react";

function scoreColor(v: number) {
  if (v >= 80) return "var(--leaf)";
  if (v >= 60) return "oklch(0.75 0.15 90)";
  if (v >= 40) return "oklch(0.75 0.15 60)";
  return "oklch(0.65 0.2 25)";
}

function Bar({ label, value, icon: Icon }: { label: string; value: number; icon: React.ComponentType<{ className?: string }> }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-sm">
        <span className="flex items-center gap-1.5 text-foreground/80">
          <Icon className="h-3.5 w-3.5" />
          {label}
        </span>
        <span className="font-mono font-semibold tabular-nums">{value}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full animate-progress"
          style={{ width: `${value}%`, background: scoreColor(value) }}
        />
      </div>
    </div>
  );
}

export function ScoreCard({ scores }: { scores: SustainabilityScores }) {
  return (
    <div className="rounded-2xl border bg-card p-5 shadow-card">
      <div className="mb-4 flex items-end justify-between">
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">
            Overall Sustainability
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span
              className="font-display text-5xl leading-none"
              style={{ color: scoreColor(scores.overall) }}
            >
              {scores.overall}
            </span>
            <span className="text-sm text-muted-foreground">/100</span>
          </div>
        </div>
        <div className="grid h-14 w-14 place-items-center rounded-full leaf-gradient shadow-glow">
          <Star className="h-6 w-6 text-leaf-foreground" strokeWidth={2.5} />
        </div>
      </div>
      <div className="space-y-3">
        <Bar label="Environmental" value={scores.environmental} icon={Leaf} />
        <Bar label="Economic" value={scores.economic} icon={Coins} />
        <Bar label="Social" value={scores.social} icon={Users} />
      </div>
    </div>
  );
}
