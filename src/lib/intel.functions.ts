import { createServerFn } from "@tanstack/react-start";
import { generateText, Output } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";
import { searchWorks, workByDoi } from "./evidence.server";
import { finalRating, parseDoi, type EvidenceRecord } from "./intel";

function model() {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("Missing LOVABLE_API_KEY");
  return createLovableAiGatewayProvider(key)("openai/gpt-6-astra");
}

const HONESTY =
  "You are EcoMind's research assistant. Plain, careful language, no emoji. Only treat the numbered RECORDS as evidence; never invent studies, numbers or URLs. If records are weak or off-topic, say so.";

function recordsText(rs: EvidenceRecord[]) {
  return rs
    .map((r, i) => `[${i + 1}] ${r.title} (${r.year ?? "n.d."}, ${r.venue ?? "unknown venue"}; ${r.citations} citations${r.retracted ? "; RETRACTED" : ""})\n${r.abstract ?? "No abstract available."}`)
    .join("\n\n");
}

const FactSchema = z.object({
  claim: z.string(),
  searchQuery: z.string(),
});
const FactVerdict = z.object({
  rating: z.string(),
  summary: z.string(),
  reasoning: z.string(),
  supportingRecords: z.array(z.number()),
  contradictingRecords: z.array(z.number()),
  caveats: z.array(z.string()),
});

export const factCheck = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ text: z.string().min(5).max(8000) }).parse(d))
  .handler(async ({ data }) => {
    const m = model();
    const { output: plan } = await generateText({
      model: m,
      system: "Extract the single main environmental claim from the text and a concise English academic search query (max 8 words) to find studies on it.",
      prompt: data.text,
      output: Output.object({ schema: FactSchema }),
    });
    const records = await searchWorks(plan.searchQuery, 6);
    const { output: v } = await generateText({
      model: m,
      system: `${HONESTY}\nRate the claim as exactly one of: Supported, Mixed, Unsupported, Not enough evidence. Reference records by number.`,
      prompt: `CLAIM: ${plan.claim}\n\nRECORDS:\n${recordsText(records) || "(none found)"}`,
      output: Output.object({ schema: FactVerdict }),
    });
    const valid = (ns: number[]) => ns.filter((n) => n >= 1 && n <= records.length);
    return {
      claim: plan.claim,
      query: plan.searchQuery,
      rating: finalRating(v.rating, records.length),
      summary: v.summary,
      reasoning: v.reasoning,
      supporting: valid(v.supportingRecords),
      contradicting: valid(v.contradictingRecords),
      caveats: v.caveats,
      records,
    };
  });

const EvidenceReview = z.object({
  methodology: z.string(),
  limitations: z.array(z.string()),
  conflictsOfInterest: z.string(),
  strength: z.string(),
  plainSummary: z.string(),
});

export const assessEvidence = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ query: z.string().min(3).max(500) }).parse(d))
  .handler(async ({ data }) => {
    const doi = parseDoi(data.query);
    const main = doi ? await workByDoi(doi) : (await searchWorks(data.query, 1))[0] ?? null;
    if (!main) return { found: false as const };
    const related = (await searchWorks(main.title, 5)).filter((r) => r.title !== main.title).slice(0, 4);
    const { output } = await generateText({
      model: model(),
      system: `${HONESTY}\nAssess research quality from the metadata and abstract of record [1] only. "strength" must be one of: Strong, Moderate, Limited, Unclear. If the abstract is missing, say the methods cannot be judged. For conflicts of interest, say what is unknown rather than guessing.`,
      prompt: `RECORDS:\n${recordsText([main])}`,
      output: Output.object({ schema: EvidenceReview }),
    });
    return { found: true as const, record: main, related, review: output };
  });

const TradeSchema = z.object({
  summary: z.string(),
  options: z.array(
    z.object({
      name: z.string(),
      environmental: z.number(),
      economic: z.number(),
      social: z.number(),
      gains: z.array(z.string()),
      costs: z.array(z.string()),
    }),
  ),
  uncertainties: z.array(z.string()),
});

export const analyzeTradeoffs = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z.object({ decision: z.string().min(3).max(1000), options: z.array(z.string().min(1).max(200)).min(2).max(4) }).parse(d),
  )
  .handler(async ({ data }) => {
    const { output } = await generateText({
      model: model(),
      system:
        "You are EcoMind. Compare the options for the decision. Score each 0-100 on environmental, economic and social sustainability (100 = best). Give 2-3 gains and 2-3 costs each, and list key uncertainties. These are reasoned estimates, not measurements; say so where relevant. Return options in the given order with the given names.",
      prompt: `DECISION: ${data.decision}\nOPTIONS:\n${data.options.map((o, i) => `${i + 1}. ${o}`).join("\n")}`,
      output: Output.object({ schema: TradeSchema }),
    });
    const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));
    return {
      ...output,
      options: output.options.map((o) => ({ ...o, environmental: clamp(o.environmental), economic: clamp(o.economic), social: clamp(o.social) })),
    };
  });
