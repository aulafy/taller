import { isIP } from "node:net";

export function localOllamaUrl(value = "http://127.0.0.1:11434") {
  const url = new URL(value);
  const hostname = url.hostname.replace(/^\[|\]$/g, "");
  const loopback =
    hostname === "localhost" ||
    hostname === "::1" ||
    (isIP(hostname) === 4 && hostname.startsWith("127."));
  if (
    url.protocol !== "http:" ||
    !loopback ||
    url.username ||
    url.password ||
    (url.pathname !== "/" && url.pathname !== "")
  ) {
    throw new Error("Solo se permite la API local de Ollama en loopback.");
  }
  return url.origin;
}

export async function generate({
  prompt,
  format,
  model = process.env.OLLAMA_MODEL,
  timeoutMs = 120_000,
}) {
  if (!model) {
    throw new Error(
      "Indica un modelo instalado: OLLAMA_MODEL=nombre:tag npm run etapa:N",
    );
  }
  const baseUrl = localOllamaUrl(process.env.OLLAMA_BASE_URL);
  const response = await fetch(`${baseUrl}/api/generate`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    signal: AbortSignal.timeout(timeoutMs),
    body: JSON.stringify({
      model,
      prompt,
      format,
      stream: false,
      think: false,
      keep_alive: 0,
      options: { temperature: 0, num_predict: 240 },
    }),
  });
  if (!response.ok) throw new Error(`Ollama respondió HTTP ${response.status}.`);
  const result = await response.json();
  return {
    text: result.response?.trim() ?? "",
    model: result.model,
    totalMs: Math.round((result.total_duration ?? 0) / 1_000_000),
  };
}
