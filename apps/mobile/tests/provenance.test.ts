import { test } from "node:test";
import assert from "node:assert/strict";
import { offers, formatOffer } from "../src/features/pricing/data";
import { SENSOR_PROTOCOL_VERSION } from "../../../packages/sensor-protocol/src";
import { sessionFixture } from "../src/features/coach/fixtures";

test("demo offers cannot masquerade as verified live quotes", () => {
  assert.equal(new Set(offers.map((o) => o.id)).size, offers.length);
  for (const offer of offers) {
    assert.equal(offer.origin, "demo");
    assert.equal(offer.lastVerifiedAt, null);
    assert.equal(offer.sourceUrl, null);
    assert.match(offer.provider, /^Fictional /);
    assert.ok(offer.amount >= 0 && Number.isFinite(offer.amount));
    assert.equal(offer.currency, "USD");
  }
});

test("price formatting preserves USD amount", () => {
  assert.equal(formatOffer(129, "USD"), "$129");
  assert.equal(formatOffer(0, "USD"), "$0");
});

test("motion preview retains explicit synthetic provenance and versioned contract", () => {
  assert.equal(sessionFixture.origin, "synthetic");
  assert.match(sessionFixture.quality, /no sensor connected/);
  assert.equal(SENSOR_PROTOCOL_VERSION, "1.0.0");
});
