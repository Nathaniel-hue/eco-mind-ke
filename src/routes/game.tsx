import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Gamepad2 } from "lucide-react";
import { Button } from "@/components/Button";
import { EcoSort } from "@/components/games/EcoSort";
import { MemoryGame, QuizGame } from "@/components/games/PuzzleGames";
import { ActionGame } from "@/components/games/ActionGame";
import { ARCADE_GAMES, type GameId } from "@/lib/arcade";
export const Route = createFileRoute("/game")({
  staticData: { sitemap: true },
  head: () => ({
    meta: [
      { title: "Little Planet Arcade — 10 Ecology Games | EcoMind" },
      {
        name: "description",
        content:
          "Play ten offline ecology games: EcoSort, Flappy Pollinator, Compost Snake, Reef Breaker and more.",
      },
      { property: "og:title", content: "Little Planet Arcade | EcoMind" },
      {
        property: "og:description",
        content: "Ten playful ecology challenges, from wildlife memory to a pollinator flight.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Arcade,
});
function Arcade() {
  const [selected, setSelected] = useState<GameId | null>(null);
  const game = ARCADE_GAMES.find((g) => g.id === selected);
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-primary">
        <Gamepad2 size={18} />
        EcoMind · Play for the planet
      </div>
      <h1 className="mt-3 text-4xl">Little Planet Arcade</h1>
      {game && selected ? (
        <>
          <Button className="mt-6" onClick={() => setSelected(null)}>
            <ArrowLeft size={16} />
            All games
          </Button>
          <div className="mt-6 flex items-center gap-4">
            <span className="text-5xl" aria-hidden>
              {game.emoji}
            </span>
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                {game.genre}
              </p>
              <h2 className="mt-1 text-3xl">{game.name}</h2>
            </div>
          </div>
          {selected === "sort" ? (
            <EcoSort />
          ) : selected === "memory" ? (
            <MemoryGame />
          ) : selected === "quiz" ? (
            <QuizGame />
          ) : (
            <ActionGame key={selected} mode={selected} />
          )}
          <p className="mt-5 border-t pt-5 text-sm text-muted-foreground">{game.fact}</p>
        </>
      ) : (
        <>
          <p className="mt-3 text-muted-foreground">A little play. A greener world.</p>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ARCADE_GAMES.map((g, i) => (
              <Button
                key={g.id}
                onClick={() => setSelected(g.id)}
                className="group min-h-48 flex-col items-start justify-between whitespace-normal bg-card p-5 text-left shadow-card hover:border-primary hover:bg-accent"
              >
                <div className="flex w-full items-start justify-between">
                  <span className="text-5xl" aria-hidden>
                    {g.emoji}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {String(i + 1).padStart(2, "0")} / 10
                  </span>
                </div>
                <div className="mt-5">
                  <p className="text-xs text-primary">{g.genre}</p>
                  <h2 className="mt-1 text-xl">{g.name}</h2>
                  <p className="mt-2 text-sm font-normal text-muted-foreground">{g.inspiration}</p>
                </div>
              </Button>
            ))}
          </div>
        </>
      )}
    </main>
  );
}
