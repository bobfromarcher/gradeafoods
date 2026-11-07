// Author: Bob Robert.
import assert from "node:assert/strict";
import { test } from "node:test";
import { PLANS, stripe } from "../src/lib/stripe";

function withKey(value: string | undefined, check: () => void) {
  const previous = process.env.STRIPE_SECRET_KEY;
  if (value === undefined) delete process.env.STRIPE_SECRET_KEY;
  else process.env.STRIPE_SECRET_KEY = value;
  try {
    check();
  } finally {
    if (previous === undefined) delete process.env.STRIPE_SECRET_KEY;
    else process.env.STRIPE_SECRET_KEY = previous;
  }
}

test("plan data and module import work without payment credentials", () => {
  withKey(undefined, () => assert.equal(PLANS.starter.amount, 9900));
});

test("billing access fails closed when the key is missing or empty", () => {
  for (const key of [undefined, ""]) {
    withKey(key, () => assert.throws(() => stripe.checkout, /not configured/));
  }
});

test("configured client exposes SDK methods without a network request", () => {
  withKey("synthetic-test-key-one", () => {
    assert.equal(typeof stripe.checkout.sessions.create, "function");
    assert.equal(typeof stripe.webhooks.constructEvent, "function");
  });
});

test("replacing configuration does not reuse the prior client", () => {
  let prior: unknown;
  withKey("synthetic-test-key-one", () => { prior = stripe.checkout; });
  withKey("synthetic-test-key-two", () => assert.notEqual(stripe.checkout, prior));
  withKey(undefined, () => assert.throws(() => stripe.checkout, /not configured/));
});
