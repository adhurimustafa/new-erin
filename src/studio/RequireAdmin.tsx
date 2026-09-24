import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStudioAuth } from "./auth";

export function RequireAdmin({ children }: { children: ReactNode }) {
  const { session, loading, role, signOut } = useStudioAuth();
  const location = useLocation();

  if (loading || (session && (role === "checking" || role === "unknown"))) {
    return <div className="studio-center" role="status" aria-live="polite"><p className="studio-muted">Vérification de l’accès…</p></div>;
  }
  if (!session) return <Navigate to="/studio/connexion" replace state={{ from: location.pathname }} />;
  if (role !== "admin") {
    return (
      <div className="studio-center">
        <div className="studio-auth-card" role="alert">
          <ShieldAlert className="studio-icon-warn" aria-hidden="true" />
          <h1 className="studio-auth-title">Accès refusé</h1>
          <p className="studio-muted">Ce compte n’a pas l’autorisation d’accéder au Studio.</p>
          <Button onClick={signOut} variant="outline" className="w-full">Se déconnecter</Button>
        </div>
      </div>
    );
  }
  return <>{children}</>;
}
