import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { defaultSettings, loadSettings, saveSettings, saveThreads, type Settings } from "@/lib/chat-storage";
import { applyAccentHue } from "@/lib/apply-theme";
import { Moon, Sun, Trash2, WifiOff, Palette } from "lucide-react";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — EcoMind AI" },
      { name: "description", content: "Theme, accent color, offline mode, and history controls." },
      { property: "og:title", content: "Settings — EcoMind AI" },
      { property: "og:description", content: "Personalize your EcoMind AI experience." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSettings(loadSettings());
  }, []);

  function update(patch: Partial<Settings>) {
    const next = { ...settings, ...patch };
    setSettings(next);
    saveSettings(next);
    if (patch.theme) {
      document.documentElement.classList.toggle("dark", patch.theme === "dark");
    }
    if (patch.accent !== undefined) {
      applyAccentHue(patch.accent);
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 1200);
  }

  function clearHistory() {
    if (!confirm("Delete all conversation history? This cannot be undone.")) return;
    saveThreads([]);
    alert("History cleared.");
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <div className="animate-fade-up">
        <div className="text-xs uppercase tracking-widest text-muted-foreground">Settings</div>
        <h1 className="mt-1 font-display text-4xl">Personalize EcoMind</h1>
      </div>

      <div className="mt-8 space-y-4">
        <Section title="Theme" icon={settings.theme === "dark" ? Moon : Sun}>
          <div className="grid grid-cols-2 gap-2">
            {(["light", "dark"] as const).map((t) => (
              <button
                key={t}
                onClick={() => update({ theme: t })}
                className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm capitalize transition ${
                  settings.theme === t
                    ? "border-leaf bg-leaf/10 text-leaf"
                    : "hover:bg-accent"
                }`}
              >
                {t === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                {t}
              </button>
            ))}
          </div>
        </Section>

        <Section title="Accent color" icon={Palette}>
          <div className="flex flex-wrap gap-2">
            {ACCENTS.map((a) => (
              <button
                key={a.name}
                onClick={() => update({ accent: a.name })}
                className={`grid h-10 w-10 place-items-center rounded-full border-2 transition ${
                  settings.accent === a.name ? "border-foreground scale-110" : "border-transparent"
                }`}
                style={{ background: a.value }}
                aria-label={a.name}
              >
                {settings.accent === a.name && <Check className="h-4 w-4 text-white" />}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Accent selection is saved for future theming.
          </p>
        </Section>

        <Section title="Offline mode" icon={WifiOff}>
          <label className="flex items-center justify-between gap-4 rounded-xl border bg-background p-4">
            <div>
              <div className="text-sm font-medium">Answer only from local knowledge base</div>
              <div className="text-xs text-muted-foreground">
                Fast, private, and works without internet. Skips the AI call.
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.offlineOnly}
              onChange={(e) => update({ offlineOnly: e.target.checked })}
              className="h-5 w-5 accent-leaf"
            />
          </label>
        </Section>

        <Section title="Data" icon={Trash2}>
          <button
            onClick={clearHistory}
            className="inline-flex items-center gap-2 rounded-xl border border-destructive/40 bg-destructive/5 px-4 py-2.5 text-sm text-destructive transition hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
            Clear conversation history
          </button>
        </Section>

        {saved && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 rounded-full leaf-gradient px-4 py-2 text-xs font-medium text-leaf-foreground shadow-glow">
            Saved
          </div>
        )}
      </div>
    </main>
  );
}

function Section({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border bg-card p-6 shadow-card">
      <div className="mb-4 flex items-center gap-2">
        <Icon className="h-4 w-4 text-leaf" />
        <div className="text-sm font-semibold">{title}</div>
      </div>
      {children}
    </div>
  );
}
