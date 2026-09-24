import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LANGUAGES, SECTORS, STATUSES, projectSchema, type Client, type Project, type ProjectInput } from "../data";

export function ProjectForm({ initial, clients, fixedClientId, busy, onSubmit, onCancel }: {
  initial?: Project | null; clients: Pick<Client, "id" | "company_name">[]; fixedClientId?: string; busy: boolean;
  onSubmit: (v: ProjectInput) => void; onCancel: () => void;
}) {
  const [values, setValues] = useState<ProjectInput>({
    name: initial?.name ?? "", client_id: initial?.client_id ?? fixedClientId ?? "", sector: initial?.sector ?? "other",
    languages: initial?.languages ?? ["sq"], status: initial?.status ?? "draft", description: initial?.description ?? "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const set = <K extends keyof ProjectInput>(k: K, v: ProjectInput[K]) => setValues(s => ({ ...s, [k]: v }));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const r = projectSchema.safeParse(values);
    if (!r.success) { setErrors(Object.fromEntries(r.error.issues.map(i => [String(i.path[0]), i.message]))); return; }
    setErrors({}); onSubmit(values);
  };
  const err = (k: string) => errors[k] && <p id={`p-${k}-err`} className="studio-field-error">{errors[k]}</p>;

  return (
    <form onSubmit={submit} noValidate className="studio-form">
      <div className="studio-form-grid">
        <div className="studio-field is-wide">
          <Label htmlFor="p-name">Nom du projet *</Label>
          <Input id="p-name" value={values.name} onChange={e => set("name", e.target.value)} aria-invalid={!!errors.name} aria-describedby={errors.name ? "p-name-err" : undefined} placeholder="Ex. Site vitrine 2026" />
          {err("name")}
        </div>
        <div className="studio-field">
          <Label htmlFor="p-client_id">Client *</Label>
          <select id="p-client_id" className="studio-select" value={values.client_id} disabled={!!fixedClientId} onChange={e => set("client_id", e.target.value)} aria-invalid={!!errors.client_id} aria-describedby={errors.client_id ? "p-client_id-err" : undefined}>
            <option value="">Choisir un client…</option>
            {clients.map(c => <option key={c.id} value={c.id}>{c.company_name}</option>)}
          </select>
          {err("client_id")}
        </div>
        <div className="studio-field">
          <Label htmlFor="p-sector">Secteur d’activité</Label>
          <select id="p-sector" className="studio-select" value={values.sector} onChange={e => set("sector", e.target.value)}>
            {Object.entries(SECTORS).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
          </select>
        </div>
        <div className="studio-field">
          <Label htmlFor="p-status">Statut</Label>
          <select id="p-status" className="studio-select" value={values.status} onChange={e => set("status", e.target.value as ProjectInput["status"])} aria-describedby="p-status-help">
            {Object.entries(STATUSES).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
          </select>
          <p id="p-status-help" className="studio-help">Statut de gestion uniquement : aucune mise en ligne n’est effectuée.</p>
        </div>
        <fieldset className="studio-field is-wide" aria-describedby={errors.languages ? "p-languages-err" : undefined}>
          <legend className="studio-legend">Langues du site *</legend>
          <div className="studio-chips">
            {Object.entries(LANGUAGES).map(([k, l]) => {
              const on = values.languages.includes(k);
              return (
                <label key={k} className={`studio-chip${on ? " is-on" : ""}`}>
                  <input type="checkbox" checked={on} onChange={() => set("languages", on ? values.languages.filter(x => x !== k) : [...values.languages, k])} />{l}
                </label>
              );
            })}
          </div>
          {err("languages")}
        </fieldset>
        <div className="studio-field is-wide">
          <Label htmlFor="p-description">Description <span className="studio-optional">(facultatif)</span></Label>
          <Textarea id="p-description" rows={4} value={values.description ?? ""} onChange={e => set("description", e.target.value)} />
          {err("description")}
        </div>
      </div>
      <div className="studio-form-actions">
        <Button type="button" variant="outline" onClick={onCancel}>Annuler</Button>
        <Button type="submit" disabled={busy}>{busy ? "Enregistrement…" : "Enregistrer"}</Button>
      </div>
    </form>
  );
}
