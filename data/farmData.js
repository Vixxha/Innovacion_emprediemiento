// Datos maestros para CER Analytics - Manejo, Control y Rentabilidad (Ahorro y Ganancias)
export const FARM_INFO = {
  nombre: "Fundo San Rosario",
  subtitulo: "Centro de Evaluación Rosario · CER Analytics",
  temporada: "Temporada 2026-2027",
  superficieTotal: 24, // hectáreas
  variedades: ["Santina (7.5 ha)", "Lapins (8.5 ha)", "Regina (8.0 ha)"],
  embajador: "Ing. Rodrigo Palma (Asesor CER)",
  capataz: "Manuel Retamal",
  proximaVisita: "Jueves 12 de Noviembre"
};

export const FINANCIAL_METRICS = {
  ahorroPorHa: 214000, // CLP por ha acumulado
  ahorroTotalPredio: 5136000, // CLP total predio (24 ha * $214.000)
  gananciaNetaProyectada: 48900000, // CLP ganancia neta proyectada
  margenOperativo: 34.8, // % de margen operativo
  margenAumento: "+4.2%", // mejora gracias a ahorros
  eficienciaAgua: 26, // % reducción de desperdicio hídrico
  eficienciaAgroquimicos: 21, // % optimización fitosanitarios
  eficienciaManoObra: 18, // % optimización horas hombre
  roiTecnologia: "4.8x" // retorno de inversión por cada $1 invertido
};

export const MONTHLY_SAVINGS = [
  {
    mes: "Septiembre",
    corto: "Sep",
    agua: 8,
    agroquimicos: 6,
    horasHombre: 4,
    total: 18,
    gananciaProyectada: 4200,
    costoOperativo: 6800,
    etapa: "Brotación y primeras aplicaciones"
  },
  {
    mes: "Octubre",
    corto: "Oct",
    agua: 12,
    agroquimicos: 9,
    horasHombre: 6,
    total: 27,
    gananciaProyectada: 5800,
    costoOperativo: 7900,
    etapa: "Floración y cuaja (alerta heladas)"
  },
  {
    mes: "Noviembre",
    corto: "Nov",
    agua: 16,
    agroquimicos: 11,
    horasHombre: 8,
    total: 35,
    gananciaProyectada: 8500,
    costoOperativo: 9100,
    etapa: "Crecimiento de fruto y control de riego"
  },
  {
    mes: "Diciembre",
    corto: "Dic",
    agua: 18,
    agroquimicos: 14,
    horasHombre: 9,
    total: 41,
    gananciaProyectada: 14200,
    costoOperativo: 10400,
    etapa: "Envero y precosecha variedades tempranas"
  },
  {
    mes: "Enero",
    corto: "Ene",
    agua: 22,
    agroquimicos: 16,
    horasHombre: 10,
    total: 48,
    gananciaProyectada: 18400,
    costoOperativo: 11500,
    etapa: "Pico de cosecha y logística de exportación"
  },
  {
    mes: "Febrero",
    corto: "Feb",
    agua: 20,
    agroquimicos: 15,
    horasHombre: 10,
    total: 45,
    gananciaProyectada: 12100,
    costoOperativo: 7200,
    etapa: "Poscosecha, inducción floral y recuperación"
  }
];

export const CUARTELES = [
  {
    id: 1,
    numero: 1,
    nombre: "Cuartel 1 - Santina Norte",
    variedad: "Santina",
    ha: 4.0,
    portainjerto: "Colt",
    anoPlantacion: 2019,
    humedadSuelo: 31,
    humedadMeta: "28-34%",
    temperaturaMinima: 1.2,
    ultimaLabor: "Poda en verde · hace 2 días",
    ahorroEstimadoHa: 205000,
    ahorroTotalCuartel: 820000,
    estadoRiego: "Al día",
    estadoGeneral: "Óptimo",
    severidad: "ok",
    recomendacion: "Mantener el calendario de riego programado (3 turnos semanales de 4 horas). La humedad de suelo se encuentra en el rango de máxima absorción.",
    accionesControl: ["Revisar goteros sector A", "Verificar calibre semanal"]
  },
  {
    id: 2,
    numero: 2,
    nombre: "Cuartel 2 - Santina Sur",
    variedad: "Santina",
    ha: 3.5,
    portainjerto: "MaxMa 14",
    anoPlantacion: 2020,
    humedadSuelo: 19,
    humedadMeta: "28-34%",
    temperaturaMinima: 1.0,
    ultimaLabor: "Raleo manual · hace 5 días",
    ahorroEstimadoHa: 188000,
    ahorroTotalCuartel: 658000,
    estadoRiego: "Déficit Hídrico",
    estadoGeneral: "Atención Requerida",
    severidad: "warn",
    recomendacion: "Adelantar el turno de riego 6 horas. La sonda a 30 cm marca 19%, por debajo del umbral de estrés que compromete el calibre de exportación.",
    accionesControl: ["Abrir válvula matriz 2", "Chequear presión de matriz"]
  },
  {
    id: 3,
    numero: 3,
    nombre: "Cuartel 3 - Lapins Este",
    variedad: "Lapins",
    ha: 4.5,
    portainjerto: "Gisela 6",
    anoPlantacion: 2018,
    humedadSuelo: 28,
    humedadMeta: "26-32%",
    temperaturaMinima: 0.2,
    ultimaLabor: "Poda de despunte · Hoy",
    ahorroEstimadoHa: 221000,
    ahorroTotalCuartel: 994500,
    estadoRiego: "Al día",
    estadoGeneral: "Óptimo",
    severidad: "ok",
    recomendacion: "Sin labores correctivas pendientes. Continuar con monitoreo de acumulación de grados-día y tasa de transpiración.",
    accionesControl: ["Monitoreo fenológico", "Inspección de trampa de plagas"]
  },
  {
    id: 4,
    numero: 4,
    nombre: "Cuartel 4 - Lapins Oeste",
    variedad: "Lapins",
    ha: 4.0,
    portainjerto: "Colt",
    anoPlantacion: 2018,
    humedadSuelo: 30,
    humedadMeta: "26-32%",
    temperaturaMinima: -1.4,
    ultimaLabor: "Aplicación foliar · hace 3 días",
    ahorroEstimadoHa: 236000,
    ahorroTotalCuartel: 944000,
    estadoRiego: "Riesgo de Helada",
    estadoGeneral: "Alerta Crítica",
    severidad: "danger",
    recomendacion: "ALERTA TÉRMICA: Mínima pronosticada de -1.4 °C entre las 02:00 y 05:30 h. Activar riego por aspersión antihelada a partir de las 01:30 h para proteger botón/fruto. Postergar aplicaciones con tractor hasta que la temperatura supere los 8 °C.",
    accionesControl: ["Activar aspersión antihelada", "Posponer fungicida programado"]
  },
  {
    id: 5,
    numero: 5,
    nombre: "Cuartel 5 - Regina Centro",
    variedad: "Regina",
    ha: 4.0,
    portainjerto: "Gisela 12",
    anoPlantacion: 2021,
    humedadSuelo: 27,
    humedadMeta: "25-30%",
    temperaturaMinima: 1.4,
    ultimaLabor: "Riego por pulso · Ayer",
    ahorroEstimadoHa: 214000,
    ahorroTotalCuartel: 856000,
    estadoRiego: "Al día",
    estadoGeneral: "Óptimo",
    severidad: "ok",
    recomendacion: "La curva de fertirriego muestra una absorción eficiente de Potasio. Mantener conductividad eléctrica en 1.4 dS/m.",
    accionesControl: ["Medición de CE en drenaje", "Cálculo de brix proyectado"]
  },
  {
    id: 6,
    numero: 6,
    nombre: "Cuartel 6 - Regina Alto",
    variedad: "Regina",
    ha: 4.0,
    portainjerto: "MaxMa 14",
    anoPlantacion: 2021,
    humedadSuelo: 26,
    humedadMeta: "25-30%",
    temperaturaMinima: 1.1,
    ultimaLabor: "Cosecha · Sin registro semanal",
    ahorroEstimadoHa: 216000,
    ahorroTotalCuartel: 864000,
    estadoRiego: "Al día",
    estadoGeneral: "Registro Pendiente",
    severidad: "info",
    recomendacion: "El capataz debe cargar la planilla de estimación de kilos por árbol antes del viernes para ajustar la logística de bins con la exportadora.",
    accionesControl: ["Completar planilla digital", "Sincronizar cuadrilla 3"]
  }
];

export const ALERTAS = [
  {
    id: "alt-1",
    titulo: "Riesgo de helada crítica en Cuartel 4 (Lapins)",
    nivel: "Alta",
    tipo: "danger",
    texto: "Pronóstico de -1.4 °C entre las 02:00 y 05:30 h. Active el riego antiheladas focalizado exclusivamente en este cuartel. Postergar la fumigación foliar.",
    ahorroImpacto: "Ahorro preventivo: $ 85.000 a $ 120.000 / ha",
    ahorroTotal: "$ 480.000 en pérdidas evitadas",
    confianza: "88 % de certeza agroclimatológica",
    accionRapida: "Programar encendido de bombas"
  },
  {
    id: "alt-2",
    titulo: "Déficit de humedad y estrés hídrico en Cuartel 2",
    nivel: "Media",
    tipo: "warn",
    texto: "La humedad del suelo cayó al 19% (umbral de estrés: 22%). Adelantar 6 horas el turno de riego programado para evitar reducción de tamaño de frutos.",
    ahorroImpacto: "Ahorro por calidad de calibre: $ 12.000 a $ 18.000 / ha",
    ahorroTotal: "$ 63.000 en sobrecosto hídrico evitado",
    confianza: "Lectura directa sensor sensor marca A",
    accionRapida: "Iniciar turno de riego 2"
  },
  {
    id: "alt-3",
    titulo: "Oportunidad de optimización en dosis de fungicida",
    nivel: "Oportunidad",
    tipo: "success",
    texto: "La baja humedad ambiental de los últimos 4 días redujo la presión de Botrytis. El algoritmo CER sugiere reducir dosis al 80% en Cuarteles 1 y 3.",
    ahorroImpacto: "Ahorro directo en insumos: $ 28.000 / ha",
    ahorroTotal: "$ 238.000 de ahorro en agroquímicos",
    confianza: "Modelo epidemiológico CER",
    accionRapida: "Ajustar receta agronómica"
  }
];

export const LABORES = [
  {
    id: "lab-1",
    fecha: "Hoy, 09:40",
    labor: "Poda en verde y desbrote",
    cuartel: "Cuartel 3",
    horas: 6,
    trabajadores: 4,
    costoLabor: 144000,
    ahorroGenerado: 32000,
    registro: "App · Sincronizado",
    estado: "ok"
  },
  {
    id: "lab-2",
    fecha: "Ayer, 16:10",
    labor: "Riego controlado por pulsos",
    cuartel: "Cuartel 5",
    horas: 3,
    trabajadores: 1,
    costoLabor: 36000,
    ahorroGenerado: 48000,
    registro: "App · Sincronizado",
    estado: "ok"
  },
  {
    id: "lab-3",
    fecha: "Hace 2 días",
    labor: "Poda y rebaje de ramas",
    cuartel: "Cuartel 1",
    horas: 7,
    trabajadores: 5,
    costoLabor: 210000,
    ahorroGenerado: 42000,
    registro: "App · Sincronizado",
    estado: "ok"
  },
  {
    id: "lab-4",
    fecha: "Hace 3 días",
    labor: "Aplicación fitosanitaria guiada",
    cuartel: "Cuartel 4",
    horas: 4,
    trabajadores: 2,
    costoLabor: 96000,
    ahorroGenerado: 64000,
    registro: "App · Sincronizado",
    estado: "ok"
  },
  {
    id: "lab-5",
    fecha: "Hace 5 días",
    labor: "Raleo manual de dardos",
    cuartel: "Cuartel 2",
    horas: 8,
    trabajadores: 6,
    costoLabor: 288000,
    ahorroGenerado: 56000,
    registro: "Planilla en papel digitalizada",
    estado: "warn"
  }
];

export const FUENTES_DATOS = [
  {
    nombre: "Sensor de Humedad Suelo (Marca A)",
    tipo: "IoT / MQTT",
    frecuencia: "Cada 15 min",
    ultimoDato: "Hace 4 min",
    estado: "En línea",
    bateria: "94 %",
    status: "ok"
  },
  {
    nombre: "Sonda Capacitiva Multiprofundidad (Marca B)",
    tipo: "API REST",
    frecuencia: "Cada 30 min",
    ultimoDato: "Hace 18 min",
    estado: "En línea",
    bateria: "88 %",
    status: "ok"
  },
  {
    nombre: "Estación Agroclimatológica Fundo",
    tipo: "Telemetría Satelital",
    frecuencia: "Tiempo real (5 min)",
    ultimoDato: "Hace 2 min",
    estado: "En línea",
    bateria: "100 % (Solar)",
    status: "ok"
  },
  {
    nombre: "Sensor de Humedad Marca C (Nuevo)",
    tipo: "Conector priorizado CER",
    frecuencia: "Por configurar",
    ultimoDato: "En calibración",
    estado: "En integración",
    bateria: "—",
    status: "warn"
  },
  {
    nombre: "Planilla Digital de Cosecha & Rendimiento",
    tipo: "CSV / Cuaderno Digital",
    frecuencia: "Semanal",
    ultimoDato: "Hace 6 días",
    estado: "En línea",
    bateria: "—",
    status: "ok"
  },
  {
    nombre: "Libreta de Aplicaciones y Stock",
    tipo: "Carga Guiada",
    frecuencia: "Por labor",
    ultimoDato: "Hace 3 días",
    estado: "En línea",
    bateria: "—",
    status: "ok"
  }
];

export const PERMISOS_GOBERNANZA = [
  {
    id: "p1",
    entidad: "Agrónomo Asesor Independiente",
    rol: "Manejo nutricional y fitosanitario",
    alcance: "Lectura de recomendaciones y analítica de riego",
    vigencia: "Revocado temporalmente",
    activo: false,
    estado: "Sin acceso",
    status: "neutro"
  },
  {
    id: "p2",
    entidad: "Investigación y Desarrollo CER",
    rol: "Entrenamiento de modelos IA de ahorro",
    alcance: "Datos anonimizados de sensores y rendimientos",
    vigencia: "Vence el 31-03-2027",
    activo: true,
    estado: "Activo (Protegido)",
    status: "ok"
  },
  {
    id: "p3",
    entidad: "Exportadora GreenFruit Chile",
    rol: "Trazabilidad y certificación de exportación",
    alcance: "Solo trazabilidad por lote y fechas de carencia",
    vigencia: "Vence el 31-03-2027",
    activo: true,
    estado: "Activo (Restringido)",
    status: "ok"
  },
  {
    id: "p4",
    entidad: "Proveedor de Insumos Agrícolas",
    rol: "Reabastecimiento predictivo de agroquímicos",
    alcance: "Consumo de productos fitosanitarios",
    vigencia: "Vence en 12 días",
    activo: true,
    estado: "Próximo a vencer",
    status: "warn"
  }
];

