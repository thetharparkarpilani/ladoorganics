import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const here = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(here, "../public");
const logoPath = path.join(publicDir, "lado-organics-logo.svg");
const logo = await fs.readFile(logoPath);

async function createIcon(size, filename, maskable = false) {
  const safeWidth = size * (maskable ? 0.66 : 0.76);
  const safeHeight = size * (maskable ? 0.44 : 0.54);
  const artwork = await sharp(logo)
    .resize(Math.round(safeWidth), Math.round(safeHeight), { fit: "contain" })
    .png()
    .toBuffer();

  const background = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
      <rect width="${size}" height="${size}" fill="#204E36"/>
      <circle cx="${size / 2}" cy="${size / 2}" r="${size * 0.445}" fill="#FDF9F5"/>
      <circle cx="${size / 2}" cy="${size / 2}" r="${size * 0.46}" fill="none" stroke="#D9C49A" stroke-width="${Math.max(1, size * 0.012)}"/>
    </svg>`
  );

  const outputPath = path.join(publicDir, filename);
  await sharp(background)
    .composite([{ input: artwork, gravity: "centre" }])
    .png()
    .toFile(outputPath);
  const metadata = await sharp(outputPath).metadata();
  if (metadata.width !== size || metadata.height !== size) {
    throw new Error(`Invalid dimensions for ${filename}: ${metadata.width}x${metadata.height}`);
  }
}

await Promise.all([
  createIcon(16, "favicon-16.png"),
  createIcon(32, "favicon-32.png"),
  createIcon(180, "apple-touch-icon.png"),
  createIcon(192, "icon-192.png"),
  createIcon(512, "icon-512.png"),
  createIcon(512, "icon-maskable-512.png", true),
]);

console.log("Verified Lado Organics icon dimensions: 16, 32, 180, 192 and 512px (including maskable) from the approved master logo.");
