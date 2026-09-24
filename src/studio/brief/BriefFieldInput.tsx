import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Check } from "lucide-react";
import { isFilled, type BriefValue, type Field } from "./config";

const IMPORTANCE = { required: "Obligatoire", important: "Important", optional: "Facultatif" } as const;

export function ImportanceTag({ field, value }: { field: Field; value: BriefValue | undefined }) {
  if (isFilled(value)) return <span className="brief-tag is-done"><Check aria-hidden="true" />Renseigné</span>;
  return <span className={`brief-tag is-${field.importance}`}>{IMPORTANCE[field.importance]}</span>;
}

export function BriefFieldInput({ field, value, error, onChange }: { field: Field; value: BriefValue | undefined; error?: string; onChange: (v: BriefValue) => void }) {
  const id = `f-${field.key}`;
  const describedBy = [field.help && `${id}-help`, error && `${id}-err`].filter(Boolean).join(" ") || undefined;
  const label = <span className="brief-label-row"><span>{field.label}</span><ImportanceTag field={field} value={value} /></span>;

  if (field.type === "multi" || field.type === "select" || field.type === "availability") {
    const multi = field.type === "multi";
    const current = multi ? (Array.isArray(value) ? value : []) : (typeof value === "string" ? value : "");
    return (
      <fieldset className="studio-field is-wide" aria-describedby={describedBy} aria-invalid={!!error}>
        <legend className="studio-legend brief-legend">{label}</legend>
        <div className="studio-chips" role={multi ? "group" : "radiogroup"}>
          {Object.entries(field.options ?? {}).map(([k, l]) => {
            const on = multi ? (current as string[]).includes(k) : current === k;
            return (
              <label key={k} className={`studio-chip${on ? " is-on" : ""}`}>
                <input type={multi ? "checkbox" : "radio"} name={id} checked={on} onChange={() => {
                  if (multi) onChange(on ? (current as string[]).filter(x => x !== k) : [...(current as string[]), k]);
                  else onChange(on ? "" : k);
                }} onClick={e => { if (!multi && on) { e.preventDefault(); onChange(""); } }} />{l}
              </label>
            );
          })}
        </div>
        {field.help && <p id={`${id}-help`} className="studio-help">{field.help}</p>}
        {error && <p id={`${id}-err`} className="studio-field-error">{error}</p>}
      </fieldset>
    );
  }
  const str = typeof value === "string" ? value : "";
  return (
    <div className="studio-field is-wide">
      <label htmlFor={id} className="text-sm font-medium">{label}</label>
      {field.type === "textarea"
        ? <Textarea id={id} rows={3} maxLength={4000} value={str} placeholder={field.placeholder} aria-describedby={describedBy} aria-invalid={!!error} onChange={e => onChange(e.target.value)} />
        : <Input id={id} maxLength={500} value={str} placeholder={field.placeholder} aria-describedby={describedBy} aria-invalid={!!error} onChange={e => onChange(e.target.value)} />}
      {field.help && <p id={`${id}-help`} className="studio-help">{field.help}</p>}
      {error && <p id={`${id}-err`} className="studio-field-error">{error}</p>}
    </div>
  );
}
