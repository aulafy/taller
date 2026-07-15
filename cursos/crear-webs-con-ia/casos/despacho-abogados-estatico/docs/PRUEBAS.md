# Pruebas del caso

## Automáticas

Desde la carpeta del ejemplo:

```bash
npm test
```

El verificador comprueba archivos, idioma, viewport, jerarquía, aviso ficticio, navegación, rutas locales, formulario mínimo, ausencia de campos sensibles, comportamiento local, JSON-LD, sitemap y límites editoriales.

## Manuales

| Ruta | Entorno | Acción | Resultado esperado |
|---|---|---|---|
| `/` | 390 × 844 | Leer propuesta y abrir Áreas | Mensaje y acción claros; navegación sin desbordamiento |
| `/areas.html` | 320 px y zoom 200 % | Recorrer las tres áreas | Texto completo y sin scroll horizontal |
| `/proceso.html` | Solo teclado | Recorrer pasos y enlaces | Orden lógico y foco siempre visible |
| `/contacto.html` | Solo teclado | Completar los campos | Etiquetas, ayuda y consentimiento accesibles |
| `/contacto.html` | Formulario válido | Pulsar «Preparar correo» | Aparece un resumen; nada se envía automáticamente |
| `/contacto.html` | Formulario incompleto | Intentar continuar | El navegador señala el primer campo inválido |
| `/privacidad.html` | Cualquier tamaño | Leer tratamiento | Explica que la web no almacena ni recibe datos |
| Todas | 1440 × 900 | Navegar y volver | Cabecera, contenido, página actual y pie coherentes |

## Casos negativos

- Intentar describir el caso: no existe campo para hacerlo.
- Intentar adjuntar documentos: no existe control de archivo.
- JavaScript desactivado: el correo y el teléfono ficticios siguen visibles; solo se pierde la preparación automática.
- Sin aplicación de correo: el resumen permanece visible y se puede copiar.
- Movimiento reducido activo: las transiciones no deben ser necesarias para entender la interfaz.

## Evidencia

Registra fecha, navegador, viewport, ruta, acción y resultado. Usa únicamente datos sintéticos en formularios y capturas.

## Limpieza

No se escriben datos ni archivos. Cierra cualquier borrador de correo sin enviarlo y detén el servidor con `Ctrl+C`.
