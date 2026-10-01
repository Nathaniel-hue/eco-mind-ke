import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { stopSync, syncFromCloud } from "./cloud-sync";

export type Profile = { display_name: string | null; avatar_url: string | null };

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handle = (u: User | null) => {
      setUser(u);
      setLoading(false);
      if (u) {
        setTimeout(() => {
          void syncFromCloud(u.id);
          void supabase
            .from("profiles")
            .select("display_name, avatar_url")
            .eq("id", u.id)
            .maybeSingle()
            .then(({ data }) => setProfile(data));
        }, 0);
      } else {
        stopSync();
        setProfile(null);
      }
    };
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "TOKEN_REFRESHED") return;
      handle(session?.user ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  return { user, profile, loading };
}
