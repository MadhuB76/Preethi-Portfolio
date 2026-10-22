/* global process, console */
import { createServer } from "vite";
import assert from "node:assert/strict";
const runtime = process.env.PLAYWRIGHT_MODULE;
const { chromium } = await import(runtime || "playwright");
const { default: pngModule } = await import(
  runtime ? new URL("../pngjs/lib/png.js", runtime).href : "pngjs"
);
const server = await createServer({
  server: { host: "127.0.0.1", port: 5193, strictPort: true },
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
  await page.goto("http://127.0.0.1:5193/");
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(800);
  const cursor = page.locator(".interaction-cursor");
  assert.equal(await cursor.count(), 1, "StrictMode leaves one cursor");
  await page.mouse.move(900, 500);
  await page.waitForTimeout(100);
  assert.equal(await cursor.getAttribute("data-visible"), "true");
  assert.equal(await cursor.getAttribute("data-interactive"), "false");
  assert.equal(
    await cursor.locator("span").evaluate((el) => getComputedStyle(el).width),
    "9px",
  );
  assert.equal(
    await cursor.evaluate((el) => getComputedStyle(el).pointerEvents),
    "none",
  );
  assert.equal(
    await cursor.evaluate((el) => getComputedStyle(el).mixBlendMode),
    "difference",
  );
  assert.equal(
    await page.locator("html").evaluate((el) => getComputedStyle(el).cursor),
    "none",
  );
  await page
    .getByRole("button", { name: "Open navigation", exact: true })
    .first()
    .hover();
  await page.waitForTimeout(270);
  assert.equal(await cursor.getAttribute("data-interactive"), "true");
  assert.equal(
    await cursor.locator("span").evaluate((el) => getComputedStyle(el).width),
    "48px",
  );
  await page.mouse.down();
  await page.waitForTimeout(250);
  assert.equal(await cursor.getAttribute("data-pressed"), "true");
  assert.equal(
    await cursor.locator("span").evaluate((el) => getComputedStyle(el).width),
    "38px",
  );
  await page.mouse.up();
  await page.waitForTimeout(400);
  await page.getByRole("button", { name: "Close navigation" }).hover();
  await page.waitForTimeout(270);
  assert.equal(
    await cursor.getAttribute("data-interactive"),
    "true",
    "works above drawer",
  );
  await page.getByRole("button", { name: "Close navigation" }).click();
  await page.waitForTimeout(400);
  await page.keyboard.press("Tab");
  assert.equal(
    await cursor.getAttribute("data-visible"),
    "false",
    "keyboard navigation restores native cursor",
  );
  await page.goto("http://127.0.0.1:5193/?cursor=skills#about");
  await page.waitForTimeout(900);
  await page.getByRole("button", { name: "Select Java", exact: true }).hover();
  await page.waitForTimeout(270);
  assert.equal(
    await cursor.getAttribute("data-interactive"),
    "true",
    "skills buttons expand cursor",
  );
  await page.getByRole("button", { name: "Select Java", exact: true }).click();
  assert.equal(
    await page.locator(".network-status").innerText(),
    "Java",
    "cursor does not intercept clicks",
  );
  await page.goto("http://127.0.0.1:5193/?cursor=gallery#interests");
  await page.waitForTimeout(1000);
  await page.locator(".collage-frame").first().hover();
  await page.waitForTimeout(270);
  assert.equal(
    await cursor.getAttribute("data-interactive"),
    "true",
    "gallery expands cursor",
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.evaluate(() => {
    const zone = document.createElement("div");
    zone.id = "cursor-test";
    zone.style.cssText =
      "position:fixed;left:300px;top:300px;display:flex;width:320px;height:160px;z-index:2147483645";
    zone.innerHTML =
      '<button aria-label="White inversion probe" style="width:160px;height:160px;background:white;border:0"></button><button aria-label="Black inversion probe" style="width:160px;height:160px;background:black;border:0"></button>';
    document.body.append(zone);
  });
  const pixel = async (x, y) => {
    const png = pngModule.PNG.sync.read(await page.screenshot());
    const i = (y * png.width + x) * 4;
    return [...png.data.slice(i, i + 3)];
  };
  await page.mouse.move(380, 380);
  await page.waitForTimeout(80);
  assert.deepEqual(
    await pixel(380, 380),
    [0, 0, 0],
    "white background is inverted to black",
  );
  await page.mouse.move(540, 380);
  await page.waitForTimeout(80);
  assert.deepEqual(
    await pixel(540, 380),
    [255, 255, 255],
    "black background is inverted to white",
  );
  assert.equal(
    await cursor
      .locator("span")
      .evaluate((el) => getComputedStyle(el).transitionDuration),
    "0s",
    "reduced motion removes size animation",
  );
  await page.screenshot({ path: "artifacts/cursor-inversion.png" });
  await page.evaluate(() => {
    document.querySelector("#cursor-test").innerHTML =
      '<input aria-label="Cursor text probe" style="width:160px;height:80px" /><button disabled style="width:160px;height:80px">Disabled</button>';
  });
  await page.getByRole("textbox", { name: "Cursor text probe" }).hover();
  await page.waitForTimeout(80);
  assert.equal(
    await cursor.getAttribute("data-visible"),
    "false",
    "text fields retain native cursor",
  );
  assert.equal(
    await page
      .locator("html")
      .evaluate((el) => el.classList.contains("has-interaction-cursor")),
    false,
  );
  await page.locator("#cursor-test button").hover();
  await page.waitForTimeout(80);
  assert.equal(
    await cursor.getAttribute("data-interactive"),
    "false",
    "disabled buttons do not expand cursor",
  );
  await page.evaluate(() => document.querySelector("#cursor-test").remove());
  await page.mouse.move(950, 600);
  await page.waitForTimeout(80);
  await page.evaluate(() => window.dispatchEvent(new Event("blur")));
  assert.equal(
    await cursor.getAttribute("data-visible"),
    "false",
    "hides when window loses focus",
  );
  await page.emulateMedia({ forcedColors: "active" });
  await page.mouse.move(960, 610);
  await page.waitForTimeout(80);
  assert.equal(
    await cursor.getAttribute("data-visible"),
    "false",
    "forced colors retains system cursor",
  );
  await page.emulateMedia({ forcedColors: "none" });
  await page.mouse.move(970, 620);
  await page.waitForTimeout(80);
  await page.evaluate(() =>
    document.dispatchEvent(
      new PointerEvent("pointermove", { pointerType: "touch", bubbles: true }),
    ),
  );
  assert.equal(
    await cursor.getAttribute("data-visible"),
    "false",
    "touch switches back to native behavior",
  );
  const touch = await browser.newPage({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
  });
  await touch.goto("http://127.0.0.1:5193/#contact");
  await touch.waitForTimeout(700);
  await touch.locator(".archive-signature").tap();
  assert.equal(
    await touch
      .locator("html")
      .evaluate((el) => el.classList.contains("has-interaction-cursor")),
    false,
  );
  assert.equal(
    await touch.locator(".interaction-cursor").getAttribute("data-visible"),
    "false",
  );
  assert.deepEqual(errors, []);
  console.log(
    "PASS: dot, hover/press sizing, actual black/white pixel inversion, drawer/gallery/skills, click-through, native text cursor, keyboard/touch/forced-colors fallback, reduced motion and no browser errors.",
  );
} finally {
  await browser?.close();
  await server.close();
}
