# WF-07 — Pagar el pedido con Stripe (E-commerce de Florería)

## HU de origen
`floreria-ecommerce/docs/historias-usuario/HU-07-floreria-pagar-con-stripe.md` *(el PM movió esta HU a la carpeta propia del proyecto — ver WF-05 para el detalle de la corrección.)* **Acotada al paso de pago en sí**, igual que la HU — no incluye login/invitado ni cómo se llega hasta acá (D6 sigue abierto).

## Proyecto Stitch
Florería — E-commerce (Portal Cliente) — `projects/9489403432676365752`
Design system: "Floreria E-commerce — Sistema Base" — `assets/10525452681741601693`

## ⚠️ Desviación detectada a corregir antes de handoff a desarrollo
La pantalla generada en Stitch incluyó, por iniciativa propia de la herramienta (no lo pedí en el prompt), un indicador de progreso **"PASO 3 DE 3 • PAGO SEGURO"** en el encabezado. Esto implica una estructura de checkout de 3 pasos que **no está confirmada** — el checkout completo de punta a punta sigue bloqueado por D6 (Punto Abierto 6). No elegí esa lectura ni la valido como decisión de alcance: **hay que quitar o genericizar ese indicador** antes de usar este wireframe como referencia de desarrollo, para no sugerir una arquitectura de checkout de 3 pasos que nadie confirmó. Mismo caso en `WF-08-floreria-seleccionar-direccion-mapa.md` ("PASO 2 DE 3").

## Pantallas / estados

### Pantalla 1 — Pago
- **Stitch:** "Pago — Florería Botánica" — `projects/9489403432676365752/screens/8c672d2cafd248f79327accf9ef4e4b8`
- **Escenario Gherkin cubierto:** Criterio de Aceptación #1 (el cliente ingresa datos de pago con Stripe → el sistema procesa el cobro).
- **Campos/controles:** resumen de monto único (sin desglose de impuestos/envío — no definidos), formulario Stripe Elements (número de tarjeta, vencimiento, CVC) con etiquetas accesibles, botón "Pagar".
- **Fuera de alcance respetado:** sin selector de otro método de pago, sin campos de facturación/impuestos, sin cupones, sin pasos anteriores del checkout.

### Pantalla 1 — Pago (estado: rechazado)
- **Stitch:** "Pago Rechazado — Florería Botánica" — `projects/9489403432676365752/screens/5ee97e3ac5af4f75be9997101ed0440e`
- **Escenario Gherkin cubierto:** Criterio de Aceptación #3 (pago rechazado → se informa el motivo y se permite reintentar sin perder los datos ya ingresados).
- **Diferencia vs. estado base:** los campos conservan los valores ya ingresados, aparece un aviso de error accesible (no solo color rojo) con motivo genérico, botón cambia a "Reintentar pago".

### Pantalla 2 — Comprobante de pago
- **Stitch:** "Comprobante de Pago — Florería Botánica" — `projects/9489403432676365752/screens/87098d40ccad4751ba6304cdf9c6906a`
- **Escenario Gherkin cubierto:** Criterio de Aceptación #2 (pago exitoso → el sistema registra el pedido como pagado y genera un comprobante).
- **Campos/controles:** confirmación de pago, monto pagado, identificador de comprobante, botón "Volver al inicio".
- **Fuera de alcance respetado:** sin detalle de producto, fecha/hora ni dirección — esta pantalla es del paso de pago, no un resumen completo del pedido (eso requeriría el checkout completo, no autorizado).

## Requisito de construcción transversal (no es un estado visual separado)
- **Criterio de Aceptación #4 / Punto Abierto 30:** los componentes Stripe Elements deben integrarse sin romper su accesibilidad por defecto (foco, asociación label-error) en las tres pantallas de esta ficha. Esto es una instrucción para quien construya el componente real, no algo que un wireframe estático pueda demostrar por sí solo — lo dejo documentado explícitamente para que no se pierda en el handoff a desarrollo.

## Escenarios no representables en esta iteración
- Ninguno de los 4 AC de HU-07 queda sin representar — todos tienen pantalla, estado, o nota de construcción explícita.

## Resumen de exclusiones aplicadas
- Sin checkout completo de punta a punta (login/invitado, dirección, fecha) — no autorizado, depende de D6.
- Sin reembolsos ni manejo de comisión de Stripe — Puntos Abiertos 26 y 12, no cubiertos por esta HU.
