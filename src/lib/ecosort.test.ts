import { it, expect } from "vitest";
import { SORT_ITEMS, scoreChoice, shuffledRound } from "./ecosort";
it("offers at least thirty sorting items and ten unique items per round", () => {
  expect(SORT_ITEMS.length).toBeGreaterThanOrEqual(30);
  const round = shuffledRound();
  expect(round).toHaveLength(10);
  expect(new Set(round.map((i) => i.name)).size).toBe(10);
});
it("awards ten points only for correct sorting and resets incorrect streaks", () => {
  expect(scoreChoice(20, 2, true)).toEqual({ score: 30, streak: 3 });
  expect(scoreChoice(20, 2, false)).toEqual({ score: 20, streak: 0 });
});
it("sends lithium batteries to specialist disposal", () => {
  expect(SORT_ITEMS.find((i) => i.name === "Lithium battery")?.bin).toBe("Hazardous / E-Waste");
});
