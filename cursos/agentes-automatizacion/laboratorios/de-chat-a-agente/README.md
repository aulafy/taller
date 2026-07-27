# De chat a agente: cinco escalones que no son sinónimos

## Resultado

Construirás el mismo asistente ficticio en cinco etapas observables:

1. una llamada simple a un modelo sin conocimiento interno;
2. una función de búsqueda llamada directamente;
3. la misma función descubierta e invocada mediante MCP;
4. recuperación de evidencia antes de responder (RAG mínimo);
5. un bucle donde el modelo decide buscar o finalizar.

La complejidad solo aumenta cuando aporta una capacidad nueva.

## Caso

Tienda Brújula es completamente ficticia. El alumno pregunta por su plazo de
devolución online. Los cuatro fragmentos de `datos/` son sintéticos y citables.

## Requisitos

- Node.js 20.11 o posterior;
- Ollama local y un modelo instalado para las etapas 1, 4 y 5;
- ninguna clave, cuenta, servicio remoto o dependencia de npm.

## Inicio

```bash
cd cursos/agentes-automatizacion/laboratorios/de-chat-a-agente
npm run verificar

npm run etapa:2
npm run etapa:3

OLLAMA_MODEL=gemma3:4b npm run etapa:1
OLLAMA_MODEL=gemma3:4b npm run etapa:4
OLLAMA_MODEL=gemma3:4b npm run etapa:5
```

Sustituye el modelo por uno ya instalado. El laboratorio nunca descarga pesos.

## Qué cambia en cada etapa

| Etapa | El modelo decide | Hay evidencia | Hay MCP | Hay bucle |
|---|---:|---:|---:|---:|
| Llamada | genera texto | no | no | no |
| Tool directa | no | sí | no | no |
| MCP | no | sí | sí | no |
| RAG | genera con contexto | sí | no es necesario | no |
| Agente | tool o final | sí tras actuar | la tool es compatible | sí, máximo 3 |

MCP estandariza la conexión; RAG recupera contexto; el agente elige pasos. Una
aplicación puede usar cualquiera por separado.

## Límites de seguridad

- Tool única: `buscar_politica`, solo lectura.
- Sin rutas, shell, red, escritura, envío ni borrado.
- MCP local mediante `stdio`, sin puerto.
- Ollama limitado a loopback.
- Máximo de tres pasos.
- Una misma llamada no puede repetirse.
- El final necesita al menos una cita obtenida por la tool.
- Los IDs inventados se rechazan en código.

## Errores que debes provocar

Las pruebas muestran que un sistema útil también sabe negarse:

- llamar una tool inexistente;
- pasar argumentos adicionales;
- usar MCP antes de inicializar;
- repetir la misma búsqueda;
- finalizar con `FAKE-99`;
- alcanzar el máximo de pasos.

## Fuentes primarias

- [Introducción a MCP](https://modelcontextprotocol.io/docs/getting-started/intro)
- [Ciclo MCP 2025-11-25](https://modelcontextprotocol.io/specification/2025-11-25/basic/lifecycle)
- [Transporte stdio](https://modelcontextprotocol.io/specification/2025-11-25/basic/transports)
- [Tools MCP](https://modelcontextprotocol.io/specification/2025-11-25/server/tools)
- [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)
- [Paper original de RAG](https://arxiv.org/abs/2005.11401)
- [API de generación de Ollama](https://docs.ollama.com/api/generate)

Código y documentación: licencia MIT.
