# SPRINT 0 — E-commerce de Florería (`floreria-ecommerce/`)

**Estado:** Pendiente de aprobación (preparado por LEAD, 2026-10-13)
**Fuentes:** `TECH-DESIGN.md` (2026-10-13, ARCH), `docs/adr/ADR-01..06`, `PRD.md` (Ronda 2), `docs/historias-usuario/HU-05..08` (solo para asignar ADRs a historias).

> **Aviso de fuentes.** `TECH-DESIGN.md` §3 registra ADR-07..ADR-15 como `ACEPTADO` y enlaza `docs/adr/ADR-07-*.md` … `ADR-15-*.md`, pero **esos archivos no existen** en `docs/adr/` y `00-indice-adr.md` todavía dice "stack no decidido". Este plan toma las decisiones **tal como las registra `TECH-DESIGN.md`** y no inventa ningún contenido adicional de esos ADR. Ver pregunta abierta 1.

**Objetivo del Sprint 0:** un esqueleto Next.js que arranca, se conecta a Postgres (Neon), expone `GET /api/health`, tiene Vitest y Playwright funcionando, y respeta los ADRs transversales. **Cero lógica de negocio.**

---

## 1. ADRs que aplican (transversales)

| ADR | Decisión | Por qué aplica ahora |
|---|---|---|
| ADR-01 | Aplicación web; sin app nativa | Define el canal: el esqueleto es una app web. No requiere código propio más allá de existir como web. |
| ADR-02 | Single-tenant (tienda única), un país | Restricción estructural: el esqueleto **no** introduce ninguna noción de tenant/vendedor. Nada que construir. |
| ADR-07 *(según TECH-DESIGN §3)* | Monolito Next.js (App Router); RSC para lecturas, Server Actions + Zod para mutaciones, Route Handlers solo para URL estables | Es la estructura del proyecto. Sin esto no existe la app. |
| ADR-08 *(según TECH-DESIGN §3)* | Vercel; Node 22 LTS; pnpm | Runtime y gestor de paquetes del esqueleto. (El despliegue en Vercel: ver §3.) |
| ADR-10 *(según TECH-DESIGN §3)* | Vitest (unitarias/integración) + Playwright + `@axe-core/playwright` | El runner de pruebas es parte de la DoD del esqueleto. |
| ADR-12 *(según TECH-DESIGN §3)* | Tailwind CSS + shadcn/ui (Radix), mobile-first | Stack de UI: se inicializa la configuración. **Ningún componente de negocio.** |

## 2. ADRs que NO aplican todavía (de historia)

| ADR | Decisión | Aplica cuando llegue |
|---|---|---|
| ADR-03 | Stripe con Payment Element embebido | HU-07 |
| ADR-15 *(según TECH-DESIGN §3)* | "Pagado" solo vía webhook firmado + idempotencia (`POST /api/webhooks/stripe`) | HU-07 |
| ADR-04 | Dirección: mapa + autocompletado accesible; guardar lat/lng | HU-08 |
| ADR-13 *(según TECH-DESIGN §3)* | Google Maps Platform (Maps JS + Places) | HU-08 |
| ADR-14 *(según TECH-DESIGN §3)* | Imágenes del catálogo en Vercel Blob + `next/image` | HU-05 |
| ADR-05 | Inventario / sobreventa — **BLOQUEADO (D4)** | HU-06 AC 4, cuando se resuelva D4 |
| ADR-06 | Registro vs. invitado — **BLOQUEADO (D6)** | Checkout completo (sin HU todavía; bloqueado por el PM) |
| ADR-11 *(según TECH-DESIGN §3)* | Auth.js (NextAuth v5) para el Administrador | **Ninguna HU actual** la cubre (HU-05..08 son del Cliente). Ver pregunta abierta 5. |

## 3. A discutir (mixtos)

| ADR | Qué parte aplica ahora | Qué parte espera a su HU | Pregunta |
|---|---|---|---|
| ADR-09 *(según TECH-DESIGN §3)* — Neon Postgres + Drizzle + drizzle-kit | Cliente de BD con Drizzle, `drizzle.config.ts`, scripts de migración, conexión vía `DATABASE_URL` (necesaria para `/api/health`). | Todas las tablas del modelo (§5 del Tech Design: PRODUCTO, PEDIDO, LINEA_PEDIDO, PAGO, STRIPE_EVENTO_PROCESADO, ADMIN_USUARIO) y las de Auth.js. | ¿Confirmas que el Sprint 0 **no crea ninguna tabla** (esquema vacío)? |
| ADR-08 *(según TECH-DESIGN §3)* — Vercel | Node 22 + pnpm, `pnpm build` funcional (compatible con Vercel). | Despliegue real en Vercel Preview + integración Neon-Vercel (requiere cuentas del humano). | ¿El despliegue en Vercel Preview entra en la DoD del Sprint 0? Si entra, alguien con acceso a la cuenta debe vincular el proyecto; si no, el punto queda fuera (propuesta del LEAD: **fuera**, se verifica en `pnpm build`). |
| ADR-10 *(según TECH-DESIGN §3)* — pruebas | Vitest + Playwright + axe instalados y ejecutándose sobre el esqueleto. | Pruebas de integración contra BD con datos de dominio y flujos E2E de HU-05..08. | ¿Con qué Postgres corren las pruebas? (rama Neon de pruebas o Postgres local — el Tech Design admite ambas). Ver pregunta abierta 3. |

## 4. Propiedad de rutas

Rutas relativas a `floreria-ecommerce/`. Convención: pruebas en carpetas separadas (no co-ubicadas en `src/`) para que la propiedad sea inequívoca.

| Rol | Rutas |
|---|---|
| TESTER | `tests/**` (Vitest: `tests/unit/`, `tests/integration/`, `tests/fixtures/`), `e2e/**` (Playwright), `vitest.config.ts`, `playwright.config.ts` |
| DEV | `src/**` (incluye `src/app/`, `src/db/`, `src/lib/`), `drizzle/**` (migraciones), `drizzle.config.ts`, `package.json`, `pnpm-lock.yaml`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `components.json`, `eslint.config.mjs`, `.env.example`, `.gitignore`, `.nvmrc`, `public/**` |
| Solo LEAD / humano | `AGENTS.md`, `CLAUDE.md`, `.claude/**`, `.agents/**`, `skills-lock.json`, `SPRINT0.md`, `VEREDICTO-*.md`, `contratos/**` |
| Solo lectura para TESTER y DEV (propiedad del equipo Define) | `PRD*.md`, `TECH-DESIGN.md`, `docs/**` (ADR, HU, WF, playbooks) |

**Regla de dependencias de pruebas:** `package.json` es del DEV. El DEV agrega las `devDependencies` y los `scripts` de prueba **exactamente** como los lista la §5; el TESTER no edita `package.json` y configura los runners solo en sus archivos de configuración.

> Esta tabla también se copia en `AGENTS.md` → `## Propiedad de rutas`.

## 5. Definition of Done — esqueleto

Contrato mínimo (nombres exactos):
- **Scripts de `package.json`:** `dev`, `build`, `start`, `lint`, `typecheck` (`tsc --noEmit`), `test` (Vitest, una pasada, sin modo watch), `test:e2e` (Playwright), `db:generate` (drizzle-kit generate), `db:migrate` (drizzle-kit migrate).
- **devDependencies de prueba que agrega el DEV:** `vitest`, `@playwright/test`, `@axe-core/playwright`.
- **URL de salud:** `GET /api/health`.
- **Variable de entorno única del Sprint 0:** `DATABASE_URL`.
- **Puerto local:** `3000`.

| # | Criterio | Cómo se verifica |
|---|---|---|
| 1 | Instala y arranca en local con Node 22 + pnpm | comandos: `node -v` → `v22.x`; `pnpm install` sin error; `pnpm dev` sirve `http://localhost:3000`. `package.json` declara `engines.node` 22 y `packageManager` pnpm. |
| 2 | Compila para producción | comando: `pnpm build` termina con exit 0. |
| 3 | Salud con BD disponible: `GET /api/health` → `200` con cuerpo exacto `{"status":"ok","db":"ok"}` (la app ejecuta `SELECT 1` contra Postgres vía Drizzle) | prueba E2E/integración del TESTER con `DATABASE_URL` válida. |
| 4 | Salud con BD caída: `GET /api/health` → `503` con cuerpo exacto `{"status":"error","db":"error"}` | prueba del TESTER con `DATABASE_URL` apuntando a un Postgres inalcanzable. |
| 5 | La página `/` responde `200` con un placeholder sin contenido de negocio y **sin violaciones axe `serious` ni `critical`** | prueba Playwright + `@axe-core/playwright` del TESTER. |
| 6 | Los runners se ejecutan | comandos: `pnpm test` exit 0 (al menos una prueba Vitest real) y `pnpm test:e2e` exit 0. |
| 7 | Migraciones configuradas sobre esquema vacío | comando: `pnpm db:generate` exit 0; existe `drizzle.config.ts` que lee `DATABASE_URL`. |
| 8 | Calidad estática | comandos: `pnpm lint` exit 0 y `pnpm typecheck` exit 0. |
| 9 | Respeta los ADRs transversales | revisión (archivo:línea): App Router en `src/app/` (no hay `pages/`); Route Handler en `src/app/api/health/route.ts`; Drizzle es el único ORM; Tailwind + shadcn inicializados (`components.json` presente); no hay librería global de estado; `.env.example` lista solo `DATABASE_URL`. |
| 10 | **Cero lógica de negocio** | revisión humana + comprobación: no hay tablas en el esquema Drizzle; no hay rutas fuera de `/` y `/api/health`; `package.json` **no** contiene `stripe`, `@stripe/*`, `next-auth`/`@auth/*`, `@vercel/blob`, `@googlemaps/*`/`@vis.gl/react-google-maps`; no hay Server Actions. |

*Fuera de la DoD salvo que el humano diga lo contrario (§3, pregunta 2):* despliegue en Vercel Preview.

## 6. Plan

### DEV crea
- Proyecto Next.js (App Router, TypeScript, `src/`) con pnpm y Node 22 (`engines`, `packageManager`, `.nvmrc`).
- Tailwind CSS + inicialización de shadcn/ui (`components.json`), **sin** componentes de negocio.
- Página `/` placeholder accesible (título del proyecto, sin catálogo ni precios).
- Cliente Drizzle conectado vía `DATABASE_URL` (`src/db/`), `drizzle.config.ts`, carpeta `drizzle/` y scripts `db:generate` / `db:migrate`, **con esquema vacío**.
- Route Handler `GET /api/health` con el contrato exacto de los criterios 3 y 4.
- Scripts y devDependencies de §5 (incluidos los de prueba), ESLint, `typecheck`, `.env.example`, `.gitignore`.

### TESTER crea
- `vitest.config.ts` y `playwright.config.ts` (Playwright levanta la app como `webServer`).
- Pruebas para los criterios 3, 4, 5 y 6 de la §5 (salud OK, salud con BD caída, `/` con axe, runners en verde).
- Al menos una prueba Vitest real (no un `expect(true)`), p. ej. sobre el contrato de `/api/health`.
- Fixtures/datos de prueba en `tests/fixtures/` si los necesita (nunca datos de dominio).

### NO se crea
- Nada de los ADRs de la §2: Stripe, webhook, mapas, Vercel Blob, Auth.js, inventario, acceso del cliente.
- Ninguna tabla del modelo de datos ni tablas de Auth.js.
- Ninguna funcionalidad de HU-05..08, ni Server Actions, ni carrito.
- Nada de las áreas bloqueadas por el PM: personalización, add-ons, checkout completo, cancelaciones, notificaciones.
- Despliegue en Vercel (salvo decisión del humano, pregunta 2).

## 7. Preguntas abiertas para el humano

1. **[Bloqueante] ADR-07..ADR-15 no existen como archivos.** `TECH-DESIGN.md` los da por `ACEPTADO` y los enlaza, pero `docs/adr/` solo tiene ADR-01..06 y el índice dice "stack no decidido". ¿Le pido al ARCH que los redacte y actualice `00-indice-adr.md` antes de invocar a TESTER y DEV, o aceptas `TECH-DESIGN.md` §3 como fuente suficiente para el Sprint 0?
2. **Despliegue en Vercel Preview:** ¿entra en la DoD? (Propuesta del LEAD: no; se cubre con `pnpm build`.) Si entra, ¿quién vincula el proyecto en Vercel?
3. **Base de datos para desarrollo y pruebas:** ¿quién crea la BD Neon (o el Postgres local) y entrega la `DATABASE_URL` al DEV y al TESTER? Sin ella, los criterios 3 y 7 quedan `NO VERIFICADO`.
4. **No hay repositorio git** en `floreria-ecommerce/` (ni en `PROYECTO_01/`). El proceso exige commits con prefijo `[TESTER]`/`[DEV]` y un PR con `gh pr create`. ¿Inicializo git y con qué remoto de GitHub? ¿El repo es `floreria-ecommerce/` solo o `PROYECTO_01/` completo?
5. **ADR-11 (Auth.js del Administrador)** no tiene HU que la use. ¿Se confirma que queda fuera hasta que el PM/BA redacte una HU de backoffice?
6. **ADR-09 mixto:** ¿confirmas que el Sprint 0 tiene esquema vacío (ninguna tabla)?
7. **`CLAUDE.md`:** el proyecto no tiene uno propio; existe `PROYECTO_01/CLAUDE.md` (padre, describe PM/BA/UX y otros proyectos). Creé `floreria-ecommerce/AGENTS.md` con el mapa de rutas y **no** modifiqué el `CLAUDE.md` padre. ¿Está bien así?
8. **Propiedad de configuración de pruebas:** TESTER es dueño de `vitest.config.ts` / `playwright.config.ts`; DEV agrega las dependencias de prueba en `package.json`. ¿De acuerdo?

## 8. Cambios durante el ciclo

| Fecha | Cambio | Aprobado por |
|---|---|---|
| 2026-10-13 | Creación del documento (pendiente de aprobación) | — |
