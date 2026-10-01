import { logError } from "@/lib/log";
import type Stripe from "stripe";
import { STRIPE_PRICES, siteUrl, stripeEnabled, billingEnabled } from "@/lib/billing/config";
import { isProActive, supabaseStore } from "@/lib/billing/entitlements";
import { getStripe } from "@/lib/billing/stripe";
import { getSessionUser, supabaseAdmin } from "@/lib/billing/supabase";

export const dynamic = "force-dynamic";

type Kind = "monthly" | "yearly" | "pack";

// Start a Stripe Checkout for Pro (monthly/yearly) or a one-time Word Pack.
export async function POST(req: Request) {
  if (!billingEnabled() || !stripeEnabled()) {
    return Response.json({ error: "Payments are not available yet." }, { status: 503 });
  }
  const user = await getSessionUser();
  if (!user) return Response.json({ error: "Please sign in first.", code: "login" }, { status: 401 });

  let kind: Kind;
  try {
    ({ kind } = await req.json());
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }
  const price = kind === "monthly" ? STRIPE_PRICES.monthly() : kind === "yearly" ? STRIPE_PRICES.yearly() : kind === "pack" ? STRIPE_PRICES.pack() : undefined;
  if (!price) return Response.json({ error: "Unknown plan." }, { status: 400 });

  const profile = await supabaseStore(supabaseAdmin()).getProfile(user.id);
  if (kind !== "pack" && isProActive(profile)) {
    return Response.json({ error: "You already have Pro. Manage it from your account page.", code: "already_pro" }, { status: 409 });
  }

  const base: Stripe.Checkout.SessionCreateParams = {
    line_items: [{ price, quantity: 1 }],
    client_reference_id: user.id,
    metadata: { user_id: user.id, kind },
    allow_promotion_codes: true,
    success_url: `${siteUrl()}/account?checkout=success`,
    cancel_url: `${siteUrl()}/pricing?checkout=cancel`,
    ...(profile?.stripe_customer_id ? { customer: profile.stripe_customer_id } : user.email ? { customer_email: user.email } : {}),
    ...(process.env.STRIPE_AUTOMATIC_TAX === "true" ? { automatic_tax: { enabled: true } } : {}),
  };

  const params: Stripe.Checkout.SessionCreateParams =
    kind === "pack"
      ? { ...base, mode: "payment", ...(profile?.stripe_customer_id ? {} : { customer_creation: "always" }), payment_intent_data: { metadata: { user_id: user.id, kind } } }
      : { ...base, mode: "subscription", subscription_data: { metadata: { user_id: user.id } } };

  try {
    const session = await getStripe().checkout.sessions.create(params);
    return Response.json({ url: session.url });
  } catch (err) {
    logError("Checkout failed:", err);
    return Response.json({ error: "Could not start checkout. Please try again." }, { status: 502 });
  }
}
