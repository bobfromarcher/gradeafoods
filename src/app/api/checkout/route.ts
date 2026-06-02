import { NextRequest, NextResponse } from "next/server";
import { stripe, PLANS, type PlanId } from "@/lib/stripe";

export const runtime = "nodejs";

// POST /api/checkout  { plan: "starter" | "team" } -> { url }
export async function POST(req: NextRequest) {
  try {
    const { plan } = (await req.json()) as { plan?: PlanId };
    const p = plan && PLANS[plan];
    if (!p) return NextResponse.json({ error: "Unknown plan" }, { status: 400 });

    const origin = req.headers.get("origin") ?? new URL(req.url).origin;
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{
        quantity: 1,
        price_data: {
          currency: "usd",
          recurring: { interval: p.interval },
          unit_amount: p.amount,
          product_data: { name: `Grade A Foods — ${p.name}` },
        },
      }],
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cancel`,
      allow_promotion_codes: true,
    });
    return NextResponse.json({ url: session.url });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "checkout failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
