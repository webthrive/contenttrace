import { logError } from "@/lib/log";
import { siteUrl, stripeEnabled, billingEnabled } from "@/lib/billing/config";
import { supabaseStore } from "@/lib/billing/entitlements";
import { getStripe } from "@/lib/billing/stripe";
import { getSessionUser, supabaseAdmin } from "@/lib/billing/supabase";

export const dynamic = "force-dynamic";

// Open the Stripe customer portal (change plan, update card, cancel, download invoices).
export async function POST() {
  if (!billingEnabled() || !stripeEnabled()) return Response.json({ error: "Payments are not available yet." }, { status: 503 });
  const user = await getSessionUser();
  if (!user) return Response.json({ error: "Please sign in first.", code: "login" }, { status: 401 });

  const profile = await supabaseStore(supabaseAdmin()).getProfile(user.id);
  if (!profile?.stripe_customer_id) return Response.json({ error: "No billing account yet." }, { status: 404 });

  try {
    const session = await getStripe().billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: `${siteUrl()}/account`,
    });
    return Response.json({ url: session.url });
  } catch (err) {
    logError("Portal failed:", err);
    return Response.json({ error: "Could not open billing. Please try again." }, { status: 502 });
  }
}
