# Revisión del dashboard: errores y correcciones

## Resumen ejecutivo

Se revisó la aplicación web que sirve en http://127.0.0.1:3000. Se encontraron fallos de ejecución, conservación de datos, validación de formularios, selección de escenarios y navegación por cuarteles. Se corrigieron sin cambiar los datos de ejemplo ni conectar servicios externos.

## Hallazgos e implicaciones

| Hallazgo | Efecto | Corrección |
| --- | --- | --- |
| Archivos generados de Next.js incompatibles: error `Cannot find module './682.js'` y respuestas HTTP 500. | La página podía perder sus controles interactivos al fallar los scripts. | Reinicio con salida de desarrollo limpia e independiente en `.next-dev`; producción conserva `.next`. |
| Las labores nuevas solo existían en el estado de la página. | Se perdían al navegar o recargar. | Guardado local y restauración de registros válidos; aviso si el navegador impide guardarlos. |
| El valor inicial de labor no coincidía con las opciones y los números permitían vacíos o costos negativos. | Registros incoherentes o inválidos. | Opción inicial válida, campos obligatorios y comprobación de valores antes de guardar. |
| Modal de labores sin gestión completa de teclado ni altura de pantalla. | Problemas para cerrar, recorrer el formulario o usarlo en teléfonos pequeños. | Diálogo con foco, Escape, etiquetas asociadas y desplazamiento vertical. |
| Escenarios del simulador seleccionados solo por hectáreas. | El escenario seguía marcado aunque sus parámetros fueran distintos. | Comparación y restauración de los seis parámetros; estado Personalizado. |
| Diferencia de margen calculada después de redondear. | Un caso mostraba 1,8 puntos en vez de 1,7. | Resta antes del redondeo final. |
| Selección de cuartel sin actualización de URL e identificadores no validados. | La selección se perdía al recargar o no coincidía con el detalle. | URL actualizada y selección predeterminada válida para identificadores inexistentes. |

## Recomendaciones y alcance

La aplicación sigue siendo una demostración. El guardado de labores y permisos es local al navegador; no constituye sincronización con un servidor. Para datos compartidos entre dispositivos se necesitaría almacenamiento de servidor, fuera del alcance de esta corrección.

Mantener separadas las carpetas de desarrollo y producción evita que una compilación sustituya los archivos que utiliza el servidor abierto.

## Apéndice: evidencia

- `agentes/funcionamiento/REVISION_ERRORES_WEB.json`: ocho rutas HTTP 200, cuatro identificadores inválidos resueltos, selección persistente en URL, 12 comprobaciones de pantalla; sin excepciones JavaScript ni respuestas HTTP fallidas en la prueba.
- `agentes/diseno/ERRORES_SIMULADOR.txt`: comprobaciones de escenarios y cálculo de margen.
- `agentes/funcionamiento/ERRORES_LABORES.txt`: pruebas específicas del formulario y la persistencia local.
- `agentes/tecnologias/COMPILACION_CORRECCIONES.log`: resultado de la compilación.

La plantilla Design Report seleccionada corresponde a un documento DOCX. No hay una capacidad de documentos disponible ni sesiones conectadas; por el paso 2 de su SKILL.md se detuvo ese flujo, sin modificar el archivo de referencia ni recrear la plantilla. Este archivo Markdown es el registro de la revisión web solicitada y no una exportación de esa plantilla.

Resultado final: pruebas específicas de labores y simulador aprobadas en Chrome; compilación de producción terminada con código 0. La revisión visual directa del formulario móvil quedó en `agentes/diseno/revision-labores-corregida-390.png`.
