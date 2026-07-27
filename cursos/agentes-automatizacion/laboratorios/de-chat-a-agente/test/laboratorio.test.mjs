import assert from "node:assert/strict";
import test from "node:test";

import { runAgent } from "../lib/agente.mjs";
import { callTool } from "../lib/herramientas.mjs";
import { retrieve } from "../lib/recuperacion.mjs";
import { createProtocolHandler, PROTOCOL_VERSION } from "../mcp/protocolo.mjs";

test("recupera primero la política online y no inventa resultados", () => {
  const results = retrieve("plazo devolución compra online");
  assert.equal(results[0].id, "DEV-01");
  assert.equal(retrieve("astronomía cuántica").length, 0);
});

test("la tool rechaza nombres y argumentos fuera del contrato", () => {
  assert.throws(() => callTool("leer_archivo", {}), /no permitida/);
  assert.throws(
    () => callTool("buscar_politica", { consulta: "ok", extra: true }),
    /Argumentos inválidos/,
  );
});

test("MCP exige inicialización y expone una sola tool de lectura", () => {
  const handle = createProtocolHandler();
  const before = handle({
    jsonrpc: "2.0",
    id: 1,
    method: "tools/list",
    params: {},
  });
  assert.equal(before.error.code, -32002);

  const initialized = handle({
    jsonrpc: "2.0",
    id: 2,
    method: "initialize",
    params: {
      protocolVersion: PROTOCOL_VERSION,
      capabilities: {},
      clientInfo: { name: "test", version: "1" },
    },
  });
  assert.equal(initialized.result.protocolVersion, "2025-11-25");
  handle({ jsonrpc: "2.0", method: "notifications/initialized" });
  const listed = handle({
    jsonrpc: "2.0",
    id: 3,
    method: "tools/list",
    params: {},
  });
  assert.deepEqual(listed.result.tools.map((tool) => tool.name), [
    "buscar_politica",
  ]);
  assert.equal(listed.result.tools[0].annotations.readOnlyHint, true);
});

test("el agente completa con evidencia y una cita permitida", async () => {
  const decisions = [
    {
      accion: "buscar_politica",
      consulta: "plazo devolución compra online",
      respuesta: "",
      citas: [],
    },
    {
      accion: "finalizar",
      consulta: "",
      respuesta: "El plazo es de 30 días naturales desde la entrega.",
      citas: ["DEV-01"],
    },
  ];
  const result = await runAgent({
    objective: "¿Cuál es el plazo?",
    decide: async () => decisions.shift(),
  });
  assert.equal(result.status, "completed");
  assert.deepEqual(result.citations, ["DEV-01"]);
  assert.equal(result.steps, 2);
});

test("el agente corta repetición, citas inventadas y máximo de pasos", async () => {
  await assert.rejects(
    runAgent({
      objective: "¿Cuál es el plazo?",
      decide: async () => ({
        accion: "buscar_politica",
        consulta: "plazo devolución compra online",
        respuesta: "",
        citas: [],
      }),
    }),
    /tool y argumentos repetidos/,
  );

  let call = 0;
  await assert.rejects(
    runAgent({
      objective: "¿Cuál es el plazo?",
      decide: async () =>
        call++ === 0
          ? {
              accion: "buscar_politica",
              consulta: "plazo devolución compra online",
              respuesta: "",
              citas: [],
            }
          : {
              accion: "finalizar",
              consulta: "",
              respuesta: "Inventada",
              citas: ["FAKE-99"],
            },
    }),
    /citas ausentes o inventadas/,
  );

  await assert.rejects(
    runAgent({
      objective: "¿Cuál es el plazo?",
      maxSteps: 1,
      decide: async () => ({
        accion: "buscar_politica",
        consulta: "plazo devolución compra online",
        respuesta: "",
        citas: [],
      }),
    }),
    /máximo de 1 pasos/,
  );
});
