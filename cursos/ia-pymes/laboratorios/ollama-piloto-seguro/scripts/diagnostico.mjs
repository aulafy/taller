#!/usr/bin/env node
import {
  normalizeLocalBaseUrl,
  requestJson,
} from "../lib/ollama-local.mjs";

try {
  const baseUrl = normalizeLocalBaseUrl(process.env.OLLAMA_BASE_URL);
  const [version, tags, running] = await Promise.all([
    requestJson(baseUrl, "/api/version", { timeoutMs: 3_000 }),
    requestJson(baseUrl, "/api/tags", { timeoutMs: 3_000 }),
    requestJson(baseUrl, "/api/ps", { timeoutMs: 3_000 }),
  ]);

  console.log(JSON.stringify({
    estado: "listo",
    api: baseUrl,
    seguridad: "solo loopback; sin destino remoto",
    version: version.version,
    modelos_instalados: (tags.models ?? []).map((model) => ({
      nombre: model.name,
      gigabytes_aproximados: Number((model.size / 1_000_000_000).toFixed(2)),
    })),
    modelos_en_memoria: (running.models ?? []).map((model) => model.name),
  }, null, 2));
} catch (error) {
  console.error(`Diagnóstico fallido: ${error.message}`);
  console.error(
    "Comprueba que Ollama está iniciado y escucha solo en http://127.0.0.1:11434.",
  );
  process.exitCode = 1;
}
