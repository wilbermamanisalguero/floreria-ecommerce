# Informe TESTER — HU-05 Consultar catálogo

**Fecha:** 2026-10-15 · **Rama:** `hu-05` · **Spec:** `contratos/CONTRATO-HU-05.md` **v1** (aprobado 2026-10-15)
**Entorno:** Windows, `npx pnpm@9`, **sin `DATABASE_URL`** (no hay `.env`/`.env.local`). No abrí `src/**`.

## Archivos (solo rutas del TESTER)

| Archivo | Qué es |
|---|---|
| `tests/fixtures/catalogo-contract.ts` | Nombres que no se negocian, precios C1–C3, preparación de datos (insert directo en `productos`), `drizzle-kit migrate` |
| `tests/integration/productos-tabla.test.ts` | §D1–D4 contra la BD |
| `e2e/catalogo.spec.ts` | §A, §B, §C y D5 por HTTP + navegador (Playwright + axe) |

## Cómo se corren

```
# Requiere una BD Postgres DESECHABLE: las pruebas vacían la tabla productos.
DATABASE_URL=postgres://...  TEST_ALLOW_DB_RESET=1  npx pnpm@9 test
DATABASE_URL=postgres://...  TEST_ALLOW_DB_RESET=1  npx pnpm@9 test:e2e
```

Sin `DATABASE_URL` **y** `TEST_ALLOW_DB_RESET=1`, todas las pruebas de HU-05 se saltan con el motivo explícito. Antes de preparar datos aplican las migraciones de `drizzle/` con `drizzle-kit migrate` (D1). El archivo e2e corre en serie (comparte la tabla).

## Caso del contrato → prueba

| # | Prueba |
|---|---|
| A1 + A9 | `catalogo.spec.ts` "A1 + A9": contexto nuevo sin cookies, `200`, sin redirección, `h1` = `Catálogo`, `role=list` con 3 `listitem`, cada uno con 1 `img`, nombre y precio |
| A2 | "A2": texto del elemento = nombre + precio y nada más; 1 imagen; no muestra la descripción |
| A3 | "A3": `alt` = `descripcion` exacta |
| A4 | "A4": `link` con nombre accesible que incluye el nombre y `href` = `/catalogo/<id>` |
| A5 | "A5": 2 activos + 1 inactivo → 2 elementos, el inactivo no aparece |
| A6 | "A6": insertados Rosas, Girasoles, Lirios → Girasoles, Lirios, Rosas |
| A7 | "A7": solo un inactivo → `200`, `h1`, mensaje exacto, sin `listitem` |
| A8 | "A8": sin `input/select/textarea/form/button`, searchbox, combobox, checkbox, radio, ni textos de búsqueda/filtro/categoría/variante/personalización/add-on/carrito/compra/disponibilidad |
| A10 | Dos pruebas axe (con productos y vacío): sin `serious`/`critical` |
| B1 | "B1": `200`, `h1` = nombre, `S/ 120.50`, `img[alt=descripcion]`, descripción visible como texto |
| B2 | "B2": una sola imagen y la misma verificación de fuera de alcance que A8 |
| B3 | "B3": enlace exacto `Volver al catálogo` → `href="/catalogo"` |
| B4 / B5 / B6 | Tres pruebas: UUID inexistente, `abc`, producto inactivo → `404`, `Producto no encontrado` exacto y enlace `Volver al catálogo` |
| B7 | Dos pruebas axe (ficha y 404) |
| C1–C3 | Una prueba por precio: texto exacto en listado y ficha |
| D1 | `productos-tabla.test.ts`: columnas y tipos en `information_schema`; `id` uuid generado; `activo` por defecto `true` |
| D2 | `descripcion` nula y `''` → el insert falla |
| D3 | `nombre` / `imagen_url` nulos y `''` → falla |
| D4 | `precio_minor` nulo, 0, −100 → falla; 1 → se acepta |
| D5 | `catalogo.spec.ts` "D5": URL `https://tester-hu05.public.blob.vercel-storage.com/...` → listado y ficha `200`, imagen presente, sin `pageerror` |

Criterios de tipo aceptados en D1: "texto" = `text` o `character varying`; "entero" = `integer`, `bigint` o `smallint`.

## Resultado de la ejecución (2026-10-15)

| Comando | Resultado |
|---|---|
| `tsc --noEmit` / `eslint tests e2e` | Sin errores en mis archivos |
| `playwright test e2e/catalogo.spec.ts --list` | 22 pruebas cargan |
| `npx pnpm@9 test` | 34 pasan, 13 saltadas (HU-05 sin BD + criterio 3 del Sprint 0), **2 fallan** — ver abajo |
| `npx pnpm@9 test:e2e` | **NO EJECUTADO**: sin BD las 22 pruebas de HU-05 se saltan |

**Todas las pruebas de HU-05: `NO VERIFICADO`** (falta una BD desechable con `DATABASE_URL`).

## Para el LEAD (no decidido por el TESTER)

1. **Pruebas del Sprint 0 que contradicen HU-05.** `tests/unit/estructura-adr.test.ts` (criterio 10 del Sprint 0) falla en "solo existen las rutas / y /api/health" y "el esquema Drizzle no define tablas". Eran correctas para el esqueleto; HU-05 exige `/catalogo` y la tabla `productos`. No las toqué: ¿se retiran, o se acotan a "solo las rutas/tablas que fija un contrato aprobado"?
2. **Espacio en el precio.** El contrato dice "`S/`, un espacio". Las pruebas exigen **U+0020** (texto exacto, sin normalizar); un espacio duro U+00A0 (el que produce `Intl` en `es-PE`) fallaría. ¿Es correcto?
3. **Render por petición.** Las pruebas cambian la tabla entre casos y esperan que `/catalogo` lo refleje en cada petición (no prerenderizado en `build`). El contrato dice "renderizadas en el servidor" pero no dice si es por petición. Si una prueba falla por datos viejos, está aquí el motivo.
4. **BD de pruebas.** El contrato no dice qué base usar. Puse la guarda `TEST_ALLOW_DB_RESET=1` porque las pruebas borran `productos`. Hace falta una BD desechable para ejecutarlas.
5. **Una sola imagen en la ficha (B2).** Si el layout común agrega un logo `img`, B2 fallaría. Lo leo de "Solo nombre, precio, imagen y descripción".
