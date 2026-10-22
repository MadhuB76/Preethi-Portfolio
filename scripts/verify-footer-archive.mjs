/* global process, console */
import { createServer } from "vite";
import assert from "node:assert/strict";
import { site } from "../src/data/editorial.js";
const { chromium } = await import(
  process.env.PLAYWRIGHT_MODULE || "playwright"
);
const server = await createServer({
  server: { host: "127.0.0.1", port: 5191, strictPort: true },
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
  await page.goto("http://127.0.0.1:5191/#contact");
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(900);
  assert.equal(
    await page.locator(".archive-wordmark h2").innerText(),
    "Preethi",
  );
  assert.equal(await page.locator('.archive-directory a[href="#"]').count(), 0);
  assert.equal(
    await page.locator('.archive-socials a[target="_blank"]').count(),
    site.socials.length,
  );
  if (!site.socials.length)
    assert.match(
      await page.locator(".archive-pending").innerText(),
      /coming soon/,
    );
  if (!site.socials.length)
    assert.deepEqual(
      await page.locator(".archive-social-name").allTextContents(),
      ["GitHub", "LinkedIn"],
    );
  assert.equal(
    await page
      .getByRole("navigation", { name: "Footer navigation" })
      .getByRole("link")
      .count(),
    4,
  );
  await page
    .locator(".archive-doodle-scene img")
    .evaluate((img) => img.decode());
  assert.ok(
    await page
      .locator(".archive-doodle-scene img")
      .evaluate((img) => img.naturalWidth > 0),
  );
  for (const [width, height] of [
    [1440, 1000],
    [1920, 1080],
    [768, 1024],
    [390, 844],
    [320, 667],
    [844, 390],
    [1366, 600],
    [1280, 640],
    [1024, 600],
  ]) {
    await page.setViewportSize({ width, height });
    await page.waitForTimeout(400);
    await page.locator("#contact").evaluate((el) => scrollTo(0, el.offsetTop));
    await page.waitForTimeout(250);
    const composition = await page.locator("#contact").evaluate((el) => {
      const section = el.getBoundingClientRect();
      const credits = el
        .querySelector(".archive-credits")
        .getBoundingClientRect();
      const wordmark = el
        .querySelector(".archive-wordmark h2")
        .getBoundingClientRect();
      return {
        height: section.height,
        overflow: el.scrollHeight - el.clientHeight,
        creditsBottom: credits.bottom - section.top,
        wordmarkBottom: wordmark.bottom - section.top,
        creditsTop: credits.top - section.top,
        isLast: !el.nextElementSibling,
      };
    });
    assert.ok(
      Math.abs(composition.height - height) <= 1,
      `one-screen footer at ${width}x${height}: ${JSON.stringify(composition)}`,
    );
    assert.ok(
      composition.overflow <= 1,
      `footer content fits at ${width}x${height}: ${JSON.stringify(composition)}`,
    );
    assert.ok(
      composition.creditsBottom <= height + 1 &&
        composition.wordmarkBottom <= composition.creditsTop + 1,
      `credits fit below wordmark at ${width}x${height}: ${JSON.stringify(composition)}`,
    );
    assert.ok(composition.isLast, "no separate strip after contact");
    assert.ok(
      await page.locator(".archive-credits > span").evaluateAll((elements) =>
        elements.every((el) => {
          const rect = el.getBoundingClientRect();
          return rect.left >= 0 && rect.right <= innerWidth + 1;
        }),
      ),
      `both credits are visible at ${width}x${height}`,
    );
    assert.ok(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      `no overflow at ${width}`,
    );
    assert.ok(
      await page
        .locator(".archive-wordmark h2")
        .evaluate((el) => el.scrollWidth <= el.clientWidth + 2),
      `wordmark fits at ${width}`,
    );
    const doodles = await page
      .locator(".archive-doodle-scene > *")
      .evaluateAll((els) =>
        els.map((el) => el.getBoundingClientRect().toJSON()),
      );
    for (let i = 0; i < doodles.length; i++)
      for (let j = i + 1; j < doodles.length; j++) {
        const a = doodles[i],
          b = doodles[j];
        assert.ok(
          !(
            a.x < b.x + b.width - 1 &&
            a.x + a.width > b.x + 1 &&
            a.y < b.y + b.height - 1 &&
            a.y + a.height > b.y + 1
          ),
          "footer doodles do not overlap at " + width + "x" + height,
        );
      }
    const links = await page
      .locator(".archive-directory a")
      .evaluateAll((els) =>
        els.map((el) => el.getBoundingClientRect().toJSON()),
      );
    assert.ok(
      links.every((box) => box.height >= 44),
      `touch targets at ${width}`,
    );
    for (let i = 0; i < links.length; i++)
      for (let j = i + 1; j < links.length; j++)
        assert.ok(
          !(
            links[i].x < links[j].x + links[j].width - 1 &&
            links[i].x + links[i].width > links[j].x + 1 &&
            links[i].y < links[j].y + links[j].height - 1 &&
            links[i].y + links[i].height > links[j].y + 1
          ),
          `links do not overlap at ${width}`,
        );
    await page
      .locator("#contact")
      .screenshot({ path: `artifacts/footer-archive-${width}.png` });
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page
    .getByRole("navigation", { name: "Footer navigation" })
    .getByRole("link", { name: /Projects/ })
    .click();
  await page.waitForTimeout(1200);
  assert.equal(
    await page
      .locator(".persistent-open")
      .getAttribute("class")
      .then((s) => s.includes("at-home")),
    false,
  );
  await page.goto("http://127.0.0.1:5191/#contact");
  await page.waitForTimeout(900);
  await page.getByRole("link", { name: "Preethi, back to home" }).click();
  await page.waitForTimeout(1200);
  assert.ok(
    await page
      .locator(".persistent-open")
      .getAttribute("class")
      .then((s) => s.includes("at-home")),
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("http://127.0.0.1:5191/#contact");
  await page
    .getByRole("navigation", { name: "Footer navigation" })
    .getByRole("link", { name: /Skills/ })
    .focus();
  assert.equal(await page.locator(":focus").getAttribute("href"), "#about");
  assert.deepEqual(errors, []);
  console.log(
    "PASS: footer wordmark, local doodles, truthful social placeholders, four working chapter links, keyboard access, reduced motion, nine responsive sizes, readable touch targets and no overflow.",
  );
} finally {
  await browser?.close();
  await server.close();
}
