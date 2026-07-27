# Pruebas

## Automáticas y sin modelo

```bash
npm run verificar
```

Comprueban recuperación, contrato de tool, ciclo MCP, éxito del agente y cortes
por repetición, cita inventada y máximo de pasos.

## Integración MCP real

```bash
npm run etapa:2
npm run etapa:3
```

La tercera etapa debe negociar `2025-11-25`, listar únicamente
`buscar_politica` e invocarla a través de un subproceso `stdio`.

## Modelo local

```bash
OLLAMA_MODEL=gemma3:4b npm run etapa:1
OLLAMA_MODEL=gemma3:4b npm run etapa:4
OLLAMA_MODEL=gemma3:4b npm run etapa:5
```

La última etapa debe recuperar `DEV-01`, finalizar en un máximo de tres pasos y
emitir una cita válida. Una salida diferente se registra como fallo o variación,
no se fuerza debilitando validaciones.

## Casos negativos

- nombre de tool no permitido;
- argumento adicional;
- `tools/list` antes de `notifications/initialized`;
- decisión repetida;
- final sin citas o con ID inventado;
- destino de Ollama fuera de loopback.
