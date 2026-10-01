import type Stripe from "stripe";
import { getStripe, handleCheckoutCompleted, syncSubscription } from "@/lib/billing/stripe";
import { supabaseAdmin } from "@/lib/billing/supabase";

export const dynamic = "force-dynamic";

// Stripe sends payment and subscription events here. Configure in Stripe: Developers > Webhooks.
export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret || !process.env.STRIPE_SECRET_KEY) return new Response("Not configured", { status: 503 });

  const stripe = getStripe();
  const body = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, req.headers.get("stripe-signature") ?? "", secret);
  } catch (err) {
    console.error("Stripe signature check failed:", err);
    return new Response("Bad signature", { status: 400 });
  }

  const sb = supabaseAdmin();

  // Idempotency: record the event first; Stripe can send the same event more than once.
  const { error: dupError } = await sb.from("stripe_events").insert({ id: event.id, type: event.type });
  if (dupError) {
    if (dupError.code === "23505") return Response.json({ received: true, duplicate: true });
    console.error("Could not record Stripe event:", dupError);
    return new Response("Database error", { status: 500 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded":
        await handleCheckoutCompleted(sb, stripe, event.data.object as Stripe.Checkout.Session);
        break;
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
        await syncSubscription(sb, event.data.object as Stripe.Subscription);
        break;
      default:
        break; // other events are not used
    }
  } catch (err) {
    console.error(`Stripe event ${event.type} failed:`, err);
    await sb.from("stripe_events").delete().eq("id", event.id); // let Stripe retry
    return new Response("Handler error", { status: 500 });
  }

  return Response.json({ received: true });
}
