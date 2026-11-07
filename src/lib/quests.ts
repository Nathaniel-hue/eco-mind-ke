export type Quest = { id: string; title: string; detail: string; impact: string };

export const QUEST_POOL: Quest[] = [
  { id: "veg-lunch", title: "Eat a plant-based lunch", detail: "Swap meat for beans, lentils or tofu today.", impact: "Saves roughly 1–2 kg CO₂ per meal." },
  { id: "phantom", title: "Hunt phantom power", detail: "Unplug 3 chargers or devices you're not using.", impact: "Standby power can be ~5–10% of home electricity." },
  { id: "cold-wash", title: "Wash laundry cold", detail: "Run your next wash at 30°C or cold.", impact: "Heating water is most of a wash's energy." },
  { id: "byo", title: "Bring your own container", detail: "Use a reusable bottle, cup or bag today.", impact: "One less single-use item heading to landfill." },
  { id: "litter", title: "5-minute litter pickup", detail: "Pick up litter around your street or office.", impact: "Keeps plastic out of drains and waterways." },
  { id: "short-shower", title: "Take a 5-minute shower", detail: "Set a timer — beat it if you can.", impact: "Saves up to ~40 litres of water." },
  { id: "walk", title: "Walk or cycle one trip", detail: "Replace one short car trip with feet or wheels.", impact: "About 0.2 kg CO₂ saved per km not driven." },
  { id: "leftovers", title: "Rescue your leftovers", detail: "Cook a meal from what's already in the fridge.", impact: "Food waste causes ~8–10% of global emissions." },
  { id: "lights", title: "Lights-off patrol", detail: "Switch off lights in every empty room.", impact: "Small, but adds up over a year." },
  { id: "compost", title: "Start a scrap jar", detail: "Collect fruit and veg scraps for compost.", impact: "Keeps methane-producing waste out of landfill." },
  { id: "repair", title: "Fix instead of replace", detail: "Mend one thing: a button, a sock, a loose screw.", impact: "Extends product life and skips new manufacturing." },
  { id: "local", title: "Buy something local", detail: "Choose a locally grown or made item.", impact: "Supports nearby producers and shorter supply chains." },
  { id: "share", title: "Share an eco fact", detail: "Tell a friend one thing you learned on EcoMind.", impact: "Habits spread through people you know." },
  { id: "tap", title: "Tap off while brushing", detail: "Turn the tap off while you brush your teeth.", impact: "Saves around 6 litres a minute." },
];

export function todayKey(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** Deterministic pick of 5 quests for a given day. */
export function questsForDay(key: string): Quest[] {
  let seed = 0;
  for (const c of key) seed = (seed * 31 + c.charCodeAt(0)) >>> 0;
  const pool = [...QUEST_POOL];
  const out: Quest[] = [];
  while (out.length < 5) {
    seed = (seed * 1103515245 + 12345) >>> 0;
    out.push(pool.splice(seed % pool.length, 1)[0]);
  }
  return out;
}

const KEY = "ecomind.quests";
export type QuestState = { day: string; done: string[]; streak: number; lastFullDay: string | null; blooms: number };

function yesterday(key: string) {
  const [y, m, d] = key.split("-").map(Number);
  return todayKey(new Date(y, m - 1, d - 1));
}

export function loadQuestState(): QuestState {
  const day = todayKey();
  let s: QuestState = { day, done: [], streak: 0, lastFullDay: null, blooms: 0 };
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) s = { ...s, ...JSON.parse(raw) };
  } catch {}
  if (s.day !== day) {
    s = { ...s, day, done: [] };
    if (s.lastFullDay !== yesterday(day)) s.streak = 0;
  }
  return s;
}

export function toggleQuest(s: QuestState, id: string): QuestState {
  const done = s.done.includes(id) ? s.done.filter((x) => x !== id) : [...s.done, id];
  let next = { ...s, done };
  if (done.length === 5 && s.lastFullDay !== s.day) {
    next = { ...next, lastFullDay: s.day, streak: s.streak + 1, blooms: s.blooms + 1 };
  }
  localStorage.setItem(KEY, JSON.stringify(next));
  window.dispatchEvent(new Event("ecomind:quests"));
  return next;
}
