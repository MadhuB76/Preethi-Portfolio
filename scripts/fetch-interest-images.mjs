/* global process, console */
import { writeFile, mkdir } from "node:fs/promises";
const groups = {
  art: [
    "1579783902614-a3fb3927b6a5",
    "1577083552431-6e5fd01aa342",
    "1630002931917-964ccb95d0a5",
    "1541961017774-22349e4a1262",
    "1524014482380-0988169f598d",
    "1561214115-f2f134cc4912",
  ],
  music: [
    "1511379938547-c1f69419868d",
    "1493225457124-a3eb161ffa5f",
    "1516280440614-37939bbacd81",
    "1511671782779-c97d3d27a1d4",
    "1459749411175-04bf5292ceea",
    "1470225620780-dba8ba36b745",
  ],
  photography: [
    "1516035069371-29a1b244cc32",
    "1510127034890-ba27508e9f1c",
    "1452587925148-ce544e77e70d",
    "1502982720700-bfff97f2ecac",
    "1542038784456-1ea8e935640e",
    "1502920917128-1aa500764cbd",
  ],
  reading: [
    "1507842217343-583bb7270b66",
    "1481627834876-b7833e8f5570",
    "1495446815901-a7297e633e8d",
    "1512820790803-83ca734da794",
    "1485322551133-3a4c27a9d925",
    "1524578271613-d550eacf6090",
  ],
  nature: [
    "1441974231531-c6227db76b6e",
    "1472396961693-142e6e269027",
    "1448375240586-882707db888b",
    "1470770841072-f978cf4d019e",
    "1447752875215-b2761acb3c5d",
    "1501854140801-50d01698950b",
  ],
  code: [
    "1461749280684-dccba630e2f6",
    "1498050108023-c5249f4df085",
    "1515879218367-8466d910aaa4",
    "1555066931-4365d14bab8c",
    "1518770660439-4636190af475",
    "1519389950473-47ba0277781c",
  ],
};
await mkdir("public/images/interests", { recursive: true });
const credits = [];
let failures = 0;
for (const [theme, ids] of Object.entries(groups)) {
  const results = await Promise.all(
    ids.map(async (id, index) => {
      const url = `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=540&q=78&fm=webp`;
      try {
        const response = await fetch(url, {
          signal: AbortSignal.timeout(20000),
        });
        if (!response.ok) throw Error(`HTTP ${response.status}`);
        const data = await response.arrayBuffer();
        await writeFile(
          `public/images/interests/${theme}-${index + 1}.webp`,
          new Uint8Array(data),
        );
        credits.push({
          theme,
          index: index + 1,
          source: `https://images.unsplash.com/photo-${id}`,
          file: `${theme}-${index + 1}.webp`,
        });
        return `${theme}-${index + 1}: ${data.byteLength} bytes`;
      } catch (error) {
        failures++;
        return `${theme}-${index + 1}: FAILED ${error.message}`;
      }
    }),
  );
  console.log(results.join("\n"));
}
await writeFile(
  "public/images/interests/credits.json",
  JSON.stringify(credits, null, 2),
);
if (failures) process.exitCode = 1;
