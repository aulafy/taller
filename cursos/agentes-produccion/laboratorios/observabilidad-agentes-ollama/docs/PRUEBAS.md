# Pruebas del laboratorio

## Automática sin red

```bash
python scripts/verificar.py
```

Comprueba que existen todos los documentos obligatorios, que el código mantiene los cuatro tipos de observación, que propaga atributos y que no faltan variables de entorno. No instala dependencias ni envía información a Langfuse.

## Manual con servicios locales o Cloud de laboratorio

| Paso | Acción | Resultado esperado |
|---|---|---|
| 1 | Ejecutar `ollama list` | Aparece el modelo configurado en `.env`. |
| 2 | Ejecutar `python src/app.py` | La consola devuelve una respuesta fundada en la política sintética. |
| 3 | Abrir Langfuse | Existe una traza `resolver-consulta-soporte`. |
| 4 | Expandir la traza | Contiene `recuperar-fuentes`, `consultar-estado-pedido` y `generar-respuesta`. |
| 5 | Revisar recuperación | Solo muestra ID, versión, sección, extracto y puntuación de datos sintéticos. |
| 6 | Revisar atributos | Incluye `laboratorio`, `prompt_version=v1` y un alias no personal de usuario. |
| 7 | Buscar respuesta | Se fundamenta en `politica-devoluciones-v3`; no inventa plazo diferente. |

## Casos negativos

- Cambia la pregunta por una que no coincide con el JSON: debe abstenerse, no alucinar una fuente.
- Elimina `OLLAMA_MODEL` del `.env`: el script debe detenerse con un error legible antes de intentar llamar al modelo.
- Usa una clave de Langfuse incorrecta: no sustituyas la traza ausente por logs con secretos; corrige las variables y revisa la documentación del proveedor.
- Ejecuta dos veces la misma pregunta: deben aparecer dos ejecuciones distinguibles por tiempo, sin mezclar sesiones ni datos reales.

## Limpieza y evidencia

Documenta fecha, versión de Python, versión de paquetes, modelo, modo de Langfuse (Cloud/local) y resultado de cada fila. No guardes capturas que contengan claves, prompts reales o datos personales. Borra después las trazas de laboratorio si tu política lo exige.
