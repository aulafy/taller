# Verificación

- Fecha: 2026-07-27
- Sistema: macOS 26, Apple M4, 24 GB de memoria unificada
- Node.js: 26.4.0
- Ollama servidor: 0.32.1
- Modelo manual: `gemma3:4b`, 4.3B, Q4_K_M, 3.3 GB aproximados
- Licencia del modelo observada mediante `/api/show`: Gemma Terms of Use

## Evidencia automática

`npm run verificar`: 3 pruebas superadas y auditoría de seguridad superada.

## Evidencia manual

La prueba de referencia usó únicamente la FAQ ficticia incluida:

- dirección: `http://127.0.0.1:11434`;
- respuesta: `No consta.`;
- coincidencia con la abstención esperada: sí;
- tiempo de carga: 1.643 s;
- tiempo total: 2.080 s;
- tokens por segundo: 44.67;
- modelo descargado: 3.34 GB aproximados.

También se comprobaron dos fallos seguros: una dirección LAN fue bloqueada antes
de consultar la red y un modelo inexistente fue rechazado antes de generar.

Las cifras describen esta ejecución y no se generalizan a otros equipos,
versiones, modelos, contextos o cargas simultáneas.
