import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { assessEvidence } from "@/lib/intel.functions";
import { Button } from "@/components/Button";
import { field, meta, primaryBtn, RecordCard, SaveInvestigation, SourceTag, ToolHeader } from "@/components/intel/Shared";

export const Route = createFileRoute("/intelligence/evidence")({
  ...meta("EcoEvidence — Judge the quality of environmental research", "Look up a study by title, DOI or link to see publication details, citations, retractions and a review of its methods and limits."),
  component: Evidence,
});

type Result = Awaited<ReturnType<typeof assessEvidence>>;

function Evidence() {
  const run = useServerFn(assessEvidence);
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [res, setRes] = useState<Result | null>(null);
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <ToolHeader title="EcoEvidence" intro="Enter a study title, DOI or doi.org link. We pull its publication record, then review its methods and limitations." />
      <form className="flex flex-col gap-3 sm:flex-row" onSubmit={async (e) => {
        e.preventDefault(); setBusy(true); setErr(null); setRes(null);
        try { setRes(await run({ data: { query: q } })); } catch { setErr("The review couldn't finish. Please try again."); } finally { setBusy(false); }
      }}>
        <input className={field} value={q} onChange={(e) => setQ(e.target.value)} placeholder="e.g. 10.1126/science.aaq0216 or a study title" />
        <Button type="submit" className={`${primaryBtn} shrink-0`} disabled={busy || q.trim().length < 3}>
          {busy && <Loader2 className="h-4 w-4 animate-spin" />} {busy ? "Reviewing…" : "Review study"}
        </Button>
      </form>
      {err && <p className="mt-3 text-sm text-destructive">{err}</p>}
      {res && !res.found && <p className="mt-6 text-muted-foreground">No matching study was found. Try the exact title or DOI.</p>}
      {res?.found && (
        <section className="mt-8 space-y-6">
          <div><div className="mb-2"><SourceTag kind="record" /></div><RecordCard r={res.record} /></div>
          <div className="rounded-2xl border bg-card p-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-primary px-3 py-1 text-sm font-semibold text-primary-foreground">Evidence strength: {res.review.strength}</span>
              <SourceTag kind="ai" />
            </div>
            <p className="mt-4">{res.review.plainSummary}</p>
            <h3 className="mt-5 font-semibold">Methodology</h3>
            <p className="mt-1 text-sm text-muted-foreground">{res.review.methodology}</p>
            <h3 className="mt-5 font-semibold">Limitations</h3>
            <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-muted-foreground">{res.review.limitations.map((l) => <li key={l}>{l}</li>)}</ul>
            <h3 className="mt-5 font-semibold">Conflicts of interest</h3>
            <p className="mt-1 text-sm text-muted-foreground">{res.review.conflictsOfInterest}</p>
          </div>
          {res.related.length > 0 && (
            <div>
              <h2 className="mb-3 font-display text-xl">Related studies</h2>
              <div className="space-y-3">{res.related.map((r, i) => <RecordCard key={r.url + i} r={r} />)}</div>
            </div>
          )}
          <SaveInvestigation kind="evidence" title={res.record.title} input={{ query: q }} result={res} />
        </section>
      )}
    </main>
  );
}
