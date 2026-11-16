import { it, expect } from "vitest";
import { parseNews } from "./news-parser";
it("extracts original news dates and safe source links", () => {
  const stories = parseNews(
    "<rss><channel><item><title>Solar in Kenya</title><link>https://example.org/story</link><description><![CDATA[<p>New capacity.</p>]]></description><pubDate>Mon, 16 Nov 2026 08:00:00 GMT</pubDate></item><item><title>Unsafe</title><link>javascript:alert(1)</link></item></channel></rss>",
    "Test",
  );
  expect(stories).toHaveLength(1);
  expect(stories[0]).toMatchObject({
    category: "Clean Energy",
    region: "Kenya",
    published: "2026-11-16T08:00:00.000Z",
    summary: "New capacity.",
  });
});
