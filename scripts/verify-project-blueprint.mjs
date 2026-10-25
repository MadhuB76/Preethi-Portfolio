/* global process, console */
import { createServer } from "vite";
import assert from "node:assert/strict";
const { chromium } = await import(
  process.env.PLAYWRIGHT_MODULE || "playwright"
);
const server = await createServer({
  server: { host: "127.0.0.1", port: 5183, strictPort: true },
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
  await page.goto("http://127.0.0.1:5183/#projects");
  await page.waitForFunction(
    () => document.querySelector("#projects").dataset.projectStops,
  );
  const readStops = () =>
    page.evaluate(() =>
      JSON.parse(document.querySelector("#projects").dataset.projectStops),
    );
  const settled = () =>
    page.waitForFunction(() => {
      const el = document.querySelector("#projects");
      const expected = Math.max(
        0,
        Math.min(
          1,
          (scrollY - +el.dataset.scrollStart) /
            (+el.dataset.scrollEnd - +el.dataset.scrollStart),
        ),
      );
      return Math.abs(+el.dataset.draftProgress - expected) < 0.001;
    });
  await page.evaluate(async () => {
    await document.fonts.ready;
    const { scrollToChapter } = await import("/src/lib/chapterNavigation.js");
    scrollToChapter("projects", { instant: true });
  });
  await page.waitForFunction(
    () =>
      Math.abs(
        scrollY - +document.querySelector("#projects").dataset.scrollReady,
      ) < 2,
  );
  await settled();
  assert.equal(await page.locator(".project-screen").count(), 3);
  const featured = page.locator('.project-screen').first();
  assert.equal(await featured.locator('h2').innerText(), 'SuperTuffMenus');
  assert.match(await featured.locator('.project-explanation').innerText(), /Liquid/);
  assert.equal(await featured.locator('.editorial-link').getAttribute('href'), 'https://supertuffmenus.com/');
  assert.equal(await featured.locator('.temporary-photo-label').count(), 0);
  assert.equal(await featured.locator('img').evaluateAll(images => new Set(images.map(image => image.getAttribute('src'))).size), 2);
  assert.equal(await featured.locator('video').count(), 1);
  assert.equal(await featured.locator('video').evaluate(video => video.controls), false);
  assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).scrollbarWidth), 'none');
  await page.waitForFunction(() => {
    const video = document.querySelector('#projects video');
    return video.readyState >= 2 && video.currentTime > 0 && !video.paused;
  });
  assert.ok(await featured.locator('img,video').evaluateAll(media => media.every(el => getComputedStyle(el).objectFit === 'cover')), 'real media fills every block');
  assert.ok(await featured.locator('img').evaluateAll(images => images.every(image => !/brand|collection/.test(image.src))), 'no logo or illustrated menu collection');
  assert.equal(await page.locator(".project-media-pair figure").count(), 6);
  assert.equal(await page.locator(".project-detail-image").count(), 3);
  assert.equal(await page.locator(".showcase-rules").count(), 0);
  assert.equal(await page.locator(".project-static-title").count(), 1);
  await page
    .locator("#projects img")
    .evaluateAll((images) =>
      Promise.all(images.map((image) => image.decode())),
    );
  assert.equal(await page.locator("#projects img").count(), 8);
  assert.ok(
    await page
      .locator("#projects img")
      .evaluateAll((images) =>
        images.every(
          (image) =>
            image.naturalWidth > 0 &&
            image.getAttribute("src").startsWith("/images/projects/"),
        ),
      ),
    "editorial photos decode from local assets",
  );
  assert.ok(
    await page.locator(".project-stage").evaluate((stage) => {
      const title = stage
        .querySelector(".project-static-title")
        .getBoundingClientRect();
      const box = stage.getBoundingClientRect();
      return (
        Math.abs(box.bottom - innerHeight) < 2 &&
        title.bottom > box.bottom &&
        title.top < box.bottom &&
        getComputedStyle(stage).overflow === "hidden"
      );
    }),
    "shared title crops flush with the viewport bottom, without a padding gap",
  );
  const stops = await readStops();
  const start = await page
    .locator("#projects")
    .evaluate((el) => +el.dataset.scrollStart);
  const seek = async (y) => {
    await page.evaluate((y) => scrollTo({ top: y, behavior: "instant" }), y);
    await settled();
  };
  const geometry = () =>
    page.evaluate(() => ({
      grid: document
        .querySelector(".project-stage")
        .getBoundingClientRect()
        .toJSON(),
      title: document
        .querySelector(".project-static-title")
        .getBoundingClientRect()
        .toJSON(),
      panels: [...document.querySelectorAll(".project-screen")].map((el) => ({
        left: el.getBoundingClientRect().left,
        top: el.getBoundingClientRect().top,
        width: el.getBoundingClientRect().width,
        inert: el.inert,
      })),
    }));
  const first = await geometry();
  assert.ok(
    first.panels[0].left > 0 &&
      Math.abs(
        first.panels[1].left - first.panels[0].left - first.panels[0].width,
      ) < 2,
  );
  assert.equal(await page.locator(".project-position").innerText(), "01 / 03");
  await page.screenshot({ path: "artifacts/projects-stage-01.png" });
  const end = await page
    .locator("#projects")
    .evaluate((el) => +el.dataset.scrollEnd);
  await seek(start + ((end - start) * 2.05) / 5.05);
  const moving = await geometry();
  assert.deepEqual(
    moving.title,
    first.title,
    "shared title remains still during the horizontal transition",
  );
  assert.ok(
    moving.panels[0].left < first.panels[0].left - 100 &&
      moving.panels[0].left > first.panels[0].left - first.panels[0].width,
    "upper content is between projects while title stays fixed",
  );
  await page.screenshot({
    path: "artifacts/projects-stationary-title-transition.png",
  });
  await seek(stops[0]);
  await page.getByRole("button", { name: "Next project", exact: true }).click();
  await page.waitForFunction(
    () => document.querySelector("#projects").dataset.activeProject === "1",
  );
  await settled();
  assert.ok(
    Math.abs((await geometry()).panels[1].left - first.panels[0].left) < 2,
  );
  assert.deepEqual(
    (await geometry()).grid,
    first.grid,
    "project viewport remains anchored",
  );
  assert.deepEqual(
    (await geometry()).title,
    first.title,
    "Projects title stays stationary while upper content slides",
  );
  assert.ok(
    await page
      .locator(".project-screen")
      .nth(0)
      .evaluate((el) => el.inert),
  );
  await page.screenshot({ path: "artifacts/projects-stage-02.png" });
  assert.ok(await page.locator('#projects video').evaluate(video => video.paused), 'video pauses outside the visible project');
  await page.getByRole("button", { name: "Next project", exact: true }).click();
  await page.waitForFunction(
    () => document.querySelector("#projects").dataset.activeProject === "2",
  );
  await settled();
  assert.ok(
    await page
      .getByRole("button", { name: "Next project", exact: true })
      .isDisabled(),
  );
  await page.screenshot({ path: "artifacts/projects-stage-03.png" });
  await page
    .getByRole("button", { name: "Previous project", exact: true })
    .click();
  await page.waitForFunction(
    () => document.querySelector("#projects").dataset.activeProject === "1",
  );
  await settled();
  await seek(stops[0]);
  assert.ok(
    Math.abs((await geometry()).panels[0].left - first.panels[0].left) < 2,
    "reverse returns to first project",
  );
  await seek(start + 120);
  const dash = await page
    .locator(".project-panels")
    .first()
    .evaluate((el) => parseFloat(getComputedStyle(el).opacity));
  assert.ok(dash > 0 && dash < 1, "editorial composition enters at the start");
  await seek(start - 450);
  assert.ok(
    Math.abs(
      await page
        .locator("#interests")
        .evaluate((el) => el.getBoundingClientRect().top),
    ) < 2,
    "gallery held behind one incoming project stage",
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.waitForTimeout(300);
  assert.ok(await page.locator('#projects video').evaluate(video => video.paused), 'reduced motion pauses autoplay');
  assert.equal(await page.locator(".has-project-stage").count(), 0);
  assert.ok(
    await page
      .locator(".project-screen")
      .evaluateAll((els) => els.every((el) => !el.inert)),
  );
  assert.ok(
    await page
      .locator(".project-screen")
      .nth(1)
      .evaluate(
        (el) =>
          el.getBoundingClientRect().top >
          document.querySelector(".project-screen").getBoundingClientRect()
            .bottom -
            1,
      ),
  );
  await page.emulateMedia({ reducedMotion: "no-preference" });
  for (const size of [
    { width: 390, height: 844 },
    { width: 768, height: 1024 },
    { width: 844, height: 390 },
    { width: 1280, height: 720 },
    { width: 1366, height: 600 },
    { width: 1280, height: 640 },
    { width: 1024, height: 600 },
    { width: 1200, height: 500 },
  ]) {
    await page.setViewportSize(size);
    await page.waitForTimeout(650);
    assert.ok(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      "no horizontal document overflow",
    );
    if (size.width <= 900) {
      assert.equal(await page.locator(".has-project-stage").count(), 0);
      assert.ok(
        await page
          .locator(".project-screen")
          .evaluateAll((els) => els.every((el) => !el.inert)),
      );
      await page.locator(".project-screen").first().scrollIntoViewIfNeeded();
      await page.screenshot({
        path: `artifacts/projects-vertical-${size.width}.png`,
      });
    } else {
      assert.equal(
        await page.locator(".has-project-stage").count(),
        1,
        "horizontal stage at laptop widths regardless of height",
      );
      const stops = await readStops();
      for (let i = 0; i < stops.length; i++) {
        await page.evaluate((y) => scrollTo(0, y), stops[i]);
        await settled();
        const bounds = await page
          .locator(".project-screen")
          .nth(i)
          .boundingBox();
        assert.ok(
          Math.abs(bounds.y - 24) < 2 && bounds.x >= 0 && bounds.x < 50,
          "each laptop project scrolls into the same pinned viewport",
        );
      }
      await page.screenshot({
        path:
          "artifacts/projects-laptop-" +
          size.width +
          "-" +
          size.height +
          ".png",
      });
    }
  }
  const fallbackPage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await fallbackPage.route('**/videos/supertuff-hero.mp4', route => route.abort());
  await fallbackPage.goto('http://127.0.0.1:5183/#projects');
  await fallbackPage.waitForFunction(() => {
    const project = document.querySelector('.project-screen');
    const image = project.querySelector('.project-media-pair figure:first-child img');
    return !project.querySelector('video') && image?.naturalWidth > 0;
  });
  await fallbackPage.close();
  assert.deepEqual(errors, []);
  console.log(
    "PASS: three horizontal projects; cropped editorial titles and paired images; forward/backward controls; reversible scroll; one Interests overlap; hidden-panel inert handling; reduced-motion stack; responsive vertical fallback; no overflow.",
  );
} finally {
  await browser?.close();
  await server.close();
}
