# HU-08 — Seleccionar dirección de entrega en mapa (E-commerce de Florería)

> Proyecto: `floreria-ecommerce/` (E-commerce de Florería). Handoff parcial autorizado por el PM en `floreria-ecommerce/PRD.md`, sección 8 (Ronda 2 — Convergencia). Claridad formal 100%, pero con AC no verificable declarado explícitamente abajo por instrucción del PM.

## Historia de Usuario
Como cliente de la florería,
quiero seleccionar la dirección de entrega de mi pedido usando un mapa,
para indicar claramente dónde debe entregarse sin escribirla a mano con riesgo de error.

## Origen en el PRD
- Problema: "...no puede gestionar fácilmente todo el proceso de compra y entrega desde un solo lugar" (`PRD.md`, sección 1) — implica también resolver la entrega, no solo la compra.
- Objetivo (implícito): gestionar todo el proceso, incluida la entrega, desde un solo lugar.
- Alcance: "Incluye" ítem 6, "Selección de dirección de entrega mediante mapa" (sección 3.1).
- Criterio de Éxito relacionado: Criterio 4, "90 % de entregas realizadas dentro del horario seleccionado por el cliente" (sección 4) — vínculo indirecto: una dirección capturada correctamente es condición para cumplir el horario.

## Índice de claridad
100% (Problema: sí | Objetivo: sí | Alcance: sí | Criterio de Éxito: sí)

## Criterios de Aceptación
1. Dado que el cliente está en el paso de definir la entrega, cuando abre el selector de dirección, entonces puede ubicar y confirmar un punto en el mapa como dirección de entrega.
2. Dado un punto seleccionado en el mapa, cuando el cliente lo confirma, entonces el sistema guarda esa dirección asociada al pedido.
3. Dado que un mapa interactivo puro no es operable por teclado ni por lector de pantalla, cuando el cliente no puede o no quiere usar el mapa visualmente, entonces el sistema ofrece una alternativa accesible (campo de texto/autocompletado de dirección) — Punto Abierto 19b.
4. **AC no verificable todavía:** dado que el cliente selecciona una dirección fuera de la zona de cobertura del negocio, cuando la confirma, entonces el sistema [comportamiento por definir]. No se puede redactar este criterio de forma verificable hasta conocer la cobertura geográfica exacta — ver Notas/Puntos abiertos.

## Reglas de negocio / Restricciones
- Ninguna regla de validación/rechazo de zona confirmada todavía por el negocio.

## Fuera de alcance (explícito)
- Selección de múltiples direcciones por pedido — Punto Abierto 5 (no confirmado si el carrito admite varios destinos).
- Validación de la zona de cobertura antes de completar el checkout — Punto Abierto 16, depende de resolver primero el Punto Abierto 14.
- Ventana de corte y capacidad en fechas pico — Puntos Abiertos 17/18, cubiertos en HU-06, no aquí.

## Supuestos aplicados
- Ninguno propio del BA.

## Notas / Puntos abiertos
- **AC 4 no verificable:** depende del Punto Abierto 14 (`PRD.md` sección 5) — cobertura geográfica exacta, ligado a D3 (Zonas y fechas de entrega), que sigue **PARCIALMENTE RESUELTO**: el negocio aún no ha confirmado qué ciudades/zonas cubre.
- Una vez resuelto el Punto Abierto 14, aplicará también el Punto Abierto 16 (validar la zona de cobertura antes de completar el checkout, no solo al pagar).

## Prioridad sugerida
Media-Alta — Alcance explícito y ligado al Criterio de Éxito 4, pero su criterio de aceptación más crítico (dirección fuera de cobertura) depende de un punto abierto no resuelto.
