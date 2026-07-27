import { callTool, toolDefinition } from "../lib/herramientas.mjs";

export const PROTOCOL_VERSION = "2025-11-25";

function result(id, value) {
  return { jsonrpc: "2.0", id, result: value };
}

function error(id, code, message) {
  return { jsonrpc: "2.0", id: id ?? null, error: { code, message } };
}

export function createProtocolHandler() {
  let initialized = false;

  return function handle(message) {
    if (!message || message.jsonrpc !== "2.0" || typeof message.method !== "string") {
      return error(message?.id, -32600, "Solicitud JSON-RPC inválida");
    }

    if (message.method === "initialize") {
      return result(message.id, {
        protocolVersion: PROTOCOL_VERSION,
        capabilities: { tools: { listChanged: false } },
        serverInfo: {
          name: "aulafy-politicas-ficticias",
          version: "1.0.0",
          description: "Servidor MCP educativo y de solo lectura",
        },
        instructions:
          "Usa buscar_politica únicamente para el conjunto ficticio incluido.",
      });
    }

    if (message.method === "notifications/initialized") {
      initialized = true;
      return null;
    }

    if (!initialized) {
      return error(message.id, -32002, "El cliente todavía no inicializó la sesión");
    }

    if (message.method === "tools/list") {
      return result(message.id, { tools: [toolDefinition] });
    }

    if (message.method === "tools/call") {
      try {
        return result(
          message.id,
          callTool(message.params?.name, message.params?.arguments),
        );
      } catch (cause) {
        return result(message.id, {
          content: [{ type: "text", text: cause.message }],
          isError: true,
        });
      }
    }

    return error(message.id, -32601, `Método no disponible: ${message.method}`);
  };
}
