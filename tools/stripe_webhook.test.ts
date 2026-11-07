// Author: Bob Robert. All signatures and events are synthetic and stay local.
import assert from "node:assert/strict";
import { test } from "node:test";
import { NextRequest } from "next/server";
import Stripe from "stripe";
import { POST } from "../src/app/api/stripe/webhook/route";

const body = JSON.stringify({ id: "evt_synthetic_local", object: "event", type: "synthetic.test", data: { object: {} } });
const signingSecret = "synthetic-signing-secret-local-only";

async function callback(configured: string | undefined, signature?: string, payload = body) {
  const priorSigning = process.env.STRIPE_WEBHOOK_SECRET;
  const priorApi = process.env.STRIPE_SECRET_KEY;
  if (configured === undefined) delete process.env.STRIPE_WEBHOOK_SECRET;
  else process.env.STRIPE_WEBHOOK_SECRET = configured;
  delete process.env.STRIPE_SECRET_KEY;
  try {
    const headers = signature ? { "stripe-signature": signature } : undefined;
    return await POST(new NextRequest("http://127.0.0.1/api/stripe/webhook", { method: "POST", body: payload, headers }));
  } finally {
    if (priorSigning === undefined) delete process.env.STRIPE_WEBHOOK_SECRET;
    else process.env.STRIPE_WEBHOOK_SECRET = priorSigning;
    if (priorApi === undefined) delete process.env.STRIPE_SECRET_KEY;
    else process.env.STRIPE_SECRET_KEY = priorApi;
  }
}

test("missing or blank signing configuration never accepts a callback", async () => {
  for (const value of [undefined, "", " , "]) {
    assert.equal((await callback(value)).status, 503);
  }
});

test("configured callback rejects a missing signature", async () => {
  assert.equal((await callback(signingSecret)).status, 400);
});

test("configured callback rejects a forged signature", async () => {
  const forged = Stripe.webhooks.generateTestHeaderString({ payload: body, secret: "wrong-synthetic-key" });
  assert.equal((await callback(signingSecret, forged)).status, 400);
});

test("valid signature is verified locally without a payment API key", async () => {
  const signature = Stripe.webhooks.generateTestHeaderString({ payload: body, secret: signingSecret });
  const response = await callback(signingSecret, signature);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { received: true });
});

test("rotation can verify a valid second configured signing secret", async () => {
  const signature = Stripe.webhooks.generateTestHeaderString({ payload: body, secret: signingSecret });
  assert.equal((await callback("old-synthetic-key, " + signingSecret, signature)).status, 200);
});

test("signed content cannot be changed after signing", async () => {
  const signature = Stripe.webhooks.generateTestHeaderString({ payload: body, secret: signingSecret });
  assert.equal((await callback(signingSecret, signature, body.replace("synthetic.test", "checkout.session.completed"))).status, 400);
});
