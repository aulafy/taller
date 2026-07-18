# Registro de verificación

**Estado:** borrador, pendiente de ejecución manual con Langfuse y Ollama.

## Qué sí se ha comprobado

- La estructura exigida por Taller está presente.
- `scripts/verificar.py` comprueba el contrato pedagógico sin red.
- El código usa las APIs y patrones documentados por Langfuse para observaciones, tipos y propagación de atributos.

## Qué falta para marcarlo como verificado

1. Instalación limpia en Python 3.11 o superior con versiones concretas de `langfuse`, `openai` y `python-dotenv`.
2. Ejecución contra un modelo de Ollama y un proyecto de Langfuse de laboratorio.
3. Revisión manual de los pasos de `docs/PRUEBAS.md` y de los casos negativos.
4. Registro de fecha, sistema, modelos, versiones y resultados sin credenciales.

No debe cambiarse el estado a `verificado` solamente porque la comprobación estática pase.
