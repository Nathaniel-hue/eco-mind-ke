import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import { loadSettings, loadThreads, type Thread } from "./chat-storage";

const THREADS_KEY = "ecomind.threads";
const SETTINGS_KEY = "ecomind.settings";

let currentUserId: string | null = null;
let ready = false;
let timer: ReturnType<typeof setTimeout> | undefined;

export function pushToCloud() {
  if (!currentUserId || !ready) return;
  clearTimeout(timer);
  const uid = currentUserId;
  timer = setTimeout(async () => {
    await supabase.from("user_data").upsert({
      user_id: uid,
      threads: loadThreads() as unknown as Json,
      settings: loadSettings() as unknown as Json,
      updated_at: new Date().toISOString(),
    });
  }, 600);
}

/** Merge cloud copy with this browser's copy, then save both. */
export async function syncFromCloud(userId: string) {
  currentUserId = userId;
  ready = false;
  const { data } = await supabase
    .from("user_data")
    .select("threads, settings")
    .eq("user_id", userId)
    .maybeSingle();

  const cloudThreads = (Array.isArray(data?.threads) ? data.threads : []) as unknown as Thread[];
  const byId = new Map<string, Thread>();
  for (const t of [...cloudThreads, ...loadThreads()]) {
    const prev = byId.get(t.id);
    if (!prev || t.updatedAt > prev.updatedAt) byId.set(t.id, t);
  }
  const merged = [...byId.values()].sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 100);
  localStorage.setItem(THREADS_KEY, JSON.stringify(merged));

  const cloudSettings = data?.settings && typeof data.settings === "object" ? data.settings : null;
  if (cloudSettings && Object.keys(cloudSettings).length) {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify({ ...loadSettings(), ...cloudSettings }));
  }
  ready = true;
  pushToCloud();
  window.dispatchEvent(new Event("ecomind:sync"));
}

export function stopSync() {
  currentUserId = null;
  ready = false;
}
