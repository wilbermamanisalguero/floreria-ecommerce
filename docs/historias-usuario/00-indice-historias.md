# Índice de Historias de Usuario — E-commerce de Florería

> Proyecto: `floreria-ecommerce/`. Orden según la propuesta del Agente BA en `PRD-desafio-ba-v2.md`, sección (b) "Lectura para la Convergencia": primero las HU **listas** (con todos los AC verificables) y después las **parciales** (100 % de claridad formal, pero con un AC bloqueado por un punto abierto). El PM adoptó esa recomendación en la Convergencia de la Ronda 2.
>
> Este índice solo define el **orden de trabajo**. Los archivos conservan su numeración (`HU-05..08`) para mantener la trazabilidad 1:1 con WF-05..08, los ADR y las pantallas de Stitch.

## Orden propuesto por el BA

| Orden | HU | Necesidad (BA-v2) | Veredicto BA | AC bloqueado | Depende de |
|---|---|---|---|---|---|
| 1 | [HU-05 — Consultar catálogo de productos](HU-05-floreria-consultar-catalogo.md) | 1. Consultar catálogo | **LISTA** | — (nota menor: PA 3/4 afectan solo el detalle de la ficha) | — |
| 2 | [HU-07 — Pagar el pedido con Stripe](HU-07-floreria-pagar-con-stripe.md) | 3a. Pagar con Stripe (acotada) | **LISTA** (casi; nota menor de moneda/impuestos) | — | PA 10, PA 11 (no bloquean) |
| 3 | [HU-06 — Verificar disponibilidad de producto y fecha/hora](HU-06-floreria-verificar-disponibilidad.md) | 2. Verificar disponibilidad | **PARCIAL** | AC 4 (no sobreventa) | D4 (PA 20) |
| 4 | [HU-08 — Seleccionar dirección de entrega en mapa](HU-08-floreria-seleccionar-direccion-mapa.md) | 4. Dirección en mapa | **PARCIAL** | AC 4 (fuera de cobertura) | PA 14 (D3 parcial) |

## Pendientes, sin HU redactada

| Necesidad | Motivo | Depende de |
|---|---|---|
| 3b. Completar el checkout de punta a punta | El BA recomendó posponerla: define el número de pantallas y si hay autenticación. | D6 (PA 6) |
| Personalizar pedido | No autorizada: contradicción del brief (se trata como < 50 % de claridad). | PA 1 |
| Add-ons | No autorizada: depende de la misma contradicción. | PA 8 |

## Criterio de orden

1. **Testeabilidad real antes que claridad formal.** Las 4 HU tienen 100 % de claridad formal, pero solo HU-05 y HU-07 tienen todos sus AC verificables hoy (principio de Testeabilidad del playbook BA, sección 3).
2. **Dentro de las parciales** se mantiene el orden de necesidades del BA (2 antes que 4).
