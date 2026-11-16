import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Loader2, Plus, X } from "lucide-react";
import { analyzeTradeoffs } from "@/lib/intel.functions";
import { weightedScore, type Weights } from "@/lib/intel";
import { Button } from "@/components/Button";
import { field, meta, primaryBtn, SaveInvestigation, SourceTag, ToolHeader } from "@/components/intel/Shared";

export const Route = createFileRoute("/intelligence/tradeoffs")({
  ...meta("EcoTrade-offs — Weigh environmental, economic and social choices", "Compare two to four options side by side and adjust what matters most to see how the balance shifts."),
  component: Tradeoffs,
});

type Result = Awaited<ReturnType<typeof analyzeTradeoffs>>;
const dims = ["environmental", "economic", "social"] as const;

function Tradeoffs() {
  const run = useServerFn(analyzeTradeoffs);
  const [decision, setDecision] = useState("");
  const [opts, setOpts] = useState(["", ""]);
  const [w, setW] = useState<Weights>({ environmental: 2, economic: 1, social: 1 });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [res, setRes] = useState<Result | null>(null);
  const filled = opts.map((o) => o.trim()).filter(Boolean);
  const ranked = res ? [...res.options].map((o) => ({ ...o, total: weightedScore(o, w) })).sort((a, b) => b.total - a.total) : [];
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <ToolHeader title="EcoTrade-offs" intro="Describe a decision and the options you're weighing. See the gains and costs of each, then set your own priorities." />
      <form className="space-y-3" onSubmit={async (e) => {
        e.preventDefault(); setBusy(true); setErr(null); setRes(null);
        try { setRes(await run({ data: { decision, options: filled } })); } catch { setErr("The comparison couldn't finish. Please try again."); } finally { setBusy(false); }
      }}>
        <input className={field} value={decision} onChange={(e) => setDecision(e.target.value)} placeholder="e.g. How should our school heat its classrooms?" />
        {opts.map((o, i) => (
          <div key={i} className="flex gap-2">
            <input className={field} value={o} onChange={(e) => setOpts(opts.map((x, j) => (j === i ? e.target.value : x)))} placeholder={`Option ${i + 1}`} />
            {opts.length > 2 && <button type="button" aria-label="Remove option" className="rounded-lg px-2 text-muted-foreground hover:bg-accent" onClick={() => setOpts(opts.filter((_, j) => j !== i))}><X className="h-4 w-4" /></button>}
          </div>
        ))}
        <div className="flex flex-wrap gap-2">
          {opts.length < 4 && <Button type="button" onClick={() => setOpts([...opts, ""])}><Plus className="h-4 w-4" /> Add option</Button>}
          <Button type="submit" className={primaryBtn} disabled={busy || decision.trim().length < 3 || filled.length < 2}>
            {busy && <Loader2 className="h-4 w-4 animate-spin" />} {busy ? "Comparing…" : "Compare options"}
          </Button>
        </div>
        {err && <p className="text-sm text-destructive">{err}</p>}
      </form>
      {res && (
        <section className="mt-8 space-y-6">
          <div className="rounded-2xl border bg-card p-6">
            <SourceTag kind="ai" />
            <p className="mt-3">{res.summary}</p>
            <p className="mt-2 text-xs text-muted-foreground">Scores are reasoned estimates (0–100), not measurements.</p>
          </div>
          <div className="rounded-2xl border bg-card p-6">
            <h2 className="font-display text-xl">What matters most to you?</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              {dims.map((d) => (
                <label key={d} className="text-sm capitalize">
                  {d}: <strong>{w[d]}</strong>
                  <input type="range" min={0} max={5} value={w[d]} onChange={(e) => setW({ ...w, [d]: Number(e.target.value) })} className="mt-2 w-full accent-primary" />
                </label>
              ))}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Formula: (environmental × {w.environmental} + economic × {w.economic} + social × {w.social}) ÷ {w.environmental + w.economic + w.social || "3 (equal weights)"}
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {ranked.map((o, i) => (
              <div key={o.name} className={`rounded-2xl border bg-card p-6 ${i === 0 ? "border-primary" : ""}`}>
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="font-display text-lg">{o.name}</h3>
                  <span className="font-display text-3xl text-primary">{o.total}</span>
                </div>
                {i === 0 && <div className="text-xs font-medium text-primary">Best fit for your priorities</div>}
                <div className="mt-3 space-y-2">
                  {dims.map((d) => (
                    <div key={d} className="text-xs">
                      <div className="flex justify-between capitalize"><span>{d}</span><span>{o[d]}</span></div>
                      <div className="mt-1 h-1.5 rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${o[d]}%` }} /></div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                  <div><div className="font-semibold">Gains</div><ul className="mt-1 list-disc pl-4 text-muted-foreground">{o.gains.map((g) => <li key={g}>{g}</li>)}</ul></div>
                  <div><div className="font-semibold">Costs</div><ul className="mt-1 list-disc pl-4 text-muted-foreground">{o.costs.map((g) => <li key={g}>{g}</li>)}</ul></div>
                </div>
              </div>
            ))}
          </div>
          {res.uncertainties.length > 0 && (
            <div className="rounded-2xl border bg-card p-6 text-sm">
              <div className="font-semibold">Key uncertainties</div>
              <ul className="mt-1 list-disc pl-5 text-muted-foreground">{res.uncertainties.map((u) => <li key={u}>{u}</li>)}</ul>
            </div>
          )}
          <SaveInvestigation kind="tradeoffs" title={decision} input={{ decision, options: filled, weights: w }} result={res} />
        </section>
      )}
    </main>
  );
}
