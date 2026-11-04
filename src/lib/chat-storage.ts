import type { SustainabilityAnswer } from "./offline-kb";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: number;
  data?: SustainabilityAnswer;
  source?: "offline" | "ai" | "research";
};

export type Thread = {
  id: string;
  title: string;
  updatedAt: number;
  messages: ChatMessage[];
};

const THREADS_KEY = "ecomind.threads";
const SETTINGS_KEY = "ecomind.settings";

export type Settings = {
  theme: "light" | "dark";
  /** Hue (0-359) of the user's accent colour on the oklch wheel. */
  accent: number;
  offlineOnly: boolean;
};

export const defaultSettings: Settings = {
  theme: "light",
  accent: 150,
  offlineOnly: false,
};

/** Old saved values used colour names; map them to hues. */
const LEGACY_HUES: Record<string, number> = {
  emerald: 150,
  ocean: 220,
  amber: 70,
  rose: 20,
};

export function normalizeAccent(v: unknown): number {
  const wrap = (n: number) => ((Math.round(n) % 360) + 360) % 360;
  if (typeof v === "number" && Number.isFinite(v)) return wrap(v);
  if (typeof v === "string") {
    const n = Number(v);
    if (Number.isFinite(n) && v.trim() !== "") return wrap(n);
    if (LEGACY_HUES[v] !== undefined) return LEGACY_HUES[v];
  }
  return defaultSettings.accent;
}

export function loadThreads(): Thread[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(THREADS_KEY);
    return raw ? (JSON.parse(raw) as Thread[]) : [];
  } catch {
    return [];
  }
}

export function saveThreads(threads: Thread[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(THREADS_KEY, JSON.stringify(threads));
  void import("./cloud-sync").then((m) => m.pushToCloud());
}

export function loadSettings(): Settings {
  if (typeof window === "undefined") return defaultSettings;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return defaultSettings;
    const parsed = JSON.parse(raw) as Partial<Settings>;
    return { ...defaultSettings, ...parsed, accent: normalizeAccent(parsed.accent) };
  } catch {
    return defaultSettings;
  }
}

export function saveSettings(s: Settings) {
  if (typeof window === "undefined") return;
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
  void import("./cloud-sync").then((m) => m.pushToCloud());
}

export function newId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
