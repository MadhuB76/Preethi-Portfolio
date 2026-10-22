/* global process, console */
import { createServer } from "vite";
import assert from "node:assert/strict";
import { skillCategories } from "../src/data/editorial.js";
const { chromium } = await import(
  process.env.PLAYWRIGHT_MODULE || "playwright"
);
const server = await createServer({
  server: { host: "127.0.0.1", port: 5186, strictPort: true },
});
let browser;
try {
  await server.listen();
  browser = await chromium.launch({ channel: "msedge", headless: true });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
  });
  await page.addInitScript(() => {
    const original = CanvasRenderingContext2D.prototype.stroke;
    CanvasRenderingContext2D.prototype.stroke = function (...args) {
      if (this.canvas.classList.contains("skills-particles"))
        this.canvas.dataset.strokes = String(
          Number(this.canvas.dataset.strokes || 0) + 1,
        );
      return original.apply(this, args);
    };
  });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("http://127.0.0.1:5186/#about");
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(900);
  assert.equal(await page.locator(".network-hub").count(), 5);
  assert.equal(await page.locator(".hub-ring").count(), 30);
  assert.equal(await page.locator(".network-route").count(), 6);
  assert.equal(
    await page.locator(".network-cross").count(),
    0,
    "no crossing category paths",
  );
  assert.equal(
    await page.locator(".skills-detail,aside.skills-detail").count(),
    0,
    "no text sidebar",
  );
  const palette = await page.evaluate(() => {
    const styles = getComputedStyle(document.documentElement);
    return [
      styles.getPropertyValue("--theme-pink").trim(),
      styles.getPropertyValue("--theme-blue").trim(),
      getComputedStyle(document.querySelector("#about")).backgroundColor,
    ];
  });
  assert.deepEqual(
    palette,
    ["#f6d6d6", "#a2d2df", "rgb(246, 214, 214)"],
    "finalized theme is applied to the skills canvas",
  );
  assert.ok(
    await page
      .locator(".portfolio-canvas img:not(.hero-paint)")
      .evaluateAll((images) =>
        images.every((image) => getComputedStyle(image).filter === "none"),
      ),
    "photographs display in full colour",
  );
  assert.ok(
    await page
      .locator("html,body,main")
      .evaluateAll((els) =>
        els.every((el) => getComputedStyle(el).filter === "none"),
      ),
    "theme does not create new containing blocks for fixed scroll scenes",
  );
  const overlaps = (a, b) =>
    a.x < b.x + b.width - 1 &&
    a.x + a.width > b.x + 1 &&
    a.y < b.y + b.height - 1 &&
    a.y + a.height > b.y + 1;
  for (const category of skillCategories) {
    await page
      .getByRole("button", { name: `Explore ${category.label}`, exact: true })
      .hover();
    assert.equal(
      await page.locator("#about").getAttribute("data-category"),
      category.id,
    );
    assert.equal(await page.locator(".network-group.is-active").count(), 1);
    assert.deepEqual(
      await page
        .locator(`.group-${skillCategories.indexOf(category)} .network-skill`)
        .evaluateAll((els) =>
          els.map((el) => el.getAttribute("aria-label").replace("Select ", "")),
        ),
      category.skills,
    );
    const boxes = await page
      .locator(".network-skill,.network-category,.network-core")
      .evaluateAll((els) =>
        els.map((el) => ({
          type: el.className,
          rect: el.getBoundingClientRect().toJSON(),
        })),
      );
    for (const node of boxes.filter((box) => box.type === "network-skill"))
      assert.ok(
        boxes.every(
          (other) => other === node || !overlaps(node.rect, other.rect),
        ),
        `${category.id}: skill nodes do not collide`,
      );
    await page
      .getByRole("button", {
        name: `Select ${category.skills[0]}`,
        exact: true,
      })
      .click();
    assert.equal(
      await page.locator(".network-status").innerText(),
      category.skills[0],
    );
    assert.equal(
      await page.locator('.network-skill[aria-pressed="true"]').count(),
      1,
    );
    await page.keyboard.press("Escape");
    assert.equal(await page.locator(".network-branch.is-selected").count(), 0);
    await page.screenshot({
      path: `artifacts/skills-network-${category.id}.png`,
    });
  }
  await page
    .getByRole("button", { name: "Explore Databases", exact: true })
    .focus();
  assert.equal(
    await page.locator("#about").getAttribute("data-category"),
    "databases",
  );
  await page.keyboard.press("Enter");
  const checksum = () =>
    page.locator(".skills-particles").evaluate((canvas) => {
      const data = canvas
        .getContext("2d")
        .getImageData(0, 0, canvas.width, canvas.height).data;
      let sum = 0;
      for (let i = 3; i < data.length; i += 4) sum += data[i];
      return sum;
    });
  assert.ok((await checksum()) > 0, "visible particle dots are drawn");
  assert.equal(
    await page.locator(".skills-particles").getAttribute("data-strokes"),
    null,
    "particles draw dots only, without connection lines",
  );
  assert.equal(
    await page
      .locator(".network-core,.network-core-ring,.network-index")
      .count(),
    0,
    "no central node or bottom skill rail",
  );
  assert.equal(
    await page.locator(".network-skill:visible").count(),
    skillCategories.flatMap((c) => c.skills).length,
    "every skill is visible without interaction",
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.waitForTimeout(400);
  const staticParticles = await checksum();
  await page.mouse.move(500, 400);
  await page.waitForTimeout(350);
  assert.equal(
    await checksum(),
    staticParticles,
    "reduced motion particles remain still",
  );
  assert.equal(
    await page
      .locator(".network-hub")
      .first()
      .evaluate((el) => getComputedStyle(el).transform),
    "none",
  );
  await page.emulateMedia({ reducedMotion: "no-preference" });
  for (const viewport of [
    { width: 390, height: 844 },
    { width: 768, height: 1024 },
    { width: 1024, height: 768 },
    { width: 844, height: 390 },
  ]) {
    await page.setViewportSize(viewport);
    await page.waitForTimeout(650);
    await page.locator("#about").scrollIntoViewIfNeeded();
    assert.ok(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    );
  }
  const touch = await browser.newPage({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
  });
  await touch.goto("http://127.0.0.1:5186/#about");
  await touch.evaluate(() => document.fonts.ready);
  await touch.waitForTimeout(900);
  await touch
    .getByRole("button", { name: "Explore Data & Tools", exact: true })
    .tap();
  assert.equal(
    await touch.locator("#about").getAttribute("data-category"),
    "data",
  );
  await touch
    .getByRole("button", { name: "Select Power BI", exact: true })
    .tap();
  assert.equal(await touch.locator(".network-status").innerText(), "Power BI");
  await touch
    .locator("#about")
    .screenshot({ path: "artifacts/skills-network-mobile.png" });
  assert.deepEqual(errors, []);
  console.log(
    "PASS: organic themed network; all skills visible beside five nodes; no central node or skill rail; dots-only particles; label spacing; selection; hover/keyboard/Escape; reduced motion; touch; responsive layouts.",
  );
} finally {
  await browser?.close();
  await server.close();
}
