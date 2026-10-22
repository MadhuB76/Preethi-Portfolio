/* global process, console */
import { createServer } from "vite";
import assert from "node:assert/strict";
const { chromium } = await import(
  process.env.PLAYWRIGHT_MODULE || "playwright"
);
const server = await createServer({
  server: { host: "127.0.0.1", port: 5181, strictPort: true },
});
let browser;
try {
  await server.listen();
  browser = await chromium.launch({ channel: "msedge", headless: true });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
  });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  const read = () =>
    page.evaluate(() => {
      const rect = (selector) => {
        const el = document.querySelector(selector),
          box = el.getBoundingClientRect(),
          css = getComputedStyle(el);
        const matrix = new DOMMatrix(
          css.transform === "none" ? undefined : css.transform,
        );
        return {
          x: box.x + box.width / 2,
          y: box.y + box.height / 2,
          top: box.top,
          scale: matrix.a,
          opacity: +css.opacity,
          visibility: css.visibility,
        };
      };
      const opening = document.querySelector(".opening-experience");
      return {
        start: +opening.dataset.scrollStart,
        end: +opening.dataset.scrollEnd,
        progress: +opening.dataset.motionProgress,
        title: rect(".portfolio-title"),
        portrait: rect(".portrait-composition"),
        copy: rect(".hero-intro-copy"),
        interests: rect("#interests"),
        pieces: [...document.querySelectorAll(".collage-frame")].map((el) => {
          const transform = getComputedStyle(el).transform;
          const matrix = new DOMMatrix(
            transform === "none" ? undefined : transform,
          );
          return { x: matrix.m41, y: matrix.m42, identity: matrix.isIdentity };
        }),
        heroInert: document.querySelector("#home").inert,
        interestsInert: document.querySelector("#interests").inert,
        overflow: document.documentElement.scrollWidth > innerWidth,
      };
    });
  const seek = async (progress) => {
    const bounds = await read();
    await page.evaluate(
      (y) => scrollTo({ top: y, behavior: "instant" }),
      bounds.start + (bounds.end - bounds.start) * progress,
    );
    await page.waitForTimeout(750);
    return read();
  };
  await page.goto("http://127.0.0.1:5181/");
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(400);
  const initial = await seek(0);
  assert.ok(initial.end > initial.start + 900);
  assert.equal(initial.interests.visibility, "hidden");
  for (const p of [0.25, 0.5, 0.75, 1]) {
    await seek(p);
    await page.screenshot({ path: `artifacts/opening-motion-${p * 100}.png` });
  }
  const complete = await read();
  assert.ok(Math.abs(complete.interests.scale - 1) < 0.001);
  assert.ok(
    Math.abs(complete.interests.top) < 2,
    "Interests settles flush with viewport",
  );
  assert.equal(complete.interestsInert, false);
  assert.equal(complete.title.visibility, "hidden");
  assert.ok(
    complete.pieces.every((piece) => piece.identity),
    "all frames settle into the collage",
  );
  const middle = await seek(0.5);
  assert.ok(
    middle.pieces.some(
      (piece) => Math.abs(piece.x) > 10 || Math.abs(piece.y) > 10,
    ),
    "complete frames are assembling during the zoom",
  );
  assert.ok(
    middle.title.y < initial.title.y && middle.title.scale > 1.2,
    "title enlarges upward",
  );
  assert.ok(
    middle.portrait.x < initial.portrait.x &&
      middle.portrait.y > initial.portrait.y &&
      middle.portrait.scale > 1.2,
    "portrait enlarges bottom-left",
  );
  assert.ok(
    middle.copy.x > initial.copy.x &&
      middle.copy.y > initial.copy.y &&
      middle.copy.scale > 1.2,
    "copy enlarges bottom-right",
  );
  assert.ok(middle.interests.scale > 0.14 && middle.interests.scale < 1);
  assert.equal(middle.overflow, false);
  assert.equal(middle.heroInert, true);
  assert.equal(middle.interestsInert, true);
  await page.waitForTimeout(350);
  const paused = await read();
  assert.ok(
    Math.abs(paused.interests.scale - middle.interests.scale) < 0.001,
    "pausing scroll pauses animation",
  );
  await seek(0.8);
  const reversed = await seek(0.5);
  assert.ok(
    Math.abs(reversed.portrait.x - middle.portrait.x) < 1 &&
      Math.abs(reversed.interests.scale - middle.interests.scale) < 0.001,
    "reverse scrubbing retraces timeline",
  );
  const restored = await seek(0);
  assert.ok(Math.abs(restored.title.y - initial.title.y) < 1);
  assert.equal(restored.heroInert, false);
  assert.equal(restored.interests.visibility, "hidden");
  for (const [width, height] of [
    [390, 844],
    [768, 1024],
    [844, 390],
    [1920, 1080],
  ]) {
    await page.setViewportSize({ width, height });
    await page.waitForTimeout(450);
    const half = await seek(0.5);
    assert.ok(Number.isFinite(half.end) && half.end > half.start);
    assert.equal(half.overflow, false, `no overflow during zoom ${width}`);
    await seek(1);
    assert.ok(
      Math.abs((await read()).interests.top) < 2,
      `settles after resize ${width}: ${(await read()).interests.top}`,
    );
    if (width === 390)
      await page.screenshot({
        path: "artifacts/opening-motion-mobile-arrival.png",
      });
  }
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.waitForTimeout(200);
  assert.equal(
    await page.locator(".has-depth,.pin-spacer").count(),
    0,
    "reduced motion restores normal document flow",
  );
  assert.ok(
    await page
      .locator("#home,#interests")
      .evaluateAll((els) =>
        els.every(
          (el) =>
            !el.inert &&
            getComputedStyle(el).transform === "none" &&
            getComputedStyle(el).visibility === "visible",
        ),
      ),
    JSON.stringify(
      await page.locator("#home,#interests").evaluateAll((els) =>
        els.map((el) => ({
          id: el.id,
          inert: el.inert,
          transform: getComputedStyle(el).transform,
          visibility: getComputedStyle(el).visibility,
          style: el.getAttribute("style"),
        })),
      ),
    ),
  );
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.waitForTimeout(300);
  await seek(0.5);
  assert.equal((await read()).overflow, false);
  const linked = await browser.newPage({
    viewport: { width: 1280, height: 720 },
  });
  await linked.goto("http://127.0.0.1:5181/#interests");
  await linked.evaluate(() => document.fonts.ready);
  await linked.waitForTimeout(750);
  assert.ok(
    await linked
      .locator("#interests")
      .evaluate(
        (el) => Math.abs(el.getBoundingClientRect().top) < 2 && !el.inert,
      ),
    "direct Interests link lands after camera move",
  );
  assert.deepEqual(errors, []);
  console.log(
    "PASS: directed outward zoom, centered Interests growth, paused/reversed scroll, exact arrival, inert hidden controls, mobile reading offset, four resize/orientation cases, reduced-motion teardown/re-enable, deep link, no overflow or page errors.",
  );
} finally {
  await browser?.close();
  await server.close();
}
