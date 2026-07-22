import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useServerFn } from "@tanstack/react-start";
import { askSustainability } from "@/lib/ai.functions";
import { findOffline, type SustainabilityAnswer } from "@/lib/offline-kb";
import {
  loadSettings,
  loadThreads,
  newId,
  saveThreads,
  type ChatMessage,
  type Thread,
} from "@/lib/chat-storage";
import { ScoreCard } from "./ScoreCard";
import {
  Send,
  Sparkles,
  WifiOff,
  Wifi,
  Globe,
  Plus,
  MessageSquare,
  Trash2,
  Lightbulb,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

const SUGGESTIONS = [
  "Can I recycle pizza boxes?",
  "Should I buy an electric car?",
  "How can I reduce food waste?",
  "Is flying environmentally friendly?",
  "Should I buy bottled water every day?",
  "Is walking better than driving?",
];

function BadgePill({
  children,
  tone,
  icon: Icon,
}: {
  children: React.ReactNode;
  tone: "offline" | "ai" | "research";
  icon: React.ComponentType<{ className?: string }>;
}) {
  const styles = {
    offline: "bg-accent text-accent-foreground",
    ai: "leaf-gradient text-leaf-foreground",
    research: "bg-sky/20 text-foreground",
  }[tone];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider ${styles}`}>
      <Icon className="h-3 w-3" />
      {children}
    </span>
  );
}

export function ChatInterface() {
  const askAI = useServerFn(askSustainability);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [research, setResearch] = useState(false);
  const [settings, setSettings] = useState(loadSettings());
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = loadThreads();
    setThreads(t);
    if (t.length > 0) setActiveId(t[0].id);
    setSettings(loadSettings());
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
  }, [activeId, loading]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  });

  const active = threads.find((t) => t.id === activeId) ?? null;

  function persist(next: Thread[]) {
    setThreads(next);
    saveThreads(next);
  }

  function startNew(prefill?: string) {
    setActiveId(null);
    setInput(prefill ?? "");
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  async function send(text: string) {
    const question = text.trim();
    if (!question || loading) return;
    setInput("");
    setLoading(true);

    const userMsg: ChatMessage = {
      id: newId(),
      role: "user",
      content: question,
      createdAt: Date.now(),
    };

    let thread = active;
    if (!thread) {
      thread = {
        id: newId(),
        title: question.slice(0, 60),
        updatedAt: Date.now(),
        messages: [],
      };
    }
    thread = { ...thread, messages: [...thread.messages, userMsg], updatedAt: Date.now() };
    const others = threads.filter((t) => t.id !== thread!.id);
    persist([thread, ...others]);
    setActiveId(thread.id);

    try {
      const offline = findOffline(question);
      let data: SustainabilityAnswer;
      let source: "offline" | "ai" | "research" = "offline";
      if (offline) {
        data = offline.data;
        source = "offline";
      } else if (settings.offlineOnly) {
        data = {
          answer:
            "This question isn't in the offline knowledge base. Turn off Offline-only mode in Settings to ask EcoMind AI.",
          scores: { overall: 0, environmental: 0, economic: 0, social: 0 },
          alternatives: [],
          tips: [],
        };
        source = "offline";
      } else {
        data = await askAI({ data: { question, research } });
        source = research ? "research" : "ai";
      }

      const assistantMsg: ChatMessage = {
        id: newId(),
        role: "assistant",
        content: data.answer,
        createdAt: Date.now(),
        data,
        source,
      };
      const finalThread = {
        ...thread,
        messages: [...thread.messages, assistantMsg],
        updatedAt: Date.now(),
      };
      persist([finalThread, ...others]);
    } catch (err) {
      const assistantMsg: ChatMessage = {
        id: newId(),
        role: "assistant",
        content:
          err instanceof Error
            ? `Sorry — I couldn't reach EcoMind AI. ${err.message}`
            : "Something went wrong.",
        createdAt: Date.now(),
        source: "ai",
      };
      const finalThread = {
        ...thread,
        messages: [...thread.messages, assistantMsg],
        updatedAt: Date.now(),
      };
      persist([finalThread, ...others]);
    } finally {
      setLoading(false);
    }
  }

  function deleteThread(id: string) {
    const next = threads.filter((t) => t.id !== id);
    persist(next);
    if (activeId === id) setActiveId(next[0]?.id ?? null);
  }

  const isEmpty = !active || active.messages.length === 0;

  return (
    <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
      {/* Sidebar */}
      <aside className="hidden lg:block">
        <div className="sticky top-24 space-y-3">
          <button
            onClick={() => startNew()}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl leaf-gradient px-3 py-2.5 text-sm font-medium text-leaf-foreground shadow-glow transition hover:opacity-95"
          >
            <Plus className="h-4 w-4" /> New chat
          </button>
          <div className="rounded-xl border bg-card/50 p-2">
            <div className="mb-1 px-2 text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
              History
            </div>
            {threads.length === 0 && (
              <div className="px-2 py-6 text-center text-xs text-muted-foreground">
                No conversations yet
              </div>
            )}
            <div className="max-h-[60vh] space-y-0.5 overflow-y-auto">
              {threads.map((t) => (
                <div key={t.id} className="group flex items-center gap-1">
                  <button
                    onClick={() => setActiveId(t.id)}
                    className={`flex flex-1 items-center gap-2 rounded-lg px-2 py-2 text-left text-xs transition ${
                      activeId === t.id
                        ? "bg-accent text-accent-foreground"
                        : "hover:bg-accent/60"
                    }`}
                  >
                    <MessageSquare className="h-3 w-3 shrink-0 opacity-60" />
                    <span className="truncate">{t.title}</span>
                  </button>
                  <button
                    onClick={() => deleteThread(t.id)}
                    className="rounded p-1 opacity-0 transition hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
                    aria-label="Delete"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-h-[70vh] flex-col rounded-2xl border bg-card/40 shadow-card">
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6 sm:px-8">
          {isEmpty ? (
            <div className="mx-auto max-w-2xl py-8 text-center animate-fade-up">
              <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl leaf-gradient shadow-glow">
                <Sparkles className="h-7 w-7 text-leaf-foreground" />
              </div>
              <h2 className="font-display text-3xl">Ask about any choice.</h2>
              <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                EcoMind analyzes decisions across environmental, economic, and social impact — with alternatives and citations.
              </p>
              <div className="mt-8 grid gap-2 sm:grid-cols-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="group flex items-center justify-between gap-3 rounded-xl border bg-card p-4 text-left text-sm transition hover:border-leaf/60 hover:shadow-glow"
                  >
                    <span className="flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-leaf" />
                      {s}
                    </span>
                    <ArrowRight className="h-4 w-4 -translate-x-1 opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="mx-auto max-w-3xl space-y-6">
              {active!.messages.map((m) => (
                <MessageBubble key={m.id} message={m} />
              ))}
              {loading && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="flex gap-1">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-leaf" />
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-leaf [animation-delay:150ms]" />
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-leaf [animation-delay:300ms]" />
                  </div>
                  Analyzing sustainability…
                </div>
              )}
            </div>
          )}
        </div>

        {/* Composer */}
        <div className="border-t bg-card/60 p-3 sm:p-4">
          <div className="mx-auto max-w-3xl">
            <div className="mb-2 flex items-center gap-2">
              <button
                onClick={() => {
                  const next = { ...settings, offlineOnly: !settings.offlineOnly };
                  setSettings(next);
                  localStorage.setItem("ecomind.settings", JSON.stringify(next));
                }}
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] transition ${
                  settings.offlineOnly ? "border-leaf/60 bg-leaf/10 text-leaf" : "text-muted-foreground hover:bg-accent"
                }`}
              >
                {settings.offlineOnly ? <WifiOff className="h-3 w-3" /> : <Wifi className="h-3 w-3" />}
                {settings.offlineOnly ? "Offline mode" : "Online"}
              </button>
              <button
                onClick={() => setResearch((r) => !r)}
                disabled={settings.offlineOnly}
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] transition disabled:opacity-40 ${
                  research ? "border-leaf/60 bg-leaf/10 text-leaf" : "text-muted-foreground hover:bg-accent"
                }`}
              >
                <Globe className="h-3 w-3" />
                Research mode
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="relative flex items-end gap-2 rounded-2xl border bg-background p-2 shadow-card focus-within:border-leaf/60"
            >
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send(input);
                  }
                }}
                placeholder="Ask about a habit, purchase, or decision…"
                rows={1}
                className="max-h-40 min-h-[42px] flex-1 resize-none bg-transparent px-3 py-2.5 text-sm outline-none placeholder:text-muted-foreground"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="grid h-10 w-10 place-items-center rounded-xl leaf-gradient text-leaf-foreground shadow-glow transition disabled:opacity-40"
                aria-label="Send"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end animate-fade-up">
        <div className="max-w-[80%] rounded-2xl rounded-br-md bg-primary px-4 py-2.5 text-sm text-primary-foreground shadow-card">
          {message.content}
        </div>
      </div>
    );
  }
  return (
    <div className="animate-fade-up space-y-4">
      <div className="flex items-center gap-2">
        <div className="grid h-7 w-7 place-items-center rounded-lg leaf-gradient">
          <Sparkles className="h-3.5 w-3.5 text-leaf-foreground" />
        </div>
        <span className="text-xs font-medium">EcoMind AI</span>
        {message.source === "offline" && (
          <BadgePill tone="offline" icon={WifiOff}>Answered offline</BadgePill>
        )}
        {message.source === "ai" && <BadgePill tone="ai" icon={Sparkles}>AI response</BadgePill>}
        {message.source === "research" && (
          <BadgePill tone="research" icon={Globe}>Research mode</BadgePill>
        )}
      </div>
      <div className="prose prose-sm max-w-none dark:prose-invert prose-p:my-2 prose-headings:font-display">
        <ReactMarkdown>{message.content}</ReactMarkdown>
      </div>
      {message.data && (
        <div className="grid gap-4 md:grid-cols-2">
          <ScoreCard scores={message.data.scores} />
          <div className="rounded-2xl border bg-card p-5 shadow-card">
            <div className="mb-3 text-xs uppercase tracking-wider text-muted-foreground">
              Better alternatives
            </div>
            {message.data.alternatives.length === 0 && (
              <div className="text-sm text-muted-foreground">No alternatives needed.</div>
            )}
            <ul className="space-y-3">
              {message.data.alternatives.map((a) => (
                <li key={a.title} className="flex gap-3">
                  <div className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-leaf/10 text-leaf">
                    <ArrowRight className="h-3 w-3" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">{a.title}</div>
                    <div className="text-xs text-muted-foreground">{a.why}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      {message.data?.tips && message.data.tips.length > 0 && (
        <div className="rounded-2xl border bg-card p-5 shadow-card">
          <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
            <Lightbulb className="h-3.5 w-3.5" /> Practical tips
          </div>
          <ul className="grid gap-2 sm:grid-cols-2">
            {message.data.tips.map((t, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-leaf" />
                {t}
              </li>
            ))}
          </ul>
        </div>
      )}
      {message.data?.sources && message.data.sources.length > 0 && (
        <div className="rounded-2xl border bg-card p-5 shadow-card">
          <div className="mb-3 text-xs uppercase tracking-wider text-muted-foreground">
            Sources
          </div>
          <ul className="space-y-2">
            {message.data.sources.map((s) => (
              <li key={s.url}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-leaf hover:underline"
                >
                  {s.title}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
