# PRD — E-commerce de Florería — Iteración 2: Desafío (BA)

> Revisión del Agente BA sobre `floreria-ecommerce/PRD.md` (Iteración 1 — Síntesis). No se genera ninguna HU en este documento: el PRD sigue en borrador y ningún punto listado aquí se resuelve por criterio propio del BA. El PM clasifica cada ítem como **ACCEPT / REJECT / OPEN POINT / ESCALATE** en la columna correspondiente antes de la convergencia (Iteración 3).
>
> Nota de método: como la Iteración 1 ya dejó Alcance y Criterios de Éxito vacíos y registró todo como Punto Abierto, este desafío no repite esos 18 puntos — los referencia por número — y se enfoca en lo que el checklist original y la síntesis **no** hicieron explícito: ambigüedades dentro de lo ya escrito, reglas de negocio típicas del rubro que el checklist no cubre, casos borde, dependencias de secuenciación entre puntos abiertos, y riesgos de scope creep.

---

## A. Ambigüedades (dentro de lo ya escrito en el PRD)

| ID | Descripción | Puntos relacionados | Clasificación (PM) |
|---|---|---|---|
| A1 | "Ramo" y "arreglo" (Punto 1) no distinguen si el catálogo es de producto terminado (fotos fijas) o configurable (el comprador arma su propio arreglo eligiendo flores/tamaño). Son modelos de datos y de UX muy distintos. | 1 | |
| A2 | Si el carrito admite múltiples destinatarios/direcciones (Punto 3), el PRD no dice si es un pago único con entregas coordinadas o pagos/pedidos separados por destinatario. | 3, 6 | |
| A3 | "Quién define si delivery o pickup está disponible por pedido" (Punto 8) es ambiguo entre regla por producto (p. ej. plantas grandes solo pickup) y regla por zona geográfica (Punto 9). | 8, 9 | |
| A4 | Sustitución de flores (Punto 11) no está vinculada a si cambia el precio del pedido ni a la política de reembolso (Punto 14). | 11, 5, 14 | |
| A5 | Notificaciones (Punto 15) no aclara si el destinatario (si existe como rol — Punto 2 de Actores) también las recibe, o solo el comprador. | 15, actor 2, 6 | |

## B. Reglas de negocio faltantes (no cubiertas por el checklist original)

| ID | Descripción | Puntos relacionados | Clasificación (PM) |
|---|---|---|---|
| B1 | Disclaimer de variabilidad del producto físico ("el arreglo puede variar según disponibilidad de temporada/flor") — estándar en el rubro florería, no aparece ni en el PRD ni en el checklist. Condiciona expectativas del comprador y disputas de reembolso. | 11, 14 | |
| B2 | Ventana de corte ("cutoff") para pedidos de mismo día, ligada al horario operativo del local. | Actor 4, 9 | |
| B3 | Límite de capacidad de pedidos por día en fechas pico (San Valentín, Día de la Madre) — mencionado tangencialmente en Punto 9 pero no como regla de negocio propia; riesgo de sobreventa sin este límite. | 9, 10 | |
| B4 | Moneda, impuestos (IVA/impuesto a las ventas) y facturación — ausentes del PRD y del checklist original. | 5 | |
| B5 | Valor mínimo de pedido — común en florerías con delivery propio. | 5, 8 | |
| B6 | Momento de reserva de inventario: ¿al agregar al carrito, al iniciar checkout, o solo al confirmar el pago? Define si se puede "vender" el mismo stock a dos compradores en simultáneo. | 10, 3 | |
| B7 | Quién absorbe la comisión de la pasarela de pago en un reembolso (negocio o comprador). | 5, 14 | |

## C. Casos borde

| ID | Descripción | Puntos relacionados | Clasificación (PM) |
|---|---|---|---|
| C1 | Dirección de entrega fuera de zona de cobertura, detectada solo después de iniciado el checkout: ¿se bloquea antes o se rechaza después del pago? | 9, 5 | |
| C2 | Stock insuficiente para cumplir un pedido ya pagado, para una fecha específica. | 10, 13 | |
| C3 | Cancelación solicitada después de que el pedido ya salió a reparto. | 13 | |
| C4 | Mensaje de regalo con contenido inapropiado/ofensivo — moderación no mencionada. | 7 | |
| C5 | Destinatario ausente/rechaza recibir el pedido en el domicilio. | 8, 14 | |
| C6 | Cupón de promoción aplicado a un pedido multi-destinatario donde solo uno de los ítems se cancela después. | 12, 3 | |

## D. Dependencias entre Puntos Abiertos (secuenciación recomendada)

Varios de los 18 puntos abiertos del PRD no se pueden resolver de forma independiente — resolver primero los siguientes "raíz" desbloquea al resto:

| ID | Punto raíz | Bloquea a | Por qué |
|---|---|---|---|
| D1 | ¿Existe el actor Destinatario? (Actor, punto 1) | 6, 7, 15 | Sin esta respuesta no se puede precisar qué datos se piden, ni a quién se notifica. |
| D2 | ¿Una sola tienda o múltiples locales/sucursales? (Actor, punto 4) | 9, 10, 16 | Cambia el modelo de datos de inventario, zonas y administración desde la raíz. |
| D3 | Zonas y fechas de entrega (Punto 9) | 8, 3, B2 | Delivery/pickup, carrito multi-dirección y cutoff diario dependen de la cobertura geográfica definida. |
| D4 | Modelo de inventario (Punto 10) | 11, 13, B3, B6 | Sustituciones, cancelaciones por falta de stock y límites de capacidad dependen de cómo se controla el stock. |
| D5 | Pasarela de pago elegida (Punto 5) | 14, B4, B7 | La política de reembolsos y el manejo de impuestos/comisiones dependen de qué soporta técnicamente la pasarela. |

## E. Riesgos de scope creep (no pedidos por el checklist, típicos del rubro — conviene decidir explícitamente si quedan dentro o fuera antes de construir)

| ID | Descripción | Riesgo si no se decide ahora |
|---|---|---|
| E1 | Suscripción periódica de flores ("flores cada semana/mes"). | Puede aparecer a mitad de desarrollo como pedido de negocio; cambia el modelo de checkout y pagos de transaccional a recurrente. |
| E2 | Cuentas B2B/corporativas (facturación consolidada, pedidos recurrentes de oficina). | Modelo de negocio distinto al de consumidor final; afecta checkout, pagos y permisos de administración. |
| E3 | Marketplace multi-florería vs. una sola tienda. El nombre del proyecto ("e-commerce de florería", singular) sugiere una sola tienda, pero no está confirmado explícitamente. | Si se asume "una tienda" y luego el negocio quería multi-tienda, el modelo de datos completo (catálogo, inventario, administración) hay que rehacerlo. |
| E4 | Programa de fidelización / puntos. | Riesgo genérico de e-commerce; no mencionado en el checklist. |
| E5 | Envío entre ciudades vía red de floristas corresponsales ("wire service", práctica común del rubro). | Cambia completamente el modelo de cumplimiento (la entrega la hace un tercero florista, no el negocio). No está ni incluido ni descartado. |
| E6 | Canal/plataforma no especificado (web, app móvil, o ambos). | Mismo patrón de ambigüedad de "canal" ya visto en el proyecto Clínica Salud Total de este repositorio (ver `docs/historias-usuario/00-puntos-abiertos.md`, punto 1) — bloquea decisiones de UX/UI concretas si no se resuelve antes de diseñar. |

---

## Resumen para el PM

- **18 puntos abiertos ya en el PRD** (Iteración 1): sin cambios, siguen pendientes de negocio.
- **5 ambigüedades** dentro de lo ya escrito (sección A).
- **7 reglas de negocio faltantes** que el checklist original no cubrió (sección B).
- **6 casos borde** no contemplados (sección C).
- **5 dependencias de secuenciación** — recomiendo resolver primero D1–D5, porque desbloquean la mayoría de los demás puntos (sección D).
- **6 riesgos de scope creep** — decisiones "fuera de alcance por ahora" explícitas evitarían que aparezcan a mitad de desarrollo (sección E).

Ningún ítem fue clasificado ni resuelto por el BA. Quedan a la espera de tu clasificación (ACCEPT/REJECT/OPEN POINT/ESCALATE) antes de avanzar a la Iteración 3 (Convergencia). No se generó ninguna Historia de Usuario.

---

## Clasificación del PM (Iteración 3 — Convergencia)

| ID | Clasificación | Resolución |
|---|---|---|
| A1 | ACCEPT | Fusionado en Punto Abierto 1 de `PRD.md` (catálogo fijo vs. configurable). |
| A2 | ACCEPT | Fusionado en Punto Abierto 3 (carrito multi-destinatario). |
| A3 | ACCEPT | Fusionado en Punto Abierto 8 (delivery/pickup), depende de Decisión Prioritaria "Zonas y fechas de entrega". |
| A4 | ACCEPT | Fusionado en Punto Abierto 11 (sustitución de flores). |
| A5 | ACCEPT | Fusionado en Punto Abierto 15 (notificaciones). |
| B1 | ACCEPT | Nuevo Punto Abierto en `PRD.md` (disclaimer de variabilidad del producto). |
| B2 | ACCEPT | Nuevo Punto Abierto (ventana de corte / cutoff). |
| B3 | ACCEPT | Nuevo Punto Abierto (capacidad máxima en fechas pico). |
| B4 | ACCEPT | Nuevo Punto Abierto (moneda, impuestos, facturación). |
| B5 | ACCEPT | Nuevo Punto Abierto (valor mínimo de pedido). |
| B6 | ACCEPT | Nuevo Punto Abierto (momento de reserva de inventario), ligado a Decisión Prioritaria "Modelo de inventario". |
| B7 | ACCEPT | Nuevo Punto Abierto (comisión de pasarela en reembolsos), ligado a Decisión Prioritaria "Pasarela de pago". |
| C1 | ACCEPT | Nuevo Punto Abierto (validación temprana de zona de cobertura), ligado a "Zonas y fechas de entrega". |
| C2 | ACCEPT | Nuevo Punto Abierto (stock insuficiente post-pago), ligado a "Modelo de inventario". |
| C3 | ACCEPT | Nuevo Punto Abierto (cancelación con pedido ya en reparto). |
| C4 | ACCEPT | Nuevo Punto Abierto (moderación de mensaje de regalo). |
| C5 | ACCEPT | Nuevo Punto Abierto (destinatario ausente). |
| C6 | ACCEPT | Nuevo Punto Abierto (cupón en pedido multi-destinatario con cancelación parcial). |
| D1 | ESCALATE | Promovido a Decisión Prioritaria/Bloqueante en `PRD.md` (¿existe el actor Destinatario?). |
| D2 | ESCALATE | Promovido a Decisión Prioritaria (tienda única vs. multi-sucursal / marketplace — ver también E3). |
| D3 | ESCALATE | Promovido a Decisión Prioritaria (zonas y fechas de entrega). |
| D4 | ESCALATE | Promovido a Decisión Prioritaria (modelo de inventario). |
| D5 | ESCALATE | Promovido a Decisión Prioritaria (pasarela de pago). |
| E1 | ACCEPT | Excluido explícitamente del alcance inicial (sección 3.2 de `PRD.md`): suscripción periódica. Nadie lo solicitó; se reconsidera solo si el negocio lo pide. |
| E2 | ACCEPT | Excluido explícitamente del alcance inicial: cuentas B2B/corporativas. |
| E3 | ESCALATE | Fusionado con D2 — "una sola tienda" vs. "marketplace multi-florería" es la misma Decisión Prioritaria, no un simple recorte de alcance. |
| E4 | ACCEPT | Excluido explícitamente del alcance inicial: fidelización/puntos. |
| E5 | OPEN POINT | No se excluye por defecto (podría ser parte del modelo de negocio real de la florería): queda como Punto Abierto ligado a la Decisión Prioritaria de zonas de entrega, no como scope creep descartable. |
| E6 | ESCALATE | Promovido a Decisión Prioritaria (canal/plataforma: web, app o ambos). |

Ver `PRD.md` sección 5 y "Decisiones Prioritarias" para el resultado incorporado.
