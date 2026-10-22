/* global console */
import fs from "node:fs/promises";
const photos = [
  [
    "nature-7",
    "https://unsplash.com/photos/a-forest-trail-with-tall-trees-in-the-sunlight-rDdPGS2BP8E",
  ],
  [
    "food-3",
    "https://unsplash.com/photos/a-bowl-of-korean-kalguksu-with-kimchi-vCfQOMDW8R0",
  ],
  [
    "food-4",
    "https://unsplash.com/photos/a-table-laden-with-korean-dishes-and-people-dining-wfa4EHNM_1k",
  ],
  [
    "food-5",
    "https://unsplash.com/photos/a-close-up-of-a-sushi-on-a-wrapper-JvmEirSibE8",
  ],
  ["food-6", "https://unsplash.com/photos/variety-of-cooked-foods-NOAzwcMzZJA"],
  ["food-7", "https://unsplash.com/photos/a-table-full-of-food-oXULSch338E"],
  [
    "pose-4",
    "https://unsplash.com/photos/woman-posing-by-lamppost-on-city-street-wHYy7Dgzkmc",
  ],
  [
    "pose-5",
    "https://unsplash.com/photos/a-woman-in-a-black-dress-standing-on-a-street-rDFQ2hIuAMA",
  ],
  [
    "pose-6",
    "https://unsplash.com/photos/a-woman-posing-for-a-photo-MM-7mi1ElaI",
  ],
  [
    "pose-7",
    "https://unsplash.com/photos/a-woman-smiling-and-posing-VIpzYdCJNgs",
  ],
  [
    "drama-4",
    "https://unsplash.com/photos/a-busy-city-street-at-night-with-neon-lights-4MxdmOoLfIU",
  ],
  [
    "drama-5",
    "https://unsplash.com/photos/a-night-view-of-a-city-with-a-lot-of-tall-buildings-Trc3kWd20aQ",
  ],
  [
    "drama-6",
    "https://unsplash.com/photos/woman-sitting-on-brown-sofa-watching-tv-NIixtO6hja8",
  ],
  [
    "drama-7",
    "https://unsplash.com/photos/couple-watching-a-movie-on-a-large-screen-television-D9xbVoT6tVg",
  ],
];
const credits = JSON.parse(
  await fs.readFile("public/images/gallery/credits.json", "utf8"),
);
let index = 0;
await Promise.all(
  Array.from({ length: 3 }, async () => {
    while (index < photos.length) {
      const [name, page] = photos[index++];
      if (credits.some((c) => c.name === name && c.page === page)) continue;
      const r = await fetch(page, { signal: AbortSignal.timeout(30000) });
      if (!r.ok) throw Error(name + ": " + r.status);
      const html = await r.text();
      const tag = html.match(
        /<meta[^>]*(?:property|name)="og:image"[^>]*>/,
      )?.[0];
      const source = tag
        ?.match(/content="([^"]+)"/)?.[1]
        ?.replaceAll("&amp;", "&");
      if (!source) throw Error(name + ": no image");
      const url = new URL(source);
      url.search = "";
      for (const [k, v] of Object.entries({
        w: "1000",
        q: "82",
        fm: "webp",
        fit: "max",
      }))
        url.searchParams.set(k, v);
      const image = await fetch(url, { signal: AbortSignal.timeout(30000) });
      if (!image.ok || !image.headers.get("content-type")?.startsWith("image/"))
        throw Error(name + ": invalid image");
      const bytes = Buffer.from(await image.arrayBuffer());
      await fs.writeFile(`public/images/gallery/${name}.webp`, bytes);
      const record = {
        name,
        page,
        source: url.href,
        license: "https://unsplash.com/license",
        bytes: bytes.length,
      };
      const found = credits.findIndex((c) => c.name === name);
      if (found >= 0) credits[found] = record;
      else credits.push(record);
      console.log(name, bytes.length);
    }
  }),
);
await fs.writeFile(
  "public/images/gallery/credits.json",
  JSON.stringify(credits, null, 2) + "\n",
);
