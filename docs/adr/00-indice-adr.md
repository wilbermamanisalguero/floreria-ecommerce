# Índice de ADR — E-commerce de Florería

> Proyecto: `floreria-ecommerce/`. Registro de Decisiones de Arquitectura (ADR) derivadas **solo** de insumos existentes: `PRD.md` (Ronda 2 — Convergencia), HU-05..08 y WF-05..08. Fecha de creación: 2026-10-01.

## Convenciones (alineadas al estándar del proyecto)

- **Ubicación y nombre:** `floreria-ecommerce/docs/adr/ADR-<NN>-<slug>.md`, numeración propia del proyecto desde 01 (igual que HU/WF).
- **Trazabilidad obligatoria:** cada ADR cita la sección del PRD, la Decisión Prioritaria (D0–D6), las HU/WF y los Puntos Abiertos (PA) que la originan.
- **Nunca asumir:** una decisión solo es `ACEPTADO` si la respalda un insumo real (cita del brief, decisión D resuelta o hallazgo ACCEPT del PM). Lo que falta se marca `PENDIENTE DE DEFINICIÓN` y se remite al PA correspondiente.
- **Decisión ≠ sugerencia:** la sección "Recomendación (sugerencia — no es decisión)" es la opinión técnica del redactor y **no** compromete alcance; requiere validación del PM (alcance) o del equipo técnico (implementación).
- **Alcance unidireccional:** nada de lo listado en "No incluye" del PRD (sección 3.2) puede reintroducirse por vía de un ADR.
- **Estados:**
  - `ACEPTADO` — respaldado por insumo confirmado.
  - `PROPUESTO` — decisión técnica sugerida, sin bloqueo de negocio, pendiente de aprobación del equipo.
  - `BLOQUEADO` — depende de una decisión de producto abierta; no se implementa hasta resolverla.
  - `REEMPLAZADO POR ADR-NN` — sustituido por un ADR posterior (los ADR no se editan, se reemplazan).

## Registro

| ADR | Título | Estado | Origen principal |
|---|---|---|---|
| [ADR-01](ADR-01-canal-web.md) | Canal: aplicación web (sin app móvil nativa) | `ACEPTADO` | D0, PRD 3.2 |
| [ADR-02](ADR-02-tienda-unica.md) | Modelo de negocio: tienda única (no marketplace) | `ACEPTADO` (con residual abierto) | D2, PA 28 |
| [ADR-03](ADR-03-pasarela-pago-stripe.md) | Pasarela de pago: Stripe con componentes embebidos | `ACEPTADO` | D5, HU-07, WF-07, PA 30 |
| [ADR-04](ADR-04-direccion-mapa-accesible.md) | Dirección de entrega: mapa + alternativa accesible | `ACEPTADO` (proveedor de mapa `PROPUESTO`) | PRD 3.1 ítem 6, HU-08, PA 19b |
| [ADR-05](ADR-05-inventario-disponibilidad.md) | Inventario y control de sobreventa | `BLOQUEADO` (D4) | D4, HU-06, PA 20/21/22/22b |
| [ADR-06](ADR-06-acceso-cliente-checkout.md) | Acceso del cliente al checkout: registro vs. invitado | `BLOQUEADO` (D6) | D6, PA 6 |

## ADR sugeridos a futuro (no redactados — sin insumo suficiente)

Se listan para que no se pierdan; **no** se redactan porque ningún insumo del proyecto los respalda todavía:

- Stack tecnológico (frontend, backend, base de datos, hosting) — el PRD no lo menciona.
- Canal y proveedor de notificaciones — bloqueado por PA 27.
- Moneda, impuestos y facturación electrónica — bloqueado por PA 10.
- Modelo de datos de personalización y add-ons — bloqueado por PA 1 y PA 8.
- Modelo de roles del backoffice del Administrador — residual de la sección 2 del PRD (sub-roles no confirmados).

## Nota de gobierno

El proyecto no tiene un rol/playbook de Arquitectura. Hasta que exista, estos ADR se tratan como insumo técnico para el PM: cualquier ADR que toque Problema, Actores, Alcance o Criterios de éxito debe volver al PM antes de pasar a `ACEPTADO`.

## Plantilla

```markdown
# ADR-<NN> — <Título> (E-commerce de Florería)

> Proyecto: `floreria-ecommerce/`. <contexto corto del insumo que lo habilita>

## Estado
`ACEPTADO` | `PROPUESTO` | `BLOQUEADO` | `REEMPLAZADO POR ADR-NN` — <fecha AAAA-MM-DD>

## Origen / Trazabilidad
- PRD: <sección + cita>
- Decisión Prioritaria: <D#>
- HU / WF: <HU-NN, WF-NN, AC #>
- Puntos Abiertos: <PA #>

## Contexto
<qué problema obliga a decidir; solo hechos respaldados>

## Decisión
<qué se decide — solo lo respaldado por insumo>

## Alternativas consideradas
| Alternativa | Motivo de descarte / estado |

## Consecuencias
- Positivas:
- Negativas / costos:
- Requisitos de construcción derivados:

## Recomendación (sugerencia — no es decisión)
<opinión técnica, claramente marcada>

## PENDIENTE DE DEFINICIÓN
<lo que falta, con PA de referencia>

## Fuera de alcance
<lo excluido por PRD 3.2 o por HU>
```
