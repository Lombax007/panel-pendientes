// Captura las pantallas a 390 px con Playwright.
// Uso: con `npm run dev` corriendo →  node scripts/capturas.mjs [url-base]
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const BASE = process.argv[2] ?? 'http://localhost:5173';
const OUT = 'screenshots';
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
  locale: 'es-MX',
  timezoneId: 'America/Mexico_City',
});
const page = await ctx.newPage();
const shots = [
  ['1-tablero', '/'],
  ['2-avisos', '/avisos'],
  ['3-detalle', '/tarea/estadistica'],
  ['4-cursos', '/cursos'],
];
for (const [name, path] of shots) {
  await page.goto(BASE + path);
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: true });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  console.log(`${name}: scroll horizontal = ${overflow > 0 ? overflow + ' px ✗' : 'no ✓'}`);
}
await browser.close();
