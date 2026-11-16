export const BINS = ["Compost", "Recycling", "Landfill", "Hazardous / E-Waste"] as const;
export type Bin = (typeof BINS)[number];
export type SortItem = { name: string; emoji: string; bin: Bin; tip: string };
const groups: [Bin, string, string, string][] = [
  ["Compost", "Banana peel", "🍌", "Fruit scraps break down in a home compost pile."],
  ["Compost", "Apple core", "🍎", "Fruit cores can become compost rather than mixed waste."],
  ["Compost", "Carrot tops", "🥕", "Vegetable scraps are suitable for home composting."],
  ["Compost", "Coffee grounds", "☕", "Mix coffee grounds with dry leaves or plain cardboard."],
  ["Compost", "Dry leaves", "🍂", "Dry leaves balance wet food scraps in compost."],
  ["Compost", "Grass clippings", "🌿", "Add thin layers so clippings do not mat together."],
  ["Compost", "Eggshells", "🥚", "Crush shells; they break down slowly."],
  ["Compost", "Plain uncoated cardboard", "📦", "Tear it into small pieces and remove tape first."],
  ["Recycling", "Clean aluminium can", "🥫", "Empty metal cans are widely accepted in recycling."],
  ["Recycling", "Clean steel tin", "🥫", "Empty and rinse tins before recycling."],
  [
    "Recycling",
    "Clean glass bottle",
    "🍾",
    "Container glass is different from drinking glass; check local acceptance.",
  ],
  ["Recycling", "Dry newspaper", "📰", "Keep paper clean and dry for recycling."],
  ["Recycling", "Clean cardboard box", "📦", "Flatten cardboard and remove food residue."],
  [
    "Recycling",
    "Empty PET drink bottle",
    "🧴",
    "PET bottles are commonly accepted; follow local cap rules.",
  ],
  [
    "Recycling",
    "Clean glass jar",
    "🫙",
    "Empty food jars are container glass; check your local service.",
  ],
  ["Recycling", "Clean office paper", "📄", "Plain paper can be made into new paper products."],
  [
    "Landfill",
    "Broken drinking glass",
    "🥛",
    "Heat-resistant drinking glass is not bottle glass. Wrap shards safely.",
  ],
  [
    "Landfill",
    "Disposable nappy",
    "🧷",
    "Mixed materials and contamination prevent ordinary recycling.",
  ],
  [
    "Landfill",
    "Plastic-lined coffee cup",
    "☕",
    "Most curbside services cannot separate the lining. Specialist schemes may accept it.",
  ],
  [
    "Landfill",
    "Crisp packet",
    "🥔",
    "Multi-layer packaging needs a specialist collection, not ordinary recycling.",
  ],
  [
    "Landfill",
    "Used adhesive tape",
    "🩹",
    "Sticky plastic tape does not belong in paper recycling.",
  ],
  ["Landfill", "Broken ceramic mug", "🏺", "Ceramics contaminate container-glass recycling."],
  [
    "Landfill",
    "Polystyrene takeaway tray",
    "🥡",
    "Usually not accepted in curbside recycling; avoid or reuse when possible.",
  ],
  [
    "Landfill",
    "Plastic grocery bag",
    "🛍️",
    "Keep soft films out of curbside recycling; use a store take-back if available.",
  ],
  [
    "Hazardous / E-Waste",
    "Lithium battery",
    "🔋",
    "Batteries can ignite in waste trucks. Use a dedicated collection point.",
  ],
  [
    "Hazardous / E-Waste",
    "Old mobile phone",
    "📱",
    "Electronics contain recoverable materials; use a certified collection.",
  ],
  [
    "Hazardous / E-Waste",
    "Broken laptop",
    "💻",
    "Remove personal data before taking electronics to a specialist.",
  ],
  [
    "Hazardous / E-Waste",
    "LED bulb",
    "💡",
    "Electronic lighting belongs in an appropriate e-waste collection.",
  ],
  [
    "Hazardous / E-Waste",
    "Leftover paint",
    "🎨",
    "Use a hazardous-waste service; never pour paint down drains.",
  ],
  [
    "Hazardous / E-Waste",
    "Fluorescent tube",
    "💡",
    "Fluorescent lamps may contain mercury and need specialist disposal.",
  ],
  [
    "Hazardous / E-Waste",
    "Old charging cable",
    "🔌",
    "Cables contain metals recoverable through e-waste collection.",
  ],
  [
    "Hazardous / E-Waste",
    "Used motor oil",
    "🛢️",
    "Take oil to an approved collection; never pour it into soil or water.",
  ],
];
export const SORT_ITEMS: SortItem[] = groups.map(([bin, name, emoji, tip]) => ({
  bin,
  name,
  emoji,
  tip,
}));
export function scoreChoice(score: number, streak: number, correct: boolean) {
  return correct ? { score: score + 10, streak: streak + 1 } : { score, streak: 0 };
}
export function shuffledRound(): SortItem[] {
  const items = [...SORT_ITEMS];
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items.slice(0, 10);
}
