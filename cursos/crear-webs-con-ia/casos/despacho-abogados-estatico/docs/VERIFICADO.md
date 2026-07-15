# Registro de verificación

- **Fecha:** 2026-07-15
- **Sistema:** macOS
- **Runtime mínimo:** Node.js 20
- **Dependencias externas:** ninguna
- **Comando automático:** `npm test`
- **Resultado automático:** 5 páginas, enlaces locales, formulario, metadata y límites editoriales verificados
- **Verificación del repositorio:** `npm run verificar`, correcta
- **Revisión móvil 390 × 844:** cinco páginas, sin desbordamiento horizontal y con un único `h1`
- **Revisión escritorio 1440 × 900:** cinco páginas, sin desbordamiento horizontal y con un único `h1`
- **Teclado y foco:** controles nativos en orden de documento y foco visible comprobado en el formulario
- **Formulario válido:** resumen local y enlace `mailto:` preparados sin cambiar de página
- **Formulario incompleto:** cinco controles inválidos y resumen oculto
- **Minimización:** cero `textarea`, cero controles de archivo y cero mecanismos de persistencia o transmisión

La apertura de una aplicación de correo no se completó para evitar cualquier envío accidental. JavaScript desactivado se cubre estructuralmente —contenido, navegación y contacto alternativo están en HTML—, pero no se registró como prueba manual independiente.
