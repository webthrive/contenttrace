// Render blog images: node docs/blog-images/render.mjs <slug> [<slug> ...]
// Reads docs/blog-images/<slug>/*.html, writes public/blog/<slug>/<name>.webp
// Needs: playwright (Chromium) and sharp. See docs/blog-image-style-guide.md.
import { chromium } from "playwright";
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../..");
const slugs = process.argv.slice(2);
if (!slugs.length) { console.error("Usage: node docs/blog-images/render.mjs <slug> ..."); process.exit(1); }

const SIZES = { hero: 1600, inline: 1400 }; // output width in px

const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const page = await browser.newPage({ deviceScaleFactor: 2, viewport: { width: 1300, height: 800 } });
for (const slug of slugs) {
  const srcDir = path.join(here, slug);
  const outDir = path.join(root, "public", "blog", slug);
  fs.mkdirSync(outDir, { recursive: true });
  for (const file of fs.readdirSync(srcDir).filter((f) => f.endsWith(".html"))) {
    await page.goto(pathToFileURL(path.join(srcDir, file)).href);
    await page.evaluate(() => document.fonts.ready);
    const el = page.locator("#canvas");
    const kind = (await el.getAttribute("class"))?.includes("hero") ? "hero" : "inline";
    const png = await el.screenshot({ type: "png" });
    const out = path.join(outDir, file.replace(/\.html$/, ".webp"));
    await sharp(png).resize({ width: SIZES[kind] }).webp({ quality: 85 }).toFile(out);
    console.log(`${out}  ${(fs.statSync(out).size / 1024).toFixed(0)} KB`);
  }
}
await browser.close();
