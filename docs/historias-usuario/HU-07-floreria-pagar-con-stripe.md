# HU-07 — Pagar el pedido con Stripe (E-commerce de Florería)

> Proyecto: `floreria-ecommerce/` (E-commerce de Florería). Handoff parcial autorizado por el PM en `floreria-ecommerce/PRD.md`, sección 8 (Ronda 2 — Convergencia). **Acotada explícitamente al paso de pago en sí** — el checkout completo de punta a punta (login/invitado, datos previos) NO está autorizado todavía (depende de D6).

## Historia de Usuario
Como cliente de la florería,
quiero pagar mi pedido con Stripe,
para completar la compra en línea sin depender de llamadas o transferencias manuales.

## Origen en el PRD
- Problema: "Comprar flores actualmente puede requerir llamadas o mensajes por WhatsApp..." (`PRD.md`, sección 1) — el pago en línea elimina esa dependencia.
- Objetivo (implícito): gestionar el proceso de compra desde un solo lugar.
- Alcance: "Incluye" ítem 5, "Pago mediante Stripe" (sección 3.1) — pasarela ya resuelta (D5, sección 6).
- Criterio de Éxito relacionado: Criterio 2, "compra autónoma completada en menos de 5 minutos" (sección 4).

## Índice de claridad
100% formal (Problema: sí | Objetivo: sí | Alcance: sí | Criterio de Éxito: sí) — acotado al paso de pago; el checkout completo alrededor de este paso no tiene la misma claridad (ver Fuera de alcance).

## Criterios de Aceptación
1. Dado que el cliente llegó al paso de pago con un monto a cobrar ya determinado, cuando ingresa sus datos de pago mediante Stripe, entonces el sistema procesa el cobro y confirma el resultado (éxito o fallo) al cliente.
2. Dado un pago exitoso, cuando se confirma, entonces el sistema registra el pedido como pagado y genera un comprobante para el cliente.
3. Dado un pago rechazado por Stripe, cuando ocurre, entonces el sistema informa al cliente el motivo reportado por Stripe y le permite reintentar sin perder los datos del pedido ya armado.
4. Dado el componente de pago de Stripe (Elements/Checkout) mostrado al cliente, cuando se integra visualmente al sitio, entonces debe mantener su accesibilidad por defecto (no se le agregan estilos que rompan foco o lectura por lector de pantalla) — Punto Abierto 30.

## Reglas de negocio / Restricciones
- Pasarela de pago: Stripe (Decisión Prioritaria D5, oficialmente resuelta).
- El monto a cobrar se toma tal cual llega del pedido armado previamente, sin agregar impuestos ni aplicar un valor mínimo no confirmado (ver Notas).

## Fuera de alcance (explícito)
- El flujo completo de checkout de punta a punta (armar pedido, registro/login vs. invitado, captura de datos de envío) — **no autorizado todavía**, depende de D6 (Punto Abierto 6). Esta HU asume que el cliente ya llegó al paso de pago con el pedido y el monto determinados por otro flujo, sin prejuzgar cómo.
- Reembolsos — Punto Abierto 26, no cubiertos aquí.
- Quién absorbe la comisión de Stripe en un reembolso — Punto Abierto 12, no cubierto aquí.

## Supuestos aplicados
- Ninguno propio del BA.

## Notas / Puntos abiertos
- Moneda, impuestos y facturación (Punto Abierto 10) y valor mínimo de pedido (Punto Abierto 11) no están definidos por el negocio; esta HU no impone ninguno por criterio propio.
- D6 (¿registro obligatorio o compra como invitado?) sigue ABIERTO — determina cómo se llega a este paso de pago, pero no afecta el paso de pago en sí mismo, por eso esta HU queda acotada y sí autorizada.

## Prioridad sugerida
Alta — Criterio de Éxito 2 (compra en menos de 5 minutos) y resuelve directamente el Problema citado (pagar sin llamadas ni transferencias manuales).
