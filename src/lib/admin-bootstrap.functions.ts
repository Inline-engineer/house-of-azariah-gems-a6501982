/**
 * One-time admin bootstrap.
 * Promotes the two seed accounts to the `admin` role on their FIRST login.
 * Auth-gated: requires a signed-in user, and only acts when the caller's own
 * email is one of the seed admin emails. This prevents anonymous abuse of the
 * service-role key.
 */
import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const ADMIN_EMAILS = [
  "nahelmgitonga@gmail.com",
  "kabakialex688@gmail.com",
];

export const bootstrapAdmins = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const callerEmail = (context.claims.email as string | undefined)?.toLowerCase();
    if (!callerEmail || !ADMIN_EMAILS.includes(callerEmail)) {
      return { promoted: [] };
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: existing } = await supabaseAdmin
      .from("user_roles")
      .select("id")
      .eq("user_id", context.userId)
      .eq("role", "admin")
      .maybeSingle();
    if (existing) return { promoted: [] };
    await supabaseAdmin.from("user_roles").insert({ user_id: context.userId, role: "admin" });
    return { promoted: [callerEmail] };
  });
