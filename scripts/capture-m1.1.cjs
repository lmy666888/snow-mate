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
  const out = path.resolve("docs/design/review/m1.1");
  await page.goto("http://127.0.0.1:8081/profile/photos");
  const chooser = page.waitForEvent("filechooser");
  await page
    .getByRole("button", { name: "Choose photos", exact: true })
    .click();
  await (
    await chooser
  ).setFiles([
    path.resolve("apps/mobile/assets/images/mountain.jpg"),
    path.resolve("apps/mobile/assets/images/rider.jpg"),
  ]);
  await page.getByText("Primary photo", { exact: true }).waitFor();
  async function settle() {
    await page.waitForLoadState("networkidle");
    await page.evaluate(() => document.fonts.ready);
    await page
      .locator("img")
      .evaluateAll((imgs) =>
        Promise.all(imgs.map((img) => img.decode().catch(() => {}))),
      );
  }
  await settle();
  await page.screenshot({ path: path.join(out, "13-photos-expanded.png") });
  await page.goto("http://127.0.0.1:8081/profile");
  await settle();
  await page.screenshot({ path: path.join(out, "12-profile-expanded.png") });
  await page.goto("http://127.0.0.1:8081/profile/settings");
  await settle();
  await page.screenshot({ path: path.join(out, "15-settings-expanded.png") });
  await page.getByRole("button", { name: "简体中文", exact: true }).click();
  await page.goto("http://127.0.0.1:8081/profile/region");
  await settle();
  await page.screenshot({ path: path.join(out, "14-region-expanded.png") });
  const board = await browser.newPage({ viewport: { width: 1460, height: 960 }, deviceScaleFactor: 1 });
  await board.route("http://review.local/**", (route) => {
    const name = new URL(route.request().url()).pathname.slice(1);
    return /^(01-discover-en|02-discover-zh|11-profile-redesign|09-settings-version)\.png$/.test(
      name,
    )
      ? route.fulfill({ path: path.join(out, name) })
      : route.abort();
  });
  await board.setContent(
    `<html><body style="margin:0;padding:30px;background:#fff1f4;color:#493541;font-family:Arial,sans-serif"><div style="display:flex;justify-content:space-between;align-items:end;margin-bottom:26px"><div><div style="font-size:12px;letter-spacing:4px;color:#885a7c;margin-bottom:12px">SNOWMATE / M1.1 DEVELOPMENT</div><div style="font-size:32px;font-weight:500;letter-spacing:-1px">A little more you. A world of shared lines.</div></div><div style="font-size:12px;color:#806572;text-align:right;line-height:20px">ENGLISH + 简体中文<br>Actual browser captures · fictional local demo</div></div><div style="display:flex;gap:24px">${["01-discover-en", "02-discover-zh", "11-profile-redesign", "09-settings-version"].map((name, i) => `<div style="flex:1;min-width:0"><div style="font-size:12px;letter-spacing:2px;color:#806572;margin-bottom:14px">${["01 / DISCOVER", "02 / 中文发现", "03 / YOUR PROFILE", "04 / SETTINGS"][i]}</div><img src="http://review.local/${name}.png" style="width:100%;border-radius:22px;border:1px solid #e8ceda"/></div>`).join("")}</div><div style="margin-top:20px;font-size:12px;color:#806572">Review candidate · no real authentication, cloud upload, real matching or iPhone verification</div></body></html>`,
  );
  await board
    .locator("img")
    .evaluateAll((imgs) => Promise.all(imgs.map((img) => img.decode())));
  await board.screenshot({ path: path.join(out, "00-overview.png") });
  await browser.close();
  console.log("Captured 4 expanded viewports and a real-screenshot overview.");
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
