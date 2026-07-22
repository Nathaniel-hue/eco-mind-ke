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

    const systemPrompt = `You are EcoMind AI, a sustainability expert. For each user question, analyze whether the choice is environmentally sustainable.

Return a natural, conversational explanation in "answer" (2-4 short paragraphs, use markdown for emphasis).
Score each dimension from 0-100 where 100 = highly sustainable:
- environmental: ecological footprint, emissions, resource use
- economic: cost-effectiveness and long-term financial impact
- social: community, health, equity effects
- overall: weighted judgment
Provide 2-4 concrete "alternatives" with a "why" each.
Provide 3-5 short practical "tips".
Include a short "category" like Transport, Food, Energy, Recycling, Consumption, Water, Composting.
${data.research ? 'Base your answer on well-established environmental science from government, university, and NGO sources. Include 2-4 relevant "sources" with real reputable URLs (e.g. epa.gov, un.org, iea.org, nature.com).' : ""}`;

    try {
      const { experimental_output } = await generateText({
        model,
        system: systemPrompt,
        prompt: data.question,
        experimental_output: Output.object({ schema: AnswerSchema }),
      });
      return experimental_output;
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
