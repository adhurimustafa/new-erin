import { AlertTriangle, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { STEPS, displayValue, missingFields, visibleFields, type BriefData, type Field } from "./config";

const byKey = Object.fromEntries(STEPS.flatMap((s, i) => s.fields.map(f => [f.key, { f, step: i }]))) as Record<string, { f: Field; step: number }>;
const stepOf = (id: string) => STEPS.findIndex(s => s.id === id);

const SECTIONS: { title: string; step: number; keys?: string[]; stepId?: string }[] = [
  { title: "Entreprise", step: stepOf("business"), stepId: "business" },
  { title: "Objectif", step: stepOf("goal"), keys: ["main_goal", "main_goal_detail", "languages"] },
  { title: "Audience", step: stepOf("audience"), stepId: "audience" },
  { title: "Services / Produits", step: stepOf("offer"), stepId: "offer" },
  { title: "Fonctionnalités souhaitées", step: stepOf("goal"), keys: ["features"] },
  { title: "Style", step: stepOf("style"), stepId: "style" },
  { title: "CTA", step: stepOf("goal"), keys: ["primary_cta"] },
  { title: "Contenus disponibles", step: stepOf("content"), stepId: "content" },
];

export function BriefSummary({ data, sector, onEdit }: { data: BriefData; sector: string; onEdit?: (step: number) => void }) {
  const missing = missingFields(data, sector);
  return (
    <div className="brief-summary">
      {SECTIONS.map(sec => {
        const fields = sec.stepId ? visibleFields(STEPS[stepOf(sec.stepId)], sector) : sec.keys!.map(k => byKey[k].f);
        return (
          <section key={sec.title} className="brief-summary-block" aria-label={sec.title}>
            <div className="brief-summary-head">
              <h3>{sec.title}</h3>
              {onEdit && <Button type="button" size="sm" variant="ghost" onClick={() => onEdit(sec.step)}><Pencil aria-hidden="true" />Modifier<span className="sr-only"> : {sec.title}</span></Button>}
            </div>
            <dl className="brief-dl">
              {fields.map(f => {
                const v = displayValue(f, data[f.key]);
                return (
                  <div key={f.key}>
                    <dt>{f.label}</dt>
                    <dd>{v ? <span className="studio-pre">{v}</span> : f.importance === "optional"
                      ? <span className="studio-missing">Non renseigné (facultatif)</span>
                      : <span className="brief-unknown">Inconnu — {f.importance === "required" ? "obligatoire" : "important"}</span>}</dd>
                  </div>
                );
              })}
            </dl>
          </section>
        );
      })}
      <section className={`brief-summary-block brief-missing${missing.length ? "" : " is-ok"}`} aria-labelledby="missing-title">
        <div className="brief-summary-head"><h3 id="missing-title">{missing.length ? <><AlertTriangle aria-hidden="true" />Informations manquantes ({missing.length})</> : "Aucune information importante manquante"}</h3></div>
        {missing.length > 0 && (
          <ul className="brief-missing-list">
            {missing.map(m => (
              <li key={m.key}>
                <span>{m.label} <span className="studio-muted">· {m.stepTitle}</span></span>
                {onEdit && <Button type="button" size="sm" variant="ghost" onClick={() => onEdit(m.stepIndex)}>Compléter<span className="sr-only"> : {m.label}</span></Button>}
              </li>
            ))}
          </ul>
        )}
        <p className="studio-help">Ces éléments restent explicitement inconnus : ils ne seront jamais inventés.</p>
      </section>
    </div>
  );
}
