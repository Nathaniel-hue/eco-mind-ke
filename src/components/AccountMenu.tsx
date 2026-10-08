import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { LogIn, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/use-auth";

export function AccountMenu() {
  const { user, profile, loading } = useAuth();
  const [open, setOpen] = useState(false);

  if (loading) return <div className="h-8 w-8" />;

  if (!user) {
    return (
      <Link
        to="/auth"
        className="ml-1 inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm transition-colors hover:bg-accent"
      >
        <LogIn className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Sign in</span>
      </Link>
    );
  }

  const name = profile?.display_name || user.email?.split("@")[0] || "You";
  const initial = name.charAt(0).toUpperCase();

  return (
    <div className="relative ml-1">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Account menu"
        className="grid h-8 w-8 place-items-center overflow-hidden rounded-full border bg-secondary text-sm font-medium"
      >
        {profile?.avatar_url ? (
          <img src={profile.avatar_url} alt={name} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
        ) : (
          initial
        )}
      </button>
      {open ? (
        <div className="absolute right-0 mt-2 w-56 rounded-2xl border bg-card p-3 shadow-card">
          <div className="truncate text-sm font-medium">{name}</div>
          <div className="truncate text-xs text-muted-foreground">{user.email}</div>
          <p className="mt-2 text-xs text-muted-foreground">Your history is saved to your account.</p>
          <button
            type="button"
            onClick={async () => {
              setOpen(false);
              await supabase.auth.signOut();
            }}
            className="mt-3 flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-accent"
          >
            <LogOut className="h-3.5 w-3.5" /> Sign out
          </button>
        </div>
      ) : null}
    </div>
  );
}
