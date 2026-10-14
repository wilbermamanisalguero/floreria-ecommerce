# ADR-01 — Canal: aplicación web, sin app móvil nativa (E-commerce de Florería)

> Proyecto: `floreria-ecommerce/`. Decisión habilitada por el brief de negocio del 2026-09-10 incorporado en `PRD.md` (Ronda 2).

## Estado
`ACEPTADO` — 2026-10-01

## Origen / Trazabilidad
- PRD sección 3.2 "No incluye": *"No incluye app móvil nativa, ..."*
- PRD sección 6: D0 Canal/plataforma — **RESUELTO**: web.
- PRD sección 1 (Problema): la compra hoy depende de llamadas o WhatsApp.
- Hallazgo UX-U8 (`PRD-desafio-ux.md`, Ronda 1): tráfico probablemente móvil y en redes lentas en fechas pico.

## Contexto
El brief excluye explícitamente la app móvil nativa. El canal digital del MVP es, por tanto, la web, tanto para el Cliente como para el Administrador (backoffice).

## Decisión
El producto se construye como **aplicación web**. Cliente y Administrador acceden por navegador. No se desarrolla app nativa (iOS/Android) en el MVP.

## Alternativas consideradas
| Alternativa | Estado |
|---|---|
| App móvil nativa | Descartada — excluida en PRD 3.2. |
| Web + app nativa | Descartada — misma razón. |

## Consecuencias
- **Positivas:** un solo código cliente; Stripe (ADR-03) y el mapa (ADR-04) tienen SDK web maduros.
- **Negativas / costos:** sin notificaciones push nativas (el canal de notificaciones sigue abierto, PA 27).
- **Requisitos de construcción derivados:** ninguno confirmado por negocio más allá del canal.

## Recomendación (sugerencia — no es decisión)
- Diseño **responsive mobile-first** y presupuesto de peso de página para el catálogo (imágenes optimizadas, carga diferida). Lo respalda el hallazgo UX-U8 sobre fechas pico. Además, el Criterio de Éxito 2 (compra en < 5 min) se ve afectado si la carga es lenta en móvil.
- Evaluar PWA (instalable, sin tienda de apps) solo si el negocio lo pide. **No** se considera dentro de alcance por defecto, para no reintroducir por otra vía la "app móvil" excluida.

## PENDIENTE DE DEFINICIÓN
- Navegadores/dispositivos mínimos soportados — no mencionado por el negocio.

## Fuera de alcance
- App móvil nativa (PRD 3.2).
