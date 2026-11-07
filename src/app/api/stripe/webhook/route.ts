import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";

// Author: Bob Robert. Stripe callbacks always require signature verification.
// Stripe webhook. Verifies STRIPE_WEBHOOK_SECRET, then
// records the key subscription lifecycle events. Kept side-effect-light for v1
// (logs + 200); wire to the DB once a subscription model exists.
export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  // Accept multiple signing secrets (comma-separated) so several Stripe webhook
  // endpoints (apex domain + vercel.app) can all be verified.
  const secrets = (process.env.STRIPE_WEBHOOK_SECRET ?? "")
    .split(",").map((s) => s.trim()).filter(Boolean);
  const body = await req.text();

  if (!secrets.length) {
    return NextResponse.json({ error: "Webhook is not configured" }, { status: 503 });
  }
  if (!sig) return NextResponse.json({ error: "missing signature" }, { status: 400 });

  let event: Stripe.Event | undefined;
  for (const sec of secrets) {
    try { event = Stripe.webhooks.constructEvent(body, sig, sec); break; }
    catch { /* Try the next configured signing secret. */ }
  }
  if (!event) {
    return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 400 });
  }
  switch (event.type) {
    case "checkout.session.completed":
    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.deleted":
      console.log(`[stripe] ${event.type}`, event.data?.object?.id ?? "");
      // This acknowledges a verified receipt; subscription entitlements are not provisioned here.
      break;
    default:
      break;
  }
  return NextResponse.json({ received: true });
}
