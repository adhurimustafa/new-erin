import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type RoleState = "unknown" | "checking" | "admin" | "denied";

interface StudioAuth {
  session: Session | null;
  loading: boolean;
  role: RoleState;
  signOut: () => Promise<void>;
}

const Ctx = createContext<StudioAuth | null>(null);

export function StudioAuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<RoleState>("unknown");

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
      setLoading(false);
    });
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setLoading(false);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  const userId = session?.user.id;
  useEffect(() => {
    if (!userId) { setRole("unknown"); return; }
    let active = true;
    setRole("checking");
    // Role is decided server-side: the function only grants admin to the allowlisted, confirmed email.
    supabase.rpc("claim_studio_admin").then(({ data, error }) => {
      if (!active) return;
      setRole(!error && data === true ? "admin" : "denied");
    });
    return () => { active = false; };
  }, [userId]);

  const signOut = useCallback(async () => { await supabase.auth.signOut(); }, []);

  return <Ctx.Provider value={{ session, loading, role, signOut }}>{children}</Ctx.Provider>;
}

export function useStudioAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useStudioAuth must be used inside StudioAuthProvider");
  return ctx;
}
