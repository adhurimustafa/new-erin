import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowDown, ArrowLeft, ArrowUp, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatDate, useBriefs } from "../data";
import { CATEGORIES, useAssets } from "../assets";
import { EmptyState, ErrorLine, Loading } from "../components/Bits";
import { BriefAssetRefs } from "../brief/BriefAssetRefs";
import { STRUCTURE_STATUS, useAssetsFingerprint, useSaveAdjustments, useStructure } from "./data";
import { RecalcButton } from "./StructurePanel";
import type { Adjustments } from "./rules";

const move = <T,>(a: T[], i: number, d: number) => { const b = [...a]; const j = i + d; if (j < 0 || j >= b.length) return a; [b[i], b[j]] = [b[j], b[i]]; return b; };

export default function StructurePage() {
  const { id } = useParams();
  const { data: s, isLoading, error } = useStructure(id);
  const { data: briefs } = useBriefs(s?.project_id);
  const { data: fp } = useAssetsFingerprint(s?.project_id);
  const { data: assets } = useAssets(s?.project_id);
  const save = useSaveAdjustments();
  const [adj, setAdj] = useState<Adjustments>();
  const [confirm, setConfirm] = useState(false);
  useEffect(() => { if (s) setAdj(s.structure); }, [s]);
  const dirty = useMemo(() => !!s && !!adj && JSON.stringify(adj) !== JSON.stringify(s.structure), [s, adj]);

  if (isLoading) return <div className="studio-page"><Loading /></div>;
  if (error) return <div className="studio-page"><ErrorLine error={error} /></div>;
  if (!s || !adj) return <div className="studio-page"><EmptyState title="Proposition introuvable" text="Elle n’existe pas ou n’est pas accessible avec ce compte." /></div>;

  const g = s.generated; const editable = s.status === "draft";
  const pages = Object.fromEntries(g.pages.map(p => [p.id, p]));
  const newerBrief = briefs?.find(b => b.status === "validated" && b.version > s.project_briefs.version);
  const today = (assets ?? []).filter(a => a.status === "ready");
  const snapIds = new Set(s.assets_snapshot.map(a => a.id));
  const added = today.filter(a => !snapIds.has(a.id)).length;
  const gone = s.assets_snapshot.filter(a => !today.some(t => t.id === a.id)).length;
  const changed = fp !== undefined && fp !== s.assets_fingerprint;
  const set = (patch: Partial<Adjustments>) => setAdj({ ...adj, ...patch });
  const doSave = (validate = false) => save.mutate({ id: s.id, structure: adj, validate }, {
    onSuccess: () => { setConfirm(false); toast.success(validate ? "Structure validée : elle ne peut plus être modifiée." : "Ajustements enregistrés."); },
    onError: e => { setConfirm(false); toast.error(e.message); },
  });

  return (
    <div className="studio-page">
      <Link to={`/studio/projets/${s.project_id}`} className="studio-back"><ArrowLeft aria-hidden="true" />{s.projects?.name ?? "Projet"}</Link>
      <header className="studio-page-head studio-head-row">
        <div>
          <p className="eyebrow">Structure recommandée</p>
          <h1 className="studio-h1">Proposition {s.version}</h1>
          <p className="studio-client-line">Basée sur le <Link to={`/studio/briefs/${s.brief_id}`}>brief version {s.project_briefs.version}</Link> · règles v{s.rules_version} · calculée le {formatDate(s.created_at)}</p>
        </div>
        <span className={`studio-badge ${s.status === "validated" ? "status-ready" : "status-draft"}`}>{STRUCTURE_STATUS[s.status]}</span>
      </header>

      {!editable && <p className="studio-muted" role="note">{s.status === "validated" ? `Validée le ${formatDate(s.validated_at!)} : lecture seule.` : `Archivée le ${formatDate(s.archived_at!)} lors d’un recalcul : lecture seule.`}</p>}
      {(newerBrief || changed) && (
        <div className="structure-warn" role="status">
          {newerBrief && <p>Un brief plus récent est validé (version {newerBrief.version}). Cette proposition n’a pas été modifiée.</p>}
          {changed && <p>Les fichiers du projet ont changé depuis le calcul{added || gone ? ` (${added} ajouté(s), ${gone} retiré(s))` : " (remplacement, libellé ou catégorie modifiés)"}. Rien n’a été recalculé automatiquement.</p>}
          {s.status !== "archived" && <RecalcButton projectId={s.project_id} briefId={newerBrief?.id ?? s.brief_id} label="Recalculer" />}
        </div>
      )}

      <section className="studio-panel" aria-labelledby="nav-title">
        <h2 id="nav-title" className="studio-h2">Pages et navigation</h2>
        <p className="studio-muted">{g.navigation_note}</p>
        <ol className="structure-pages">
          {adj.page_order.map((pid, pi) => {
            const p = pages[pid]; const order = adj.section_order[pid];
            return (
              <li key={pid} className="structure-page">
                <div className="structure-page-head">
                  {editable ? <Input aria-label={`Nom de la page ${p.title}`} value={adj.page_titles[pid]} maxLength={80} onChange={e => set({ page_titles: { ...adj.page_titles, [pid]: e.target.value } })} />
                    : <h3 className="studio-h3">{adj.page_titles[pid]}</h3>}
                  <span className={`brief-tag ${p.essential ? "is-important" : ""}`}>{p.essential ? "Essentielle" : "Facultative"}</span>
                  {editable && <span className="structure-moves">
                    <Button size="icon" variant="ghost" aria-label={`Monter la page ${adj.page_titles[pid]}`} disabled={pi === 0} onClick={() => set({ page_order: move(adj.page_order, pi, -1) })}><ArrowUp /></Button>
                    <Button size="icon" variant="ghost" aria-label={`Descendre la page ${adj.page_titles[pid]}`} disabled={pi === adj.page_order.length - 1} onClick={() => set({ page_order: move(adj.page_order, pi, 1) })}><ArrowDown /></Button>
                  </span>}
                </div>
                <p className="studio-help">{p.reason}</p>
                <ul className="structure-sections">
                  {order.map((sid, si) => {
                    const sc = p.sections.find(x => x.id === sid)!; const key = `${pid}/${sid}`; const hidden = adj.hidden.includes(key);
                    return (
                      <li key={sid} className={`structure-section ${hidden ? "is-hidden" : ""}`}>
                        <div className="structure-section-head">
                          <span className="studio-row-title">{sc.title}</span>
                          <span className={`brief-tag ${sc.essential ? "is-important" : ""}`}>{sc.essential ? "Essentielle" : "Facultative"}</span>
                          {sc.future && <span className="brief-tag">À prévoir</span>}
                          {hidden && <span className="brief-tag">Masquée</span>}
                          {editable && <span className="structure-moves">
                            {!sc.essential && <Button size="icon" variant="ghost" aria-label={`${hidden ? "Réafficher" : "Masquer"} la section ${sc.title}`} onClick={() => set({ hidden: hidden ? adj.hidden.filter(h => h !== key) : [...adj.hidden, key] })}>{hidden ? <Eye /> : <EyeOff />}</Button>}
                            <Button size="icon" variant="ghost" aria-label={`Monter la section ${sc.title}`} disabled={si === 0} onClick={() => set({ section_order: { ...adj.section_order, [pid]: move(order, si, -1) } })}><ArrowUp /></Button>
                            <Button size="icon" variant="ghost" aria-label={`Descendre la section ${sc.title}`} disabled={si === order.length - 1} onClick={() => set({ section_order: { ...adj.section_order, [pid]: move(order, si, 1) } })}><ArrowDown /></Button>
                          </span>}
                        </div>
                        <p className="studio-help">{sc.reason}</p>
                        {sc.needs.length > 0 && <ul className="structure-needs">{sc.needs.map(n => <li key={n}>{n}</li>)}</ul>}
                      </li>
                    );
                  })}
                </ul>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="studio-panel" aria-labelledby="cta-title">
        <h2 id="cta-title" className="studio-h2">Action principale (CTA)</h2>
        <p className="studio-muted">{g.cta_reason}</p>
        {editable ? (
          <select aria-label="Action principale" className="studio-select" value={adj.cta} onChange={e => set({ cta: e.target.value })}>
            {g.cta_options.filter(o => o.compatible).map(o => <option key={o.key} value={o.key}>{o.label} — {o.note}</option>)}
          </select>
        ) : <p>{g.cta_options.find(o => o.key === adj.cta)?.label}</p>}
        <ul className="structure-needs">{g.cta_options.filter(o => !o.compatible).map(o => <li key={o.key}>{o.label} : indisponible — {o.note}</li>)}</ul>
      </section>

      {editable && (
        <div className="studio-actions structure-bar">
          <Button variant="outline" disabled={!dirty || save.isPending} onClick={() => setAdj(s.structure)}>Annuler les changements</Button>
          <Button variant="outline" disabled={!dirty || save.isPending} onClick={() => doSave()}>Enregistrer</Button>
          <Button disabled={save.isPending} onClick={() => setConfirm(true)}>Valider la structure</Button>
        </div>
      )}

      <div className="structure-grid">
        <section className="studio-panel" aria-labelledby="miss-title">
          <h2 id="miss-title" className="studio-h2">Informations manquantes</h2>
          {g.missing.length ? <ul className="structure-needs">{g.missing.map(m => <li key={m.label}>{m.label} <span className="studio-muted">· {m.level}</span></li>)}</ul> : <p className="studio-muted">Aucune.</p>}
        </section>
        <section className="studio-panel" aria-labelledby="prep-title">
          <h2 id="prep-title" className="studio-h2">Contenus à préparer</h2>
          {g.to_prepare.length ? <ul className="structure-needs">{g.to_prepare.map(m => <li key={m}>{m}</li>)}</ul> : <p className="studio-muted">Aucun contenu marqué « À produire ».</p>}
          {g.future_features.length > 0 && <><h3 className="studio-h3">Fonctionnalités à prévoir (non opérationnelles)</h3><ul className="structure-needs">{g.future_features.map(m => <li key={m}>{m}</li>)}</ul></>}
        </section>
      </div>

      <div className="structure-grid">
        <section className="studio-panel" aria-labelledby="snap-title">
          <h2 id="snap-title" className="studio-h2">Fichiers au moment du calcul</h2>
          <p className="studio-muted">Relevé figé des fichiers prêts (métadonnées seulement). Une catégorie remplie signale une disponibilité possible, pas un contenu adapté.</p>
          {s.assets_snapshot.length ? <ul className="structure-needs">{s.assets_snapshot.map(a => <li key={a.id}>{a.label} · {CATEGORIES[a.category]}</li>)}</ul> : <p className="studio-muted">Aucun fichier.</p>}
        </section>
        <section className="studio-panel" aria-labelledby="today-title">
          <h2 id="today-title" className="studio-h2">Fichiers disponibles aujourd’hui</h2>
          <p className="studio-muted">{changed ? "Différent du relevé du calcul." : "Identique au relevé du calcul."}</p>
          {today.length ? <ul className="structure-needs">{today.map(a => <li key={a.id}>{a.label} · {CATEGORIES[a.category]}</li>)}</ul> : <p className="studio-muted">Aucun fichier.</p>}
        </section>
      </div>
      <BriefAssetRefs briefId={s.brief_id} />

      <Dialog open={confirm} onOpenChange={setConfirm}>
        <DialogContent className="studio-dialog">
          <DialogHeader><DialogTitle>Valider la structure ?</DialogTitle>
            <DialogDescription>Les ajustements en cours seront enregistrés puis figés. Une proposition validée n’est plus modifiable ; un recalcul créera une nouvelle proposition.</DialogDescription></DialogHeader>
          <DialogFooter><Button variant="outline" onClick={() => setConfirm(false)}>Annuler</Button><Button disabled={save.isPending} onClick={() => doSave(true)}>Valider</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
