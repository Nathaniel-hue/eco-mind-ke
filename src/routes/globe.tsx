import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { geoOrthographic, geoPath, geoGraticule10, geoDistance } from "d3-geo";
import { feature } from "topojson-client";
import world from "world-atlas/countries-110m.json";
import { ArrowDown, ExternalLink, RotateCw } from "lucide-react";
import { GLOBE_EVENTS, type GlobeEvent } from "@/lib/globe-events";
import { Button } from "@/components/Button";

export const Route = createFileRoute("/globe")({
  staticData: { sitemap: true },
  head: () => ({
    meta: [
      { title: "Eco Globe — Wins and Damage Around the World | EcoMind" },
      { name: "description", content: "An interactive globe of sustainability achievements (green) and environmental damage (red), with causes and sources." },
      { property: "og:title", content: "Eco Globe — EcoMind" },
      { property: "og:description", content: "Explore environmental wins and harms by country on an interactive globe." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: GlobePage,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const countries = feature(world as any, (world as any).objects.countries) as any;
const SIZE = 460;

function GlobePage() {
  const [rot, setRot] = useState<[number, number]>([-30, -10]);
  const [spin, setSpin] = useState(true);
  const [filter, setFilter] = useState<"all" | "good" | "bad">("all");
  const [sel, setSel] = useState<GlobeEvent | null>(null);
  const drag = useRef<{ x: number; y: number; r: [number, number] } | null>(null);
  const overviewRef = useRef<HTMLElement | null>(null);

  const readMore = () => overviewRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  useEffect(() => {
    if (!spin) return;
    const t = setInterval(() => setRot(([a, b]) => [a + 0.4, b]), 40);
    return () => clearInterval(t);
  }, [spin]);

  const proj = useMemo(() => geoOrthographic().scale(SIZE / 2 - 8).translate([SIZE / 2, SIZE / 2]).rotate(rot), [rot]);
  const path = geoPath(proj);
  const events = GLOBE_EVENTS.filter((e) => filter === "all" || e.kind === filter);
  const center: [number, number] = [-rot[0], -rot[1]];

  const focus = (e: GlobeEvent) => { setSel(e); setSpin(false); setRot([-e.lng, -e.lat]); };

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <p className="text-xs uppercase tracking-widest text-muted-foreground">Eco Globe</p>
      <h1 className="mt-2 text-4xl">Wins and damage around the world</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">Green dots mark sustainability achievements; red dots mark environmental damage and what is causing it. Drag to spin, tap a dot for details.</p>
      <div className="mt-6 flex flex-wrap gap-2">
        {(["all", "good", "bad"] as const).map((f) => (
          <Button key={f} aria-pressed={filter === f} onClick={() => setFilter(f)} className={filter === f ? "bg-primary text-primary-foreground" : "bg-card hover:bg-accent"}>
            {f === "all" ? "All" : f === "good" ? "Achievements" : "Damage"}
          </Button>
        ))}
        <Button onClick={() => setSpin((s) => !s)} className="bg-card hover:bg-accent" aria-label="Toggle spin"><RotateCw size={16} /> {spin ? "Pause" : "Spin"}</Button>
      </div>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="mx-auto w-full max-w-[520px] touch-none cursor-grab select-none" role="img" aria-label="Interactive globe"
          onPointerDown={(e) => { (e.target as Element).setPointerCapture?.(e.pointerId); drag.current = { x: e.clientX, y: e.clientY, r: rot }; setSpin(false); }}
          onPointerMove={(e) => { const d = drag.current; if (!d) return; setRot([d.r[0] + (e.clientX - d.x) * 0.4, Math.max(-80, Math.min(80, d.r[1] - (e.clientY - d.y) * 0.4))]); }}
          onPointerUp={() => (drag.current = null)}>
          <circle cx={SIZE / 2} cy={SIZE / 2} r={SIZE / 2 - 8} fill="var(--accent)" stroke="var(--border)" />
          <path d={path(geoGraticule10()) ?? ""} fill="none" stroke="var(--border)" strokeWidth={0.5} />
          <path d={path(countries) ?? ""} fill="var(--card)" stroke="var(--muted-foreground)" strokeWidth={0.4} />
          {events.map((e) => {
            if (geoDistance([e.lng, e.lat], center) > Math.PI / 2) return null;
            const p = proj([e.lng, e.lat]);
            if (!p) return null;
            const color = e.kind === "good" ? "var(--leaf)" : "var(--destructive)";
            return (
              <g key={e.id} className="cursor-pointer" onPointerDown={(ev) => ev.stopPropagation()} onClick={() => focus(e)}>
                <circle cx={p[0]} cy={p[1]} r={sel?.id === e.id ? 12 : 9} fill={color} opacity={0.25} />
                <circle cx={p[0]} cy={p[1]} r={5} fill={color} stroke="var(--background)" strokeWidth={1.5}><title>{`${e.country}: ${e.title}`}</title></circle>
              </g>
            );
          })}
        </svg>
        <aside className="space-y-3">
          {sel ? <Detail e={sel} onReadMore={readMore} /> : <p className="rounded-lg border bg-card p-5 text-sm text-muted-foreground">Select a dot or a story below.</p>}
          <ul className="max-h-[420px] space-y-2 overflow-y-auto pr-1">
            {events.map((e) => (
              <li key={e.id}>
                <button onClick={() => focus(e)} className="flex w-full items-start gap-3 rounded-lg border bg-card p-3 text-left text-sm hover:bg-accent">
                  <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: e.kind === "good" ? "var(--leaf)" : "var(--destructive)" }} />
                  <span><span className="block text-xs text-muted-foreground">{e.country}</span>{e.title}</span>
                </button>
              </li>
            ))}
          </ul>
        </aside>
      </div>
      {sel && (
        <section ref={overviewRef} aria-label="Story overview" className="mt-12 scroll-mt-24 rounded-xl border bg-card p-6 shadow-card sm:p-8">
          <div className="text-xs uppercase tracking-wider" style={{ color: sel.kind === "good" ? "var(--leaf)" : "var(--destructive)" }}>{sel.kind === "good" ? "Achievement" : "Damage"} · {sel.country}</div>
          <h2 className="mt-2 text-3xl">{sel.title}</h2>
          <p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">{sel.overview}</p>
          {sel.cause && <p className="mt-4 max-w-3xl text-sm"><strong>Where it comes from:</strong> {sel.cause}</p>}
          <a href={sel.url} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-1 text-sm text-primary hover:underline">Read the original source: {sel.source} <ExternalLink size={13} /></a>
        </section>
      )}
    </main>
  );
}

function Detail({ e, onReadMore }: { e: GlobeEvent; onReadMore: () => void }) {
  return (
    <article className="rounded-lg border bg-card p-5 shadow-card">
      <div className="text-xs uppercase tracking-wider" style={{ color: e.kind === "good" ? "var(--leaf)" : "var(--destructive)" }}>{e.kind === "good" ? "Achievement" : "Damage"} · {e.country}</div>
      <h2 className="mt-2 text-xl">{e.title}</h2>
      <p className="mt-2 text-sm text-muted-foreground">{e.summary}</p>
      {e.cause && <p className="mt-2 text-sm"><strong>Where it comes from:</strong> {e.cause}</p>}
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <Button onClick={onReadMore} className="bg-primary text-primary-foreground">Read more <ArrowDown size={14} /></Button>
        <a href={e.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">{e.source} <ExternalLink size={13} /></a>
      </div>
    </article>
  );
}
