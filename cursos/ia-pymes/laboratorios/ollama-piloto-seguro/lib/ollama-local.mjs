import { isIP } from "node:net";

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "::1"]);

export function normalizeLocalBaseUrl(value = "http://127.0.0.1:11434") {
  let url;
  try {
    url = new URL(value);
  } catch {
    throw new Error("OLLAMA_BASE_URL no es una URL válida.");
  }

  const hostname = url.hostname.replace(/^\[|\]$/g, "");
  const isIpv4Loopback = isIP(hostname) === 4 && hostname.startsWith("127.");
  if (
    url.protocol !== "http:" ||
    (!LOCAL_HOSTS.has(hostname) && !isIpv4Loopback) ||
    url.username ||
    url.password ||
    (url.pathname !== "/" && url.pathname !== "")
  ) {
    throw new Error(
      "Destino bloqueado: este laboratorio solo admite la API HTTP local de Ollama.",
    );
  }

  url.pathname = "";
  url.search = "";
  url.hash = "";
  return url.toString().replace(/\/$/, "");
}

export async function requestJson(baseUrl, pathname, options = {}) {
  const timeoutMs = options.timeoutMs ?? 10_000;
  const response = await fetch(`${baseUrl}${pathname}`, {
    ...options,
    signal: AbortSignal.timeout(timeoutMs),
    headers: {
      "content-type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`Ollama respondió HTTP ${response.status} en ${pathname}.`);
  }
  return response.json();
}

export function modelSizeBytes(tags, modelName) {
  const model = tags.models?.find((item) => item.name === modelName);
  return model?.size ?? null;
}

export function tokensPerSecond(result) {
  if (!result.eval_count || !result.eval_duration) return null;
  return result.eval_count / (result.eval_duration / 1_000_000_000);
}
