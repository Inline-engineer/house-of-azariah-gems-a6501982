/**
 * One-time admin bootstrap.
 * Promotes seed accounts (configured server-side via ADMIN_EMAILS env var)
 * to the `admin` role on their first login. Auth-gated: only acts when the
 * caller's own email matches a configured seed admin email.
 */
import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const bootstrapAdmins = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const adminEmails = (process.env.ADMIN_EMAILS ?? "")
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);

    const callerEmail = (context.claims.email as string | undefined)?.toLowerCase();
    if (!callerEmail || !adminEmails.includes(callerEmail)) {
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
