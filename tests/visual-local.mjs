import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdirSync } from "node:fs";
import path from "node:path";
const require = createRequire(import.meta.url);
const playwright = process.env.PLAYWRIGHT_PATH || "playwright";
const { chromium } = require(playwright);
const { PNG } = require(process.env.PLAYWRIGHT_PATH ? path.join(path.dirname(playwright), "pngjs") : "pngjs");
const browser = await chromium.launch({ headless: true, channel: "msedge" });
mkdirSync("outputs/verification", { recursive: true });
try {
  for (const width of [1440, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    await page.goto("http://localhost:5173/");
    const canvas = page.locator("canvas");
    await canvas.waitFor();
    await canvas.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1600);
    const before = await canvas.screenshot({ path: `outputs/verification/scene-${width}.png` });
    const png = PNG.sync.read(before);
    const colors = new Set();
    for (let i = 0; i < png.data.length; i += 4 * 11) colors.add(`${png.data[i]},${png.data[i + 1]},${png.data[i + 2]}`);
    assert(colors.size > 100, `Scene ${width} is nonblank`);
    const box = await canvas.boundingBox();
    assert(box && box.width > 200 && box.height > 200);
    await page.mouse.move(box.x + box.width * .7, box.y + box.height * .5);
    await page.waitForTimeout(500);
    const after = await canvas.screenshot();
    assert(!before.equals(after), `Scene ${width} animates`);
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await page.close();
  }
  console.log("PASS: scene screenshots, nonblank pixels, movement and viewport fit at desktop/mobile widths.");
} finally { await browser.close(); }
