import type { SustainabilityScores } from "@/lib/offline-kb";
import { Leaf, Coins, Users } from "lucide-react";

function scoreColor(v: number) {
  if (v >= 80) return "var(--leaf)";
  if (v >= 60) return "var(--leaf-glow)";
  if (v >= 40) return "var(--clay)";
  return "var(--earth)";
}

function scoreLabel(v: number) {
  if (v >= 80) return "Strongly sustainable";
  if (v >= 60) return "Generally a good choice";
  if (v >= 40) return "Mixed impact";
  return "High impact";
}

function Bar({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number | null;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-sm">
        <span className="flex items-center gap-1.5 text-foreground/80">
          <Icon className="h-3.5 w-3.5" />
          {label}
        </span>
        <span className="font-semibold tabular-nums">{value ?? "N/A"}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div
          className="animate-progress h-full rounded-full"
          style={{ width: `${value ?? 0}%`, background: scoreColor(value ?? 0) }}
        />
      </div>
    </div>
  );
}

export function ScoreCard({ scores, na = false }: { scores: SustainabilityScores; na?: boolean }) {
  return (
    <div className="rounded-3xl border bg-card p-6 shadow-card">
      <div className="mb-5">
        <div className="text-xs uppercase tracking-wider text-muted-foreground">
          Sustainability score
        </div>
        <div className="mt-1 flex items-baseline gap-2">
          <span
            className="font-display text-5xl leading-none"
            style={{ color: na ? undefined : scoreColor(scores.overall) }}
          >
            {na ? "N/A" : scores.overall}
          </span>
          {na ? null : <span className="text-sm text-muted-foreground">/ 100</span>}
        </div>
        <div className="mt-1 text-sm text-muted-foreground">{na ? "Not a sustainability question" : scoreLabel(scores.overall)}</div>
      </div>
      <div className="space-y-4">
        <Bar label="Environmental" value={na ? null : scores.environmental} icon={Leaf} />
        <Bar label="Economic" value={na ? null : scores.economic} icon={Coins} />
        <Bar label="Social" value={na ? null : scores.social} icon={Users} />
      </div>
    </div>
  );
}
