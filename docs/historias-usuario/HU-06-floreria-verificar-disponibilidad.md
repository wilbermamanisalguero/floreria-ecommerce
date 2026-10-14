# HU-06 — Verificar disponibilidad de producto y fecha/hora de entrega (E-commerce de Florería)

> Proyecto: `floreria-ecommerce/` (E-commerce de Florería). Handoff parcial autorizado por el PM en `floreria-ecommerce/PRD.md`, sección 8 (Ronda 2 — Convergencia). Claridad formal 100%, pero con AC no verificable declarado explícitamente abajo por instrucción del PM.

## Historia de Usuario
Como cliente de la florería,
quiero verificar la disponibilidad de un producto y de fechas/horarios de entrega,
para saber si puedo comprarlo y cuándo lo recibiré antes de pagar.

## Origen en el PRD
- Problema: "El cliente no siempre tiene certeza de que el arreglo elegido esté disponible ni puede gestionar fácilmente todo el proceso..." — cita textual explícita (`PRD.md`, sección 1).
- Objetivo (implícito): eliminar la incertidumbre de disponibilidad sin tener que llamar/preguntar.
- Alcance: "Incluye" ítems 2 y 3, "Verificación de disponibilidad de productos" y "Verificación de fechas y horarios de entrega" (sección 3.1).
- Criterio de Éxito relacionado: Criterio 3, "disponibilidad de catálogo confiable" (sección 4) — ver nota de ambigüedad abajo.

## Índice de claridad
100% (Problema: sí | Objetivo: sí | Alcance: sí | Criterio de Éxito: sí)

## Criterios de Aceptación
1. Dado un producto en el catálogo, cuando el cliente lo consulta, entonces el sistema indica si está disponible o no.
2. Dado que el cliente quiere programar la entrega, cuando consulta fechas/horarios, entonces el sistema muestra las fechas/horarios disponibles para entrega.
3. Dado un producto o fecha/horario no disponible, cuando el cliente intenta seleccionarlo, entonces el sistema lo bloquea o lo marca claramente como no disponible, comunicando el motivo cuando sea posible (accesible para lector de pantalla, no solo deshabilitado visualmente — Punto Abierto 19).
4. **AC no verificable todavía:** dado que el sistema muestra un producto como disponible, cuando el stock real cambia (p. ej. otro cliente lo compra primero), entonces el sistema no debe permitir sobreventa. No se puede redactar este criterio de forma verificable ni implementarlo hasta que se resuelva D4 (modelo de inventario) — ver Notas/Puntos abiertos.

## Reglas de negocio / Restricciones
- "Disponibilidad de catálogo confiable" es Criterio de Éxito oficial (#3) del PRD — su interpretación exacta (stock real / estabilidad del sitio / ambas) no está confirmada por el negocio todavía.

## Fuera de alcance (explícito)
- Cobertura geográfica exacta de zonas de entrega — Punto Abierto 14, no confirmada.
- Ventana de corte ("cutoff") para pedidos de mismo día — Punto Abierto 17.
- Límite de capacidad de pedidos por día en fechas pico — Punto Abierto 18.
- Sustitución de flores ante faltante — Punto Abierto 23, no cubierta aquí.

## Supuestos aplicados
- Ninguno propio del BA.

## Notas / Puntos abiertos
- **AC 4 no verificable:** depende de D4 — modelo de inventario (Punto Abierto 20, sigue ABIERTO en `PRD.md` sección 6): ¿por flor/insumo o por producto terminado? ¿control en tiempo real? También depende del momento de reserva de stock (Punto Abierto 21) y de la condición de carrera al confirmar el pago (Punto Abierto 22b).
- Falta confirmar con el negocio si "disponibilidad confiable" (Criterio de Éxito 3) se refiere a stock real, a estabilidad/uptime del sitio, o a ambas — Punto Abierto nuevo agregado en `PRD.md` sección 4 (hallazgo BA-F1).
- Cobertura geográfica exacta (Punto Abierto 14) pendiente — puede afectar qué fechas/horarios se muestran por zona.

## Prioridad sugerida
Alta — Criterio de Éxito oficial (#3) y resuelve directamente el dolor citado en el Problema. Aun así, no se puede declarar "lista para desarrollo" sin resolver D4 para el AC 4.
