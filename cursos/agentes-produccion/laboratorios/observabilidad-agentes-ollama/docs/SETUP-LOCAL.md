# Setup: Cloud o self-hosted

## Opción A — Langfuse Cloud

Es el camino más rápido para aprender. Crea un proyecto de laboratorio, guarda las credenciales en `.env` y revisa previamente la región, condiciones y política de datos aplicable a tu caso. Solo envía datos sintéticos durante este laboratorio.

## Opción B — Langfuse self-hosted

Langfuse ofrece un [Docker Compose oficial](https://langfuse.com/self-hosting/deployment/docker-compose) para ejecutarlo localmente o en una VM. Clona su repositorio oficial, cambia todos los secretos marcados como `# CHANGEME`, inicia el Compose y crea un proyecto de laboratorio en la interfaz local.

```bash
git clone https://github.com/langfuse/langfuse.git
cd langfuse
# Cambia las claves y contraseñas indicadas por el propio proyecto.
docker compose up
```

Cuando el servicio esté listo, establece `LANGFUSE_BASE_URL=http://localhost:3000` en tu `.env` local.

## Qué no prometer

Docker Compose es apropiado para pruebas y baja escala; el propio proyecto indica que no aporta alta disponibilidad, escalado horizontal ni backups por sí solo. Langfuse requiere servicios de aplicación, PostgreSQL, ClickHouse, Redis/Valkey y almacenamiento de objetos. No copies este laboratorio a producción sin diseño de red, acceso, copias, actualización, retención y respuesta a incidentes.

## Ollama

Instala Ollama por su canal oficial, descarga un modelo que quepa en tu equipo y confirma su API:

```bash
ollama pull llama3.1
curl http://localhost:11434/api/tags
```

El código usa `http://localhost:11434/v1` porque Ollama expone compatibilidad con el formato OpenAI. La cadena `api_key="ollama"` es un marcador requerido por la interfaz del cliente; no es una credencial de proveedor.
