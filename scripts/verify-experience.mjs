/* global process, console */
import { createServer } from "vite";
import assert from "node:assert/strict";
const { chromium } = await import(
  process.env.PLAYWRIGHT_MODULE || "playwright"
);
const server = await createServer({
  server: { host: "127.0.0.1", port: 5180, strictPort: true },
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
  await page.goto("http://127.0.0.1:5180/");
  await page.evaluate(() => document.fonts.ready);
  assert.ok(
    await page.evaluate(() => document.fonts.check('16px "DM Sans"')),
    "local reading font loads",
  );
  assert.ok(
    await page.evaluate(() => document.fonts.check('24px "Caveat Brush"')),
    "local brush handwriting font loads",
  );
  assert.equal(
    await page
      .locator(".title-spark")
      .evaluate((el) => getComputedStyle(el).color),
    "rgb(37, 37, 37)",
    "hero doodles use monochrome ink",
  );
  assert.equal(await page.locator(".portfolio-section").count(), 5);
  assert.equal(await page.locator(".publication-entry").count(), 3);
  assert.equal(
    await page.locator(".hero-room-image,.experience,.opening-scenes").count(),
    0,
    "previous room layout is not mounted",
  );
  await page.screenshot({ path: "artifacts/master-hero.png" });
  await page.locator(".open-navigation").click();
  await page.waitForTimeout(500);
  assert.equal(
    await page.locator(".side-navigation").getAttribute("aria-hidden"),
    "false",
  );
  assert.ok(await page.locator(".portfolio-canvas").evaluate((el) => el.inert));
  assert.equal(
    await page.evaluate(() =>
      document.activeElement.getAttribute("aria-label"),
    ),
    "Close navigation",
  );
  await page.screenshot({ path: "artifacts/master-navigation.png" });
  assert.ok(
    await page
      .locator(".chapter-description")
      .evaluateAll((els) =>
        els.every((el) => getComputedStyle(el).opacity === "1"),
      ),
    "drawer labels remain visible without hovering",
  );
  assert.ok(
    await page
      .locator(".drawer-credit")
      .evaluate((el) => parseFloat(getComputedStyle(el).fontSize) >= 14),
    "drawer credit is readable",
  );
  await page.keyboard.press("Shift+Tab");
  assert.ok(
    await page.evaluate(() => document.activeElement.hash === "#contact"),
    "drawer focus trap",
  );
  await page.keyboard.press("Escape");
  await page.waitForTimeout(100);
  assert.equal(
    await page.evaluate(() => document.activeElement.className),
    "open-navigation",
  );
  assert.equal(
    await page.locator(".portfolio-canvas").evaluate((el) => el.inert),
    false,
  );
  for (const id of ["interests", "projects", "about", "contact"]) {
    await page
      .getByRole("button", { name: "Open navigation", exact: true })
      .filter({ visible: true })
      .first()
      .click();
    await page.waitForTimeout(450);
    await page.locator(`.side-navigation a[href="#${id}"]`).click();
    await page.waitForFunction(
      (id) =>
        document.querySelector('.side-navigation a[aria-current="location"]')
          ?.hash === `#${id}`,
      id,
    );
    assert.equal(
      await page
        .locator('.side-navigation a[aria-current="location"]')
        .getAttribute("href"),
      `#${id}`,
    );
    await page.screenshot({ path: `artifacts/master-${id}.png` });
  }
  await page.locator("#interests").evaluate(async () => {
    const { scrollToChapter } = await import("/src/lib/chapterNavigation.js");
    scrollToChapter("interests", { instant: true });
  });
  await page
    .getByRole("button", { name: "Explore Dancing", exact: true })
    .hover();
  await page.waitForFunction(
    () => document.querySelector("#interests").dataset.theme === "dancing",
  );
  await page.screenshot({ path: "artifacts/master-interest-view.png" });
  await page.getByRole("button", { name: "Show all interests" }).click();
  await page.waitForFunction(
    () => document.querySelector("#interests").dataset.theme === "all",
  );
  await page
    .locator(".archive-tile img")
    .evaluateAll((es) => Promise.all(es.map((e) => e.decode())));
  assert.ok(
    await page
      .locator(".archive-tile img")
      .evaluateAll((es) => es.every((e) => e.complete && e.naturalWidth > 0)),
  );
  const sizes = [
    [360, 640],
    [390, 844],
    [768, 1024],
    [1024, 768],
    [1280, 720],
    [1440, 900],
    [1920, 1080],
    [2560, 1440],
    [844, 390],
  ];
  for (const [width, height] of sizes) {
    await page.setViewportSize({ width, height });
    await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
    await page.waitForTimeout(200);
    assert.ok(
      await page.evaluate(() => {
        const button = document
          .querySelector(".open-navigation")
          .getBoundingClientRect();
        return (
          button.left >= 0 &&
          button.left <=
            document.querySelector(".portfolio-canvas").getBoundingClientRect()
              .left +
              28 &&
          button.top >= 0 &&
          button.bottom <= innerHeight
        );
      }),
      `Open stays reachable on the left at ${width}x${height}`,
    );
    if (width >= 1024 && height >= 720) {
      assert.ok(
        await page
          .locator(".hero-baseline")
          .evaluate(
            (el) => el.getBoundingClientRect().bottom <= innerHeight + 1,
          ),
        `hero baseline visible at ${width}x${height}`,
      );
    }
    assert.ok(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      `overflow ${width}x${height}: ${JSON.stringify(
        await page.evaluate(() =>
          [...document.querySelectorAll(".portfolio-canvas *")]
            .filter((e) => e.getBoundingClientRect().right > innerWidth + 1)
            .map((e) => [
              e.tagName,
              e.className,
              e.getBoundingClientRect().right,
            ])
            .slice(0, 12),
        ),
      )}`,
    );
    assert.ok(
      await page
        .locator(".portfolio-section")
        .evaluateAll((es) =>
          es.every((e) => e.offsetHeight >= innerHeight - 1),
        ),
      `full viewport chapters ${width}x${height}`,
    );
    assert.ok(
      await page
        .locator(".portfolio-footer")
        .evaluate((el) => el.offsetHeight < innerHeight / 2),
      "compact footer",
    );
    assert.ok(
      await page
        .locator(".portfolio-title h1")
        .evaluate((el) => el.scrollWidth <= el.clientWidth + 2),
      `title fits ${width}`,
    );
    await page.screenshot({ path: `artifacts/master-hero-${width}.png` });
  }
  const touch = await browser.newPage({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
  });
  await touch.goto("http://127.0.0.1:5180/");
  await touch.locator(".open-navigation").tap();
  await touch.waitForTimeout(450);
  await touch.locator('.side-navigation a[href="#interests"]').tap();
  await touch.waitForTimeout(700);
  assert.equal(
    await touch.locator(".side-navigation").getAttribute("aria-hidden"),
    "true",
  );
  await touch
    .getByRole("button", { name: "Explore Foodie", exact: true })
    .tap();
  await touch.waitForFunction(
    () => document.querySelector("#interests").dataset.theme === "foodie",
  );
  await touch.getByRole("button", { name: "Show all interests" }).tap();
  await touch.waitForFunction(
    () => document.querySelector("#interests").dataset.theme === "all",
  );
  await touch.screenshot({
    path: "artifacts/master-mobile.png",
    fullPage: true,
  });
  await touch.close();
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.waitForTimeout(100);
  assert.equal(
    await page.locator(".portfolio-title").evaluate((el) => {
      const transform = getComputedStyle(el).transform;
      return transform === "none" || new DOMMatrix(transform).isIdentity;
    }),
    true,
  );
  await page
    .locator("#home")
    .evaluate((el) => el.scrollIntoView({ behavior: "instant" }));
  await page.locator(".open-navigation").click();
  await page.locator('.side-navigation a[href="#contact"]').click();
  await page.waitForTimeout(100);
  assert.equal(
    await page
      .locator('.side-navigation a[aria-current="location"]')
      .getAttribute("href"),
    "#contact",
  );
  assert.deepEqual(errors, []);
  console.log(
    "PASS: five full-viewport scenes; three projects; drawer open/close/Escape/focus trap/return/navigation and active scroll tracking; coordinated gallery hover/touch; local images; 9 responsive sizes; no horizontal overflow; compact footer; reduced-motion cleanup; no page errors.",
  );
} finally {
  await browser?.close();
  await server.close();
}

