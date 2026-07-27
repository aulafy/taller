# Verificación

- Fecha: 2026-07-27
- Protocolo MCP: 2025-11-25
- Node.js: 26.4.0
- Ollama servidor: 0.32.1
- Modelo de integración: `gemma3:4b`
- Datos: cuatro documentos sintéticos de Tienda Brújula

## Evidencia

- `npm run verificar`: 5 pruebas y auditoría superadas.
- Etapa 1: el modelo respondió erróneamente “15 días” e inventó una URL. La
  salida quedó marcada sin evidencia; demuestra el problema de partida.
- Etapa 2: `DEV-01` recuperado mediante llamada directa.
- Etapa 3: ciclo MCP negociado, una sola tool listada y llamada por `stdio`.
- Etapa 4: `DEV-01` recuperado y respuesta “30 días” con cita.
- Etapa 5: completada en 2 pasos; tool → observación → final con `DEV-01`.
- Dirección LAN para Ollama: rechazada antes de hacer una petición.
- Tool inexistente, argumento extra, sesión sin inicializar, búsqueda repetida,
  cita inventada y máximo de pasos: rechazados.

Las salidas del modelo pueden variar; las invariantes de seguridad no.
