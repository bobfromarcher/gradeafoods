import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export const runtime = "nodejs";

// Stripe webhook. Verifies signature when STRIPE_WEBHOOK_SECRET is set, then
// records the key subscription lifecycle events. Kept side-effect-light for v1
// (logs + 200); wire to the DB once a subscription model exists.
export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  const whsec = process.env.STRIPE_WEBHOOK_SECRET;
  const body = await req.text();

  let event;
  try {
    event = whsec && sig
      ? stripe.webhooks.constructEvent(body, sig, whsec)
      : JSON.parse(body);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "bad signature";
    return NextResponse.json({ error: `Webhook error: ${msg}` }, { status: 400 });
  }

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
