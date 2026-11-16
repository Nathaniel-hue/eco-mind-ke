import { describe, it, expect } from "vitest";
import {
  QUEST_CYCLE,
  questsForDay,
  normalizeQuestState,
  mergeQuestStates,
  questAfterToggle,
  sproutStage,
  nextGrowthAt,
} from "./quests";
describe("daily quest rules", () => {
  it("provides exactly five distinct quests each day of two weeks", () => {
    expect(QUEST_CYCLE).toHaveLength(14);
    for (const day of QUEST_CYCLE) {
      expect(day).toHaveLength(5);
      expect(new Set(day.map((q) => q.id)).size).toBe(5);
    }
    expect(new Set(QUEST_CYCLE.flat().map((q) => q.id)).size).toBe(70);
  });
  it("changes each day and repeats after fourteen days", () => {
    expect(questsForDay("2026-11-16")).not.toEqual(questsForDay("2026-11-17"));
    expect(questsForDay("2026-11-16")).toEqual(questsForDay("2026-11-30"));
  });
  it("awards one lifetime bloom when all five are completed, not on repeated toggles", () => {
    let s = normalizeQuestState(null, "2026-11-16");
    for (const q of questsForDay(s.day)) s = questAfterToggle(s, q.id);
    expect(s.blooms).toBe(1);
    const id = questsForDay(s.day)[0].id;
    s = questAfterToggle(questAfterToggle(s, id), id);
    expect(s.blooms).toBe(1);
  });
  it("retains lifetime growth when a new day starts", () => {
    expect(
      normalizeQuestState({ day: "2026-11-15", done: ["walk"], blooms: 23 }, "2026-11-16"),
    ).toMatchObject({ done: [], blooms: 23 });
  });
  it("merges device progress without losing or duplicating completed days", () => {
    const a = { day: "2026-11-16", blooms: 3, completedDays: ["2026-11-15"] };
    const b = { day: "2026-11-16", blooms: 4, completedDays: ["2026-11-14", "2026-11-15"] };
    expect(mergeQuestStates(a, b, "2026-11-16").blooms).toBe(4);
  });
  it("unites today's partial completions and awards a single merged bloom", () => {
    const ids = questsForDay("2026-11-16").map((q) => q.id);
    const merged = mergeQuestStates(
      { day: "2026-11-16", done: ids.slice(0, 3), blooms: 0 },
      { day: "2026-11-16", done: ids.slice(3), blooms: 0 },
      "2026-11-16",
    );
    expect(merged.done).toHaveLength(5);
    expect(merged.blooms).toBe(1);
    expect(mergeQuestStates(merged, merged, "2026-11-16").blooms).toBe(1);
  });
  it("grows from tree to grove to forest and continues beyond ecosystems", () => {
    expect(sproutStage(3)).toBe(3);
    expect(sproutStage(10)).toBe(5);
    expect(sproutStage(20)).toBe(6);
    expect(sproutStage(80)).toBe(8);
    expect(sproutStage(120)).toBe(9);
    expect(nextGrowthAt(120)).toBe(160);
  });
});
