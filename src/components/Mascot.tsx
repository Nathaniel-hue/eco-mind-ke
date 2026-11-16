import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { loadQuestState, sproutStage, sproutStageName } from "@/lib/quests";

export function SproutSvg({ stage, size = 36 }: { stage: number; size?: number }) {
  const trees = stage >= 7 ? 13 : stage >= 6 ? 9 : stage >= 5 ? 5 : 1;
  return (
    <svg
      viewBox="0 0 200 160"
      width={size}
      height={size * 0.8}
      role="img"
      aria-label={
        stage >= 6 ? "A flourishing forest" : stage >= 3 ? "A growing tree" : "A growing sprout"
      }
      className="max-w-full"
    >
      {stage >= 8 && (
        <circle cx="100" cy="78" r="67" className="fill-sky/20 stroke-sky" strokeWidth="2" />
      )}
      <ellipse cx="100" cy="142" rx="88" ry="12" className="fill-leaf/15" />
      {stage === 0 && <ellipse cx="100" cy="134" rx="9" ry="6" className="fill-earth" />}
      {stage > 0 && stage < 3 && (
        <g>
          <path d="M100 142V98" className="stroke-leaf" strokeWidth="5" strokeLinecap="round" />
          <path d="M100 123Q68 122 72 103Q98 103 100 123" className="fill-leaf" />
          <path d="M100 111Q127 109 127 92Q103 91 100 111" className="fill-leaf-glow" />
          {stage === 2 && <path d="M100 100Q83 91 89 77Q106 82 100 100" className="fill-leaf" />}
        </g>
      )}
      {stage >= 3 &&
        Array.from({ length: trees }, (_, i) => {
          const x = trees === 1 ? 100 : 24 + (i % 5) * 37 + (Math.floor(i / 5) % 2) * 9;
          const y = trees === 1 ? 138 : 115 + Math.floor(i / 5) * 11;
          const scale = trees === 1 ? 1 : 0.46 + (i % 3) * 0.09;
          return (
            <g key={i} transform={`translate(${x} ${y}) scale(${scale})`}>
              <path
                d="M0 0V-75M0 -40L-17 -60M0 -50L19 -70M0 -2L-13 7M0 -2L13 7"
                className="stroke-earth"
                strokeWidth="7"
                strokeLinecap="round"
              />
              <circle cx="-20" cy="-77" r="26" className="fill-leaf" />
              <circle cx="20" cy="-80" r="27" className="fill-leaf" />
              <circle cx="0" cy="-101" r="29" className="fill-leaf-glow" />
              {stage === 3 && <circle cx="0" cy="-91" r="14" className="fill-leaf" />}
            </g>
          );
        })}
      {stage >= 6 && (
        <path
          d="M112 140q-25-12-8-23t-4-15"
          className="fill-none stroke-sky"
          strokeWidth="6"
          strokeLinecap="round"
        />
      )}
      {stage >= 5 && (
        <g className="stroke-muted-foreground fill-none" strokeWidth="2">
          <path d="M24 37q5-7 10 0q5-7 10 0M144 27q5-7 10 0q5-7 10 0" />
        </g>
      )}
      {stage >= 4 && (
        <g className="fill-clay">
          <circle cx="37" cy="143" r="3" />
          <circle cx="165" cy="139" r="3" />
        </g>
      )}
    </svg>
  );
}
export function NavMascot() {
  const [blooms, setBlooms] = useState(0);
  useEffect(() => {
    const read = () => setBlooms(loadQuestState().blooms);
    read();
    window.addEventListener("ecomind:quests", read);
    window.addEventListener("ecomind:sync", read);
    return () => {
      window.removeEventListener("ecomind:quests", read);
      window.removeEventListener("ecomind:sync", read);
    };
  }, []);
  return (
    <Link
      to="/quests"
      title={sproutStageName(blooms)}
      aria-label="Your growing Sprout"
      className="hidden h-9 w-9 place-items-center rounded-lg hover:bg-accent md:grid"
    >
      <SproutSvg stage={sproutStage(blooms)} size={32} />
    </Link>
  );
}
