# PRD — E-commerce de Florería — Desafío v2 (UX)

> Revisión del Agente UX sobre `floreria-ecommerce/PRD.md` Ronda 2 (Síntesis con brief real). No se diseña ninguna pantalla, wireframe ni journey en este documento — es análisis previo a la Convergencia final. Referencio Puntos Abiertos y Decisiones Prioritarias (D0–D6) por número, sin repetirlos.
>
> Encargo del PM: identificar (A) qué journeys ya se pueden bocetar sin adivinar nada, dado que D0 (web), D1 (sin actor Destinatario), D2 (tienda única) y D5 (Stripe) quedaron resueltos y D3 (zonas/fechas) parcialmente; (B) qué journeys siguen bloqueados por D4 (inventario), D6 (registro vs. invitado) o el Punto Abierto 1 (contradicción de "personalización de pedidos"); y (C) hallazgos nuevos de usabilidad/accesibilidad que surgen ahora que el mecanismo de mapa + Stripe está confirmado (no existían en la Ronda 1 porque esos mecanismos no estaban decididos).

---

## A. Journeys que ya se pueden bocetar sin adivinar nada

| ID | Journey | Por qué ya es seguro bocetarlo | Decisiones que lo habilitan |
|---|---|---|---|
| R2-J1 | Catálogo: listado de productos + ficha de producto, **sin** los controles de personalización | "Consulta del catálogo" y "verificación de disponibilidad" están confirmados en Incluye (3.1 #1–2) y no dependen de si el producto es fijo o configurable — eso solo afecta a un bloque específico (el de "personalizar"), que puedo dejar como marcador de posición hasta que se resuelva el Punto Abierto 1. El resto de la ficha (foto, descripción, precio, estado de disponibilidad) es bocetable ya. | D0, Incluye 3.1 #1–2 |
| R2-J2 | Indicador de disponibilidad en catálogo/ficha (estado binario "disponible" / "no disponible") | El Criterio de Éxito #3 exige "disponibilidad confiable" como requisito visible al cliente; el *mecanismo* interno (por flor o por producto terminado, D4) no cambia cómo se muestra el estado al cliente — solo afectaría a mensajes más granulares ("quedan 2 unidades"), que **no** boceto todavía por depender de D4. | Criterio de éxito #3, Incluye 3.1 #2 |
| R2-J3 | Paso de checkout: selección de fecha/hora de entrega + mapa de dirección, como **patrón de interacción** | D3 confirma que el mecanismo existe (mapa para dirección + verificación de fechas/horarios). Puedo bocetar el componente (mapa + selector de fecha/hora + estado "fuera de cobertura") sin tener todavía la lista exacta de zonas — el contenido de cobertura (Punto Abierto 14) es un dato a cargar después, no una decisión de estructura de pantalla. | D3 (parcial), Punto Abierto 16, 19 |
| R2-J4 | Paso de checkout: pago con Stripe | D5 confirma la pasarela. El paso de pago en sí (formulario/Elements de Stripe, resumen de monto, confirmación) es bocetable siguiendo el patrón estándar de Stripe, **independientemente** de si antes hay login obligatorio o checkout de invitado (eso es un paso anterior, no este). | D5 |
| R2-J5 | Confirmación/comprobante de pedido post-pago | Combina únicamente elementos ya confirmados: producto elegido (sin personalización, si aplica), fecha/hora, dirección del mapa, resultado del pago Stripe. No depende de D4 ni D6. | D0, D3 (parcial), D5 |
| R2-J6 | Estructura base del panel de Administrador (navegación: catálogo, disponibilidad, pedidos) | D2 (tienda única) está resuelto, y el brief interpreta "Administrador" como rol único (Punto Abierto de Actores, sección 2) — aunque ese sub-punto sigue abierto para confirmación, no bloquea un boceto de *navegación* de alto nivel con tres secciones. Lo que **no** boceto todavía son las pantallas de gestión de inventario (depende de D4) ni de configuración de personalización (depende del Punto Abierto 1). | D2, Criterio de éxito #5 |

**Nota:** R2-J1 a R2-J6 son bocetables como *estructura y patrón de interacción*, no como diseño final — cualquier paso marcado arriba como "sin los controles de personalización" o "sin la lista de zonas" queda con un placeholder explícito hasta que se resuelva su punto abierto correspondiente, siguiendo el principio de mi playbook de no inventar contenido de negocio no confirmado.

## B. Journeys que siguen bloqueados

| ID | Journey | Bloqueado por | Detalle |
|---|---|---|---|
| R2-B1 | Paso de "personalizar pedido" (contenido y estructura del control) | Punto Abierto 1 | Sigue siendo la misma disyuntiva de Ronda 1 (J1): si "personalizar" significa elegir entre opciones predefinidas (tamaño/color/mensaje) o un configurador flor por flor, son dos arquitecturas distintas. La contradicción textual del brief lo deja indefinido; no elijo ninguna lectura por mi cuenta. |
| R2-B2 | Estructura de entrada al checkout (login/registro obligatorio vs. formulario de invitado) | D6 | Determina si existe una pantalla de autenticación antes del checkout, y si el carrito persiste entre sesiones. El paso de pago (R2-J4) es bocetable en sí mismo, pero **qué hay antes de él** no lo es. |
| R2-B3 | Mensajería granular de stock ("quedan pocas unidades", "agotado hasta tal fecha") y flujo de sustitución de flores ante faltante | D4, Punto Abierto 23 | El estado binario disponible/no disponible (R2-J2) sí es bocetable; cualquier detalle más fino sobre el *motivo* o *alternativa* ante falta de stock no lo es. |
| R2-B4 | Flujo de add-ons (chocolates, peluches, tarjetas, etc.) | Punto Abierto 8, ligado al Punto Abierto 1 | No está confirmado si existen como ítems propios o si el brief los considera parte de "personalizar pedidos" — mismo bloqueo de fondo que R2-B1. |
| R2-B5 | Contenido real de la validación de zona de cobertura (qué ciudades/zonas, qué mensaje exacto se muestra fuera de cobertura) | Punto Abierto 14 | El *patrón* de validación temprana sí es bocetable (R2-J3); el contenido (límites geográficos reales) no. |
| R2-B6 | Alternativa de retiro en tienda (pickup) como paso del checkout | Punto Abierto 15 | El brief no confirma ni descarta pickup explícitamente (no aparece ni en "Incluye" ni en "No incluye"). Por la regla de la propia Ronda 2 ("el silencio del brief no se interpreta como 'no aplica'"), no asumo que el checkout es delivery-only. |
| R2-B7 | Autogestión de cancelación/reembolso | Puntos Abiertos 25–26 | Sin cambios respecto a Ronda 1 (J5); el brief no lo menciona. |
| R2-B8 | Pantallas de gestión de inventario y de configuración de personalización dentro del panel Administrador | D4, Punto Abierto 1 | La navegación base del panel sí es bocetable (R2-J6); el contenido de estas dos secciones específicas no. |
| R2-B9 | Notificaciones al cliente (eventos y canal) | Punto Abierto 27 | Sin cambios respecto a Ronda 1; el Criterio de Éxito #5 habla de gestión desde el sistema, no de notificaciones al cliente. |

## C. Hallazgos nuevos de usabilidad/accesibilidad (surgen recién ahora que mapa + Stripe están confirmados)

| ID | Descripción | Puntos relacionados | Clasificación (PM) |
|---|---|---|---|
| UR2-1 | Un mapa interactivo como **único** medio para indicar la dirección de entrega es un riesgo de accesibilidad conocido: no es operable solo con teclado y es difícil de usar con lector de pantalla (arrastrar/hacer clic en un pin). Recomiendo que el boceto de R2-J3 incluya, desde ya, un campo de texto/autocompletado de dirección como alternativa equivalente al mapa, no el mapa como único input. | D3, Punto Abierto 14 | |
| UR2-2 | Los componentes de pago de Stripe (Elements/Checkout) son accesibles por defecto, pero pierden esa garantía si se les aplica estilo/maquetación propia alrededor sin cuidar la asociación label-error. Lo marco como requisito de construcción a futuro (línea base, no depende de ninguna decisión pendiente), en la misma línea que U7 de la Ronda 1. | D5, Punto Abierto 7 | |
| UR2-3 | El Criterio de Éxito #2 ("compra autónoma en menos de 5 minutos") es una restricción de diseño concreta para el checkout: cada paso adicional (p. ej. un registro obligatorio antes de pagar) compite directamente contra esta métrica. No es mi decisión resolver D6, pero sí señalo que la respuesta a D6 debería evaluarse también contra este criterio de éxito, no solo como preferencia de negocio. | D6, Criterio de éxito #2 | |
| UR2-4 | Con el mecanismo de fecha/hora ya confirmado (D3), el hallazgo U2 de la Ronda 1 (el selector debe comunicar *por qué* un horario no está disponible, no solo mostrarlo deshabilitado) deja de ser una advertencia teórica y pasa a ser un requisito accionable para R2-J3. Lo reconfirmo explícitamente para que quede classificado en esta ronda. | Punto Abierto 19, U2 (Ronda 1) | |
| UR2-5 | El Criterio de Éxito #3 ("disponibilidad confiable") crea una condición de carrera visible al usuario si dos clientes intentan comprar el mismo producto/horario a la vez y el inventario (D4) no la resuelve a tiempo. Recomiendo reservar, desde el boceto de R2-J2/R2-J5, un estado explícito de "ya no disponible" detectado en el momento de confirmar — mismo patrón ya usado en el proyecto Clínica Salud Total (estado de horario ocupado) — en vez de asumir que la disponibilidad mostrada en catálogo sigue siendo válida hasta el pago. | D4, Criterio de éxito #3 | |

---

## Resumen para el PM

- **6 journeys ya bocetables** (sección A) como estructura/patrón, con placeholders explícitos donde el contenido aún depende de un punto abierto (personalización, zonas exactas, inventario).
- **9 journeys que siguen bloqueados** (sección B) — la mayoría por D4, D6 o el Punto Abierto 1, más dos sin cambios desde Ronda 1 (cancelaciones/reembolsos, notificaciones) y uno nuevo por silencio del brief (pickup, R2-B6).
- **5 hallazgos nuevos de usabilidad/accesibilidad** (sección C), ninguno bloqueante para empezar a bocetar — UR2-1 y UR2-2 son requisitos de construcción del patrón mapa/Stripe, UR2-3 es un insumo para tu decisión de D6 (no una objeción a ella), y UR2-4/UR2-5 son reconfirmaciones accionables de hallazgos ya aceptados en Ronda 1.

No diseñé ninguna pantalla. Cuando confirmes esta clasificación (y, si corresponde, el negocio resuelve D4/D6/Punto Abierto 1), puedo empezar por los journeys de la sección A sin necesidad de esperar al resto.

---

## Clasificación del PM (Convergencia Ronda 2)

| ID | Clasificación | Resolución |
|---|---|---|
| UR2-1 | ACCEPT | Incorporado como requisito de diseño obligatorio: el mapa de dirección debe tener un campo de texto/autocompletado como alternativa accesible, no ser el único input. |
| UR2-2 | ACCEPT | Incorporado como línea base de construcción (junto a U7, Ronda 1): no romper la accesibilidad por defecto de Stripe Elements al maquetar. |
| UR2-3 | ACCEPT | Nota cruzada agregada bajo D6 en `PRD.md` (mismo insumo que F4 de BA) — no resuelve D6, se muestra al negocio junto con la pregunta. |
| UR2-4 | ACCEPT | Reconfirmado — U2 (Ronda 1) pasa de advertencia teórica a requisito accionable para el boceto de fecha/hora. |
| UR2-5 | ACCEPT | Nuevo Punto Abierto/requisito en `PRD.md`: reservar un estado explícito de "ya no disponible" al momento de confirmar el pago, no asumir que la disponibilidad de catálogo sigue vigente hasta el pago. |

**Autorización de trabajo (Convergencia):** UX queda autorizado a bocetar los journeys R2-J1 a R2-J6 (sección A) como estructura/patrón con placeholders explícitos donde el contenido dependa de un punto abierto — en paralelo a las HU parciales que el BA redactará para las mismas necesidades. Los journeys de la sección B permanecen bloqueados sin cambios.
