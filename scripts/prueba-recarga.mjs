// Prueba de persistencia (criterio de aceptación 6) y del reinicio entre participantes.
// Uso: con `npm run dev` corriendo →  node scripts/prueba-recarga.mjs [url-base]
import { chromium } from 'playwright';

const BASE = process.argv[2] ?? 'http://localhost:5173';
let fails = 0;
const check = (ok, msg) => {
  console.log(`${ok ? '✓' : '✗'} ${msg}`);
  if (!ok) fails++;
};

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 390, height: 844 },
  isMobile: true,
  hasTouch: true,
  locale: 'es-MX',
  timezoneId: 'America/Mexico_City',
});
await ctx.clock.install({ time: new Date('2026-10-29T12:00:00-06:00') });

const counter = (p) => p.getByRole('img', { name: /pendientes sin entregar/ }).textContent();
const h24 = (p) => p.getByRole('button', { name: /24 h antes/ });

// Día 1: activo un recordatorio en una tarea y entrego otra.
let page = await ctx.newPage();
await page.goto(`${BASE}/?reset`);
check((await counter(page)) === '8', 'jueves 29 oct: el contador empieza en 8');
await page.goto(`${BASE}/tarea/escala-redondeo`);
await h24(page).click();
check((await h24(page).getAttribute('aria-pressed')) === 'true', 'recordatorio 24 h activado en "Escala y redondeo"');
await page.goto(`${BASE}/tarea/estadistica`);
await page.goto(`${BASE}/tarea/escala-redondeo`);
check(await page.getByText('Vence dom 1 nov · 18:00').isVisible(), 'control: el jueves, "Escala" vence dom 1 nov');
await page.goto(`${BASE}/tarea/estadistica`);
await page.getByRole('button', { name: 'Añadir entrega' }).click();
check(/Estado:\s*Entregada/.test(await page.locator('dl').innerText()), '"Ejercicios de estadística" marcada como entregada');
await page.close(); // cierro la pestaña

// Día 2: el reloj avanza al día siguiente y abro una pestaña nueva.
await ctx.clock.setSystemTime(new Date('2026-10-30T09:00:00-06:00'));
page = await ctx.newPage();
await page.goto(`${BASE}/`);
check(!(await page.getByText('Ejercicios de estadística').isVisible()), 'viernes 30 oct: la entregada sigue fuera del tablero');
check((await counter(page)) === '7', `el contador quedó en 7 (dice ${await counter(page)})`);
await page.goto(`${BASE}/tarea/escala-redondeo`);
check((await h24(page).getAttribute('aria-pressed')) === 'true', 'el recordatorio de 24 h se conservó');
// Las fechas son relativas: "en 3 días" se recalcula y ahora cae el lun 2 nov (antes, dom 1 nov).
check(await page.getByText('Vence lun 2 nov · 18:00').isVisible(), 'las fechas se recalcularon relativas al nuevo día (lun 2 nov)');
await page.reload();
check((await h24(page).getAttribute('aria-pressed')) === 'true', 'y sigue después de recargar');

// Reinicio con toque largo en el contador.
await page.goto(`${BASE}/`);
const box = await page.getByRole('img', { name: /pendientes sin entregar/ }).boundingBox();
await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
await page.mouse.down();
await ctx.clock.runFor(1000);
await page.mouse.up();
check(await page.getByText('Listo, empezamos de cero.').isVisible(), 'toque largo en el contador → confirmación de reinicio');
check((await counter(page)) === '8', 'después del reinicio el contador vuelve a 8');

// Reinicio con ?reset.
await page.goto(`${BASE}/tarea/escala-redondeo`);
await h24(page).click();
await page.goto(`${BASE}/avisos?reset`);
await page.waitForURL(`${BASE}/avisos`);
check(new URL(page.url()).search === '', '?reset se quita de la liga');
await page.goto(`${BASE}/tarea/escala-redondeo`);
check((await h24(page).getAttribute('aria-pressed')) === 'false', '?reset borró el recordatorio');

// Movimiento reducido.
await page.emulateMedia({ reducedMotion: 'reduce' });
await page.goto(`${BASE}/avisos`);
const anim = await page.locator('.anim-fade').evaluate((e) => getComputedStyle(e).animationName);
check(anim === 'none', `con prefers-reduced-motion no hay animación (${anim})`);

await browser.close();
console.log(fails ? `\n${fails} falla(s)` : '\nTodo bien.');
process.exit(fails ? 1 : 0);
