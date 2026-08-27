import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { HeroSection } from "@/components/HeroSection";
import { AskBar } from "@/components/AskBar";
import { AnswerCard } from "@/components/AnswerCard";
import { PopularQuestions } from "@/components/PopularQuestions";
import { TipsSection } from "@/components/TipsSection";
import { HowItWorks } from "@/components/HowItWorks";
import { ModesSection } from "@/components/ModesSection";
import { useAsk } from "@/lib/use-ask";
import { Loader2, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EcoMind — Smarter, More Sustainable Everyday Decisions" },
      {
        name: "description",
        content:
          "Ask about any everyday choice and get a sustainability score, plain-language reasoning, practical alternatives and the sources behind it.",
      },
      { property: "og:title", content: "EcoMind — Smarter, More Sustainable Everyday Decisions" },
      {
        property: "og:description",
        content:
          "Sustainability scores, practical alternatives and trusted sources for the choices you make every day.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  const { result, loading, error, research, setResearch, offlineOnly, submit } = useAsk();
  const [value, setValue] = useState("");
  const answerRef = useRef<HTMLDivElement>(null);

  async function handleAsk(q: string) {
    setValue(q);
    await submit(q);
    answerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <main>
      <HeroSection />

      <div className="mx-auto max-w-6xl space-y-24 px-5 py-16 sm:px-6 sm:py-24">
        <section>
          <AskBar
            onSubmit={handleAsk}
            loading={loading}
            research={research}
            setResearch={setResearch}
            offlineOnly={offlineOnly}
            value={value}
            setValue={setValue}
          />
        </section>

        <div ref={answerRef} className="scroll-mt-24">
          {loading ? (
            <div className="flex items-center justify-center gap-2 rounded-3xl border bg-card p-10 text-sm text-muted-foreground shadow-card">
              <Loader2 className="h-4 w-4 animate-spin" />
              Looking into that…
            </div>
          ) : error ? (
            <div className="flex items-start gap-2 rounded-3xl border bg-card p-6 text-sm text-muted-foreground shadow-card">
              <AlertCircle className="mt-0.5 h-4 w-4 text-clay" />
              {error}
            </div>
          ) : result ? (
            <AnswerCard result={result} />
          ) : null}
        </div>

        <PopularQuestions onPick={handleAsk} />
        <TipsSection />
        <HowItWorks />
        <ModesSection />
      </div>
    </main>
  );
}
