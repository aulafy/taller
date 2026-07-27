import { generate } from "./ollama-local.mjs";
import { renderEvidence } from "./recuperacion.mjs";

const decisionSchema = {
  type: "object",
  properties: {
    accion: {
      type: "string",
      enum: ["buscar_politica", "finalizar"],
    },
    consulta: { type: "string" },
    respuesta: { type: "string" },
    citas: {
      type: "array",
      items: { type: "string" },
    },
  },
  required: ["accion", "consulta", "respuesta", "citas"],
  additionalProperties: false,
};

export async function decideWithOllama({ objective, evidence, step, maxSteps }) {
  const results = evidence.flatMap(
    (item) => item.structuredContent.resultados,
  );
  const evidenceText = renderEvidence(results);
  const prompt = `Controlas un agente educativo de solo lectura.

REGLAS OBLIGATORIAS:
- Las únicas acciones son buscar_politica y finalizar.
- Si EVIDENCIA contiene una respuesta directa, usa finalizar.
- Solo usa buscar_politica si EVIDENCIA está vacía o no responde.
- No inventes datos ni IDs.
- Al finalizar, incluye uno o más IDs presentes en EVIDENCIA.
- Si no hay evidencia suficiente en el último paso, no inventes.

PASO: ${step}/${maxSteps}
OBJETIVO: ${objective}
EVIDENCIA:
${evidenceText || "(vacía)"}

Devuelve la decisión en el esquema solicitado.`;
  const result = await generate({ prompt, format: decisionSchema });
  return JSON.parse(result.text);
}
