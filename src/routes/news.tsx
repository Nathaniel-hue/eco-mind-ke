import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ExternalLink, MapPin } from "lucide-react";

export const Route = createFileRoute("/news")({
  head: () => ({
    meta: [
      { title: "Eco News — Good news for the planet | EcoMind" },
      { name: "description", content: "Uplifting ecological advancements from around the world: clean energy, wildlife recoveries, ocean protection and more." },
      { property: "og:title", content: "Eco News on EcoMind" },
      { property: "og:description", content: "Real ecological wins from around the world, explained simply." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: News,
});

type Story = { title: string; region: string; category: string; summary: string; metric: string; source: string; url: string };

const STORIES: Story[] = [
  { title: "The ozone layer is on track to fully heal", region: "Global", category: "Climate Policy", summary: "Thanks to the Montreal Protocol's ban on CFCs, the ozone layer is recovering. UN scientists expect it to return to 1980 levels within decades.", metric: "Recovery by ~2066 over Antarctica", source: "UNEP", url: "https://www.unep.org/news-and-stories/press-release/ozone-layer-recovery-track-helping-avoid-global-warming-05degc" },
  { title: "High Seas Treaty protects international waters", region: "Global", category: "Oceans", summary: "Nations agreed the first treaty to protect marine life in the high seas, opening the way for marine protected areas beyond national borders.", metric: "Covers ~2/3 of the ocean", source: "United Nations", url: "https://www.un.org/bbnj/" },
  { title: "Solar becomes the world's fastest-growing power source", region: "Global", category: "Clean Energy", summary: "Record solar installations keep pushing renewables' share of global electricity higher year after year, led by China, India and Europe.", metric: "Renewables ~30% of global power", source: "Ember", url: "https://ember-energy.org/latest-insights/global-electricity-review-2024/" },
  { title: "Kenya's Great Green Wall and tree restoration", region: "Kenya", category: "Biodiversity", summary: "Kenya has set a goal of growing 15 billion trees to restore degraded land, protect water catchments and support livelihoods.", metric: "15 billion trees target", source: "Kenya Forest Service", url: "https://www.kenyaforestservice.org/" },
  { title: "Humpback whales bounce back", region: "Southern Hemisphere", category: "Biodiversity", summary: "After commercial whaling ended, several humpback populations have recovered to near pre-whaling numbers.", metric: "Western South Atlantic ~93% recovered", source: "Royal Society Open Science", url: "https://royalsocietypublishing.org/doi/10.1098/rsos.190368" },
  { title: "Iberian lynx off the endangered list", region: "Spain & Portugal", category: "Biodiversity", summary: "Once down to under 100 animals, the Iberian lynx was downgraded to 'vulnerable' after decades of habitat restoration and breeding.", metric: "From <100 to 2,000+ lynx", source: "IUCN", url: "https://www.iucn.org/press-release/202406/iberian-lynx-no-longer-endangered-iucn-red-list" },
  { title: "Right to repair laws spread across Europe", region: "European Union", category: "Circular Tech", summary: "New EU rules require manufacturers to repair common appliances and make spare parts available, keeping products in use longer.", metric: "Fewer goods discarded early", source: "European Parliament", url: "https://www.europarl.europa.eu/news/en/press-room/20240419IPR20590/right-to-repair-making-repair-easier-and-more-appealing-to-consumers" },
  { title: "Costa Rica runs on renewable electricity", region: "Costa Rica", category: "Clean Energy", summary: "Hydro, geothermal, wind and solar supply almost all of Costa Rica's electricity, year after year.", metric: "~98% renewable grid", source: "Wikipedia", url: "https://en.wikipedia.org/wiki/Renewable_energy_in_Costa_Rica" },
];

const CATS = ["All", "Clean Energy", "Biodiversity", "Oceans", "Circular Tech", "Climate Policy"];

function News() {
  const [cat, setCat] = useState("All");
  const list = cat === "All" ? STORIES : STORIES.filter((s) => s.category === cat);
  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <p className="text-xs uppercase tracking-widest text-muted-foreground">Eco News</p>
      <h1 className="mt-2 font-display text-4xl">Good news for the planet</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">Real ecological progress from around the world — explained simply, with sources you can check.</p>
      <div className="mt-6 flex flex-wrap gap-2">
        {CATS.map((c) => (
          <button key={c} onClick={() => setCat(c)} className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${cat === c ? "bg-primary text-primary-foreground" : "bg-card hover:bg-accent"}`}>{c}</button>
        ))}
      </div>
      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        {list.map((s) => (
          <article key={s.title} className="flex flex-col rounded-3xl border bg-card p-6 shadow-card transition-transform hover:-translate-y-1">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{s.region}</span>
              <span className="rounded-full bg-accent px-2.5 py-0.5 text-accent-foreground">{s.category}</span>
            </div>
            <h2 className="mt-3 font-display text-xl">{s.title}</h2>
            <p className="mt-2 flex-1 text-sm text-muted-foreground">{s.summary}</p>
            <div className="mt-4 rounded-xl bg-accent/60 px-3 py-2 text-sm font-medium text-accent-foreground">{s.metric}</div>
            <a href={s.url} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-1 text-sm text-primary hover:underline">{s.source}<ExternalLink className="h-3.5 w-3.5" /></a>
          </article>
        ))}
      </div>
    </main>
  );
}
