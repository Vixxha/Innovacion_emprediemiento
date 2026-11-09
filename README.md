# CER Analytics

Dashboard de demostración para un predio de 24 ha de cerezos. Usa Next.js 14,
React 18 y Tailwind CSS. Los sensores, recomendaciones y acciones son simulados.

## Ejecutar

```powershell
npm run dev
```

Abrir http://localhost:3000. Para producción: `npm run build` y `npm run start`.

## Páginas independientes

| Ruta | Archivo | Contenido |
| --- | --- | --- |
| `/` | `app/page.js` | Resumen e indicadores |
| `/ahorros` | `app/ahorros/page.js` | Gráfico y desglose mensual |
| `/cuarteles` | `app/cuarteles/page.js` | Manejo por cuartel |
| `/simulador` | `app/simulador/page.js` | Escenarios de utilidades |
| `/alertas` | `app/alertas/page.js` | Alertas y enlaces al cuartel |
| `/labores` | `app/labores/page.js` | Cuaderno de campo |
| `/fuentes` | `app/fuentes/page.js` | Sensores y fuentes |
| `/permisos` | `app/permisos/page.js` | Permisos de demostración |

`/cuarteles?cuartel=2` abre un cuartel específico. Cada sección tiene su propio
archivo y URL; el menú y la cabecera se comparten mediante `DashboardShell`.

## Organización

- `app/`: páginas y estilos globales.
- `components/`: componentes de interfaz reutilizables.
- `data/`: datos de ejemplo y navegación.
- `agentes/funcionamiento/`: informes y comprobaciones de navegación.
- `agentes/diseno/`: informes y capturas de pantalla.
- `agentes/tecnologias/`: resumen técnico e intento de instalación de la habilidad.
- `cer-analytics-prototipo/`: prototipo HTML anterior, separado de la aplicación Next.js.

El gráfico de ahorros usa SVG con escala desde cero, categorías apiladas,
unidades en miles de CLP/ha, botones de selección de mes y tabla equivalente.
El total de temporada se calcula desde las categorías: 96 + 71 + 47 = 214 mil
CLP/ha. La comparación de margen es un supuesto de demostración.

Las labores ingresadas y los permisos de demostración se guardan localmente en el navegador. No hay backend conectado ni sincronización real.

Para validar una compilación sin sustituir la caché de desarrollo, se admite
`NEXT_DIST_DIR` como directorio alternativo de salida de Next.js. Por defecto, desarrollo usa `.next-dev` y producción usa `.next`, de forma independiente.

Visualizaciones adicionales:
- Resumen: gráfico principal de barras mensuales, ampliado y con selección de mes.
- Ahorros: barras mensuales, acumulado y aporte por categoría.
- Cuarteles: humedad frente al rango objetivo y ranking de ahorro por hectárea.
- Simulador: costos base frente al escenario, actualizados con los controles.

Los gráficos usan SVG adaptable, etiquetas legibles y tablas alternativas.
Comparten colores y formatos en components/charts/. Los importes de las
estimaciones por cuartel y de los escenarios no se agregan al ahorro mensual.
La guía pública data-visualization-design se consultó como referencia;
la instalación del CLI no fue posible por conectividad del entorno.


