import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import convert from "heic-convert";
import exifr from "exifr";

// One-time local preparation; originals stay untouched. Outputs strip EXIF/GPS.
const source = process.argv[2];
if (!source) throw new Error("Pass the source photo directory.");
const root = process.cwd();
const review = path.join(root, "test-results", "photo-review");
await fs.mkdir(review, { recursive: true });
const categories = {
  "C71EFDE5-6AD0-463F-8972-9C6FE522B989.jpg": "soccer",
  "E7B70951-5CCB-4FA0-ABB8-98A586A18E64.jpg": "soccer",
  "531FA750-0115-4524-A348-045A34D9C09E.jpg": "networking",
  "IMG_0323.JPG": "networking",
  "D1A30706-2F2F-468E-AA04-307A0769CF11.jpg": "memes",
  "IMG_2141.PNG": "memes",
  "IMG_2733.PNG": "memes",
  "IMG_6545.HEIC": "committee",
  "IMG_0959.heic": "events",
  "ooo-shi-1790019333321.jpg": "app",
};
// Optional filenames let new additions be processed without replacing prior entries.
let manifest = {};
try {
  manifest = JSON.parse(
    await fs.readFile(path.join(root, "src", "photoAssets.json"), "utf8"),
  );
} catch {}
const selected = process.argv.slice(3);
const tiles = [];
for (const name of (selected.length
  ? selected
  : await fs.readdir(source)
).sort()) {
  if (!/\.(heic|jpe?g|png)$/i.test(name)) continue;
  const original = await fs.readFile(path.join(source, name));
  let date = null;
  try {
    const metadata = await exifr.parse(original, ["DateTimeOriginal"]);
    date = metadata?.DateTimeOriginal?.toISOString() || null;
  } catch {}
  const input = /\.heic$/i.test(name)
    ? Buffer.from(
        await convert({ buffer: original, format: "JPEG", quality: 0.95 }),
      )
    : original;
  const stem = path.parse(name).name.toLowerCase();
  const folder = categories[name] || "events";
  const destination = path.join(root, "public", "assets", folder);
  await fs.mkdir(destination, { recursive: true });
  const variants = [];
  for (const [suffix, width] of [
    ["small", 640],
    ["large", 1600],
  ]) {
    const filename = `${stem}-${suffix}.webp`;
    const output = await sharp(input)
      .rotate()
      .resize({ width, height: 1800, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer({ resolveWithObject: true });
    await fs.writeFile(path.join(destination, filename), output.data);
    variants.push({
      src: `/assets/${folder}/${filename}`,
      width: output.info.width,
      height: output.info.height,
      bytes: output.info.size,
    });
  }
  manifest[name] = {
    original: name,
    date,
    src: variants[1].src,
    srcSet: variants.map((v) => `${v.src} ${v.width}w`).join(", "),
    width: variants[1].width,
    height: variants[1].height,
    bytes: variants[1].bytes,
  };
  const thumb = await sharp(input)
    .rotate()
    .resize(300, 225, { fit: "contain", background: "#17171e" })
    .png()
    .toBuffer();
  const label = `<svg width="300" height="45"><rect width="300" height="45" fill="#17171e"/><text x="10" y="18" fill="white" font-size="10" font-family="Arial">${name}</text><text x="10" y="35" fill="#f5a9ce" font-size="10" font-family="Arial">${date || "No capture date"}</text></svg>`;
  const tile = await sharp({
    create: { width: 300, height: 270, channels: 3, background: "#17171e" },
  })
    .composite([
      { input: thumb, top: 0, left: 0 },
      { input: Buffer.from(label), top: 225, left: 0 },
    ])
    .png()
    .toBuffer();
  tiles.push(tile);
  console.log(
    `${name}: ${date || "undated"} -> ${variants[1].src} (${Math.round(variants[1].bytes / 1024)} KB)`,
  );
}
await fs.writeFile(
  path.join(root, "src", "photoAssets.json"),
  JSON.stringify(manifest, null, 2) + "\n",
);
const rows = Math.ceil(tiles.length / 4);
await sharp({
  create: {
    width: 1200,
    height: 270 * rows,
    channels: 3,
    background: "#17171e",
  },
})
  .composite(
    tiles.map((input, i) => ({
      input,
      top: Math.floor(i / 4) * 270,
      left: (i % 4) * 300,
    })),
  )
  .jpeg({ quality: 85 })
  .toFile(path.join(review, "contact-sheet.jpg"));
