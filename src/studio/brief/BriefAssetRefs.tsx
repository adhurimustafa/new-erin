import { useBriefRefs, CATEGORIES } from "../assets";
import { formatDate } from "../data";

/** Explicit file references of a brief version. Historical list vs. current state are shown separately. */
export function BriefAssetRefs({ briefId }: { briefId: string }) {
  const { data } = useBriefRefs(briefId);
  if (!data?.length) return null;
  return (
    <section className="studio-panel" aria-labelledby="refs-title">
      <h2 id="refs-title" className="studio-h2">Fichiers référencés par cette version</h2>
      <ul className="studio-list">
        {data.map(r => r.project_assets && (
          <li key={r.project_assets.id} className="studio-row">
            <span className="studio-row-main"><span className="studio-row-title">{r.project_assets.label}</span>
              <span className="studio-row-meta">{CATEGORIES[r.project_assets.category]}</span></span>
            <span className="studio-row-meta">État actuel : {r.project_assets.status === "removed"
              ? `fichier retiré depuis${r.project_assets.removed_at ? ` (le ${formatDate(r.project_assets.removed_at)})` : ""}`
              : "présent dans la médiathèque"}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
