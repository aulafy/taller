# Brief

## Problema

Enseñar la progresión llamada → tool → MCP → RAG → agente sin ocultar cada
cambio dentro de un framework y sin presentar MCP o RAG como agentes.

## Contrato

- El mismo caso ficticio atraviesa las cinco etapas.
- La etapa 1 no dispone de evidencia.
- La etapa 2 llama directamente a una función local.
- La etapa 3 usa el ciclo MCP 2025-11-25 y transporte `stdio`.
- La etapa 4 recupera evidencia y pide citas.
- La etapa 5 deja que el modelo elija tool o final, pero el código limita
  acciones, pasos, repetición y citas.
- Ninguna etapa escribe, publica, envía, borra o llama a una API remota.

## Fuera de alcance

- desplegar servidores MCP remotos;
- indexación vectorial o embeddings;
- memoria persistente;
- agentes multiusuario o de producción;
- decisiones con impacto real.
