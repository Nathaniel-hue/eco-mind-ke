import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { loadQuestState } from "@/lib/quests";

/** Sprout: grows one stage per completed daily quest (0-5). */
export function SproutSvg({ stage, size = 36 }: { stage: number; size?: number }) {
  return (
    <svg viewBox="0 0 40 40" width={size} height={size} aria-hidden className="overflow-visible">
      <ellipse cx="20" cy="35" rx="13" ry="4" style={{ fill: "var(--muted-foreground)", opacity: 0.35 }} />
      {stage === 0 && <ellipse cx="20" cy="32" rx="4" ry="3" style={{ fill: "var(--leaf)" }} className="animate-pulse" />}
      {stage >= 1 && (
        <path d={`M20 34 L20 ${30 - stage * 3.5}`} strokeWidth="2.2" strokeLinecap="round" style={{ stroke: "var(--leaf)", transition: "all .5s" }} />
      )}
      {stage >= 2 && <path d="M20 26 q-7 -1 -8 -7 q7 0 8 7z" style={{ fill: "var(--leaf)" }} />}
      {stage >= 3 && <path d="M20 22 q7 -1 8 -7 q-7 0 -8 7z" style={{ fill: "var(--leaf-glow)" }} />}
      {stage >= 4 && <path d="M20 17 q-6 -1 -6 -6 q6 0 6 6z" style={{ fill: "var(--leaf)" }} />}
      {stage >= 5 && (
        <g className="origin-center animate-[spin_8s_linear_infinite]" style={{ transformOrigin: "20px 10px" }}>
          {[0, 72, 144, 216, 288].map((r) => (
            <ellipse key={r} cx="20" cy="6" rx="2.6" ry="4" transform={`rotate(${r} 20 10)`} style={{ fill: "var(--chart-1)" }} />
          ))}
          <circle cx="20" cy="10" r="2.4" style={{ fill: "var(--accent-foreground)" }} />
        </g>
      )}
    </svg>
  );
}

export function NavMascot() {
  const [stage, setStage] = useState(0);
  useEffect(() => {
    const read = () => setStage(loadQuestState().done.length);
    read();
    window.addEventListener("ecomind:quests", read);
    return () => window.removeEventListener("ecomind:quests", read);
  }, []);
  return (
    <Link to="/quests" title={`Sprout: ${stage}/5 quests today`} className="grid h-9 w-9 place-items-center rounded-xl hover:bg-accent">
      <SproutSvg stage={stage} size={28} />
    </Link>
  );
}
