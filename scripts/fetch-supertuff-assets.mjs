/* global process, console */
import fs from "node:fs/promises";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const sharp = require(process.env.SHARP_MODULE || "sharp");
const page = "https://supertuffmenus.com/";
const assets = [
  ["supertuff-restaurant-menus", "files/Red_Onion_a_la_cart_and_dessert_SuperTuffMenus.jpg"],
  ["supertuff-agliolio-menus", "files/Agliolio_main_and_dessert_SuperTuffMenus.jpg"],
];
const path = "public/images/projects/credits.json";
const credits = JSON.parse(await fs.readFile(path, "utf8"));
for (const [name, file] of assets) {
  const source = `${page}cdn/shop/${file}?width=1200`;
  const response = await fetch(source);
  if (!response.ok || !response.headers.get("content-type")?.startsWith("image/"))
    throw Error(`Invalid project image: ${name} (${response.status})`);
  const bytes = await sharp(Buffer.from(await response.arrayBuffer()))
    .rotate().resize({ width: 1200, withoutEnlargement: true })
    .webp({ quality: 84 }).toBuffer();
  await fs.writeFile(`public/images/projects/${name}.webp`, bytes);
  const record = { name, page, source, purpose: "SuperTuffMenus project showcase; imagery from the supplied project website", attribution: "SuperTuffMenus; original brand and product imagery", bytes: bytes.length };
  const i = credits.findIndex(c => c.name === name);
  if (i < 0) credits.push(record); else credits[i] = record;
  console.log(name, bytes.length);
}
await fs.writeFile(path, JSON.stringify(credits, null, 2) + "\n");
const videoSource = "https://cdn.shopify.com/videos/c/o/v/e97189ea7ca64997b45466a11025e138.mp4";
const video = await fetch(videoSource);
if (!video.ok) throw Error(`Hero video: ${video.status}`);
await fs.mkdir("public/videos", { recursive: true });
const videoBytes = Buffer.from(await video.arrayBuffer());
await fs.writeFile("public/videos/supertuff-hero.mp4", videoBytes);
const record = { name: "supertuff-hero", page, source: videoSource, purpose: "Original SuperTuffMenus homepage hero video", bytes: videoBytes.length };
const index = credits.findIndex(c => c.name === record.name);
if (index < 0) credits.push(record); else credits[index] = record;
await fs.writeFile(path, JSON.stringify(credits, null, 2) + "\n");
console.log("supertuff-hero", videoBytes.length);
