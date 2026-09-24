import { useState, type FormEvent } from "react";
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/logo-tadam-header.png";
import { useStudioAuth } from "../auth";

export default function Login() {
  const { session, loading } = useStudioAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (!loading && session) return <Navigate to="/studio" replace />;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true); setError(null);
    const { error: err } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (err) setError(err.message.toLowerCase().includes("confirm") ? "Adresse email pas encore confirmée. Ouvrez le lien reçu par email." : "Email ou mot de passe incorrect.");
  };

  return (
    <div className="studio-center">
      <form className="studio-auth-card" onSubmit={submit} noValidate>
        <img src={logo} alt="TADAM" className="studio-auth-logo" width="905" height="602" />
        <h1 className="studio-auth-title">Connexion au Studio</h1>
        <p className="studio-muted">Espace privé réservé à l’administrateur.</p>
        <div className="studio-field"><Label htmlFor="email">Email</Label><Input id="email" type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} /></div>
        <div className="studio-field"><Label htmlFor="password">Mot de passe</Label><Input id="password" type="password" autoComplete="current-password" required value={password} onChange={e => setPassword(e.target.value)} /></div>
        {error && <p className="studio-error" role="alert">{error}</p>}
        <Button type="submit" className="w-full" disabled={busy || !email || !password}>{busy ? "Connexion…" : "Se connecter"}</Button>
        <a href="/" className="studio-link">Retour au site public</a>
      </form>
    </div>
  );
}
