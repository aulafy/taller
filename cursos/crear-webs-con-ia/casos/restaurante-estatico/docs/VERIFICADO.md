# Registro de verificación

**Estado:** verificado el 15/07/2026

El estado confirma las comprobaciones descritas aquí; no equivale a una auditoría legal, de seguridad o de conformidad WCAG.

## Entorno

- Sistema operativo: macOS Darwin 25.4.0, arm64.
- Node.js: 26.4.0.
- Navegador: navegador integrado de Codex.
- Viewports: 320 × 720, 390 × 844 y 1440 × 900.

## Comandos ejecutados

```bash
npm test
cd /ruta/a/aulafy-taller && npm run verificar
git diff --check
curl http://localhost:4173/{,carta.html,visita.html,privacidad.html,robots.txt,sitemap.xml}
```

Resultados: verificador del caso correcto, estructura del repositorio correcta, diff sin errores de espacios y respuestas HTTP esperadas. Las páginas, `robots.txt` y `sitemap.xml` devolvieron 200; una ruta inexistente devolvió 404.

## Comprobaciones manuales

- Las cuatro páginas muestran un único `h1`, destino del enlace de salto, navegación, pie y canonical.
- A 320 y 390 px no existe desbordamiento horizontal del documento. La navegación de categorías de la carta permite desplazamiento interno intencionado.
- A 1440 × 900 la portada utiliza dos columnas, conserva la navegación y no desborda.
- La carta presenta diez platos en HTML con precios y alérgenos expresados como texto.
- Se rellenó el formulario con datos sintéticos. La fecha mínima fue 15/07/2026, el contador respondió y apareció el resumen previsto.
- El enlace resultante usa `mailto:` y contiene los datos revisados; no se abrió ni se envió el correo.
- La página de privacidad lleva `noindex` y explica que el prototipo no transmite ni almacena el formulario.
- El destino `#contenido` existe en todas las páginas y es enfocable con `tabindex="-1"`; enlaces, campos y botón son controles nativos con foco visible.

## Pendientes conocidos

- No se ha realizado una auditoría con lector de pantalla real.
- No se ha probado una aplicación de correo externa: hacerlo podría sacar los datos del entorno local.
- El dominio, la dirección, el teléfono y el correo son deliberadamente ficticios y deben sustituirse antes de reutilizar el proyecto.
