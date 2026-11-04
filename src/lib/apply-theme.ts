import { loadSettings, normalizeAccent } from "./chat-storage";

/** Apply the accent hue as a CSS variable; all leaf/primary/chart colours follow it. */
export function applyAccentHue(hue: number) {
  if (typeof document === "undefined") return;
  document.documentElement.style.setProperty("--accent-h", String(normalizeAccent(hue)));
}

/** Read settings and apply both theme (light/dark) and accent hue. */
export function applyTheme() {
  if (typeof document === "undefined") return;
  const { theme, accent } = loadSettings();
  document.documentElement.classList.toggle("dark", theme === "dark");
  applyAccentHue(accent);
}

/** Current accent hue from the live CSS variable (for inline colours like charts). */
export function currentAccentHue(): number {
  if (typeof document === "undefined") return 150;
  const n = Number(document.documentElement.style.getPropertyValue("--accent-h"));
  return Number.isFinite(n) ? n : 150;
}
