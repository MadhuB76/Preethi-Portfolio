/* global process, console */
import { createServer } from "vite";
import assert from "node:assert/strict";
import { interests } from "../src/data/editorial.js";
const { chromium } = await import(
  process.env.PLAYWRIGHT_MODULE || "playwright"
);
const server = await createServer({
  server: { host: "127.0.0.1", port: 5182, strictPort: true },
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
  await page.goto("http://127.0.0.1:5182/#interests");
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1000);
  await page.waitForFunction(
    () =>
      +document.querySelector(".opening-experience").dataset.motionProgress >
      0.999,
  );
  await page.mouse.move(10, 10);
  const tiles = page.locator(".collage-frame");
  assert.equal(await tiles.count(), 7);
  assert.equal(
    await page.locator(".gallery-story,.gallery-character").count(),
    0,
    "no right-hand text column",
  );
  assert.equal(
    await page
      .locator(".gallery-photo-current")
      .first()
      .evaluate((el) => getComputedStyle(el).filter),
    "grayscale(1) contrast(1.06)",
    "photos use the monochrome editorial treatment",
  );
  const cutouts = await page.evaluate(async () =>
    Promise.all(
      ["selfie", "reader", "headphones"].map(async (name) => {
        const image = new Image();
        image.src = `/images/characters/${name}.png`;
        await image.decode();
        const canvas = document.createElement("canvas");
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        const context = canvas.getContext("2d");
        context.drawImage(image, 0, 0);
        const pixels = context.getImageData(
          0,
          0,
          canvas.width,
          canvas.height,
        ).data;
        return (
          pixels[3] === 0 &&
          pixels.some((value, index) => index % 4 === 3 && value > 200)
        );
      }),
    ),
  );
  assert.ok(
    cutouts.every(Boolean),
    "all three local cutouts load with preserved transparency",
  );
  const bounds = await tiles.evaluateAll((els) =>
    els.map((el) => {
      const b = el.getBoundingClientRect();
      return { x: b.x, y: b.y, w: b.width, h: b.height };
    }),
  );
  const frameChecks = await page.locator(".collage-frame").evaluateAll((els) =>
    els.map((el) => {
      const frame = el.querySelector(".frame-image").getBoundingClientRect();
      const caption = el
        .querySelector(".archive-caption")
        .getBoundingClientRect();
      const image = el.querySelector(".gallery-photo-current");
      return {
        rectangular: getComputedStyle(el).clipPath === "none",
        outside: caption.top >= frame.bottom - 1,
        width: frame.width,
        height: frame.height,
        fit: getComputedStyle(image).objectFit,
      };
    }),
  );
  assert.ok(
    frameChecks.every(
      (frame) =>
        frame.rectangular &&
        frame.outside &&
        frame.width >= 100 &&
        frame.height >= 90 &&
        frame.fit === "cover",
    ),
    "complete rectangular photos with unobstructed labels",
  );
  for (let a = 0; a < bounds.length; a++)
    for (let b = a + 1; b < bounds.length; b++) {
      const one = bounds[a],
        two = bounds[b];
      assert.ok(
        one.x + one.w <= two.x + 1 ||
          two.x + two.w <= one.x + 1 ||
          one.y + one.h <= two.y + 1 ||
          two.y + two.h <= one.y + 1,
        "collage frames have deliberate spacing without overlaps",
      );
    }
  await page.screenshot({ path: "artifacts/interests-collage-all.png" });
  for (const interest of interests) {
    await page
      .getByRole("button", { name: `Explore ${interest.label}`, exact: true })
      .locator(".archive-caption")
      .hover();
    await page.waitForFunction(
      (id) => document.querySelector("#interests").dataset.theme === id,
      interest.id,
    );
    await page
      .locator(".gallery-photo-current")
      .evaluateAll((els) => Promise.all(els.map((el) => el.decode())));
    const sources = await page
      .locator(".gallery-photo-current")
      .evaluateAll((els) => els.map((el) => el.getAttribute("src")));
    assert.deepEqual(
      sources,
      interest.images,
      "all seven frames change together",
    );
    assert.ok(
      await page
        .locator("#interest-story")
        .innerText()
        .then((text) => text.includes(interest.description)),
    );
    assert.deepEqual(
      await tiles.evaluateAll((els) =>
        els.map((el) => {
          const b = el.getBoundingClientRect();
          return { x: b.x, y: b.y, w: b.width, h: b.height };
        }),
      ),
      bounds,
      "theme changes do not rearrange pieces",
    );
    await page.waitForTimeout(1150);
    await page.waitForFunction(() => [...document.querySelectorAll(".gallery-photo-previous")].every(el => +getComputedStyle(el).opacity === 0));
    assert.ok(
      await page
        .locator(".gallery-photo-previous")
        .evaluateAll((els) =>
          els.every((el) => +getComputedStyle(el).opacity === 0),
        ),
      "previous theme fades out completely in uncropped frames",
    );
    await page.screenshot({
      path: `artifacts/interests-collage-${interest.id}.png`,
    });
  }
  await page
    .getByRole("button", { name: "Explore Foodie", exact: true })
    .locator(".archive-caption")
    .click();
  await page
    .getByRole("button", { name: "Explore Dancing", exact: true })
    .locator(".archive-caption")
    .hover();
  await page.waitForFunction(
    () => document.querySelector("#interests").dataset.theme === "dancing",
  );
  await page.mouse.move(10, 10);
  await page.waitForFunction(
    () => document.querySelector("#interests").dataset.theme === "foodie",
  );
  await page.getByRole("button", { name: "Show all interests" }).click();
  await page.waitForFunction(
    () => document.querySelector("#interests").dataset.theme === "all",
  );
  await page
    .getByRole("button", { name: "Explore Dancing", exact: true })
    .focus();
  await page.keyboard.press("Tab");
  await page.waitForFunction(
    () => document.querySelector("#interests").dataset.theme === "kdramas",
  );
  await page.keyboard.press("Escape");
  await page.waitForFunction(
    () => document.querySelector("#interests").dataset.theme === "all",
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.waitForTimeout(200);
  await page
    .locator("#interests")
    .evaluate((el) => el.scrollIntoView({ behavior: "instant" }));
  assert.equal(
    await page
      .locator(".gallery-photo-current")
      .first()
      .evaluate((el) => getComputedStyle(el).animationName),
    "none",
  );
  const touch = await browser.newPage({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  await touch.goto("http://127.0.0.1:5182/#interests");
  await touch.evaluate(() => document.fonts.ready);
  await touch.waitForTimeout(1000);
  await touch.waitForFunction(
    () =>
      !document.querySelector("#interests").inert &&
      +document.querySelector(".opening-experience").dataset.motionProgress >
        0.999,
  );
  await touch
    .getByRole("button", { name: "Explore Foodie", exact: true })
    .tap();
  await touch.waitForFunction(
    () => document.querySelector("#interests").dataset.theme === "foodie",
  );
  assert.equal(
    await touch
      .getByRole("button", { name: "Explore Foodie", exact: true })
      .getAttribute("aria-pressed"),
    "true",
  );
  await touch.getByRole("button", { name: "Show all interests" }).tap();
  await touch.waitForFunction(
    () => document.querySelector("#interests").dataset.theme === "all",
  );
  await touch
    .locator("#interests")
    .evaluate((el) => el.scrollIntoView({ behavior: "instant" }));
  await touch.waitForTimeout(600);
  await touch.screenshot({ path: "artifacts/interests-collage-mobile.png" });
  assert.ok(
    await touch.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  );
  assert.deepEqual(errors, []);
  console.log(
    "PASS: complete rectangular collage and external labels, seven confirmed interests, coordinated decoded imagery for all themes, stable geometry, hover/pinned restore/reset, keyboard/Escape, mobile tap, reduced motion, local image loading.",
  );
} finally {
  await browser?.close();
  await server.close();
}
