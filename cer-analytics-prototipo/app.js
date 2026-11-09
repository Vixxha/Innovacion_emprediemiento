// CER Analytics · Prototipo navegable de la aplicación del productor
// Todos los valores son de ejemplo para el testeo.

const estado = {
  pantalla: 'inicio',
  enLinea: false, // la app parte "sin señal" para probar el registro offline
  permisos: [
    { id: 'agro', nombre: 'Agrónomo asesor', uso: 'Recomendaciones de manejo', on: false, hasta: '' },
    { id: 'cer', nombre: 'Investigación CER', uso: 'Datos anonimizados para mejorar modelos', on: true, hasta: 'vence el 31-03-2027' },
    { id: 'expo', nombre: 'Exportadora', uso: 'Solo trazabilidad por lote', on: true, hasta: 'vence el 31-03-2027' },
    { id: 'prov', nombre: 'Proveedor de insumos', uso: 'Consumo de agroquímicos', on: true, hasta: 'vence en 12 días' }
  ],
  eligiendo: null,
  registroPermisos: [
    { accion: 'Vencido', cuando: 'hace 3 días', detalle: 'Laboratorio de suelos · el plazo de 30 días terminó', ok: false },
    { accion: 'Otorgado', cuando: 'hace 2 semanas', detalle: 'Exportadora · hasta fin de temporada', ok: true },
    { accion: 'Otorgado', cuando: 'hace 1 mes', detalle: 'Investigación CER · hasta fin de temporada', ok: true }
  ],
  labor: 'Poda', cuartel: 3, horas: 6, personas: 4,
  labores: [],
  aplicada: false, verCalculo: false, exportado: false,
  tipoFuente: 'Sensor', marca: 'C', plantilla: false, solicitada: false,
  visita: false, llamado: false, vistos: {}
};

const MARCAS = [
  { id: 'A', nombre: 'Marca A', estado: 'Conector listo', listo: true },
  { id: 'B', nombre: 'Marca B', estado: 'Conector listo', listo: true },
  { id: 'C', nombre: 'Marca C', estado: 'Conector priorizado', listo: false },
  { id: 'X', nombre: 'Otra marca', estado: 'Solicitar conector', listo: false }
];

const FUENTES = [
  ['Sensor de humedad · marca A', 'MQTT · cada 15 min'],
  ['Sensor de humedad · marca B', 'REST · cada hora'],
  ['Estación meteorológica', 'REST · cada 10 min'],
  ['Planilla de cosecha', 'Plantilla CSV abierta'],
  ['Libreta de aplicaciones', 'Carga guiada de planilla']
];

const VIDEOS = [
  { id: 'v1', titulo: 'Registrar una labor sin señal', dur: '2 min' },
  { id: 'v2', titulo: 'Dar o revocar un permiso', dur: '1 min' },
  { id: 'v3', titulo: 'Leer una alerta en pesos por hectárea', dur: '2 min' }
];

const ICONOS = {
  inicio: 'M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z',
  labores: 'M6 3h11a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6zM6 3v18M10 8h6M10 12h6M10 16h4',
  permisos: 'M7 11V8a5 5 0 0 1 10 0v3M5 11h14v10H5zM12 15v2',
  reporte: 'M4 20V10M10 20V4M16 20v-7M22 20H2',
  ayuda: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .9-1 1.6M12 17h.01'
};

// ---------- utilidades ----------
function anotarPermiso(accion, detalle, ok) {
  estado.registroPermisos.unshift({ accion, cuando: 'Ahora', detalle, ok });
}
function cambiar(cambios) {
  Object.assign(estado, cambios);
  render();
}

// ---------- acciones (se llaman desde data-accion) ----------
const acciones = {
  ir: (id) => cambiar({ pantalla: id }),
  togglePermiso: (id) => {
    const p = estado.permisos.find((x) => x.id === id);
    if (p.on) {
      p.on = false; p.hasta = '';
      anotarPermiso('Revocado', p.nombre + ' · antes del vencimiento', false);
      cambiar({ eligiendo: null });
    } else {
      cambiar({ eligiendo: estado.eligiendo === id ? null : id });
    }
  },
  otorgar: (arg) => {
    const [id, plazo] = arg.split('|');
    const p = estado.permisos.find((x) => x.id === id);
    p.on = true;
    p.hasta = plazo === 'mes' ? 'vence en 30 días' : 'vence el 31-03-2027';
    anotarPermiso('Otorgado', p.nombre + (plazo === 'mes' ? ' · 30 días' : ' · hasta fin de temporada'), true);
    cambiar({ eligiendo: null });
  },
  cancelar: () => cambiar({ eligiendo: null }),
  labor: (v) => cambiar({ labor: v }),
  cuartel: (v) => cambiar({ cuartel: Number(v) }),
  horas: (d) => cambiar({ horas: Math.min(12, Math.max(1, estado.horas + Number(d))) }),
  personas: (d) => cambiar({ personas: Math.min(40, Math.max(1, estado.personas + Number(d))) }),
  guardar: () => {
    estado.labores.unshift({ labor: estado.labor, cuartel: estado.cuartel, horas: estado.horas, personas: estado.personas, sync: estado.enLinea });
    render();
  },
  reconectar: () => {
    estado.labores.forEach((l) => { l.sync = true; });
    cambiar({ enLinea: true });
  },
  desconectar: () => cambiar({ enLinea: false }),
  aplicar: () => cambiar({ aplicada: true }),
  calculo: () => cambiar({ verCalculo: !estado.verCalculo }),
  exportar: () => cambiar({ exportado: true }),
  tipoFuente: (v) => cambiar({ tipoFuente: v, solicitada: false }),
  marca: (v) => cambiar({ marca: v, solicitada: false }),
  plantilla: () => cambiar({ plantilla: true }),
  solicitar: () => cambiar({ solicitada: true }),
  visita: () => cambiar({ visita: true }),
  llamar: () => cambiar({ llamado: true }),
  video: (id) => { estado.vistos[id] = true; render(); }
};

document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-accion]');
  if (!el) return;
  acciones[el.dataset.accion](el.dataset.arg);
});

// ---------- piezas de interfaz ----------
const logo = `<svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true"><rect width="28" height="28" rx="7" fill="#3F6F2E"></rect><path d="M9 18c0-5 4-8 10-8-1 6-4 9-10 8z" fill="#fff"></path><path d="M9 19l5-5" stroke="#3F6F2E" stroke-width="1.4"></path></svg>`;

function chip(accion, valor, etiqueta, seleccionado, extraClase = '') {
  return `<button class="chip ${seleccionado ? 'sel' : ''} ${extraClase}" data-accion="${accion}" data-arg="${valor}" aria-pressed="${seleccionado}">${etiqueta}</button>`;
}

function volver() {
  return `<button class="btn-link" data-accion="ir" data-arg="inicio">← Volver al inicio</button>`;
}

// ---------- pantallas ----------
function pantallaInicio() {
  const marcaSel = MARCAS.find((m) => m.id === estado.marca);
  let fuentes = FUENTES.map(([n, v]) => `
    <div class="fila"><span class="fila-txt"><b>${n}</b><span>${v}</span></span><span class="pill ok">Conectada</span></div>`).join('');
  let total = FUENTES.length;
  if (estado.solicitada) {
    total += 1;
    fuentes += `<div class="fila"><span class="fila-txt"><b>${estado.tipoFuente} · ${marcaSel.nombre.toLowerCase()}</b><span>${marcaSel.listo ? 'Conector disponible' : 'Integración en 2 días hábiles'}</span></span><span class="pill ${marcaSel.listo ? 'ok' : 'warn'}">${marcaSel.listo ? 'Conectada' : 'En integración'}</span></div>`;
  }
  return `
    <div>
      <span class="sub">Buenos días</span>
      <h1 style="font-size:24px">Su cuaderno de campo</h1>
      <p class="sub">Se llena solo, habla en pesos por hectárea y la llave es suya.</p>
    </div>
    <button class="alerta-btn" data-accion="ir" data-arg="alerta">
      <span style="display:flex;flex-direction:column;gap:3px">
        <b style="font-size:14px;color:var(--ambar-osc)">Riesgo de helada esta noche</b>
        <span style="font-size:12px">Sector 4 · Ahorro estimado de $ 85.000 a $ 120.000 por ha</span>
        <span style="font-size:12px;font-weight:700;color:var(--ambar-osc);text-decoration:underline">Ver recomendación</span>
      </span>
    </button>
    <div class="card">
      <span class="eyebrow">Ahorro estimado de la temporada</span>
      <span style="font-size:32px;font-weight:800;color:var(--verde)">$ 214.000 <small style="font-size:15px">/ ha</small></span>
      <div class="grid3">
        <div class="mini"><span>Agua</span><b>$ 96.000</b></div>
        <div class="mini"><span>Agroquímicos</span><b>$ 71.000</b></div>
        <div class="mini"><span>Horas hombre</span><b>$ 47.000</b></div>
      </div>
      <span style="font-size:12px">Se verificará al cierre de la temporada contra la línea base medida en septiembre.</span>
    </div>
    <div class="card">
      <div style="display:flex;justify-content:space-between"><h2>Fuentes conectadas</h2><span class="chico">${total} fuentes</span></div>
      ${fuentes}
      <button class="btn-dash" data-accion="ir" data-arg="fuente">+ Conectar una fuente nueva</button>
    </div>
    <button class="card" style="text-align:left" data-accion="ir" data-arg="ayuda">
      <b style="font-size:14px">Su equipo de apoyo</b>
      <span class="chico">Embajador, soporte remoto y capataz referente</span>
    </button>`;
}

function pantallaFuente() {
  const marcaSel = MARCAS.find((m) => m.id === estado.marca);
  const texto = marcaSel.listo
    ? `${estado.tipoFuente} ${marcaSel.nombre.toLowerCase()}: conexión inmediata mediante el conector disponible.`
    : `${estado.tipoFuente} ${marcaSel.nombre.toLowerCase()}: tiempo estimado de integración de 2 días hábiles. El embajador le avisará cuando esté conectado.`;
  return `
    ${volver()}
    <div><h1>Conectar una fuente nueva</h1>
      <p class="sub">Todos los equipos entran por la misma puerta y sus datos se ordenan con un modelo común.</p></div>
    <div class="card"><span class="eyebrow">1. ¿Qué quiere conectar?</span>
      <div class="chips">${['Sensor', 'Estación', 'Planilla'].map((t) => chip('tipoFuente', t, t, estado.tipoFuente === t)).join('')}</div></div>
    <div class="card"><span class="eyebrow">2. Elija la marca</span>
      ${MARCAS.map((m) => `
        <button class="chip ${estado.marca === m.id ? 'sel' : ''}" style="display:flex;justify-content:space-between;align-items:center" data-accion="marca" data-arg="${m.id}">
          <span>${m.nombre}</span><span style="font-size:11px">${m.estado}</span>
        </button>`).join('')}</div>
    <div class="card"><span class="eyebrow">¿Usa planillas?</span>
      <span style="font-size:13px">Descargue la plantilla abierta en CSV, complétela como siempre y súbala desde aquí.</span>
      ${estado.plantilla
        ? '<span style="font-size:12px;font-weight:700;color:var(--verde-osc)">Plantilla descargada: plantilla_cuaderno_campo.csv</span>'
        : '<button class="btn-sec" data-accion="plantilla">Descargar plantilla CSV</button>'}</div>
    ${estado.solicitada
      ? `<div class="ok-box">Solicitud enviada<br><span style="font-weight:500;color:var(--texto)">${texto}</span></div>`
      : '<button class="btn" data-accion="solicitar">Solicitar conexión</button>'}`;
}

function pantallaPermisos() {
  const tarjetas = estado.permisos.map((p) => {
    const color = p.on ? (p.hasta.includes('días') ? 'var(--ambar-osc)' : 'var(--verde-osc)') : 'var(--gris)';
    const elegir = estado.eligiendo === p.id ? `
      <div class="mini" style="gap:8px;padding:10px">
        <b style="font-size:12px">¿Hasta cuándo autoriza el acceso?</b>
        <div class="chips">
          <button class="btn-sec" data-accion="otorgar" data-arg="${p.id}|mes">30 días</button>
          <button class="btn-sec" data-accion="otorgar" data-arg="${p.id}|temporada">Hasta fin de temporada</button>
          <button class="btn-link" style="color:var(--gris)" data-accion="cancelar">Cancelar</button>
        </div>
        <span class="chico">Al vencer el plazo, el acceso se cierra solo y queda registrado.</span>
      </div>` : '';
    return `
      <div class="card">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:12px">
          <span class="fila-txt"><b style="font-size:14px">${p.nombre}</b><span style="font-size:12px">${p.uso}</span>
            <b style="font-size:12px;color:${color}">${p.on ? 'Autorizado · ' + p.hasta : 'Sin acceso'}</b></span>
          <button class="switch ${p.on ? 'on' : ''}" data-accion="togglePermiso" data-arg="${p.id}" aria-pressed="${p.on}" aria-label="${p.on ? 'Revocar acceso de ' : 'Autorizar acceso a '}${p.nombre}">
            <span class="track"><span class="knob"></span></span></button>
        </div>${elegir}
      </div>`;
  }).join('');
  const registro = estado.registroPermisos.map((l) => `
    <div class="fila" style="justify-content:flex-start;align-items:flex-start">
      <span class="dot" style="background:${l.ok ? 'var(--verde-osc)' : 'var(--rojo)'}"></span>
      <span class="fila-txt"><b style="font-size:12px;color:${l.ok ? 'var(--verde-osc)' : 'var(--rojo)'}">${l.accion} · ${l.cuando}</b>
        <span style="font-size:12px;color:var(--texto)">${l.detalle}</span></span>
    </div>`).join('');
  return `
    <div><h1>La llave de sus datos</h1>
      <p class="sub">Cada permiso tiene fecha de vencimiento y caduca solo. Puede revocarlo antes, en cualquier momento.</p></div>
    ${tarjetas}
    <div class="card"><h2 style="font-size:14px">Registro de permisos</h2>${registro}</div>`;
}

function pantallaCuaderno() {
  const sinSenal = !estado.enLinea ? `
    <div style="background:var(--rojo-cl);border-radius:12px;padding:12px;font-size:12px;line-height:1.4;color:#6B1A1F">
      <b>Sin señal.</b> Los registros se guardan en el teléfono y se envían al recuperar la conexión.</div>` : '';
  const lista = estado.labores.length === 0
    ? '<span class="chico" style="font-size:12px">Aún no hay labores registradas hoy.</span>'
    : estado.labores.map((l) => `
      <div class="fila"><span class="fila-txt"><b>${l.labor} · Cuartel ${l.cuartel}</b><span>${l.horas} h · ${l.personas} trabajadores</span></span>
        <span class="pill ${l.sync ? 'ok' : 'warn'}">${l.sync ? 'Sincronizado' : 'Guardado en el teléfono'}</span></div>`).join('');
  return `
    <div><span class="eyebrow">Cuaderno de campo</span><h1>Registrar labor</h1></div>
    ${sinSenal}
    <div class="card" style="gap:14px">
      <div><span class="eyebrow" style="text-transform:none">Labor</span>
        <div class="chips" style="margin-top:8px">${['Poda', 'Riego', 'Aplicación', 'Raleo', 'Cosecha'].map((t) => chip('labor', t, t, estado.labor === t)).join('')}</div></div>
      <div><span class="eyebrow" style="text-transform:none">Cuartel</span>
        <div class="grid6" style="margin-top:8px">${[1, 2, 3, 4, 5, 6].map((q) => chip('cuartel', q, q, estado.cuartel === q)).join('')}</div></div>
      <div class="grid2">
        <div><span class="eyebrow" style="text-transform:none">Horas</span>
          <div class="stepper" style="margin-top:8px"><button data-accion="horas" data-arg="-1" aria-label="Restar una hora">−</button><b>${estado.horas}</b><button data-accion="horas" data-arg="1" aria-label="Sumar una hora">+</button></div></div>
        <div><span class="eyebrow" style="text-transform:none">Trabajadores</span>
          <div class="stepper" style="margin-top:8px"><button data-accion="personas" data-arg="-1" aria-label="Restar un trabajador">−</button><b>${estado.personas}</b><button data-accion="personas" data-arg="1" aria-label="Sumar un trabajador">+</button></div></div>
      </div>
      <button class="btn" data-accion="guardar">Guardar en el cuaderno</button>
      <button class="btn-link" style="font-size:12px;text-align:center;text-decoration:underline" data-accion="ir" data-arg="ayuda">¿Dudas? Ver video de 2 minutos o llamar al capataz referente</button>
    </div>
    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center"><h2 style="font-size:14px">Labores de hoy</h2>
        ${estado.enLinea
          ? '<button class="btn-sec" style="min-height:36px;font-size:11px" data-accion="desconectar">Simular sin señal</button>'
          : '<button class="btn-sec" style="min-height:36px;font-size:11px" data-accion="reconectar">Simular señal</button>'}
      </div>
      ${lista}
    </div>`;
}

function pantallaAlerta() {
  return `
    ${volver()}
    <div class="alerta-head"><span class="eyebrow" style="color:#fff">Alerta</span>
      <b style="font-size:21px">Riesgo de helada esta noche</b>
      <span style="font-size:13px">Sector 4 · entre 02:00 y 06:00 h · mínima estimada de −1 °C</span></div>
    <div class="card"><h2>Recomendación</h2>
      <p style="margin:0;font-size:14px;line-height:1.5">Active el riego antiheladas solo en el sector 4 a partir de las 01:30 h y postergue la aplicación de mañana hasta que la temperatura supere los 8 °C.</p></div>
    <div class="card" style="background:var(--verde-cl);border:0">
      <span class="eyebrow" style="color:var(--verde-osc)">Ahorro estimado si sigue la recomendación</span>
      <b style="font-size:26px;color:var(--verde-osc)">$ 85.000 a $ 120.000 <small style="font-size:14px">por ha</small></b>
      <div style="position:relative;height:12px;border-radius:999px;background:#C9D8BE">
        <div style="position:absolute;left:26%;width:48%;height:12px;border-radius:999px;background:var(--verde-osc)"></div>
        <div style="position:absolute;left:calc(50% - 6px);width:12px;height:12px;border-radius:999px;background:#fff;box-shadow:0 0 0 2px var(--verde-osc)"></div>
      </div>
      <span style="font-size:11px;color:var(--verde-osc);text-align:center"><b>Estimación central: $ 101.000</b></span>
      <div style="display:flex;justify-content:space-between;font-size:13px"><span>Agua (riego solo en el sector 4)</span><b>$ 38.000</b></div>
      <div style="display:flex;justify-content:space-between;font-size:13px"><span>Agroquímicos (aplicación postergada)</span><b>$ 41.000</b></div>
      <div style="display:flex;justify-content:space-between;font-size:13px"><span>Horas hombre</span><b>$ 22.000</b></div>
      <b style="font-size:12px;color:var(--verde-osc)">Rango con 80 % de confianza</b>
      <button class="btn-sec" data-accion="calculo" aria-expanded="${estado.verCalculo}">¿Cómo se calcula este ahorro?</button>
      ${estado.verCalculo ? '<p style="margin:0;font-size:12px;line-height:1.5">Se compara el consumo previsto de agua, insumos y horas hombre si no sigue la recomendación con el consumo previsto si la sigue, a partir de la línea base de su predio. Al cierre de la temporada, el reporte muestra el ahorro real medido.</p>' : ''}
    </div>
    ${estado.aplicada
      ? '<div class="ok-box" style="background:#fff;border:1px solid var(--verde)">Recomendación aplicada y anotada en su cuaderno. Al cierre de la temporada verá el ahorro real.</div>'
      : '<button class="btn" data-accion="aplicar">Aplicar recomendación</button>'}`;
}

function pantallaReporte() {
  const est = [18, 27, 35, 41, 48, 45];
  const real = [16, 26, 37, 39, 45, 43];
  const meses = ['Sep', 'Oct', 'Nov', 'Dic', 'Ene', 'Feb'];
  const k = 110 / 50;
  const vigentes = estado.permisos.filter((p) => p.on).length;
  return `
    <div><h1>Reporte de temporada</h1><p class="sub">Lo estimado, comparado con lo real</p></div>
    <div class="card" style="background:var(--verde);color:#fff;border:0">
      <span class="eyebrow" style="color:#fff">Ahorro verificado</span>
      <b style="font-size:30px">$ 206.000 <small style="font-size:14px">/ ha</small></b>
      <span style="font-size:13px">96 % de lo estimado ($ 214.000), medido contra la línea base de septiembre</span>
    </div>
    <div class="card">
      <div style="display:flex;gap:14px;font-size:12px">
        <span><span style="display:inline-block;width:10px;height:10px;border-radius:3px;background:#B9C9AE"></span> Estimado</span>
        <span><span style="display:inline-block;width:10px;height:10px;border-radius:3px;background:var(--verde)"></span> Verificado</span>
      </div>
      <div class="barras">${meses.map((m, i) => `
        <div class="barra"><b style="font-size:10px">${real[i]}</b>
          <div class="par"><div style="height:${Math.round(est[i] * k)}px;background:#B9C9AE"></div><div style="height:${Math.round(real[i] * k)}px;background:var(--verde)"></div></div>
          <span class="chico">${m}</span></div>`).join('')}</div>
      <span class="chico">Miles de pesos por hectárea · Valores de ejemplo para el testeo.</span>
    </div>
    <div class="grid2">
      <div class="card" style="gap:2px"><span class="chico">Agua ahorrada</span><b style="font-size:18px">620 m³/ha</b></div>
      <div class="card" style="gap:2px"><span class="chico">Labores en el cuaderno digital</span><b style="font-size:18px">84 %</b></div>
      <div class="card" style="gap:2px"><span class="chico">Permisos vigentes</span><b style="font-size:18px">${vigentes} de ${estado.permisos.length}</b></div>
      <div class="card" style="gap:2px"><span class="chico">Huella hídrica</span><b style="font-size:18px">−12 % vs. línea base</b></div>
    </div>
    <div class="card"><h2>Trazabilidad para compradores</h2>
      <p class="sub">Reporte por cuartel y lote con labores, aplicaciones y huella hídrica, listo para enviar a su exportadora o comprador internacional.</p>
      ${estado.exportado
        ? '<div class="ok-box">Reporte generado. Se compartirá solo con quienes tengan un permiso vigente.</div>'
        : '<button class="btn" data-accion="exportar">Exportar reporte en PDF</button>'}</div>`;
}

function pantallaAyuda() {
  return `
    <div><h1>Su equipo de apoyo</h1>
      <p class="sub">Acompañamiento en terreno al inicio, apoyo remoto cuando lo necesite y un referente dentro de su predio.</p></div>
    <div class="card"><span class="eyebrow">Embajador en terreno</span>
      <b style="font-size:15px">[NOMBRE DEL EMBAJADOR]</b><span class="chico" style="font-size:12px">Próxima visita: [FECHA]</span>
      ${estado.visita
        ? '<span style="font-size:12px;font-weight:700;color:var(--verde-osc)">Solicitud enviada. El embajador le confirmará la fecha.</span>'
        : '<button class="btn-sec" data-accion="visita">Solicitar una visita</button>'}</div>
    <div class="card"><span class="eyebrow">Soporte remoto</span>
      <div class="grid2"><button class="btn" style="min-height:44px;font-size:13px" data-accion="llamar">Videollamada</button>
        <button class="btn-sec" data-accion="llamar">Enviar mensaje</button></div>
      ${estado.llamado ? '<span style="font-size:12px;font-weight:700;color:var(--verde-osc)">Un agente de soporte lo contactará en los próximos minutos.</span>' : ''}</div>
    <div class="card"><span class="eyebrow">Capataz referente del predio</span>
      <b style="font-size:15px">[NOMBRE DEL CAPATAZ]</b><span class="chico" style="font-size:12px">Formado por el embajador para apoyar a su equipo</span></div>
    <div class="card"><span class="eyebrow">Videos cortos</span>
      ${VIDEOS.map((v) => `
        <button class="mini" style="flex-direction:row;align-items:center;gap:10px;min-height:52px;border:1px solid var(--borde);text-align:left" data-accion="video" data-arg="${v.id}">
          <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="#3F6F2E"></circle><path d="M10 8l6 4-6 4z" fill="#fff"></path></svg>
          <span class="fila-txt" style="flex:1"><b>${v.titulo}</b><span>${v.dur}</span></span>
          <b style="font-size:11px;color:var(--verde-osc)">${estado.vistos[v.id] ? 'Visto' : ''}</b>
        </button>`).join('')}</div>`;
}

const PANTALLAS = {
  inicio: pantallaInicio, fuente: pantallaFuente, permisos: pantallaPermisos, labores: pantallaCuaderno,
  alerta: pantallaAlerta, reporte: pantallaReporte, ayuda: pantallaAyuda
};

function nav() {
  const items = [['inicio', 'Inicio'], ['labores', 'Cuaderno'], ['permisos', 'Permisos'], ['reporte', 'Reporte'], ['ayuda', 'Ayuda']];
  return `<nav class="nav" aria-label="Navegación principal">${items.map(([id, label]) => {
    const activo = estado.pantalla === id || (id === 'inicio' && ['alerta', 'fuente'].includes(estado.pantalla));
    return `<button class="${activo ? 'activo' : ''}" data-accion="ir" data-arg="${id}" ${activo ? 'aria-current="page"' : ''}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${ICONOS[id]}"></path></svg>
      <span>${label}</span></button>`;
  }).join('')}</nav>`;
}

// ---------- render ----------
function render() {
  const app = document.getElementById('app');
  const scroll = app.querySelector('.main') ? app.querySelector('.main').scrollTop : 0;
  const pantallaAnterior = app.dataset.pantalla;
  app.innerHTML = `
    <header class="header">
      <div class="marca">${logo}<div><span class="marca-nombre">CER Analytics</span><span class="marca-sub">Predio demostración · Temporada 2026-2027</span></div></div>
      <span class="pill ${estado.enLinea ? 'ok' : 'off'}">${estado.enLinea ? 'En línea' : 'Sin señal'}</span>
    </header>
    <main class="main">${PANTALLAS[estado.pantalla]()}</main>
    ${nav()}`;
  // conserva el scroll si sigue en la misma pantalla
  if (pantallaAnterior === estado.pantalla) app.querySelector('.main').scrollTop = scroll;
  app.dataset.pantalla = estado.pantalla;
}

render();
