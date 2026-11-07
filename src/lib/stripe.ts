import Stripe from "stripe";

// Author: Bob Robert. Builds do not need access to payment credentials.
let cachedClient: Stripe | undefined;
let cachedKey: string | undefined;

function getClient(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("Stripe is not configured");
  if (!cachedClient || cachedKey !== key) {
    cachedClient = new Stripe(key);
    cachedKey = key;
  }
  return cachedClient;
}

// Fail closed when billing is actually used, while allowing imports and builds
// without a payment key. Bind SDK methods to their real client instance.
export const stripe = new Proxy({} as Stripe, {
  get(_target, property) {
    const client = getClient();
    const value = Reflect.get(client, property, client);
    return typeof value === "function" ? value.bind(client) : value;
  },
});

// Single source of truth for plans. price_data is created inline so no Stripe
// dashboard Price IDs are required to start — easy to swap to real Price IDs later.
export const PLANS = {
  starter: { name: "Starter", amount: 9900, interval: "month" as const,
             blurb: "For a single facility getting audit-ready." },
  team: { name: "Team", amount: 24900, interval: "month" as const,
          blurb: "Up to 5 facilities, shared templates & reports." },
};
export type PlanId = keyof typeof PLANS;
