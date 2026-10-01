import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { loadThreads, type Thread } from "@/lib/chat-storage";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { MessageSquare, Leaf, WifiOff, Sparkles, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — EcoMind AI" },
      { name: "description", content: "Your sustainability activity, scores, and question categories." },
      { property: "og:title", content: "Dashboard — EcoMind AI" },
      { property: "og:description", content: "Your sustainability activity and scores." },
    ],
  }),
  component: Dashboard,
});

const COLORS = ["oklch(0.62 0.17 150)", "oklch(0.72 0.12 220)", "oklch(0.75 0.15 90)", "oklch(0.55 0.09 60)", "oklch(0.65 0.2 30)", "oklch(0.7 0.18 300)"];

function Dashboard() {
  const [threads, setThreads] = useState<Thread[]>([]);
  useEffect(() => {
    setThreads(loadThreads());
  }, []);

  const allMessages = threads.flatMap((t) => t.messages);
  const assistantMsgs = allMessages.filter((m) => m.role === "assistant");
  const withScores = assistantMsgs.filter((m) => m.data && m.data.relevant !== false);
  const avg =
    withScores.length > 0
      ? Math.round(
          withScores.reduce((s, m) => s + (m.data?.scores.overall ?? 0), 0) / withScores.length,
        )
      : 0;
  const questionsAsked = allMessages.filter((m) => m.role === "user").length;
  const offlineCount = assistantMsgs.filter((m) => m.source === "offline").length;
  const aiCount = assistantMsgs.filter((m) => m.source === "ai" || m.source === "research").length;

  const catCounts: Record<string, number> = {};
  for (const m of withScores) {
    const c = m.data?.category ?? "Other";
    catCounts[c] = (catCounts[c] ?? 0) + 1;
  }
  const catData = Object.entries(catCounts).map(([name, value]) => ({ name, value }));

  const recent = [...allMessages]
    .filter((m) => m.role === "user")
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 6);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8 animate-fade-up">
        <div className="text-xs uppercase tracking-widest text-muted-foreground">Dashboard</div>
        <h1 className="mt-1 font-display text-4xl sm:text-5xl">Your sustainability snapshot</h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat icon={TrendingUp} label="Average score" value={`${avg}/100`} tone="leaf" />
        <Stat icon={MessageSquare} label="Questions asked" value={questionsAsked} />
        <Stat icon={WifiOff} label="Offline answers" value={offlineCount} />
        <Stat icon={Sparkles} label="AI answers" value={aiCount} />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-2xl border bg-card p-6 shadow-card">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">
                Question categories
              </div>
              <div className="mt-1 font-display text-2xl">Where you focus</div>
            </div>
            <Leaf className="h-5 w-5 text-leaf" />
          </div>
          {catData.length === 0 ? (
            <div className="grid h-60 place-items-center text-sm text-muted-foreground">
              Ask a few questions to see categories.
            </div>
          ) : (
            <div>
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={catData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius="55%"
                      outerRadius="85%"
                      paddingAngle={2}
                    >
                      {catData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: 12,
                        fontSize: 12,
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs">
                {catData.map((c, i) => (
                  <span key={c.name} className="inline-flex items-center gap-1.5">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ background: COLORS[i % COLORS.length] }}
                    />
                    {c.name} ({c.value})
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="rounded-2xl border bg-card p-6 shadow-card">
          <div className="mb-4 text-xs uppercase tracking-wider text-muted-foreground">
            Recent activity
          </div>
          {recent.length === 0 ? (
            <div className="grid h-64 place-items-center text-sm text-muted-foreground">
              No activity yet.
            </div>
          ) : (
            <ul className="space-y-3">
              {recent.map((m) => (
                <li key={m.id} className="flex items-start gap-3 rounded-xl border p-3">
                  <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-accent">
                    <MessageSquare className="h-4 w-4 text-accent-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm">{m.content}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(m.createdAt).toLocaleString()}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  tone?: "leaf";
}) {
  return (
    <div className="rounded-2xl border bg-card p-5 shadow-card">
      <div className="flex items-center justify-between">
        <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
        <div
          className={`grid h-8 w-8 place-items-center rounded-lg ${
            tone === "leaf" ? "leaf-gradient text-leaf-foreground" : "bg-accent text-accent-foreground"
          }`}
        >
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="mt-2 font-display text-3xl">{value}</div>
    </div>
  );
}
