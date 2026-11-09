const { chromium } = require('C:/Users/alexi/AppData/Local/ms-playwright-go/1.57.0/package');
const assert = require('node:assert/strict');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 400 } });
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    const ready = () => page.waitForFunction(() => !document.querySelector('#labores button').disabled);
    await page.goto('http://127.0.0.1:3000/labores');
    await ready();
    const trigger = page.getByRole('button', { name: 'Registrar Labor', exact: true });
    await trigger.click();
    const dialog = page.getByRole('dialog');
    await dialog.waitFor();
    assert.equal(await page.getByLabel('Tipo de Labor', { exact: true }).inputValue(), 'Riego controlado por pulsos');
    assert(await page.getByLabel('Tipo de Labor', { exact: true }).evaluate((el) => el === document.activeElement));
    for (const key of [...Array(15).fill('Tab'), ...Array(15).fill('Shift+Tab')]) {
      await page.keyboard.press(key);
      assert(await page.evaluate(() => document.querySelector('dialog').contains(document.activeElement)));
    }
    await page.keyboard.press('Escape');
    assert.equal(await page.getByRole('dialog').count(), 0);
    assert(await trigger.evaluate((el) => el === document.activeElement));
    await trigger.click();
    const initialRows = await page.locator('#labores tbody tr').count();
    const hours = page.getByLabel('Horas de Labor', { exact: true });
    const cost = page.getByLabel('Costo Estimado de Jornada ($ CLP)', { exact: true });
    const save = page.getByRole('button', { name: 'Guardar en este navegador', exact: true });
    await hours.fill('');
    await save.click();
    assert(await hours.evaluate((el) => el.validity.valueMissing));
    assert.equal(await page.locator('#labores tbody tr').count(), initialRows);
    await hours.fill('4');
    await cost.fill('-1000');
    await save.click();
    assert(await cost.evaluate((el) => el.validity.rangeUnderflow));
    const bounds = await dialog.evaluate((el) => ({ height: el.getBoundingClientRect().height, scroll: el.scrollHeight, viewport: innerHeight }));
    assert(bounds.height <= bounds.viewport - 20 && bounds.scroll > bounds.height);
    await cost.fill('48000');
    await save.click();
    assert.equal(await page.locator('#labores tbody tr').count(), initialRows + 1);
    assert((await page.getByRole('status').innerText()).includes('No se sincronizó'));
    await page.goto('http://127.0.0.1:3000/fuentes');
    await page.goto('http://127.0.0.1:3000/labores');
    await ready();
    assert.equal(await page.locator('#labores tbody tr').count(), initialRows + 1);
    await page.reload();
    await ready();
    assert.equal(await page.locator('#labores tbody tr').count(), initialRows + 1);
    await page.getByLabel('Buscar por labor o cuartel').fill('zz-no-match');
    assert((await page.locator('#labores tbody').innerText()).includes('No hay labores'));
    await page.evaluate(() => localStorage.setItem('cer-analytics-labores-demo-v1', '{bad json'));
    await page.reload();
    await ready();
    assert.equal(await page.locator('#labores tbody tr').count(), initialRows);
    assert((await page.getByRole('status').innerText()).includes('No se pudieron recuperar'));
    await page.evaluate(() => localStorage.setItem('cer-analytics-labores-demo-v1', JSON.stringify([{ id: 'lab-1', fecha: 'Demo', labor: 'Riego controlado por pulsos', cuartel: 'Cuartel 1', horas: 4, trabajadores: 2, costoLabor: 48000 }, { id: 'lab-invalid', fecha: 'Demo', labor: 'Bad', cuartel: 'Cuartel 1', horas: 4, trabajadores: 2, costoLabor: 48000 }])));
    await page.reload();
    await ready();
    assert.equal(await page.locator('#labores tbody tr').count(), initialRows);
    assert((await page.getByRole('status').innerText()).includes('Se omitieron'));
    await page.evaluate(() => { Storage.prototype.setItem = () => { throw new DOMException('Blocked', 'QuotaExceededError'); }; });
    await trigger.click();
    await save.click();
    assert((await page.getByRole('status').innerText()).includes('se perderá al salir o recargar'));
    assert.equal(await page.locator('#labores tbody tr').count(), initialRows + 1);
    assert.deepEqual(errors, []);
    console.log(JSON.stringify({ initialSelection: true, focusTrapBothDirections: true, escapeAndRestore: true, requiredAndNegativeValidation: true, shortViewport: bounds, persistenceNavigationAndReload: true, emptySearch: true, corruptJsonAndPayload: true, blockedStorageHonestFeedback: true, errors }));
  } finally {
    await browser.close();
  }
})().catch((error) => { console.error(error); process.exit(1); });
