import { createClient, type SupabaseClient } from "npm:@supabase/supabase-js@2";

const BUCKET = "project-assets";
const MB = 1024 * 1024;
const LIMITS = { image: 15 * MB, pdf: 25 * MB, video: 200 * MB } as const;
const PENDING_TTL_MS = 24 * 60 * 60 * 1000;
const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });
const isUuid = (v: unknown): v is string => typeof v === "string" && /^[0-9a-f-]{36}$/i.test(v);

type Kind = keyof typeof LIMITS;
/** Detects the real type from the first bytes of the file (never from extension or declared MIME). */
function sniff(b: Uint8Array): { kind: Kind; mime: string } | null {
  const ascii = (s: number, e: number) => String.fromCharCode(...b.slice(s, e));
  if (b.length >= 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return { kind: "image", mime: "image/jpeg" };
  if (b.length >= 8 && [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a].every((x, i) => b[i] === x)) return { kind: "image", mime: "image/png" };
  if (b.length >= 12 && ascii(0, 4) === "RIFF" && ascii(8, 12) === "WEBP") return { kind: "image", mime: "image/webp" };
  if (b.length >= 5 && ascii(0, 5) === "%PDF-") return { kind: "pdf", mime: "application/pdf" };
  if (b.length >= 12 && ascii(4, 8) === "ftyp") {
    const brand = ascii(8, 12);
    // MP4 family brands only. QuickTime (MOV, "qt  ") and HEIF images are refused.
    const mp4 = ["isom", "iso2", "iso3", "iso4", "iso5", "iso6", "mp41", "mp42", "avc1", "dash", "M4V ", "MSNV", "f4v "];
    if (mp4.includes(brand)) return { kind: "video", mime: "video/mp4" };
  }
  return null;
}

async function removeObjects(admin: SupabaseClient, paths: string[]) {
  for (let i = 0; i < paths.length; i += 100) {
    const { error } = await admin.storage.from(BUCKET).remove(paths.slice(i, i + 100));
    if (error) throw new Error("storage_remove_failed");
  }
}

/** Idempotent: can be re-run from any state ("ready", "deleting", "pending"). */
async function deleteAsset(admin: SupabaseClient, asset: { id: string; storage_path: string }) {
  const { error: e1 } = await admin.from("project_assets").update({ status: "deleting" }).eq("id", asset.id).neq("status", "removed");
  if (e1) throw new Error("mark_failed");
  await removeObjects(admin, [asset.storage_path]);
  const { data: refs, error: e2 } = await admin.from("brief_asset_refs").select("brief_id, project_briefs(status)").eq("asset_id", asset.id);
  if (e2) throw new Error("refs_failed");
  const validated = (refs ?? []).filter((r: any) => r.project_briefs?.status === "validated");
  if (validated.length) {
    const drafts = (refs ?? []).filter((r: any) => r.project_briefs?.status !== "validated").map((r: any) => r.brief_id);
    if (drafts.length) await admin.from("brief_asset_refs").delete().eq("asset_id", asset.id).in("brief_id", drafts);
    const { error } = await admin.from("project_assets").update({ status: "removed", removed_at: new Date().toISOString() }).eq("id", asset.id);
    if (error) throw new Error("finalize_failed");
    return "removed";
  }
  const { error } = await admin.from("project_assets").delete().eq("id", asset.id);
  if (error) throw new Error("finalize_failed");
  return "deleted";
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);
  const url = Deno.env.get("SUPABASE_URL")!;
  const admin = createClient(url, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });

  const token = (req.headers.get("Authorization") ?? "").replace(/^Bearer\s+/i, "");
  if (!token) return json({ error: "unauthorized" }, 401);
  const { data: u, error: ue } = await admin.auth.getUser(token);
  if (ue || !u.user) return json({ error: "unauthorized" }, 401);
  const uid = u.user.id;
  const { data: isAdmin } = await admin.rpc("has_role", { _user_id: uid, _role: "admin" });
  if (!isAdmin) return json({ error: "forbidden" }, 403);

  let body: any;
  try { body = await req.json(); } catch { return json({ error: "bad_request" }, 400); }
  const action = body?.action;

  try {
    if (action === "finalize") {
      if (!isUuid(body.asset_id)) return json({ error: "bad_request" }, 400);
      const { data: a } = await admin.from("project_assets").select("id, owner_id, status, storage_path").eq("id", body.asset_id).maybeSingle();
      if (!a || a.owner_id !== uid) return json({ error: "not_found" }, 404);
      if (a.status !== "pending") return json({ error: "not_pending" }, 409);
      const { data: info } = await admin.rpc("asset_object_info", { _path: a.storage_path });
      const size = Number(info?.[0]?.size ?? NaN);
      if (!Number.isFinite(size)) return json({ error: "file_missing" }, 409);
      const reject = async (reason: string) => { await removeObjects(admin, [a.storage_path]); await admin.from("project_assets").delete().eq("id", a.id); return json({ ok: false, reason }, 422); };
      if (size === 0) return reject("empty");
      // Read only the first bytes, never the whole file.
      const { data: signed } = await admin.storage.from(BUCKET).createSignedUrl(a.storage_path, 60);
      if (!signed?.signedUrl) throw new Error("sign_failed");
      const res = await fetch(signed.signedUrl, { headers: { Range: "bytes=0-63" } });
      if (!res.ok) throw new Error("read_failed");
      const reader = res.body!.getReader(); const chunks: number[] = [];
      while (chunks.length < 64) { const { done, value } = await reader.read(); if (done) break; chunks.push(...value.slice(0, 64 - chunks.length)); }
      await reader.cancel().catch(() => {});
      const type = sniff(new Uint8Array(chunks));
      if (!type) return reject("type");
      if (size > LIMITS[type.kind]) return reject("size");
      const { error } = await admin.from("project_assets").update({ status: "ready", mime: type.mime, kind: type.kind, size_bytes: size, validated_at: new Date().toISOString() }).eq("id", a.id).eq("status", "pending");
      if (error) throw new Error("update_failed");
      return json({ ok: true, kind: type.kind, mime: type.mime, size });
    }

    if (action === "delete") {
      if (!isUuid(body.asset_id)) return json({ error: "bad_request" }, 400);
      const { data: a } = await admin.from("project_assets").select("id, owner_id, status, storage_path").eq("id", body.asset_id).maybeSingle();
      if (!a || a.owner_id !== uid) return json({ error: "not_found" }, 404);
      if (a.status === "removed") return json({ ok: true, result: "removed" });
      return json({ ok: true, result: await deleteAsset(admin, a) });
    }

    if (action === "maintain") {
      if (!isUuid(body.project_id)) return json({ error: "bad_request" }, 400);
      const cutoff = new Date(Date.now() - PENDING_TTL_MS).toISOString();
      const { data: rows } = await admin.from("project_assets").select("id, storage_path, status, created_at")
        .eq("owner_id", uid).eq("project_id", body.project_id).in("status", ["pending", "deleting"]);
      let cleaned = 0, resumed = 0;
      for (const r of rows ?? []) {
        if (r.status === "deleting") { await deleteAsset(admin, r); resumed++; }
        else if (r.created_at < cutoff) { await removeObjects(admin, [r.storage_path]); await admin.from("project_assets").delete().eq("id", r.id).eq("status", "pending"); cleaned++; }
      }
      return json({ ok: true, cleaned, resumed });
    }

    if (action === "delete_project") {
      if (!isUuid(body.project_id)) return json({ error: "bad_request" }, 400);
      const { data: p } = await admin.from("projects").select("id, owner_id").eq("id", body.project_id).maybeSingle();
      if (!p || p.owner_id !== uid) return json({ error: "not_found" }, 404);
      // 1. Lock: blocks new uploads and edits.
      const { error: e1 } = await admin.from("projects").update({ deleting: true }).eq("id", p.id);
      if (e1) throw new Error("lock_failed");
      await admin.from("project_assets").update({ status: "deleting" }).eq("project_id", p.id);
      // 2. Remove every stored file: registered ones and anything left under the project folder.
      const { data: rows } = await admin.from("project_assets").select("storage_path").eq("project_id", p.id);
      const paths = new Set((rows ?? []).map(r => r.storage_path));
      const prefix = `${uid}/${p.id}`;
      for (let offset = 0; ; offset += 1000) {
        const { data: list, error } = await admin.storage.from(BUCKET).list(prefix, { limit: 1000, offset });
        if (error) throw new Error("list_failed");
        (list ?? []).forEach(o => paths.add(`${prefix}/${o.name}`));
        if (!list || list.length < 1000) break;
      }
      await removeObjects(admin, [...paths]);
      // 3. Finalize records, then the project (briefs follow).
      const { error: e3 } = await admin.from("project_assets").delete().eq("project_id", p.id);
      if (e3) throw new Error("assets_delete_failed");
      const { error: e4 } = await admin.from("projects").delete().eq("id", p.id);
      if (e4) throw new Error("project_delete_failed");
      return json({ ok: true });
    }
    return json({ error: "unknown_action" }, 400);
  } catch (e) {
    console.error("studio-assets", action, (e as Error).message);
    return json({ error: "incomplete", detail: (e as Error).message }, 500);
  }
});
