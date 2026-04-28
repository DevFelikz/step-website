import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const svgPath = path.join(root, "public", "brand", "step-logo.svg");
const outPath = path.join(root, "public", "brand", "step-logo.png");
const outMarkPath = path.join(root, "public", "brand", "step-mark.png");

const svg = fs.readFileSync(svgPath);

/** Full lockup (ikon + STEP) */
await sharp(svg, { density: 300 })
  .png({ compressionLevel: 9 })
  .toFile(outPath);

/** Bara ikonen, kvadrat (transparent bakgrund) */
const markSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="none"/>
  <g transform="translate(76, 76) scale(9)">
    <rect x="1" y="1" width="38" height="38" rx="11" fill="#141414" stroke="#2a2a2a" stroke-width="1"/>
    <path fill="#c9a227" d="M9 30.5V26h8v4.5H9zm0-9V17h14v4.5H9zm0-9V8h20v4.5H9z"/>
    <path fill="#c9a227" fill-opacity="0.25" d="M9 30.5h26v1.5H9v-1.5z"/>
  </g>
</svg>`;

await sharp(Buffer.from(markSvg), { density: 300 })
  .png({ compressionLevel: 9 })
  .toFile(outMarkPath);

console.log("Skrev:", outPath);
console.log("Skrev:", outMarkPath);
