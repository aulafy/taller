#!/usr/bin/env node
import { runMcpDemo } from "../mcp/cliente.mjs";

const result = await runMcpDemo("plazo devolución compra online");
console.log(JSON.stringify({
  etapa: 3,
  concepto: "misma tool mediante MCP stdio",
  protocol: result.initialized.protocolVersion,
  tools: result.listed.tools.map((tool) => tool.name),
  result: result.called,
  distinction:
    "MCP estandariza descubrimiento e invocación; no decide por sí mismo cuándo usar la tool.",
}, null, 2));
