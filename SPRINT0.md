# SPRINT 0 — E-commerce de Florería (`floreria-ecommerce/`)

**Estado:** Aprobado (2026-10-14, humano) — con las respuestas a §7 del 2026-10-14 (preparado por LEAD, 2026-10-13)
**Fuentes:** `TECH-DESIGN.md` (2026-10-13, ARCH), `docs/adr/ADR-01..06`, `PRD.md` (Ronda 2), `docs/historias-usuario/HU-05..08` (solo para asignar ADRs a historias).

> **Aviso de fuentes.** `TECH-DESIGN.md` §3 registra ADR-07..ADR-15 como `ACEPTADO` y enlaza `docs/adr/ADR-07-*.md` … `ADR-15-*.md`, pero **esos archivos no existen** en `docs/adr/` y `00-indice-adr.md` todavía dice "stack no decidido". Este plan toma las decisiones **tal como las registra `TECH-DESIGN.md`** y no inventa ningún contenido adicional de esos ADR. Ver pregunta abierta 1 — **resuelta (2026-10-14):** se acepta `TECH-DESIGN.md` §3 como fuente; el ARCH redacta los archivos después, sin bloquear el Sprint 0.

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
| ADR-11 *(según TECH-DESIGN §3)* | Auth.js (NextAuth v5) para el Administrador | **Ninguna HU actual** la cubre (HU-05..08 son del Cliente). **Fuera del Sprint 0** (humano, 2026-10-14, P5). |

## 3. A discutir (mixtos)

| ADR | Qué parte aplica ahora | Qué parte espera a su HU | Pregunta |
|---|---|---|---|
| ADR-09 *(según TECH-DESIGN §3)* — Neon Postgres + Drizzle + drizzle-kit | Cliente de BD con Drizzle, `drizzle.config.ts`, scripts de migración, conexión vía `DATABASE_URL` (necesaria para `/api/health`). | Todas las tablas del modelo (§5 del Tech Design: PRODUCTO, PEDIDO, LINEA_PEDIDO, PAGO, STRIPE_EVENTO_PROCESADO, ADMIN_USUARIO) y las de Auth.js. | **Resuelto (P6):** esquema vacío, ninguna tabla. |
| ADR-08 *(según TECH-DESIGN §3)* — Vercel | Node 22 + pnpm, `pnpm build` funcional (compatible con Vercel). | Despliegue real en Vercel Preview + integración Neon-Vercel (requiere cuentas del humano). | ¿El despliegue en Vercel Preview entra en la DoD del Sprint 0? Si entra, alguien con acceso a la cuenta debe vincular el proyecto; si no, el punto queda fuera **Resuelto (P2):** fuera de la DoD; basta con `pnpm build`. |
| ADR-10 *(según TECH-DESIGN §3)* — pruebas | Vitest + Playwright + axe instalados y ejecutándose sobre el esqueleto. | Pruebas de integración contra BD con datos de dominio y flujos E2E de HU-05..08. | ¿Con qué Postgres corren las pruebas? (rama Neon de pruebas o Postgres local — el Tech Design admite ambas). **Resuelto (P3):** Neon; el humano crea la BD y entrega `DATABASE_URL` (pendiente de entrega). |

## 4. Propiedad de rutas

Rutas relativas a `floreria-ecommerce/`. Convención: pruebas en carpetas separadas (no co-ubicadas en `src/`) para que la propiedad sea inequívoca.

| Rol | Rutas |
|---|---|
| TESTER | `tests/**` (Vitest: `tests/unit/`, `tests/integration/`, `tests/fixtures/`), `e2e/**` (Playwright), `vitest.config.ts`, `playwright.config.ts` |
| DEV | `src/**` (incluye `src/app/`, `src/db/`, `src/lib/`), `drizzle/**` (migraciones), `drizzle.config.ts`, `package.json`, `pnpm-lock.yaml`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `components.json`, `eslint.config.mjs`, `.env.example`, `.gitignore`, `.nvmrc`, `public/**` |
| Solo LEAD / humano | `AGENTS.md`, `CLAUDE.md`, `.claude/**`, `.agents/**`, `skills-lock.json`, `SPRINT0.md`, `VEREDICTO-*.md`, `contratos/**`, `informes/**` (cada rol deja ahí su informe) |
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

*Fuera de la DoD (decisión del humano, 2026-10-14, P2):* despliegue en Vercel Preview. El criterio 2 (`pnpm build`) cubre la compatibilidad.

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
- Despliegue en Vercel (fuera por decisión del humano, P2).

## 7. Preguntas abiertas para el humano

> Respondidas por el humano el **2026-10-14**. Las respuestas **no** equivalen a la aprobación final del documento.

| # | Pregunta | Respuesta del humano (2026-10-14) | Estado |
|---|---|---|---|
| 1 | ADR-07..ADR-15 no existen como archivos: ¿ARCH los redacta antes o se acepta `TECH-DESIGN.md` §3? | Se acepta `TECH-DESIGN.md` §3 como fuente para ADR-07..15. El ARCH los redacta **después**, sin bloquear el Sprint 0. | Resuelta |
| 2 | ¿Vercel Preview entra en la DoD? | **No.** Queda fuera de la DoD; basta con `pnpm build` (criterio 2). | Resuelta |
| 3 | ¿Quién crea la BD y entrega `DATABASE_URL`? | **Neon.** El humano crea la BD y entrega `DATABASE_URL`. | Resuelta — **entrega pendiente** |
| 4 | No hay repo git: ¿qué repo y remoto? | El humano crea un **repo nuevo en GitHub** solo para `floreria-ecommerce/`. Ya existe git local (rama `main`, 1 commit). | Resuelta — **URL del remoto pendiente** |
| 5 | ¿ADR-11 (Auth.js del Administrador) queda fuera? | **Sí**, fuera del Sprint 0. | Resuelta |
| 6 | ¿Esquema vacío (ninguna tabla)? | **Sí**, esquema vacío. | Resuelta |
| 7 | ¿`AGENTS.md` propio sin tocar el `CLAUDE.md` padre? | **OK.** `AGENTS.md` se mantiene; el `CLAUDE.md` padre no se toca. | Resuelta |
| 8 | TESTER dueño de `vitest.config.ts`/`playwright.config.ts`; DEV agrega dependencias de prueba en `package.json`. | **De acuerdo.** | Resuelta |

### 7.1 Bloqueos de entorno (informados por el humano, 2026-10-14)

| Bloqueo | Impacto en la DoD | Quién lo resuelve |
|---|---|---|
| Node local es `v20.19.5`; la DoD exige `22.x` | Criterio 1 no verificable hasta actualizar | Humano |
| `pnpm` no instalado | Criterios 1, 2, 6, 7 y 8 no ejecutables | Humano |
| `gh` no instalado | No se puede abrir el PR (paso 8 del proceso del LEAD) | Humano |
| `DATABASE_URL` (Neon) no entregada | Criterios 3 y 7 quedarían `NO VERIFICADO` | Humano |
| URL del remoto GitHub no entregada | No hay push de rama ni PR | Humano |

> Ninguno de estos bloqueos se resuelve cambiando la DoD: si siguen abiertos al momento del veredicto, los criterios afectados van como `NO VERIFICADO`.

## 8. Cambios durante el ciclo

| Fecha | Cambio | Aprobado por |
|---|---|---|
| 2026-10-13 | Creación del documento (pendiente de aprobación) | — |
| 2026-10-14 | Registradas las respuestas del humano a §7 (P1–P8): ADR-07..15 desde TECH-DESIGN §3 sin bloquear; Vercel Preview fuera de la DoD; Neon (BD y `DATABASE_URL` las entrega el humano, pendiente); repo GitHub nuevo para `floreria-ecommerce/` (URL pendiente; git local en `main`, 1 commit); ADR-11 fuera; esquema vacío; `AGENTS.md` OK sin tocar el `CLAUDE.md` padre; propiedad de config de pruebas confirmada. Ajustados encabezado y §§2, 3, 5 y 6 en consecuencia. | Humano (respuestas); **aprobación final pendiente** |
| 2026-10-14 | Registrados bloqueos de entorno (§7.1): Node v20.19.5 (se exige 22), `pnpm` y `gh` no instalados. | Humano (informados) |
| 2026-10-14 | **Aprobación final** de `SPRINT0.md` y `AGENTS.md` ("apruebo"), con las respuestas a §7. Restricciones de entorno vigentes (§7.1): lo no verificable irá como `NO VERIFICADO`; su aceptación la decide el humano en el veredicto. | Humano |
| 2026-10-14 | El LEAD crea la rama local `sprint0` desde `main`: TESTER y DEV commitean ahí (nunca en `main`); el PR se abrirá desde `sprint0` cuando existan remoto y `gh`. | LEAD (operativo, sin decisión de producto) |
| 2026-10-14 | Escalamiento (pregunta del DEV): se autoriza `npx pnpm@9` (descarga temporal a la caché de npm; sin instalación global ni corepack). **DEV:** generar `pnpm-lock.yaml` y `node_modules`, y correr `build`, `lint`, `typecheck` y `db:generate` con Node 20. **TESTER:** correr `test` y `test:e2e`, incluida la descarga de navegadores de Playwright. Lo relativo a Node 22 (criterio 1) queda `NO VERIFICADO`. | Humano |
| 2026-10-14 | Decisiones sobre `VEREDICTO-SPRINT0.md`: (1) se aceptan los `NO VERIFICADO` de Node 22 (criterio 1) y de salud 200 con BD (criterio 3) para abrir el PR; se verifican después. (2) Se aceptan postgres.js, Next 16, Vitest 4, TS 5.9 y ESLint 9; "cuerpo exacto" = **texto literal**. (3) H1: se commitea el bloque que `next dev` agregó a `AGENTS.md`. (4) H2: `informes/**` entra al mapa como ruta del LEAD donde cada rol deja su informe; se commitea `informes/DEV-sprint0.md`. La revisión humana del criterio 10 queda pendiente para el PR. El PR sigue bloqueado hasta que haya remoto y `gh`. | Humano |
