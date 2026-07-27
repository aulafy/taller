# Verificar Excel con IA

Un laboratorio para personas que trabajan con hojas de cálculo y quieren usar asistentes de IA sin aceptar fórmulas incorrectas por su apariencia convincente.

## Qué incluye

- [`verificar-excel-con-ia.xlsx`](./outputs/verificar-excel-con-ia.xlsx): libro listo para abrir en Excel, LibreOffice Calc o una aplicación compatible.
- [`ventas-sinteticas.csv`](./datos/ventas-sinteticas.csv): las 12 filas ficticias utilizadas por el libro.
- un auditor independiente en Node.js;
- cinco pruebas automáticas.

No necesitas Copilot, Claude, ChatGPT, una API ni una cuenta. El libro contiene deliberadamente dos errores plausibles: una fórmula que omite el descuento y un total cuyo rango no incluye la última fila.

## Cómo practicar

1. Descarga el archivo `.xlsx` y guarda una copia.
2. Abre `EMPIEZA AQUI`.
3. En `Ventas`, compara las columnas amarillas con las verdes.
4. Activa **Mostrar fórmulas** y lee las referencias.
5. Prueba una fila sin descuento y dos con descuento.
6. En `Control`, concilia los totales antes de corregir nada.
7. Explica por qué el caso fácil da `OK` sin demostrar que la fórmula sea correcta.

## Verificación reproducible

Con Node.js 20.11 o posterior:

```bash
npm run verificar
```

Resultado patrón:

```text
filas_revisadas: 12
errores_silenciosos_detectados: 3
ventas_verificadas: 4024
margen_verificado: 2434
total_propuesto_con_rango_corto: 3960
diferencia_total: -64
```

## Seguridad y privacidad

El laboratorio funciona sin red y no instala dependencias. No subas hojas reales para practicar. Nóminas, facturas, datos de clientes, salud, identificadores fiscales y secretos requieren autorización, minimización y los controles de tu organización. Una hoja descargada de una fuente desconocida también puede contener instrucciones maliciosas dirigidas a un agente.

## Fuentes oficiales

- [Microsoft: función COPILOT](https://support.microsoft.com/en-us/excel/functions/copilot-function)
- [Microsoft: preguntas frecuentes sobre Copilot en Excel](https://support.microsoft.com/en-US/Excel/copilot/frequently-asked-questions-about-copilot-in-excel)
- [Microsoft: detectar errores de fórmulas](https://support.microsoft.com/en-us/excel/detect-formula-errors-in-excel)
- [Microsoft: rastrear precedentes y dependientes](https://support.microsoft.com/en-us/excel/display-the-relationships-between-formulas-and-cells)
- [Anthropic: usar Claude for Excel](https://support.claude.com/en/articles/12650343-use-claude-for-excel)

Verificado el 27 de julio de 2026.
