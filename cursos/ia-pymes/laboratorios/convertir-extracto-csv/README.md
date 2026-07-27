# Convertir un extracto a CSV sin inventar movimientos

Laboratorio para aprender a validar una transformación realizada con ayuda de IA antes de importarla en otra herramienta.

El origen contiene 20 movimientos completamente sintéticos. La propuesta defectuosa parece ordenada, pero:

- pierde un movimiento;
- inventa otro;
- invierte un signo y su tipo;
- usa una categoría fuera del catálogo;
- intercambia mes y día en una fecha;
- no concilia con el total de origen.

## Ejecutar

Requiere Node.js 20.11 o posterior. No instala dependencias ni utiliza la red:

```bash
npm run verificar
```

Para ver fallar la propuesta:

```bash
npm run evaluar:propuesta
```

Ese segundo comando debe terminar con código `1`. No es un fallo del laboratorio: demuestra que el control bloquea una importación incorrecta.

## Contrato de aceptación

1. Exactamente una salida por cada ID del origen.
2. Cero IDs inventados o duplicados.
3. Fecha ISO derivada de una entrada declarada como `DD/MM/YYYY`.
4. Descripción conservada y neutralizada frente a fórmulas de hoja.
5. Categoría exacta del catálogo cerrado.
6. Tipo coherente con el signo.
7. Importe firmado idéntico, con dos decimales.
8. Total conciliado en céntimos.

## Práctica

1. Lee `datos/esquema.json` antes de abrir la propuesta.
2. Ejecuta `npm run evaluar:propuesta`.
3. Corrige una copia de `datos/propuesta-ia.csv`; no mires aún la solución.
4. Repite el evaluador hasta obtener cero errores.
5. Compara con `solucion/importacion.csv`.
6. Explica por qué una revisión visual no detectó todos los fallos.

## Seguridad

No uses extractos reales. Un CSV puede contener datos privados y texto que una hoja interprete como fórmula. El evaluador rechaza descripciones que comienzan por `=`, `+`, `-` o `@`, y nunca ejecuta el contenido.

## Fuentes primarias

- [RFC 4180: formato común de CSV](https://www.rfc-editor.org/info/rfc4180/)
- [OWASP: validación de salidas de LLM](https://genai.owasp.org/llmrisk/llm052025-improper-output-handling/)
- [Python: lectura y escritura de CSV](https://docs.python.org/3/library/csv.html)

Verificado el 27 de julio de 2026.
