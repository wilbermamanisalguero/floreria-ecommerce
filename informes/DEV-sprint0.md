# Informe DEV — Sprint 0 (`floreria-ecommerce/`)

**Fecha:** 2026-10-14 · **Rama:** `sprint0` (local, sin push) · **Commit:** `b463925` `[DEV] Sprint 0: esqueleto Next.js + Drizzle + /api/health`
**Spec:** `SPRINT0.md` (aprobado 2026-10-14, incl. §8 "se autoriza `npx pnpm@9`").

> Este informe vive en `informes/`, ruta que `AGENTS.md` no asigna a ningún rol: **no está commiteado**. El LEAD decide dónde y quién lo versiona.

## Qué construí

| Pieza | Archivos |
|---|---|
| Next.js 16 (App Router, TS, `src/`), sin `pages/` | `src/app/layout.tsx`, `src/app/page.tsx`, `next.config.ts`, `tsconfig.json` (alias `@/*` → `src/*`) |
| Página `/` placeholder (`lang="es"`, `<main>` + `<h1>Florería</h1>`, sin catálogo ni precios) | `src/app/page.tsx` |
| Tailwind CSS 4 + inicialización shadcn/ui (sin componentes) | `postcss.config.mjs`, `src/app/globals.css` (tokens), `components.json`, `src/lib/utils.ts` (`cn`) |
| Drizzle + Postgres, esquema vacío | `src/db/index.ts` (cliente perezoso vía `DATABASE_URL`), `src/db/schema.ts` (vacío), `drizzle.config.ts`, `drizzle/` |
| `GET /api/health` | `src/app/api/health/route.ts` — `SELECT 1` vía Drizzle → `200 {"status":"ok","db":"ok"}`; cualquier error (BD caída o `DATABASE_URL` ausente) → `503 {"status":"error","db":"error"}` |
| Scripts §5 | `dev`, `build`, `start` (puerto 3000), `lint` (`eslint .`), `typecheck` (`tsc --noEmit`), `test` (`vitest run`), `test:e2e` (`playwright test`), `db:generate`, `db:migrate` |
| devDependencies de prueba §5 | `vitest`, `@playwright/test`, `@axe-core/playwright` |
| Runtime | `engines.node: "22.x"`, `packageManager: "pnpm@9.15.9"`, `.nvmrc` = `22` |
| Otros | `eslint.config.mjs` (flat, `eslint-config-next`), `.env.example` (solo `DATABASE_URL`), `.gitignore` (+ `next-env.d.ts`, `*.tsbuildinfo`), `pnpm-lock.yaml` |

## Cómo se arranca

```bash
cp .env.example .env.local     # completar DATABASE_URL (Neon, con sslmode=require)
npx pnpm@9 install
npx pnpm@9 dev                 # http://localhost:3000
```
`drizzle.config.ts` carga `.env.local` / `.env` si existen (drizzle-kit no lo hace solo).

**Variables de entorno:** solo `DATABASE_URL`.

## Lo que comprobé (Node v20.19.5, `npx pnpm@9` = 9.15.9)

| Comando | Resultado |
|---|---|
| `pnpm install` | OK (aviso esperado: engine `22.x` vs Node 20) |
| `pnpm typecheck` | exit 0 |
| `pnpm lint` | exit 0 |
| `pnpm build` | exit 0 — rutas: `/` (estática), `/api/health` (dinámica) |
| `pnpm db:generate` | exit 0 — "0 tables, No schema changes"; crea `drizzle/meta/_journal.json` |
| `pnpm start` + `curl` | `/` → 200; `/api/health` sin `DATABASE_URL` → 503 con el cuerpo exacto |
| `pnpm dev` + `DATABASE_URL=postgres://u:p@127.0.0.1:1/db` | `/` → 200; `/api/health` → 503 con el cuerpo exacto en ~0,6 s |

Estas son comprobaciones de humo propias, **no** el veredicto. No leí ni ejecuté pruebas del TESTER.

## NO VERIFICADO

| Ítem | Motivo |
|---|---|
| Criterio 1 con Node 22 | Node local es v20.19.5 (§7.1) |
| `/api/health` → 200 con BD real | No hay `DATABASE_URL` de Neon (§7.1) |
| `pnpm db:migrate` | Sin `DATABASE_URL`; además no hay migraciones (esquema vacío) |
| `pnpm test` / `pnpm test:e2e` | Son del TESTER (§8). Nota: sin pruebas, `vitest run` sale con código ≠ 0 |

## Decisiones técnicas que tomé (la spec no fijaba versión ni driver) — para revisión del LEAD

1. **Driver `postgres` (postgres.js)** con `drizzle-orm/postgres-js`. ADR-09 fija Neon + Drizzle, no el driver. Lo elegí porque funciona igual contra Neon (TCP/SSL) que contra un Postgres local o inalcanzable (criterio 4). `connect_timeout: 5` para que la salud falle rápido. Alternativa: `@neondatabase/serverless`.
2. **Versiones:** Next 16.4, React 19.3, Tailwind 4.3, Drizzle 0.45 / drizzle-kit 0.31. Usé versiones anteriores en tres casos, a propósito:
   - **Vitest 4.1** (no 5): Vitest 5 exige Node ≥ 22.12, y el TESTER debe correrlo con Node 20 (§8).
   - **TypeScript 5.9** (no 7) y **ESLint 9** (no 10), por compatibilidad con Next 16 / `eslint-config-next`.
3. **shadcn:** inicialicé solo `components.json`, los tokens en `globals.css` y `cn()` (deps `clsx`, `tailwind-merge`). No agregué `lucide-react`, `class-variance-authority` ni `tw-animate-css`: se agregan con el primer componente.
4. **`lint` = `eslint .`** (Next 16 eliminó `next lint`). También analiza `tests/` y `e2e/` del TESTER.

## Qué no hice / avisos

- Cero lógica de negocio: sin tablas, sin Server Actions, sin rutas fuera de `/` y `/api/health`, y sin `stripe`, `next-auth`, `@vercel/blob` ni Google Maps.
- `AGENTS.md` aparece modificado en el árbol de trabajo, pero el cambio no es mío. No lo toqué ni lo commiteé.
- No hice push, merge ni deploy.
