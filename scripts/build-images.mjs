// Builds optimized, individually cropped derivatives of the original photographs and logo.
// Originals live in assets-original/ and are never modified.
// Run with:  npm run images
import sharp from "sharp";
import { readFile, mkdir, writeFile } from "node:fs/promises";
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

// Founder profile photo: the same crop as the portrait, named for search and sharing.
{
  const info = crops["elango-s"];
  const box = info.crops.portrait;
  const width = box.right - box.left, height = box.bottom - box.top;
  const base = sharp(src(info.source)).rotate().extract({ left: box.left, top: box.top, width, height });
  for (const size of [480, 800]) {
    const target = Math.min(size, width);
    await base.clone().resize({ width: target, withoutEnlargement: true }).webp({ quality: 84, effort: 5 }).toFile(out(`team/elango-s-founder-sinc-${size}.webp`));
  }
  // JPEG for social previews and structured data (widest support)
  await base.clone().resize({ width: Math.min(800, width), withoutEnlargement: true }).jpeg({ quality: 86, mozjpeg: true }).toFile(out("team/elango-s-founder-sinc.jpg"));
  console.log("founder profile photo done");
}

// Logo: the supplied JPEG (white ground) and the transparent mark derived from the same artwork.
for (const size of [96, 256, 512]) {
  await sharp(src("sinc-logo.jpeg")).resize(size).webp({ quality: 90 }).toFile(out(`brand/sinc-logo-${size}.webp`));
}
for (const size of [160, 480, 900]) {
  await sharp(src("sinc-logo-mark-transparent.png")).resize({ width: size }).webp({ quality: 90, alphaQuality: 100 }).toFile(out(`brand/sinc-mark-${size}.webp`));
}
await sharp(src("sinc-logo.jpeg")).resize(1200, 630, { fit: "contain", background: "#FBFCFF" }).jpeg({ quality: 88 }).toFile(out("brand/sinc-og.jpg"));
// Site icons for browser tabs, Google results and home screens, all from the real logo mark
// (transparent artwork, trimmed and centred on a square so it stays legible at 16-48 px).
{
  const mark = sharp(src("sinc-logo-mark-transparent.png")).trim();
  const { info } = await mark.clone().toBuffer({ resolveWithObject: true });
  const side = Math.round(Math.max(info.width, info.height) * 1.1); // ~5% breathing room each side
  const square = await mark.clone()
    .extend({
      top: Math.floor((side - info.height) / 2), bottom: Math.ceil((side - info.height) / 2),
      left: Math.floor((side - info.width) / 2), right: Math.ceil((side - info.width) / 2),
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png().toBuffer();
  for (const size of [16, 32, 48, 96, 192, 512]) {
    await sharp(square).resize(size, size).png({ compressionLevel: 9, palette: size >= 192 }).toFile(path.join(root, "public", `favicon-${size}.png`));
  }
  // home-screen icon: on white, because iOS fills transparent areas with black
  await sharp(square).resize(150, 150).extend({ top: 15, bottom: 15, left: 15, right: 15, background: "#ffffff" })
    .flatten({ background: "#ffffff" }).png().toFile(path.join(root, "public", "apple-touch-icon.png"));
  // favicon.ico (16, 32 and 48 px) — the file Google and many browsers request first.
  // An .ico can hold PNG images directly: a 6-byte header, a 16-byte entry per image, then the PNGs.
  const pngs = await Promise.all([16, 32, 48].map((s) => sharp(square).resize(s, s).png().toBuffer().then((b) => ({ s, b }))));
  const head = Buffer.alloc(6 + 16 * pngs.length);
  head.writeUInt16LE(0, 0); head.writeUInt16LE(1, 2); head.writeUInt16LE(pngs.length, 4);
  let offset = head.length;
  pngs.forEach(({ s, b }, i) => {
    const e = 6 + 16 * i;
    head.writeUInt8(s, e); head.writeUInt8(s, e + 1); head.writeUInt8(0, e + 2); head.writeUInt8(0, e + 3);
    head.writeUInt16LE(1, e + 4); head.writeUInt16LE(32, e + 6); head.writeUInt32LE(b.length, e + 8); head.writeUInt32LE(offset, e + 12);
    offset += b.length;
  });
  await writeFile(path.join(root, "public", "favicon.ico"), Buffer.concat([head, ...pngs.map((p) => p.b)]));
  console.log("site icons done");
}
console.log("brand images done");
