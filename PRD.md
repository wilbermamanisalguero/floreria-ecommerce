# PRD — E-commerce de Florería

> **Estado del documento:** Ronda 2 — Convergencia final (2026-09-10), tras el Desafío v2 de BA (`PRD-desafio-ba-v2.md`) y UX (`PRD-desafio-ux-v2.md`).
>
> **Nota de procedencia:** la Ronda 1 de este PRD (ver `PRD-desafio-ba.md` / `PRD-desafio-ux.md` para el historial completo de esa ronda) se hizo **sin ningún brief de negocio**, solo con el nombre del dominio y un checklist genérico — de ahí que quedara `BLOCKED` con 6 Decisiones Prioritarias (D0–D6) sin responder. El 2026-09-10 el negocio proveyó un brief real con Problema, Actores, Alcance y Criterios de éxito (citado textualmente abajo). Esta Ronda 2 reemplaza el contenido de las secciones 1–4 con ese brief y actualiza el estado de D0–D6 en la sección 6. Los Puntos Abiertos de la Ronda 1 que el brief no menciona **se mantienen como Puntos Abiertos** — el silencio del brief sobre un tema no se interpreta como "no aplica", salvo que el brief lo excluya explícitamente en la sección "No incluye".

---

## 1. Problema

> "Comprar flores actualmente puede requerir llamadas o mensajes por WhatsApp para consultar disponibilidad, precio y horarios de entrega. El cliente no siempre tiene certeza de que el arreglo elegido esté disponible ni puede gestionar fácilmente todo el proceso de compra y entrega desde un solo lugar."

*(Cita textual del brief de negocio recibido el 2026-09-10.)*

## 2. Actores

- **Cliente** — persona que consulta el catálogo, verifica disponibilidad, arma/personaliza su pedido, paga y selecciona la dirección de entrega en el mapa.
- **Administrador** — gestiona el sistema (catálogo, disponibilidad, pedidos) desde el backoffice.

*(Lista cerrada según el brief: "Actores (quién lo usa): Cliente, Administrador".)*

**Punto Abierto:** el brief no menciona sub-roles dentro de "Administrador" (¿dueño, encargado de catálogo, encargado de despacho?) ni personal de reparto con acceso propio al sistema. Se interpreta que es un rol único y que no hay actor de reparto en el sistema, pero queda abierto por si el negocio quisiera confirmarlo explícitamente o corregirlo.

## 3. Alcance

### 3.1 Incluye

> "Permita a los clientes consultar el catálogo de productos de la florería, verificar la disponibilidad de productos, fechas y horarios de entrega, registrar y personalizar pedidos, realizar el pago Stripe y utilizar un mapa para seleccionar la dirección de entrega."

Desglosado (numeración añadida por el PM solo para trazabilidad con la sección 5, el contenido es el citado arriba):

1. Consulta del catálogo de productos.
2. Verificación de disponibilidad de productos.
3. Verificación de fechas y horarios de entrega.
4. Registro y personalización de pedidos.
5. Pago mediante **Stripe**.
6. Selección de dirección de entrega mediante **mapa**.

### 3.2 No incluye (por ahora)

> "No incluye app móvil nativa, marketplace, múltiples delivery, fidelización, suscripciones, IA, realidad aumentada, rutas avanzadas, ERP, expansión internacional ni gestión avanzada de almacenes, mapa para tracking y personalización de pedidos."

Desglosado:

- App móvil nativa.
- Marketplace.
- Múltiples delivery.
- Fidelización.
- Suscripciones.
- IA.
- Realidad aumentada.
- Rutas avanzadas.
- ERP.
- Expansión internacional.
- Gestión avanzada de almacenes.
- Mapa para tracking.
- **Personalización de pedidos.** ⚠️ ver contradicción abajo.

> ⚠️ **Contradicción detectada en el brief — no resuelta por el PM.** La sección "Incluye" dice explícitamente *"registrar y **personalizar** pedidos"*, y la sección "No incluye" termina con *"...mapa para tracking y **personalización de pedidos**"*. Con el texto recibido no se puede determinar si esto es: (a) un error de redacción/duplicación al escribir el brief, (b) "personalización" en "No incluye" se refiere a algo más específico y avanzado (p. ej. un configurador visual tipo "arma tu ramo flor por flor"), distinto de la personalización básica ya confirmada en "Incluye" (p. ej. elegir tamaño/color/mensaje de una lista de opciones), o (c) anula lo dicho en "Incluye". El PM no elige ninguna de estas lecturas por criterio propio — **el negocio debe aclarar explícitamente qué tipo de personalización queda dentro y cuál queda fuera** antes de que el BA redacte la HU correspondiente. Mientras tanto, esa HU específica queda bloqueada; el resto del alcance no se ve afectado.
>
> También queda como Punto Abierto menor la interpretación de "múltiples delivery": ¿varias zonas/rutas de entrega simultáneas, o varios proveedores/métodos de envío distintos? No bloquea el diseño general, pero conviene que el negocio lo precise.

## 4. Criterios de éxito

> "Éxito del MVP: lograr 3–5 % de conversión, compras autónomas en menos de 5 minutos, disponibilidad confiable, 90 % de entregas en el horario seleccionado y gestión completa de pedidos desde el sistema."

1. Tasa de conversión del 3–5 %.
2. Compra autónoma completada en menos de 5 minutos.
3. Disponibilidad de catálogo confiable.
4. 90 % de entregas realizadas dentro del horario seleccionado por el cliente.
5. Gestión completa de pedidos desde el sistema.

> **Nota (BA-F1):** los criterios de arriba son la cita literal. Las lecturas siguientes son **interpretación del PM, no confirmadas por el negocio** — no se toman como definitivas: (2) podría referirse a "sin intervención humana/telefónica" o a "sin fricción de registro obligatorio" (ver D6, sección 6); (3) podría referirse a stock real (sin sobreventa), a estabilidad/uptime del sitio, o a ambas. **Punto Abierto nuevo:** confirmar con el negocio a qué se refiere exactamente "disponibilidad confiable" (Criterio 3) antes de fijar el criterio de aceptación de la HU de disponibilidad. (5) implica que el Administrador no depende de canales externos (llamadas/WhatsApp), consistente con el Problema (sección 1).

## 5. Puntos Abiertos

Se mantienen agrupados por tema. Los que el brief de la Ronda 2 no menciona **siguen abiertos sin cambios**; se marca `[RESUELTO parcialmente]` donde el brief aportó información parcial.

**Alcance / contradicciones**
1. **(Bloqueante para 1 HU)** Contradicción "personalización de pedidos" — ver sección 3.2.
2. Interpretación de "múltiples delivery" en "No incluye" — ver sección 3.2.

**Catálogo**
3. ¿"Ramo" y "arreglo" son tipos de producto distintos o sinónimos? ¿Producto terminado (foto fija) o configurable? — Directamente relacionado con la contradicción del punto 1; no se puede cerrar sin esa aclaración.
4. Si el catálogo depende de fotografía, ¿existe descripción textual equivalente del producto (accesibilidad)? *(UX-U1, Ronda 1)*

**Carrito y checkout**
5. ¿Un carrito admite múltiples pedidos con direcciones distintas, o una dirección por compra? El brief solo confirma "seleccionar la dirección de entrega" (singular), pero no aclara si puede haber más de una por pedido.
6. ¿Registro obligatorio o compra como invitado? — no mencionado en el brief.
7. Línea base de accesibilidad en el manejo de errores del checkout — no depende de ninguna decisión pendiente, aplica siempre. *(UX-U7, Ronda 1)*

**Add-ons**
8. ¿Qué complementos existen (chocolates, peluches, globos, tarjetas)? El brief no los menciona; no está claro si quedan cubiertos por "personalizar pedidos" o son un tema aparte.

**Pagos**
9. ~~¿Qué pasarela de pago?~~ **[RESUELTO: Stripe]**, ver sección 3.1.
10. Moneda, impuestos y facturación — no mencionados.
11. Valor mínimo de pedido — no mencionado.
12. Quién absorbe la comisión de Stripe en un reembolso — no mencionado.

**Información del cliente**
13. El brief no menciona un destinatario distinto del Cliente (ver sección 2) ni mensajes de regalo. No se asume que existan; si el negocio los quiere, debe indicarlo explícitamente.

**Delivery y zonas de entrega**
14. ~~¿Existe verificación de fechas/horarios y selección de dirección?~~ **[RESUELTO parcialmente: sí, mecanismo confirmado — verificación de fechas/horarios + mapa para dirección]**. Sigue abierto: cobertura geográfica exacta (¿qué ciudades/zonas cubre el negocio?).
15. ¿Existe modalidad de retiro en tienda (pickup), o es 100 % delivery? — no mencionado. **Preguntar junto con el Punto Abierto 2** (multi-delivery excluido en "No incluye"): si "múltiples delivery" excluido significa "un único método de entrega", eso probablemente ya responde que no hay pickup — no consultarlos por separado para evitar respuestas inconsistentes entre ambos. *(BA-F3)*
16. Validar la zona de cobertura **antes** de completar el checkout, no solo al pagar. *(BA-C1/UX-U6, Ronda 1)*
17. Ventana de corte ("cutoff") para pedidos de mismo día. *(BA-B2, Ronda 1)*
18. Límite de capacidad de pedidos por día en fechas pico (San Valentín, Día de la Madre). *(BA-B3, Ronda 1)*
19. Selector de fecha/hora accesible: debe comunicar por qué una fecha/horario no está disponible — pasa de advertencia teórica a requisito accionable ahora que D3 está parcialmente resuelto. *(UX-U2 Ronda 1, reconfirmado UX-UR2-4)*
19b. El mapa de dirección de entrega necesita una alternativa accesible (campo de texto/autocompletado) — un mapa interactivo puro no es operable por teclado ni con lector de pantalla. *(UX-UR2-1)*

**Inventario**
20. Modelo de inventario: ¿por flor/insumo o por producto terminado? ¿Control en tiempo real? El Criterio de Éxito #3 ("disponibilidad confiable") confirma que debe existir el requisito, pero no el mecanismo. Ligado al Punto Abierto 28 (un local o varios) si el negocio confirma múltiples locales.
21. Momento de reserva de inventario (carrito / inicio de checkout / pago confirmado). *(BA-B6, Ronda 1)*
22. Qué pasa ante stock insuficiente para un pedido ya pagado. *(BA-C2, Ronda 1)*
22b. Reservar un estado explícito de "producto ya no disponible" verificado en el momento de confirmar el pago (condición de carrera si dos clientes compran el mismo producto/horario a la vez) — no asumir que la disponibilidad mostrada en catálogo sigue vigente hasta el pago. *(UX-UR2-5)*
23. Sustitución de flores ante faltante: automática, con confirmación del cliente, o no permitida — no mencionado en el brief.

**Promociones**
24. ¿Existen cupones/descuentos puntuales? El brief excluye "fidelización" (programa de puntos/recurrente), pero eso no es lo mismo que un cupón puntual — no está confirmado ni descartado.

**Cancelaciones y reembolsos**
25. ¿Hasta qué momento se puede cancelar un pedido? ¿Hay penalidad? — no mencionado.
26. ¿Bajo qué condiciones proceden los reembolsos (Stripe los soporta técnicamente, pero la política de negocio no está definida)?

**Notificaciones**
27. ¿Qué eventos se notifican y por qué canal? El Criterio de Éxito #5 implica gestión desde el sistema, pero no especifica notificaciones al cliente.

**Alcance / infraestructura del negocio**
28. ¿El negocio opera un solo local físico o varios? Residual de D2 (tienda única vs. marketplace, ya resuelto: no es marketplace) — afecta directamente al modelo de inventario (Punto Abierto 20): si hay varios locales, el stock probablemente deba gestionarse por local. *(BA-F2)*
29. Confirmar que "gestión avanzada de almacenes" (excluida en "No incluye") no excluye el control básico de stock por producto que exige el Criterio de Éxito #3 — de excluirlo, ese criterio sería incumplible por diseño. *(BA-F5)*

**Requisitos de construcción (línea base, no bloqueantes)**
30. Accesibilidad de los componentes de pago Stripe (Elements/Checkout): no romper su accesibilidad por defecto al maquetar/estilizar alrededor. *(UX-UR2-2, junto con UX-U7 Ronda 1)*

## 6. Estado de las Decisiones Prioritarias (D0–D6, definidas en la Ronda 1)

| ID | Decisión | Estado tras el brief (Ronda 2) |
|---|---|---|
| D0 | Canal/plataforma | **RESUELTO** — web (el brief excluye explícitamente "app móvil nativa"). |
| D1 | ¿Existe actor Destinatario distinto del Cliente? | **RESUELTO** — no; la lista de actores del brief es cerrada (Cliente, Administrador) y la dirección de entrega es un dato del pedido, no un actor. |
| D2 | ¿Tienda única o marketplace? | **RESUELTO** — tienda única (el brief excluye "marketplace" explícitamente). Residual con ID formal: Punto Abierto 28 (un local o varios). |
| D3 | Zonas y fechas de entrega | **PARCIALMENTE RESUELTO** — existe el mecanismo (verificación de fechas/horarios + mapa), falta la cobertura geográfica exacta (Punto Abierto 14). |
| D4 | Modelo de inventario | **ABIERTO** — se confirma el requisito ("disponibilidad confiable"), no el mecanismo (Punto Abierto 20). |
| D5 | Pasarela de pago | **RESUELTO** — Stripe. |
| D6 | ¿Registro obligatorio o invitado? | **ABIERTO** — no mencionado (Punto Abierto 6). Al preguntarlo, mostrar al negocio el Criterio de Éxito #2 ("compra autónoma en <5 min"): un registro obligatorio compite directamente contra esa métrica — no es una resolución de D6, es un insumo a considerar. *(BA-F4 · UX-UR2-3)* |

Con 4 de 7 decisiones resueltas o parcialmente resueltas, este PRD ya no está bloqueado en su totalidad como en la Ronda 1: el BA puede evaluar generar HU para los flujos ya confirmados (catálogo, verificación de disponibilidad, checkout con Stripe, selección de dirección en mapa), usando su propio Índice de Claridad para marcar qué HU quedan con claridad parcial por los puntos aún abiertos (especialmente el Punto Abierto 1, la contradicción de personalización, y D4/D6).

## 7. Trazabilidad del proceso

- **Ronda 1 — Síntesis / Desafío / Convergencia sin brief:** ver `PRD-desafio-ba.md` y `PRD-desafio-ux.md` para el detalle completo (hallazgos A–S y su clasificación).
- **Ronda 2, Síntesis — brief real incorporado (2026-09-10):** reemplazó secciones 1–4 con el brief citado textualmente, actualizó el estado de D0–D6, y añadió la contradicción de "personalización de pedidos" como Punto Abierto 1.
- **Ronda 2, Desafío — revisión BA/UX** (`PRD-desafio-ba-v2.md`, `PRD-desafio-ux-v2.md`): BA aportó 5 hallazgos nuevos (F1–F5) y un Índice de Claridad por necesidad; UX identificó 6 journeys ya bocetables como estructura/patrón y 5 hallazgos de accesibilidad nuevos (UR2-1 a UR2-5). Ambos archivos incluyen la clasificación del PM al final (todo ACCEPT en esta ronda).
- **Ronda 2, Convergencia (este documento):** incorporadas todas las correcciones ACCEPT a las secciones 4–6; ver sección 8 para el handoff parcial resultante.

## 8. Habilitación de trabajo (handoff parcial de esta Convergencia)

Con 4 de 7 Decisiones Prioritarias resueltas (D0, D1, D2, D5) y una parcial (D3), **se habilita un handoff parcial**, siguiendo la recomendación del BA (Índice de Claridad, `PRD-desafio-ba-v2.md`):

**BA queda autorizado a redactar HU para:**
- Consultar catálogo de productos (sin el bloque de personalización — bloqueado por Punto Abierto 1).
- Verificar disponibilidad de producto/fecha/hora — con el AC de "disponibilidad = disponibilidad real" marcado explícitamente en Notas/Puntos abiertos como pendiente de D4 (Punto Abierto 20) y de confirmar el sentido exacto de "disponibilidad confiable" (sección 4).
- Pagar el pedido con Stripe, acotado al paso de pago en sí (independiente de si antes hay login o invitado).
- Seleccionar dirección de entrega en mapa — con el AC de "fuera de zona de cobertura" marcado como pendiente del Punto Abierto 14.

Cada una de estas HU debe declarar en su sección "Notas / Puntos abiertos" el AC exacto que no es verificable todavía, según el playbook de BA.

**No autorizado todavía** (tratar como claridad insuficiente, no como "parcial"): HU de "personalizar pedido" (Punto Abierto 1 — contradicción sin resolver en el brief) y de add-ons (Punto Abierto 8, depende de la misma contradicción). Tampoco: checkout de punta a punta como una sola HU (depende de D6 — separar login/invitado del paso de pago), cancelaciones/reembolsos, notificaciones, ni las pantallas de inventario o de configuración de personalización del panel Administrador.

**UX queda autorizado** a bocetar en paralelo los journeys de estructura/patrón identificados en `PRD-desafio-ux-v2.md` sección A (catálogo, indicador de disponibilidad binario, checkout con mapa+fecha, pago Stripe, comprobante, navegación base de Administrador), con placeholders explícitos donde el contenido dependa de un punto abierto, e incorporando como requisitos de construcción: alternativa accesible al mapa (Punto Abierto 19b) y accesibilidad de Stripe Elements (Punto Abierto 30).

---

**Estado:** `READY FOR BA HANDOFF — PARCIAL` *(alcance exacto del handoff: sección 8. El resto del PRD permanece `BLOCKED` por los Puntos Abiertos listados en la sección 5, en particular la contradicción del Punto Abierto 1 y las Decisiones D4/D6.)*
