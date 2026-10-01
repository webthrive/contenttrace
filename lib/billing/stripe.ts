import Stripe from "stripe";
import type { SupabaseClient } from "@supabase/supabase-js";
import { PLANS } from "./config";

let client: Stripe | null = null;
export function getStripe(): Stripe {
  if (!client) client = new Stripe(process.env.STRIPE_SECRET_KEY!);
  return client;
}

// Newer Stripe API versions put the period end on the subscription item, older ones on the subscription.
function periodEnd(sub: Stripe.Subscription): string | null {
  const s = sub as unknown as { current_period_end?: number; items?: { data?: { current_period_end?: number }[] } };
  const ts = s.current_period_end ?? s.items?.data?.[0]?.current_period_end;
  return ts ? new Date(ts * 1000).toISOString() : null;
}

async function findUserId(sb: SupabaseClient, customerId: string | null, metadataUserId?: string | null): Promise<string | null> {
  if (metadataUserId) return metadataUserId;
  if (!customerId) return null;
  const { data } = await sb.from("profiles").select("id").eq("stripe_customer_id", customerId).maybeSingle();
  return (data as { id: string } | null)?.id ?? null;
}

export async function syncSubscription(sb: SupabaseClient, sub: Stripe.Subscription): Promise<void> {
  const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer.id;
  const userId = await findUserId(sb, customerId, sub.metadata?.user_id);
  if (!userId) throw new Error(`No user for subscription ${sub.id}`);
  const { error } = await sb
    .from("profiles")
    .update({
      stripe_customer_id: customerId,
      sub_status: sub.status,
      sub_price_id: sub.items.data[0]?.price?.id ?? null,
      sub_period_end: periodEnd(sub),
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId);
  if (error) throw new Error(error.message);
}

export async function handleCheckoutCompleted(sb: SupabaseClient, stripe: Stripe, session: Stripe.Checkout.Session): Promise<void> {
  const userId = session.client_reference_id || session.metadata?.user_id || null;
  const customerId = typeof session.customer === "string" ? session.customer : session.customer?.id ?? null;
  if (!userId) throw new Error(`Checkout ${session.id} has no user`);

  if (customerId) {
    const { error } = await sb.from("profiles").update({ stripe_customer_id: customerId, updated_at: new Date().toISOString() }).eq("id", userId);
    if (error) throw new Error(error.message);
  }

  if (session.mode === "payment" && session.metadata?.kind === "pack" && session.payment_status === "paid") {
    const { error } = await sb.rpc("add_pack", { p_user: userId, p_words: PLANS.pack.words });
    if (error) throw new Error(error.message);
  }

  if (session.mode === "subscription" && session.subscription) {
    const subId = typeof session.subscription === "string" ? session.subscription : session.subscription.id;
    await syncSubscription(sb, await stripe.subscriptions.retrieve(subId));
  }
}
