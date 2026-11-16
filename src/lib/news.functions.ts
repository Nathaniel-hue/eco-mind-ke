import { createServerFn } from "@tanstack/react-start";
import { parseNews } from "./news-parser";
import { FALLBACK_STORIES } from "./news";
export const getEcoNews = createServerFn({ method: "GET" }).handler(async () => {
  const feeds = [
    { url: "https://news.mongabay.com/feed/", source: "Mongabay" },
    { url: "https://www.carbonbrief.org/feed/", source: "Carbon Brief" },
  ];
  const results = await Promise.allSettled(
    feeds.map(async (feed) => {
      const response = await fetch(feed.url, {
        signal: AbortSignal.timeout(10000),
        headers: { Accept: "application/rss+xml, application/xml" },
      });
      if (!response.ok) throw new Error("Feed unavailable");
      const xml = await response.text();
      if (xml.length > 2000000) throw new Error("Feed too large");
      const stories = parseNews(xml, feed.source);
      if (!stories.length) throw new Error("Empty feed");
      return stories;
    }),
  );
  const unique = new Map(
    results.flatMap((r) => (r.status === "fulfilled" ? r.value : [])).map((s) => [s.url, s]),
  );
  const stories = [...unique.values()]
    .sort((a, b) => (b.published ?? "").localeCompare(a.published ?? ""))
    .slice(0, 40);
  return {
    stories: stories.length ? stories : FALLBACK_STORIES,
    fallback: stories.length === 0,
    partial: results.some((r) => r.status === "rejected"),
    fetchedAt: new Date().toISOString(),
  };
});
