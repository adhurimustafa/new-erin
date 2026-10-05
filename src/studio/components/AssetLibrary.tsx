/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { FileText, Download, Pencil, Trash2, UploadCloud, RotateCcw, Link2, Film } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import {
  ACCEPT_ATTR, CATEGORIES, CONCURRENCY, KINDS, MAX_FILES, formatSize, guessCategory, precheck, signedDownloadUrl, uploadAsset,
  useAssetMaintenance, useAssetRefs, useAssets, useDeleteAsset, useSignedUrls, useToggleRef, useUpdateAsset,
  type Asset, type AssetCategory, type UploadState,
} from "../assets";
import { useBriefs } from "../data";
import { useQueryClient } from "@tanstack/react-query";
import { EmptyState, ErrorLine, Loading } from "./Bits";

const PHASE: Record<UploadState["phase"], string> = { queued: "En attente", uploading: "Envoi", checking: "Vérification serveur…", done: "Ajouté", rejected: "Refusé", error: "Interrompu" };

export function AssetLibrary({ projectId, locked }: { projectId: string; locked?: boolean }) {
  const qc = useQueryClient();
  const maint = useAssetMaintenance(projectId);
  const { data: assets, isLoading, error } = useAssets(projectId);
  const { data: urls } = useSignedUrls(assets ?? []);
  const { data: refs } = useAssetRefs(projectId);
  const { data: briefs } = useBriefs(projectId);
  const draft = briefs?.find(b => b.status === "draft");
  const [uploads, setUploads] = useState<UploadState[]>([]);
  const [drag, setDrag] = useState(false);
  const [cat, setCat] = useState<string>("all");
  const [kind, setKind] = useState<string>("all");
  const [editing, setEditing] = useState<Asset | null>(null);
  const [deleting, setDeleting] = useState<Asset | null>(null);
  const input = useRef<HTMLInputElement>(null);
  const del = useDeleteAsset();
  const toggle = useToggleRef();

  const patch = (key: string, p: Partial<UploadState>) => setUploads(list => list.map(u => u.key === key ? { ...u, ...p } : u));
  const refresh = () => ["assets", "asset-urls", "asset-refs"].forEach(k => qc.invalidateQueries({ queryKey: [k] }));

  async function runQueue(items: UploadState[]) {
    const queue = [...items];
    const worker = async () => {
      for (let u = queue.shift(); u; u = queue.shift()) {
        const cur = u;
        patch(cur.key, { phase: "uploading", progress: 0, message: undefined });
        try {
          const id = await uploadAsset(projectId, cur, (progress, phase) => patch(cur.key, { progress, ...(phase ? { phase } : {}) }));
          patch(cur.key, { phase: "done", assetId: id, progress: 100 });
        } catch (e) {
          const assetId = (e as any).assetId as string | undefined;
          const checking = !assetId; // finalize errors have no assetId attached
          patch(cur.key, { phase: checking ? "rejected" : "error", message: (e as Error).message, assetId: checking ? undefined : assetId });
        }
      }
    };
    await Promise.all(Array.from({ length: CONCURRENCY }, worker));
    refresh();
  }

  function addFiles(list: FileList | File[]) {
    if (locked) return;
    const files = Array.from(list);
    if (files.length > MAX_FILES) { toast.error(`${MAX_FILES} fichiers maximum par sélection.`); return; }
    const items: UploadState[] = files.map((file, i) => {
      const bad = precheck(file);
      return { key: `${Date.now()}-${i}-${file.name}`, file, label: file.name.replace(/\.[^.]+$/, "").slice(0, 150), category: guessCategory(file),
        progress: 0, phase: bad ? "rejected" : "queued", message: bad ?? undefined };
    });
    setUploads(u => [...items, ...u]);
    runQueue(items.filter(i => i.phase === "queued"));
  }

  const shown = useMemo(() => (assets ?? []).filter(a => (cat === "all" || a.category === cat) && (kind === "all" || a.kind === kind)), [assets, cat, kind]);
  const refsOf = (id: string) => (refs ?? []).filter(r => r.asset_id === id);

  return (
    <section aria-labelledby="assets-title" className="studio-assets">
      <div className="studio-head-row studio-section-head">
        <h2 id="assets-title" className="studio-h2">Médiathèque du projet</h2>
      </div>
      <p className="studio-help">JPG, PNG, WebP (15 Mo), PDF (25 Mo), MP4 (200 Mo). {MAX_FILES} fichiers max. par sélection. Fichiers privés, consultés par liens temporaires. Le contenu réel est vérifié par le serveur. Les envois inachevés de plus de 24 h sont nettoyés à la prochaine ouverture de cette médiathèque.</p>
      {maint.data && (maint.data.cleaned > 0 || maint.data.resumed > 0) && <p className="studio-help" role="status">Nettoyage : {maint.data.cleaned} envoi(s) inachevé(s) retiré(s), {maint.data.resumed} suppression(s) reprise(s).</p>}

      {locked ? <p className="studio-error" role="alert">Suppression du projet en cours : aucun nouvel envoi possible.</p> : (
        <div className={`asset-drop${drag ? " is-drag" : ""}`}
          onDragOver={e => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)}
          onDrop={e => { e.preventDefault(); setDrag(false); if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files); }}>
          <UploadCloud aria-hidden="true" />
          <p>Glissez vos fichiers ici ou</p>
          <Button type="button" variant="outline" onClick={() => input.current?.click()}>Choisir des fichiers</Button>
          <input ref={input} type="file" multiple accept={ACCEPT_ATTR} className="sr-only" aria-label="Choisir des fichiers à ajouter"
            onChange={e => { if (e.target.files?.length) addFiles(e.target.files); e.target.value = ""; }} />
        </div>
      )}

      {uploads.length > 0 && (
        <ul className="asset-uploads" aria-label="Envois">
          {uploads.map(u => (
            <li key={u.key} className={`asset-upload is-${u.phase}`}>
              <div className="asset-upload-top"><span className="asset-upload-name">{u.file.name}</span><span>{PHASE[u.phase]}{u.phase === "uploading" ? ` ${u.progress} %` : ""}</span></div>
              {(u.phase === "uploading" || u.phase === "checking") && <progress max={100} value={u.progress} aria-label={`Progression ${u.file.name}`} />}
              {u.message && <p className="asset-upload-msg">{u.message}</p>}
              {u.phase === "error" && <Button size="sm" variant="outline" onClick={() => runQueue([u])}><RotateCcw aria-hidden="true" />Réessayer</Button>}
            </li>
          ))}
          {uploads.every(u => ["done", "rejected"].includes(u.phase)) && <li><Button size="sm" variant="ghost" onClick={() => setUploads([])}>Effacer la liste</Button></li>}
        </ul>
      )}

      <div className="studio-toolbar asset-filters">
        <label className="studio-field-inline">Catégorie
          <select value={cat} onChange={e => setCat(e.target.value)} className="studio-select">
            <option value="all">Toutes</option>{Object.entries(CATEGORIES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select></label>
        <label className="studio-field-inline">Type
          <select value={kind} onChange={e => setKind(e.target.value)} className="studio-select">
            <option value="all">Tous</option>{Object.entries(KINDS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select></label>
      </div>

      {isLoading ? <Loading /> : error ? <ErrorLine error={error} /> : !assets?.length ? (
        <EmptyState title="Aucun fichier" text="Ajoutez logos, photos, vidéos ou documents fournis par le client." />
      ) : !shown.length ? <p className="studio-muted">Aucun fichier pour ces filtres.</p> : (
        <ul className="asset-grid">
          {shown.map(a => {
            const url = urls?.[a.storage_path];
            const linked = draft && refsOf(a.id).some(r => r.brief_id === draft.id);
            return (
              <li key={a.id} className="asset-card">
                <div className="asset-thumb">
                  {a.status === "deleting" ? <span className="studio-muted">Suppression incomplète</span>
                    : a.kind === "image" && url ? <img src={url} alt={a.label} loading="lazy" />
                    : a.kind === "video" && url ? <VideoPreview url={a.storage_path ? url : ""} />
                    : <FileText aria-hidden="true" />}
                </div>
                <div className="asset-body">
                  <p className="asset-label" title={a.label}>{a.label}</p>
                  <p className="studio-row-meta">{CATEGORIES[a.category]} · {a.kind ? KINDS[a.kind] : "—"} · {formatSize(a.size_bytes)}</p>
                  {refsOf(a.id).length > 0 && <p className="studio-row-meta"><Link2 aria-hidden="true" className="inline h-3 w-3" /> Référencé par : {refsOf(a.id).map(r => `v${r.project_briefs.version}${r.project_briefs.status === "validated" ? " (validée)" : " (brouillon)"}`).join(", ")}</p>}
                </div>
                <div className="asset-actions">
                  {a.status === "deleting" ? (
                    <Button size="sm" variant="outline" disabled={del.isPending} onClick={() => del.mutate(a.id, { onSuccess: () => toast.success("Suppression terminée."), onError: e => toast.error(e.message) })}><RotateCcw aria-hidden="true" />Relancer</Button>
                  ) : <>
                    <Button size="sm" variant="ghost" aria-label={`Télécharger ${a.label}`} onClick={async () => { try { window.open(await signedDownloadUrl(a), "_blank", "noopener"); } catch (e) { toast.error((e as Error).message); } }}><Download aria-hidden="true" /></Button>
                    {a.kind === "pdf" && url && <Button size="sm" variant="ghost" asChild><a href={url} target="_blank" rel="noopener noreferrer">Ouvrir</a></Button>}
                    <Button size="sm" variant="ghost" aria-label={`Modifier ${a.label}`} onClick={() => setEditing(a)}><Pencil aria-hidden="true" /></Button>
                    <Button size="sm" variant="ghost" className="studio-danger-btn" aria-label={`Supprimer ${a.label}`} onClick={() => setDeleting(a)}><Trash2 aria-hidden="true" /></Button>
                  </>}
                </div>
                {draft && a.status === "ready" && (
                  <label className="asset-link"><input type="checkbox" checked={!!linked} disabled={toggle.isPending}
                    onChange={e => toggle.mutate({ briefId: draft.id, assetId: a.id, on: e.target.checked }, { onError: er => toast.error(er.message) })} />
                    Référencer dans le brouillon v{draft.version}</label>
                )}
              </li>
            );
          })}
        </ul>
      )}

      <EditAssetDialog asset={editing} onClose={() => setEditing(null)} />
      <AlertDialog open={!!deleting} onOpenChange={o => !o && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer « {deleting?.label} » ?</AlertDialogTitle>
            <AlertDialogDescription>Le fichier sera définitivement supprimé du stockage.</AlertDialogDescription>
          </AlertDialogHeader>
          {deleting && refsOf(deleting.id).some(r => r.project_briefs.status === "validated") && (
            <p className="studio-error" role="alert">Ce fichier est référencé par {refsOf(deleting.id).filter(r => r.project_briefs.status === "validated").map(r => `la version ${r.project_briefs.version}`).join(", ")} validée. Le brief restera inchangé et indiquera seulement « fichier retiré depuis » ; aucune copie n’est conservée.</p>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <Button variant="destructive" disabled={del.isPending} onClick={() => deleting && del.mutate(deleting.id, {
              onSuccess: () => { toast.success("Fichier supprimé."); setDeleting(null); },
              onError: e => { toast.error(e.message); setDeleting(null); },
            })}>{del.isPending ? "Suppression…" : "Supprimer définitivement"}</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}

function VideoPreview({ url }: { url: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <span className="asset-video-fail"><Film aria-hidden="true" />Lecture impossible dans ce navigateur (codec). Utilisez le téléchargement.</span>;
  return <video src={url} controls preload="metadata" onError={() => setFailed(true)} />;
}

function EditAssetDialog({ asset, onClose }: { asset: Asset | null; onClose: () => void }) {
  const upd = useUpdateAsset();
  const [label, setLabel] = useState(""); const [category, setCategory] = useState<AssetCategory>("other");
  const [openId, setOpenId] = useState<string | null>(null);
  if (asset && openId !== asset.id) { setOpenId(asset.id); setLabel(asset.label); setCategory(asset.category); }
  return (
    <Dialog open={!!asset} onOpenChange={o => { if (!o) { setOpenId(null); onClose(); } }}>
      <DialogContent className="studio-dialog">
        <DialogHeader><DialogTitle>Modifier le fichier</DialogTitle><DialogDescription>Seuls le libellé et la catégorie peuvent être modifiés.</DialogDescription></DialogHeader>
        <form className="studio-form" onSubmit={e => { e.preventDefault(); if (!asset) return; upd.mutate({ id: asset.id, label, category }, { onSuccess: () => { toast.success("Fichier mis à jour."); setOpenId(null); onClose(); }, onError: er => toast.error(er.message) }); }}>
          <div className="studio-field"><Label htmlFor="asset-label">Libellé</Label><Input id="asset-label" value={label} maxLength={150} onChange={e => setLabel(e.target.value)} required /></div>
          <div className="studio-field"><Label htmlFor="asset-cat">Catégorie</Label>
            <select id="asset-cat" className="studio-select" value={category} onChange={e => setCategory(e.target.value as AssetCategory)}>
              {Object.entries(CATEGORIES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select></div>
          <div className="studio-actions"><Button type="button" variant="outline" onClick={() => { setOpenId(null); onClose(); }}>Annuler</Button><Button type="submit" disabled={upd.isPending}>Enregistrer</Button></div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
