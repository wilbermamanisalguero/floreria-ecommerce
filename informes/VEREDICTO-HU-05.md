# Veredicto — HU-05 Consultar catálogo

**Fecha:** 2026-10-15 · **Rama:** `hu-05` (base `sprint0` @ `ee0b2ad`) · **Spec:** `contratos/CONTRATO-HU-05.md` **v2**
**Entregas:** TESTER `fd1f6c1` (informe `informes/INFORME-TESTER-HU-05.md`) · DEV `a5d6bf0` + `b3fd67d` (informe `informes/INFORME-DEV-HU-05.md`)

## Resumen

**0 rojos.** Unitarias, build, lint y typecheck en verde. **Todos los casos que dependen de la BD quedan `NO VERIFICADO`**: no hay una Postgres desechable (contrato §E5). El humano **aceptó** los `NO VERIFICADO` el 2026-10-15 ("está todo ok, podemos ponerlo en verde") y pidió PR.

> Esto **no** es un verde de la HU: sus 24 e2e y la integración D1–D4 no se ejecutaron. Deben correrse con `DATABASE_URL` + `TEST_ALLOW_DB_RESET=1` antes de mergear o desplegar.

## Comandos ejecutados por el LEAD

| Comando | Resultado |
|---|---|
| `npx pnpm@9 test` | exit 0 — 37 pasan, 13 saltadas (HU-05 sin BD + criterio 3 del Sprint 0) |
| `npx pnpm@9 build` | exit 0 — `/catalogo` y `/catalogo/[id]` como `ƒ (Dynamic)` |
| `npx pnpm@9 lint` | exit 0 |
| `npx tsc --noEmit` | exit 0 (tras `build`, que genera los tipos de rutas) |
| `npx pnpm@9 test:e2e` | **no ejecutado**: sin BD las 24 pruebas de HU-05 se saltan |

Aviso de entorno: Node local v20.19.5 (el proyecto pide 22.x). No afectó los resultados.

## Propiedad de rutas

`git log ee0b2ad..HEAD --name-only`: todos los commits llevan prefijo y cada rol tocó solo sus rutas (`AGENTS.md`).

| Rol | Commits | Archivos | Hallazgo |
|---|---|---|---|
| LEAD | `a95f90c`, `ae035e7`, `49346fa` | `.agents/**`, `.claude/**`, `skills-lock.json`, `contratos/**` | Ninguno |
| TESTER | `fe8de84`, `fd1f6c1` | `e2e/**`, `tests/**`, `informes/**` | Ninguno |
| DEV | `a5d6bf0`, `b3fd67d` | `src/**`, `drizzle/**`, `next.config.ts`, `informes/**` | Ninguno |

## Versión del contrato

El DEV entregó contra v1 y, tras el aviso de v2, confirmó que E1–E3 ya se cumplían sin cambios (`a5d6bf0`). El TESTER ajustó a v2 (`fd1f6c1`). **Ambos sobre v2.**

## Matriz de trazabilidad

| Criterio HU-05 | Caso del contrato | Prueba | Resultado |
|---|---|---|---|
| CA 1 | A1, A9 | `e2e/catalogo.spec.ts` "A1 + A9" | `NO VERIFICADO` (sin BD) |
| CA 1 | A7 | "A7" | `NO VERIFICADO` |
| CA 2 | A4 | "A4" | `NO VERIFICADO` |
| CA 2 | B1 | "B1" | `NO VERIFICADO` |
| CA 2 | C1–C3, E1 | "C. Formato del precio" | `NO VERIFICADO` (por inspección: `src/catalogo/precio.ts` produce `S/ ` + U+0020 + `en-US` con 2 decimales) |
| CA 3 | A2, A8, B2, E3 | "A2", "A8", "B2" | `NO VERIFICADO` |
| CA 2/3 + PA 4 | A3, D2 | "A3", `tests/integration/productos-tabla.test.ts` D2 | `NO VERIFICADO` (migración: `descripcion text NOT NULL` + `CHECK <> ''`) |
| CA 2 (manejo de error) | B4, B5, B6 | "B4/B5/B6" | `NO VERIFICADO` |
| — (TDD §10) | A10, B7 | axe ×4 | `NO VERIFICADO` |
| — (decisión 1) | A5 | "A5" | `NO VERIFICADO` |
| — (decisión 2) | A6 | "A6" | `NO VERIFICADO` |
| — (decisión 4) | B3 | "B3" | `NO VERIFICADO` |
| — (TDD §5, decisiones 6–7) | D1, D3, D4 | integración D1/D3/D4 | `NO VERIFICADO` |
| — (ADR-14, decisión 8) | D5 | "D5" | `NO VERIFICADO` |
| — (v2) | E2 | 2 pruebas "E2" | `NO VERIFICADO` por prueba; 🟢 evidencia de build: rutas `ƒ (Dynamic)`, `connection()` en `src/app/catalogo/page.tsx` |
| — (v2) | E4 | `tests/unit/estructura-adr.test.ts` criterio 10 | 🟢 (`pnpm test` exit 0) |
| — (v2) | E5 | guarda `TEST_ALLOW_DB_RESET=1` | 🟢 (las pruebas se saltan con motivo explícito) |

**Casos sin criterio de la HU** (A5, A6, A7, B3–B6, D1–D5, E): son decisiones propuestas aprobadas por el humano el 2026-10-15; el negocio ya las confirmó en el gate del contrato.

## Arbitrajes

Ningún rojo que arbitrar. Los huecos que el TESTER reportó antes de la ejecución (espacio del precio, render por petición, logo, criterio 10, BD) se resolvieron con **contrato v2** aprobado por el humano: desenlace "el contrato no lo decía", vuelta 1.

## Trampas

- Pruebas modificadas entre vueltas: `e2e/catalogo.spec.ts`, fixtures e `estructura-adr.test.ts` cambiaron en `fd1f6c1`; **todas justificadas por v2 §E1–E4**.
- Pruebas sin aserciones: no se detectaron (65 `expect` en e2e, 14 en integración).
- Casos especiales en el código para pasar una prueba: no se detectaron (lectura de `src/catalogo/**` y `src/app/catalogo/**`).

## NO VERIFICADO

- 24 e2e (A, B, C, D5, E2) y la integración D1–D4: falta BD desechable (§E5). **Aceptado por el humano, 2026-10-15.**
- Criterio 3 del Sprint 0: sigue sin `DATABASE_URL` (heredado).
