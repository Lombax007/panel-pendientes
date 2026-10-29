// Capturas del comparativo y del modo demo.
// Uso: con `npm run dev` corriendo →  node scripts/capturas-demo.mjs [url-base]
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const BASE = process.argv[2] ?? 'http://localhost:5173';
const OUT = 'screenshots';
mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();
const opts = { deviceScaleFactor: 2, locale: 'es-MX', timezoneId: 'America/Mexico_City' };
const overflow = (p) => p.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);

// Comparativo a 390 px: las dos vistas del toggle.
let page = await browser.newPage({ ...opts, viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
await page.goto(`${BASE}/comparativo?reset`);
await page.waitForTimeout(400);
await page.screenshot({ path: `${OUT}/5-comparativo-390-antes.png`, fullPage: true });
await page.getByRole('button', { name: 'Después', exact: true }).click();
await page.waitForTimeout(300);
await page.screenshot({ path: `${OUT}/6-comparativo-390-despues.png`, fullPage: true });
console.log('comparativo 390: scroll horizontal', (await overflow(page)) > 0 ? '✗' : 'no ✓');
await page.close();

// Comparativo a 1280 px: lado a lado (como se proyecta).
page = await browser.newPage({ ...opts, viewport: { width: 1280, height: 800 } });
await page.goto(`${BASE}/comparativo`);
await page.waitForTimeout(400);
await page.screenshot({ path: `${OUT}/7-comparativo-1280.png`, fullPage: true });
console.log('comparativo 1280: scroll horizontal', (await overflow(page)) > 0 ? '✗' : 'no ✓');
await page.close();

// Tablero con ?demo=1, antes y después de +1 día.
page = await browser.newPage({ ...opts, viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
await page.goto(`${BASE}/?demo=1`);
await page.waitForTimeout(400);
await page.screenshot({ path: `${OUT}/8-demo-presente.png` });
await page.getByRole('button', { name: '+1 día' }).click();
await page.waitForTimeout(400);
await page.screenshot({ path: `${OUT}/9-demo-mas-1-dia.png` });
console.log('demo: scroll horizontal', (await overflow(page)) > 0 ? '✗' : 'no ✓');
await browser.close();
