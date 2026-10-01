import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Leaf, Loader2 } from "lucide-react";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in or create an account — EcoMind" },
      { name: "description", content: "Create an EcoMind account to keep your history and settings on every device." },
      { property: "og:title", content: "Sign in to EcoMind" },
      { property: "og:description", content: "Keep your sustainability history and settings across browsers." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session) navigate({ to: "/", replace: true });
    });
    supabase.auth.getSession().then(({ data: d }) => {
      if (d.session) navigate({ to: "/", replace: true });
    });
    return () => data.subscription.unsubscribe();
  }, [navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setBusy(true);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin, data: { full_name: name } },
        });
        if (error) throw error;
        if (!data.session) setInfo("Check your email and click the link to confirm your account.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  async function google() {
    setError(null);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) setError(result.error.message ?? "Google sign-in failed.");
  }

  return (
    <main className="mx-auto flex min-h-[80vh] max-w-md items-center px-5 py-16">
      <div className="w-full rounded-3xl border bg-card p-8 shadow-card">
        <div className="mb-6 flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-2xl leaf-gradient">
            <Leaf className="h-5 w-5 text-leaf-foreground" />
          </div>
          <h1 className="font-display text-2xl">
            {mode === "signin" ? "Welcome back" : "Create your account"}
          </h1>
        </div>
        <p className="mb-6 text-sm text-muted-foreground">
          Your history and settings are saved to your account, so they follow you to any browser.
        </p>

        <button
          type="button"
          onClick={google}
          className="flex w-full items-center justify-center gap-2 rounded-xl border bg-background px-4 py-2.5 text-sm font-medium transition-colors hover:bg-accent"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden>
            <path fill="#4285F4" d="M22.6 12.2c0-.8-.1-1.5-.2-2.2H12v4.2h5.9a5 5 0 0 1-2.2 3.3v2.7h3.6c2.1-1.9 3.3-4.8 3.3-8z" />
            <path fill="#34A853" d="M12 23c3 0 5.5-1 7.3-2.7l-3.6-2.7c-1 .7-2.2 1.1-3.7 1.1-2.9 0-5.3-1.9-6.2-4.5H2.1v2.8A11 11 0 0 0 12 23z" />
            <path fill="#FBBC05" d="M5.8 14.2a6.6 6.6 0 0 1 0-4.3V7.1H2.1a11 11 0 0 0 0 9.9l3.7-2.8z" />
            <path fill="#EA4335" d="M12 5.4c1.6 0 3.1.6 4.2 1.7l3.2-3.2A11 11 0 0 0 2.1 7.1l3.7 2.8C6.7 7.3 9.1 5.4 12 5.4z" />
          </svg>
          Continue with Google
        </button>

        <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
          <div className="h-px flex-1 bg-border" /> or use email <div className="h-px flex-1 bg-border" />
        </div>

        <form onSubmit={onSubmit} className="space-y-3">
          {mode === "signup" ? (
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full rounded-xl border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          ) : null}
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full rounded-xl border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full rounded-xl border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          {info ? <p className="text-sm text-leaf">{info}</p> : null}
          <button
            type="submit"
            disabled={busy}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-muted-foreground">
          {mode === "signin" ? "New here?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() => {
              setMode(mode === "signin" ? "signup" : "signin");
              setError(null);
              setInfo(null);
            }}
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            {mode === "signin" ? "Create an account" : "Sign in"}
          </button>
        </p>
      </div>
    </main>
  );
}
