import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import { loadSettings, loadThreads, type Thread } from "./chat-storage";
import { loadQuestState, mergeQuestStates, QUEST_KEY, saveQuestState } from "./quests";

let currentUserId: string | null = null;
let ready = false;
let generation = 0;
let timer: ReturnType<typeof setTimeout> | undefined;

export function pushToCloud() {
  if (!currentUserId || !ready) return;
  clearTimeout(timer);
  timer = setTimeout(() => void flushToCloud(), 600);
}

export async function flushToCloud() {
  clearTimeout(timer);
  if (!currentUserId || !ready) return;
  const uid = currentUserId;
  const { error } = await supabase.from("user_data").upsert({
    user_id: uid,
    threads: loadThreads() as unknown as Json,
    settings: loadSettings() as unknown as Json,
    quests: loadQuestState() as unknown as Json,
    updated_at: new Date().toISOString(),
  });
  if (error) window.dispatchEvent(new Event("ecomind:sync-error"));
  else window.dispatchEvent(new Event("ecomind:saved"));
}

export async function syncFromCloud(userId: string) {
  clearTimeout(timer);
  const token = ++generation;
  currentUserId = userId;
  ready = false;
  const owner = localStorage.getItem("ecomind.quest-owner");
  if (owner && owner !== userId) {
    localStorage.setItem(`${QUEST_KEY}.${owner}`, localStorage.getItem(QUEST_KEY) ?? "{}");
    localStorage.setItem(QUEST_KEY, localStorage.getItem(`${QUEST_KEY}.${userId}`) ?? "{}");
  }
  localStorage.setItem("ecomind.quest-owner", userId);
  window.dispatchEvent(new Event("ecomind:quests"));
  const { data, error } = await supabase
    .from("user_data")
    .select("threads, settings, quests")
    .eq("user_id", userId)
    .maybeSingle();
  if (token !== generation || currentUserId !== userId) return;
  if (error) {
    window.dispatchEvent(new Event("ecomind:sync-error"));
    return;
  }
  const cloudThreads = (Array.isArray(data?.threads) ? data.threads : []) as unknown as Thread[];
  const byId = new Map<string, Thread>();
  for (const t of [...cloudThreads, ...loadThreads()]) {
    const prev = byId.get(t.id);
    if (!prev || t.updatedAt > prev.updatedAt) byId.set(t.id, t);
  }
  localStorage.setItem(
    "ecomind.threads",
    JSON.stringify([...byId.values()].sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 100)),
  );
  const cloudSettings = data?.settings && typeof data.settings === "object" ? data.settings : null;
  if (cloudSettings && Object.keys(cloudSettings).length)
    localStorage.setItem(
      "ecomind.settings",
      JSON.stringify({ ...loadSettings(), ...cloudSettings }),
    );
  saveQuestState(mergeQuestStates(loadQuestState(), data?.quests));
  ready = true;
  pushToCloud();
  window.dispatchEvent(new Event("ecomind:sync"));
}
export function stopSync() {
  clearTimeout(timer);
  ++generation;
  currentUserId = null;
  ready = false;
}
