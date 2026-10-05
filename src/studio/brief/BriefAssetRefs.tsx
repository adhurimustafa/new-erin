import { useBriefRefs, CATEGORIES } from "../assets";
import { formatDate } from "../data";

/** Explicit file references of a brief version. Frozen metadata (as validated) vs. current state are shown separately. */
export function BriefAssetRefs({ briefId }: { briefId: string }) {
  const { data } = useBriefRefs(briefId);
  if (!data?.length) return null;
  return (
    <section className="studio-panel" aria-labelledby="refs-title">
      <h2 id="refs-title" className="studio-h2">Fichiers référencés par cette version</h2>
      <p className="studio-muted">Libellé et catégorie tels qu’enregistrés à la validation. L’état actuel de la médiathèque est indiqué à part.</p>
      <ul className="studio-list">
        {data.map(r => {
          const a = r.project_assets;
          const label = r.label_snapshot ?? a?.label ?? "Fichier";
          const cat = r.category_snapshot ?? a?.category;
          const renamed = a && a.status !== "removed" && (a.label !== label || a.category !== cat);
          return (
            <li key={r.asset_id} className="studio-row">
              <span className="studio-row-main"><span className="studio-row-title">{label}</span>
                <span className="studio-row-meta">{cat ? CATEGORIES[cat] : "—"}{r.original_name_snapshot ? ` · ${r.original_name_snapshot}` : ""}</span></span>
              <span className="studio-row-meta">État actuel : {!a || a.status === "removed"
                ? `fichier retiré depuis${a?.removed_at ? ` (le ${formatDate(a.removed_at)})` : ""} — non disponible`
                : `présent dans la médiathèque${renamed ? ` (aujourd’hui : ${a.label} · ${CATEGORIES[a.category]})` : ""}`}</span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
