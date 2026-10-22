/* global console */
import fs from "node:fs/promises";
const photos = [
  [
    "pastel-facade",
    "https://unsplash.com/photos/blue-and-pink-building-abstract-painting-PyHmVFgIuy8",
  ],
  [
    "rooftop-colour",
    "https://unsplash.com/photos/a-pink-and-blue-building-with-a-black-roof-sFa3jORqOrw",
  ],
  [
    "botanical-pink",
    "https://unsplash.com/photos/pink-and-green-leaves-on-white-wall-sD-gJzsrQt4",
  ],
];
const credits = JSON.parse(
  await fs.readFile("public/images/projects/credits.json", "utf8"),
);
for (const [name, page] of photos) {
  const response = await fetch(page);
  if (!response.ok) throw Error(`${name}: ${response.status}`);
  const html = await response.text();
  const tag = html.match(/<meta[^>]*(?:property|name)="og:image"[^>]*>/)?.[0];
  const source = tag?.match(/content="([^"]+)"/)?.[1]?.replaceAll("&amp;", "&");
  if (!source) throw Error("No image: " + name);
  const url = new URL(source);
  url.search = "";
  for (const [k, v] of Object.entries({
    w: "1200",
    q: "82",
    fm: "webp",
    fit: "max",
  }))
    url.searchParams.set(k, v);
  const image = await fetch(url);
  if (!image.ok || !image.headers.get("content-type")?.startsWith("image/"))
    throw Error("Invalid image: " + name);
  const bytes = Buffer.from(await image.arrayBuffer());
  await fs.writeFile(`public/images/projects/${name}.webp`, bytes);
  const record = {
    name,
    page,
    source: url.href,
    license: "https://unsplash.com/license",
    purpose: "Temporary editorial imagery, not project work",
    bytes: bytes.length,
  };
  const i = credits.findIndex((c) => c.name === name);
  if (i >= 0) credits[i] = record;
  else credits.push(record);
  console.log(name, bytes.length);
}
await fs.writeFile(
  "public/images/projects/credits.json",
  JSON.stringify(credits, null, 2) + "\n",
);
