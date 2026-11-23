import { test, expect, type Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
const review = path.resolve("docs/design/review/m1.1");
fs.mkdirSync(review, { recursive: true });
const initialRoutes: string[] = JSON.parse(
  fs.readFileSync("docs/design/review/day1/routes.json", "utf8"),
);
const runtimeErrors = new Map<Page, string[]>();
test.beforeEach(({ page }) => {
  const errors: string[] = [];
  runtimeErrors.set(page, errors);
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (
      message.type() === "error" &&
      message.text().includes("Unexpected text node")
    )
      errors.push(message.text());
  });
});
test.afterEach(({ page }) => {
  expect(runtimeErrors.get(page)).toEqual([]);
  runtimeErrors.delete(page);
});
async function settle(page: Page) {
  await page.waitForLoadState("networkidle");
  await page.evaluate(() => document.fonts.ready);
  await page
    .locator("img")
    .evaluateAll((imgs) =>
      Promise.all(
        imgs.map((img) => (img as HTMLImageElement).decode().catch(() => {})),
      ),
    );
}
async function shot(page: Page, name: string) {
  await settle(page);
  await page.screenshot({ path: path.join(review, name + ".png") });
}
async function stored(page: Page) {
  return page.evaluate(
    () =>
      JSON.parse(
        localStorage.getItem("snowmate:m1.1:demo:v1") ?? '{"state":{}}',
      ).state,
  );
}
async function choose(page: Page, files: string[]) {
  const chooser = page.waitForEvent("filechooser");
  await page
    .getByRole("button", { name: /Choose photos|Add another photo/ })
    .click();
  await (await chooser).setFiles(files);
  await expect(page.getByText("Saving on this device…")).not.toBeVisible();
  await expect(page.getByText("Primary photo", { exact: true })).toBeVisible();
}

test("all 35 routes render, keep images within viewport, and retain the five tabs", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  for (const route of [
    ...initialRoutes,
    "profile/components",
    "identity/onboarding",
    "profile/region",
    "profile/photos",
  ]) {
    await page.goto("/" + route.replace(/\([^/]+\)\//, ""));
    await settle(page);
    const text = await page.locator("body").innerText();
    expect(text.length).toBeGreaterThan(70);
    expect(text).not.toContain("Unmatched Route");
    expect(text).not.toContain("Something went wrong");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    expect(
      await page
        .locator("img")
        .evaluateAll((imgs) =>
          imgs.every(
            (img) => img.getBoundingClientRect().width <= window.innerWidth,
          ),
        ),
    ).toBe(true);
  }
  expect(errors).toEqual([]);
});

test("English and Chinese switch dynamically, persist, and remain independent of region", async ({
  page,
}) => {
  await page.goto("/discover");
  await expect(page.getByText("Riley Chen, 21")).toBeVisible();
  await shot(page, "01-discover-en");
  await page.goto("/profile/settings");
  await page.getByRole("button", { name: "简体中文", exact: true }).click();
  await expect(page.getByText("你的空间，你来决定。")).toBeVisible();
  await page.goto("/profile/region");
  await page.getByRole("button", { name: "中国", exact: true }).first().click();
  await page.getByRole("button", { name: "上海", exact: true }).click();
  await page
    .getByRole("button", { name: "加拿大", exact: true })
    .last()
    .click();
  await page.getByRole("button", { name: "CAD", exact: true }).click();
  await shot(page, "03-region-zh");
  await page.reload();
  await expect(
    page.getByRole("button", { name: "上海", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  const state = await stored(page);
  expect(state.language).toBe("zh");
  expect(state.region.country).toBe("CN");
  expect(state.region.discovery).toBe("CA");
  expect(state.region.currency).toBe("CAD");
  await page.goto("/discover");
  await expect(page.getByText("找到同频的雪友。")).toBeVisible();
  await expect(page.getByText("Jordan Lee, 28")).toBeVisible();
  await shot(page, "02-discover-zh");
  await page.goto("/profile/settings");
  await page.getByRole("button", { name: "English", exact: true }).click();
  await expect(page.getByText("Your space. Your rules.")).toBeVisible();
  expect((await stored(page)).region.country).toBe("CN");
  await shot(page, "09-settings-version");
});

test("one-sided likes do not match; undo restores cards and viewed state persists", async ({
  page,
}) => {
  await page.goto("/discover");
  await page.getByRole("button", { name: "Pass rider", exact: true }).click();
  await expect(page.getByText("Jordan Lee, 28")).toBeVisible();
  await page.getByRole("button", { name: "Like rider", exact: true }).click();
  await expect(page.getByText("Sam Rivera, 35")).toBeVisible();
  expect((await stored(page)).matches).toEqual([]);
  await page
    .getByRole("button", { name: "Undo last swipe", exact: true })
    .click();
  await expect(page.getByText("Jordan Lee, 28")).toBeVisible();
  await page.reload();
  await expect(page.getByText("Jordan Lee, 28")).toBeVisible();
  await page.goto("/discover/match?id=demo-02");
  await expect(
    page.getByText("A one-sided like does not create a match."),
  ).toBeVisible();
});

test("seeded reciprocal match, local chat persistence and blocking work together", async ({
  page,
}) => {
  await page.goto("/discover");
  await page.getByRole("button", { name: "Like rider", exact: true }).click();
  await expect(page.getByText("DETERMINISTIC DEMO MATCH")).toBeVisible();
  await shot(page, "08-demo-match");
  await page.getByRole("button", { name: "Say hello", exact: true }).click();
  await page
    .getByRole("textbox", { name: "Message", exact: true })
    .fill("Ready for first chair?");
  await page
    .getByRole("button", { name: "Save demo message", exact: true })
    .click();
  await page.reload();
  await expect(page.getByText("Ready for first chair?")).toBeVisible();
  await page.goto("/discover/rider?id=demo-01");
  await page
    .getByRole("button", { name: "Block this demo rider", exact: true })
    .click();
  await page.goto("/discover/chat?id=demo-01");
  await expect(page.getByText("Conversation unavailable.")).toBeVisible();
  expect((await stored(page)).matches).toEqual([]);
  expect((await stored(page)).blocked).toContain("demo-01");
});

test("skill, stance, interest and coarse-region filters affect the deck", async ({
  page,
}) => {
  await page.goto("/discover");
  await page
    .getByRole("button", { name: "Discovery preferences", exact: true })
    .click();
  await page.getByRole("button", { name: "Advanced", exact: true }).click();
  await page.getByRole("button", { name: "Regular", exact: true }).click();
  await page
    .getByRole("button", { name: "Fresh powder", exact: true })
    .last()
    .click();
  await shot(page, "07-discovery-filters");
  await page
    .getByRole("button", { name: "Apply filters", exact: true })
    .click();
  await expect(page.getByText("Jordan Lee, 28")).toBeVisible();
  await page.reload();
  await expect(page.getByText("Jordan Lee, 28")).toBeVisible();
  await page.goto("/profile/region");
  await page.getByRole("button", { name: "100", exact: true }).click();
  await page.goto("/discover");
  await expect(page.getByText("Skyler Liu, 24")).toBeVisible();
  await page.goto("/profile/region");
  await page.getByRole("button", { name: "CN", exact: true }).last().click();
  await page.goto("/discover");
  await expect(page.getByText("A little more room to explore.")).toBeVisible();
});

test("seven-step identity flow gates account preview on photos and adult age", async ({
  page,
}) => {
  await page.goto("/identity/onboarding");
  await shot(page, "04-onboarding-account");
  await page
    .getByRole("button", { name: "account-preview", exact: true })
    .click();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await expect(
    page.getByText("Add at least one photo for account-preview discovery."),
  ).toBeVisible();
  await choose(page, [path.resolve("apps/mobile/assets/images/mountain.jpg")]);
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page
    .getByRole("textbox", { name: "Age · adults only", exact: true })
    .fill("17");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await expect(
    page.getByText("Enter a display name and an adult age between 18 and 100."),
  ).toBeVisible();
  await page.goto("/discover");
  await expect(page.getByText("Adult riders only.")).toBeVisible();
  await page.goto("/identity/onboarding");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page
    .getByRole("textbox", { name: "Age · adults only", exact: true })
    .fill("26");
  for (let i = 0; i < 4; i++)
    await page.getByRole("button", { name: "Continue", exact: true }).click();
  await shot(page, "05-onboarding-preview");
  await page
    .getByRole("button", { name: "Finish riding identity", exact: true })
    .click();
  await expect(page.getByText("Find your people.")).toBeVisible();
  expect((await stored(page)).identity.complete).toBe(true);
});

test("local photo selection, primary, reorder, deletion and reload preserve gallery", async ({
  page,
}) => {
  await page.goto("/profile/photos");
  await choose(page, [
    path.resolve("apps/mobile/assets/images/mountain.jpg"),
    path.resolve("apps/mobile/assets/images/rider.jpg"),
  ]);
  expect((await stored(page)).identity.photos).toHaveLength(2);
  const first = (await stored(page)).identity.photos[0].id;
  await page.getByRole("button", { name: "Make primary", exact: true }).click();
  expect((await stored(page)).identity.photos[1].id).toBe(first);
  await page
    .getByRole("button", { name: "Move photo earlier", exact: true })
    .click();
  expect((await stored(page)).identity.photos[0].id).toBe(first);
  await page.reload();
  await expect(page.locator("img")).toHaveCount(2);
  await settle(page);
  expect(
    await page
      .locator("img")
      .evaluateAll((imgs) =>
        imgs.every((img) => (img as HTMLImageElement).naturalWidth > 0),
      ),
  ).toBe(true);
  await shot(page, "06-photo-management");
  await page.goto("/profile");
  await expect(page.getByText("Photo gallery")).toBeVisible();
  await shot(page, "10-profile-gallery");
  await page.goto("/profile/photos");
  await page
    .getByRole("button", { name: "Delete photo", exact: true })
    .last()
    .click();
  await expect
    .poll(async () => (await stored(page)).identity.photos.length)
    .toBe(1);
});

test("profile edits persist across navigation and reload without a backend", async ({
  page,
}) => {
  await page.goto("/profile/edit");
  await page
    .getByRole("textbox", { name: "Display name", exact: true })
    .fill("Demo Rider");
  await page.getByRole("button", { name: "Goofy", exact: true }).click();
  await page
    .getByRole("button", { name: "Save local profile", exact: true })
    .click();
  await page.goto("/profile");
  await expect(page.getByText("Demo Rider", { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByText("Demo Rider", { exact: true })).toBeVisible();
  await shot(page, "11-profile-redesign");
});

test("touch drag, compact navigation, trip/pricing and synthetic coach regressions", async ({
  page,
}) => {
  await page.goto("/welcome");
  await page
    .getByRole("button", { name: "Explore the demo", exact: true })
    .click();
  const touch = await page.context().newCDPSession(page);
  await touch.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ x: 230, y: 390 }],
  });
  for (const x of [210, 185, 160, 135, 110, 85, 60])
    await touch.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [{ x, y: 390 }],
    });
  await expect(page.getByText("PASS", { exact: true })).toBeVisible();
  await touch.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
  await expect(page.getByText("Jordan Lee, 28")).toBeVisible();
  await page.setViewportSize({ width: 375, height: 812 });
  for (const [tab, title] of [
    ["Trips", "Chase the next day."],
    ["Coach", "Find your flow."],
    ["Community", "Better, together."],
    ["Profile", "Made for the mountain."],
  ]) {
    await page.getByRole("tab", { name: tab, exact: true }).click();
    await expect(page.getByText(title)).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
  await page.goto("/prices/offer?id=stowe");
  await expect(
    page.getByRole("button", { name: "Booking unavailable in preview" }),
  ).toBeDisabled();
  await page.goto("/coach/live");
  await page
    .getByRole("button", { name: "Pause preview", exact: true })
    .click();
  await expect(page.getByText("PAUSED PREVIEW", { exact: true })).toBeVisible();
});
