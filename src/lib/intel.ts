// Browser-safe shared types and rules for the Intelligence Centre.
export type EvidenceRecord = {
  title: string;
  year: number | null;
  venue: string | null;
  authors: string[];
  doi: string | null;
  url: string;
  citations: number;
  retracted: boolean;
  abstract: string | null;
  origin: "OpenAlex" | "Crossref";
};

export const RATINGS = ["Supported", "Mixed", "Unsupported", "Not enough evidence"] as const;
export type Rating = (typeof RATINGS)[number];

/** AI ratings are only trusted when real records back them up. */
export function finalRating(aiRating: string, recordCount: number): Rating {
  const r = (RATINGS as readonly string[]).includes(aiRating) ? (aiRating as Rating) : "Not enough evidence";
  if (recordCount === 0) return "Not enough evidence";
  return r;
}

export type Weights = { environmental: number; economic: number; social: number };
export type OptionScores = { environmental: number; economic: number; social: number };

/** Weighted score = sum(score × weight) / sum(weights), rounded. Equal weights when all are zero. */
export function weightedScore(s: OptionScores, w: Weights): number {
  const total = w.environmental + w.economic + w.social;
  if (total <= 0) return Math.round((s.environmental + s.economic + s.social) / 3);
  return Math.round((s.environmental * w.environmental + s.economic * w.economic + s.social * w.social) / total);
}

export function parseDoi(input: string): string | null {
  const m = input.match(/10\.\d{4,9}\/[^\s"<>]+/i);
  return m ? m[0].replace(/[.,;)]+$/, "") : null;
}

export type InvestigationKind = "factcheck" | "evidence" | "tradeoffs";
