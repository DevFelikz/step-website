/**
 * Gör bakgrund ~transparent via chroma mot genomsnittlig hörnfärg (studio-vit/grå).
 * Kör: node scripts/snus-transparent.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const src = path.join(root, "public", "step-snus-tin.png");

const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const w = info.width;
const h = info.height;
const ch = info.channels;
if (ch !== 4) throw new Error(`Expected RGBA, got ${ch} channels`);

function px(x, y) {
  const i = (y * w + x) * 4;
  return [data[i], data[i + 1], data[i + 2]];
}

const corners = [
  [0, 0],
  [w - 1, 0],
  [0, h - 1],
  [w - 1, h - 1],
];
/** Om hörn redan är transparenta (t.ex. omladdad fil), använd ljus studio-bakgrund. */
let br = 245,
  bg = 245,
  bb = 245;
const opaqueSamples = [];
for (const [x, y] of corners) {
  const i = (y * w + x) * 4;
  if (data[i + 3] > 200) opaqueSamples.push([data[i], data[i + 1], data[i + 2]]);
}
if (opaqueSamples.length) {
  br = opaqueSamples.reduce((s, p) => s + p[0], 0) / opaqueSamples.length;
  bg = opaqueSamples.reduce((s, p) => s + p[1], 0) / opaqueSamples.length;
  bb = opaqueSamples.reduce((s, p) => s + p[2], 0) / opaqueSamples.length;
}

/** Ju högre, desto mer aggressiv knockout (justera vid behov). */
const tol = 44;

for (let y = 0; y < h; y++) {
  for (let x = 0; x < w; x++) {
    const i = (y * w + x) * 4;
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const dist = Math.hypot(r - br, g - bg, b - bb);
    if (dist < tol) {
      data[i + 3] = 0;
    }
  }
}

let buf = await sharp(Buffer.from(data), {
  raw: { width: w, height: h, channels: 4 },
})
  .png({ compressionLevel: 9, effort: 10 })
  .toBuffer();

/** Mindre fil för kort (behåller transparens). */
buf = await sharp(buf)
  .resize({ width: 480, height: 480, fit: "inside", withoutEnlargement: true })
  .png({ compressionLevel: 9, effort: 10 })
  .toBuffer();

fs.writeFileSync(src, buf);
const meta = await sharp(src).metadata();
console.log("Uppdaterade", src, { w: meta.width, h: meta.height, hasAlpha: meta.hasAlpha });
