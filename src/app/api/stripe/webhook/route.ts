import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";

export const runtime = "nodejs";

// Stripe webhook. Verifies signature when STRIPE_WEBHOOK_SECRET is set, then
// records the key subscription lifecycle events. Kept side-effect-light for v1
// (logs + 200); wire to the DB once a subscription model exists.
export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  // Accept multiple signing secrets (comma-separated) so several Stripe webhook
  // endpoints (apex domain + vercel.app) can all be verified.
  const secrets = (process.env.STRIPE_WEBHOOK_SECRET ?? "")
    .split(",").map((s) => s.trim()).filter(Boolean);
  const body = await req.text();

  let event: Stripe.Event | undefined;
  if (secrets.length && sig) {
    for (const sec of secrets) {
      try { event = stripe.webhooks.constructEvent(body, sig, sec); break; }
      catch { /* try next secret */ }
    }
    if (!event) {
      return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 400 });
    }
  } else {
    try { event = JSON.parse(body) as Stripe.Event; }
    catch { return NextResponse.json({ error: "bad body" }, { status: 400 }); }
  }

  if (!event) return NextResponse.json({ error: "no event" }, { status: 400 });
  switch (event.type) {
    case "checkout.session.completed":
    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.deleted":
      console.log(`[stripe] ${event.type}`, event.data?.object?.id ?? "");
      // TODO: persist subscription status to the Organization when the model exists.
      break;
    default:
      break;
  }
  return NextResponse.json({ received: true });
}
