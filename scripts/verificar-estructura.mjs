import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const requiredRootFiles = [
  "README.md",
  "AGENTS.md",
  "CONTRIBUTING.md",
  "SECURITY.md",
  "LICENSE",
  "catalogo.json",
  "docs/estandar-ejemplos.md",
];

for (const file of requiredRootFiles) {
  assert.ok(fs.existsSync(path.join(root, file)), `Falta el archivo raíz ${file}`);
}

const license = fs.readFileSync(path.join(root, "LICENSE"), "utf8");
assert.match(license, /^MIT License/m, "La licencia raíz debe ser MIT");

const catalog = JSON.parse(fs.readFileSync(path.join(root, "catalogo.json"), "utf8"));
assert.equal(catalog.version, 1, "Versión de catálogo no compatible");
assert.match(catalog.updated, /^\d{4}-\d{2}-\d{2}$/, "Fecha del catálogo inválida");
assert.ok(Array.isArray(catalog.examples), "examples debe ser una lista");

const ids = new Set();
for (const example of catalog.examples) {
  assert.match(example.id, /^[a-z0-9-]+$/, `ID inválido: ${example.id}`);
  assert.ok(!ids.has(example.id), `ID duplicado: ${example.id}`);
  ids.add(example.id);

  const examplePath = path.join(root, example.path);
  assert.ok(fs.existsSync(examplePath), `No existe ${example.path}`);
  for (const file of ["README.md", "AGENTS.md", "docs/BRIEF.md", "docs/PRUEBAS.md", "docs/VERIFICADO.md"]) {
    assert.ok(fs.existsSync(path.join(examplePath, file)), `Falta ${example.path}/${file}`);
  }
  assert.ok(["caso", "ejemplo", "laboratorio"].includes(example.kind), `Tipo inválido: ${example.id}`);
  assert.ok(["borrador", "verificado", "archivado"].includes(example.status), `Estado inválido: ${example.id}`);
  if (example.status === "verificado") {
    assert.match(example.verified ?? "", /^\d{4}-\d{2}-\d{2}$/, `Falta fecha de verificación: ${example.id}`);
  }
}

console.log(`Estructura verificada: ${catalog.examples.length} ejemplos registrados.`);
