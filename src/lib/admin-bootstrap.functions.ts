/**
 * One-time admin bootstrap.
 * Promotes the two seed accounts (Grace Gitonga + Alex) to the `admin` role
 * when they sign up. Safe to call repeatedly; only inserts the role if missing.
 *
 * The accounts themselves must be created by visiting /signup once with the
 * email/password they choose. After signup this function flips their role.
 */
import { createServerFn } from "@tanstack/react-start";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const ADMIN_EMAILS = [
  "nahelmgitonga@gmail.com",
  "kabakialex688@gmail.com",
];

export const bootstrapAdmins = createServerFn({ method: "POST" }).handler(async () => {
  const promoted: string[] = [];
  for (const email of ADMIN_EMAILS) {
    const { data: userData } = await supabaseAdmin.auth.admin.listUsers();
    const u = userData?.users.find((x) => x.email?.toLowerCase() === email.toLowerCase());
    if (!u) continue;
    const { data: existing } = await supabaseAdmin
      .from("user_roles")
      .select("id")
      .eq("user_id", u.id)
      .eq("role", "admin")
      .maybeSingle();
    if (!existing) {
      await supabaseAdmin.from("user_roles").insert({ user_id: u.id, role: "admin" });
      promoted.push(email);
    }
  }
  return { promoted };
});
