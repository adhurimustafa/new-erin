// TEMPORARY test helper (Lot 5 checks) — deleted right after use.
import { createClient } from "npm:@supabase/supabase-js@2";
Deno.serve(async (req) => {
  const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const auth = req.headers.get("authorization")?.replace("Bearer ", "") ?? "";
  const { data: u } = await admin.auth.getUser(auth);
  if (!u.user) return new Response("no", { status: 401 });
  const { data: r } = await admin.from("user_roles").select("role").eq("user_id", u.user.id).eq("role", "admin");
  if (!r?.length) return new Response("no", { status: 403 });
  const b = await req.json();
  if (b.action === "create") {
    const { data, error } = await admin.auth.admin.createUser({ email: b.email, password: b.password, email_confirm: true });
    if (error) return new Response(error.message, { status: 400 });
    return Response.json({ id: data.user.id });
  }
  if (b.action === "grant") { await admin.from("user_roles").insert({ user_id: b.id, role: "admin" }); return Response.json({ ok: true }); }
  if (b.action === "delete") { await admin.from("user_roles").delete().eq("user_id", b.id); await admin.auth.admin.deleteUser(b.id); return Response.json({ ok: true }); }
  return new Response("?", { status: 400 });
});
