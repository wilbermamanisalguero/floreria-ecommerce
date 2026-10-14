# ADR-06 — Acceso del cliente al checkout: registro obligatorio vs. invitado (E-commerce de Florería)

> Proyecto: `floreria-ecommerce/`. ADR abierto para documentar la decisión pendiente y sus opciones; **no** autoriza implementación.

## Estado
`BLOQUEADO` — 2026-10-01 — depende de D6 (**ABIERTO** en `PRD.md` sección 6).

## Origen / Trazabilidad
- PRD sección 6: D6 *"¿Registro obligatorio o invitado?"* — **ABIERTO** (PA 6).
- PRD sección 4, Criterio de Éxito 2: *"compras autónomas en menos de 5 minutos"*.
- PRD sección 8: el checkout de punta a punta **no** está autorizado; HU-07 queda acotada al paso de pago.
- Hallazgos BA-F4 y UX-UR2-3 (`PRD-desafio-ba-v2.md`, `PRD-desafio-ux-v2.md`).
- WF-07 / WF-08: desviación "PASO N DE 3" no confirmada.

## Contexto
Esta decisión define si existe una pantalla de autenticación antes del checkout, si el carrito persiste entre sesiones y cuántos pasos tiene el checkout (UX R2-B2). El PM indicó que, al consultar al negocio, se muestre que un registro obligatorio compite contra el Criterio 2.

## Decisión
**Ninguna.** El paso de pago (ADR-03) es independiente de esta decisión y ya está autorizado.

## Alternativas consideradas
| Opción | Implicancias técnicas |
|---|---|
| A. Registro obligatorio | Requiere gestión de cuentas (alta, login, recuperación de contraseña); agrega fricción contra el Criterio 2. |
| B. Solo invitado | Sin cuentas; el pedido se identifica por correo/teléfono y un enlace de consulta. El Administrador no tiene historial por cliente. |
| C. Invitado + cuenta opcional | Combina ambas; mayor alcance de construcción. |

## Consecuencias
- Mientras siga `BLOQUEADO`, no se construye el flujo previo al pago ni se fija el número de pasos del checkout.
- WF-07 y WF-08 deben quitar los indicadores "PASO N DE 3".

## Recomendación (sugerencia — no es decisión)
- Desde la arquitectura, la opción **C (invitado + cuenta opcional)** es la que menos fricciona el Criterio 2 sin cerrar la puerta a cuentas. Si se elige, usar un proveedor de identidad gestionado (passwordless/enlace por correo) en lugar de construir la autenticación desde cero.
- Cualquiera sea la opción, **el `PaymentIntent` de Stripe debe asociarse al pedido, no a una cuenta de usuario**, para que ADR-03 no cambie según D6.
- Decisión de negocio requerida (D6); el PM debe escalarla.

## PENDIENTE DE DEFINICIÓN
- D6 / PA 6.
- Datos personales mínimos a capturar del Cliente — no definidos.

## Fuera de alcance
- Fidelización y suscripciones (PRD 3.2): una cuenta de usuario no habilita puntos ni compras recurrentes.
