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
  assert.equal(await page.locator(".footer-wordmark").innerText(), "Preethi");
  assert.equal(await page.locator(".footer-garden").count(), 1);
  assert.deepEqual(
    await page
      .locator(".footer-socials a")
      .evaluateAll((els) => els.map((el) => el.href)),
    site.socials.map((s) => s.url),
  );
  assert.equal(
    await page
      .getByRole("navigation", { name: "Footer navigation" })
      .getByRole("link")
      .count(),
    0,
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
    await page.waitForTimeout(600);
    await page.locator("#contact").scrollIntoViewIfNeeded();
    assert.ok(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      `no overflow ${width}`,
    );
    assert.ok(
      await page
        .locator(".footer-wordmark")
        .evaluate((el) => el.scrollWidth <= el.clientWidth + 2),
      `wordmark fits ${width}`,
    );
    const boxes = await page
      .locator(".footer-back-top,.footer-socials a")
      .evaluateAll((els) =>
        els.map((el) => el.getBoundingClientRect().toJSON()),
      );
    assert.ok(
      boxes.every((b) => b.height >= 44),
      "touch targets",
    );
    for (let i = 0; i < boxes.length; i++)
      for (let j = i + 1; j < boxes.length; j++) {
        const a = boxes[i],
          b = boxes[j];
        assert.ok(
          !(
            a.x < b.x + b.width - 1 &&
            a.x + a.width > b.x + 1 &&
            a.y < b.y + b.height - 1 &&
            a.y + a.height > b.y + 1
          ),
          "no overlapping links",
        );
      }
    assert.ok(
      await page
        .locator("#contact")
        .evaluate((el) => {
          const bounds = el.getBoundingClientRect();
          return [...el.children].every(child => {
            const box = child.getBoundingClientRect();
            return box.top >= bounds.top && box.bottom <= bounds.bottom + 1;
          });
        }),
      `footer contents not clipped ${width}`,
    );
    const placement = await page.evaluate(() => {
      const back = document.querySelector('.footer-back-top').getBoundingClientRect();
      const word = document.querySelector('.footer-wordmark').getBoundingClientRect();
      const section = document.querySelector('#contact').getBoundingClientRect();
      return { left: back.left < word.left, bottom: section.bottom - word.bottom,
        compact: section.height <= Math.max(innerHeight, 500),
        socialSize: parseFloat(getComputedStyle(document.querySelector('.footer-socials a')).fontSize) };
    });
    assert.ok(placement.left && placement.bottom <= 26, `bottom left/right alignment ${width}`);
    assert.ok(placement.compact && placement.socialSize >= 26, `compact emphasized footer ${width}`);
    await page
      .locator("#contact")
      .screenshot({ path: `artifacts/footer-minimal-${width}.png` });
  }
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.locator('.footer-back-top').click();
  await page.waitForTimeout(600);
  assert.ok(
    await page.evaluate(
      () =>
        scrollY < 2,
    ),
    "Back to top navigation",
  );
  await page.goto("http://127.0.0.1:5191/?footer=verify#contact");
  await page.waitForTimeout(800);
  assert.equal(
    await page.locator(".side-navigation .active").getAttribute("href"),
    "#contact",
  );
  assert.deepEqual(errors, []);
  console.log(
    "PASS: compact footer, bottom-right wordmark, bottom-left back to top, emphasized social links, nine responsive sizes and no clipping.",
  );
} finally {
  await browser?.close();
  await server.close();
}
