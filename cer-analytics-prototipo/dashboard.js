// CER Analytics · Panel web del predio (dashboard)
// Todos los valores son de ejemplo para el testeo.

const estado = { mes: 4, cuartel: 4 };

// Ahorro mensual en miles de pesos por hectárea (suma: agua 96, agroquímicos 71, horas 47 = 214)
const MESES = ['Septiembre', 'Octubre', 'Noviembre', 'Diciembre', 'Enero', 'Febrero'];
const CORTOS = ['Sep', 'Oct', 'Nov', 'Dic', 'Ene', 'Feb'];
const AGUA = [8, 12, 16, 18, 22, 20];
const AGRO = [6, 9, 11, 14, 16, 15];
const HORAS = [4, 6, 8, 9, 10, 10];

const ALERTAS = [
  { titulo: 'Riesgo de helada · Cuartel 4', nivel: 'Alta', texto: 'Mínima de −1 °C entre 02:00 y 06:00 h. Activar riego antiheladas solo en este cuartel y postergar la aplicación.', ahorro: 'Ahorro estimado: $ 85.000 a $ 120.000 por ha (80 % de confianza)', fondo: 'var(--ambar-cl)', color: 'var(--ambar-osc)' },
  { titulo: 'Humedad baja · Cuartel 2', nivel: 'Media', texto: 'La humedad de suelo bajó del umbral recomendado. Adelantar el turno de riego de mañana.', ahorro: 'Ahorro estimado: $ 12.000 a $ 18.000 por ha', fondo: 'var(--azul-cl)', color: 'var(--azul-osc)' },
  { titulo: 'Planilla de cosecha pendiente', nivel: 'Baja', texto: 'La planilla del cuartel 6 no se ha cargado esta semana. El capataz referente puede usar la plantilla CSV abierta.', ahorro: 'Mejora la precisión de las estimaciones', fondo: 'var(--gris-cl)', color: 'var(--gris-osc)' }
];

const CUARTELES = [
  { n: 1, variedad: 'Santina', ha: '4', humedad: '31 %', minima: '1 °C', labor: 'Poda · hace 2 días', ahorro: '$ 205.000 / ha', reco: 'Mantener el calendario de riego actual.', estado: 'Riego al día', tipo: 'ok' },
  { n: 2, variedad: 'Santina', ha: '3,5', humedad: '19 %', minima: '1 °C', labor: 'Raleo · hace 5 días', ahorro: '$ 188.000 / ha', reco: 'Adelantar el turno de riego de mañana en 6 horas.', estado: 'Humedad baja', tipo: 'media' },
  { n: 3, variedad: 'Lapins', ha: '4,5', humedad: '28 %', minima: '0 °C', labor: 'Poda · hoy', ahorro: '$ 221.000 / ha', reco: 'Sin acciones pendientes.', estado: 'Riego al día', tipo: 'ok' },
  { n: 4, variedad: 'Lapins', ha: '4', humedad: '30 %', minima: '−1 °C', labor: 'Aplicación · hace 3 días', ahorro: '$ 236.000 / ha', reco: 'Activar riego antiheladas desde las 01:30 h y postergar la aplicación hasta superar los 8 °C.', estado: 'Riesgo de helada', tipo: 'alta' },
  { n: 5, variedad: 'Regina', ha: '4', humedad: '27 %', minima: '1 °C', labor: 'Riego · ayer', ahorro: '$ 214.000 / ha', reco: 'Sin acciones pendientes.', estado: 'Riego al día', tipo: 'ok' },
  { n: 6, variedad: 'Regina', ha: '4', humedad: '26 %', minima: '1 °C', labor: 'Cosecha · sin registro', ahorro: '$ 216.000 / ha', reco: 'Cargar la planilla de cosecha de la semana.', estado: 'Datos pendientes', tipo: 'baja' }
];
const TONOS = { ok: ['#79A85C', '#2D5221'], media: ['#2F6E9E', '#1F4E73'], alta: ['#C8810E', '#7A4700'], baja: ['#8A939C', '#3D4752'] };

const FUENTES = [
  ['Sensor de humedad · marca A', 'MQTT', 'hace 4 min', 'En línea', 'ok'],
  ['Sensor de humedad · marca B', 'REST', 'hace 38 min', 'En línea', 'ok'],
  ['Sensor de humedad · marca C', 'Conector priorizado', '—', 'En integración', 'warn'],
  ['Estación meteorológica', 'REST', 'hace 6 min', 'En línea', 'ok'],
  ['Planilla de cosecha', 'Plantilla CSV abierta', 'hace 6 días', 'En línea', 'ok'],
  ['Libreta de aplicaciones', 'Carga guiada', 'hace 3 días', 'En línea', 'ok']
];

const PERMISOS = [
  ['Agrónomo asesor', 'Recomendaciones de manejo', 'Sin acceso', 'neutro'],
  ['Investigación CER', 'Datos anonimizados', 'Vence el 31-03-2027', 'ok'],
  ['Exportadora', 'Solo trazabilidad por lote', 'Vence el 31-03-2027', 'ok'],
  ['Proveedor de insumos', 'Consumo de agroquímicos', 'Vence en 12 días', 'warn']
];

const LABORES = [
  ['Hoy, 09:40', 'Poda', '3', '6', '4', 'App · sin señal, pendiente', 'warn'],
  ['Ayer, 16:10', 'Riego', '5', '3', '1', 'App · sincronizado', 'ok'],
  ['Hace 2 días', 'Poda', '1', '7', '5', 'App · sincronizado', 'ok'],
  ['Hace 3 días', 'Aplicación', '4', '4', '2', 'App · sincronizado', 'ok'],
  ['Hace 5 días', 'Raleo', '2', '8', '6', 'Planilla en papel', 'neutro']
];

// ---------- interacción ----------
document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-accion]');
  if (!el) return;
  const accion = el.dataset.accion;
  const valor = Number(el.dataset.arg);
  if (accion === 'mes' && (!Number.isInteger(valor) || valor < 0 || valor >= MESES.length)) return;
  if (accion === 'cuartel' && !CUARTELES.some((q) => q.n === valor)) return;
  if (!['mes', 'cuartel'].includes(accion)) return;
  estado[accion] = valor;
  render();
  document.querySelector(`[data-accion="${accion}"][data-arg="${valor}"]`).focus({ preventScroll: true });
});

function actualizarMenu() {
  const seccion = window.location.hash || '#resumen';
  document.querySelectorAll('.menu a').forEach((enlace) => {
    const activo = enlace.getAttribute('href') === seccion;
    enlace.classList.toggle('activo', activo);
    if (activo) enlace.setAttribute('aria-current', 'location');
    else enlace.removeAttribute('aria-current');
  });
}

window.addEventListener('hashchange', actualizarMenu);

const logo = `<svg width="32" height="32" viewBox="0 0 28 28" aria-hidden="true"><rect width="28" height="28" rx="7" fill="#3F6F2E"></rect><path d="M9 18c0-5 4-8 10-8-1 6-4 9-10 8z" fill="#fff"></path><path d="M9 19l5-5" stroke="#3F6F2E" stroke-width="1.4"></path></svg>`;

// ---------- secciones ----------
function lateral() {
  const items = [['resumen', 'Resumen'], ['ahorro', 'Ahorro'], ['alertas', 'Alertas'], ['cuarteles', 'Cuarteles'], ['fuentes', 'Fuentes de datos'], ['permisos', 'Permisos'], ['labores', 'Labores']];
  return `
    <aside class="lateral">
      <div class="logo">${logo}CER Analytics</div>
      <nav class="menu" aria-label="Secciones">
        ${items.map(([id, label], i) => `<a href="#${id}" class="${i === 0 ? 'activo' : ''}">${label}</a>`).join('')}
      </nav>
      <a class="ir-app" href="index.html">← Ver la aplicación móvil</a>
      <div class="apoyo">
        <span>Embajador asignado</span><b>[NOMBRE DEL EMBAJADOR]</b>
        <span>Capataz referente: [NOMBRE DEL CAPATAZ]</span>
        <span>Próxima visita: [FECHA]</span>
      </div>
    </aside>`;
}

function kpis() {
  return `
    <section class="kpis" aria-label="Métricas clave">
      <div class="card kpi"><span class="eyebrow">Pesos por ha ahorrados</span><span class="valor" style="color:var(--verde)">$ 214.000</span><span class="sub">Estimado · se verifica al cierre contra la línea base</span></div>
      <div class="card kpi"><span class="eyebrow">Permisos vigentes</span><span class="valor">3 de 4</span><span class="sub">Cada uno con fecha de vencimiento</span></div>
      <div class="card kpi"><span class="eyebrow">Labores digitales</span><span class="valor">84 %</span><div class="barra-prog"><div style="width:84%"></div></div></div>
      <div class="card kpi"><span class="eyebrow">Integración de fuente nueva</span><span class="valor">2 días</span><span class="sub">Promedio desde la solicitud de conexión</span></div>
    </section>`;
}

function grafico() {
  const k = 190 / 50;
  const columnas = CORTOS.map((m, i) => {
    const total = AGUA[i] + AGRO[i] + HORAS[i];
    return `
      <button class="columna ${estado.mes === i ? 'sel' : ''}" data-accion="mes" data-arg="${i}" aria-pressed="${estado.mes === i}" aria-label="${MESES[i]}: ${total} mil pesos por hectárea">
        <b>${total}</b>
        <span class="apilada">
          <span style="height:${Math.round(HORAS[i] * k)}px;background:#E0B04F"></span>
          <span style="height:${Math.round(AGRO[i] * k)}px;background:#79A85C"></span>
          <span style="height:${Math.round(AGUA[i] * k)}px;background:#2F6E9E"></span>
        </span>
      </button>`;
  }).join('');
  const i = estado.mes;
  return `
    <section id="ahorro" class="card" style="flex:3 1 520px">
      <div style="display:flex;flex-wrap:wrap;justify-content:space-between;gap:10px;align-items:baseline">
        <h2>Ahorro por hectárea, mes a mes</h2>
        <div class="leyenda">
          <span><i class="cuadro" style="background:#2F6E9E"></i>Agua</span>
          <span><i class="cuadro" style="background:#79A85C"></i>Agroquímicos</span>
          <span><i class="cuadro" style="background:#E0B04F"></i>Horas hombre</span>
        </div>
      </div>
      <div class="grafico">${columnas}</div>
      <div class="etiquetas">${CORTOS.map((m) => `<span>${m}</span>`).join('')}</div>
      <div class="detalle-mes">
        <b>${MESES[i]}</b>
        <span>Agua $ ${AGUA[i]} mil · Agroquímicos $ ${AGRO[i]} mil · Horas hombre $ ${HORAS[i]} mil</span>
        <b style="color:var(--verde)">Total $ ${AGUA[i] + AGRO[i] + HORAS[i]} mil por ha</b>
      </div>
      <span class="sub" style="font-size:12px">Miles de pesos por hectárea. Seleccione un mes para ver el desglose.</span>
    </section>`;
}

function alertas() {
  return `
    <section id="alertas" class="card" style="flex:2 1 320px">
      <h2>Alertas activas</h2>
      ${ALERTAS.map((a) => `
        <div class="alerta" style="background:${a.fondo}">
          <div class="tit" style="color:${a.color}"><span>${a.titulo}</span><span class="nivel">${a.nivel}</span></div>
          <p>${a.texto}</p>
          <b style="font-size:13px;color:var(--verde-osc)">${a.ahorro}</b>
        </div>`).join('')}
    </section>`;
}

function cuarteles() {
  const det = CUARTELES.find((q) => q.n === estado.cuartel);
  return `
    <section id="cuarteles" class="card">
      <div style="display:flex;flex-wrap:wrap;justify-content:space-between;gap:8px;align-items:baseline">
        <h2>Estado por cuartel</h2><span class="sub" style="font-size:12px">Seleccione un cuartel para ver su detalle</span>
      </div>
      <div class="fila-cards">
        <div class="cuarteles">
          ${CUARTELES.map((q) => `
            <button class="cuartel ${estado.cuartel === q.n ? 'sel' : ''}" data-accion="cuartel" data-arg="${q.n}" aria-pressed="${estado.cuartel === q.n}">
              <span class="tit">Cuartel ${q.n}<span class="punto" style="background:${TONOS[q.tipo][0]}"></span></span>
              <span class="sub" style="font-size:12px">${q.variedad} · ${q.ha} ha</span>
              <b style="font-size:12px;color:${TONOS[q.tipo][1]}">${q.estado}</b>
            </button>`).join('')}
        </div>
        <div class="detalle">
          <span class="eyebrow">Detalle</span>
          <b style="font-size:20px">Cuartel ${det.n} · ${det.variedad}</b>
          <div class="mini-grid">
            <div class="mini"><span>Humedad de suelo</span><b>${det.humedad}</b></div>
            <div class="mini"><span>Mínima pronosticada</span><b>${det.minima}</b></div>
            <div class="mini"><span>Última labor</span><b style="font-size:14px">${det.labor}</b></div>
            <div class="mini"><span>Ahorro estimado</span><b style="font-size:14px;color:var(--verde-osc)">${det.ahorro}</b></div>
          </div>
          <span style="font-size:13px;line-height:1.45"><b>Recomendación:</b> ${det.reco}</span>
        </div>
      </div>
    </section>`;
}

function fuentesYPermisos() {
  return `
    <div class="fila-cards">
      <section id="fuentes" class="card" style="flex:1 1 440px">
        <h2>Fuentes de datos</h2>
        <div class="tabla-box"><table style="min-width:440px">
          <thead><tr><th>Fuente</th><th>Ingreso</th><th>Último dato</th><th>Estado</th></tr></thead>
          <tbody>${FUENTES.map(([n, v, u, e, t]) => `<tr><td><b>${n}</b></td><td>${v}</td><td style="color:var(--gris)">${u}</td><td><span class="pill ${t}">${e}</span></td></tr>`).join('')}</tbody>
        </table></div>
        <span class="sub" style="font-size:12px">Todas las fuentes se ordenan con un modelo de datos común.</span>
      </section>
      <section id="permisos" class="card" style="flex:1 1 340px">
        <h2>Quién usa sus datos</h2>
        ${PERMISOS.map(([n, u, e, t]) => `<div class="permiso"><div><b>${n}</b><span class="uso">${u}</span></div><span class="pill ${t}">${e}</span></div>`).join('')}
        <span class="sub" style="font-size:12px">Cada permiso tiene fecha de vencimiento y caduca solo. Se administran desde la aplicación móvil y quedan registrados.</span>
      </section>
    </div>`;
}

function labores() {
  return `
    <section id="labores" class="card">
      <h2>Labores recientes del cuaderno de campo</h2>
      <div class="tabla-box"><table style="min-width:560px">
        <thead><tr><th>Fecha</th><th>Labor</th><th>Cuartel</th><th class="der">Horas</th><th class="der">Trabajadores</th><th>Registro</th></tr></thead>
        <tbody>${LABORES.map(([f, l, c, h, p, r, t]) => `<tr><td style="color:var(--gris)">${f}</td><td><b>${l}</b></td><td>${c}</td><td class="der">${h}</td><td class="der">${p}</td><td><span class="pill ${t}">${r}</span></td></tr>`).join('')}</tbody>
      </table></div>
    </section>`;
}

// ---------- render ----------
function render() {
  const y = window.scrollY;
  document.getElementById('dashboard').innerHTML = `
    <div class="layout">
      ${lateral()}
      <main class="contenido">
        <header id="resumen" class="cabecera">
          <div><span class="sub">Predio demostración · 24 ha de cerezos · Temporada 2026-2027</span><h1>Panel del predio</h1></div>
          <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center">
            <span class="pill ok" style="font-size:12px;padding:7px 12px">5 de 6 fuentes en línea</span>
            <span class="sub" style="font-size:12px">Valores de ejemplo para el testeo</span>
          </div>
        </header>
        ${kpis()}
        <div class="fila-cards">${grafico()}${alertas()}</div>
        ${cuarteles()}
        ${fuentesYPermisos()}
        ${labores()}
      </main>
    </div>`;
  window.scrollTo(0, y);
  actualizarMenu();
}

render();
