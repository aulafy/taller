#!/usr/bin/env node
import fs from "node:fs/promises";

import {
  modelSizeBytes,
  normalizeLocalBaseUrl,
  requestJson,
  tokensPerSecond,
} from "../lib/ollama-local.mjs";

try {
  const baseUrl = normalizeLocalBaseUrl(process.env.OLLAMA_BASE_URL);
  const model = process.env.OLLAMA_MODEL?.trim();
  if (!model) {
    throw new Error(
      "Indica un modelo ya instalado: OLLAMA_MODEL=nombre:tag npm run probar",
    );
  }

  const fixtureUrl = new URL("../datos/faq-ficticia.json", import.meta.url);
  const fixture = JSON.parse(await fs.readFile(fixtureUrl, "utf8"));
  const tags = await requestJson(baseUrl, "/api/tags", { timeoutMs: 3_000 });
  if (!(tags.models ?? []).some((item) => item.name === model)) {
    throw new Error(
      `El modelo ${model} no está instalado. Revisa "ollama list" y su licencia antes de descargarlo.`,
    );
  }

  const prompt = [
    "Responde usando únicamente los hechos autorizados.",
    "Si la respuesta no aparece, responde exactamente: No consta.",
    `Hechos: ${fixture.hechos_autorizados.join(" ")}`,
    `Pregunta: ${fixture.pregunta}`,
  ].join("\n");
  const startedAt = performance.now();
  const result = await requestJson(baseUrl, "/api/generate", {
    method: "POST",
    timeoutMs: 120_000,
    body: JSON.stringify({
      model,
      prompt,
      stream: false,
      think: false,
      keep_alive: 0,
      options: {
        temperature: 0,
        num_predict: 80,
      },
    }),
  });
  const wallMs = performance.now() - startedAt;
  const speed = tokensPerSecond(result);

  console.log(JSON.stringify({
    estado: result.done ? "completado" : "incompleto",
    empresa: fixture.empresa,
    datos: "sintéticos",
    api: baseUrl,
    model,
    modelo_gb_aproximados:
      modelSizeBytes(tags, model) === null
        ? null
        : Number((modelSizeBytes(tags, model) / 1_000_000_000).toFixed(2)),
    respuesta: result.response?.trim(),
    respuesta_esperada: fixture.respuesta_esperada,
    coincide: result.response?.trim() === fixture.respuesta_esperada,
    tiempo_total_ms: Math.round(wallMs),
    tiempo_carga_ms: Math.round((result.load_duration ?? 0) / 1_000_000),
    tokens_salida: result.eval_count ?? null,
    tokens_por_segundo: speed === null ? null : Number(speed.toFixed(2)),
    aviso:
      "Una respuesta correcta no demuestra calidad general. Repite con una batería autorizada antes de usar el modelo.",
  }, null, 2));
} catch (error) {
  console.error(`Prueba fallida: ${error.message}`);
  process.exitCode = 1;
}
