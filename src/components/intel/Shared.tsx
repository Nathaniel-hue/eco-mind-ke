import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { BookOpen, Bot, Save, Check, ExternalLink, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/use-auth";
import type { EvidenceRecord, InvestigationKind } from "@/lib/intel";
import { Button } from "../Button";

export function SourceTag({ kind }: { kind: "record" | "ai" }) {
  return kind === "record" ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
      <BookOpen className="h-3 w-3" /> Found in published records
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
      <Bot className="h-3 w-3" /> AI reasoning — not verified evidence
    </span>
  );
}

export function RecordCard({ r, n, tone }: { r: EvidenceRecord; n?: number; tone?: "support" | "contra" }) {
  return (
    <a href={r.url} target="_blank" rel="noreferrer" className="block rounded-xl border bg-card p-4 transition-colors hover:bg-accent/40">
      <div className="flex items-start justify-between gap-3">
        <div className="font-medium leading-snug">
          {n ? <span className="mr-1 text-muted-foreground">[{n}]</span> : null}
          {r.title}
        </div>
        <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground" />
      </div>
      <div className="mt-1 text-xs text-muted-foreground">
        {[r.authors.slice(0, 3).join(", "), r.venue, r.year].filter(Boolean).join(" · ")} · {r.citations} citations · via {r.origin}
      </div>
      <div className="mt-2 flex flex-wrap gap-2 text-xs">
        {r.retracted && (
          <span className="inline-flex items-center gap-1 rounded-full bg-destructive/15 px-2 py-0.5 font-medium text-destructive">
            <AlertTriangle className="h-3 w-3" /> Retracted
          </span>
        )}
        {tone === "support" && <span className="rounded-full bg-primary/10 px-2 py-0.5 text-primary">Supports the claim</span>}
        {tone === "contra" && <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-destructive">Challenges the claim</span>}
      </div>
    </a>
  );
}

export function SaveInvestigation({ kind, title, input, result }: { kind: InvestigationKind; title: string; input: unknown; result: unknown }) {
  const { user } = useAuth();
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  if (!user)
    return (
      <Link to="/auth" className="text-sm text-primary underline">
        Sign in to save this investigation
      </Link>
    );
  return (
    <Button
      disabled={state === "saving" || state === "saved"}
      onClick={async () => {
        setState("saving");
        const { error } = await supabase.from("investigations").insert({
          user_id: user.id, kind, title: title.slice(0, 200), input: input as never, result: result as never,
        });
        setState(error ? "error" : "saved");
      }}
    >
      {state === "saved" ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
      {state === "saved" ? "Saved to your Intelligence Centre" : state === "error" ? "Could not save — try again" : "Save investigation"}
    </Button>
  );
}

export function ToolHeader({ title, intro }: { title: string; intro: string }) {
  return (
    <div className="mb-6">
      <Link to="/intelligence" className="text-sm text-muted-foreground hover:text-foreground">← Intelligence Centre</Link>
      <h1 className="mt-2 font-display text-3xl sm:text-4xl">{title}</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">{intro}</p>
    </div>
  );
}

export const field = "w-full rounded-xl border bg-background px-4 py-3 text-sm focus-visible:outline-2 focus-visible:outline-ring";
export const primaryBtn = "border-primary bg-primary text-primary-foreground hover:opacity-90";
export function meta(title: string, description: string, sitemap = true) {
  return {
    staticData: { sitemap },
    head: () => ({
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary" },
      ],
    }),
  };
}
