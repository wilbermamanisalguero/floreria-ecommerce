# VEREDICTO — Sprint 0 (`floreria-ecommerce/`)

**Fecha:** 2026-10-14 · **Emitido por:** LEAD (skill `veredicto` v1)
**Spec juzgada:** `SPRINT0.md` (Aprobado 2026-10-14, humano; incl. §8 autorización `npx pnpm@9`)
**Mapa de rutas:** `AGENTS.md` → `## Propiedad de rutas`
**Rama:** `sprint0` · **Base:** `2389cf2` (`git merge-base main HEAD`) · **HEAD juzgado:** `d10fad9`
**Entregas:** `ENTREGA DEV` (`b463925`, informe `informes/DEV-sprint0.md`) · `ENTREGA TESTER` (`6cc2a85`, `d10fad9`, informe `tests/INFORME-TESTER-sprint0.md`)

> Reemplaza el registro previo del 2026-10-13 (emitido sin entregas). Ese texto queda en el historial de git.

## Veredicto global: 🟢 APTO PARA PR — `NO VERIFICADO` aceptados por el humano (2026-10-14)

> **Actualización 2026-10-14:** el humano resolvió los puntos de la §4 (ver §5). La revisión humana del criterio 10 queda pendiente **en el PR**. El PR sigue bloqueado hasta que haya remoto y `gh`.

### Estado anterior a las decisiones: 🟡 SIN ROJOS — PENDIENTE DE DECISIÓN HUMANA

- **0 🔴**: no hay devoluciones a TESTER ni a DEV (vuelta 0).
- **8 de 10 criterios en 🟢** con evidencia propia del LEAD.
- **2 criterios `NO VERIFICADO`**, o con una parte sin verificar (1 y 3). Aceptarlos o no **lo decide el humano**; el LEAD no los da por aceptados.
- El **PR no se puede abrir** todavía: no hay `gh` ni remoto de GitHub (§7.1).

## Entorno de verificación (ejecutado por el LEAD, 2026-10-14)

Node `v20.19.5` · pnpm vía `npx -y pnpm@9` (9.15.9) · `DATABASE_URL` **no definida** (sin `.env`/`.env.local`) · Chromium de Playwright ya descargado.

| Comando (LEAD) | Resultado |
|---|---|
| `pnpm install --frozen-lockfile` | exit 0 |
| `pnpm typecheck` | exit 0 |
| `pnpm lint` | exit 0 |
| `pnpm build` | exit 0. Rutas: `○ /`, `○ /_not-found`, `ƒ /api/health` |
| `pnpm db:generate` | exit 0. `0 tables` · `No schema changes, nothing to migrate` |
| `pnpm test` | exit 0. `Test Files 3 passed (3)` · `Tests 36 passed \| 1 skipped (37)` |
| `pnpm test:e2e` | exit 0. `2 passed`, `1 skipped` (criterio 3) |
| `pnpm dev` + `curl` | `GET /` → `200` en `:3000`; `GET /api/health` → `HTTP/1.1 503` · `{"status":"error","db":"error"}` |

## 1. Propiedad de rutas

Salida de `git log 2389cf2..HEAD --name-only`, comparada con `AGENTS.md`:

| Commit | Rol | Archivos | Resultado |
|---|---|---|---|
| `6cc2a85` | [TESTER] | `e2e/*.spec.ts`, `playwright.config.ts`, `vitest.config.ts`, `tests/fixtures/*`, `tests/integration/*`, `tests/unit/*` | 🟢 todo dentro de `tests/**`, `e2e/**` y los configs |
| `d10fad9` | [TESTER] | `tests/INFORME-TESTER-sprint0.md` | 🟢 dentro de `tests/**` |
| `b463925` | [DEV] | `.env.example`, `.gitignore`, `.nvmrc`, `components.json`, `drizzle.config.ts`, `drizzle/**`, `eslint.config.mjs`, `next.config.ts`, `package.json`, `pnpm-lock.yaml`, `postcss.config.mjs`, `public/.gitkeep`, `src/**`, `tsconfig.json` | 🟢 todo dentro de las rutas del DEV |
| `909c0d5`, `6ce09e5` | [LEAD] | `AGENTS.md`, `SPRINT0.md` | 🟢 rutas del LEAD |

Todos los commits llevan prefijo. **Ningún rol tocó rutas ajenas en sus commits.**

**Hallazgos fuera de commits (para decisión humana):**

- **H1 — `AGENTS.md` con un cambio sin commitear que no hizo ningún rol.** Es el bloque `<!-- BEGIN:nextjs-agent-rules -->…<!-- END -->`, que `next dev` agrega solo (lo dice el propio bloque). Se generó al levantar el servidor de desarrollo. `AGENTS.md` es del LEAD/humano. El LEAD **no** lo commiteó ni lo descartó. Decide el humano: commitearlo (si no, reaparece cada vez que corre `next dev`) o descartarlo.
- **H2 — `informes/DEV-sprint0.md` sin commitear.** `informes/` no está en el mapa de `AGENTS.md`. El TESTER, en cambio, guardó su informe en `tests/`, que sí es ruta suya. Decide el humano: agregar `informes/**` al mapa (y de quién es) o mover el informe.

## 2. Definition of Done (`SPRINT0.md` §5)

| # | Criterio | Resultado | Evidencia |
|---|---|---|---|
| 1 | Instala y arranca con Node 22 + pnpm | 🟡 **Parcial: lo de Node 22 queda NO VERIFICADO** | 🟢 `pnpm install` exit 0; `pnpm dev` sirve `:3000` (`/` → 200); `package.json` `engines.node: "22.x"`, `packageManager: "pnpm@9.15.9"`; `.nvmrc` = `22`. **NO VERIFICADO:** `node -v` → `v20.19.5`, no `v22.x` (§7.1, §8) |
| 2 | `pnpm build` exit 0 | 🟢 | `pnpm build` exit 0 (con Node 20) |
| 3 | Salud con BD → `200` `{"status":"ok","db":"ok"}` | **NO VERIFICADO** | No hay `DATABASE_URL`. Las pruebas `e2e/health.spec.ts:10` y `tests/integration/health-route.test.ts` existen y **se saltan**: un salto no es verde. Código: `src/app/api/health/route.ts:9-10` (`select 1` → `Response.json({ status: "ok", db: "ok" })`) |
| 4 | Salud con BD caída → `503` `{"status":"error","db":"error"}` | 🟢 | `e2e/health.spec.ts:19` ok; prueba de integración ok; `curl` del LEAD → `503` con el cuerpo exacto; `route.ts:11-12` |
| 5 | `/` → 200, placeholder, sin axe `serious`/`critical` | 🟢 | `e2e/home.spec.ts:4` ok; `src/app/page.tsx` solo tiene "Florería" / "Sitio en construcción." |
| 6 | Los runners se ejecutan | 🟢 | `pnpm test` exit 0 (36 pruebas Vitest reales) y `pnpm test:e2e` exit 0 |
| 7 | Migraciones sobre esquema vacío | 🟢 | `pnpm db:generate` exit 0 (`0 tables`); `drizzle.config.ts:17` lee `process.env.DATABASE_URL`. (`db:migrate` no forma parte del criterio y no se ejecutó: requiere BD) |
| 8 | `lint` y `typecheck` | 🟢 | Ambos exit 0 |
| 9 | ADRs transversales | 🟢 | Existe `src/app/` y no existe `pages/`; `src/app/api/health/route.ts`; único ORM: `drizzle-orm` (deps); `components.json` presente y `tailwindcss` en devDeps; no hay librería de estado global en deps; `.env.example` solo trae `DATABASE_URL`; pruebas `tests/unit/estructura-adr.test.ts` ok |
| 10 | Cero lógica de negocio | 🟢 en lo comprobable · **falta la revisión humana** que exige la spec | `src/db/schema.ts` = `export {};` (sin tablas); `build` solo genera `/` y `/api/health`; `grep "use server" src` sin resultados; deps sin `stripe`, `@stripe/*`, `next-auth`, `@auth/*`, `@vercel/blob`, `@googlemaps/*`, `@vis.gl/*`; `tests/unit/package-contract.test.ts` ok |

## 3. Devoluciones

Ninguna (0 🔴). Vuelta 0.

## 4. Para decisión humana

### NO VERIFICADO

1. **Criterio 1, Node 22**: el entorno tiene Node v20.19.5. Para cerrarlo: instalar Node 22 y repetir `node -v`, `pnpm install` y `pnpm dev`.
2. **Criterio 3, salud con BD**: falta la `DATABASE_URL` de Neon. Para cerrarlo: definirla (en el entorno o en `.env.local`) y repetir `pnpm test` y `pnpm test:e2e`. No hay que cambiar ninguna prueba.
3. **Criterio 10, revisión humana**: la spec la pide de forma explícita.

### Interpretación de la spec (la spec admite más de una lectura, así que no la corrige ningún agente)

4. **"Cuerpo exacto" (criterios 3 y 4)**: el TESTER compara el texto literal (`toBe('{"status":"ok","db":"ok"}')`), es decir, mismo orden de claves y sin espacios. La otra lectura es igualdad de JSON. **Hoy no cambia el resultado**: `Response.json` produce justo ese texto. ¿Cuál lectura vale?

### Decisiones técnicas del DEV que la spec no fija (ninguna la contradice)

5. Driver `postgres` (postgres.js) en lugar de `@neondatabase/serverless`. `TECH-DESIGN.md` no fija el driver. Next `^16.4.0`, Vitest 4 (la v5 exige Node 22.12), TypeScript 5.9 y ESLint 9. ¿Se aceptan o se pide al ARCH un ADR?

### Hallazgos de rutas

6. **H1** (`AGENTS.md` modificado por `next dev`) y **H2** (`informes/` fuera del mapa), descritos en la §1.

### PR

7. **No se puede abrir** con `gh pr create`: no hay `gh` ni remoto (§7.1). Cuando estén, el LEAD abre el PR desde `sprint0` con este veredicto. Nadie hizo push ni merge.

## 5. Decisiones del humano (2026-10-14)

| # | Punto | Decisión | Efecto |
|---|---|---|---|
| 1 | NO VERIFICADO del criterio 1 (Node 22) y del criterio 3 (salud 200 con BD) | **Aceptados** para abrir el PR; se verifican después | No bloquean el PR. Siguen pendientes de verificación |
| 2 | Revisión humana del criterio 10 | Pendiente: **se hace en el PR** | Queda abierta |
| 3 | Lectura de "cuerpo exacto" | **Texto literal** | Las pruebas del TESTER (`toBe` literal) quedan como están |
| 4 | Decisiones técnicas del DEV | **Aceptados** postgres.js, Next 16, Vitest 4, TS 5.9 y ESLint 9 | Sin cambios |
| 5 | H1: `AGENTS.md` modificado por `next dev` | **Commitear** el bloque | Commit [LEAD] |
| 6 | H2: `informes/` fuera del mapa | `informes/**` pasa a ser **ruta del LEAD donde cada rol deja su informe**; se commitea `informes/DEV-sprint0.md` | `AGENTS.md` y `SPRINT0.md` §4 actualizados; commit [LEAD] |
| 7 | PR | Sigue **bloqueado** hasta que haya remoto de GitHub y `gh` | El LEAD lo abre desde `sprint0` cuando estén |
