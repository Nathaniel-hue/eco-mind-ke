import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SearchCheck, Microscope, Scale, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/use-auth";
import { meta } from "@/components/intel/Shared";

export const Route = createFileRoute("/intelligence/")({
  ...meta("EcoMind Intelligence Centre — Fact-checks, evidence and trade-offs", "Investigate environmental claims, judge research quality and weigh trade-offs, with every source traceable."),
  component: Centre,
});

const tools = [
  { to: "/intelligence/factcheck", icon: SearchCheck, name: "EcoFactCheck", body: "Check an environmental claim or article against published research." },
  { to: "/intelligence/evidence", icon: Microscope, name: "EcoEvidence", body: "Judge how strong a study is: methods, limits, citations, retractions." },
  { to: "/intelligence/tradeoffs", icon: Scale, name: "EcoTrade-offs", body: "Compare options across environmental, economic and social effects." },
] as const;

type Row = { id: string; kind: string; title: string; created_at: string };
const kindName: Record<string, string> = { factcheck: "EcoFactCheck", evidence: "EcoEvidence", tradeoffs: "EcoTrade-offs" };

function Centre() {
  const { user } = useAuth();
  const [rows, setRows] = useState<Row[] | null>(null);
  useEffect(() => {
    if (!user) return setRows(null);
    void supabase.from("investigations").select("id, kind, title, created_at").order("created_at", { ascending: false }).limit(50)
      .then(({ data }) => setRows(data ?? []));
  }, [user]);
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <p className="text-xs uppercase tracking-widest text-muted-foreground">Intelligence Centre</p>
      <h1 className="mt-2 font-display text-4xl">Investigate, don't guess.</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Tools for students, researchers and organisations. Results always separate what published records show from what the AI reasons — AI reasoning is never presented as verified science.
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {tools.map(({ to, icon: Icon, name, body }) => (
          <Link key={to} to={to} className="rounded-2xl border bg-card p-6 transition-colors hover:bg-accent/40">
            <Icon className="h-6 w-6 text-primary" />
            <div className="mt-3 font-display text-xl">{name}</div>
            <p className="mt-1 text-sm text-muted-foreground">{body}</p>
          </Link>
        ))}
      </div>
      <section className="mt-12">
        <h2 className="font-display text-2xl">Your saved investigations</h2>
        {!user ? (
          <p className="mt-2 text-sm text-muted-foreground"><Link to="/auth" className="text-primary underline">Sign in</Link> to save and revisit investigations.</p>
        ) : rows === null ? (
          <p className="mt-2 text-sm text-muted-foreground">Loading…</p>
        ) : rows.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">Nothing saved yet. Run a tool above and press “Save investigation”.</p>
        ) : (
          <ul className="mt-4 divide-y rounded-2xl border bg-card">
            {rows.map((r) => (
              <li key={r.id} className="flex items-center justify-between gap-3 px-4 py-3">
                <div className="min-w-0">
                  <div className="truncate font-medium">{r.title}</div>
                  <div className="text-xs text-muted-foreground">{kindName[r.kind] ?? r.kind} · {new Date(r.created_at).toLocaleDateString()}</div>
                </div>
                <button aria-label="Delete investigation" className="rounded-lg p-2 text-muted-foreground hover:bg-accent"
                  onClick={async () => { await supabase.from("investigations").delete().eq("id", r.id); setRows((x) => x?.filter((y) => y.id !== r.id) ?? null); }}>
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
