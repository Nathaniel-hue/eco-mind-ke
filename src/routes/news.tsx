import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ExternalLink, MapPin, RefreshCw } from "lucide-react";
import { getEcoNews } from "@/lib/news.functions";
import { NEWS_CATEGORIES } from "@/lib/news";
import { Button } from "@/components/Button";
const newsQuery = queryOptions({
  queryKey: ["eco-news"],
  queryFn: () => getEcoNews(),
  staleTime: 2 * 60 * 60 * 1000,
});
export const Route = createFileRoute("/news")({
  staticData: { sitemap: true },
  loader: ({ context }) => context.queryClient.ensureQueryData(newsQuery),
  head: () => ({
    meta: [
      { title: "Eco News — Current Environmental Stories | EcoMind" },
      {
        name: "description",
        content:
          "Latest environmental reporting from Mongabay and Carbon Brief, with publication dates and direct source links.",
      },
      { property: "og:title", content: "Current Eco News — EcoMind" },
      {
        property: "og:description",
        content: "Environmental stories from around the world, linked to their original reporting.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: News,
});
function News() {
  const [category, setCategory] = useState("All");
  const { data, refetch, isFetching } = useSuspenseQuery(newsQuery);
  const list =
    category === "All" ? data.stories : data.stories.filter((s) => s.category === category);
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <p className="text-xs uppercase tracking-widest text-muted-foreground">Eco News</p>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-4xl">Our changing planet</h1>
        <Button
          onClick={() => void refetch()}
          disabled={isFetching}
          aria-label="Refresh news"
          title="Refresh news"
        >
          <RefreshCw size={17} className={isFetching ? "animate-spin" : ""} />
        </Button>
      </div>
      <p role="status" className="mt-4 text-sm text-muted-foreground">
        {data.fallback
          ? "Live feeds unavailable · selected background reading"
          : data.partial
            ? "Latest reporting · one source is temporarily unavailable"
            : "Latest reporting from Mongabay and Carbon Brief"}
      </p>
      <div className="mt-6 flex flex-wrap gap-2" aria-label="News categories">
        {NEWS_CATEGORIES.map((c) => (
          <Button
            key={c}
            aria-pressed={c === category}
            onClick={() => setCategory(c)}
            className={
              c === category ? "bg-primary text-primary-foreground" : "bg-card hover:bg-accent"
            }
          >
            {c}
          </Button>
        ))}
      </div>
      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        {list.map((s) => (
          <article key={s.url} className="flex flex-col rounded-lg border bg-card p-6 shadow-card">
            <div className="flex flex-wrap justify-between gap-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <MapPin size={14} />
                {s.region}
              </span>
              <span>{s.category}</span>
            </div>
            <h2 className="mt-4 text-xl">{s.title}</h2>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{s.summary}</p>
            <div className="mt-5 flex flex-wrap justify-between gap-2 text-xs text-muted-foreground">
              <span>
                {s.published
                  ? new Intl.DateTimeFormat("en", { dateStyle: "medium", timeZone: "UTC" }).format(
                      new Date(s.published),
                    )
                  : "Background reading"}
              </span>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-primary hover:underline"
              >
                {s.source}
                <ExternalLink size={13} />
              </a>
            </div>
          </article>
        ))}
      </div>
      {!list.length && (
        <p className="py-16 text-center text-muted-foreground">
          No stories in this category right now.
        </p>
      )}
    </main>
  );
}
