# CONTRATO — HU-05 Consultar catálogo de productos

**Versión:** v1
**Estado:** Aprobado (2026-10-15, humano)
**HU:** `docs/historias-usuario/HU-05-floreria-consultar-catalogo.md`

---

## Paquete de contexto

| Fuente | Por qué entra |
|---|---|
| HU-05 | Historia, CA 1–3, fuera de alcance |
| Decisiones del humano, 2026-10-15 (PA 3 y PA 4 del PRD §5) | Cierran los puntos abiertos de la HU: **PA 3a** "ramo" y "arreglo" son sinónimos → un solo tipo de producto, sin categorías. **PA 3b** producto terminado con foto fija, no configurable. **PA 4** todo producto tiene descripción textual equivalente a la foto, **obligatoria**, que sirve también como texto alternativo. |
| WF-05 | Pantallas observables: listado (grilla imagen + nombre + precio) y ficha (foto, nombre, precio); exclusiones visuales |
| TECH-DESIGN.md §5 (PRODUCTO), §9, §10, §11 | Atributos del producto, lectura en servidor, nivel de pruebas, accesibilidad y rendimiento |
| ADR-07 *(según TECH-DESIGN §3)* | Lecturas con RSC (no hace falta endpoint REST para el catálogo) |
| ADR-09 *(según TECH-DESIGN §3)* | Neon Postgres + Drizzle: la tabla de productos se crea en esta HU |
| ADR-10 *(según TECH-DESIGN §3)* | Vitest + Playwright + axe |
| ADR-12 *(según TECH-DESIGN §3)* | Tailwind + shadcn/ui, mobile-first |
| ADR-14 *(según TECH-DESIGN §3)* | Fotos del catálogo en Vercel Blob, servidas con `next/image` |
| ADR-01 | Canal web |

No entran: ADR-03/13/15 (pago y mapa), ADR-05 (inventario, bloqueado: disponibilidad es HU-06), ADR-06 (acceso del cliente, bloqueado), ADR-11 (admin, fuera).

> Nota de fuentes: ADR-07..15 siguen sin archivo en `docs/adr/`; se toman de `TECH-DESIGN.md` §3 como se resolvió en el Sprint 0 (P1).

## Interfaz observable

Dos **pantallas web** públicas (sin sesión), renderizadas en el servidor, y la **tabla de productos** de la base de datos como forma de poner el estado de partida (no hay alta de productos en ninguna HU actual).

## Comportamiento

### A. Listado del catálogo

**Entrada**

```text
GET /catalogo        (sin cookies de sesión)
```

**Casos**

| # | Caso | Entrada / estado previo | Salida esperada | Origen |
|---|---|---|---|---|
| A1 | Camino feliz | 3 productos activos en BD | `200`. La página tiene un `h1` con el texto exacto **"Catálogo"** y una lista (`role="list"`) con **un elemento por producto activo** (3). Cada elemento muestra: imagen, nombre y precio. | CA 1, WF-05 P1 |
| A2 | Atributos mínimos | Ídem A1 | Cada elemento muestra **solo** imagen, nombre y precio. Nada más del producto. | CA 3, WF-05 P1 |
| A3 | Texto alternativo | Ídem A1 | El `alt` de cada imagen es **exactamente** la `descripcion` del producto. | PA 4 (humano 2026-10-15) |
| A4 | Enlace a la ficha | Ídem A1 | Cada elemento es (o contiene) un enlace cuyo nombre accesible incluye el nombre del producto y cuyo `href` es `/catalogo/<id>`. | CA 2 |
| A5 | Producto inactivo | 2 activos + 1 con `activo = false` | Se listan 2. El inactivo no aparece. | TDD §5 (`activo`) — **DECISIÓN PROPUESTA 1** |
| A6 | Orden | Productos "Rosas", "Girasoles", "Lirios" | Orden alfabético ascendente por nombre: Girasoles, Lirios, Rosas. | **DECISIÓN PROPUESTA 2** |
| A7 | Catálogo vacío | 0 productos activos | `200`, `h1` "Catálogo" y el texto exacto **"Por ahora no hay productos en el catálogo."**; no hay lista. | **DECISIÓN PROPUESTA 3** |
| A8 | Sin controles fuera de alcance | Cualquiera | No existe buscador, filtro, categoría, selector de variante, opción de personalización, add-on, botón de carrito/compra ni indicador de disponibilidad. | CA 3, HU-05 Fuera de alcance, PA 3a/3b, WF-05 |
| A9 | Sin sesión | Navegador sin cookies | Igual que A1: no redirige a login ni lo pide. | CA 1 |
| A10 | Accesibilidad | Ídem A1 y A7 | Sin violaciones axe `serious` ni `critical`. | TDD §10, §11 |

### B. Ficha de producto

**Entrada**

```text
GET /catalogo/<id>   (<id> = id del producto, UUID)
```

**Casos**

| # | Caso | Entrada / estado previo | Salida esperada | Origen |
|---|---|---|---|---|
| B1 | Camino feliz | Producto activo | `200`. `h1` con el **nombre** del producto; precio visible; imagen con `alt` = `descripcion`; la `descripcion` también visible como texto en la página. | CA 2, PA 4, WF-05 P2 |
| B2 | Atributos mínimos | Ídem B1 | Solo nombre, precio, imagen y descripción. Sin variantes, categoría, personalización, add-ons, carrito ni indicador de disponibilidad. | CA 3, PA 3a/3b, Fuera de alcance |
| B3 | Volver | Ídem B1 | Enlace con texto exacto **"Volver al catálogo"** hacia `/catalogo`. | **DECISIÓN PROPUESTA 4** |
| B4 | Error: id inexistente | UUID válido sin producto | `404` con el texto exacto **"Producto no encontrado"** y el enlace "Volver al catálogo". | **DECISIÓN PROPUESTA 5** |
| B5 | Error: id malformado | `/catalogo/abc` | Igual que B4 (`404`), nunca `500`. | **DECISIÓN PROPUESTA 5** |
| B6 | Error: producto inactivo | Producto con `activo = false` | Igual que B4 (`404`). | **DECISIÓN PROPUESTA 1 y 5** |
| B7 | Accesibilidad | Ídem B1 y B4 | Sin violaciones axe `serious` ni `critical`. | TDD §10, §11 |

### C. Formato del precio

| # | Caso | Entrada | Salida esperada | Origen |
|---|---|---|---|---|
| C1 | Precio | `precio_minor = 12050` | Texto exacto **`S/ 120.50`** (soles PEN: `S/`, un espacio, dos decimales con punto). | PA 10 (humano 2026-10-15) |
| C2 | Precio con miles | `precio_minor = 123456` | **`S/ 1,234.56`** (coma como separador de miles). | Derivado de C1 por el LEAD — vetable por el humano |
| C3 | Precio entero | `precio_minor = 5000` | **`S/ 50.00`** | PA 10 (humano 2026-10-15) |

### D. Datos del producto (estado de partida)

Única forma de crear productos en esta HU: insertarlos en la tabla. Son nombres fijos para que el TESTER pueda preparar datos sin ver el código del DEV.

| # | Regla | Salida esperada | Origen |
|---|---|---|---|
| D1 | Tabla `productos` con columnas `id` (uuid, generado), `nombre` (texto), `precio_minor` (entero), `descripcion` (texto), `imagen_url` (texto), `activo` (booleano, por defecto `true`) | Existe tras aplicar las migraciones de `drizzle/` | TDD §5 — nombres de tabla: **DECISIÓN PROPUESTA 6** |
| D2 | `descripcion` obligatoria | Insertar con `descripcion` nula o vacía (`''`) falla en la BD | PA 4 (humano 2026-10-15) |
| D3 | `nombre` e `imagen_url` obligatorios, no vacíos | Insertar nulo o vacío falla | CA 2, PA 3b (foto fija) — **DECISIÓN PROPUESTA 7** |
| D4 | `precio_minor` obligatorio, entero > 0 | Insertar nulo, 0 o negativo falla | TDD §5 — **DECISIÓN PROPUESTA 7** |
| D5 | Imágenes | `imagen_url` es una URL `https://` en el host `*.public.blob.vercel-storage.com`; la página se renderiza con esas URL sin error | ADR-14 — host: **DECISIÓN PROPUESTA 8** |

## Nombres que no se negocian

| Tipo | Valor exacto |
|---|---|
| Ruta | `/catalogo` |
| Ruta | `/catalogo/<id>` |
| Tabla | `productos` |
| Columnas | `id`, `nombre`, `precio_minor`, `descripcion`, `imagen_url`, `activo` |
| Encabezado | `Catálogo` |
| Mensaje | `Por ahora no hay productos en el catálogo.` |
| Mensaje | `Producto no encontrado` |
| Enlace | `Volver al catálogo` |
| Formato de precio | `S/ 120.50` |

## Decisiones propuestas (no venían en la HU)

| # | Decisión | Por qué hace falta | Estado |
|---|---|---|---|
| 1 | Los productos con `activo = false` no se listan y su ficha da 404 | El TDD trae el campo `activo` pero no dice su efecto | Aprobada por el humano (2026-10-15) |
| 2 | Orden alfabético por nombre | Sin orden fijado, la prueba no es determinista | Aprobada por el humano (2026-10-15) |
| 3 | Mensaje de catálogo vacío | Estado posible no cubierto por la HU | Aprobada por el humano (2026-10-15) |
| 4 | Enlace "Volver al catálogo" en la ficha | Navegación mínima; WF-05 no la muestra | Aprobada por el humano (2026-10-15) |
| 5 | Id inexistente, malformado o inactivo → 404 "Producto no encontrado" | La HU no cubre el error | Aprobada por el humano (2026-10-15) |
| 6 | Tabla `productos` y nombres de columnas (de TDD §5, en plural) | El TESTER necesita preparar datos sin ver el código | Aprobada por el humano (2026-10-15) |
| 7 | `nombre`, `imagen_url` y `precio_minor > 0` obligatorios | CA 2 exige nombre, precio y foto en la ficha | Aprobada por el humano (2026-10-15) |
| 8 | Host de imágenes `*.public.blob.vercel-storage.com` | `next/image` exige declarar hosts remotos; ADR-14 fija Vercel Blob | Aprobada por el humano (2026-10-15) |

## Fuera del contrato (decide el DEV)

- Estructura de componentes, módulos de dominio, consultas Drizzle, nombres de funciones.
- Estilos y maquetación, respetando WF-05 (grilla de tarjetas, mobile-first) y ADR-12.
- Cómo se suben las fotos a Vercel Blob: no hay alta de productos en esta HU.
- Estados de carga y manejo de caída de la base de datos (no cubiertos por la HU).

## Fuera de la HU (no se construye)

Personalización, add-ons, carrito/checkout, disponibilidad (HU-06), categorías/variantes/tipos (PA 3a: un solo tipo), alta/edición de productos (admin, ADR-11 fuera), cambios en `/`.

## Preguntas abiertas para el humano

Resueltas el 2026-10-15:

1. Precio (PA 10): **soles, `S/ 120.50`** (humano).
2. Decisiones propuestas 1–8: **aprobadas** (humano: "ejecuta el contrato").
3. `/` no se toca en esta HU (sin respuesta: se mantiene lo que dice el contrato).
4. Aviso a PM/BA para registrar PA 3, PA 4 y PA 10 en `PRD.md` y HU-05: pendiente, no bloquea.

## Changelog

| Versión | Fecha | Cambio | Motivo | Aprobado por |
|---|---|---|---|---|
| v1 | 2026-10-15 | Versión inicial, con PA 3a/3b/4 y PA 10 (PEN, `S/ 120.50`) resueltos; decisiones 1–8 aprobadas | Tomar HU-05 | Humano, 2026-10-15 |
