#!/usr/bin/env node
import { runAgent } from "../lib/agente.mjs";
import { decideWithOllama } from "../lib/decision-ollama.mjs";

const result = await runAgent({
  objective:
    "¿Cuál es el plazo de devolución de una compra online en Tienda Brújula?",
  decide: decideWithOllama,
  maxSteps: 3,
});

console.log(JSON.stringify({
  etapa: 5,
  concepto: "bucle modelo → tool → observación → parada",
  permissions: ["buscar_politica: lectura"],
  max_steps: 3,
  ...result,
}, null, 2));
