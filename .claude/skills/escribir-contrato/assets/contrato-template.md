# CONTRATO — <HU-ID> <Título de la HU>

**Versión:** v1
**Estado:** Pendiente de aprobación | Aprobado (<fecha>, <quién>)
**HU:** <enlace o ruta>

---

## Paquete de contexto

| Fuente | Por qué entra |
|---|---|
| <HU-ID> | Historia y criterios de aceptación |
| TECH-DESIGN.md §<sección> | Criterios técnicos de esta HU |
| ADR-XXXX | ... |

## Interfaz observable

<Ej.: API HTTP · pantalla · comando CLI · evento>

## Comportamiento

### <Nombre del comportamiento>

**Entrada**

```text
<MÉTODO> <ruta>?<parámetros>
```

**Casos**

| Caso | Entrada | Salida esperada | Origen |
|---|---|---|---|
| Camino feliz | ... | <status> + <datos/texto> | Gherkin esc. 1 |
| ... | ... | ... | TDD §... |
| Error: ... | ... | <status> "<mensaje exacto>" | ADR-XXXX |

## Nombres que no se negocian

| Tipo | Valor exacto |
|---|---|
| Ruta | ... |
| Campo | ... |
| Mensaje | ... |

## Decisiones propuestas (no venían en la HU)

| # | Decisión | Por qué hace falta | Estado |
|---|---|---|---|
| 1 | ... | ... | Pendiente / Aprobada por <quién> |

## Fuera del contrato (decide el DEV)

- Estructura interna, nombres de funciones y módulos, consultas a la base, patrones internos
  (respetando los ADRs aplicables).

## Preguntas abiertas para el humano

1. ...

## Changelog

| Versión | Fecha | Cambio | Motivo | Aprobado por |
|---|---|---|---|---|
| v1 | | Versión inicial | | |
