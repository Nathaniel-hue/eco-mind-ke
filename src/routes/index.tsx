import { createFileRoute } from "@tanstack/react-router";
import { ChatInterface } from "@/components/ChatInterface";
import { Sparkles, ArrowRight, Leaf, Globe, WifiOff, LineChart } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EcoMind AI — Make Smarter Sustainable Decisions" },
      {
        name: "description",
        content:
          "Ask EcoMind AI about any choice and get a sustainability score, better alternatives, and trusted sources.",
      },
      { property: "og:title", content: "EcoMind AI — Make Smarter Sustainable Decisions" },
      {
        property: "og:description",
        content: "Ask EcoMind AI about any choice and get a sustainability score, better alternatives, and trusted sources.",
      },
    ],
  }),
  component: Home,
});

function scrollToChat() {
  document.getElementById("chat")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function Home() {
  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden px-4 pt-12 sm:px-6 sm:pt-20">
        <div className="mx-auto max-w-4xl text-center animate-fade-up">
          <div className="inline-flex items-center gap-2 rounded-full border bg-card/60 px-3 py-1 text-xs text-muted-foreground shadow-card">
            <Sparkles className="h-3 w-3 text-leaf" />
            AI-powered sustainability assistant
          </div>
          <h1 className="mt-6 font-display text-5xl leading-[1.05] sm:text-7xl">
            Make Smarter{" "}
            <span className="bg-gradient-to-br from-leaf to-leaf-glow bg-clip-text text-transparent">
              Sustainable
            </span>{" "}
            Decisions
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg">
            EcoMind AI helps you understand the environmental impact of your choices using
            artificial intelligence and trusted information.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button
              onClick={scrollToChat}
              className="group inline-flex items-center gap-2 rounded-xl leaf-gradient px-5 py-3 text-sm font-medium text-leaf-foreground shadow-glow transition hover:opacity-95"
            >
              Start Chatting
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </button>
            <a
              href="/about"
              className="inline-flex items-center gap-2 rounded-xl border bg-card/60 px-5 py-3 text-sm font-medium transition hover:bg-accent"
            >
              Learn More
            </a>
          </div>

          {/* feature strip */}
          <div className="mx-auto mt-14 grid max-w-3xl gap-3 sm:grid-cols-3">
            {[
              { icon: Leaf, label: "Sustainability scores" },
              { icon: WifiOff, label: "Offline knowledge base" },
              { icon: Globe, label: "Research mode + sources" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="glass flex items-center justify-center gap-2 rounded-xl p-3 text-sm"
              >
                <Icon className="h-4 w-4 text-leaf" />
                {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Chat */}
      <section id="chat" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <ChatInterface />
      </section>

      {/* Value strip */}
      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              icon: Leaf,
              title: "Score every choice",
              body: "Environmental, economic, and social impact — quantified 0–100 with clear reasoning.",
            },
            {
              icon: LineChart,
              title: "Track your habits",
              body: "A personal dashboard summarizes your questions and average sustainability score.",
            },
            {
              icon: Globe,
              title: "Trusted research",
              body: "Research mode cites reputable environmental sources so answers stay grounded.",
            },
          ].map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-2xl border bg-card p-6 shadow-card">
              <div className="mb-4 grid h-10 w-10 place-items-center rounded-xl leaf-gradient shadow-glow">
                <Icon className="h-5 w-5 text-leaf-foreground" />
              </div>
              <div className="text-base font-semibold">{title}</div>
              <p className="mt-1 text-sm text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
