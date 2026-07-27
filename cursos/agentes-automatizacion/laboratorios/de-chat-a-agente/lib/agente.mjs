import crypto from "node:crypto";

import { callTool } from "./herramientas.mjs";

export async function runAgent({
  objective,
  decide,
  maxSteps = 3,
}) {
  const trace = [];
  const evidence = [];
  const fingerprints = new Set();

  for (let step = 1; step <= maxSteps; step++) {
    const decision = await decide({ objective, evidence, step, maxSteps });
    trace.push({ step, type: "decision", decision });

    if (decision.accion === "finalizar") {
      const allowedIds = new Set(
        evidence.flatMap((item) =>
          item.structuredContent.resultados.map((result) => result.id),
        ),
      );
      if (!decision.respuesta?.trim()) {
        throw new Error("El agente intentó finalizar sin respuesta.");
      }
      if (
        !Array.isArray(decision.citas) ||
        decision.citas.length === 0 ||
        decision.citas.some((id) => !allowedIds.has(id))
      ) {
        throw new Error("El agente intentó finalizar con citas ausentes o inventadas.");
      }
      return {
        status: "completed",
        answer: decision.respuesta.trim(),
        citations: decision.citas,
        steps: step,
        trace,
      };
    }

    if (decision.accion !== "buscar_politica") {
      throw new Error(`Acción no permitida: ${decision.accion}`);
    }
    const args = { consulta: decision.consulta?.trim() || objective };
    const fingerprint = crypto
      .createHash("sha256")
      .update(JSON.stringify({ tool: "buscar_politica", args }))
      .digest("hex");
    if (fingerprints.has(fingerprint)) {
      throw new Error("Bucle detenido: tool y argumentos repetidos.");
    }
    fingerprints.add(fingerprint);
    const observation = callTool("buscar_politica", args);
    evidence.push(observation);
    trace.push({
      step,
      type: "tool",
      tool: "buscar_politica",
      args,
      resultIds: observation.structuredContent.resultados.map((item) => item.id),
    });
  }

  throw new Error(`Bucle detenido: máximo de ${maxSteps} pasos alcanzado.`);
}
