import { useEffect, useState } from "react";
import { RotateCcw, ArrowRight, Trophy } from "lucide-react";
import { Button } from "@/components/Button";
import { memoryDeck, QUIZ, quizPoints } from "@/lib/arcade";

export function MemoryGame() {
  const [deck, setDeck] = useState<ReturnType<typeof memoryDeck>>([]);
  const [open, setOpen] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const reset = () => {
    setDeck(memoryDeck());
    setOpen([]);
    setMatched([]);
    setMoves(0);
  };
  useEffect(reset, []);
  useEffect(() => {
    if (open.length !== 2) return;
    const [a, b] = open;
    if (deck[a]?.pair === deck[b]?.pair) {
      setMatched((prev) => [...prev, a, b]);
      setOpen([]);
    } else {
      const timer = setTimeout(() => setOpen([]), 900);
      return () => clearTimeout(timer);
    }
  }, [open, deck]);
  return (
    <section className="mx-auto max-w-lg py-6">
      <div className="mb-5 flex justify-between text-sm">
        <span>Pairs {matched.length / 2} / 8</span>
        <span>Moves {moves}</span>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {deck.map((card, i) => (
          <Button
            key={i}
            aria-label={
              matched.includes(i) || open.includes(i)
                ? `${card.emoji} card ${i + 1}`
                : `Reveal card ${i + 1}`
            }
            disabled={matched.includes(i) || open.length === 2}
            className={`aspect-square text-3xl ${matched.includes(i) ? "border-primary bg-accent" : "bg-card"}`}
            onClick={() => {
              if (open.includes(i)) return;
              setOpen([...open, i]);
              if (open.length === 1) setMoves(moves + 1);
            }}
          >
            {open.includes(i) || matched.includes(i) ? card.emoji : "🍃"}
          </Button>
        ))}
      </div>
      {matched.length === 16 && (
        <p role="status" className="mt-5 text-center text-primary">
          All habitats matched! {moves} moves.
        </p>
      )}
      <Button onClick={reset} className="mt-5">
        <RotateCcw size={16} />
        New round
      </Button>
    </section>
  );
}
export function QuizGame() {
  const [index, setIndex] = useState(0),
    [answer, setAnswer] = useState<number | null>(null),
    [score, setScore] = useState(0);
  const q = QUIZ[index];
  return (
    <section className="mx-auto max-w-xl py-6">
      <div className="flex justify-between text-sm">
        <span>Question {Math.min(index + 1, 10)} / 10</span>
        <span>Score {score}</span>
      </div>
      {q ? (
        <>
          <h3 className="my-8 text-2xl">{q.question}</h3>
          <div className="grid gap-3">
            {q.answers.map((text, a) => (
              <Button
                key={text}
                disabled={answer !== null}
                className={`min-h-14 justify-start whitespace-normal text-left ${answer !== null && a === q.correct ? "border-primary bg-accent" : answer === a ? "border-destructive text-destructive" : "bg-card"}`}
                onClick={() => {
                  setAnswer(a);
                  setScore(score + quizPoints(index, a));
                }}
              >
                {text}
              </Button>
            ))}
          </div>
          {answer !== null && (
            <div className="mt-6" role="status">
              <p className={answer === q.correct ? "text-primary" : "text-destructive"}>
                {answer === q.correct ? "Correct! +10 points" : "Incorrect — no points added"}
              </p>
              <p className="mt-2 text-muted-foreground">{q.reason}</p>
              <Button
                className="mt-4"
                onClick={() => {
                  setIndex(index + 1);
                  setAnswer(null);
                }}
              >
                {index === 9 ? "See results" : "Next question"}
                <ArrowRight size={16} />
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="py-12 text-center">
          <Trophy className="mx-auto text-primary" size={40} />
          <h3 className="mt-4 text-3xl">{score} / 100</h3>
          <p className="mt-2">{score / 10} correct answers</p>
          <Button
            className="mt-6"
            onClick={() => {
              setIndex(0);
              setAnswer(null);
              setScore(0);
            }}
          >
            <RotateCcw size={16} />
            Play again
          </Button>
        </div>
      )}
    </section>
  );
}
