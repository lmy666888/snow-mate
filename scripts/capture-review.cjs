// Capture an additional overview from the running local Expo web prototype.
// Full Chromium is selected because this host's headless-shell GPU process fails.
const { chromium } = require("@playwright/test");
const path = require("node:path");
(async () => {
  const browser = await chromium.launch({ channel: "chromium" });
  const page = await browser.newPage({
    viewport: { width: 393, height: 2200 },
    deviceScaleFactor: 1,
    isMobile: true,
    hasTouch: true,
    reducedMotion: "reduce",
  });
  const out = path.resolve("docs/design/review/day1");
  for (const [route, file] of [
    ["trips/planner", "16-trip-planner-expanded"],
    ["prices/compare", "17-prices-expanded"],
    ["trips/detail", "18-itinerary-expanded"],
  ]) {
    await page.goto("http://127.0.0.1:8081/" + route);
    await page.waitForLoadState("networkidle");
    await page
      .locator("img")
      .evaluateAll((imgs) =>
        Promise.all(imgs.map((img) => img.decode().catch(() => {}))),
      );
    await page.screenshot({ path: path.join(out, file + ".png") });
  }
  // Review contact sheet uses the actual saved screenshots, no mock UI recreation.
  await page.setViewportSize({ width: 1340, height: 690 });
  await page.route("http://review.local/**", (route) => {
    const name = new URL(route.request().url()).pathname.slice(1);
    const allowed =
      /^0[1-5]-(discover|trips|coach|community|profile)\.png$/.test(name);
    return allowed
      ? route.fulfill({ path: path.join(out, name) })
      : route.abort();
  });
  await page.setContent(
    `<html><body style="margin:0;background:#fff1f4;color:#493541;font-family:Arial,sans-serif;padding:28px"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px"><div><div style="font-size:11px;letter-spacing:4px;color:#885a7c;margin-bottom:10px">SNOWMATE / DAY 01</div><div style="font-size:30px;font-weight:600;letter-spacing:-1px">A season starts with a connection.</div></div><div style="font-size:12px;color:#806572;text-align:right;line-height:21px">UI REVIEW · FIVE PRIMARY TABS<br>Browser captures · 393 × 852 · fictional demo</div></div><div style="display:flex;gap:18px">${["01-discover", "02-trips", "03-coach", "04-community", "05-profile"].map((n, i) => `<div style="flex:1;min-width:0"><div style="color:#806572;font-size:11px;letter-spacing:2px;margin-bottom:12px">0${i + 1} / ${["DISCOVER", "TRIPS", "COACH", "COMMUNITY", "PROFILE"][i]}</div><img src="http://review.local/${n}.png" style="width:100%;border-radius:18px;border:1px solid #e8ceda" /></div>`).join("")}</div></body></html>`,
  );
  await page
    .locator("img")
    .evaluateAll((imgs) => Promise.all(imgs.map((img) => img.decode())));
  await page.screenshot({ path: path.join(out, "00-overview.png") });
  await browser.close();
  console.log(
    "Captured 3 expanded viewport screenshots and 1 five-tab overview.",
  );
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
