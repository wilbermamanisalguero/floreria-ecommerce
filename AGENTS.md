# AGENTS.md — E-commerce de Florería (`floreria-ecommerce/`)

Reglas transversales del proyecto para los agentes del equipo que construye (LEAD, TESTER, DEV).
Fuentes de decisión: `TECH-DESIGN.md`, `docs/adr/`. Unidad de trabajo vigente: `SPRINT0.md`.

## Propiedad de rutas

> Estado: **aprobado por el humano** (2026-10-14) junto con `SPRINT0.md`.
> Rutas relativas a `floreria-ecommerce/`. Cada rol toca **solo** sus rutas y commitea solo esas,
> con el prefijo `[TESTER]` o `[DEV]` en el mensaje.

| Rol | Rutas |
|---|---|
| TESTER | `tests/**` (Vitest: `tests/unit/`, `tests/integration/`, `tests/fixtures/`), `e2e/**` (Playwright), `vitest.config.ts`, `playwright.config.ts` |
| DEV | `src/**`, `drizzle/**`, `drizzle.config.ts`, `package.json`, `pnpm-lock.yaml`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `components.json`, `eslint.config.mjs`, `.env.example`, `.gitignore`, `.nvmrc`, `public/**` |
| Solo LEAD / humano | `AGENTS.md`, `CLAUDE.md`, `.claude/**`, `.agents/**`, `skills-lock.json`, `SPRINT0.md`, `VEREDICTO-*.md`, `contratos/**`, `informes/**` |
| Solo lectura para TESTER y DEV | `PRD*.md`, `TECH-DESIGN.md`, `docs/**` |

- `package.json` es del DEV: agrega las dependencias y scripts de prueba exactamente como los fija la unidad de trabajo vigente. El TESTER no lo edita.
- Una ruta que no aparece en esta tabla no se toca sin consultar al LEAD.
- `informes/**` es ruta del LEAD donde **cada rol deja su informe** de entrega; dejar el informe ahí no cuenta como invasión de rutas (humano, 2026-10-14).
- El TESTER es dueño de `vitest.config.ts` y `playwright.config.ts`; el DEV agrega las devDependencies de prueba en `package.json` (confirmado por el humano, 2026-10-14).
- Este `AGENTS.md` es la fuente de reglas del proyecto; el `CLAUDE.md` de `PROYECTO_01/` (padre) **no se modifica** (humano, 2026-10-14).

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
