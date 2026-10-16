# Informe TESTER — HU-05 Consultar catálogo

**Fecha:** 2026-10-15 · **Rama:** `hu-05` · **Spec:** `contratos/CONTRATO-HU-05.md` **v2** (aprobado 2026-10-15; la entrega v1 fue `fe8de84`)
**Entorno:** Windows, `npx pnpm@9`, **sin `DATABASE_URL`** (no hay `.env`/`.env.local`). No abrí `src/**`.

## Archivos (solo rutas del TESTER)

| Archivo | Qué es |
|---|---|
| `tests/fixtures/catalogo-contract.ts` | Nombres que no se negocian, precios C1–C3, preparación de datos (insert directo en `productos`), `drizzle-kit migrate` |
| `tests/integration/productos-tabla.test.ts` | §D1–D4 contra la BD |
| `e2e/catalogo.spec.ts` | §A, §B, §C, D5 y E1–E3 por HTTP + navegador (Playwright + axe) |
| `tests/unit/estructura-adr.test.ts` | Criterio 10 del Sprint 0 acotado según §E4 |

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
| B2 + E3 | "B2": existe un `main` y dentro hay exactamente una `img` (fuera de `main` es libre); misma verificación de fuera de alcance que A8 |
| B3 | "B3": enlace exacto `Volver al catálogo` → `href="/catalogo"` |
| B4 / B5 / B6 | Tres pruebas: UUID inexistente, `abc`, producto inactivo → `404`, `Producto no encontrado` exacto y enlace `Volver al catálogo` |
| B7 | Dos pruebas axe (ficha y 404) |
| C1–C3 | Una prueba por precio: texto exacto en listado y ficha |
| D1 | `productos-tabla.test.ts`: columnas y tipos en `information_schema`; `id` uuid generado; `activo` por defecto `true` |
| D2 | `descripcion` nula y `''` → el insert falla |
| D3 | `nombre` / `imagen_url` nulos y `''` → falla |
| D4 | `precio_minor` nulo, 0, −100 → falla; 1 → se acepta |
| D5 | `catalogo.spec.ts` "D5": URL `https://tester-hu05.public.blob.vercel-storage.com/...` → listado y ficha `200`, imagen presente, sin `pageerror` |

| E1 | C1–C3, A1, B1: `textContent` sin normalizar contiene `S/` + **U+0020** + número; U+00A0 no pasa |
| E2 | `catalogo.spec.ts` "E2" (2 pruebas): tras alta, cambio de nombre/precio, desactivación y vaciado en la tabla, la siguiente petición a `/catalogo` y `/catalogo/<id>` lo refleja (incl. 404 al desactivar) |
| E3 | A2 (una `img` por elemento de la lista) y B2 (una `img` dentro de `main`) |
| E4 | `estructura-adr.test.ts` criterio 10: rutas del App Router = `/`, `/api/health`, `/catalogo`, `/catalogo/<param>` (cualquier nombre de segmento dinámico); tablas `pgTable("…")` en `src/` = `productos`; `CREATE TABLE` en `drizzle/*.sql` = `productos`; sigue sin Server Actions |
| E5 | Guarda `DATABASE_URL` + `TEST_ALLOW_DB_RESET=1` (sin cambios) |

Criterios de tipo aceptados en D1: "texto" = `text` o `character varying`; "entero" = `integer`, `bigint` o `smallint`.

## Resultado de la ejecución (2026-10-15)

| Comando | Resultado |
|---|---|
| `tsc --noEmit` / `eslint tests e2e` | Sin errores en mis archivos |
| `playwright test e2e/catalogo.spec.ts --list` | 24 pruebas cargan |
| `npx pnpm@9 test` | **exit 0** — 37 pasan, 13 saltadas (HU-05 sin BD + criterio 3 del Sprint 0). El criterio 10 acotado (§E4) pasa sobre el árbol actual |
| `npx pnpm@9 test:e2e` | **NO EJECUTADO**: sin BD las 24 pruebas de HU-05 se saltan |

**Todas las pruebas de HU-05 que usan BD: `NO VERIFICADO`** (§E5: BD desechable pendiente del humano).

## Preguntas de v1 → respuesta en v2

| Pregunta | Respuesta | Ajuste |
|---|---|---|
| Criterio 10 del Sprint 0 en rojo | §E4: lo acota el TESTER | Hecho (ver E4) |
| Espacio del precio | §E1: U+0020 | Ya era estricto; documentado |
| Render por petición | §E2: sí, sin prerender ni caché | 2 pruebas nuevas |
| Logo en la ficha | §E3: una imagen dentro de `main` | B2 medido en `main` |
| BD de pruebas | §E5: desechable, la entrega el humano | Guarda sin cambios |

Sin preguntas abiertas nuevas.
