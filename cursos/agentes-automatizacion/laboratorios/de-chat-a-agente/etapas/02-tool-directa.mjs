#!/usr/bin/env node
import { callTool } from "../lib/herramientas.mjs";

const result = callTool("buscar_politica", {
  consulta: "plazo devolución compra online",
});
console.log(JSON.stringify({
  etapa: 2,
  concepto: "tool local llamada por código",
  tool: "buscar_politica",
  result,
  distinction:
    "La función recupera evidencia; todavía no existe protocolo MCP ni bucle.",
}, null, 2));
