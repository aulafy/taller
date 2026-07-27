#!/usr/bin/env node
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const executable = [
  "lib/agente.mjs",
  "lib/herramientas.mjs",
  "lib/ollama-local.mjs",
  "mcp/protocolo.mjs",
  "mcp/servidor.mjs",
].map((file) => fs.readFileSync(path.join(root, file), "utf8")).join("\n");

assert.doesNotMatch(executable, /0\.0\.0\.0|https:\/\/ollama\.com\/api/);
assert.doesNotMatch(executable, /child_process.*exec|rm\s+-rf|writeFile|unlink/);
assert.match(executable, /maxSteps = 3/);
assert.match(executable, /Bucle detenido/);
assert.match(executable, /citas ausentes o inventadas/);
assert.match(executable, /readOnlyHint: true/);

console.log(
  "✓ Auditoría: loop acotado, tool de lectura, citas validadas y Ollama en loopback.",
);
