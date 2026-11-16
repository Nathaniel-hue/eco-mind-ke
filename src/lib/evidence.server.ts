import type { EvidenceRecord } from "./intel";

const UA = "EcoMind/1.0 (mailto:hello@eco-mind-ke.lovable.app)";

async function getJson(url: string): Promise<any | null> {
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 10000);
    const res = await fetch(url, { headers: { "User-Agent": UA, Accept: "application/json" }, signal: ctrl.signal });
    clearTimeout(t);
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    console.error("evidence fetch failed", url, e);
    return null;
  }
}

function abstractFrom(inv: Record<string, number[]> | null | undefined): string | null {
  if (!inv) return null;
  const words: string[] = [];
  for (const [w, pos] of Object.entries(inv)) for (const p of pos) words[p] = w;
  const text = words.filter(Boolean).join(" ");
  return text ? text.slice(0, 1500) : null;
}

function fromOpenAlex(w: any): EvidenceRecord {
  const doi = w.doi ? String(w.doi).replace("https://doi.org/", "") : null;
  return {
    title: w.display_name ?? "Untitled",
    year: w.publication_year ?? null,
    venue: w.primary_location?.source?.display_name ?? null,
    authors: (w.authorships ?? []).slice(0, 4).map((a: any) => a.author?.display_name).filter(Boolean),
    doi,
    url: doi ? `https://doi.org/${doi}` : (w.id ?? "https://openalex.org"),
    citations: w.cited_by_count ?? 0,
    retracted: Boolean(w.is_retracted),
    abstract: abstractFrom(w.abstract_inverted_index),
    origin: "OpenAlex",
  };
}

export async function searchWorks(query: string, n = 6): Promise<EvidenceRecord[]> {
  const q = encodeURIComponent(query.slice(0, 300));
  const data = await getJson(`https://api.openalex.org/works?search=${q}&per_page=${n}&sort=relevance_score:desc`);
  return (data?.results ?? []).map(fromOpenAlex);
}

export async function workByDoi(doi: string): Promise<EvidenceRecord | null> {
  const oa = await getJson(`https://api.openalex.org/works/doi:${encodeURIComponent(doi)}`);
  if (oa?.id) return fromOpenAlex(oa);
  const cr = await getJson(`https://api.crossref.org/works/${encodeURIComponent(doi)}`);
  const m = cr?.message;
  if (!m) return null;
  return {
    title: m.title?.[0] ?? "Untitled",
    year: m.issued?.["date-parts"]?.[0]?.[0] ?? null,
    venue: m["container-title"]?.[0] ?? null,
    authors: (m.author ?? []).slice(0, 4).map((a: any) => [a.given, a.family].filter(Boolean).join(" ")),
    doi,
    url: `https://doi.org/${doi}`,
    citations: m["is-referenced-by-count"] ?? 0,
    retracted: (m["update-to"] ?? []).some((u: any) => u.type === "retraction"),
    abstract: m.abstract ? String(m.abstract).replace(/<[^>]+>/g, "").slice(0, 1500) : null,
    origin: "Crossref",
  };
}
