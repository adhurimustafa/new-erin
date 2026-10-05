import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as tus from "tus-js-client";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Asset = Tables<"project_assets">;
export type AssetCategory = Asset["category"];
export const BUCKET = "project-assets";
const MB = 1024 * 1024;

export const CATEGORIES: Record<AssetCategory, string> = {
  logo: "Logo", photos: "Photos", videos: "Vidéos", documents: "Documents",
  menu_pricing: "Menu / Tarifs", portfolio: "Réalisations", other: "Autre",
};
export const KINDS: Record<string, string> = { image: "Image", video: "Vidéo", pdf: "PDF" };

/** Browser-side pre-check for user feedback only. The server re-checks the real bytes and size. */
const ACCEPT: Record<string, { kind: string; max: number; mime: string }> = {
  jpg: { kind: "image", max: 15 * MB, mime: "image/jpeg" }, jpeg: { kind: "image", max: 15 * MB, mime: "image/jpeg" },
  png: { kind: "image", max: 15 * MB, mime: "image/png" }, webp: { kind: "image", max: 15 * MB, mime: "image/webp" },
  pdf: { kind: "pdf", max: 25 * MB, mime: "application/pdf" }, mp4: { kind: "video", max: 200 * MB, mime: "video/mp4" },
};
export const ACCEPT_ATTR = ".jpg,.jpeg,.png,.webp,.pdf,.mp4,image/jpeg,image/png,image/webp,application/pdf,video/mp4";
export const MAX_FILES = 20;
export const CONCURRENCY = 3;

export function precheck(file: File): string | null {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  const rule = ACCEPT[ext];
  if (!rule) return "Format non accepté (JPG, PNG, WebP, PDF ou MP4).";
  if (file.size === 0) return "Fichier vide.";
  if (file.size > rule.max) return `Trop volumineux : ${rule.max / MB} Mo maximum pour ce format.`;
  return null;
}
export const guessCategory = (file: File): AssetCategory => {
  const ext = file.name.split(".").pop()?.toLowerCase();
  return ext === "mp4" ? "videos" : ext === "pdf" ? "documents" : "photos";
};
export const formatSize = (n?: number | null) => n == null ? "—" : n >= MB ? `${(n / MB).toFixed(1).replace(".", ",")} Mo` : `${Math.max(1, Math.round(n / 1024))} Ko`;

const REASONS: Record<string, string> = {
  type: "Contenu non reconnu : le fichier n’est pas un vrai JPG, PNG, WebP, PDF ou MP4.",
  size: "Taille réelle supérieure à la limite du format.", empty: "Fichier vide.",
};

async function callAssets(body: Record<string, unknown>) {
  const { data, error } = await supabase.functions.invoke("studio-assets", { body });
  if (error) {
    let payload: any = null;
    try { payload = await (error as any).context?.json?.(); } catch { /* ignore */ }
    if (payload?.reason) throw new Error(REASONS[payload.reason] ?? "Fichier refusé.");
    if (payload?.error === "incomplete") throw new Error("Opération incomplète : relancez-la, elle reprendra là où elle s’est arrêtée.");
    throw new Error("L’opération n’a pas abouti. Réessayez.");
  }
  return data as any;
}

export function useAssets(projectId?: string) {
  return useQuery({ queryKey: ["assets", projectId], enabled: !!projectId, queryFn: async () => {
    const { data, error } = await supabase.from("project_assets").select("*").eq("project_id", projectId!).in("status", ["ready", "deleting"]).order("created_at", { ascending: false });
    if (error) throw new Error("Chargement des fichiers impossible.");
    return data ?? [];
  } });
}

/** Runs once per opening: removes pending uploads older than 24 h and resumes incomplete deletions. */
export function useAssetMaintenance(projectId?: string) {
  return useQuery({ queryKey: ["assets-maintenance", projectId], enabled: !!projectId, staleTime: Infinity, retry: false,
    queryFn: () => callAssets({ action: "maintain", project_id: projectId }) as Promise<{ cleaned: number; resumed: number }> });
}

export function useSignedUrls(assets: Asset[]) {
  const paths = assets.filter(a => a.status === "ready").map(a => a.storage_path).sort();
  return useQuery({ queryKey: ["asset-urls", paths], enabled: paths.length > 0, staleTime: 8 * 60 * 1000, queryFn: async () => {
    const { data, error } = await supabase.storage.from(BUCKET).createSignedUrls(paths, 600);
    if (error) throw error;
    return Object.fromEntries((data ?? []).filter(d => d.signedUrl).map(d => [d.path!, d.signedUrl]));
  } });
}
export async function signedDownloadUrl(a: Asset) {
  const ext = a.mime === "image/jpeg" ? "jpg" : a.mime?.split("/")[1] ?? "";
  const name = a.original_name.toLowerCase().endsWith(`.${ext}`) ? a.original_name : `${a.original_name}.${ext}`;
  const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(a.storage_path, 600, { download: name });
  if (error || !data) throw new Error("Lien temporaire indisponible.");
  return data.signedUrl;
}

export type UploadState = { key: string; file: File; label: string; category: AssetCategory; progress: number;
  phase: "queued" | "uploading" | "checking" | "done" | "rejected" | "error"; message?: string; assetId?: string };

/** Uploads one file: reserve a pending slot, resumable transfer, then server validation. */
export async function uploadAsset(projectId: string, u: UploadState, onProgress: (p: number, phase?: UploadState["phase"]) => void): Promise<string> {
  let assetId = u.assetId; let path: string;
  if (assetId) {
    const { data } = await supabase.from("project_assets").select("storage_path, status").eq("id", assetId).maybeSingle();
    if (!data || data.status !== "pending") assetId = undefined; else path = data.storage_path;
  }
  if (!assetId) {
    const { data, error } = await supabase.from("project_assets").insert({ project_id: projectId, label: u.label.slice(0, 150) || "Sans titre", category: u.category,
      original_name: u.file.name.slice(0, 255), declared_mime: u.file.type.slice(0, 100) || null, declared_size: u.file.size }).select("id, storage_path").single();
    if (error || !data) throw new Error("Impossible de préparer l’envoi (projet indisponible ?).");
    assetId = data.id; path = data.storage_path;
  }
  const { data: s } = await supabase.auth.getSession();
  const token = s.session?.access_token;
  if (!token) throw new Error("Session expirée : reconnectez-vous.");
  await new Promise<void>((resolve, reject) => {
    const up = new tus.Upload(u.file, {
      endpoint: `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/upload/resumable`,
      retryDelays: [0, 2000, 5000, 10000],
      headers: { authorization: `Bearer ${token}`, apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY, "x-upsert": "false" },
      uploadDataDuringCreation: true, removeFingerprintOnSuccess: true, chunkSize: 6 * MB,
      metadata: { bucketName: BUCKET, objectName: path!, contentType: u.file.type || "application/octet-stream", cacheControl: "3600" },
      onError: () => reject(new Error("Transfert interrompu. Vous pouvez réessayer.")),
      onProgress: (sent, total) => onProgress(total ? Math.round((sent / total) * 100) : 0),
      onSuccess: () => resolve(),
    });
    up.findPreviousUploads().then(prev => { if (prev.length) up.resumeFromPreviousUpload(prev[0]); up.start(); });
  }).catch(e => { (e as any).assetId = assetId; throw e; });
  onProgress(100, "checking");
  await callAssets({ action: "finalize", asset_id: assetId });
  return assetId!;
}

function useInv() {
  const qc = useQueryClient();
  return () => Promise.all(["assets", "asset-refs", "all-assets"].map(k => qc.invalidateQueries({ queryKey: [k] })));
}
export function useUpdateAsset() {
  const inv = useInv();
  return useMutation({ mutationFn: async ({ id, label, category }: { id: string; label: string; category: AssetCategory }) => {
    const l = label.trim();
    if (!l || l.length > 150) throw new Error("Le libellé doit contenir entre 1 et 150 caractères.");
    const { error } = await supabase.from("project_assets").update({ label: l, category }).eq("id", id);
    if (error) throw new Error("Modification impossible.");
  }, onSuccess: inv });
}
export function useDeleteAsset() {
  const inv = useInv();
  return useMutation({ mutationFn: (id: string) => callAssets({ action: "delete", asset_id: id }), onSettled: inv });
}
export async function deleteProjectWithAssets(projectId: string) { await callAssets({ action: "delete_project", project_id: projectId }); }

/** Explicit references only (never derived from Disponible / À produire / Pas nécessaire). */
export function useAssetRefs(projectId?: string) {
  return useQuery({ queryKey: ["asset-refs", projectId], enabled: !!projectId, queryFn: async () => {
    const { data, error } = await supabase.from("brief_asset_refs").select("brief_id, asset_id, project_briefs!inner(version, status, project_id)").eq("project_briefs.project_id", projectId!);
    if (error) throw new Error("Chargement des références impossible.");
    return (data ?? []) as unknown as { brief_id: string; asset_id: string; project_briefs: { version: number; status: string } }[];
  } });
}
export function useToggleRef() {
  const inv = useInv();
  return useMutation({ mutationFn: async ({ briefId, assetId, on }: { briefId: string; assetId: string; on: boolean }) => {
    const { error } = on ? await supabase.from("brief_asset_refs").insert({ brief_id: briefId, asset_id: assetId })
      : await supabase.from("brief_asset_refs").delete().eq("brief_id", briefId).eq("asset_id", assetId);
    if (error) throw new Error("Mise à jour de la référence impossible.");
  }, onSuccess: inv });
}
export function useBriefRefs(briefId?: string) {
  return useQuery({ queryKey: ["asset-refs", "brief", briefId], enabled: !!briefId, queryFn: async () => {
    const { data, error } = await supabase.from("brief_asset_refs").select("created_at, project_assets(id, label, category, status, removed_at)").eq("brief_id", briefId!);
    if (error) throw new Error("Chargement des références impossible.");
    return (data ?? []) as unknown as { created_at: string; project_assets: Pick<Asset, "id" | "label" | "category" | "status" | "removed_at"> | null }[];
  } });
}
