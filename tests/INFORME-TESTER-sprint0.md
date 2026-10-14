# Informe TESTER — Sprint 0 (`floreria-ecommerce/`)

**Fecha:** 2026-10-14 · **Rama:** `sprint0` · **Spec:** `SPRINT0.md` (aprobado, incl. §8 `npx pnpm@9`)
**Entorno:** Node v20.19.5, pnpm 9.15.9 vía `npx pnpm@9`, Chromium de Playwright descargado, **sin `DATABASE_URL`**.

> Ubicación: el informe vive en `tests/` (ruta del TESTER) porque `informes/` no figura en el mapa de rutas de `AGENTS.md`.

## Cómo se corren

```
npx pnpm@9 test                                  # Vitest, una pasada
npx pnpm@9 exec playwright install chromium      # una vez
npx pnpm@9 test:e2e                              # Playwright: compila y levanta 2 instancias
```

El `webServer` de Playwright (`tests/fixtures/start-servers.mjs`) corre `pnpm build` una vez y levanta:
- `:3000` con `pnpm start` y el entorno normal (`DATABASE_URL` real si existe en el entorno, `.env.local` o `.env`) → criterios 3 y 5;
- `:3001` con `next start` y `DATABASE_URL=postgresql://tester:tester@127.0.0.1:1/inalcanzable` (Postgres inalcanzable a propósito, no son credenciales) → criterio 4.

## Resultado de la ejecución (2026-10-14, sobre `b463925` del DEV)

| Comando | Resultado |
|---|---|
| `npx pnpm@9 test` | **exit 0** — 3 archivos, 36 pasadas, 1 saltada (criterio 3, sin `DATABASE_URL`) |
| `npx pnpm@9 test:e2e` | **exit 0** — 2 pasadas, 1 saltada (criterio 3, sin `DATABASE_URL`) |

## Cobertura de la DoD (§5)

| # | Criterio | Prueba / verificación | Estado |
|---|---|---|---|
| 1 | Instala y arranca con Node 22 + pnpm | `tests/unit/package-contract.test.ts`: `engines.node` declara 22 y `packageManager` es `pnpm@…`. Comandos: `node -v` → `v22.x`, `pnpm install`, `pnpm dev` en `:3000` | Declaraciones: **PASA**. Node 22: **NO VERIFICADO** (Node local v20.19.5, §8). `pnpm dev`: verificable por comando, no lo ejecuté |
| 2 | `pnpm build` exit 0 | Verificable por comando. El `webServer` de e2e lo ejecutó como paso previo y terminó sin error (Node 20) | Lo corre el DEV/LEAD. Observado OK durante e2e (Node 20) |
| 3 | Salud con BD → `200` `{"status":"ok","db":"ok"}` | `e2e/health.spec.ts` (HTTP real) y `tests/integration/health-route.test.ts` (Route Handler) | **NO VERIFICADO**: falta `DATABASE_URL` (§7.1). Las dos pruebas se saltan explícitamente si no está definida |
| 4 | Salud con BD caída → `503` `{"status":"error","db":"error"}` | `e2e/health.spec.ts` (instancia `:3001`) y `tests/integration/health-route.test.ts` | **PASA** |
| 5 | `/` → `200`, sin violaciones axe `serious`/`critical` | `e2e/home.spec.ts` (Playwright + `@axe-core/playwright`, Chromium escritorio) | **PASA**. "Sin contenido de negocio": revisión humana |
| 6 | Los runners se ejecutan | `pnpm test` y `pnpm test:e2e` | **PASA** (ambos exit 0, con pruebas Vitest reales) |
| 7 | Migraciones sobre esquema vacío | `tests/unit/estructura-adr.test.ts`: `drizzle.config.ts` existe y lee `DATABASE_URL`. `pnpm db:generate` es verificable por comando | Parte estática: **PASA**. `db:generate`: lo corre el DEV/LEAD |
| 8 | `lint` y `typecheck` | Verificables por comando. Los corrí para comprobar que mis archivos no los rompen: ambos terminaron sin errores | Observado OK (Node 20) |
| 9 | ADRs transversales | `estructura-adr.test.ts`: `src/app/` y sin `pages/`; `src/app/api/health/route.ts`; Drizzle es el único ORM; `tailwindcss` + `components.json`; sin librería global de estado (lista: redux, RTK, zustand, jotai, recoil, mobx, valtio); `.env.example` = solo `DATABASE_URL` | **PASA** (más la revisión archivo:línea del LEAD) |
| 10 | Cero lógica de negocio | `estructura-adr.test.ts`: solo las rutas `/` y `/api/health`; sin `pgTable(` en `src/`; sin `"use server"`. `package-contract.test.ts`: sin `stripe`, `@stripe/*`, `next-auth`, `@auth/*`, `@vercel/blob`, `@googlemaps/*` ni `@vis.gl/react-google-maps` | **PASA** (más la revisión humana) |

## Decisiones de prueba que el LEAD puede revisar

1. **"Cuerpo exacto"**: lo interpreté como texto literal (`toBe('{"status":"ok","db":"ok"}')`): mismo orden de claves y sin espacios. Si la intención era igualdad JSON, se afloja a `toEqual` sobre `res.json()`. **Lo tiene que decidir el LEAD.**
2. **Criterio 3 sin BD**: la prueba se **salta** cuando falta `DATABASE_URL`, para que `test`/`test:e2e` den exit 0. Un salto no cuenta como aprobado: el criterio queda NO VERIFICADO.
3. **Vitest** asume el alias `@/*` → `src/*` (convención de Next con `src/`) y reemplaza `server-only` por un módulo vacío.
4. **Lista de "estado global"** (criterio 9): es heurística y no reemplaza la revisión.

## NO VERIFICADO

- **Criterio 1, Node 22**: el entorno tiene Node v20.19.5 (decisión del humano, §8).
- **Criterio 3**: falta `DATABASE_URL` de Neon. Para correrlo: definir `DATABASE_URL` (entorno o `.env.local`) y repetir `test` y `test:e2e`. No hay que cambiar ninguna prueba.

## Pedidos fuera de mis rutas

- Ninguno. Vitest emite un aviso por la sintaxis ESM de `vitest.config.ts` con `configLoader: 'native'`. Es solo informativo y no afecta el resultado.
