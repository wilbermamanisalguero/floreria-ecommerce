# ADR-03 — Pasarela de pago: Stripe con componentes embebidos (E-commerce de Florería)

> Proyecto: `floreria-ecommerce/`. Decisión habilitada por el brief de negocio del 2026-09-10 (`PRD.md` 3.1 ítem 5) y materializada en HU-07 / WF-07.

## Estado
`ACEPTADO` — 2026-10-01 *(pasarela: decidida por negocio; mecanismo de confirmación: `PROPUESTO`, ver Recomendación)*

## Origen / Trazabilidad
- PRD sección 3.1, ítem 5: *"realizar el pago Stripe"*.
- PRD sección 6: D5 Pasarela de pago — **RESUELTO**: Stripe.
- HU-07, AC 1–4 (`docs/historias-usuario/HU-07-floreria-pagar-con-stripe.md`).
- WF-07 (`docs/ux/wireframes/WF-07-floreria-pagar-con-stripe.md`): formulario Stripe Elements embebido en el sitio.
- Puntos Abiertos: PA 30 (accesibilidad de Stripe Elements), PA 10 (moneda/impuestos), PA 11 (mínimo de pedido), PA 12 y 26 (reembolsos), PA 22b (disponibilidad al confirmar el pago).

## Contexto
El negocio fijó Stripe como pasarela. El wireframe aprobado (WF-07) usa **Stripe Elements embebido** (tarjeta, vencimiento y CVC dentro de la página de pago), con estados de pago rechazado + reintento sin perder datos (HU-07 AC 3) y comprobante (AC 2).

## Decisión
1. **Stripe** es la única pasarela de pago del MVP.
2. Integración mediante **componentes embebidos de Stripe (Elements)**, coherente con WF-07, **sin alterar su accesibilidad por defecto** (foco, asociación etiqueta-error, lectura por lector de pantalla): HU-07 AC 4 / PA 30.
3. Los datos de tarjeta **no tocan los servidores propios**: los captura y tokeniza Stripe.
4. El monto se cobra **tal cual llega del pedido**, sin agregar impuestos ni aplicar un mínimo no confirmado (HU-07, Reglas de negocio).

## Alternativas consideradas
| Alternativa | Estado |
|---|---|
| Otra pasarela (local, PayPal, etc.) | Descartada — D5 resuelto: Stripe. |
| Stripe Checkout alojado (redirección a página de Stripe) | No elegida — WF-07 ya define el pago embebido en el sitio. Sigue siendo una opción válida si el equipo técnico la prefiere; requeriría ajustar WF-07. |
| Captura propia de tarjeta | Descartada — saca al producto del cumplimiento PCI simplificado. |

## Consecuencias
- **Positivas:** alcance PCI reducido; manejo de 3-D Secure y de los motivos de rechazo resuelto por Stripe (HU-07 AC 3).
- **Negativas / costos:** dependencia de un proveedor; estilizar Elements está limitado si se quiere preservar la accesibilidad (PA 30).
- **Requisitos de construcción derivados:**
  - No sobrescribir con CSS el foco ni los mensajes de error de Elements (PA 30).
  - Corregir la desviación detectada en WF-07 y WF-08: quitar el indicador "PASO 3 DE 3", porque implica un checkout de 3 pasos no confirmado (D6).

## Recomendación (sugerencia — no es decisión)
- **Confirmar el pago del lado del servidor mediante webhooks de Stripe** (p. ej. `payment_intent.succeeded`) y no solo por la redirección del navegador. Es el único momento confiable para marcar el pedido como "pagado" (HU-07 AC 2) aunque el cliente cierre la pestaña.
- **Re-verificar la disponibilidad en el servidor justo antes de confirmar el cobro** (PA 22b). El mecanismo exacto depende de ADR-05 (bloqueado).
- Usar **claves idempotentes** al crear el cobro para que un "Reintentar pago" (AC 3) no genere cobros duplicados.
- Usar **Payment Element** en lugar del Card Element suelto. Así, habilitar otros métodos de pago más adelante sería solo configuración. Habilitarlos sí es decisión de negocio y hoy **no** está autorizado: WF-07 excluye el selector de otros métodos.

## PENDIENTE DE DEFINICIÓN
- Moneda, impuestos y facturación — PA 10.
- Valor mínimo de pedido — PA 11.
- Política de reembolsos y quién absorbe la comisión — PA 26 y PA 12.
- Qué ocurre si el stock se agota con el pedido ya pagado — PA 22 (ligado a ADR-05).

## Fuera de alcance
- Checkout completo de punta a punta (login/invitado, datos previos) — depende de D6, ver ADR-06.
- Reembolsos (HU-07, Fuera de alcance).
- Cupones/descuentos — PA 24, no confirmados.
