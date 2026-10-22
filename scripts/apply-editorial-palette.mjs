/* global console */
import fs from "node:fs/promises";
const files = [
  "src/index.css",
  "src/styles/hero-brush.css",
  "src/styles/hero-reading.css",
  "src/styles/interests-collage.css",
  "src/styles/projects-blueprint.css",
  "src/styles/characters.css",
  "src/styles/opening-motion.css",
];
const palette = [];
let previous = [];
try {
  previous = JSON.parse(
    await fs.readFile("docs/editorial-palette-history.json", "utf8"),
  );
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}
for (const file of files) {
  const input = await fs.readFile(file, "utf8"),
    colors = { ...previous.find((entry) => entry.file === file)?.colors };
  const output = input.replace(
    /#([0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{4}|[0-9a-f]{3})(?![0-9a-f])/gi,
    (full, hex) => {
      const expanded =
        hex.length <= 4 ? [...hex].map((char) => char + char).join("") : hex;
      const r = parseInt(expanded.slice(0, 2), 16),
        g = parseInt(expanded.slice(2, 4), 16),
        b = parseInt(expanded.slice(4, 6), 16);
      const gray = Math.round(r * 0.2126 + g * 0.7152 + b * 0.0722)
        .toString(16)
        .padStart(2, "0");
      const result = `#${gray}${gray}${gray}${expanded.slice(6)}`;
      if (result.toLowerCase() !== full.toLowerCase()) colors[full] = result;
      return result;
    },
  );
  await fs.writeFile(file, output);
  palette.push({ file, colors });
}
await fs.writeFile(
  "docs/editorial-palette-history.json",
  JSON.stringify(palette, null, 2),
);
console.log(
  "Converted mounted stylesheet colors to grayscale; original color mappings recorded.",
);
