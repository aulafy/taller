# Detén un agente antes de que entre en loop o agote el presupuesto

Este laboratorio simula siete ejecuciones sin llamar a ningún modelo ni servicio. Enseña a colocar guardas en el código que rodea al agente:

- máximo de pasos;
- tiempo total;
- coste reservado antes de una llamada;
- reconciliación con tokens reales después;
- cuota por herramienta;
- fingerprint de intención, tool y argumentos;
- falta de progreso.

## Ejecutar

Necesitas Node.js 20.11 o posterior:

```bash
npm run verificar
```

Resultado esperado:

```text
8 tests
7 escenarios coinciden con el resultado esperado
Auditoría superada: siete escenarios, tarifas ficticias, cero secretos, red o dependencias.
```

## Por qué hay dos costes

Antes de llamar a un modelo todavía no conoces el uso real. El laboratorio reserva:

```text
entrada_estimada × tarifa_entrada
+ salida_maxima × tarifa_salida
```

Si la reserva supera el presupuesto restante, bloquea la llamada. Después de una respuesta, sustituye la reserva por el uso comunicado por el proveedor. Así evitas descubrir el exceso cuando ya se ha facturado.

Los importes se expresan en microdólares enteros (`1 USD = 1.000.000 microusd`) para evitar errores de coma flotante.

## Tarifas deliberadamente ficticias

`config/tarifas-demo.json` no representa ningún proveedor. Antes de una prueba real:

1. consulta el precio oficial vigente;
2. registra proveedor, modelo, región, modalidad y fecha;
3. incluye tools con precio independiente;
4. decide cómo tratar tokens en caché y razonamiento;
5. vuelve a ejecutar el presupuesto cuando cambie una tarifa.

No copies números de una entrada de blog ni de este laboratorio.

## Siete escenarios

| Escenario | Resultado |
|---|---|
| `sano` | Completa cuatro pasos por 4.200 microusd |
| `loop-fingerprint` | Bloquea la tercera llamada idéntica |
| `presupuesto` | Evita una reserva de 7.000 microusd |
| `cuota-tool` | Impide una tercera búsqueda |
| `max-pasos` | Se detiene antes del paso nueve |
| `timeout` | Bloquea al superar cinco minutos |
| `sin-progreso` | Detiene la tercera acción sin cambio de estado |

## Integrarlo en un agente real

La comprobación debe estar fuera del prompt y antes del efecto:

```text
propuesta del modelo
→ validar argumentos y permisos
→ calcular fingerprint
→ reservar coste y cuota
→ decidir ejecutar o bloquear
→ ejecutar
→ registrar uso real
→ reconciliar presupuesto
→ guardar traza
```

Si solo pides al modelo «no gastes demasiado», no tienes un presupuesto: tienes una preferencia.

## Límites del ejemplo

- No calcula el precio de un proveedor real.
- No sustituye límites de facturación del proveedor ni alertas financieras.
- No coordina presupuestos diarios entre varios procesos.
- No demuestra calidad de las respuestas.
- No decide automáticamente cuánto riesgo puede aceptar una empresa.

Para producción, guarda reservas de forma atómica en una base de datos, usa idempotencia, separa presupuesto por organización/usuario/tarea y define un modo degradado cuando se corta la ejecución.

## Fuentes primarias

- [OpenAI: optimización de costes](https://developers.openai.com/api/docs/guides/cost-optimization)
- [OWASP: consumo no acotado](https://genai.owasp.org/llmrisk/llm102025-unbounded-consumption/)
- [OpenTelemetry: observabilidad de IA generativa](https://opentelemetry.io/blog/2026/genai-observability/)
- [LangGraph: límite de recursión](https://docs.langchain.com/oss/python/langgraph/graph-api#recursion-limit)

Verificado el 27 de julio de 2026. Código y documentación bajo licencia MIT.
