# ADR-04 — Dirección de entrega: mapa + alternativa accesible (E-commerce de Florería)

> Proyecto: `floreria-ecommerce/`. Decisión habilitada por `PRD.md` 3.1 ítem 6 y materializada en HU-08 / WF-08.

## Estado
`ACEPTADO` — 2026-10-01 *(mecanismo: decidido; proveedor de mapas: `PROPUESTO`)*

## Origen / Trazabilidad
- PRD sección 3.1, ítem 6: *"utilizar un mapa para seleccionar la dirección de entrega"*.
- PRD sección 6: D3 — **PARCIALMENTE RESUELTO** (existe el mecanismo; falta la cobertura geográfica).
- HU-08, AC 1–4 (`docs/historias-usuario/HU-08-floreria-seleccionar-direccion-mapa.md`).
- WF-08 (`docs/ux/wireframes/WF-08-floreria-seleccionar-direccion-mapa.md`).
- Puntos Abiertos: PA 19b (alternativa accesible al mapa), PA 14 (cobertura geográfica), PA 16 (validar cobertura antes del checkout), PA 5 (una o varias direcciones).

## Contexto
El brief exige seleccionar la dirección en un mapa. Un mapa interactivo puro no es operable por teclado ni con lector de pantalla (hallazgo UX-UR2-1, aceptado por el PM). La HU-08 lo convirtió en AC 3.

## Decisión
1. La dirección de entrega se captura con **dos entradas equivalentes y sincronizadas**:
   - selección de un punto en un **mapa interactivo** (HU-08 AC 1);
   - **campo de texto con autocompletado** de direcciones, operable por teclado y lector de pantalla (HU-08 AC 3 / PA 19b).
2. El pedido guarda la dirección confirmada asociada a **una** ubicación por pedido (HU-08 AC 2; varias direcciones fuera de alcance por PA 5).
3. El mapa es **solo para seleccionar la dirección**, nunca para hacer seguimiento.

## Alternativas consideradas
| Alternativa | Estado |
|---|---|
| Solo mapa | Descartada — incumple HU-08 AC 3 / PA 19b (accesibilidad). |
| Solo formulario de texto | Descartada — el brief exige el mapa (PRD 3.1 ítem 6). |
| Mapa con tracking del repartidor | Descartada — "mapa para tracking" excluido en PRD 3.2. |

## Consecuencias
- **Positivas:** dirección más precisa (con coordenadas), lo que apoya el Criterio de Éxito 4 (90 % de entregas en horario).
- **Negativas / costos:** dependencia de un proveedor de mapas y geocodificación, con costo por uso.
- **Requisitos de construcción derivados:**
  - Guardar en el pedido las **coordenadas** además del texto de la dirección. Es necesario para validar la cobertura cuando se defina PA 14.
  - Quitar el indicador "PASO 2 DE 3" de WF-08 (desviación registrada en WF-07).

## Recomendación (sugerencia — no es decisión)
- **Proveedor de mapas:** evaluar **Google Maps Platform** (Maps JS + Places Autocomplete; la mejor calidad de autocompletado en LATAM, pero de pago por uso) frente a **Mapbox** (Search/Geocoding; costo menor, buena personalización visual). Las opciones OSM/Nominatim son gratuitas, pero su política de uso no admite autocompletado en producción con volumen. Elección sugerida: Google Places, por la precisión de direcciones, que impacta el Criterio 4. **Pendiente de aprobación del equipo/negocio por costo.**
- Modelar la **zona de cobertura como polígono(s)** configurables por el Administrador, en vez de una lista de distritos fija. Así, cuando se resuelva PA 14, validarla (PA 16) sería una comprobación de "punto dentro de polígono" sin re-arquitectura. *(Previsión técnica; el comportamiento fuera de cobertura sigue `PENDIENTE DE DEFINICIÓN`.)*

## PENDIENTE DE DEFINICIÓN
- Cobertura geográfica exacta — PA 14.
- Comportamiento ante una dirección fuera de cobertura — HU-08 AC 4 (no verificable).
- Momento de la validación de cobertura (antes de completar el checkout) — PA 16.

## Fuera de alcance
- Mapa para tracking, rutas avanzadas, múltiples delivery (PRD 3.2).
- Múltiples direcciones por pedido (PA 5, HU-08).
