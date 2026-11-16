import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { factCheck } from "@/lib/intel.functions";
import { Button } from "@/components/Button";
import { field, meta, primaryBtn, RecordCard, SaveInvestigation, SourceTag, ToolHeader } from "@/components/intel/Shared";

export const Route = createFileRoute("/intelligence/factcheck")({
  ...meta("EcoFactCheck — Check environmental claims against research", "Paste an environmental claim or article and see what published studies say, with every source linked."),
  component: FactCheck,
});

type Result = Awaited<ReturnType<typeof factCheck>>;
const tone: Record<string, string> = {
  Supported: "bg-primary text-primary-foreground",
  Mixed: "bg-secondary text-secondary-foreground",
  Unsupported: "bg-destructive text-destructive-foreground",
  "Not enough evidence": "bg-muted text-foreground",
};

function FactCheck() {
  const run = useServerFn(factCheck);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [res, setRes] = useState<Result | null>(null);
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <ToolHeader title="EcoFactCheck" intro="Paste a claim, headline or article passage. We search published research, then explain how well it backs the claim." />
      <form className="space-y-3" onSubmit={async (e) => {
        e.preventDefault(); setBusy(true); setErr(null); setRes(null);
        try { setRes(await run({ data: { text } })); } catch { setErr("The check couldn't finish. Please try again."); } finally { setBusy(false); }
      }}>
        <textarea className={`${field} min-h-32`} value={text} onChange={(e) => setText(e.target.value)} placeholder="e.g. Paper bags are always better for the environment than plastic bags." />
        <Button type="submit" className={primaryBtn} disabled={busy || text.trim().length < 5}>
          {busy && <Loader2 className="h-4 w-4 animate-spin" />} {busy ? "Checking research…" : "Check claim"}
        </Button>
        {err && <p className="text-sm text-destructive">{err}</p>}
      </form>
      {res && (
        <section className="mt-8 space-y-6">
          <div className="rounded-2xl border bg-card p-6">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Claim examined</div>
            <p className="mt-1 font-display text-xl">“{res.claim}”</p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className={`rounded-full px-3 py-1 text-sm font-semibold ${tone[res.rating]}`}>{res.rating}</span>
              <SourceTag kind="ai" />
            </div>
            <p className="mt-4">{res.summary}</p>
            <p className="mt-3 whitespace-pre-line text-sm text-muted-foreground">{res.reasoning}</p>
            {res.caveats.length > 0 && (
              <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-muted-foreground">{res.caveats.map((c) => <li key={c}>{c}</li>)}</ul>
            )}
          </div>
          <div>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-display text-xl">Studies found</h2><SourceTag kind="record" />
            </div>
            <p className="mb-3 text-xs text-muted-foreground">Search used: “{res.query}”</p>
            {res.records.length === 0 ? <p className="text-sm text-muted-foreground">No matching studies were found, so no rating beyond “Not enough evidence” is given.</p> : (
              <div className="space-y-3">{res.records.map((r, i) => (
                <RecordCard key={r.url + i} r={r} n={i + 1} tone={res.supporting.includes(i + 1) ? "support" : res.contradicting.includes(i + 1) ? "contra" : undefined} />
              ))}</div>
            )}
          </div>
          <SaveInvestigation kind="factcheck" title={res.claim} input={{ text }} result={res} />
        </section>
      )}
    </main>
  );
}
