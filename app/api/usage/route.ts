import { logError } from "@/lib/log";
import { PLANS, billingEnabled, stripeEnabled } from "@/lib/billing/config";
import { getStatus, supabaseStore } from "@/lib/billing/entitlements";
import { getIdentity } from "@/lib/billing/identity";
import { supabaseAdmin } from "@/lib/billing/supabase";

export const dynamic = "force-dynamic";

// Current plan and remaining usage for the visitor. Used by the analyzer, pricing and account pages.
export async function GET() {
  if (!billingEnabled()) {
    return Response.json({ enabled: false, charLimit: PLANS.free.charLimit });
  }
  try {
    const status = await getStatus(supabaseStore(supabaseAdmin()), await getIdentity());
    return Response.json(
      { enabled: true, payments: stripeEnabled(), ...status },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (err) {
    logError("Usage lookup failed:", err);
    return Response.json({ enabled: true, error: "unavailable", charLimit: PLANS.free.charLimit }, { status: 503 });
  }
}
