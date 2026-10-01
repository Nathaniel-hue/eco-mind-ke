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
  accent: string;
  offlineOnly: boolean;
};

export const defaultSettings: Settings = {
  theme: "light",
  accent: "emerald",
  offlineOnly: false,
};

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
    return raw ? { ...defaultSettings, ...JSON.parse(raw) } : defaultSettings;
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
