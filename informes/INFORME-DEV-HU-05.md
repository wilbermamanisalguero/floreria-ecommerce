# Informe DEV — HU-05 Consultar catálogo

**Fecha:** 2026-10-15 · **Rama:** `hu-05` (local, sin push) · **Commit:** `a5d6bf0` `[DEV] HU-05: catálogo (/catalogo, /catalogo/<id>) y tabla productos`
**Spec:** `contratos/CONTRATO-HU-05.md` **v2** (aprobado 2026-10-15; commit `49346fa`). Implementado sobre v1 y revisado contra v2.

## Ajuste a v2 (sección E)

| # | Estado | Evidencia |
|---|---|---|
| E1 espacio U+0020 | Cumple sin cambios | `S/ ` es literal en `src/catalogo/precio.ts`; bytes de `S/ 1,234.56` = `53 2f 20 31 2c …` (sin `a0`) |
| E2 por petición | Cumple sin cambios | `build` marca `/catalogo` y `/catalogo/[id]` como `ƒ` (dinámicas); `/catalogo` llama `connection()`; Drizzle no usa `fetch`, no hay caché de datos. Humo: desactivar todos los productos se vio en la petición siguiente |
| E3 una imagen en `main` | Cumple sin cambios | Listado: una `Image` por `li`; ficha: una `Image` en `main`; 404 sin imágenes |
| E4, E5 | No aplican al DEV | Son del arnés del TESTER / BD del humano |

No hubo commit nuevo del DEV por v2.

> Informe sin commitear (`informes/**` es ruta del LEAD).

## Qué implementé

| Contrato | Archivos |
|---|---|
| D1–D4 tabla `productos` (`id` uuid `gen_random_uuid()`, `nombre`, `precio_minor`, `descripcion`, `imagen_url`, `activo` default `true`; NOT NULL + CHECK `<> ''` en nombre/descripcion/imagen_url y `precio_minor > 0`) | `src/db/schema.ts`, migración `drizzle/0000_sour_red_hulk.sql` (+ `drizzle/meta/`) |
| D5 host de imágenes `*.public.blob.vercel-storage.com` (https, sin query ni puerto) | `next.config.ts` (`images.remotePatterns`) |
| A1–A9 `GET /catalogo` (RSC, dinámica por petición con `connection()`, activos ordenados por `nombre` asc, `ul role="list"`, cada `li` = enlace a `/catalogo/<id>` con imagen `alt=descripcion`, nombre, precio; vacío → "Por ahora no hay productos en el catálogo." sin lista) | `src/app/catalogo/page.tsx` |
| B1–B6 `GET /catalogo/<id>` (`h1` nombre, precio, imagen `alt=descripcion`, descripción visible, enlace "Volver al catálogo"; id malformado/inexistente/inactivo → `notFound()` → 404 "Producto no encontrado" + "Volver al catálogo") | `src/app/catalogo/[id]/page.tsx`, `src/app/catalogo/[id]/not-found.tsx` |
| C1–C3 precio `S/ 1,234.56` | `src/catalogo/precio.ts` |
| Consultas Drizzle; el id se valida como UUID antes de consultar (evita el `500` por cast inválido) | `src/catalogo/consultas.ts` |

Sin dependencias nuevas, sin variables de entorno nuevas (solo `DATABASE_URL`). `/` no se tocó.

## Cómo se prueba a mano

```bash
npx pnpm@9 db:migrate          # con DATABASE_URL apuntando a la BD
# insertar productos en la tabla productos (imagen_url en *.public.blob.vercel-storage.com)
npx pnpm@9 build && npx pnpm@9 start
curl -i http://localhost:3000/catalogo
curl -i http://localhost:3000/catalogo/<id>
```

## Lo que comprobé (Node v20.19.5)

BD de humo: Postgres embebido **PGlite** (`pglite-server`) instalado en el scratchpad de la sesión, fuera del proyecto (Docker no estaba corriendo, no hay Neon).

| Comprobación | Resultado |
|---|---|
| `typecheck`, `lint`, `build` | exit 0 (`/catalogo` y `/catalogo/[id]` dinámicas) |
| `db:generate` / `db:migrate` | migración generada y aplicada |
| D2–D4: insertar descripcion `''`/null, nombre `''`, imagen `''`, precio 0/-1/null | las 7 inserciones fallan (23514 / 23502) |
| `/catalogo` con Rosas, Girasoles, Lirios + 1 inactivo | 200, `h1` "Catálogo", `role="list"`, 3 elementos en orden Girasoles, Lirios, Rosas; `alt` = descripción; `href=/catalogo/<uuid>`; inactivo ausente |
| Precios | `S/ 120.50`, `S/ 1,234.56`, `S/ 50.00` |
| `/catalogo/<id>` activo | 200, `h1` = nombre, precio, descripción visible, "Volver al catálogo" |
| inactivo / UUID inexistente / `abc` | 404 los tres, con "Producto no encontrado" y "Volver al catálogo" |
| Todos inactivos | 200, mensaje de catálogo vacío, sin `role="list"` |

Comprobaciones propias de humo, no el veredicto. No leí ni ejecuté pruebas del TESTER.

## NO VERIFICADO

- A10/B7 (axe) — herramienta del TESTER; no la corrí.
- Contra Neon real y con Node 22.
- Carga real de imágenes: las URL de prueba no existen en Blob; la página renderiza, la imagen optimizada no.

## Avisos para el LEAD / arnés

1. **`pnpm typecheck` necesita los tipos de rutas generados** (`PageProps<"/catalogo/[id]">` vive en `.next/types`, que crea `next build`/`next dev`). En un clon limpio, correr `build` (o `next typegen`) antes de `typecheck`.
2. **PGlite como BD de prueba:** con `postgres.js` reutilizando una conexión después de un error, las respuestas llegaron desfasadas; con una conexión por sentencia funcionó. Relevante si el TESTER usa PGlite.
3. **Orden alfabético** depende de la collation de la BD (mayúsculas/tildes). Con los nombres del contrato no cambia nada; si importa para otros nombres, el contrato no lo fija.
4. El enlace de cada tarjeta incluye imagen + nombre + precio, así que su nombre accesible es "descripción nombre precio" (contiene el nombre, como pide A4).
5. El arnés (`vitest.config.ts`, `playwright.config.ts`) necesita una BD con las migraciones de `drizzle/` aplicadas para A/B/D.
