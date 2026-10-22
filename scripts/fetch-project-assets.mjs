/* global console */
import fs from "node:fs/promises";
const photos = [
  [
    "concrete-light",
    "Raimo Lantelankallio",
    "https://unsplash.com/photos/modern-concrete-architecture-with-dramatic-light-and-shadow-W6ZYYtHCzis",
  ],
  [
    "geometric-shadow",
    "Johnny Ho",
    "https://unsplash.com/photos/concrete-walls-with-geometric-shadows-and-light-HpUAdTJ97to",
  ],
  [
    "white-lines",
    "Amal K Raju",
    "https://unsplash.com/photos/abstract-architectural-lines-with-light-and-shadow-qaO04vmpMd8",
  ],
  [
    "interior-shadow",
    "Dark Narrative",
    "https://unsplash.com/photos/geometric-shadows-on-concrete-walls-indoors-gt1TjsZMDoo",
  ],
  [
    "white-staircase",
    "Z",
    "https://unsplash.com/photos/photo-of-white-staircase-ehMiO5aDXys",
  ],
  [
    "aalto-stairs",
    "Paul Povoroznuk",
    "https://unsplash.com/photos/unused-stairs-RRbQbCHlIZI",
  ],
];
await fs.mkdir("public/images/projects", { recursive: true });
const credits = await Promise.all(
  photos.map(async ([name, author, page]) => {
    const response = await fetch(page);
    if (!response.ok) throw Error(`${name}: ${response.status}`);
    const html = await response.text();
    const tag = html.match(/<meta[^>]*(?:property|name)="og:image"[^>]*>/)?.[0];
    const source = tag
      ?.match(/content="([^"]+)"/)?.[1]
      ?.replaceAll("&amp;", "&");
    if (!source) throw Error(`${name}: no source image`);
    const url = new URL(source);
    url.search = "";
    url.searchParams.set("w", "1200");
    url.searchParams.set("q", "85");
    url.searchParams.set("fm", "webp");
    url.searchParams.set("fit", "max");
    const image = await fetch(url);
    if (!image.ok || !image.headers.get("content-type")?.startsWith("image/"))
      throw Error(`${name}: invalid image`);
    const bytes = Buffer.from(await image.arrayBuffer());
    await fs.writeFile(`public/images/projects/${name}.webp`, bytes);
    return {
      name,
      author,
      page,
      source: url.href,
      license: "https://unsplash.com/license",
      purpose: "Temporary editorial imagery, not project work",
      bytes: bytes.length,
    };
  }),
);
await fs.writeFile(
  "public/images/projects/credits.json",
  JSON.stringify(credits, null, 2),
);
console.log(credits.map(({ name, bytes }) => ({ name, bytes })));
