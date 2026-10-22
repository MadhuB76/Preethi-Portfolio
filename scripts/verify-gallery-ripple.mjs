/* global process, console */
import { createServer } from "vite";
import assert from "node:assert/strict";
import { interests } from "../src/data/editorial.js";
const { chromium } = await import(
  process.env.PLAYWRIGHT_MODULE || "playwright"
);
const server = await createServer({
  server: { host: "127.0.0.1", port: 5185, strictPort: true },
});
let browser;
try {
  await server.listen();
  browser = await chromium.launch({ channel: "msedge", headless: true });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
  });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("http://127.0.0.1:5185/#interests");
  await page.waitForFunction(
    () =>
      +document.querySelector(".opening-experience").dataset.motionProgress >
      0.999,
  );
  await page.mouse.move(1, 1);
  await page.waitForFunction(
    () => document.querySelector("#interests").dataset.theme === "dancing",
    null,
    { timeout: 12000 },
  );
  assert.equal(
    await page.locator(".gallery-theme-note p").innerText(),
    interests[0].note,
  );
  const delays = await page
    .locator(".collage-frame")
    .evaluateAll((els) =>
      els.map((el) => parseFloat(el.style.getPropertyValue("--wave-delay"))),
    );
  assert.equal(delays[0], 0);
  assert.ok(Math.max(...delays) >= 400);
  await page.getByRole("button", { name: "Pause collection Ⅱ" }).click();
  await page.mouse.click(1390, 40);
  const paused = await page.locator("#interests").getAttribute("data-theme");
  await page.waitForTimeout(6300);
  assert.equal(
    await page.locator("#interests").getAttribute("data-theme"),
    paused,
    "pause holds the collection",
  );
  await page.getByRole("button", { name: "Play collection ▷" }).click();
  await page.mouse.click(1390, 40);
  await page.waitForFunction(
    () => document.querySelector("#interests").dataset.theme === "kdramas",
    null,
    { timeout: 10000 },
  );
  assert.equal(
    await page.locator(".gallery-theme-note p").innerText(),
    interests[1].note,
  );
  await page
    .getByRole("button", { name: "Explore Nature Exploration", exact: true })
    .hover();
  await page.waitForFunction(
    () => document.querySelector("#interests").dataset.theme === "nature",
  );
  const wave = await page
    .locator(".collage-frame")
    .evaluateAll((els) =>
      els.map((el) => parseFloat(el.style.getPropertyValue("--wave-delay"))),
    );
  assert.equal(wave[4], 0);
  assert.ok(wave.some((delay) => delay > 300));
  assert.equal(
    await page.locator("#interests").getAttribute("data-cycling"),
    "false",
  );
  await page.waitForTimeout(6500);
  assert.equal(
    await page.locator("#interests").getAttribute("data-theme"),
    "nature",
    "hover holds the selected theme",
  );
  await page.mouse.move(1, 1);
  await page.waitForFunction(
    () => document.querySelector("#interests").dataset.theme === "kdramas",
  );
  await page.waitForTimeout(1150);
  await page
    .locator("#interests img")
    .evaluateAll((els) => Promise.all(els.map((el) => el.decode())));
  await page.screenshot({ path: "artifacts/interests-monochrome-wave.png" });
  await page.evaluate(async () => {
    const { scrollToChapter } = await import("/src/lib/chapterNavigation.js");
    scrollToChapter("projects", { instant: true });
  });
  await page.waitForFunction(
    () => document.querySelector("#interests").dataset.cycling === "false",
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.waitForTimeout(300);
  assert.ok(
    await page
      .getByRole("button", { name: "Automatic motion off" })
      .isDisabled(),
  );
  assert.equal(
    await page
      .locator(".gallery-photo-current")
      .first()
      .evaluate((el) => getComputedStyle(el).animationName),
    "none",
  );
  assert.deepEqual(errors, []);
  console.log(
    "PASS: six-second cycle, notes, pause/resume, distance-based ripple origins, hover hold, offscreen pause, reduced-motion fallback.",
  );
} finally {
  await browser?.close();
  await server.close();
}
