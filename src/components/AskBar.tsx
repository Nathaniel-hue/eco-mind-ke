import { useState, type FormEvent } from "react";
import { Search, Loader2, BookOpen } from "lucide-react";

export function AskBar({
  onSubmit,
  loading,
  research,
  setResearch,
  offlineOnly,
  value,
  setValue,
}: {
  onSubmit: (q: string) => void;
  loading: boolean;
  research: boolean;
  setResearch: (v: boolean) => void;
  offlineOnly: boolean;
  value: string;
  setValue: (v: string) => void;
}) {
  const [focused, setFocused] = useState(false);

  function handle(e: FormEvent) {
    e.preventDefault();
    onSubmit(value);
  }

  return (
    <form onSubmit={handle} className="mx-auto w-full max-w-3xl">
      <div
        className={`flex items-center gap-3 rounded-3xl border bg-card px-5 py-4 shadow-card transition ${
          focused ? "ring-2 ring-ring/40" : ""
        }`}
      >
        <Search className="h-5 w-5 shrink-0 text-muted-foreground" />
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Ask a sustainability question — e.g. Is bamboo packaging better than plastic?"
          className="w-full bg-transparent text-base outline-none placeholder:text-muted-foreground/70"
          aria-label="Ask a sustainability question"
        />
        <button
          type="submit"
          disabled={loading || !value.trim()}
          className="inline-flex shrink-0 items-center gap-2 rounded-2xl leaf-gradient px-4 py-2 text-sm font-medium text-leaf-foreground shadow-glow transition hover:opacity-95 disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          <span className="hidden sm:inline">{loading ? "Looking" : "Find out"}</span>
        </button>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-center gap-3 text-xs text-muted-foreground">
        <button
          type="button"
          onClick={() => setResearch(!research)}
          disabled={offlineOnly}
          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 transition disabled:opacity-50 ${
            research ? "border-leaf bg-accent text-accent-foreground" : "hover:bg-accent"
          }`}
        >
          <BookOpen className="h-3.5 w-3.5" />
          Research mode {research ? "on" : "off"}
        </button>
        <span>
          {offlineOnly
            ? "Offline mode is on — answers come from the built-in library."
            : "Answers draw on a built-in library first, then trusted online research."}
        </span>
      </div>
    </form>
  );
}
