# WF-06 — Verificar disponibilidad de producto y fecha/hora de entrega (E-commerce de Florería)

## HU de origen
`floreria-ecommerce/docs/historias-usuario/HU-06-floreria-verificar-disponibilidad.md` *(el PM movió esta HU a la carpeta propia del proyecto — ver WF-05 para el detalle de la corrección.)*

## Proyecto Stitch
Florería — E-commerce (Portal Cliente) — `projects/9489403432676365752`
Design system: "Floreria E-commerce — Sistema Base" — `assets/10525452681741601693`

## Pantallas / estados

### Pantalla 1 — Ficha de producto (estado: disponible) — compartida con WF-05
- **Stitch:** "Ficha de Producto — Florería Botánica" — `projects/9489403432676365752/screens/6281eba215ba42baa78cd9b52bc64c22`
- **Escenario Gherkin cubierto:** Criterio de Aceptación #1 (el sistema indica si el producto está disponible o no — caso disponible).
- **Campos/controles:** indicador binario "Disponible" (punto/badge verde discreto). Nunca se muestra cantidad de stock ni motivo de sustitución — no está definido por el negocio.

### Pantalla 1 — Ficha de producto (estado: no disponible)
- **Stitch:** "Ficha de Producto (No disponible) — Florería Botánica" — `projects/9489403432676365752/screens/c5ebde03a1b647c49cac55e8083148a8`
- **Escenario Gherkin cubierto:** Criterio de Aceptación #1 y #3 (producto no disponible → se marca claramente, no solo con color).
- **Diferencia vs. estado base:** indicador con forma/ícono distinto (no solo cambio de color) + texto "Este producto no está disponible por el momento." Sin botón de "avisarme" ni ningún control nuevo — no fue pedido.

### Pantalla 2 — Fecha y hora de entrega
- **Stitch:** "Fecha y hora de entrega — Florería Botánica" — `projects/9489403432676365752/screens/5186126bbb894e78a194e660aa3ed8e3`
- **Escenario Gherkin cubierto:** Criterio de Aceptación #2 (el cliente consulta fechas/horarios → el sistema muestra las disponibles) y #3 (horario no disponible se bloquea comunicando el motivo, accesible para lector de pantalla — Punto Abierto 19).
- **Campos/controles:** selector de fecha, lista de horarios por franja marcados disponible/no disponible con texto explícito, botón "Continuar" (deshabilitado hasta elegir).
- **Fuera de alcance respetado:** sin zonas de cobertura, dirección, mapa, pago ni costo de envío — eso corresponde a otras HU/Puntos Abiertos.

## Escenarios no representables — PENDIENTE DE DEFINICIÓN
- **Criterio de Aceptación #4** (anti-sobreventa: el sistema no debe permitir vender lo que ya no hay stock): la propia HU-06 lo marca como "no verificable todavía" porque depende de D4 (modelo de inventario, ABIERTO). **No diseñé ningún mecanismo visual que sugiera esa garantía** (ej. no hay "última unidad", no hay conteo de stock, no hay animación de "reservando"). El indicador binario disponible/no-disponible de la Pantalla 1 es el único estado mostrado, tal como está confirmado hoy — cualquier comportamiento adicional ante una condición de carrera (dos clientes comprando lo mismo a la vez) queda sin representar hasta que se resuelva D4 (ver también Punto Abierto 22b).

## Resumen de exclusiones aplicadas
- Sin cobertura geográfica, cutoff de mismo día, límite de capacidad en fechas pico, ni sustitución de flores — Puntos Abiertos 14/17/18/23, no cubiertos por esta HU.

## Puntos abiertos que afectan esta HU
- D4 (modelo de inventario) — bloquea el AC4, ver arriba.
- Punto Abierto nuevo (BA-F1): confirmar si "disponibilidad confiable" (Criterio de Éxito #3) se refiere a stock real, uptime del sitio, o ambas — no cambia el wireframe actual (el indicador ya es binario en cualquier lectura), pero sí afectaría el AC4 cuando se resuelva.
