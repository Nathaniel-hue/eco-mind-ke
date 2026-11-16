import { expect, it } from "vitest";
import { ARCADE_GAMES, QUIZ, quizPoints, memoryDeck } from "./arcade";
it("offers ten distinct playable game choices", () => {
  expect(ARCADE_GAMES).toHaveLength(10);
  expect(new Set(ARCADE_GAMES.map((g) => g.id)).size).toBe(10);
});
it("awards quiz points only to the correct answer", () => {
  QUIZ.forEach((q, i) =>
    q.answers.forEach((_, a) => expect(quizPoints(i, a)).toBe(a === q.correct ? 10 : 0)),
  );
});
it("creates eight matchable pairs", () => {
  const deck = memoryDeck();
  expect(deck).toHaveLength(16);
  for (let pair = 0; pair < 8; pair++) expect(deck.filter((c) => c.pair === pair)).toHaveLength(2);
});
