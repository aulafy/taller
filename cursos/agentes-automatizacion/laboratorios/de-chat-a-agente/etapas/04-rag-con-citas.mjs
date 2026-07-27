#!/usr/bin/env node
import { generate } from "../lib/ollama-local.mjs";
import { renderEvidence, retrieve } from "../lib/recuperacion.mjs";

const question =
  "¿Cuál es el plazo de devolución de una compra online en Tienda Brújula?";
const results = retrieve(question);
const evidence = renderEvidence(results);
const result = await generate({
  prompt: `Responde solo con EVIDENCIA. Si no basta, di "No consta". Cita los IDs entre corchetes.

PREGUNTA: ${question}
EVIDENCIA:
${evidence}`,
});

console.log(JSON.stringify({
  etapa: 4,
  concepto: "RAG mínimo",
  retrieved_ids: results.map((item) => item.id),
  answer: result.text,
  warning:
    "Recuperar texto no garantiza fidelidad: la salida todavía debe validar sus citas.",
  model: result.model,
  total_ms: result.totalMs,
}, null, 2));
