/* global process, console */
import fs from "node:fs/promises";
import { createRequire } from "node:module";
import { createHash } from "node:crypto";
import { interests, projects } from "../src/data/editorial.js";
const require = createRequire(import.meta.url);
const sharp = require(process.env.SHARP_MODULE || "sharp");
const sources = [
  ...new Set([
    "/images/profile/preethi.webp",
    ...interests.flatMap((i) => [i.image, ...i.images]),
    ...projects.flatMap((p) => p.images),
  ]),
];
await fs.mkdir("public/images/optimized", { recursive: true });
const manifest = {};
let original = 0,
  large = 0,
  small = 0;
for (const source of sources) {
  const bytes = await fs.readFile("public" + source);
  original += bytes.length;
  const meta = await sharp(bytes).metadata();
  const variants = [];
  for (const width of [480, 960]) {
    const { data, info } = await sharp(bytes)
      .rotate()
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 78, effort: 5 })
      .toBuffer({ resolveWithObject: true });
    const hash = createHash("sha256").update(data).digest("hex").slice(0, 12);
    const src = `/images/optimized/${source.split("/").pop().replace(".webp", "")}-${hash}-${info.width}.webp`;
    await fs.writeFile("public" + src, data);
    variants.push({ src, width: info.width, bytes: data.length });
  }
  manifest[source] = { width: meta.width, height: meta.height, variants };
  small += variants[0].bytes;
  large += variants[1].bytes;
}
await fs.writeFile(
  "src/data/image-manifest.json",
  JSON.stringify(manifest, null, 2) + "\n",
);
console.log({
  images: sources.length,
  originalBytes: original,
  smallBytes: small,
  largeBytes: large,
});
