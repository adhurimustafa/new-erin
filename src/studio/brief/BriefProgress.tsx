import { Check } from "lucide-react";
import { STEPS } from "./config";

export const ALL_STEPS = ["Client", "Secteur", ...STEPS.map(s => s.title), "Vérification"];

/** current: index in ALL_STEPS. onJump allows going back to wizard steps (index >= 2). */
export function BriefProgress({ current, onJump, maxReached }: { current: number; onJump?: (i: number) => void; maxReached?: number }) {
  return (
    <nav aria-label="Progression du brief" className="brief-progress">
      <p className="brief-progress-text">Étape {current + 1} sur {ALL_STEPS.length} · {ALL_STEPS[current]}</p>
      <div className="brief-progress-bar" aria-hidden="true"><span style={{ width: `${((current + 1) / ALL_STEPS.length) * 100}%` }} /></div>
      <ol className="brief-steps">
        {ALL_STEPS.map((label, i) => {
          const done = i < current;
          const clickable = onJump && i >= 2 && i !== current && i <= (maxReached ?? current);
          const content = <><span className="brief-step-dot">{done ? <Check aria-hidden="true" /> : i + 1}</span><span className="brief-step-label">{label}</span></>;
          return (
            <li key={label} className={`${done ? "is-done" : ""}${i === current ? " is-current" : ""}`} aria-current={i === current ? "step" : undefined}>
              {clickable ? <button type="button" onClick={() => onJump!(i)}>{content}</button> : <span>{content}</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
