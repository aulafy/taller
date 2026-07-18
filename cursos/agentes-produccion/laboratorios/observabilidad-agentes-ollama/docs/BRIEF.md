# Brief del laboratorio

## Persona y necesidad

Una persona técnica tiene un agente pequeño que responde con Ollama y quiere averiguar por qué una respuesta es lenta, no tiene fundamento o repite herramientas. No necesita todavía un framework de agentes completo.

## Alcance

- Una entrada de texto sintética.
- Recuperación local sobre dos documentos JSON ficticios.
- Una tool de lectura que no conecta con servicios externos.
- Una generación a Ollama y trazas enviadas a Langfuse.
- Atributos de contexto, versión y tags para filtrar la traza.

## Fuera de alcance

- Datos reales, cuentas, panel web, base vectorial, llamadas de escritura, automatización de pedidos o despliegue público.

## Criterios de aceptación

1. La ejecución crea una observación raíz tipo `agent` y observaciones hijas `retriever`, `tool` y `generation`.
2. La recuperación devuelve solo documento, versión, sección, puntuación y extracto sintético.
3. El agente se abstiene cuando no hay evidencia recuperada.
4. Las claves se toman exclusivamente de variables de entorno locales.
5. La documentación distingue un setup de laboratorio de una instalación apta para producción.
