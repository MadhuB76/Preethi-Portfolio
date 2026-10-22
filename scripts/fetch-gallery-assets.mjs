import fs from "node:fs/promises";
const pages = [
  [
    "dance-1",
    "https://unsplash.com/photos/group-of-people-dancing-6Woj_wozqmA",
  ],
  [
    "dance-2",
    "https://unsplash.com/photos/time-lapse-photography-of-man-dancing-ckm1yAe6jhU",
  ],
  [
    "drama-1",
    "https://unsplash.com/photos/cozy-movie-night-with-popcorn-and-candles-TuFxgmMy1I0",
  ],
  [
    "drama-2",
    "https://unsplash.com/photos/a-busy-city-street-at-night-with-neon-signs-74ii3BHkPtw",
  ],
  ["food-1", "https://unsplash.com/photos/assorted-food-in-plate-LWGYDKPXewI"],
  [
    "food-2",
    "https://unsplash.com/photos/assorted-dishes-on-trays-at-tabletop-mELUldtDGDQ",
  ],
  [
    "pose-1",
    "https://unsplash.com/photos/woman-standing-in-the-middle-of-the-road-0UECcInuCR4",
  ],
  [
    "pose-2",
    "https://unsplash.com/photos/woman-standing-on-street-NZtv2JaKLbg",
  ],
  [
    "dance-3",
    "https://unsplash.com/photos/woman-dancing-on-street-AcuxaqeAU9o",
  ],
  [
    "dance-4",
    "https://unsplash.com/photos/woman-dancing-in-front-of-people-sitting-on-floor-YTbTdB6AAUU",
  ],
  [
    "dance-5",
    "https://unsplash.com/photos/woman-dancing-at-an-outdoor-event-38k4LID9kDw",
  ],
  [
    "dance-6",
    "https://unsplash.com/photos/woman-dancing-photography-u1yt6xiNilU",
  ],
  [
    "dance-7",
    "https://unsplash.com/photos/woman-dancing-on-beach-at-sunset-MVoyG_AWm7I",
  ],
  [
    "drama-3",
    "https://unsplash.com/photos/person-holding-black-remote-control-U-Vu_r6qyyU",
  ],
  [
    "music-7",
    "https://unsplash.com/photos/young-woman-wearing-headphones-listening-to-music-4WJp265sXeI",
  ],
  [
    "doodle-photo-1",
    "https://unsplash.com/photos/person-drawing-on-white-sketch-pad-zuQDqLFavI4",
  ],
  [
    "doodle-photo-2",
    "https://unsplash.com/photos/person-drawing-a-face-in-a-sketchbook-with-pencils-OuJcIGnWCZI",
  ],
  [
    "doodle-photo-3",
    "https://unsplash.com/photos/a-person-drawing-a-picture-on-a-piece-of-paper-Afk8NlUbJq0",
  ],
  [
    "doodle-photo-4",
    "https://unsplash.com/photos/person-drawing-in-a-notebook-on-a-park-bench-Oo5KUeDPs9k",
  ],
  [
    "doodle-photo-5",
    "https://unsplash.com/photos/a-desk-with-a-pen-notebook-and-cell-phone-on-it-MYNQbqSXvbM",
  ],
  [
    "doodle-photo-6",
    "https://unsplash.com/photos/person-drawing-on-white-paper-D6MxJwwsuGk",
  ],
  [
    "doodle-photo-7",
    "https://unsplash.com/photos/a-person-drawing-on-a-paper-wvyn7maVGe0",
  ],
  [
    "food-3",
    "https://unsplash.com/photos/table-with-leftover-food-and-drinks-after-meal-p3p5RzMvKfM",
  ],
  [
    "pose-3",
    "https://unsplash.com/photos/a-woman-with-long-hair-is-posing-for-a-picture-sQs6OCV3ouk",
  ],
];
const results = await Promise.all(
  pages.map(async ([name, page]) => {
    try {
      const response = await fetch(page);
      if (!response.ok) throw Error("page " + response.status);
      const html = await response.text();
      const tag = html.match(
        /<meta[^>]*(?:property|name)="og:image"[^>]*>/,
      )?.[0];
      let src = tag?.match(/content="([^"]+)"/)?.[1]?.replaceAll("&amp;", "&");
      if (!src) throw Error("no og:image");
      const url = new URL(src);
      // Download the source photograph in its natural proportions rather than
      // the site's cropped social-preview composition.
      url.search = "";
      url.searchParams.set("w", "1000");
      url.searchParams.set("q", "82");
      url.searchParams.set("fm", "webp");
      url.searchParams.set("fit", "max");
      const image = await fetch(url);
      if (!image.ok || !image.headers.get("content-type")?.startsWith("image/"))
        throw Error("image " + image.status);
      const bytes = Buffer.from(await image.arrayBuffer());
      await fs.writeFile(`public/images/gallery/${name}.webp`, bytes);
      return { name, page, source: url.href, bytes: bytes.length };
    } catch (e) {
      return { name, error: e.message };
    }
  }),
);
await fs.writeFile(
  "public/images/gallery/credits.json",
  JSON.stringify(results, null, 2),
);
console.log(results.map(({ name, error, bytes }) => ({ name, error, bytes })));
