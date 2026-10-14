# WF-08 — Seleccionar dirección de entrega en mapa (E-commerce de Florería)

## HU de origen
`floreria-ecommerce/docs/historias-usuario/HU-08-floreria-seleccionar-direccion-mapa.md` *(el PM movió esta HU a la carpeta propia del proyecto — ver WF-05 para el detalle de la corrección.)*

## Proyecto Stitch
Florería — E-commerce (Portal Cliente) — `projects/9489403432676365752`
Design system: "Floreria E-commerce — Sistema Base" — `assets/10525452681741601693`

## ⚠️ Desviación detectada a corregir antes de handoff a desarrollo
Igual que en `WF-07-floreria-pagar-con-stripe.md`: la pantalla incluyó por iniciativa propia de Stitch un indicador **"PASO 2 DE 3 • ENTREGA"** que implica una estructura de checkout de 3 pasos no confirmada (D6 sigue abierto). Hay que quitarlo o genericizarlo antes de usar este wireframe como referencia de desarrollo.

## Pantallas / estados

### Pantalla 1 — Dirección de entrega
- **Stitch:** "Dirección de entrega — Florería Botánica" — `projects/9489403432676365752/screens/2082def77ff141848fc935e10c8ec177`
- **Escenario Gherkin cubierto:** Criterio de Aceptación #1 y #2 (el cliente ubica y confirma un punto en el mapa → el sistema guarda la dirección).
- **Campos/controles:** mapa interactivo (pin ubicable/confirmable), campo de texto con autocompletado de dirección como alternativa **igualmente visible** (no un enlace escondido "¿no podés usar el mapa?"), botón "Confirmar dirección".
- **Requisito de accesibilidad cumplido (AC3 / Punto Abierto 19b):** el campo de texto/autocompletado es 100% operable por teclado y no depende del mapa — es una alternativa equivalente, no un sustituto de segunda clase.
- **Fuera de alcance respetado:** sin validación de zona de cobertura, sin costo de envío, sin selección de fecha/hora (cubierta en `WF-06`), sin datos de destinatario ni mensaje de regalo.

## Escenarios no representables — PENDIENTE DE DEFINICIÓN
- **Criterio de Aceptación #4** (dirección fuera de la zona de cobertura): la propia HU-08 lo marca como "no verificable todavía" — depende del Punto Abierto 14 (cobertura geográfica exacta, D3 solo parcialmente resuelto). **No diseñé ningún mensaje, bloqueo ni comportamiento de "fuera de cobertura"** porque la HU no define qué debería pasar (¿se rechaza al confirmar? ¿se avisa pero se permite? ¿se sugiere la zona más cercana?) — inventar cualquiera de esas respuestas sería una decisión de negocio que no me corresponde tomar.

## Resumen de exclusiones aplicadas
- Sin selección de múltiples direcciones por pedido — Punto Abierto 5, no confirmado.
- Sin validación de zona de cobertura antes del checkout — Punto Abierto 16, depende del Punto Abierto 14 (ver arriba).
- Sin cutoff ni capacidad en fechas pico — Puntos Abiertos 17/18, cubiertos conceptualmente en `WF-06`, no aquí.

## Puntos abiertos que afectan esta HU
- Punto Abierto 14 (cobertura geográfica exacta) — bloquea el AC4, ver arriba.
- D3 (zonas y fechas de entrega) — parcialmente resuelto; el mecanismo de mapa ya está confirmado y diseñado, la cobertura real sigue pendiente.
