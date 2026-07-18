# Observabilidad de agentes con Ollama y Langfuse

Laboratorio ejecutable asociado al curso [Agentes en producción](https://www.aulafy.net/cursos/agentes-produccion/observabilidad-agentes-locales). Construye una traza con un agente de soporte ficticio: recupera evidencia sintética, consulta una herramienta de solo lectura y genera una respuesta con Ollama.

> **Estado: borrador verificable.** La estructura y el contrato del código se comprueban sin red. Antes de marcarlo como verificado falta ejecutar una traza manual en un entorno con Ollama y Langfuse configurados, y registrar las versiones exactas.

> **Datos sintéticos.** Este laboratorio no usa clientes, pedidos, documentos, secretos ni conversaciones reales.

## Problema

Una respuesta de un agente puede estar equivocada por una fuente antigua, una recuperación deficiente, una tool, el modelo o una política. Sin una traza que separe esos pasos, la corrección es especulativa.

## Aprenderás

- crear observaciones de tipo `agent`, `retriever`, `tool` y `generation`;
- trazar una llamada a un modelo local de Ollama mediante la API compatible con OpenAI;
- propagar un alias de usuario, sesión, versión y metadatos no sensibles;
- guardar evidencia mínima de RAG en lugar de documentos completos;
- detenerse ante falta de evidencia y preparar un caso para evaluar regresiones.

## No cubre

- autenticación, multi-tenant, RLS o una base vectorial de producción;
- despliegue de alta disponibilidad, backup u operación de Langfuse;
- acciones de escritura, envíos, pagos o acceso a pedidos reales;
- una evaluación legal, de seguridad, privacidad o cumplimiento normativo.

## Resultado esperado

Al ejecutar `src/app.py`, Langfuse muestra una traza `resolver-consulta-soporte` con cuatro pasos: recuperación, tool sintética, generación y atributos de contexto. La respuesta se fundamenta en `politica-devoluciones-v3` o se abstiene si no hay evidencia.

## Requisitos

- Python 3.11 o superior.
- Ollama instalado en local y un modelo descargado, por ejemplo `llama3.1`.
- Un proyecto de Langfuse Cloud **o** una instancia self-hosted de laboratorio.
- Credenciales de Langfuse guardadas solo en `.env`.

## Inicio rápido

```bash
cd cursos/agentes-produccion/laboratorios/observabilidad-agentes-ollama
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# Edita .env localmente con credenciales de un proyecto de laboratorio.
ollama pull llama3.1
python src/app.py
```

Abre Langfuse, busca la traza más reciente y sigue la lista de revisión de [`docs/PRUEBAS.md`](./docs/PRUEBAS.md).

## Comprobación automática

```bash
python scripts/verificar.py
```

Esta prueba no llama a Ollama ni a Langfuse: valida que el laboratorio conserva su estructura, límites y tipos de observación. La comprobación manual de la traza sigue siendo obligatoria.

## Estructura

```text
data/conocimiento-demo.json  Evidencia RAG deliberadamente pequeña y sintética
src/app.py                   Agente, retriever, tool y generación trazables
docs/SETUP-LOCAL.md          Cloud frente a self-hosted y límites de Docker Compose
docs/PRUEBAS.md              Revisión automática, manual y casos negativos
scripts/verificar.py         Verificador sin red
```

## Errores frecuentes

| Síntoma | Causa probable | Recuperación |
|---|---|---|
| `Falta LANGFUSE_SECRET_KEY` | No existe `.env` o la variable está vacía | Copia `.env.example`, completa el archivo local y no lo subas a Git. |
| `Connection refused` en Ollama | Ollama no está iniciado | Ejecuta Ollama y consulta `http://localhost:11434/api/tags`. |
| No aparece la traza | URL o claves de Langfuse incorrectas | Revisa `LANGFUSE_BASE_URL`, proyecto y la salida del script. |
| La respuesta no tiene evidencia | La pregunta no coincide con el conocimiento demo | Prueba la pregunta de devolución o verifica que se abstiene correctamente. |
| Docker consume demasiados recursos | El stack local incluye varios servicios | Usa Cloud para aprender o asigna más recursos; no conviertas un laboratorio en producción. |

## Restaurar y limpiar

Detén el script con `Ctrl+C`, desactiva el entorno con `deactivate` y elimina `.venv` si ya no lo necesitas. Conserva `.env` fuera de Git y borra las trazas de prueba en tu proyecto de Langfuse según su política. Si usaste Docker Compose, detén los contenedores sin borrar volúmenes hasta haber confirmado qué contienen.

## Curso y fuentes

- Curso: [Observabilidad para agentes locales](https://www.aulafy.net/cursos/agentes-produccion/observabilidad-agentes-locales)
- [Langfuse: trazar Ollama local](https://langfuse.com/integrations/model-providers/ollama)
- [Langfuse: Docker Compose self-hosted](https://langfuse.com/self-hosting/deployment/docker-compose)
- [Langfuse: tipos de observación](https://langfuse.com/docs/observability/features/observation-types)
- [OpenTelemetry: trazas](https://opentelemetry.io/docs/concepts/signals/traces/)

Publicado bajo la licencia MIT del repositorio.
