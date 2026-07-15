# Estándar de ejemplos de Aulafy

## Unidad mínima

Cada carpeta registrada en `catalogo.json` debe incluir:

```text
README.md
AGENTS.md
.env.example           # cuando use configuración externa
docs/
  BRIEF.md
  PRUEBAS.md
  VERIFICADO.md
```

El código puede usar la estructura adecuada para su tecnología, pero no depender de archivos situados fuera de su carpeta.

## Estados

- **borrador:** el contenido se puede inspeccionar, pero falta alguna verificación declarada.
- **verificado:** instalación limpia, pruebas y comprobaciones manuales repetidas en la fecha indicada.
- **archivado:** se conserva como referencia y no se recomienda para empezar.

## README obligatorio

Debe responder, en este orden:

1. Qué problema resuelve.
2. Qué aprenderás y qué no cubre.
3. Resultado visible esperado.
4. Requisitos y versiones.
5. Inicio rápido sin secretos.
6. Comprobación automática y manual.
7. Errores frecuentes.
8. Restauración y limpieza.
9. Relación con el curso y fuentes.

## Datos y servicios

- Los datos de demostración son sintéticos y reconocibles.
- Un laboratorio no utiliza producción.
- `.env.example` contiene nombres y descripciones, nunca valores.
- Los servicios externos deben ser opcionales o disponer de una ruta local/sandbox documentada.
- Cada ejemplo explica cómo eliminar los datos de prueba.

## Versiones

`docs/VERIFICADO.md` registra fecha, sistema operativo, runtime, dependencias principales, comandos y comprobaciones manuales. No se usa «latest» como evidencia de una prueba pasada.

## Accesibilidad y seguridad

Todo ejemplo con interfaz se revisa al menos a 390 px y 1440 px, con teclado y zoom. Todo ejemplo con usuarios o datos incluye pruebas negativas de permisos. Los secretos permanecen en servidor y los errores no muestran información sensible.

## Evidencia

Una captura complementa una prueba, no la sustituye. La evidencia debe indicar ruta, tamaño o rol, acción, resultado y fecha. No se versionan capturas con información personal.
