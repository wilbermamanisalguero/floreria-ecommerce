# WF-05 — Consultar catálogo de productos (E-commerce de Florería)

## HU de origen
`floreria-ecommerce/docs/historias-usuario/HU-05-floreria-consultar-catalogo.md` *(el PM movió esta HU desde el `docs/historias-usuario/` raíz compartido con Clínica Salud Total hacia la carpeta propia del proyecto, corrigiendo la inconsistencia señalada por UX.)*

## Proyecto Stitch
Florería — E-commerce (Portal Cliente) — `projects/9489403432676365752`
Design system: "Floreria E-commerce — Sistema Base" — `assets/10525452681741601693`

## Pantallas / estados

### Pantalla 1 — Catálogo (listado de productos)
- **Stitch:** "Catálogo — Florería Botánica" — `projects/9489403432676365752/screens/61cbaf8589854ebb90ff74215931c33b`
- **Escenario Gherkin cubierto:** Criterio de Aceptación #1 (cliente sin sesión abre el catálogo → el sistema muestra la lista de productos).
- **Campos/controles:** encabezado del sitio, grilla de tarjetas con imagen + nombre + precio únicamente.
- **Fuera de alcance respetado:** sin buscador, categorías, filtros, carrito ni controles de personalización — nada de esto está pedido ni confirmado.

### Pantalla 2 — Ficha de producto (estado: disponible)
- **Stitch:** "Ficha de Producto — Florería Botánica" — `projects/9489403432676365752/screens/6281eba215ba42baa78cd9b52bc64c22`
- **Escenario Gherkin cubierto:** Criterio de Aceptación #2 (el cliente selecciona un producto → se muestra su ficha con nombre, precio, foto).
- **Campos/controles:** foto del producto, nombre, precio.
- **Decisión de reutilización documentada:** esta pantalla también sirve de base para `WF-06-floreria-verificar-disponibilidad.md` (el indicador "Disponible" que se ve en ella es el AC1 de HU-06, no de HU-05). Se diseñó una sola ficha de producto en vez de dos pantallas casi idénticas, siguiendo la sección 5 de mi playbook ("mismo objetivo → misma pantalla, estado distinto"). HU-05 en sí misma solo exige nombre/precio/foto (AC2); el indicador de disponibilidad es el aporte de HU-06 sobre la misma pantalla.
- **Fuera de alcance respetado (AC3):** sin categorías, variantes ni atributos inventados — solo nombre, precio e imagen.

## Escenarios no representables en esta iteración
- Ninguno — las 3 AC de HU-05 tienen representación visual completa en las Pantallas 1 y 2.

## Resumen de exclusiones aplicadas
- Sin personalización de pedido ni add-ons (fuera de alcance explícito de HU-05, Punto Abierto 1/8).
- Sin indicador de disponibilidad en tiempo real como parte propia de esta HU (eso es HU-06, aunque comparte pantalla — ver nota de reutilización).
- Sin botón de "agregar al carrito" — el flujo de carrito/checkout no está autorizado todavía (Punto Abierto 5, D6).

## Puntos abiertos que afectan esta HU
- Punto Abierto 3: si "ramo"/"arreglo" son tipos distintos con atributos propios — afecta el detalle futuro de la ficha, no bloquea lo ya diseñado.
- Punto Abierto 4: alternativa textual equivalente a la foto (accesibilidad) — pendiente de contenido real, el patrón visual ya lo contempla (nota en el design system del proyecto).
