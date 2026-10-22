/* global process, console */
import { preview } from "vite";
import fs from "node:fs/promises";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { interests } from "../src/data/editorial.js";
const { chromium } = await import(
  process.env.PLAYWRIGHT_MODULE || "playwright"
);
const manifest = JSON.parse(
  await fs.readFile("src/data/image-manifest.json", "utf8"),
);
let original = 0,
  large = 0,
  small = 0;
for (const [src, entry] of Object.entries(manifest)) {
  original += (await fs.stat("public" + src)).size;
  small += entry.variants[0].bytes;
  large += entry.variants[1].bytes;
  for (const variant of entry.variants) {
    const data = await fs.readFile("public" + variant.src);
    assert.equal(data.length, variant.bytes);
    assert.equal(data.toString("ascii", 8, 12), "WEBP");
    assert.match(variant.src, /[a-f0-9]{12}-\d+\.webp$/);
  }
}
assert.ok(large < original * 0.5);
assert.ok(small < original * 0.25);
for (const interest of interests) {
  assert.equal(
    new Set(interest.images).size,
    7,
    interest.id + " has seven unique URLs",
  );
  const hashes = await Promise.all(
    interest.images.map(async (src) =>
      createHash("sha256")
        .update(await fs.readFile("public" + src))
        .digest("hex"),
    ),
  );
  assert.equal(
    new Set(hashes).size,
    7,
    interest.id + " uses seven distinct photo files",
  );
}
const server = await preview({
  preview: { host: "127.0.0.1", port: 5194, strictPort: true },
});
let browser;
try {
  browser = await chromium.launch({ channel: "msedge", headless: true });
  const page = await browser.newPage({
    viewport: { width: 1280, height: 800 },
  });
  const requests = new Set();
  const errors = [];
  page.on("request", (r) => {
    if (r.resourceType() === "image") requests.add(r.url());
  });
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("http://127.0.0.1:5194/");
  await page.locator(".portrait-photo").evaluate((img) => img.decode());
  assert.ok(
    await page
      .locator(".portrait-photo")
      .evaluate(
        (img) =>
          img.currentSrc.includes("/optimized/") &&
          getComputedStyle(img).filter === "none",
      ),
    "full-colour responsive hero photo",
  );
  await page.waitForTimeout(2000);
  const galleryRequests = [...requests].filter((url) =>
    /dance-|drama-|food-|pose-|nature-|music-|doodle-photo/.test(url),
  );
  assert.ok(
    galleryRequests.length <= 8,
    "initial page does not download every interest theme: " +
      galleryRequests.length,
  );
  assert.ok(
    [...requests].every(
      (url) => new URL(url).origin === "http://127.0.0.1:5194",
    ),
    "no remote image dependencies",
  );
  await page.goto("http://127.0.0.1:5194/?audit=gallery#interests");
  await page.waitForTimeout(1000);
  await page
    .locator(".gallery-photo-current")
    .evaluateAll((imgs) => Promise.all(imgs.map((img) => img.decode())));
  assert.equal(
    await page
      .locator(".gallery-photo-current")
      .evaluateAll((imgs) => new Set(imgs.map((i) => i.currentSrc)).size),
    7,
  );
  assert.ok(
    await page
      .locator(".gallery-photo-current")
      .evaluateAll((imgs) =>
        imgs.every(
          (img) =>
            getComputedStyle(img).filter === "none" &&
            img.currentSrc.includes("/optimized/"),
        ),
      ),
  );
  await page.screenshot({ path: "artifacts/colour-gallery-production.png" });
  const broken = await browser.newPage({
    viewport: { width: 390, height: 844 },
  });
  await broken.route("**/images/optimized/preethi-*.webp", (route) =>
    route.abort(),
  );
  await broken.route("**/images/profile/preethi.webp", (route) =>
    route.abort(),
  );
  await broken.goto("http://127.0.0.1:5194/");
  await broken.waitForFunction(
    () =>
      document.querySelector(".portrait-photo").dataset.fallback === "true" &&
      document.querySelector(".portrait-photo").naturalWidth > 0,
  );
  assert.ok(
    await broken
      .locator(".portrait-photo")
      .evaluate((img) => img.currentSrc.endsWith("/images/image-fallback.svg")),
    "visible local fallback when both image sources fail",
  );
  assert.deepEqual(errors, []);
  console.log(
    "PASS: " +
      Object.keys(manifest).length +
      " optimized photos, all assets present, seven distinct files per theme, bounded startup requests, full-colour responsive images in production, no external image requests, and tested image failure fallback.",
  );
  console.log({
    originalBytes: original,
    largeBytes: large,
    smallBytes: small,
  });
} finally {
  await browser?.close();
  await new Promise((resolve) => server.httpServer.close(resolve));
}
