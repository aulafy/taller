#!/usr/bin/env node
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const files = [
  "lib/ollama-local.mjs",
  "scripts/diagnostico.mjs",
  "scripts/probar-piloto.mjs",
  "datos/faq-ficticia.json",
];
const text = files
  .map((file) => fs.readFileSync(path.join(root, file), "utf8"))
  .join("\n");

assert.doesNotMatch(text, /sk-[A-Za-z0-9_-]{16,}/, "Posible clave incluida");
assert.doesNotMatch(text, /0\.0\.0\.0:11434/, "No se debe exponer Ollama");
assert.doesNotMatch(text, /https:\/\/ollama\.com\/api/, "La práctica debe ser local");
assert.match(text, /normalizeLocalBaseUrl/, "Falta el control de destino local");

console.log("✓ Auditoría: datos sintéticos, sin claves y API limitada a loopback.");
