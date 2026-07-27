# Minimizar datos antes de usar IA

Laboratorio local para convertir ocho solicitudes sintéticas de atención al cliente en una copia con solo los campos necesarios para clasificar tema y prioridad.

No promete anonimización ni cumplimiento automático. Enseña tres operaciones distintas:

1. **retirar** identificadores que la finalidad no necesita;
2. **generalizar** un importe exacto en un tramo;
3. **seudonimizar** el identificador y guardar la correspondencia por separado.

## Ejecutar

Requiere Node.js 20.11 o posterior. No instala paquetes ni utiliza la red:

```bash
npm run verificar
```

Se generan tres archivos:

- `salida/entrada-modelo.csv`: única copia candidata a usar en el ejercicio;
- `salida/auditoria.json`: conteos y coincidencias residuales;
- `salida/mapa-local.json`: correspondencia separada, ignorada por Git y con permisos `600`.

## Resultado esperado

```text
8 registros de entrada → 8 casos
11 campos de entrada → 4 campos de salida
0 identificadores directos coincidentes
0 patrones de email, teléfono, DNI o IBAN ficticio
```

Ese cero mide solo las pruebas declaradas. Provincia, tramo de importe, estilo del texto u otras combinaciones podrían contribuir a reidentificar a alguien en un conjunto real. La salida se denomina **minimizada y seudonimizada**, no anónima.

## Práctica

1. Lee [`finalidad.json`](./datos/finalidad.json).
2. Justifica por qué cada campo de salida es necesario.
3. Ejecuta la minimización.
4. Abre `entrada-modelo.csv` y busca información que todavía resulte excesiva.
5. Elimina `provincia` o `tramo_importe` y observa si la tarea seguiría siendo posible.
6. No envíes `mapa-local.json` al mismo destino que la copia minimizada.

## Límites

Las expresiones regulares no detectan todos los nombres, direcciones, identificadores indirectos o combinaciones raras. En producción necesitarías una evaluación con datos autorizados, reconocedores apropiados para tu contexto, gestión de falsos negativos y revisión de una persona responsable.

## Fuentes primarias

- [RGPD, artículo 5: minimización](https://eur-lex.europa.eu/legal-content/ES/TXT/?uri=CELEX:32016R0679)
- [AEPD: guía básica de anonimización](https://www.aepd.es/documento/guia-basica-anonimizacion.pdf)
- [AEPD: cuándo los datos anonimizados dejan de ser personales](https://www.aepd.es/preguntas-frecuentes/0-conceptos-basicos/FAQ-0005-sobre-los-datos-anonimizados)
- [AEPD: calidad, exactitud y minimización en sistemas de IA](https://www.aepd.es/prensa-y-comunicacion/notas-de-prensa/aepd-analiza-calidad-exactitud-y-minimizacion-de-datos-personales-en-tratamientos-con-ia)

Verificado el 27 de julio de 2026.
