# PRD — E-commerce de Florería — Iteración 2: Desafío (UX)

> Revisión del Agente UX sobre `floreria-ecommerce/PRD.md` (Iteración 1 — Síntesis) y `floreria-ecommerce/PRD-desafio-ba.md` (Iteración 2 — Desafío BA). No se diseña ninguna pantalla, wireframe ni journey en este documento: el PRD sigue en borrador, Alcance y Criterios de Éxito siguen vacíos, y ningún punto listado aquí se resuelve por criterio propio de UX. El PM clasifica cada ítem como **ACCEPT / REJECT / OPEN POINT / ESCALATE** antes de la convergencia (Iteración 3).
>
> Nota de método: no repito los 18 Puntos Abiertos de la Iteración 1 ni las tablas A–E del desafío BA — los referencio por número/ID. Me enfoco en tres cosas que ni el checklist original ni el desafío BA cubren desde el ángulo de diseño: (A) problemas de usabilidad/accesibilidad previsibles en este dominio, con independencia de cómo se resuelvan los puntos abiertos; (B) journeys/flujos que literalmente no se pueden diseñar hasta que ciertas decisiones existan; (C) riesgos de scope creep específicos de diseño (features de UI que un patrón de e-commerce "trae puestas" pero que nadie pidió aquí).

---

## A. Problemas de usabilidad/accesibilidad previsibles

Estos riesgos son inherentes al dominio (florería + regalo + entrega programada) y aparecerían **casi sin importar cómo se resuelvan los puntos abiertos** — conviene que el negocio los tenga en el radar desde ya, no solo al momento de construir.

| ID | Descripción | Puntos relacionados | Clasificación (PM) |
|---|---|---|---|
| U1 | El catálogo de un e-commerce de flores depende casi por completo de fotografía del producto. Si el único medio de describir un ramo/arreglo es la imagen, el catálogo queda inaccesible para compradores con discapacidad visual (sin alternativa textual equivalente a "12 rosas rojas con follaje verde y papel kraft"). Se agrava si el negocio confirma sustitución de flores (Punto 11): una foto fija se vuelve engañosa si el contenido real puede variar. | 1, 11 | |
| U2 | Los selectores de fecha/hora de entrega son uno de los componentes más difíciles de hacer accesibles (navegación por teclado, lectura de fechas bloqueadas por lector de pantalla). Si además existen fechas pico con reglas distintas (Punto 9, BA-B3) o ventana de corte diaria (BA-B2), el picker necesita comunicar *por qué* una fecha/horario no está disponible, no solo mostrarla deshabilitada — un patrón "solo color/opacidad" no es accesible ni suficiente. | 9, BA-B2, BA-B3 | |
| U3 | Si existen datos separados de comprador y destinatario (Punto 6), un formulario con dos bloques de nombre/teléfono/dirección es un patrón de alto riesgo de confusión — tanto de usabilidad (¿de quién es este campo?) como de accesibilidad (agrupación de campos con `fieldset`/`legend` o equivalente, no solo con espaciado visual). | 6, Actor 1 | |
| U4 | El mensaje de regalo (Punto 7) típicamente necesita límite de caracteres visible en tiempo real (contador), no solo validación al enviar — y ese contador debe ser anunciable por lector de pantalla (`aria-live` o equivalente), no solo un número que cambia de color. | 7 | |
| U5 | Si el negocio confirma sustitución automática de flores (Punto 11) como práctica estándar del rubro (BA-B1), el patrón usual de la industria es un aviso en letra pequeña dentro del checkout — un anti-patrón de usabilidad conocido (consentimiento "escondido"). Si se confirma esta política, debería exigirse como un aviso visible y explícito en el flujo, no como texto legal enterrado. | 11, BA-B1 | |
| U6 | Detectar que una dirección está fuera de zona de cobertura solo al final del checkout (BA-C1) es, además de un problema de negocio, un problema de usabilidad conocido: el comprador pierde el trabajo de todo el formulario. Si se confirma que existen zonas de cobertura (Punto 9), la validación debería poder ocurrir temprano (p. ej. antes de armar el carrito), no solo al pagar. | 9, BA-C1 | |
| U7 | Formularios de pago/checkout en general requieren manejo accesible de errores (resumen de errores anunciado, asociación campo-error explícita) — esto no depende de ninguna decisión de negocio pendiente, es una línea base que debería exigirse independientemente de qué pasarela se elija (Punto 5). Lo marco explícitamente porque el checklist original no lo menciona en absoluto. | 5 | |
| U8 | Las fechas pico del rubro (San Valentín, Día de la Madre) concentran tráfico probablemente mobile y en redes más lentas. Si el diseño asume catálogo con imágenes pesadas y layout desktop-first, el riesgo de abandono en esos picos (justo las fechas de mayor venta) es alto. Es una restricción de diseño a fijar antes de construir, no un detalle a resolver al final. | 9, BA-B3 | |

## B. Journeys/flujos de diseño bloqueados por decisiones aún no tomadas

A diferencia de la sección A, estos no son "riesgos" sino **imposibilidad literal de diseñar** hasta que exista una respuesta — listo el journey afectado y qué decisión específica lo desbloquea.

| ID | Journey/flujo bloqueado | Decisión que falta | Puntos relacionados |
|---|---|---|---|
| J1 | "Armar mi pedido" (navegar catálogo → elegir producto) | Si "ramo"/"arreglo" es producto terminado (flujo de selección simple) o configurable (flujo tipo builder/wizard) son dos arquitecturas de información completamente distintas; no se puede bocetar ni una ni otra sin esta respuesta. | 1, BA-A1 |
| J2 | Checkout (número y orden de pasos) | El número de pantallas de checkout depende de al menos tres respuestas combinadas: ¿invitado o cuenta obligatoria? (Punto 4), ¿un destinatario por compra o varios en un mismo carrito? (Punto 3), ¿datos de comprador y destinatario separados? (Punto 6). Cualquier boceto hecho antes de tener las tres es descartable. | 3, 4, 6, BA-A2 |
| J3 | Selección de fecha/hora y modalidad de entrega | Depende de zonas y fechas de entrega (Punto 9), de si existe ventana de corte (BA-B2) y de si delivery/pickup se decide por producto o por zona (BA-A3). No se puede diseñar el componente de agenda sin saber qué reglas debe expresar. | 8, 9, BA-A3, BA-B2 |
| J4 | Momento y forma en que el comprador se entera de una sustitución de flores | Si la sustitución es automática y silenciosa, es un aviso post-compra (o ninguno); si requiere confirmación del comprador, es un paso más en el flujo (posiblemente asíncrono, después del pago). Son dos journeys distintos, no una variación de estilo. | 11, BA-A4 |
| J5 | Autogestión de cancelación/reembolso | Si el negocio permite cancelar/reembolsar dentro de una ventana de tiempo vía self-service, es una pantalla del comprador; si todo pasa por atención al cliente (teléfono/WhatsApp/email), no hay pantalla que diseñar del lado del comprador para esto. No se puede saber cuál de las dos hasta resolver Puntos 13–14. | 13, 14 |
| J6 | Cualquier pantalla del panel de administración | La estructura de navegación de un panel admin depende enteramente del modelo de roles (Actor 3) y de si el negocio opera un local o varios (Actor 4). Diseñar "una pantalla de administración genérica" ahora sería adivinar una arquitectura de información que probablemente haya que rehacer. | Actor 3, Actor 4, Punto 16, BA-D2 |
| J7 | Cualquier journey o notificación dirigida al "Destinatario" | Todavía no está confirmado que el Destinatario sea un actor del sistema (con vista propia, notificación propia, o posibilidad de reprogramar) en vez de un simple dato de dirección dentro del pedido del comprador. Este es el mismo nodo raíz que ya señaló BA (D1); lo repito aquí porque desde UX bloquea, en concreto, si existe o no una interfaz dirigida a esa persona. | Actor 1, 6, 7, 15, BA-D1 |

**Nota de secuenciación:** los journeys J1–J7 confirman, desde el ángulo de diseño, la misma recomendación de BA (sección D de `PRD-desafio-ba.md`): resolver primero el modelo de catálogo (Punto 1), la existencia del actor Destinatario (Actor 1), el modelo de tienda única/múltiple (Actor 4) y las zonas/fechas de entrega (Punto 9) desbloquea la mayoría de estos journeys a la vez.

## C. Riesgos de scope creep de diseño

Estos son patrones de UI que un e-commerce "trae puestos" por defecto en cualquier plantilla o benchmark del rubro, pero que **nadie pidió** en el checklist original ni en el PRD. El riesgo no es que estén mal, sino que se diseñen por inercia antes de que el negocio los apruebe explícitamente, generando trabajo descartable o alcance no autorizado.

| ID | Descripción | Riesgo si se diseña sin aprobación explícita |
|---|---|---|
| S1 | Configurador visual interactivo de ramo (elegir flor por flor, tipo "armá tu ramo" con preview dinámico). El checklist solo dice "ramos, arreglos, add-ons", no especifica personalización visual. | Es una inversión de diseño (y luego desarrollo) mucho mayor que un catálogo con variantes fijas; si el negocio solo quería catálogo fijo, es esfuerzo descartado. |
| S2 | Favoritos/wishlist para compradores. Patrón estándar de e-commerce, no mencionado en el checklist. | Requiere cuentas de usuario persistentes, lo cual todavía no está confirmado (Punto 4: ¿registro obligatorio o invitado?). |
| S3 | Historial de pedidos / panel de cuenta del comprador más allá de lo mínimo para rastrear un pedido puntual. | Mismo problema que S2: presupone un modelo de cuentas no confirmado. |
| S4 | Tracking en tiempo real del repartidor (mapa en vivo), patrón visto en apps de delivery de comida. | Presupone delivery propio con actor "repartidor" en el sistema (Actor 2), que el PRD deja explícitamente sin confirmar — podría ser delivery 100% tercerizado sin ningún dato de tracking en vivo disponible. |
| S5 | Reseñas/calificaciones de producto o del servicio. Común en e-commerce, no mencionado en el checklist ni en el PRD. | Trae consigo su propio flujo (moderación, quién puede reseñar, cuándo) que no tiene ninguna base en los puntos abiertos actuales. |
| S6 | Programa de fidelización/puntos con su propia pantalla de estado ("tus puntos", "tu nivel"). Ya señalado como riesgo de negocio por BA (E4); lo confirmo también como riesgo de diseño porque suele arrastrar una sección de cuenta completa. | Diseño de una sección entera sin respaldo en el checklist; alto costo de descarte si no se aprueba. |
| S7 | Selector de idioma/moneda (i18n) en el header. Sin confirmación de alcance geográfico (relacionado a Actor 4 y a zonas de entrega, Punto 9), diseñar para multi-región es adelantarse. | Complejiza cada pantalla (formatos de fecha/moneda, longitud de textos) para un alcance geográfico que podría ser una sola ciudad. |

---

## Resumen para el PM

- **8 problemas de usabilidad/accesibilidad previsibles** (sección A) — aplican casi sin importar cómo se resuelvan los puntos abiertos; algunos (U7) son línea base independiente de cualquier decisión de negocio.
- **7 journeys de diseño bloqueados** (sección B) — no es que falte definirlos, es que **no se pueden bocetar** hasta que existan las decisiones que indico en cada fila. Confirmo desde UX la misma raíz de secuenciación que ya señaló BA (catálogo, actor Destinatario, tienda única/múltiple, zonas/fechas).
- **7 riesgos de scope creep de diseño** (sección C) — funcionalidades de UI que ningún documento pidió pero que aparecen "gratis" en cualquier benchmark de e-commerce; recomiendo marcarlas explícitamente como dentro o fuera antes de que aparezcan por inercia en un boceto.

Ningún ítem fue clasificado ni resuelto por UX. No se diseñó ninguna pantalla, wireframe ni journey — el PRD sigue en `BLOCKED — OPEN PRODUCT DECISIONS REQUIRED`. Quedan a la espera de tu clasificación (ACCEPT/REJECT/OPEN POINT/ESCALATE) antes de avanzar a la Iteración 3 (Convergencia).

---

## Clasificación del PM (Iteración 3 — Convergencia)

| ID | Clasificación | Resolución |
|---|---|---|
| U1 | ACCEPT | Incorporado como guía de diseño obligatoria en `PRD.md` (descripción textual equivalente del producto), a aplicar cuando se resuelva el modelo de catálogo. |
| U2 | ACCEPT | Incorporado como guía de diseño (accesibilidad del selector de fecha/hora). |
| U3 | ACCEPT | Incorporado como guía de diseño (agrupación accesible de datos comprador/destinatario). |
| U4 | ACCEPT | Incorporado como guía de diseño (contador de caracteres accesible en mensaje de regalo). |
| U5 | ACCEPT | Incorporado como guía de diseño (aviso visible y explícito, no letra pequeña, si se confirma sustitución automática). |
| U6 | ACCEPT | Incorporado como nuevo Punto Abierto/requisito en `PRD.md` (validar zona de cobertura antes de completar el checkout). |
| U7 | ACCEPT | Incorporado como requisito no funcional de base (accesibilidad de errores en checkout), no depende de ninguna decisión pendiente. |
| U8 | ACCEPT | Incorporado como restricción de diseño (mobile-first / peso de imágenes en fechas pico). |
| J1–J7 | ACCEPT | Confirman y refuerzan las Decisiones Prioritarias/Puntos Abiertos ya incorporados en `PRD.md`; no requieren tratamiento adicional aparte de lo ya escalado (D1–D5 y canal/plataforma). |
| S1 | ACCEPT | Excluido explícitamente del alcance inicial: configurador visual interactivo de ramo. |
| S2 | ACCEPT | Excluido explícitamente: favoritos/wishlist (depende además de si hay cuentas de usuario, aún abierto). |
| S3 | ACCEPT | Excluido explícitamente: historial de pedidos/panel de cuenta avanzado. |
| S4 | ACCEPT | Excluido explícitamente: tracking en vivo del repartidor en mapa. |
| S5 | ACCEPT | Excluido explícitamente: reseñas/calificaciones. |
| S6 | ACCEPT | Mismo tratamiento que E4 (BA): excluido explícitamente, fidelización/puntos. |
| S7 | ACCEPT | Excluido explícitamente: selector de idioma/moneda (i18n). |

Ver `PRD.md` sección 3.2 (No incluye), sección 5 (Puntos Abiertos) y "Decisiones Prioritarias" para el resultado incorporado.
