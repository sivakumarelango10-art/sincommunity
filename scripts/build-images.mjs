// Builds optimized, individually cropped derivatives of the original photographs and logo.
// Originals live in assets-original/ and are never modified.
// Run with:  npm run images
import sharp from "sharp";
import { readFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const src = (f) => path.join(root, "assets-original", f);
const out = (f) => path.join(root, "public", "images", f);

const crops = JSON.parse(await readFile(path.join(root, "scripts", "photo-crops.json"), "utf8"));
const SIZES = { portrait: [480, 800], square: [320, 640] };

await mkdir(out("team"), { recursive: true });
await mkdir(out("brand"), { recursive: true });

for (const [key, info] of Object.entries(crops)) {
  for (const [format, box] of Object.entries(info.crops)) {
    const width = box.right - box.left;
    const height = box.bottom - box.top;
    for (const size of SIZES[format]) {
      const target = Math.min(size, width); // never upscale beyond the source pixels
      const file = out(`team/${key}-${format}-${size}.webp`);
      await sharp(src(info.source))
        .rotate()
        .extract({ left: box.left, top: box.top, width, height })
        .resize({ width: target, withoutEnlargement: true })
        .webp({ quality: 82, effort: 5 })
        .toFile(file);
      console.log(`${path.relative(root, file)}  (${target}px wide from ${width}px crop)`);
    }
  }
}

// Logo: the supplied JPEG (white ground) and the transparent mark derived from the same artwork.
for (const size of [96, 256, 512]) {
  await sharp(src("sinc-logo.jpeg")).resize(size).webp({ quality: 90 }).toFile(out(`brand/sinc-logo-${size}.webp`));
}
for (const size of [160, 480, 900]) {
  await sharp(src("sinc-logo-mark-transparent.png")).resize({ width: size }).webp({ quality: 90, alphaQuality: 100 }).toFile(out(`brand/sinc-mark-${size}.webp`));
}
await sharp(src("sinc-logo.jpeg")).resize(1200, 630, { fit: "contain", background: "#FBFCFF" }).jpeg({ quality: 88 }).toFile(out("brand/sinc-og.jpg"));
console.log("brand images done");
