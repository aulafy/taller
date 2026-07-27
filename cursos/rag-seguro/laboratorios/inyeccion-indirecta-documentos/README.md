# Inyección indirecta: que un documento no dé órdenes a tu agente

Este laboratorio no intenta adivinar todas las frases maliciosas. Enseña a impedir que el contenido de un PDF, una web, una hoja de cálculo o el resultado de una herramienta se convierta en autoridad para producir efectos.

Todo es sintético. No usa un LLM, red, credenciales ni dependencias externas.

## Ejecutar

Necesitas Node.js 20.11 o posterior:

```bash
npm run verificar
```

Resultado esperado:

```text
9 tests
9 escenarios coinciden con el resultado esperado
Auditoría superada: nueve escenarios sintéticos, dominios reservados, cero secretos, red o dependencias.
```

## El modelo de seguridad

El usuario crea un contrato de tarea antes de leer contenido externo:

```json
{
  "tools": ["responder"],
  "destinos": [],
  "datos_permitidos": ["texto_publico"]
}
```

Cada propuesta conserva su procedencia:

```json
{
  "tool": "enviar_email",
  "influida_por": ["pdf-hostil"],
  "datos": ["token"]
}
```

La política comprueba, fuera del modelo:

1. que la tool existe y estaba incluida en el contrato;
2. que cada fuente de influencia existe y conserva su nivel de confianza;
3. que contenido no confiable no desemboca en escrituras, envíos o lecturas sensibles;
4. que datos y destino coinciden exactamente con lo autorizado;
5. que los efectos de alto riesgo tienen aprobación humana.

## Nueve escenarios

| Caso | Decisión |
|---|---|
| PDF benigno | Permitir un resumen sin efectos |
| PDF que pide enviar un token | Bloquear tool fuera del contrato |
| Web que pide publicar información | Bloquear tool fuera del contrato |
| Celda que cambia un IBAN | Bloquear tool fuera del contrato |
| Resultado de tool envenenado | Bloquear lectura sensible |
| Correo legítimo sin aprobar | Pedir aprobación |
| El mismo correo aprobado | Permitir |
| Ataque ofuscado | Bloquear por flujo origen–efecto |
| Destino cambiado | Bloquear aunque exista aprobación |

El ataque ofuscado no contiene ninguna frase de la lista simple del ejemplo. Evade ese detector, pero no la separación origen–efecto. Esto demuestra por qué un clasificador puede ser una capa auxiliar, nunca la frontera de autorización.

## Flujo recomendado

```text
objetivo del usuario
→ contrato de tools, datos y destinos
→ lectura de contenido marcado como no confiable
→ propuesta estructurada del modelo
→ comprobación determinista de procedencia y efecto
→ aprobación humana si corresponde
→ ejecución idempotente
→ traza
```

No envíes el propio documento hostil a una segunda herramienta privilegiada para que «decida si es seguro». Una clasificación probabilística puede ayudar a poner en cuarentena, pero la autorización final debe depender de reglas y permisos.

## Qué no demuestra

- No detecta todos los ataques ni mide un modelo real.
- No analiza texto oculto en imágenes, macros, fórmulas o estilos.
- No sustituye un sandbox, antivirus, DLP o revisión de archivos.
- No prueba OAuth, concurrencia, idempotencia ni un servidor MCP real.
- No convierte una aprobación genérica en consentimiento informado.

En producción, registra identidad, tarea, procedencia, versión del contenido, tool, argumentos, decisión y aprobación. No guardes secretos o documentos completos en logs.

## Fuentes primarias

- [OWASP LLM01: Prompt Injection](https://genai.owasp.org/llmrisk/llm01-prompt-injection/)
- [OpenAI: Designing AI agents to resist prompt injection](https://openai.com/index/designing-agents-to-resist-prompt-injection/)
- [Microsoft: defensa frente a inyección indirecta](https://learn.microsoft.com/es-es/security/zero-trust/sfi/defend-indirect-prompt-injection)
- [NIST: AI agent hijacking evaluations](https://www.nist.gov/news-events/news/2025/01/technical-blog-strengthening-ai-agent-hijacking-evaluations)
- [MCP: especificación y seguridad de tools](https://modelcontextprotocol.io/specification/2025-11-25/server/tools)

Verificado el 27 de julio de 2026. Código y documentación bajo licencia MIT.
