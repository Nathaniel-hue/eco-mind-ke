import { useCallback, useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { askSustainability } from "@/lib/ai.functions";
import { findOffline, type SustainabilityAnswer } from "@/lib/offline-kb";
import {
  loadSettings,
  loadThreads,
  newId,
  saveThreads,
  type Thread,
} from "@/lib/chat-storage";

export type AskResult = {
  question: string;
  data: SustainabilityAnswer;
  source: "offline" | "ai" | "research";
};

export function useAsk() {
  const ask = useServerFn(askSustainability);
  const [result, setResult] = useState<AskResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [research, setResearch] = useState(false);
  const [offlineOnly, setOfflineOnly] = useState(false);
  const [history, setHistory] = useState<Thread[]>([]);

  useEffect(() => {
    setOfflineOnly(loadSettings().offlineOnly);
    setHistory(loadThreads());
    const onSync = () => {
      setOfflineOnly(loadSettings().offlineOnly);
      setHistory(loadThreads());
    };
    window.addEventListener("ecomind:sync", onSync);
    return () => window.removeEventListener("ecomind:sync", onSync);
  }, []);

  const persist = useCallback((r: AskResult) => {
    const threads = loadThreads();
    const thread: Thread = {
      id: newId(),
      title: r.question,
      updatedAt: Date.now(),
      messages: [
        { id: newId(), role: "user", content: r.question, createdAt: Date.now() },
        {
          id: newId(),
          role: "assistant",
          content: r.data.answer,
          createdAt: Date.now(),
          data: r.data,
          source: r.source,
        },
      ],
    };
    const next = [thread, ...threads].slice(0, 100);
    saveThreads(next);
    setHistory(next);
  }, []);

  const submit = useCallback(
    async (question: string) => {
      const q = question.trim();
      if (!q || loading) return;
      setError(null);
      setLoading(true);
      try {
        const offline = findOffline(q);
        if (offline && (offlineOnly || !research)) {
          const r: AskResult = { question: q, data: offline.data, source: "offline" };
          setResult(r);
          persist(r);
          return;
        }
        if (offlineOnly) {
          setError(
            "No offline match found. Turn off Offline Mode in Settings to look this up online.",
          );
          return;
        }
        const data = (await ask({ data: { question: q, research } })) as SustainabilityAnswer;
        const r: AskResult = { question: q, data, source: research ? "research" : "ai" };
        setResult(r);
        persist(r);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [ask, loading, offlineOnly, persist, research],
  );

  return { result, loading, error, research, setResearch, offlineOnly, submit, history };
}
