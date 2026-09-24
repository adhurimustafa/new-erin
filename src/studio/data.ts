import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Client = Tables<"clients">;
export type Project = Tables<"projects">;
export type ProjectStatus = Project["status"];
export type ProjectWithClient = Project & { clients: { id: string; company_name: string } | null };

export const SECTORS: Record<string, string> = {
  restaurant: "Restaurant", hotel: "Hôtel", real_estate: "Immobilier", barber_salon: "Barber / Salon",
  beauty: "Beauté", fitness: "Fitness", local_shop: "Commerce local", artisan: "Artisan",
  professional_services: "Services professionnels", association: "Association", ecommerce: "E-commerce", other: "Autre",
};
export const STATUSES: Record<ProjectStatus, string> = {
  draft: "Brouillon", preparing: "En préparation", ready: "Prêt", published: "Publié (statut)",
};
export const LANGUAGES: Record<string, string> = {
  sq: "Albanais", fr: "Français", en: "Anglais", de: "Allemand", it: "Italien", sr: "Serbe", tr: "Turc", es: "Espagnol",
};

const optional = (max: number) => z.string().trim().max(max, `${max} caractères maximum`).optional().or(z.literal(""));

export const clientSchema = z.object({
  company_name: z.string().trim().min(1, "Le nom de l’entreprise est obligatoire.").max(150, "150 caractères maximum"),
  contact_name: optional(150),
  email: z.string().trim().max(255).email("Adresse email invalide.").optional().or(z.literal("")),
  phone: optional(40),
  location: optional(255),
  website: z.string().trim().max(500).regex(/^https?:\/\//i, "L’adresse doit commencer par http:// ou https://").optional().or(z.literal("")),
  socials: optional(1000),
  notes: optional(5000),
});
export type ClientInput = z.infer<typeof clientSchema>;

export const projectSchema = z.object({
  name: z.string().trim().min(1, "Le nom du projet est obligatoire.").max(150, "150 caractères maximum"),
  client_id: z.string().uuid("Choisissez un client."),
  sector: z.enum(Object.keys(SECTORS) as [string, ...string[]]),
  languages: z.array(z.enum(Object.keys(LANGUAGES) as [string, ...string[]])).min(1, "Choisissez au moins une langue."),
  status: z.enum(["draft", "preparing", "ready", "published"]),
  description: optional(5000),
});
export type ProjectInput = z.infer<typeof projectSchema>;

const nullify = <T extends Record<string, unknown>>(v: T) =>
  Object.fromEntries(Object.entries(v).map(([k, x]) => [k, typeof x === "string" && x.trim() === "" ? null : typeof x === "string" ? x.trim() : x]));

const fail = (error: { message: string; code?: string } | null) => {
  if (!error) return;
  if (error.code === "23503") throw new Error("Ce client a encore des projets : supprimez ou déplacez-les d’abord.");
  throw new Error("L’opération n’a pas abouti. Réessayez.");
};

export function useClients() {
  return useQuery({ queryKey: ["clients"], queryFn: async () => {
    const { data, error } = await supabase.from("clients").select("*").order("updated_at", { ascending: false });
    fail(error); return data ?? [];
  } });
}
export function useClient(id?: string) {
  return useQuery({ queryKey: ["client", id], enabled: !!id, queryFn: async () => {
    const { data, error } = await supabase.from("clients").select("*").eq("id", id!).maybeSingle();
    fail(error); return data;
  } });
}
export function useProjects(clientId?: string) {
  return useQuery({ queryKey: ["projects", clientId ?? "all"], queryFn: async () => {
    let q = supabase.from("projects").select("*, clients(id, company_name)").order("updated_at", { ascending: false });
    if (clientId) q = q.eq("client_id", clientId);
    const { data, error } = await q;
    fail(error); return (data ?? []) as ProjectWithClient[];
  } });
}
export function useProject(id?: string) {
  return useQuery({ queryKey: ["project", id], enabled: !!id, queryFn: async () => {
    const { data, error } = await supabase.from("projects").select("*, clients(id, company_name)").eq("id", id!).maybeSingle();
    fail(error); return data as ProjectWithClient | null;
  } });
}

function useInvalidate() {
  const qc = useQueryClient();
  return () => Promise.all(["clients", "client", "projects", "project"].map(k => qc.invalidateQueries({ queryKey: [k] })));
}

export function useSaveClient() {
  const inv = useInvalidate();
  return useMutation({ mutationFn: async ({ id, values }: { id?: string; values: ClientInput }) => {
    const row = nullify(clientSchema.parse(values)) as ClientInput & { company_name: string };
    const res = id ? await supabase.from("clients").update(row).eq("id", id).select().single()
      : await supabase.from("clients").insert(row).select().single();
    fail(res.error); return res.data as Client;
  }, onSuccess: inv });
}
export function useDeleteClient() {
  const inv = useInvalidate();
  return useMutation({ mutationFn: async (id: string) => { const { error } = await supabase.from("clients").delete().eq("id", id); fail(error); }, onSuccess: inv });
}
export function useSaveProject() {
  const inv = useInvalidate();
  return useMutation({ mutationFn: async ({ id, values }: { id?: string; values: ProjectInput }) => {
    const parsed = projectSchema.parse(values);
    const row = { ...parsed, description: parsed.description?.trim() || null, name: parsed.name.trim() };
    const res = id ? await supabase.from("projects").update(row).eq("id", id).select().single()
      : await supabase.from("projects").insert(row).select().single();
    fail(res.error); return res.data as Project;
  }, onSuccess: inv });
}
export function useDeleteProject() {
  const inv = useInvalidate();
  return useMutation({ mutationFn: async (id: string) => { const { error } = await supabase.from("projects").delete().eq("id", id); fail(error); }, onSuccess: inv });
}

export const formatDate = (iso: string) => new Date(iso).toLocaleString("fr-FR", { dateStyle: "medium", timeStyle: "short" });
