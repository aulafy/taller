# Instrucciones para agentes de código

Estas reglas se aplican a todo el repositorio. Un `AGENTS.md` dentro de un ejemplo puede añadir requisitos más específicos.

## Antes de editar

- Lee el `README.md`, `AGENTS.md`, `docs/BRIEF.md` y `docs/PRUEBAS.md` del ejemplo.
- Trabaja únicamente en la carpeta del ejemplo solicitado y en archivos raíz estrictamente relacionados.
- Explica en español qué resultado vas a cambiar y cómo se comprobará.
- Inspecciona versiones, scripts e instrucciones reales; no asumas convenciones de un framework.

## Contenido y datos

- No inventes autoridad comercial o profesional.
- Usa marcas ficticias claramente indicadas y datos sintéticos.
- No incluyas datos personales, conversaciones privadas ni credenciales válidas.
- Las variables secretas solo se nombran en `.env.example`; nunca se escriben valores.

## Implementación

- Mantén cada ejemplo autónomo y evita dependencias con otros ejemplos.
- Prefiere cambios pequeños, comprensibles y reversibles.
- No añadas funciones que no estén en el brief.
- Conserva accesibilidad por teclado, responsive y estados de error.
- Si una acción publica, compra, envía, borra o altera un servicio externo, detente antes y pide aprobación explícita.

## Verificación

- Ejecuta los scripts del ejemplo y registra los comandos realmente usados.
- Revisa la interfaz en móvil y escritorio cuando exista UI.
- Comprueba casos de error y permisos, no solo el camino feliz.
- Actualiza `README.md`, `docs/PRUEBAS.md`, `catalogo.json` y `VERIFICADO.md` cuando cambien comportamiento o versiones.
- No declares un ejemplo verificado si faltan pasos manuales; enuméralos.
