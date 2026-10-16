---
name: veredicto
description: Dicta el veredicto de una unidad de trabajo cuando el TESTER y el DEV ya entregaron - corre las pruebas del TESTER contra el código del DEV, arbitra cada rojo con el contrato en la mano (se apartó el código, se apartó la prueba, o el contrato no lo decía), comprueba que cada rol tocó solo sus rutas y produce la matriz de trazabilidad para el PR. Use when the LEAD has received both deliveries (ENTREGA TESTER and ENTREGA DEV) for a unit of work, or when asked to verify, judge, arbitrate, or give the verdict on a team delivery.
type: skill
tags: [lead, veredicto, arbitraje, trazabilidad, evidencia]
---

# Veredicto (v2)

## Goal

Responder con evidencia **"¿esta unidad de trabajo cumple su contrato?"**, y cuando no lo cumple,
**quién se apartó**. Cada resultado lleva una prueba, un comando o un `archivo:línea`, o queda
`NO VERIFICADO`.

> **Novedades v2:** arbitraje con tres desenlaces y matriz de trazabilidad.
>
> **En el Sprint 0** se aplica el mismo workflow con `SPRINT0.md` como spec: cada punto de la
> Definition of Done ocupa el lugar de un caso del contrato, el desenlace "el contrato no lo
> decía" se lee como "`SPRINT0.md` no lo decía", la matriz de trazabilidad se reemplaza por la
> tabla de la DoD (punto → evidencia → resultado) y el informe va a `informes/VEREDICTO-SPRINT0.md`.
> Las pruebas marcadas `NO EJECUTADAS` por el TESTER se corren ahora que el runner existe.

## Input

- La spec: `contratos/CONTRATO-<HU>.md` (versión vigente) o `SPRINT0.md`.
- La HU (para la matriz: sus criterios de aceptación).
- Los informes de `ENTREGA TESTER` y `ENTREGA DEV`.
- El mapa de propiedad de rutas en `AGENTS.md`.
- La rama de trabajo y su punto de partida.

Si falta cualquiera de las dos entregas, **no se dicta veredicto**: se espera.

## Workflow

1. **Verificar la propiedad de rutas.** `git log <base>..HEAD --name-only --format="%s"`, agrupar
   por prefijo (`[TESTER]` / `[DEV]`) y comparar contra el mapa de `AGENTS.md`. Archivos fuera de
   las rutas del rol o commits sin prefijo son **hallazgos**, aunque todo pase.

2. **Verificar que los dos trabajaron sobre la misma versión del contrato.** Si no, el veredicto
   no vale: se avisa a quien quedó atrasado.

3. **Correr las pruebas del TESTER** contra el código del DEV. Guardar la salida.

4. **Resultado por cada caso del contrato:** 🟢 / 🔴 / `NO VERIFICADO`, con la prueba que lo cubre.
   Un caso del contrato sin prueba es `NO VERIFICADO`, no verde.

5. **Arbitrar cada 🔴 con el contrato en la mano.** Leer qué dice el contrato del caso, qué espera
   la prueba y qué hace el código:
   - **Se apartó el código** — la prueba coincide con el contrato y el código no → vuelve al
     **DEV** con el caso, la cita del contrato y la evidencia.
   - **Se apartó la prueba** — el código coincide con el contrato y la prueba no (nombre, formato,
     caso que el contrato no pide) → vuelve al **TESTER** con lo mismo.
   - **El contrato no lo decía** — los dos son lecturas razonables de un contrato incompleto o
     ambiguo → **no corrige ningún agente**: se prepara la pregunta para el humano y, con su
     respuesta, el LEAD emite el **contrato v2** y avisa a ambos.
   **Corrige quien se apartó del contrato.**

6. **Vigilar trampas** y reportarlas como hallazgos aunque todo esté en verde:
   - pruebas que pasan sin verificar nada (sin aserciones sobre lo que dice el contrato);
   - código con casos especiales que solo sirven para pasar una prueba puntual;
   - pruebas modificadas entre vueltas para que pasen sin un contrato v2 que lo justifique.

7. **Contar vueltas.** El mismo desacuerdo no se devuelve una tercera vez: se escala al humano.

8. **Construir la matriz de trazabilidad:**

   | Criterio de aceptación (HU) | Caso del contrato | Prueba | Resultado |
   |---|---|---|---|

   - Criterio sin caso o sin prueba → se señala: algo no se verificó.
   - Caso del contrato sin criterio de la HU → se señala: el negocio debe confirmar que lo quiere.

9. **Escribir el veredicto** en `informes/VEREDICTO-<HU>.md`: matriz, hallazgos de rutas,
   arbitrajes (desenlace + destinatario + vuelta N), trampas detectadas, `NO VERIFICADO` y versión
   del contrato usada.

10. **Si todo está en verde** (o los `NO VERIFICADO` fueron aceptados por el humano), el LEAD abre
    el PR con la matriz y la versión final del contrato en la descripción.

## Constraints

- No se modifica código ni pruebas para "hacer pasar" el veredicto.
- No se confía en lo que dicen los informes: se verifica.
- El LEAD no decide lo que el contrato no dice: lo escala.
- No se publica nada (ni push a main, ni merge).
