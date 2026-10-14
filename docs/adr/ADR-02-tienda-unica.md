# ADR-02 — Modelo de negocio: tienda única, no marketplace (E-commerce de Florería)

> Proyecto: `floreria-ecommerce/`. Decisión habilitada por el brief de negocio del 2026-09-10 incorporado en `PRD.md` (Ronda 2).

## Estado
`ACEPTADO` — 2026-10-01 *(con residual abierto: un local vs. varios — PA 28)*

## Origen / Trazabilidad
- PRD sección 3.2 "No incluye": *"... marketplace, múltiples delivery, ... expansión internacional ..."*
- PRD sección 6: D2 — **RESUELTO**: tienda única.
- PRD sección 2: actores cerrados = Cliente, Administrador.
- Puntos Abiertos: PA 28 (un local o varios), PA 20 (modelo de inventario), PA 2 (interpretación de "múltiples delivery").

## Contexto
La decisión de tienda única vs. marketplace define si el sistema es multi-vendedor (multi-tenant). El brief excluye el marketplace y la expansión internacional.

## Decisión
- El sistema es **single-tenant**: un solo vendedor (la florería). No hay entidad "vendedor/tienda" seleccionable por el Cliente.
- Un único rol de Administrador gestiona catálogo, disponibilidad y pedidos (PRD sección 2).
- Operación en **un solo país** (expansión internacional excluida).

## Alternativas consideradas
| Alternativa | Estado |
|---|---|
| Marketplace multi-vendedor | Descartada — excluida en PRD 3.2. |
| Multi-país / multi-moneda | Descartada — "expansión internacional" excluida en PRD 3.2. |

## Consecuencias
- **Positivas:** modelo de datos y permisos simples; una sola cuenta Stripe (ADR-03), sin Stripe Connect.
- **Negativas / costos:** si a futuro se abre a marketplace, habría que re-arquitecturar (tenancy, pagos divididos).
- **Requisitos de construcción derivados:** ninguno adicional.

## Recomendación (sugerencia — no es decisión)
- Aunque PA 28 sigue abierto, conviene que el modelo de stock **no impida** agregar un atributo "local/sucursal" más adelante (por ejemplo, el stock asociado a una ubicación, con una sola ubicación por defecto). Es una previsión de bajo costo, **no** una decisión de que haya varios locales.

## PENDIENTE DE DEFINICIÓN
- ¿Un local físico o varios? — PA 28. Impacta directamente a ADR-05 (inventario).
- ¿Sub-roles dentro de Administrador? — Punto Abierto de PRD sección 2.

## Fuera de alcance
- Marketplace, múltiples delivery, expansión internacional, ERP, gestión avanzada de almacenes (PRD 3.2).
