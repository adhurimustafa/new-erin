import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/logo-tadam-header.png";

// Temporary one-time page: lets the owner create the admin password himself.
// Server-side, the admin role is only granted to the allowlisted confirmed email,
// and public sign-up is disabled right after this account exists.
const ADMIN_EMAIL = "adhurimustafa@gmail.com";

export default function Activation() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (busy) return;
    if (password.length < 12) return setError("Le mot de passe doit contenir au moins 12 caractères.");
    if (password !== confirm) return setError("Les deux mots de passe ne correspondent pas.");
    setBusy(true); setError(null);
    const { error: err } = await supabase.auth.signUp({ email: ADMIN_EMAIL, password, options: { emailRedirectTo: `${window.location.origin}/studio` } });
    setBusy(false);
    if (err) setError(err.message.toLowerCase().includes("pwned") || err.message.toLowerCase().includes("weak") ? "Ce mot de passe est trop faible ou déjà apparu dans une fuite de données. Choisissez-en un autre." : "La création du compte n’a pas abouti. Réessayez.");
    else setSent(true);
  };

  return (
    <div className="studio-center">
      {sent ? (
        <div className="studio-auth-card" role="status">
          <img src={logo} alt="TADAM" className="studio-auth-logo" width="905" height="602" />
          <h1 className="studio-auth-title">Vérifiez votre boîte email</h1>
          <p className="studio-muted">Un lien de confirmation a été envoyé à {ADMIN_EMAIL}. Ouvrez-le pour activer le compte, puis connectez-vous au Studio.</p>
        </div>
      ) : (
        <form className="studio-auth-card" onSubmit={submit} noValidate>
          <img src={logo} alt="TADAM" className="studio-auth-logo" width="905" height="602" />
          <h1 className="studio-auth-title">Création du compte administrateur</h1>
          <p className="studio-muted">Étape unique. Cette page sera fermée dès que votre compte existera.</p>
          <div className="studio-field"><Label htmlFor="admin-email">Email</Label><Input id="admin-email" type="email" value={ADMIN_EMAIL} readOnly /></div>
          <div className="studio-field"><Label htmlFor="new-password">Mot de passe (12 caractères minimum)</Label><Input id="new-password" type="password" autoComplete="new-password" value={password} onChange={e => setPassword(e.target.value)} /></div>
          <div className="studio-field"><Label htmlFor="confirm-password">Confirmer le mot de passe</Label><Input id="confirm-password" type="password" autoComplete="new-password" value={confirm} onChange={e => setConfirm(e.target.value)} /></div>
          {error && <p className="studio-error" role="alert">{error}</p>}
          <Button type="submit" className="w-full" disabled={busy}>{busy ? "Création…" : "Créer mon compte"}</Button>
        </form>
      )}
    </div>
  );
}
