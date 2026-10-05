/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import type { BriefData } from "../brief/config";
import { RULES_VERSION, generate, type Adjustments, type AssetMeta, type Generated } from "./rules";

export type Structure = Omit<Tables<"site_structures">, "generated" | "structure" | "assets_snapshot"> & {
  generated: Generated; structure: Adjustments; assets_snapshot: (AssetMeta & { kind: string | null; mime: string | null; size: number | null; validated_at: string | null })[];
};
export const STRUCTURE_STATUS: Record<string, string> = { draft: "Brouillon", validated: "Validée", archived: "Archivée" };

export function useStructures(projectId?: string) {
  return useQuery({ queryKey: ["structures", projectId], enabled: !!projectId, queryFn: async () => {
    const { data, error } = await supabase.from("site_structures").select("id, version, status, brief_id, created_at, updated_at, validated_at, archived_at, project_briefs(version)").eq("project_id", projectId!).order("version", { ascending: false });
    if (error) throw new Error("Chargement des propositions impossible.");
    return (data ?? []) as any[];
  } });
}
export function useStructure(id?: string) {
  return useQuery({ queryKey: ["structure", id], enabled: !!id, queryFn: async () => {
    const { data, error } = await supabase.from("site_structures").select("*, project_briefs(id, version), projects(id, name)").eq("id", id!).maybeSingle();
    if (error) throw new Error("Chargement de la proposition impossible.");
    return data as unknown as (Structure & { project_briefs: { id: string; version: number }; projects: { id: string; name: string } }) | null;
  } });
}
export function useAssetsFingerprint(projectId?: string) {
  return useQuery({ queryKey: ["assets-fp", projectId], enabled: !!projectId, queryFn: async () => {
    const { data, error } = await supabase.rpc("project_assets_fingerprint", { _project: projectId! });
    if (error) throw new Error("Vérification des fichiers impossible.");
    return data as string;
  } });
}

/** Computes the proposal from the validated brief and current ready files, then stores it server-side in one transaction. */
export async function computeStructure(briefId: string, replaceDraftId?: string) {
  const { data: b, error: e1 } = await supabase.from("project_briefs").select("id, project_id, sector, status, data").eq("id", briefId).maybeSingle();
  if (e1 || !b) throw new Error("Brief introuvable.");
  if (b.status !== "validated") throw new Error("Seul un brief validé peut servir de base.");
  const { data: assets, error: e2 } = await supabase.from("project_assets").select("id, category, label").eq("project_id", b.project_id).eq("status", "ready");
  if (e2) throw new Error("Chargement des fichiers impossible.");
  const g = generate(b.sector, (b.data ?? {}) as BriefData, (assets ?? []) as AssetMeta[]);
  const { data, error } = await supabase.rpc("create_site_structure", { _brief: briefId, _generated: g as never, _rules_version: RULES_VERSION,
    _asset_keys: (assets ?? []).map(a => `${a.id}:${a.category}`), _replace: replaceDraftId ?? null } as never);
  if (error?.code === "23505") throw new Error("Une proposition en brouillon existe déjà : confirmez son archivage pour recalculer.");
  if (error?.code === "SA001") throw new Error("Les fichiers du projet ont changé pendant le calcul. Rien n’a été enregistré : réessayez.");
  if (error) throw new Error("La proposition n’a pas été créée et rien n’a été modifié. Réessayez.");
  return data as { id: string; version: number; archived: string | null };
}

function useInv() {
  const qc = useQueryClient();
  return () => Promise.all(["structures", "structure"].map(k => qc.invalidateQueries({ queryKey: [k] })));
}
export function useComputeStructure() {
  const inv = useInv();
  return useMutation({ mutationFn: (a: { briefId: string; replace?: string }) => computeStructure(a.briefId, a.replace), onSuccess: inv });
}
export function useSaveAdjustments() {
  const inv = useInv();
  return useMutation({ mutationFn: async ({ id, structure, validate }: { id: string; structure: Adjustments; validate?: boolean }) => {
    const { data, error } = await supabase.from("site_structures").update({ structure: structure as never, ...(validate ? { status: "validated" as const } : {}) }).eq("id", id).eq("status", "draft").select("id");
    if (error || !data?.length) throw new Error(validate ? "Validation impossible : la proposition n’est plus modifiable ou les ajustements sont hors périmètre." : "Enregistrement impossible : la proposition n’est plus modifiable ou les ajustements sont hors périmètre.");
  }, onSuccess: inv });
}
