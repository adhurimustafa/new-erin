// TEMPORARY verification helper — deleted right after the Lot 4 checks.
import { createClient } from "npm:@supabase/supabase-js@2";
const OWNER = "a67e3642-c490-4a04-a4c7-f38345bc9b46";
const EMAIL = "lot4-isolation-test@tadam.invalid";
Deno.serve(async (req) => {
  const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
  const tok = (req.headers.get("Authorization") ?? "").replace(/^Bearer\s+/i, "");
  const { data: u } = await admin.auth.getUser(tok);
  if (u.user?.id !== OWNER) return new Response("forbidden", { status: 403 });
  const { action, password } = await req.json();
  const { data: list } = await admin.auth.admin.listUsers();
  const ex = list.users.find(x => x.email === EMAIL);
  if (action === "create") {
    if (ex) await admin.auth.admin.deleteUser(ex.id);
    const { data, error } = await admin.auth.admin.createUser({ email: EMAIL, password, email_confirm: true });
    return Response.json({ id: data.user?.id, error: error?.message });
  }
  if (action === "grant" && ex) { const { error } = await admin.from("user_roles").insert({ user_id: ex.id, role: "admin" }); return Response.json({ error: error?.message }); }
  if (action === "remove" && ex) {
    await admin.from("user_roles").delete().eq("user_id", ex.id);
    const { error } = await admin.auth.admin.deleteUser(ex.id); return Response.json({ deleted: !error, error: error?.message });
  }
  return Response.json({ noop: true });
});
