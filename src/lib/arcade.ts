export const ARCADE_GAMES = [
  {
    id: "sort",
    name: "EcoSort",
    emoji: "♻️",
    genre: "Sorting",
    inspiration: "The original waste-sorting challenge",
    fact: "Keep batteries out of ordinary waste: they can cause fires.",
  },
  {
    id: "flappy",
    name: "Flappy Pollinator",
    emoji: "🐝",
    genre: "Flight",
    inspiration: "A Flappy Bird-inspired meadow flight",
    fact: "Pollinators help many flowering plants reproduce.",
  },
  {
    id: "snake",
    name: "Compost Snake",
    emoji: "🐛",
    genre: "Snake",
    inspiration: "A hungry worm with a growing appetite",
    fact: "Compost returns organic matter to soil.",
  },
  {
    id: "breakout",
    name: "Reef Breaker",
    emoji: "🪸",
    genre: "Breakout",
    inspiration: "Clear drifting litter above the reef",
    fact: "Reducing plastic waste helps protect marine life.",
  },
  {
    id: "invaders",
    name: "Smog Sweep",
    emoji: "🌬️",
    genre: "Space shooter",
    inspiration: "Sweep away a descending smog fleet",
    fact: "Clean energy and cleaner transport can reduce air pollution.",
  },
  {
    id: "runner",
    name: "Rewild Runner",
    emoji: "🦊",
    genre: "Runner",
    inspiration: "Hop over rubbish on a woodland trail",
    fact: "Connected habitats help wildlife move safely.",
  },
  {
    id: "catch",
    name: "Ocean Catch",
    emoji: "🐢",
    genre: "Catcher",
    inspiration: "Collect litter, leave the fish in the sea",
    fact: "Preventing litter on land also protects the ocean.",
  },
  {
    id: "frog",
    name: "Frog Crossing",
    emoji: "🐸",
    genre: "Frogger",
    inspiration: "Cross a busy road to reach the wetland",
    fact: "Wildlife crossings can reduce road collisions.",
  },
  {
    id: "memory",
    name: "Habitat Match",
    emoji: "🦋",
    genre: "Memory",
    inspiration: "Find the matching wildlife pairs",
    fact: "Healthy habitats support a diverse mix of species.",
  },
  {
    id: "quiz",
    name: "Planet Quickfire",
    emoji: "🌍",
    genre: "Quiz",
    inspiration: "Ten everyday ecology decisions",
    fact: "Small changes work best when they become lasting habits.",
  },
] as const;
export type GameId = (typeof ARCADE_GAMES)[number]["id"];
export type ActionGameId = Exclude<GameId, "sort" | "memory" | "quiz">;
export const QUIZ = [
  {
    question: "Where should a used lithium battery go?",
    answers: ["A dedicated battery collection", "Home compost", "Mixed household waste"],
    correct: 0,
    reason: "Batteries need specialist collection because they can start fires.",
  },
  {
    question: "Which action prevents food waste?",
    answers: [
      "Buying extra just in case",
      "Planning meals around what you have",
      "Throwing out all leftovers",
    ],
    correct: 1,
    reason: "Using existing food first reduces waste and unnecessary purchases.",
  },
  {
    question: "What belongs in a home compost pile?",
    answers: ["Plastic bags", "Old batteries", "Fruit peels"],
    correct: 2,
    reason: "Fruit peels break down into organic matter; plastic and batteries do not.",
  },
  {
    question: "What helps pollinators in a garden?",
    answers: ["Locally appropriate flowering plants", "More paving", "Removing every flower"],
    correct: 0,
    reason: "Suitable flowering plants offer food and habitat for pollinators.",
  },
  {
    question: "A leaking tap should be…",
    answers: ["Left running", "Repaired", "Hidden"],
    correct: 1,
    reason: "Repairing leaks avoids wasting treated water.",
  },
  {
    question: "For a safe, short trip, which has no tailpipe emissions?",
    answers: ["Driving alone", "Idling a car", "Walking"],
    correct: 2,
    reason: "Walking creates no tailpipe emissions and can replace a short car trip.",
  },
  {
    question: "What should you do with a usable unwanted shirt?",
    answers: ["Pass it on or donate it", "Burn it", "Throw it in a river"],
    correct: 0,
    reason: "Keeping clothes in use reduces the need for new materials.",
  },
  {
    question: "Which helps wildlife cross roads safely?",
    answers: ["More litter", "Dedicated wildlife crossings", "Removing nearby habitat"],
    correct: 1,
    reason: "Well-designed crossings connect habitats and reduce collisions.",
  },
  {
    question: "Where should leftover motor oil go?",
    answers: ["A drain", "Garden soil", "An approved collection service"],
    correct: 2,
    reason: "Used oil can pollute soil and water and needs specialist collection.",
  },
  {
    question: "Before buying a new appliance, try…",
    answers: [
      "Repairing the existing one if safe",
      "Discarding it immediately",
      "Buying two replacements",
    ],
    correct: 0,
    reason: "A safe repair can extend product life and avoid manufacturing impacts.",
  },
];
export function quizPoints(index: number, answer: number) {
  return QUIZ[index]?.correct === answer ? 10 : 0;
}
export function memoryDeck() {
  return ["🐝", "🦋", "🐸", "🐢", "🦊", "🐦", "🌳", "🪸"]
    .flatMap((emoji, pair) => [
      { emoji, pair },
      { emoji, pair },
    ])
    .map((card) => ({ card, random: Math.random() }))
    .sort((a, b) => a.random - b.random)
    .map(({ card }) => card);
}
