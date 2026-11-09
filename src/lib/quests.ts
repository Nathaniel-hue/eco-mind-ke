export type Quest = { id: string; title: string; detail: string; impact: string };

/** Five distinct, curated actions for each day in a repeating two-week cycle. */
export const QUEST_CYCLE: Quest[][] = [
  [
    { id: "plant-lunch", title: "Make lunch plant-powered", detail: "Try beans, lentils, tofu or vegetables as the centre of your meal.", impact: "A lower-impact plate, one meal at a time." },
    { id: "plan-meals", title: "Plan tomorrow's meals", detail: "Check what you already have before writing a shopping list.", impact: "Planning helps food get eaten, not wasted." },
    { id: "leftovers", title: "Rescue something in the fridge", detail: "Turn one leftover or nearly-forgotten ingredient into a meal.", impact: "Keeps good food in use." },
    { id: "seasonal-produce", title: "Choose one seasonal ingredient", detail: "Look for produce that is in season where you live.", impact: "Seasonal choices can mean a simpler journey to your plate." },
    { id: "reusable-lunch", title: "Pack lunch in a reusable container", detail: "Bring a container or cutlery for one meal or snack.", impact: "Avoids a single-use takeaway item." },
  ],
  [
    { id: "phantom", title: "Hunt phantom power", detail: "Unplug three chargers or devices you are not using.", impact: "Small standby loads add up over time." },
    { id: "lights", title: "Switch off empty rooms", detail: "Do one gentle lights-off patrol at home or work.", impact: "Saves electricity when a room is empty." },
    { id: "daylight", title: "Use daylight for an hour", detail: "Open the curtains and leave a light off where practical.", impact: "Lets natural light do the work." },
    { id: "thermostat", title: "Check your heating or cooling", detail: "Adjust the setting by one comfortable degree if you can.", impact: "A small setting change can reduce energy use." },
    { id: "energy-label", title: "Check one appliance label", detail: "Find the energy guide on an appliance you use often.", impact: "Knowing what uses energy makes future choices easier." },
  ],
  [
    { id: "walk", title: "Walk or cycle one short trip", detail: "Replace one short car journey with a people-powered trip if practical.", impact: "Leaves the car parked for one journey." },
    { id: "transit", title: "Try public transport", detail: "Use a bus or train for one trip you would normally drive.", impact: "Shares a journey with other passengers." },
    { id: "combine-trips", title: "Combine two errands", detail: "Plan one outing so it covers more than one nearby stop.", impact: "Can avoid an extra vehicle journey." },
    { id: "car-share", title: "Offer a lift or share a ride", detail: "Ask a friend or colleague if you can travel together once.", impact: "Makes better use of a trip already happening." },
    { id: "remote-meeting", title: "Skip one unnecessary trip", detail: "Choose a call or message instead of travelling, when it works for everyone.", impact: "A trip not taken has no travel emissions." },
  ],
  [
    { id: "short-shower", title: "Try a five-minute shower", detail: "Set a timer and see if you can keep it short and comfortable.", impact: "Uses less water and heating than a long shower." },
    { id: "tap", title: "Turn off the tap while brushing", detail: "Let the water run only when you need it.", impact: "Keeps clean water from going straight down the drain." },
    { id: "leak-check", title: "Check for a dripping tap", detail: "Look and listen around sinks, toilets and outdoor taps.", impact: "A quick check can catch a slow leak early." },
    { id: "full-load", title: "Wait for a full laundry load", detail: "Combine items into one appropriate wash if you can.", impact: "Makes better use of water and wash energy." },
    { id: "cold-wash", title: "Wash one load cool", detail: "Use a cold or lower-temperature setting where suitable.", impact: "Reduces the energy used to heat wash water." },
  ],
  [
    { id: "byo", title: "Bring a reusable bottle or cup", detail: "Take one with you on an outing today.", impact: "Avoids a disposable drink container." },
    { id: "reusable-bag", title: "Take a reusable shopping bag", detail: "Keep one by the door or in your everyday bag.", impact: "Makes a single-use bag easier to skip." },
    { id: "refill", title: "Refill instead of rebuying", detail: "Refill a soap, cleaning or pantry container if available.", impact: "Keeps a useful container in circulation." },
    { id: "borrow", title: "Borrow before buying", detail: "Ask around before purchasing something you will rarely use.", impact: "Sharing can avoid an unnecessary new item." },
    { id: "plastic-free", title: "Skip one extra piece of packaging", detail: "Choose a loose or less-packaged option when convenient.", impact: "Prevents one avoidable wrapper or bag." },
  ],
  [
    { id: "repair", title: "Repair one small thing", detail: "Sew a button, tighten a screw or patch a small tear.", impact: "Gives a useful item a longer life." },
    { id: "care-clothes", title: "Care for a favourite garment", detail: "Air, mend or spot-clean one item instead of replacing it.", impact: "Helps clothing stay wearable for longer." },
    { id: "buy-secondhand", title: "Browse second-hand first", detail: "Look for a used option before buying one item new.", impact: "Keeps existing goods in use." },
    { id: "library", title: "Borrow a book or tool", detail: "Try a library or community lending shelf for something you need.", impact: "One item can serve many people." },
    { id: "declutter-donate", title: "Pass on one useful item", detail: "Give, sell or donate something in good condition that you no longer need.", impact: "Lets another person use what already exists." },
  ],
  [
    { id: "scrap-jar", title: "Collect food scraps for compost", detail: "Set aside fruit and vegetable scraps for a compost system.", impact: "Keeps organic material out of mixed rubbish where possible." },
    { id: "recycling-check", title: "Check one local recycling rule", detail: "Look up whether a confusing item belongs in your local bin.", impact: "Cleaner recycling is more useful recycling." },
    { id: "sort-recycling", title: "Sort your recycling carefully", detail: "Separate a few accepted containers from general rubbish.", impact: "Helps recyclable materials reach the right stream." },
    { id: "battery-dropoff", title: "Set aside a used battery", detail: "Find a safe local collection point rather than putting it in household waste.", impact: "Keeps special waste in a suitable collection stream." },
    { id: "litter", title: "Pick up a little litter", detail: "Collect a few safe pieces from a path or shared space.", impact: "Helps keep rubbish out of drains and waterways." },
  ],
  [
    { id: "local-produce", title: "Choose a nearby-grown food", detail: "Pick one locally grown ingredient if it is available to you.", impact: "Supports nearby growers and shorter supply chains." },
    { id: "plant-share", title: "Share a plant or cutting", detail: "Offer a seedling, cutting or spare seeds to someone nearby.", impact: "A small bit of greenery can keep growing in a new home." },
    { id: "community-garden", title: "Visit a community garden", detail: "Find out whether there is a shared growing space in your area.", impact: "Connects people with local food and nature." },
    { id: "eco-fact", title: "Share one useful eco fact", detail: "Tell someone a practical sustainability tip you have learned.", impact: "Good ideas travel through communities." },
    { id: "wildlife-water", title: "Offer wildlife a safe drink", detail: "If appropriate locally, put out a shallow, clean water dish and refresh it.", impact: "A small kindness for nearby wildlife." },
  ],
  [
    { id: "digital-cleanup", title: "Clear out unneeded digital files", detail: "Delete a few old downloads or duplicate files you no longer need.", impact: "Keeps your digital space tidy and purposeful." },
    { id: "device-lifespan", title: "Give a device a little care", detail: "Clean a vent, update software or protect a device you rely on.", impact: "Good care can help electronics last longer." },
    { id: "unsubscribe", title: "Unsubscribe from unused emails", detail: "Remove a few newsletters you never read.", impact: "A tiny step toward a less cluttered inbox." },
    { id: "stream-wisely", title: "Choose a lower-data option", detail: "Download on Wi-Fi or lower video quality when it suits you.", impact: "Uses less data for the same everyday moment." },
    { id: "power-down", title: "Power down an unused screen", detail: "Turn off a monitor or device when you are done for the day.", impact: "Avoids leaving electronics running needlessly." },
  ],
  [
    { id: "meatless-dinner", title: "Try a plant-based dinner", detail: "Make vegetables, grains or legumes the centre of one evening meal.", impact: "Explores a lighter-impact meal option." },
    { id: "batch-cook", title: "Cook once for another meal", detail: "Make an extra portion to save for later in the week.", impact: "Makes it easier to use the food you prepare." },
    { id: "use-freezer", title: "Rescue something from the freezer", detail: "Use a frozen ingredient or saved portion before it gets forgotten.", impact: "Gives stored food another chance to be enjoyed." },
    { id: "portion-check", title: "Serve a just-right portion", detail: "Start with what you expect to eat and save extra for later.", impact: "Helps prevent uneaten food." },
    { id: "share-food", title: "Share surplus food", detail: "Offer an extra portion or unopened surplus to someone who can use it.", impact: "Good food is better shared than wasted." },
  ],
  [
    { id: "native-plant", title: "Learn about one native plant", detail: "Find a plant that naturally grows in your region.", impact: "Local plants can support local wildlife." },
    { id: "tree-care", title: "Care for a tree near you", detail: "Water a young tree if needed and permitted, or keep its base clear.", impact: "Healthy trees benefit from thoughtful care." },
    { id: "pollinator", title: "Make a small pollinator-friendly choice", detail: "Leave a small patch undisturbed or choose a pollinator-friendly plant.", impact: "Creates a little more habitat for insects." },
    { id: "nature-observation", title: "Notice five wild things", detail: "Take a slow walk and spot five plants, birds or insects.", impact: "Attention is a good first step toward care." },
    { id: "plastic-drain", title: "Keep rubbish away from a drain", detail: "Move safe litter away from a storm drain or waterway.", impact: "Helps stop rubbish travelling downstream." },
  ],
  [
    { id: "secondhand-gift", title: "Find a thoughtful second-hand gift", detail: "Consider a pre-loved item or shared experience for your next gift.", impact: "Thoughtfulness does not need a brand-new product." },
    { id: "buy-durable", title: "Choose durability over impulse", detail: "Pause before one purchase and check how long it is likely to last.", impact: "Longer-lasting goods need replacing less often." },
    { id: "check-claims", title: "Look closer at an eco claim", detail: "Check whether a product's environmental claim is specific and supported.", impact: "Helps you avoid vague greenwashing claims." },
    { id: "no-buy-day", title: "Take a mindful no-buy day", detail: "Skip non-essential purchases today and enjoy what you already have.", impact: "Using what you own is the most circular option." },
    { id: "eco-review", title: "Leave a helpful product review", detail: "Share an honest note about the durability or repairability of something you own.", impact: "Gives the next shopper more useful information." },
  ],
];

const CYCLE_START = Date.UTC(2026, 0, 5) / 86_400_000;

function cycleIndex(key: string): number {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(key);
  if (!match) return 0;
  const [, year, month, day] = match;
  const date = Date.UTC(Number(year), Number(month) - 1, Number(day));
  if (!Number.isFinite(date)) return 0;
  const ordinal = date / 86_400_000;
  return ((ordinal - CYCLE_START) % 14 + 14) % 14;
}

export function todayKey(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function questsForDay(key: string): Quest[] {
  return QUEST_CYCLE[cycleIndex(key)] ?? QUEST_CYCLE[0] ?? [];
}

const KEY = "ecomind.quests";
export type QuestState = { day: string; done: string[]; streak: number; lastFullDay: string | null; blooms: number };

function yesterday(key: string) {
  const [y, m, d] = key.split("-").map(Number);
  return todayKey(new Date(y, m - 1, d - 1));
}

export function loadQuestState(): QuestState {
  const day = todayKey();
  let state: QuestState = { day, done: [], streak: 0, lastFullDay: null, blooms: 0 };
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) state = { ...state, ...JSON.parse(raw) };
  } catch {
    // Keep a clean local state when storage is unavailable or malformed.
  }
  if (state.day !== day) {
    state = { ...state, day, done: [] };
    if (state.lastFullDay !== yesterday(day)) state.streak = 0;
  }
  const todaysIds = new Set(questsForDay(day).map((quest) => quest.id));
  state.done = Array.isArray(state.done) ? state.done.filter((id) => todaysIds.has(id)) : [];
  return state;
}

export function toggleQuest(state: QuestState, id: string): QuestState {
  if (!questsForDay(state.day).some((quest) => quest.id === id)) return state;
  const done = state.done.includes(id) ? state.done.filter((item) => item !== id) : [...state.done, id];
  let next = { ...state, done };
  if (done.length === 5 && state.lastFullDay !== state.day) {
    next = { ...next, lastFullDay: state.day, streak: state.streak + 1, blooms: state.blooms + 1 };
  }
  localStorage.setItem(KEY, JSON.stringify(next));
  window.dispatchEvent(new Event("ecomind:quests"));
  return next;
}

export function sproutStage(blooms: number): number {
  if (blooms < 1) return 0;
  if (blooms < 2) return 1;
  if (blooms < 3) return 2;
  if (blooms < 5) return 3;
  if (blooms < 10) return 4;
  if (blooms < 20) return 5;
  if (blooms < 40) return 6;
  if (blooms < 80) return 7;
  return 8 + Math.floor((blooms - 80) / 40);
}

export function sproutStageName(blooms: number): string {
  const stage = sproutStage(blooms);
  if (stage === 0) return "A seed, ready to grow";
  if (stage === 1) return "A new sprout";
  if (stage === 2) return "A young sapling";
  if (stage === 3) return "A growing tree";
  if (stage === 4) return "A sturdy tree";
  if (stage === 5) return "A little grove";
  if (stage === 6) return "A flourishing forest";
  if (stage === 7) return "A growing woodland";
  return `A thriving ecosystem · Level ${stage - 6}`;
}