import { test, expect } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
const review = path.resolve("docs/design/review/day1");
const routes: string[] = JSON.parse(
  fs.readFileSync(path.join(review, "routes.json"), "utf8"),
);
async function settle(page: import("@playwright/test").Page) {
  await page.waitForLoadState("networkidle");
  await page
    .locator("img")
    .evaluateAll((imgs) =>
      Promise.all(
        imgs.map((img) => (img as HTMLImageElement).decode().catch(() => {})),
      ),
    );
}

test("every primary and secondary route renders without runtime errors", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const screenshots: Record<string, string> = {
    "(tabs)/discover": "01-discover",
    "(tabs)/trips": "02-trips",
    "(tabs)/coach": "03-coach",
    "(tabs)/community": "04-community",
    "(tabs)/profile": "05-profile",
    "(auth)/welcome": "06-welcome",
    "(auth)/sign-in": "07-auth",
    "(auth)/setup": "08-profile-setup",
    "(auth)/preferences": "09-preferences",
    "discover/rider": "10-rider-profile",
    "discover/match": "11-match-modal",
    "trips/planner": "12-trip-planner",
    "prices/compare": "13-price-comparison",
    "coach/live": "14-motion-preview",
    "trips/detail": "15-trip-detail",
  };
  for (const route of [...routes, "profile/components"]) {
    const url = "/" + route.replace(/\([^/]+\)\//, "");
    await page.goto(url);
    await settle(page);
    await expect(page.locator("body")).not.toContainText("Unmatched Route");
    await expect(page.locator("body")).not.toContainText(
      "Something went wrong",
    );
    expect(
      (await page.locator("body").innerText()).trim().length,
    ).toBeGreaterThan(80);
    // No page-level horizontal overflow at the review iPhone viewport.
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
    if (screenshots[route])
      await page.screenshot({
        path: path.join(review, `${screenshots[route]}.png`),
      });
  }
  expect(errors).toEqual([]);
});

test("onboarding skip, five tabs, planner and price navigation work", async ({
  page,
}) => {
  await page.goto("/welcome");
  await page
    .getByRole("button", { name: "Explore the demo", exact: true })
    .click();
  await expect(page.getByText("Find your people.")).toBeVisible();
  for (const [name, title] of [
    ["Trips", "Chase the next day."],
    ["Coach", "Find your flow."],
    ["Community", "Better, together."],
    ["Profile", "Made for the mountain."],
    ["Discover", "Find your people."],
  ]) {
    await page.getByRole("tab", { name, exact: true }).click();
    await expect(page.getByText(title)).toBeVisible();
  }
  await page.getByRole("tab", { name: "Trips", exact: true }).click();
  await page.getByRole("button", { name: "Plan a mountain escape" }).click();
  await page
    .getByRole("textbox", { name: "Starting location", exact: true })
    .fill("New York, NY");
  await page.getByRole("button", { name: "Preview sample itinerary" }).click();
  await expect(page.getByText("Your weekend, imagined.")).toBeVisible();
  await page.goto("/prices/compare");
  await expect(
    page.getByText("All prices are fictional demo data."),
  ).toBeVisible();
  await page.getByRole("button", { name: "View Stowe Mountain offer" }).click();
  await expect(page.getByText("Never · demo fixture")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Booking unavailable in preview" }),
  ).toBeDisabled();
});

test("swipe buttons, match modal and temporary chat work", async ({ page }) => {
  await page.goto("/discover");
  await page.getByRole("button", { name: "Pass rider", exact: true }).click();
  await expect(page.getByText("Jordan, 28")).toBeVisible();
  await page
    .getByRole("button", { name: "Like rider and preview match" })
    .click();
  await expect(page.getByText("Same mountain.")).toBeVisible();
  await page.getByRole("button", { name: "Say hello", exact: true }).click();
  await page
    .getByRole("textbox", { name: "Message", exact: true })
    .fill("Ready for first chair?");
  await page.getByRole("button", { name: "Preview send" }).click();
  await expect(page.getByText("Ready for first chair?")).toBeVisible();
});

test("profile edit and save-trip preview survive navigation but not reload", async ({
  page,
}) => {
  await page.goto("/profile/edit");
  await page
    .getByRole("textbox", { name: "Display name", exact: true })
    .fill("Demo Rider");
  await page.getByRole("button", { name: "Goofy", exact: true }).click();
  await page
    .getByRole("button", { name: "Save profile preview", exact: true })
    .click();
  await page.getByRole("button", { name: "Go back", exact: true }).click();
  await page.getByRole("tab", { name: "Profile", exact: true }).click();
  await expect(page.getByText("Demo Rider", { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByText("Alex Morgan", { exact: true })).toBeVisible();
  await page.goto("/trips/detail");
  await page
    .getByRole("button", { name: "Save this trip", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Saved in preview" }),
  ).toBeVisible();
});

test("coach clearly labels fixtures and exposes paused/disconnected states", async ({
  page,
}) => {
  await page.goto("/coach/live");
  await expect(
    page.getByText("Motion simulation · static chart fixture"),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Pause preview", exact: true })
    .click();
  await expect(page.getByText("PAUSED PREVIEW", { exact: true })).toBeVisible();
  await page
    .getByRole("button", { name: "Preview disconnected state" })
    .click();
  await expect(page.getByText("DISCONNECTED PREVIEW")).toBeVisible();
});

test("compact viewport keeps main navigation and cards usable", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  for (const route of [
    "/discover",
    "/trips",
    "/coach",
    "/community",
    "/profile",
  ]) {
    await page.goto(route);
    await settle(page);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    await expect(
      page.getByRole("tab", { name: "Profile", exact: true }),
    ).toBeVisible();
  }
});

test("horizontal card dragging moves the card and advances the fixture deck", async ({
  page,
}) => {
  await page.goto("/discover");
  await expect(page.getByText("Riley, 26")).toBeVisible();
  const touch = await page.context().newCDPSession(page);
  await touch.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ x: 230, y: 360 }],
  });
  for (const x of [210, 185, 160, 135, 110, 85, 60]) {
    await touch.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [{ x, y: 360 }],
    });
  }
  await expect(page.getByText("PASS", { exact: true })).toBeVisible();
  await touch.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
  await expect(page.getByText("Jordan, 28")).toBeVisible();
});
