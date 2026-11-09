const { chromium } = require('C:/Users/alexi/AppData/Local/ms-playwright-go/1.57.0/package');
const fs=require('fs');
const assert=require('node:assert/strict');
const routes=['/', '/ahorros', '/cuarteles', '/simulador', '/alertas', '/labores', '/fuentes', '/permisos'];
(async()=>{
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
 const page=await browser.newPage({viewport:{width:1440,height:1000}});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const results=[];
 for(const route of routes){
  const response=await page.goto('http://127.0.0.1:3100'+route,{waitUntil:'networkidle'});
  assert.equal(response.status(),200,route);
  assert.equal(await page.locator('nav a[aria-current="page"]').getAttribute('href'),route);
  const sections=await page.locator('main section[id]').evaluateAll(els=>els.map(e=>e.id));
  assert.deepEqual(sections,route==='/'?[]:[route.slice(1)]);
  results.push({route,status:response.status(),title:await page.locator('h1').innerText(),sections});
 }
 const responsive=[];
 for(const width of [320,390,768,1440]){
  await page.setViewportSize({width,height:900});
  for(const route of routes){
   await page.goto('http://127.0.0.1:3100'+route,{waitUntil:'networkidle'});
   const layout=await page.evaluate(()=>({viewport:innerWidth,document:document.documentElement.scrollWidth}));
   responsive.push({width,route,...layout});
  }
 }
 await page.goto('http://127.0.0.1:3100/alertas',{waitUntil:'networkidle'});
 await page.getByRole('button',{name:'Ver cuartel',exact:true}).nth(1).click();
 await page.waitForURL('**/cuarteles?cuartel=2');
 assert.match(await page.locator('main').innerText(),/Cuartel 2 - Santina Sur/);
 await page.locator('nav').getByRole('link',{name:'Ahorro y ganancias'}).click();
 await page.waitForURL('**/ahorros');
 await page.getByRole('button',{name:'Febrero',exact:true}).click();
 assert.equal(await page.getByRole('button',{name:'Febrero',exact:true}).getAttribute('aria-pressed'),'true');
 assert.match(await page.locator('[aria-live="polite"]').innerText(),/45\.000/);
 await page.getByText('Ver tabla de datos del gráfico',{exact:true}).click();
 assert.match(await page.locator('tfoot').innerText(),/214/);
 await page.getByRole('link',{name:'Simular temporada',exact:true}).click();
 await page.waitForURL('**/simulador');
 assert.equal(await page.getByRole('slider').count(),6);
 assert.equal(errors.length,0,errors.join('\n'));
 const overflows=responsive.filter(r=>r.document>r.viewport+1);
 const report={results,responsive,overflows,errors,interactionChecks:'Alertas -> Cuartel 2; navegación por enlace; Febrero; tabla total214; simulador6 sliders'};
 fs.writeFileSync('agentes/funcionamiento/VERIFICACION_PAGINAS.json',JSON.stringify(report,null,2));
 console.log(JSON.stringify({routes:results.length,responsiveChecks:responsive.length,overflows,errors,interactions:'OK'},null,2));
 await browser.close();
 assert.equal(overflows.length,0,'Hay desbordamiento horizontal');
})().catch(error=>{console.error(error);process.exitCode=1;});
