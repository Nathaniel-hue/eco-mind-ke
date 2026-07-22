import { createServerFn } from "@tanstack/react-start";
import { generateText, Output, NoObjectGeneratedError } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";

const InputSchema = z.object({
  question: z.string().min(1),
  research: z.boolean().optional(),
});

const AnswerSchema = z.object({
  answer: z.string(),
  scores: z.object({
    overall: z.number(),
    environmental: z.number(),
    economic: z.number(),
    social: z.number(),
  }),
  alternatives: z.array(z.object({ title: z.string(), why: z.string() })),
  tips: z.array(z.string()),
  sources: z.array(z.object({ title: z.string(), url: z.string() })).optional(),
  category: z.string().optional(),
});

export const askSustainability = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => InputSchema.parse(data))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const gateway = createLovableAiGatewayProvider(key);
    const model = gateway("google/gemini-3.6-flash");

    const systemPrompt = `You are EcoMind, a sustainability researcher. Write like a thoughtful human — plain language, first person occasionally, no corporate hedging, no "As an AI" phrasing, no emoji.

Synthesize what you know from three kinds of sources and be explicit about it:
1. Wikipedia articles on the relevant topics
2. Top Google search results from reputable outlets (news, journals, government agencies, NGOs)
3. ChatGPT-style general reasoning to weigh the tradeoffs

In "answer", give a 2-4 paragraph explanation in warm, human prose (markdown fine). Mention offhand which of the three lenses shaped the take (e.g. "Wikipedia's article on X notes…", "a quick Google turns up…", "reasoning it through…").

Score each dimension 0-100 (100 = highly sustainable):
- environmental: ecological footprint, emissions, resource use
- economic: cost-effectiveness and long-term financial impact
- social: community, health, equity effects
- overall: weighted judgment

Provide 2-4 "alternatives" with a "why" each. Provide 3-5 short practical "tips". Include a short "category" like Transport, Food, Energy, Recycling, Consumption, Water, Composting.

ALWAYS include 3-5 "sources" mixing:
- at least one Wikipedia link (https://en.wikipedia.org/wiki/...)
- at least one link that would plausibly rank on Google from a reputable domain (epa.gov, iea.org, un.org, nature.com, ourworldindata.org, nytimes.com, bbc.com, theguardian.com, etc.)
- optionally a note-style source titled "ChatGPT synthesis" with url "https://chat.openai.com/"
Use real, plausible URLs — never fabricate obscure links.`;

    try {
      const result = await generateText({
        model,
        system: systemPrompt,
        prompt: data.question,
        output: Output.object({ schema: AnswerSchema }),
      });
      return result.output;
    } catch (error) {
      if (NoObjectGeneratedError.isInstance(error)) {
        try {
          const parsed = JSON.parse(error.text ?? "{}");
          return AnswerSchema.parse(parsed);
        } catch {
          throw new Error("The AI response could not be parsed. Please try again.");
        }
      }
      throw error;
    }
  });
