import { XMLParser } from "fast-xml-parser";
import type { Story } from "./news";
export function parseNews(xml: string, source: string): Story[] {
  const parsed = new XMLParser({ ignoreAttributes: false, processEntities: true }).parse(xml);
  const raw = parsed?.rss?.channel?.item ?? [];
  const list = Array.isArray(raw) ? raw : [raw];
  const text = (value: unknown) =>
    String(value ?? "")
      .replace(/<[^>]*>/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&#(x[0-9a-f]+|\d+);/gi, (_, code: string) => {
        const n = code.startsWith("x") ? parseInt(code.slice(1), 16) : Number(code);
        return n <= 0x10ffff ? String.fromCodePoint(n) : "";
      })
      .replace(/&rsquo;/g, "’")
      .replace(/&quot;/g, '"')
      .replace(/&nbsp;/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  return list.flatMap((item): Story[] => {
    const title = text(item.title),
      summary = text(item.description).slice(0, 360),
      url = text(item.link);
    if (!title || !/^https:\/\//.test(url)) return [];
    const tags = Array.isArray(item.category)
      ? item.category.join(" ")
      : String(item.category ?? "");
    const topic = `${title} ${tags}`.toLowerCase();
    const category = /solar|wind|renewable|electricity|energy/.test(topic)
      ? "Clean Energy"
      : /ocean|marine|coral|sea|fish/.test(topic)
        ? "Oceans"
        : /recycl|plastic|repair|circular|waste/.test(topic)
          ? "Circular Tech"
          : /climate|carbon|policy|emission/.test(topic)
            ? "Climate Policy"
            : "Biodiversity";
    const date = new Date(String(item.pubDate ?? ""));
    const regions = [
      "Kenya",
      "Africa",
      "Brazil",
      "Indonesia",
      "India",
      "China",
      "Europe",
      "Australia",
    ];
    return [
      {
        title,
        summary,
        url,
        source,
        category,
        published: Number.isNaN(date.getTime()) ? null : date.toISOString(),
        region: regions.find((r) => topic.includes(r.toLowerCase())) ?? "World",
      },
    ];
  });
}
