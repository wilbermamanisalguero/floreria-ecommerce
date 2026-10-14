# ADR-05 — Inventario y control de sobreventa (E-commerce de Florería)

> Proyecto: `floreria-ecommerce/`. ADR abierto para documentar la decisión pendiente y sus opciones; **no** autoriza implementación.

## Estado
`BLOQUEADO` — 2026-10-01 — depende de D4 (modelo de inventario, **ABIERTO** en `PRD.md` sección 6).

## Origen / Trazabilidad
- PRD sección 3.1, ítem 2: *"verificar la disponibilidad de productos"*.
- PRD sección 4, Criterio de Éxito 3: *"disponibilidad confiable"* (interpretación no confirmada, nota BA-F1).
- PRD sección 6: D4 — **ABIERTO**.
- HU-06, AC 4 no verificable (`docs/historias-usuario/HU-06-floreria-verificar-disponibilidad.md`).
- Puntos Abiertos: PA 20 (modelo de inventario), PA 21 (momento de reserva), PA 22 (stock insuficiente con pedido pagado), PA 22b (condición de carrera al pagar), PA 23 (sustitución de flores), PA 28 (uno o varios locales), PA 29 (alcance de "gestión avanzada de almacenes").

## Contexto
El Problema del PRD es la incertidumbre sobre la disponibilidad, y el Criterio 3 exige que sea "confiable". Sin embargo, el negocio no definió: la unidad de stock (flor/insumo o producto terminado), si el control es en tiempo real, ni cuándo se reserva el stock. Además, PA 29 advierte que "gestión avanzada de almacenes" (excluida) no debe impedir el control básico de stock.

## Decisión
**Ninguna decisión de modelo se toma en este ADR.** Lo único firme, respaldado por el hallazgo UX-UR2-5 aceptado por el PM, es lo siguiente:
- La disponibilidad mostrada en el catálogo **no se asume vigente hasta el pago**. Debe **re-verificarse al confirmar el pago** (PA 22b), con un estado explícito de "producto ya no disponible".

## Alternativas consideradas (para la decisión D4)
| Opción | Descripción | Implicancias |
|---|---|---|
| A. Stock por producto terminado | Cada arreglo tiene un contador de unidades disponibles. | La más simple; encaja con "control básico" (PA 29). No refleja insumos compartidos entre arreglos. |
| B. Stock por flor/insumo (lista de materiales) | El arreglo consume insumos; la disponibilidad se calcula. | Más fiel a la operación, pero roza "gestión avanzada de almacenes" (excluida, PA 29) y depende de la personalización (PA 1). |
| C. Capacidad por franja de entrega | Limita los pedidos por fecha/horario sin contar unidades. | Responde a fechas pico (PA 18); se puede combinar con A. |

| Momento de reserva (PA 21) | Implicancia |
|---|---|
| Al agregar al carrito | Bloquea stock sin compra; requiere expiración. |
| Al iniciar el checkout (reserva temporal con TTL) | Equilibrio habitual; necesita liberación automática. |
| Al confirmar el pago | Sin bloqueo previo; mayor riesgo de rechazar después de que el cliente decidió pagar. |

## Consecuencias
- Mientras siga `BLOQUEADO`, HU-06 AC 4 no puede implementarse ni verificarse.
- Los indicadores de disponibilidad del catálogo (WF-06) pueden construirse como **binarios** (disponible / no disponible), según el handoff parcial (PRD sección 8), sin comprometer el modelo de stock.

## Recomendación (sugerencia — no es decisión)
- Para el MVP, sugerir al PM la **opción A + C**: stock por producto terminado más capacidad por franja de entrega. Cumple el Criterio 3 con "control básico" y respeta la exclusión de PA 29.
- Para el momento de reserva, sugerir la **reserva temporal al iniciar el pago** (TTL corto, p. ej. 10–15 min, coherente con el Criterio 2 de compra en < 5 min). Debe ser **atómica en base de datos** (decremento condicional o bloqueo de fila), para resolver la condición de carrera de PA 22b.
- Estas sugerencias **requieren decisión de negocio (D4)** antes de pasar a `ACEPTADO`.

## PENDIENTE DE DEFINICIÓN
- D4 / PA 20, PA 21, PA 22, PA 23, PA 28, PA 29.
- Significado exacto de "disponibilidad confiable" (stock real / uptime / ambas) — nota BA-F1, PRD sección 4.

## Fuera de alcance
- ERP y gestión avanzada de almacenes (PRD 3.2).
- Pantallas de inventario del panel Administrador — no autorizadas (PRD sección 8).
