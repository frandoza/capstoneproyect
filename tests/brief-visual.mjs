import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdirSync } from "node:fs";
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_PATH || "playwright");
const browser = await chromium.launch({ headless: true, channel: "msedge" });
const errors = [];
const label = value => ({ "Lácteos": "Lácteos: leches y yogures", "Helados": "Helados y postres congelados" }[value] || value);
mkdirSync("outputs/verification", { recursive: true });
try {
  for (const width of [1440, 768, 390, 320]) {
    const page = await browser.newPage({ viewport: { width, height: 1000 } });
    page.on("pageerror", e => errors.push(e.message));
    await page.goto("http://localhost:5173/#contacto");
    await page.locator("canvas").waitFor();
    await page.waitForTimeout(1200);
    const form = page.locator(".brief-form");
    const preview = page.locator(".brief-preview");
    for (const [application, flavor, image] of [["Bebidas", "Maracuyá", "beverage"], ["Lácteos", "Arándano", "dairy"], ["Helados", "Pistacho", "ice-cream"], ["Panificación", "Mantequilla", "bakery"]]) {
      await page.getByRole("radio", { name: label(application), exact: true }).check();
      assert.equal(await form.locator('.flavor-choice').count(), 12);
      for (const choice of await form.locator('.flavor-choice').all()) {
        await choice.click();
        assert.equal(await page.getByLabel("Perfil de sabor buscado").inputValue(), (await choice.textContent()).trim());
        assert(await choice.evaluate(el => el.scrollWidth <= el.clientWidth), "Flavor label fits");
      }
      await page.getByRole("button", { name: flavor, exact: true }).click();
      assert.equal(await page.getByLabel("Perfil de sabor buscado").inputValue(), flavor);
      assert.equal(await preview.locator(".preview-application").textContent(), label(application));
      assert(await form.locator('.application-choice-body').evaluateAll(items => items.every(el => el.scrollHeight <= el.clientHeight && el.scrollWidth <= el.clientWidth)), "Application labels fit");
      assert.equal(await preview.locator(".preview-flavor").textContent(), flavor);
      assert((await preview.locator(".brief-product-image").getAttribute("src")).includes(image));
      await preview.locator(".brief-product-image").evaluate(img => img.decode());
      await page.waitForTimeout(600);
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `No overflow ${width}`);
    }
    await page.getByRole("button", { name: "Pausar animación", exact: true }).click();
    const frameBounds = await preview.locator(".brief-preview-stage").boundingBox();
    const imageBounds = await preview.locator(".brief-product-image").boundingBox();
    assert(imageBounds.y >= frameBounds.y - 1 && imageBounds.y + imageBounds.height <= frameBounds.y + frameBounds.height + 1, "Product stays within its stage");
    const image = preview.locator(".brief-product-image");
    const first = await image.evaluate(el => getComputedStyle(el).transform);
    await page.waitForTimeout(300);
    assert.equal(await image.evaluate(el => getComputedStyle(el).transform), first, "Pause freezes movement");
    await page.getByRole("button", { name: "Reanudar animación", exact: true }).click();
    await preview.scrollIntoViewIfNeeded();
    await page.waitForTimeout(650);
    const moving = await image.evaluate(el => getComputedStyle(el).transform);
    await page.waitForTimeout(400);
    assert.notEqual(await image.evaluate(el => getComputedStyle(el).transform), moving, "Animation resumes");
    await page.getByLabel("Perfil de sabor buscado").fill("Perfil herbal personalizado");
    assert.equal(await preview.locator(".preview-flavor").textContent(), "Perfil herbal personalizado");
    assert.equal(await form.locator('.flavor-choice[aria-pressed="true"]').count(), 0);
    await page.getByRole("radio", { name: label("Lácteos"), exact: true }).check();
    assert.equal(await page.getByLabel("Perfil de sabor buscado").inputValue(), "Perfil herbal personalizado", "Category changes preserve custom profiles");
    await page.getByRole("button", { name: "Fresa", exact: true }).click();
    await page.getByLabel("Etapa del proyecto").selectOption("Formulación");
    await page.getByRole("button", { name: "Pausar animación", exact: true }).click();
    await page.screenshot({ path: `outputs/verification/visual-form-full-${width}.png`, fullPage: true });
    await form.screenshot({ path: `outputs/verification/visual-form-${width}.png` });
    await page.getByRole("button", { name: "Ver orientación", exact: true }).click();
    await page.getByLabel("Empresa", { exact: true }).fill("Prueba visual");
    await page.getByRole("button", { name: "Atrás", exact: true }).click();
    assert(await page.getByRole("radio", { name: label("Lácteos"), exact: true }).isChecked());
    assert.equal(await page.getByLabel("Perfil de sabor buscado").inputValue(), "Fresa");
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.getByRole("radio", { name: label("Helados"), exact: true }).check();
    await page.waitForTimeout(400);
    assert.equal(await page.getByRole("button", { name: "Reanudar animación", exact: true }).count(), 0);
    const reduced = await image.evaluate(el => getComputedStyle(el).transform);
    await page.waitForTimeout(400);
    assert.equal(await image.evaluate(el => getComputedStyle(el).transform), reduced);
    await page.close();
  }
  assert.deepEqual(errors, []);
  console.log("PASS: 4 applications and flavors, custom profile, images, pause/resume, reduced motion, preserved selections, desktop/tablet/mobile 1440/768/390/320.");
} finally { await browser.close(); }
