import { renderEvidence, retrieve } from "./recuperacion.mjs";

export const toolDefinition = {
  name: "buscar_politica",
  title: "Buscar en políticas ficticias",
  description:
    "Busca fragmentos de solo lectura en las políticas ficticias de Tienda Brújula. Devuelve IDs citables.",
  inputSchema: {
    type: "object",
    properties: {
      consulta: {
        type: "string",
        minLength: 3,
        maxLength: 200,
        description: "Pregunta breve que se desea localizar.",
      },
    },
    required: ["consulta"],
    additionalProperties: false,
  },
  outputSchema: {
    type: "object",
    properties: {
      resultados: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string" },
            titulo: { type: "string" },
            texto: { type: "string" },
          },
          required: ["id", "titulo", "texto"],
          additionalProperties: false,
        },
      },
    },
    required: ["resultados"],
    additionalProperties: false,
  },
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  },
};

export function callTool(name, args) {
  if (name !== toolDefinition.name) {
    throw new Error(`Tool no permitida: ${name}`);
  }
  const keys = Object.keys(args ?? {});
  if (
    keys.length !== 1 ||
    keys[0] !== "consulta" ||
    typeof args.consulta !== "string" ||
    args.consulta.length > 200
  ) {
    throw new Error("Argumentos inválidos para buscar_politica.");
  }
  const results = retrieve(args.consulta).map(({ score: _score, ...item }) => item);
  const structuredContent = { resultados: results };
  return {
    content: [
      {
        type: "text",
        text: renderEvidence(results) || "No se encontró evidencia.",
      },
    ],
    structuredContent,
    isError: false,
  };
}
