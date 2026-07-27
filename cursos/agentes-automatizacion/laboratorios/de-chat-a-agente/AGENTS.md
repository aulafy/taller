# Reglas del laboratorio

- Usa únicamente los documentos sintéticos de `datos/`.
- No añadas red salvo la API de Ollama en loopback.
- El servidor MCP permanece en `stdio`; no añadas un transporte remoto.
- La única tool es de lectura. No añadas shell, escritura, envío ni borrado.
- Conserva `MAX_STEPS`, el detector de repetición y la validación de citas.
- No presentes la salida del modelo como hecho si no supera las validaciones.
- Si cambia el protocolo, actualiza versión, fuentes, pruebas y `VERIFICADO.md`.
