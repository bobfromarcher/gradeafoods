import Stripe from "stripe";

// Server-only Stripe client. Uses STRIPE_SECRET_KEY from env (TEST key in dev;
// swap to a live key in the vault only after the flow is verified).
const key = process.env.STRIPE_SECRET_KEY;
if (!key) {
  // Don't crash the whole app at import time in environments without billing;
  // routes that need Stripe will error clearly instead.
  console.warn("STRIPE_SECRET_KEY is not set — billing routes will fail.");
}

export const stripe = new Stripe(key ?? "");

// Single source of truth for plans. price_data is created inline so no Stripe
// dashboard Price IDs are required to start — easy to swap to real Price IDs later.
export const PLANS = {
  starter: { name: "Starter", amount: 9900, interval: "month" as const,
             blurb: "For a single facility getting audit-ready." },
  team: { name: "Team", amount: 24900, interval: "month" as const,
          blurb: "Up to 5 facilities, shared templates & reports." },
};
export type PlanId = keyof typeof PLANS;
