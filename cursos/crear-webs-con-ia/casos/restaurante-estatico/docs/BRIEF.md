# Brief verificable: Lumbre y Oliva

## Estado

Proyecto educativo. Negocio y datos completamente ficticios.

## Persona y problema

Una persona adulta está eligiendo un restaurante desde el móvil. Necesita comprobar tipo de cocina, carta, precios, alérgenos orientativos, horario, ubicación y forma de solicitar reserva.

## Resultado de la versión 1

La persona encuentra un plato adecuado, conoce su precio y puede preparar una solicitud de reserva en menos de 90 segundos, sin descargar archivos ni crear una cuenta.

## Incluido

- Inicio con propuesta, acciones y resumen de cocina.
- Carta HTML separada por categorías.
- Precios sintéticos con IVA indicado como incluido.
- Leyenda de alérgenos y aviso de confirmación con el equipo.
- Horario y dirección ficticia.
- Teléfono y correo de demostración no operativos.
- Formulario local que prepara un correo y no envía datos.
- Privacidad específica del prototipo.
- Metadata, canonical, Open Graph, Restaurant JSON-LD, sitemap y robots.

## No incluido

- Confirmación o disponibilidad de mesa.
- Base de datos, panel, autenticación o pago.
- Cookies, analítica, publicidad o chat.
- Opiniones, premios, fotografías o afirmaciones de clientes.
- Gestión real de alérgenos o consejo sanitario.

## Restricciones

- Sin dependencias ni llamadas de red para presentar la interfaz.
- Móvil primero desde 320 px.
- Utilizable con teclado y zoom al 200 %.
- No usar solo color para estados o alérgenos.
- El formulario debe indicar antes de rellenar que no envía automáticamente.

## Criterios de aceptación

- [x] Todas las páginas identifican el negocio como ficticio.
- [x] La navegación usa controles nativos, orden lógico y foco visible.
- [x] No existe desplazamiento horizontal a 320 o 390 px.
- [x] La carta es HTML y cada plato muestra nombre, descripción y precio.
- [x] Los alérgenos usan texto, no solo iconos.
- [x] Horarios, dirección y contactos son consistentes en todas las páginas.
- [x] La solicitud no promete disponibilidad y no se envía automáticamente.
- [x] Los campos tienen etiquetas, ayuda y errores nativos.
- [x] Los enlaces locales existen y las páginas tienen un único `h1`.
- [x] `npm test` termina correctamente.

## Fuentes oficiales

- [W3C WAI: estructura de páginas](https://www.w3.org/WAI/tutorials/page-structure/)
- [W3C WAI: formularios](https://www.w3.org/WAI/tutorials/forms/)
- [Google Search: datos estructurados de negocio local](https://developers.google.com/search/docs/appearance/structured-data/local-business)
- [Schema.org: Restaurant](https://schema.org/Restaurant)
