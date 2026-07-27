import assert from "node:assert/strict";
import http from "node:http";
import test from "node:test";

import {
  normalizeLocalBaseUrl,
  requestJson,
  tokensPerSecond,
} from "../lib/ollama-local.mjs";

test("acepta loopback y rechaza destinos remotos, credenciales y rutas", () => {
  assert.equal(
    normalizeLocalBaseUrl("http://127.0.0.1:11434"),
    "http://127.0.0.1:11434",
  );
  assert.equal(
    normalizeLocalBaseUrl("http://127.8.9.10:11434"),
    "http://127.8.9.10:11434",
  );
  for (const unsafe of [
    "https://127.0.0.1:11434",
    "http://192.168.1.20:11434",
    "http://example.com:11434",
    "http://usuario:clave@localhost:11434",
    "http://localhost:11434/proxy",
  ]) {
    assert.throws(() => normalizeLocalBaseUrl(unsafe), /Destino bloqueado/);
  }
});

test("calcula tokens por segundo con nanosegundos de la API", () => {
  assert.equal(tokensPerSecond({ eval_count: 20, eval_duration: 2_000_000_000 }), 10);
  assert.equal(tokensPerSecond({ eval_count: 0, eval_duration: 0 }), null);
});

test("consulta una API simulada sin depender de Ollama ni de la red", async (t) => {
  const server = http.createServer((request, response) => {
    response.setHeader("content-type", "application/json");
    if (request.url === "/api/version") {
      response.end(JSON.stringify({ version: "prueba" }));
      return;
    }
    response.statusCode = 404;
    response.end(JSON.stringify({ error: "no encontrado" }));
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  t.after(() => new Promise((resolve) => server.close(resolve)));

  const address = server.address();
  const baseUrl = normalizeLocalBaseUrl(
    `http://127.0.0.1:${address.port}`,
  );
  assert.deepEqual(await requestJson(baseUrl, "/api/version"), {
    version: "prueba",
  });
  await assert.rejects(
    requestJson(baseUrl, "/api/no-existe"),
    /HTTP 404/,
  );
});
