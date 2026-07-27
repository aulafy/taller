# Evalúa un RAG: recuperación, citas, abstención y permisos

Un chat con documentos puede responder de forma convincente y seguir estando mal. Este laboratorio convierte cuatro promesas en diez casos ejecutables:

1. recupera evidencia permitida;
2. cita únicamente chunks realmente recuperados;
3. se abstiene cuando el corpus no responde;
4. nunca mezcla documentos de clientes distintos ni usa contenido en cuarentena.

El informe separa `recall_recuperacion_at_3`, `exactitud_abstencion`, `validez_citas`,
citas inventadas, citas en cuarentena y fugas entre tenants. Un promedio único ocultaría
qué capa está fallando.

No instala dependencias, no llama a un LLM y no utiliza datos reales.

## Ejecutar

Requiere Node.js 20.11 o posterior:

```bash
npm run verificar
```

Resultado esperado:

```text
8 tests
10 casos aprobados
Auditoría superada: corpus sintético, dos tenants, abstención y documento hostil en cuarentena.
```

## Ver fallar una propuesta plausible

```bash
npm run evaluar
```

Debe terminar con código `1`. La propuesta:

- cita un documento en cuarentena;
- inventa una fuente;
- responde una pregunta sin evidencia;
- recupera información de otro tenant.

El fallo es el ejercicio, no un problema del repositorio.

## Practicar con otro modelo

1. Copia `datos/respuestas-propuesta.json`.
2. Entrega al modelo solo los chunks que `lib/recuperacion.mjs` devuelve para cada caso.
3. Exige el mismo esquema: `caso_id`, `respuesta`, `abstencion` y `citas`.
4. Sustituye la propuesta por su salida.
5. Ejecuta:

```bash
node scripts/evaluar.mjs ruta/a/respuestas.json
```

No pegues documentos reales ni claves. El modelo no debe ver chunks de otro tenant; ese filtro sucede antes de preparar el prompt.

## Qué demuestra y qué no

El recuperador léxico es intencionadamente pequeño. Permite observar el control de acceso y las métricas sin una base vectorial. No demuestra que la búsqueda sea suficiente para producción ni que una frase esté semánticamente respaldada en todos los casos.

En un sistema real añade:

- un conjunto de preguntas revisado por el negocio;
- métricas de retrieval y de generación por separado;
- validación textual o humana de que cada cita respalda cada afirmación;
- pruebas adversarias y documentos contaminados;
- aislamiento aplicado en la consulta a la base, no en el prompt;
- trazas sin datos sensibles;
- umbrales y responsables para bloquear el despliegue.

## Fuentes primarias

- [Paper original de RAG](https://arxiv.org/abs/2005.11401)
- [OWASP: prompt injection](https://genai.owasp.org/llmrisk/llm01-prompt-injection/)
- [NIST AI RMF: perfil de IA generativa](https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence)

Verificado el 27 de julio de 2026. Código y documentación bajo licencia MIT.
