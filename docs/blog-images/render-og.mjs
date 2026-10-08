// Render social (OpenGraph) images: node docs/blog-images/render-og.mjs
// 1. docs/blog-images/og/<name>.html  -> public/og/<name>.jpg       (site pages)
// 2. public/blog/<slug>/hero.webp     -> public/og/blog/<slug>.jpg  (blog posts and the manifesto)
// All outputs are 1200 x 630 JPEG, the size LinkedIn, Facebook, X and Slack expect.
// Needs: playwright (Chromium) and sharp. See docs/blog-image-style-guide.md.
import { chromium } from "playwright";
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../..");
const W = 1200, H = 630;
const jpg = (img) => img.resize(W, H).jpeg({ quality: 86, mozjpeg: true });
const report = (out) => console.log(`${path.relative(root, out)}  ${(fs.statSync(out).size / 1024).toFixed(0)} KB`);

// 1. Site page cards
const ogSrc = path.join(here, "og");
const ogOut = path.join(root, "public", "og");
fs.mkdirSync(ogOut, { recursive: true });
const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const page = await browser.newPage({ deviceScaleFactor: 2, viewport: { width: 1300, height: 800 } });
for (const file of fs.readdirSync(ogSrc).filter((f) => f.endsWith(".html"))) {
  await page.goto(pathToFileURL(path.join(ogSrc, file)).href);
  await page.evaluate(() => document.fonts.ready);
  const png = await page.locator("#canvas").screenshot({ type: "png" });
  const out = path.join(ogOut, file.replace(/\.html$/, ".jpg"));
  await jpg(sharp(png)).toFile(out);
  report(out);
}
await browser.close();

// 2. Blog heroes (1600 x 900, 16:9) cropped to 1.91:1. The crop takes 60 px off the top,
// so the headline and the signal trace at the bottom stay in the picture.
const blogOut = path.join(ogOut, "blog");
fs.mkdirSync(blogOut, { recursive: true });
const blogDir = path.join(root, "public", "blog");
for (const slug of fs.readdirSync(blogDir)) {
  const hero = path.join(blogDir, slug, "hero.webp");
  if (!fs.existsSync(hero)) continue;
  const { width, height } = await sharp(hero).metadata();
  const cropH = Math.round((width * H) / W);
  const out = path.join(blogOut, `${slug}.jpg`);
  await jpg(sharp(hero).extract({ left: 0, top: Math.max(0, height - cropH), width, height: Math.min(cropH, height) })).toFile(out);
  report(out);
}
