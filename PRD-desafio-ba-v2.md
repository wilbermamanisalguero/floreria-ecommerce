# PRD — E-commerce de Florería — Desafío v2 (BA)

> Revisión del Agente BA sobre `floreria-ecommerce/PRD.md` Ronda 2 (brief de negocio real, 2026-09-10). No se genera ninguna HU en `docs/historias-usuario/` en este documento — es análisis de claridad previo a la Convergencia final. El PM decide en la Convergencia si el estado pasa a `READY FOR BA HANDOFF` (total o parcial).
>
> **Nota de método:** el PRD de este proyecto no tiene una sección "Objetivo" separada (a diferencia de la plantilla estándar del playbook, Problema/Objetivo/Alcance/Supuestos/Criterios de Éxito). Para aplicar el Índice de Claridad, tomo como evidencia de "Objetivo" el cierre implícito de la sección Problema ("...no puede gestionar fácilmente todo el proceso de compra y entrega desde un solo lugar") combinado con los Criterios de Éxito — lo marco explícitamente como **(impl.)** en cada tabla para no confundirlo con una cita textual.

---

## (a) Ambigüedades / contradicciones nuevas detectadas en el brief de Ronda 2

No repito la contradicción de "personalización de pedidos" (Punto Abierto 1) ni la de "múltiples delivery" (Punto Abierto 2) — ya están correctamente documentadas por el PM. Lo siguiente es adicional:

| ID | Hallazgo |
|---|---|
| F1 | Los Criterios de Éxito #3 y #5 (sección 4 de `PRD.md`) mezclan la cita literal del brief con una **glosa interpretativa entre paréntesis** que no está en el texto citado — sin marcarla como inferencia. Ej.: "disponibilidad confiable" (cita literal) se glosa como "sin sobreventa / sin mostrar como disponible algo que no lo está" (interpretación no confirmada por el negocio); podría en cambio referirse a estabilidad/uptime del sitio, o a ambas cosas. Recomiendo separar cita literal de interpretación propia y confirmar con el negocio cuál de las dos lecturas es correcta, dado que de esto depende directamente el criterio de aceptación de la HU de disponibilidad (ligada a D4). |
| F2 | La sección 6 (tabla de D0–D6) dice que D2 queda "Punto Abierto menor, no bloqueante: si es un solo local físico o varios" — pero ese residual **no tiene número asignado en la sección 5** (Puntos Abiertos), solo existe como prosa dentro de una celda de tabla. Riesgo de trazabilidad: puede perderse en la próxima ronda. Recomiendo darle un ID formal (ej. Punto Abierto 28) y vincularlo explícitamente al Punto Abierto 20 (modelo de inventario) — si hay varios locales físicos, el modelo de inventario probablemente deba ser por local, no solo por producto/flor. |
| F3 | El Punto Abierto 2 ("múltiples delivery", en "No incluye") y el Punto Abierto 15 (¿existe pickup?) están relacionados y no se preguntan juntos: si "múltiples delivery" excluido significa "un único método de entrega", eso probablemente implique que **no** hay pickup (todo es delivery), lo cual respondería directamente al Punto Abierto 15. Recomiendo consultarlos al negocio como una sola pregunta, no por separado, para evitar una respuesta inconsistente entre ambos. |
| F4 | Señal indirecta, no concluyente, sobre D6 (registro vs. invitado — sigue ABIERTO): el Criterio de Éxito #2 dice "compras autónomas en menos de 5 minutos". "Autónoma" podría leerse como "sin fricción de registro obligatorio", pero también podría significar solo "sin intervención humana/telefónica" (que ya está resuelto por el canal web). No lo tomo como resolución de D6 — sería asumir — pero recomiendo que, al preguntarle al negocio sobre D6, se le muestre explícitamente este criterio para que aclare si "autónoma" implica compra como invitado. |
| F5 | Tensión de alcance no resuelta por el texto: "No incluye... gestión avanzada de almacenes" convive con el Criterio de Éxito #3 (disponibilidad confiable / sin sobreventa según F1), que **requiere necesariamente algún control de stock** para poder cumplirse. No es una contradicción cerrada, pero conviene que el negocio confirme que "avanzada" se refiere a multi-almacén/ERP y no excluye un control básico de stock por producto — si lo excluyera, el Criterio de Éxito #3 sería incumplible por diseño. |

---

## (b) HU candidatas — Índice de Claridad (4 necesidades pedidas: catálogo, disponibilidad, checkout+Stripe, mapa de dirección)

Fuentes evaluadas por necesidad: Problema | Objetivo (impl.) | Alcance | Criterio de Éxito — 25% cada una, según sección 5 del playbook (`docs/ba/playbook-ba.md`).

| Necesidad | Problema | Objetivo (impl.) | Alcance | Criterio de Éxito | % formal | Bloqueo de testeabilidad residual | Veredicto |
|---|---|---|---|---|---|---|---|
| **1. Consultar catálogo de productos** | Sí | Sí | Sí (ítem 1) | Sí (Criterios 2 y 3) | **100%** | Punto Abierto 3/4 (¿ramo/arreglo distintos? ¿atributos?) afecta el *detalle* de la ficha de producto, no el flujo de consulta en sí. | **LISTA** para redactar (HU base de consulta de catálogo), con nota menor sobre Punto Abierto 3. |
| **2. Verificar disponibilidad de producto, fecha y hora** | Sí (cita textual explícita) | Sí | Sí (ítems 2 y 3) | Sí (Criterio 3, directo) | **100%** | D4 (modelo de inventario, sigue ABIERTO — Punto Abierto 20) es el mecanismo que garantiza que "disponible" mostrado = disponible real; sin eso el AC de "no sobreventa" no es verificable. También depende de Punto Abierto 14 (cobertura geográfica, D3 parcial) para horarios por zona. | **PARCIAL** — el comportamiento de cara al cliente se puede redactar, pero el AC central ("nunca muestra como disponible algo sin stock") debe quedar marcado como bloqueado por D4. No recomendaría declararla "lista para desarrollo" pese al 100% formal. |
| **3. Checkout + pago con Stripe** | Sí (impl.) | Sí | Sí (ítems 4 parcial + 5, D5 ya resuelto) | Sí (Criterio 2) | **100% formal** | D6 (registro vs. invitado, sigue ABIERTO) es estructural: define cuántas pantallas tiene el checkout y si hay paso de autenticación — sin esto no se puede escribir el flujo completo sin inventar arquitectura. Punto Abierto 10 (moneda/impuestos) y 11 (valor mínimo) afectan el cálculo del monto a cobrar. | **PARCIAL, con bloqueo estructural.** Recomiendo separar en dos HU: **3a "Pagar el pedido con Stripe"** (una vez llegado al paso de pago) — casi lista, con nota menor sobre moneda/impuestos; **3b "Completar el checkout de punta a punta"** — NO redactar todavía, depende de D6. |
| **4. Seleccionar dirección de entrega en mapa** | Sí (impl.) | Sí | Sí (ítem 6, explícito) | Sí (Criterio 4, indirecto) | **100%** | Punto Abierto 14 (cobertura geográfica exacta, D3 parcial) y Punto Abierto 16 (validar zona antes de completar checkout): sin saber qué zonas cubre el negocio, no se puede escribir un AC verificable para "dirección fuera de cobertura". | **PARCIAL** — el AC de "camino feliz" (elegir dirección dentro de zona, confirmar) se puede redactar; el AC de "fuera de zona" queda pendiente de Punto Abierto 14. |

### Lectura para la Convergencia

De las 4 necesidades pedidas, solo **Necesidad 1 (catálogo)** y **Necesidad 3a (pagar con Stripe, acotada)** quedan genuinamente listas para pasar a redacción de HU con criterios de aceptación completamente verificables. Necesidad 2 (disponibilidad), Necesidad 3b (checkout completo) y Necesidad 4 (mapa) tienen 100% de claridad formal mediante las 4 fuentes del PRD, pero su testeabilidad real depende de D4, D6 y Punto Abierto 14 respectivamente — que siguen sin resolver. Esto es consistente con el principio de Testeabilidad del playbook (sección 3): claridad de fuentes no es lo mismo que criterios de aceptación verificables.

No decido por mi cuenta si esto habilita un `READY FOR BA HANDOFF` total o parcial — eso corresponde a la Convergencia del PM. Mi recomendación, si es útil: considerar un handoff parcial limitado a Necesidad 1 y 3a, dejando 2, 3b y 4 explícitamente pendientes hasta resolver D4, D6 y el Punto Abierto 14.

---

## Resumen para el PM

- **5 hallazgos nuevos** (F1–F5): una glosa interpretativa no marcada en Criterios de Éxito (F1), un residual de D2 sin ID formal en sección 5 (F2), dos Puntos Abiertos que deberían consultarse juntos por estar relacionados — multi-delivery y pickup (F3), una señal indirecta no concluyente sobre D6 en el Criterio de Éxito #2 (F4), y una tensión de alcance entre excluir "gestión avanzada de almacenes" y exigir "disponibilidad confiable" (F5).
- **4 necesidades evaluadas con Índice de Claridad**: 2 listas o casi listas (catálogo, pago con Stripe acotado), 2 con 100% formal pero bloqueadas en su testeabilidad real por D4/D6/Punto Abierto 14 (disponibilidad, mapa de dirección), y el checkout completo de punta a punta recomendado separar y posponer.
- Ninguna HU fue redactada ni guardada en `docs/historias-usuario/`. Ningún punto abierto fue resuelto por criterio propio del BA.

---

## Clasificación del PM (Convergencia Ronda 2)

| ID | Clasificación | Resolución |
|---|---|---|
| F1 | ACCEPT | `PRD.md` sección 4 separa ahora la cita literal de la glosa interpretativa; se agrega Punto Abierto nuevo pidiendo al negocio confirmar si "disponibilidad confiable" es stock, uptime del sitio, o ambos. |
| F2 | ACCEPT | Residual de D2 promovido a Punto Abierto formal (28) en `PRD.md`, vinculado al Punto Abierto 20 (modelo de inventario). |
| F3 | ACCEPT | Puntos Abiertos 2 y 15 anotados en `PRD.md` como pregunta conjunta al negocio (multi-delivery ↔ existencia de pickup). |
| F4 | ACCEPT | Nota agregada bajo D6 en `PRD.md` sección 6 citando el Criterio de Éxito #2 como insumo a mostrar al negocio, sin tomarlo como resolución. |
| F5 | ACCEPT | Nueva nota/Punto Abierto en `PRD.md` pidiendo confirmar que "gestión avanzada de almacenes" (excluida) no excluye el control básico de stock que exige el Criterio de Éxito #3. |

**Decisión de handoff (Convergencia):** se adopta la recomendación del BA — `READY FOR BA HANDOFF` **parcial**. Autorizado a redactar HU para: Necesidad 1 (catálogo, sin el bloque de personalización), Necesidad 2 (disponibilidad, con nota de AC pendiente por D4), Necesidad 3a (pagar con Stripe, acotada) y Necesidad 3b/4 (checkout completo / mapa de dirección) **siempre que cada HU incluya explícitamente en "Notas / Puntos abiertos" el AC que queda sin verificar** (D4, D6 o Punto Abierto 14, según corresponda), siguiendo la propia regla del playbook BA para claridad parcial. **No autorizado** a redactar HU de "personalizar pedido" (Punto Abierto 1) ni de add-ons (Punto Abierto 8) mientras la contradicción del brief siga sin resolver — para esas dos, tratar como <50% de claridad aunque la fuente lo cite, porque el contenido mismo es contradictorio, no solo incompleto.
