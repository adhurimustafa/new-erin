import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { clientSchema, type Client, type ClientInput } from "../data";

const fields: { key: keyof ClientInput; label: string; type?: string; placeholder?: string; area?: boolean; required?: boolean }[] = [
  { key: "company_name", label: "Nom de l’entreprise", required: true },
  { key: "contact_name", label: "Nom du contact" },
  { key: "email", label: "Email", type: "email" },
  { key: "phone", label: "Téléphone", type: "tel", placeholder: "Avec indicatif pays" },
  { key: "location", label: "Adresse / localisation" },
  { key: "website", label: "Site actuel", type: "url", placeholder: "https://" },
  { key: "socials", label: "Réseaux sociaux", area: true, placeholder: "Un lien par ligne" },
  { key: "notes", label: "Notes internes", area: true },
];

export function ClientForm({ initial, busy, onSubmit, onCancel }: { initial?: Client | null; busy: boolean; onSubmit: (v: ClientInput) => void; onCancel: () => void }) {
  const [values, setValues] = useState<ClientInput>(() => Object.fromEntries(fields.map(f => [f.key, (initial?.[f.key] as string | null) ?? ""])) as ClientInput);
  const [errors, setErrors] = useState<Partial<Record<keyof ClientInput, string>>>({});

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const r = clientSchema.safeParse(values);
    if (!r.success) {
      setErrors(Object.fromEntries(r.error.issues.map(i => [i.path[0], i.message])));
      return;
    }
    setErrors({});
    onSubmit(values);
  };

  return (
    <form onSubmit={submit} noValidate className="studio-form">
      <div className="studio-form-grid">
        {fields.map(f => {
          const id = `client-${f.key}`;
          const err = errors[f.key];
          const common = { id, value: values[f.key] ?? "", "aria-invalid": !!err, "aria-describedby": err ? `${id}-err` : undefined,
            onChange: (e: { target: { value: string } }) => setValues(v => ({ ...v, [f.key]: e.target.value })), placeholder: f.placeholder };
          return (
            <div key={f.key} className={`studio-field${f.area ? " is-wide" : ""}`}>
              <Label htmlFor={id}>{f.label}{f.required ? " *" : <span className="studio-optional"> (facultatif)</span>}</Label>
              {f.area ? <Textarea rows={f.key === "notes" ? 5 : 3} {...common} /> : <Input type={f.type ?? "text"} {...common} />}
              {err && <p id={`${id}-err`} className="studio-field-error">{err}</p>}
            </div>
          );
        })}
      </div>
      <div className="studio-form-actions">
        <Button type="button" variant="outline" onClick={onCancel}>Annuler</Button>
        <Button type="submit" disabled={busy}>{busy ? "Enregistrement…" : "Enregistrer"}</Button>
      </div>
    </form>
  );
}
