# PR — Sprint 0 (texto listo para pegar)

**Base:** `main` · **Compare:** `sprint0`
**Crear desde:** https://github.com/wilbermamanisalguero/floreria-ecommerce/compare/main...sprint0?expand=1

## Título

```
Sprint 0 esqueleto
```

## Descripción

```markdown
## Qué entra

El esqueleto del proyecto según `SPRINT0.md`, aprobado por el humano el 2026-10-14. **No incluye lógica de negocio.**

- Next.js 16 (App Router, TypeScript, `src/`), Tailwind 4 e inicialización de shadcn/ui (`components.json`), sin componentes de negocio.
- Drizzle con postgres.js y esquema vacío; `drizzle.config.ts` lee `DATABASE_URL`; scripts `db:generate` y `db:migrate`.
- `GET /api/health`: `200 {"status":"ok","db":"ok"}` / `503 {"status":"error","db":"error"}`.
- Vitest 4 + Playwright + `@axe-core/playwright`, con pruebas de los criterios de la DoD.

Commits por rol: `[DEV] b463925`, `[TESTER] 6cc2a85` y `d10fad9`, `[LEAD]` (documentos y veredicto).

## Veredicto del LEAD (`VEREDICTO-SPRINT0.md`)

**🟢 Apto para PR.** 0 rojos y 0 devoluciones. Cada rol tocó solo sus rutas (`AGENTS.md`).

| # | Criterio | Resultado |
|---|---|---|
| 1 | Instala y arranca con Node 22 + pnpm | 🟢 install/dev · **NO VERIFICADO: Node 22** (entorno v20.19.5) — aceptado por el humano |
| 2 | `pnpm build` | 🟢 |
| 3 | Salud con BD → 200 | **NO VERIFICADO** (falta `DATABASE_URL`) — aceptado por el humano |
| 4 | Salud con BD caída → 503 | 🟢 |
| 5 | `/` 200 + axe sin serious/critical | 🟢 |
| 6 | Los runners se ejecutan | 🟢 `test` 36 ok / 1 saltada · `test:e2e` 2 ok / 1 saltada |
| 7 | `db:generate` sobre esquema vacío | 🟢 |
| 8 | `lint` + `typecheck` | 🟢 |
| 9 | ADRs transversales | 🟢 |
| 10 | Cero lógica de negocio | 🟢 en lo comprobable · **⏳ revisión humana pendiente (en este PR)** |

Verificado por el LEAD con Node 20.19.5 y `npx pnpm@9` (autorizado, `SPRINT0.md` §8).

## Decisiones del humano (2026-10-14)

- Se aceptan los NO VERIFICADO de los criterios 1 y 3; **se verifican después**, con Node 22 y la `DATABASE_URL` de Neon (`pnpm test` y `pnpm test:e2e`, sin cambiar pruebas).
- "Cuerpo exacto" = texto literal.
- Se aceptan postgres.js, Next 16, Vitest 4, TS 5.9 y ESLint 9.
- `informes/**` pasa a ser ruta del LEAD donde cada rol deja su informe.

## Pendiente antes del merge

- [ ] **Revisión humana del criterio 10** (cero lógica de negocio): revisar `src/` y `package.json`.
- [ ] Merge: lo hace el humano. El LEAD no mergea.

## Informes

`VEREDICTO-SPRINT0.md` · `informes/DEV-sprint0.md` · `tests/INFORME-TESTER-sprint0.md` · `SPRINT0.md` §8

🤖 Generated with [Claude Code](https://claude.com/claude-code)
```
