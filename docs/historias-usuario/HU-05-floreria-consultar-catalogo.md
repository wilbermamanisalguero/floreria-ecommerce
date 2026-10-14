# HU-05 — Consultar catálogo de productos (E-commerce de Florería)

> Proyecto: `floreria-ecommerce/` (E-commerce de Florería). Handoff parcial autorizado por el PM en `floreria-ecommerce/PRD.md`, sección 8 (Ronda 2 — Convergencia).

## Historia de Usuario
Como cliente de la florería,
quiero consultar el catálogo de productos disponibles,
para elegir qué comprar sin tener que llamar o escribir por WhatsApp para preguntar qué hay.

## Origen en el PRD
- Problema: "Comprar flores actualmente puede requerir llamadas o mensajes por WhatsApp para consultar disponibilidad, precio y horarios de entrega... no puede gestionar fácilmente todo el proceso de compra... desde un solo lugar." (`floreria-ecommerce/PRD.md`, sección 1)
- Objetivo (implícito, cierre de la sección Problema): gestionar el proceso de compra desde un solo lugar, sin depender de canales manuales.
- Alcance: "Incluye" ítem 1, "Consulta del catálogo de productos" (sección 3.1).
- Criterio de Éxito relacionado: Criterio 2 ("compra autónoma en menos de 5 minutos") y Criterio 3 ("disponibilidad de catálogo confiable") — sección 4.

## Índice de claridad
100% (Problema: sí | Objetivo: sí | Alcance: sí | Criterio de Éxito: sí)

## Criterios de Aceptación
1. Dado que el cliente accede al sitio sin necesidad de iniciar sesión, cuando abre la sección de catálogo, entonces el sistema muestra la lista de productos de la florería.
2. Dado un producto listado en el catálogo, cuando el cliente lo selecciona, entonces el sistema muestra su ficha de detalle (nombre, precio, y foto o descripción textual equivalente).
3. Dado que el catálogo aún no distingue formalmente tipos de producto ni atributos (ver Notas), cuando se lista un producto, entonces se muestra únicamente con los atributos mínimos confirmados (nombre, precio, imagen/descripción) — sin inventar categorías, variantes o atributos no confirmados por el negocio.

## Reglas de negocio / Restricciones
- Ninguna regla de negocio adicional confirmada más allá de lo citado en el PRD.
- No se ofrece ninguna opción de personalización desde esta HU (ver Fuera de alcance).

## Fuera de alcance (explícito)
- Personalización de pedidos — bloqueada por contradicción textual del brief, Punto Abierto 1 de `PRD.md`.
- Add-ons (chocolates, peluches, tarjetas, etc.) — Punto Abierto 8, depende de la misma contradicción.
- Verificación de disponibilidad en tiempo real de un producto — cubierta en HU-06 (Verificar disponibilidad).
- Agregar el producto al carrito / iniciar checkout — Punto Abierto 5 (carrito multi-dirección) no confirmado, no cubierto en esta HU.

## Supuestos aplicados
- Ninguno propio del BA. Todo el contenido de la HU proviene de citas textuales del PRD.

## Notas / Puntos abiertos
- Punto Abierto 3 (`PRD.md` sección 5): ¿"ramo" y "arreglo" son tipos de producto distintos con atributos propios, o sinónimos? ¿Producto terminado (foto fija) o configurable? Afecta el detalle de la ficha de producto, no bloquea el listado/consulta base.
- Punto Abierto 4: si el catálogo depende de fotografía, falta confirmar si existe descripción textual equivalente (accesibilidad).

## Prioridad sugerida
Alta — atiende directamente el Problema citado (evitar llamadas/WhatsApp para consultar el catálogo) y los Criterios de Éxito 2 y 3.
