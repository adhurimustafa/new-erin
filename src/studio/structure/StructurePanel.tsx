import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatDate, useBriefs } from "../data";
import { EmptyState } from "../components/Bits";
import { STRUCTURE_STATUS, useComputeStructure, useStructures } from "./data";

/** Generate button. If a draft proposal exists, asks to archive it first (its adjustments are not carried over). */
export function RecalcButton({ projectId, briefId, label = "Générer la proposition" }: { projectId: string; briefId?: string; label?: string }) {
  const nav = useNavigate();
  const { data: list } = useStructures(projectId);
  const compute = useComputeStructure();
  const [ask, setAsk] = useState(false);
  const draft = list?.find(s => s.status === "draft");
  const run = () => briefId && compute.mutate({ briefId, replace: draft?.id }, {
    onSuccess: r => { setAsk(false); toast.success(`Proposition ${r.version} créée${r.archived ? " ; l’ancien brouillon est archivé" : ""}.`); nav(`/studio/structures/${r.id}`); },
    onError: e => { setAsk(false); toast.error(e.message); },
  });
  return (
    <>
      <Button disabled={!briefId || compute.isPending} onClick={() => (draft ? setAsk(true) : run())}>{compute.isPending ? "Calcul…" : label}</Button>
      <Dialog open={ask} onOpenChange={setAsk}>
        <DialogContent className="studio-dialog">
          <DialogHeader><DialogTitle>Recalculer la proposition ?</DialogTitle>
            <DialogDescription>La proposition en brouillon (version {draft?.version}) sera archivée : elle restera consultable mais ne sera plus modifiable, et ses ajustements ne seront pas repris dans la nouvelle proposition.</DialogDescription></DialogHeader>
          <DialogFooter><Button variant="outline" onClick={() => setAsk(false)}>Annuler</Button><Button disabled={compute.isPending} onClick={run}>Archiver et recalculer</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function StructurePanel({ projectId, locked }: { projectId: string; locked?: boolean }) {
  const { data: briefs } = useBriefs(projectId);
  const { data: list } = useStructures(projectId);
  const validated = (briefs ?? []).filter(b => b.status === "validated");
  const [briefId, setBriefId] = useState<string>();
  const chosen = briefId ?? validated[0]?.id;
  return (
    <section aria-labelledby="structure-title">
      <div className="studio-head-row studio-section-head">
        <h2 id="structure-title" className="studio-h2">Structure recommandée</h2>
        {validated.length > 0 && !locked && (
          <div className="studio-actions">
            {validated.length > 1 && (
              <label className="structure-inline">Brief
                <select className="studio-select" value={chosen} onChange={e => setBriefId(e.target.value)}>
                  {validated.map(b => <option key={b.id} value={b.id}>Version {b.version}</option>)}
                </select>
              </label>
            )}
            <RecalcButton projectId={projectId} briefId={chosen} />
          </div>
        )}
      </div>
      {!validated.length && <p className="studio-muted">Une structure peut être proposée une fois un brief validé.</p>}
      {list?.length ? (
        <ul className="studio-list">
          {list.map(s => (
            <li key={s.id}><Link to={`/studio/structures/${s.id}`} className="studio-row">
              <span className="studio-row-main"><span className="studio-row-title">Proposition {s.version} · brief v{s.project_briefs?.version}</span>
                <span className="studio-row-meta">{s.status === "validated" ? `Validée le ${formatDate(s.validated_at)}` : s.status === "archived" ? `Archivée le ${formatDate(s.archived_at)}` : `Brouillon · modifié le ${formatDate(s.updated_at)}`}</span></span>
              <span className={`studio-badge ${s.status === "validated" ? "status-ready" : "status-draft"}`}>{STRUCTURE_STATUS[s.status]}</span>
            </Link></li>
          ))}
        </ul>
      ) : validated.length ? <EmptyState title="Aucune proposition" text="La proposition s’appuie sur des règles par secteur, le brief validé et les fichiers présents. Elle ne crée aucun contenu." /> : null}
    </section>
  );
}
