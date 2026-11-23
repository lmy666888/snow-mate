import { test } from "node:test";
import assert from "node:assert/strict";
import {
  demoRiders,
  demoRepository,
  defaultFilters,
} from "../src/features/social/demoRepository";
import {
  applySwipe,
  undoSwipe,
  appendMessage,
  blockRider,
  initialSocial,
} from "../src/features/social/logic";
import {
  defaultRegion,
  distanceKm,
  displayDistance,
  formatMoney,
} from "../src/features/regions/model";
import {
  defaultIdentity,
  eligibility,
  validatePhoto,
} from "../src/features/identity/model";
import { en, zh } from "../src/i18n/resources";
import i18n, { tr } from "../src/i18n";

test("40 deterministic fictional adults cover countries, skills, stances and unique placeholders", () => {
  assert.equal(demoRiders.length, 40);
  assert.equal(new Set(demoRiders.map((r) => r.id)).size, 40);
  assert.equal(new Set(demoRiders.map((r) => r.name)).size, 40);
  assert.deepEqual([...new Set(demoRiders.map((r) => r.country))].sort(), [
    "CA",
    "CN",
    "US",
  ]);
  assert.equal(new Set(demoRiders.map((r) => r.level)).size, 4);
  assert.equal(new Set(demoRiders.map((r) => r.stance)).size, 2);
  assert.ok(
    demoRiders.every(
      (r) =>
        r.origin === "fictional" && r.age >= 18 && r.interests.length === 3,
    ),
  );
});
test("all discovery filters and history/blocks affect the actual result set", () => {
  const all = demoRepository.list(defaultRegion, defaultFilters, initialSocial);
  assert.equal(all.length, 40);
  const filtered = demoRepository.list(
    { ...defaultRegion, discovery: "CA" },
    { level: "Advanced", stance: "Regular", interest: "Fresh powder" },
    initialSocial,
  );
  assert.ok(filtered.length > 0);
  assert.ok(
    filtered.every(
      (r) =>
        r.country === "CA" &&
        r.level === "Advanced" &&
        r.stance === "Regular" &&
        r.interests.includes("Fresh powder"),
    ),
  );
  const excluded = demoRepository.list(defaultRegion, defaultFilters, {
    viewed: ["demo-01"],
    blocked: ["demo-02"],
  });
  assert.equal(excluded.length, 38);
  const nearby = demoRepository.list(
    { ...defaultRegion, maxDistanceKm: 100 },
    defaultFilters,
    initialSocial,
  );
  assert.ok(nearby.length < 40);
  assert.ok(nearby.every((r) => r.city === "Boston"));
});
test("one-sided likes never match; seeded reciprocity, undo, chat and block are coherent", () => {
  const unilateral = applySwipe(initialSocial, "demo-02", "like");
  assert.deepEqual(unilateral.matches, []);
  assert.equal(appendMessage(unilateral, "demo-02", "hello"), unilateral);
  const matched = applySwipe(initialSocial, "demo-01", "like");
  assert.deepEqual(matched.matches, ["demo-01"]);
  assert.equal(matched.chats["demo-01"].length, 1);
  assert.deepEqual(undoSwipe(matched), initialSocial);
  const chatting = appendMessage(matched, "demo-01", "  first chair?  ");
  assert.equal(chatting.chats["demo-01"][1].body, "first chair?");
  assert.equal(undoSwipe(chatting), chatting);
  const blocked = blockRider(chatting, "demo-01");
  assert.deepEqual(blocked.matches, []);
  assert.equal(blocked.chats["demo-01"], undefined);
  assert.equal(appendMessage(blocked, "demo-01", "hello"), blocked);
  assert.equal(applySwipe(matched, "demo-01", "like"), matched);
});
test("adult and photo eligibility applies to local account preview without pretending authentication", () => {
  assert.equal(eligibility(defaultIdentity), null);
  assert.equal(eligibility({ ...defaultIdentity, age: 17 }), "adult-required");
  assert.equal(eligibility({ ...defaultIdentity, age: NaN }), "adult-required");
  assert.equal(
    eligibility({ ...defaultIdentity, mode: "account-preview" }),
    "photo-required",
  );
  const photo = {
    id: "fixture",
    uri: "local-fixture",
    mimeType: "image/jpeg",
    bytes: 4,
    status: "local" as const,
  };
  assert.equal(
    eligibility({
      ...defaultIdentity,
      mode: "account-preview",
      photos: [photo],
    }),
    "onboarding-required",
  );
  assert.equal(
    eligibility({
      ...defaultIdentity,
      mode: "account-preview",
      complete: true,
      photos: [photo],
    }),
    null,
  );
});
test("photo byte signatures, declared MIME and size must all be valid", () => {
  assert.equal(
    validatePhoto(new Uint8Array([255, 216, 255, 1]), "image/jpeg"),
    null,
  );
  assert.notEqual(
    validatePhoto(new Uint8Array([255, 216, 255]), "image/png"),
    null,
  );
  assert.notEqual(validatePhoto(new Uint8Array([]), "image/jpeg"), null);
  assert.notEqual(
    validatePhoto(new Uint8Array(5 * 1024 * 1024 + 1), "image/jpeg"),
    null,
  );
  assert.notEqual(
    validatePhoto(new Uint8Array([80, 68, 70]), "application/pdf"),
    null,
  );
});
test("translation resources have exact key parity, interpolation parity and dynamic switching", async () => {
  assert.deepEqual(Object.keys(en).sort(), Object.keys(zh).sort());
  assert.ok(Object.keys(en).length > 500);
  for (const [key, value] of Object.entries(zh)) {
    assert.ok(value.trim(), key);
    assert.deepEqual(
      value.match(/\{\{\w+\}\}/g)?.sort() ?? [],
      en[key].match(/\{\{\w+\}\}/g)?.sort() ?? [],
      key,
    );
  }
  await i18n.changeLanguage("zh");
  assert.equal(tr("Find your people."), "找到同频的雪友。");
  assert.equal(tr("View Stowe Mountain offer"), "查看 Stowe Mountain 报价");
  await i18n.changeLanguage("en");
  assert.equal(tr("Find your people."), "Find your people.");
});
test("locale formatting does not change region or fabricate currency conversion", () => {
  assert.equal(distanceKm("Boston", "Boston"), 0);
  assert.ok(distanceKm("Boston", "Vancouver") > 3000);
  assert.match(displayDistance(1609.344, "mi", "en"), /1,000 mi/);
  assert.notEqual(formatMoney(129, "USD", "zh"), formatMoney(129, "CNY", "zh"));
});

test("persisted settings recover safely from corrupt fields without accepting remote photo URIs", async () => {
  const { normalizePersisted } =
    await import("../src/features/social/persistence");
  const recovered = normalizePersisted({
    language: "xx",
    region: { country: "bad", city: "nowhere" },
    identity: {
      age: 17,
      photos: [
        {
          id: "photo-1",
          uri: "https://private.invalid/image",
          bytes: 100,
          status: "local",
          mimeType: "image/jpeg",
        },
      ],
    },
    matches: ["demo-02", "unknown"],
    blocked: ["unknown"],
  });
  assert.equal(
    eligibility(normalizePersisted({ identity: { age: null } }).identity),
    "adult-required",
  );
  assert.equal(recovered.language, "en");
  assert.equal(recovered.region.city, "Boston");
  assert.equal(recovered.identity.photos.length, 0);
  assert.equal(eligibility(recovered.identity), "adult-required");
  assert.deepEqual(recovered.matches, []);
});

test("demo release labeling remains explicitly non-production in both languages", async () => {
  await i18n.changeLanguage("zh");
  assert.equal(
    tr("Snowmate M1.1 · Demo Release Candidate"),
    "Snowmate M1.1 · 演示候选版",
  );
  await i18n.changeLanguage("en");
  assert.equal(
    tr("Snowmate M1.1 · Demo Release Candidate"),
    "Snowmate M1.1 · Demo Release Candidate",
  );
});
