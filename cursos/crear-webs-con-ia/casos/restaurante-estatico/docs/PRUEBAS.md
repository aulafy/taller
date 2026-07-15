# Pruebas del caso

## Automáticas

Desde la carpeta del ejemplo:

```bash
npm test
```

El verificador comprueba archivos, idioma, viewport, `h1`, enlace de salto, navegación, rutas locales, etiquetas del formulario, límites editoriales, JSON-LD y sitemap.

## Manuales

| Ruta | Entorno | Acción | Resultado esperado |
|---|---|---|---|
| `/` | 390 × 844 | Leer hero y abrir Carta | Oferta y acción visibles; navegación correcta |
| `/carta.html` | 320 px y zoom 200 % | Recorrer categorías | Sin scroll horizontal; platos completos |
| `/visita.html` | Solo teclado | Tabular y rellenar solicitud | Foco visible y orden lógico |
| `/visita.html` | Formulario válido | Pulsar «Preparar solicitud» | Aparece resumen y enlace; no se envía nada |
| `/visita.html` | Formulario incompleto | Enviar | El navegador identifica el campo inválido |
| `/privacidad.html` | Cualquier tamaño | Leer tratamiento | Explica límites del prototipo y del correo |
| Todas | 1440 × 900 | Navegar y volver | Cabecera, contenido y pie coherentes |

## Casos negativos

- Fecha anterior a hoy: debe ser rechazada por el control de fecha.
- Más de ocho personas: el selector no lo permite.
- Mensaje largo: limitado a 500 caracteres y contador visible.
- JavaScript desactivado: contenido, teléfono, correo y navegación siguen disponibles; solo se pierde la preparación automática.
- Sin aplicación de correo: el resumen permanece visible para copiarlo manualmente.

## Evidencia

Registra fecha, navegador, viewport, ruta y resultado. No uses nombres, correos o mensajes reales en capturas.

## Limpieza

No se escriben datos ni archivos. Cierra cualquier ventana de correo sin enviar y detén el servidor con `Ctrl+C`.
