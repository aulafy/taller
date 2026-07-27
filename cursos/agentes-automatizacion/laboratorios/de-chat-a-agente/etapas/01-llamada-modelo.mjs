#!/usr/bin/env node
import { generate } from "../lib/ollama-local.mjs";

const question =
  "¿Cuál es el plazo de devolución de las compras online de Tienda Brújula?";
const result = await generate({
  prompt: `${question}\nSi no dispones de una fuente, indícalo con claridad.`,
});

console.log(JSON.stringify({
  etapa: 1,
  concepto: "llamada simple",
  question,
  answer: result.text,
  evidence: [],
  warning:
    "La respuesta del modelo no tiene acceso a las políticas ficticias y no debe tratarse como hecho.",
  model: result.model,
  total_ms: result.totalMs,
}, null, 2));
